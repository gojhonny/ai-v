import { mkdir, lstat, open, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const usage = 'Usage: node scripts/new-spec.mjs "Descriptive English title"';

function parseTitle(args) {
  if (args.length !== 1) throw new Error(usage);
  if (/[\u0000-\u001f\u007f]/.test(args[0])) {
    throw new Error('Control characters are not allowed in a spec title.');
  }
  const title = args[0].trim();
  if (title.length < 3 || title.length > 120 || !/[A-Za-z]/.test(title)
    || !/^[A-Za-z0-9][A-Za-z0-9 ,:;()&+?!.'-]*$/.test(title)
    || title.includes('..')) {
    throw new Error('Use a 3–120 character English title; paths, control characters, Markdown markup, and ".." are not allowed.');
  }
  return title.replace(/ +/g, ' ');
}

async function createSpec(args) {
  const title = parseTitle(args);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 80).replace(/-$/g, '');
  const directory = join(root, 'specs');
  const template = await readFile(join(root, 'templates', 'spec-template.md'), 'utf8');
  for (const token of ['{{SPEC_ID}}', '{{SPEC_TITLE}}', '{{CREATED_DATE}}']) {
    if (!template.includes(token)) throw new Error(`Spec template is missing ${token}.`);
  }
  await mkdir(directory, { recursive: true });
  const directoryInfo = await lstat(directory);
  if (!directoryInfo.isDirectory() || directoryInfo.isSymbolicLink()) {
    throw new Error('The specs destination must be a regular repository directory.');
  }

  // Lock the sequence, not just the filename: different titles must not reuse an ID.
  const lockPath = join(directory, '.spec-allocation.lock');
  let lock;
  try {
    lock = await open(lockPath, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error('Spec allocation is locked. Retry after the other allocator finishes; inspect a stale lock before removing it.');
    }
    throw error;
  }
  try {
    await lock.writeFile(`${process.pid}\n`);
    const entries = await readdir(directory);
    const numbers = entries.map(name => /^(\d{3})(?:-|$)/.exec(name))
      .filter(Boolean).map(match => Number(match[1]));
    const next = Math.max(0, ...numbers) + 1;
    if (next > 999) throw new Error('Spec IDs are exhausted; no file was created.');
    const id = String(next).padStart(3, '0');
    const filename = `${id}-${slug}.md`;
    const body = template.replaceAll('{{SPEC_ID}}', id)
      .replaceAll('{{SPEC_TITLE}}', title)
      .replaceAll('{{CREATED_DATE}}', new Date().toISOString().slice(0, 10));
    await writeFile(join(directory, filename), body, { flag: 'wx' });
    console.log(`Created specs/${filename}`);
    console.log('Fill in the Draft, add it to specs/README.md, and update active state when appropriate.');
  } finally {
    await lock.close();
    await unlink(lockPath);
  }
}

if (process.argv.length === 3 && ['--help', '-h'].includes(process.argv[2])) {
  console.log(usage);
} else {
  try {
    await createSpec(process.argv.slice(2));
  } catch (error) {
    console.error(`new-spec: ${error.message}`);
    process.exitCode = 1;
  }
}
