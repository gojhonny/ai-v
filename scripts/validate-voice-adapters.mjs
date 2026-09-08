import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const study=new URL('../research/003-typescript-voice-adapters/',import.meta.url);
const sources=JSON.parse(await readFile(new URL('data/sources.json',study),'utf8'));
const cohort=JSON.parse(await readFile(new URL('data/cohort.json',study),'utf8'));
assert.equal(cohort.research_date,'2026-09-08');
assert.equal(cohort.models.length,10);
assert.deepEqual(cohort.models.map(m=>m.cohort_rank),[1,2,3,4,5,6,7,8,9,10]);
assert.equal(cohort.models[3].api_status,'partial-unverified');
assert.equal(cohort.models[3].model_id,null);
assert.equal(new Set(sources.map(s=>s.id)).size,sources.length);
assert.equal(new Set(sources.map(s=>s.url)).size,sources.length);
const urls=new Set(sources.map(s=>s.url));
for(const s of sources) {
  assert.equal(s.accessed_on,cohort.research_date);
  assert.equal(new URL(s.url).protocol,'https:');
  for(const key of ['title','publisher','source_date','claim_family']) assert(s[key]?.length);
}
for(const file of ['README.md','providers.md','sources.md','integrations/README.md']) {
  const content=await readFile(new URL(file,study),'utf8');
  assert(content.includes(cohort.research_date),`${file}: date missing`);
  for(const match of content.matchAll(/\]\((https:\/\/[^\s)]+)\)/g))
    assert(urls.has(match[1]),`${file}: unregistered source ${match[1]}`);
}
assert(Number(process.versions.node.split('.')[0])>=24,'Study 003 checks require Node.js 24 or newer');
const tests=['contracts.test.mjs','browser.test.mjs'].map(file=>fileURLToPath(new URL(`integrations/test/${file}`,study)));
const result=spawnSync(process.execPath,['--test',...tests],{encoding:'utf8'});
assert.equal(result.status,0,`${result.stdout}\n${result.stderr}`);
console.log(`PASS: Study 003; ${sources.length} dated sources; ten-model cohort; offline adapter and playback lifecycle tests.`);
console.log('TypeScript strict checking is separate: npm ci --ignore-scripts && npm run check in Study 003 integrations.');
