// Offline arithmetic model. All fixture prices and workloads are hypothetical.
import assert from 'node:assert/strict';

const nonnegative = (v, key) => assert(Number.isFinite(v) && v >= 0, `${key} must be finite and nonnegative`);
const usd = value => (Math.round(value * 1e4 + 1e-8) / 1e4).toFixed(4);
const fraction = (v, key) => { nonnegative(v, key); assert(v <= 1, `${key} must be <= 1`); };

export function validateScenario(s) {
  assert(typeof s.name === 'string' && s.name.length > 0, 'name is required');
  for (const k of ['turns', 'input_tokens', 'output_tokens', 'cacheable_tokens', 'input_usd_per_million', 'output_usd_per_million', 'small_input_usd_per_million', 'small_output_usd_per_million', 'cache_read_multiplier', 'cache_write_multiplier', 'admission_usd_per_turn', 'exact_lookup_usd', 'retrieval_usd', 'router_usd', 'background_usd', 'infrastructure_usd', 'speech_usd']) nonnegative(s[k], k);
  for (const k of ['bypass_fraction', 'exact_hit_fraction', 'small_model_fraction', 'prefix_read_fraction', 'prefix_write_fraction']) fraction(s[k], k);
  assert(Number.isInteger(s.turns) && s.turns > 0, 'turns must be a positive integer');
  for (const k of ['input_tokens', 'output_tokens', 'cacheable_tokens']) assert(Number.isInteger(s[k]), `${k} must be an integer`);
  assert(s.cacheable_tokens <= s.input_tokens, 'cacheable tokens exceed total input');
  assert(s.prefix_read_fraction + s.prefix_write_fraction <= 1, 'cache read/write fractions overlap');
  assert(s.exact_lookup_usd > 0 || s.exact_hit_fraction === 0, 'exact hits require an explicit nonzero lookup cost');
  assert(s.router_usd > 0 || s.small_model_fraction === 0, 'learned routing requires an explicit nonzero router cost');
}

export function calculate(s) {
  validateScenario(s);
  const afterBypass = s.turns * (1 - s.bypass_fraction);
  // Hits are conditional on passing the bypass gate. Never add the two rates.
  const generationCalls = afterBypass * (1 - s.exact_hit_fraction);
  const prefixWeight = s.prefix_read_fraction * s.cache_read_multiplier
    + s.prefix_write_fraction * s.cache_write_multiplier
    + (1 - s.prefix_read_fraction - s.prefix_write_fraction);
  const weightedInput = s.input_tokens - s.cacheable_tokens + s.cacheable_tokens * prefixWeight;
  const fullCall = (weightedInput * s.input_usd_per_million + s.output_tokens * s.output_usd_per_million) / 1e6;
  const smallCall = (weightedInput * s.small_input_usd_per_million + s.output_tokens * s.small_output_usd_per_million) / 1e6;
  const generation = generationCalls * ((1 - s.small_model_fraction) * fullCall + s.small_model_fraction * smallCall);
  const components = {
    generation,
    admission: s.turns * s.admission_usd_per_turn,
    exact_lookup: afterBypass * s.exact_lookup_usd,
    retrieval: generationCalls * s.retrieval_usd,
    routing: generationCalls * s.router_usd,
    background: s.background_usd,
    infrastructure: s.infrastructure_usd
  };
  const nonSpeech = Object.values(components).reduce((a, b) => a + b, 0);
  return { name: s.name, generation_calls: generationCalls, components, non_speech_usd: nonSpeech, speech_usd: s.speech_usd, total_usd: nonSpeech + s.speech_usd };
}

export function renderTable(scenarios) {
  const results = scenarios.map(calculate);
  const base = results[0];
  assert(base.non_speech_usd > 0 && base.total_usd > 0, 'baseline costs must be positive');
  return [
    '| Hypothetical scenario | Generation calls | Non-speech cost (USD) | Total with fixed speech (USD) | Non-speech saving | Total saving |',
    '| --- | --- | --- | --- | --- | --- |',
    ...results.map(r => `| ${r.name} | ${r.generation_calls.toFixed(0)} | ${usd(r.non_speech_usd)} | ${usd(r.total_usd)} | ${((1 - r.non_speech_usd / base.non_speech_usd) * 100).toFixed(1)}% | ${((1 - r.total_usd / base.total_usd) * 100).toFixed(1)}% |`)
  ].join('\n');
}
