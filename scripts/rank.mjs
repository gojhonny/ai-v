import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const study = new URL('../research/001-cost-vs-naturalness/', import.meta.url);
export const data = JSON.parse(await readFile(new URL('data/models.json', study), 'utf8'));
const sample = (await readFile(new URL(`data/${data.scenario.sample_file}`, study), 'utf8')).trimEnd();
export const workload = {
  characters: [...sample].length,
  nonspaceCharacters: [...sample.replace(/\s/gu, '')].length,
  bytes: Buffer.byteLength(sample, 'utf8'),
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function estimate(model, scenario = data.scenario) {
  let speech;
  switch (model.billing_kind) {
    case 'chars': speech = workload.characters * model.usd_per_million / 1e6; break;
    case 'nonspace_chars': speech = workload.nonspaceCharacters * model.usd_per_million / 1e6; break;
    case 'utf8_bytes': speech = workload.bytes * model.usd_per_million / 1e6; break;
    case 'soniox_tokens':
      speech = (workload.characters * scenario.soniox_text_tokens_per_character * scenario.soniox_text_usd_per_million
        + scenario.output_audio_seconds / 3600 * scenario.soniox_audio_tokens_per_hour * scenario.soniox_audio_usd_per_million) / 1e6;
      break;
    case 'google_tokens':
      speech = (workload.characters * scenario.google_input_tokens_per_character_assumption * scenario.google_text_usd_per_million
        + scenario.output_audio_seconds * scenario.google_audio_tokens_per_second * scenario.google_audio_usd_per_million) / 1e6;
      break;
    default: return null;
  }
  return { speech, total: speech + scenario.pipeline_stt_budget_usd + scenario.pipeline_llm_budget_usd };
}

export function score(model, total, costWeight = data.scoring.cost_weight, elo = model.elo) {
  const s = data.scoring;
  const naturalness = 10 * clamp((elo - s.elo_low_anchor) / (s.elo_high_anchor - s.elo_low_anchor), 0, 1);
  const cost = 10 * clamp(Math.log(s.cost_worst_usd / total) / Math.log(s.cost_worst_usd / s.cost_best_usd), 0, 1);
  return costWeight * cost + (1 - costWeight) * naturalness;
}

export function ranked(costWeight = data.scoring.cost_weight) {
  return data.models.flatMap(model => {
    const cost = estimate(model);
    return cost ? [{ ...model, ...cost, score: score(model, cost.total, costWeight) }] : [];
  }).sort((a, b) => b.score - a.score || a.total - b.total || a.id.localeCompare(b.id));
}

export function tables() {
  const cost = [
    '| Rank | Voice option | Provider | Score / 10 | Speech output | Pipeline scenario | Rate basis |',
    '| --- | --- | --- | ---: | ---: | ---: | --- |',
    ...ranked().map((m, i) => `| ${i + 1} | [${m.name}](providers.md#${m.profile_anchor}) | ${m.provider} | ${m.score.toFixed(1)} | $${m.speech.toFixed(5)} | $${m.total.toFixed(5)} | [${m.rate_basis}](${m.pricing_source}) |`),
  ].join('\n');
  const naturalness = [
    '| Priority | Model | Provider | Preference Elo | 95% interval | Portuguese |',
    '| --- | --- | --- | ---: | ---: | --- |',
    ...[...data.models].sort((a,b) => b.elo-a.elo).map((m,i) => `| ${i+1} | [${m.name}](providers.md#${m.profile_anchor}) | ${m.provider} | ${m.elo} | ±${m.ci95_plus_minus} | ${m.portuguese} |`),
  ].join('\n');
  const native = [
    '| Native model | Fresh-audio estimate | Scope |',
    '| --- | ---: | --- |',
    ...data.native_audio.map(m => {
      const amount = (data.scenario.input_audio_seconds * m.input_tokens_per_second * m.input_usd_per_million
        + data.scenario.output_audio_seconds * m.output_tokens_per_second * m.output_usd_per_million) / 1e6;
      return `| [${m.name}](${m.pricing_source}) | $${amount.toFixed(4)} | ${m.note} |`;
    }),
  ].join('\n');
  return { cost, naturalness, native };
}

export function replaceTables(markdown) {
  for (const [key, table] of Object.entries(tables())) {
    const pattern = new RegExp(`<!-- ${key}:start -->[\\s\\S]*?<!-- ${key}:end -->`);
    if (!pattern.test(markdown)) throw new Error(`Missing ${key} table markers`);
    markdown = markdown.replace(pattern, `<!-- ${key}:start -->\n${table}\n<!-- ${key}:end -->`);
  }
  return markdown;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--write')) {
    const target = new URL('README.md', study);
    await writeFile(target, replaceTables(await readFile(target, 'utf8')));
    console.log('Updated study tables from structured data.');
  } else {
    console.log(tables().cost);
    console.log('\nSensitivity: leaders under alternative cost weights');
    for (const weight of [0.4, 0.6, 0.8]) {
      console.log(`${Math.round(weight*100)}% cost: ${ranked(weight).slice(0, 3).map(m=>m.name).join(', ')}`);
    }
  }
}
