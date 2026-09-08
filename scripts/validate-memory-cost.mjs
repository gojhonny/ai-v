import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculate, renderTable, validateScenario } from '../research/002-deterministic-memory-cost/experiments/cost-model.mjs';

const study = new URL('../research/002-deterministic-memory-cost/', import.meta.url);
const fixture = JSON.parse(await readFile(new URL('data/scenarios.json', study), 'utf8'));
const sources = JSON.parse(await readFile(new URL('data/sources.json', study), 'utf8'));
const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().startsWith(value);
assert(date(fixture.research_date), 'Invalid study date');
assert.equal(fixture.evidence_class, 'hypothetical_arithmetic');
assert.equal(fixture.currency, 'USD');
assert.equal(fixture.baseline, fixture.scenarios[0].name);
assert.equal(new Set(fixture.scenarios.map(s => s.name)).size, fixture.scenarios.length);
for (const s of fixture.scenarios) validateScenario(s);
assert.equal(new Set(sources.map(s => s.id)).size, sources.length);
assert.equal(new Set(sources.map(s => s.url)).size, sources.length);
const registered = new Set(sources.map(s => s.url));
for (const s of sources) {
  for (const field of ['id', 'title', 'publisher', 'source_date', 'source_class']) assert(typeof s[field] === 'string' && s[field].length, `${s.id}: missing ${field}`);
  assert.equal(s.accessed_on, fixture.research_date);
  assert.equal(new URL(s.url).protocol, 'https:');
}
for (const file of ['README.md', 'sources.md', 'evaluation.md']) {
  const content = await readFile(new URL(file, study), 'utf8');
  assert(content.includes(fixture.research_date), `${file}: research date missing`);
  for (const match of content.matchAll(/\]\((https:\/\/[^\s)]+)\)/g)) assert(registered.has(match[1]), `${file}: citation missing from source register: ${match[1]}`);
}
const readme = await readFile(new URL('README.md', study), 'utf8');
const block = readme.match(/<!-- COST_TABLE_START -->\n([\s\S]*?)\n<!-- COST_TABLE_END -->/);
assert(block, 'Cost table markers missing');
assert.equal(block[1], renderTable(fixture.scenarios), 'Stale cost table: node scripts/memory-cost.mjs --write');

// Independent hand-calculated accounting checks on the published fixture.
const close = (actual, expected) => assert(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
const result = fixture.scenarios.map(calculate);
close(result[0].non_speech_usd, 9.6); // 4M input at $2/M plus 0.2M output at $8/M.
close(result[1].non_speech_usd, 4.89); // Reads + writes + dynamic input + output.
close(result[2].non_speech_usd, 4.85);
close(result[3].generation_calls, 765); // 1000 * .85 * .90, not 750.
close(result[3].non_speech_usd, 3.89175);
close(result[4].non_speech_usd, 2.39235);
close(result[5].non_speech_usd, 12.25);
assert(result[5].total_usd > result[0].total_usd, 'Unfavorable case must remain unfavorable');

// Limit cases detect silent free-work assumptions and overlapping discounts.
const base = fixture.scenarios[0];
const bypass = calculate({ ...fixture.scenarios[3], bypass_fraction: 1 });
close(bypass.generation_calls, 0);
close(bypass.non_speech_usd, 0.7); // Admission + background + infrastructure survive bypass.
close(bypass.speech_usd, 11);
const readOnly = calculate({ ...base, cacheable_tokens: base.input_tokens, prefix_read_fraction: 1 });
close(readOnly.non_speech_usd, 2.4); // Output still costs $1.60.
const writeOnly = calculate({ ...base, cacheable_tokens: base.input_tokens, prefix_write_fraction: 1 });
close(writeOnly.non_speech_usd, 11.6); // No reuse can make writing more expensive.
const noSpeech = calculate({ ...base, speech_usd: 0 });
close(noSpeech.total_usd, noSpeech.non_speech_usd);
for (const patch of [
  { bypass_fraction: 1.1 }, { exact_hit_fraction: -0.1 }, { turns: 0 },
  { input_tokens: Infinity }, { output_tokens: NaN }, { turns: 1.5 },
  { cacheable_tokens: 4001 }, { prefix_read_fraction: 0.9, prefix_write_fraction: 0.2 },
  { exact_hit_fraction: 0.1, exact_lookup_usd: 0 }, { small_model_fraction: 0.5, router_usd: 0 }
]) assert.throws(() => calculate({ ...base, ...patch }));
console.log(`PASS: Study 002; ${sources.length} dated sources; six reproduced scenarios; conditional hits, cache writes, surviving costs and invalid inputs checked.`);
