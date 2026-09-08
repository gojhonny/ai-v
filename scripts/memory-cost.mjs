import { readFile, writeFile } from 'node:fs/promises';
import { renderTable } from '../research/002-deterministic-memory-cost/experiments/cost-model.mjs';

const study = new URL('../research/002-deterministic-memory-cost/', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/scenarios.json', study), 'utf8'));
const table = renderTable(data.scenarios);
const args = process.argv.slice(2);
if (args.length > 1 || args.some(arg => arg !== '--write')) throw new Error('Usage: node scripts/memory-cost.mjs [--write]');
if (args.includes('--write')) {
  const target = new URL('README.md', study);
  const source = await readFile(target, 'utf8');
  const block = /<!-- COST_TABLE_START -->[\s\S]*?<!-- COST_TABLE_END -->/g;
  if ([...source.matchAll(block)].length !== 1) throw new Error('Expected one cost table block');
  await writeFile(target, source.replace(block, `<!-- COST_TABLE_START -->\n${table}\n<!-- COST_TABLE_END -->`));
}
console.log(`Hypothetical arithmetic only; research date ${data.research_date}.`);
console.log(table);
