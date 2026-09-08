import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { data, estimate, ranked, replaceTables, workload } from './rank.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const files = [];
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const text = file => readFile(path.join(root, file), 'utf8');

async function walk(directory = '') {
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const relative = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) { failures.push(`Unexpected symlink: ${relative}`); continue; }
    if (entry.isDirectory()) await walk(relative); else files.push(relative);
  }
}
await walk();

function prose(source) {
  let fence = null;
  const lines = [];
  for (const line of source.split('\n')) {
    const match = line.match(/^\s*(`{3,}|~{3,})/);
    if (match) {
      if (!fence) fence = match[1];
      else if (match[1][0] === fence[0] && match[1].length >= fence.length) fence = null;
      lines.push('');
    } else lines.push(fence ? '' : line);
  }
  return { content: lines.join('\n'), closed: fence === null };
}

function anchors(source) {
  const result = new Set();
  const counts = new Map();
  for (const match of prose(source).content.matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const base = match[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/<[^>]*>/g, '').toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    result.add(count ? `${base}-${count}` : base);
  }
  for (const match of source.matchAll(/<a\s+id="([^"]+)"/g)) result.add(match[1]);
  return result;
}

const markdown = new Map();
for (const file of files.filter(file => file.endsWith('.md'))) markdown.set(file, await text(file));
let internalLinks = 0;
for (const [file, source] of markdown) {
  const { content, closed } = prose(source);
  check(source.trimStart().startsWith('# '), `${file}: missing leading H1`);
  check((content.match(/^# /gm) ?? []).length === 1, `${file}: expected exactly one H1`);
  check(closed, `${file}: unclosed code fence`);
  let tableColumns = null;
  for (const line of content.split('\n')) {
    if (line.startsWith('|') && line.trimEnd().endsWith('|')) {
      const columns = line.split(/(?<!\\)\|/).length - 2;
      if (tableColumns === null) tableColumns = columns;
      check(columns === tableColumns, `${file}: inconsistent table column count`);
    } else tableColumns = null;
  }
  for (const match of content.matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1];
    if (/^https:\/\//.test(target)) { try { new URL(target); } catch { failures.push(`${file}: invalid URL`); } continue; }
    if (/^[a-z]+:/i.test(target)) { failures.push(`${file}: unsupported link scheme ${target}`); continue; }
    const [relative, fragment] = target.split('#');
    const resolved = path.resolve(path.dirname(path.join(root, file)), decodeURIComponent(relative || path.basename(file)));
    if (!resolved.startsWith(root)) { failures.push(`${file}: link escapes project`); continue; }
    const destination = path.relative(root, resolved);
    try { await stat(resolved); } catch { failures.push(`${file}: missing link ${target}`); continue; }
    internalLinks++;
    if (fragment && markdown.has(destination)) {
      check(anchors(markdown.get(destination)).has(decodeURIComponent(fragment)), `${file}: missing anchor ${target}`);
    }
  }
}

for (const file of files.filter(file => file.endsWith('.json'))) {
  try { JSON.parse(await text(file)); } catch { failures.push(`${file}: invalid JSON`); }
}

const validDate = date => /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().startsWith(date);
check(validDate(data.evidence_checked), 'Invalid research date');
const records = JSON.parse(await text('research/001-cost-vs-naturalness/data/sources.json'));
const urls = new Set(records.map(record => record.url));
check(new Set(records.map(record => record.id)).size === records.length, 'Duplicate source IDs');
check(urls.size === records.length, 'Duplicate source URLs');
for (const record of records) {
  check(validDate(record.accessed_on) && record.accessed_on === data.evidence_checked, `${record.id}: inconsistent access date`);
  check(['publisher', 'title', 'claim_family', 'source_class'].every(key => typeof record[key] === 'string' && record[key].length), `${record.id}: incomplete attribution`);
  check(record.url.startsWith('https://'), `${record.id}: source must use HTTPS`);
}

check(urls.has(data.benchmark_source), 'Missing benchmark source in register');
check(new Set(data.models.map(model => model.id)).size === data.models.length, 'Duplicate model IDs');
const kinds = new Set(['chars', 'nonspace_chars', 'utf8_bytes', 'soniox_tokens', 'google_tokens', null]);
for (const model of data.models) {
  check(Number.isFinite(model.elo) && model.ci95_plus_minus >= 0, `${model.id}: invalid preference data`);
  check(kinds.has(model.billing_kind), `${model.id}: invalid billing kind`);
  check(urls.has(model.documentation) && urls.has(model.pricing_source), `${model.id}: source missing from register`);
  if (['chars', 'nonspace_chars', 'utf8_bytes'].includes(model.billing_kind)) check(model.usd_per_million > 0, `${model.id}: invalid unit rate`);
  const cost = estimate(model);
  if (cost) check(cost.speech > 0 && cost.total >= cost.speech, `${model.id}: invalid cost result`);
}
check(data.scoring.cost_weight >= 0 && data.scoring.cost_weight <= 1, 'Invalid cost weight');
check(data.scoring.cost_best_usd > 0 && data.scoring.cost_worst_usd > data.scoring.cost_best_usd, 'Invalid cost anchors');
check(data.scoring.elo_high_anchor > data.scoring.elo_low_anchor, 'Invalid Elo anchors');
check(ranked().every(row => row.score >= 0 && row.score <= 10), 'Score outside expected range');
check(workload.characters > 0, 'Empty workload fixture');
const studyPath = 'research/001-cost-vs-naturalness/README.md';
const study = await text(studyPath);
check(study.includes(data.evidence_checked), 'Study research date is missing');
check(replaceTables(study) === study, 'Derived tables are stale: run node scripts/rank.mjs --write');

const project = JSON.parse(await text('.agents/state/project.json'));
const activeSpec = await text(project.active_spec);
check(project.workflow.includes(project.status), 'Unknown project workflow status');
check(activeSpec.includes(`**Status:** ${project.status}`), 'Active spec and state disagree');
check((await text('specs/README.md')).includes(`| ${project.status} |`), 'Spec index and state disagree');
check(files.includes(project.verification.evidence), 'Missing verification evidence file');
if (project.status === 'Done') {
  check(!activeSpec.includes('- [ ]'), 'Done spec has unchecked acceptance criteria');
  check(project.verification.status === 'Passed', 'Done project requires Passed verification');
}

let syntaxChecks = 0;
for (const file of files.filter(file => file.endsWith('.mjs'))) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  check(result.status === 0, `${file}: JavaScript syntax failed\n${result.stderr}`);
  syntaxChecks++;
}

const memoryCheck = spawnSync(process.execPath, [path.join(root, 'scripts/validate-memory-cost.mjs')], { encoding: 'utf8' });
check(memoryCheck.status === 0, `Study 002 validation failed\n${memoryCheck.stderr}`);
if (memoryCheck.status === 0) process.stdout.write(memoryCheck.stdout);

assert.equal(failures.length, 0, failures.join('\n'));
console.log(`PASS: ${files.length} files; ${markdown.size} titled Markdown documents; ${internalLinks} internal links; ${records.length} sources; ${data.models.length} TTS entries; ${syntaxChecks} JavaScript syntax checks.`);
console.log('PASS: derived tables, billing inputs, research dates, source register and harness state are consistent.');
console.log('Scope: offline structural/syntax validation only; no live provider calls or remote CI execution.');
