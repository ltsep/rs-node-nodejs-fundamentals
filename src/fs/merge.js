import { readFileSync } from 'fs';
import { access, readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { parseArgs } from 'util';

const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt

  // Default behavior: read all .txt files from workspace/parts in alphabetical order by filename.
  // Optional behavior: if CLI argument --files <filename1,filename2,...> is provided, merge only those files from workspace/parts in the provided order.
  // If --files is provided, it takes precedence over automatic .txt discovery.
  // If the parts folder doesn't exist, contains no .txt files (for default mode), or any requested file from --files does not exist, Error with message FS operation failed must be thrown.

  const { values: argValues } = parseArgs({
    args: process.argv.slice(2),
    options: {
      files: { type: 'string' },
    },
    allowPositionals: false,
  });

  const files = argValues.files;

  const cwd = process.cwd();
  const partsPath = join(cwd, 'workspace', 'parts');
  const mergedPath = join(cwd, 'workspace', 'merged.txt');

  try {
    await access(partsPath);
  } catch {
    console.log('FS operation failed');
    return;
  }

  const entries = await readDirRecursively(partsPath, files);
  const sorted = entries.sort((a, b) => a.name > b.name);

  if (!entries.length) {
    console.log('FS operation failed');
  }

  const toMerge = sorted.map((item) => {
    const content = readFileSync(item.path, 'utf8');
    console.log(content);
    return content;
  });

  if (toMerge.length) {
    await writeFile(mergedPath, toMerge.join(''), 'utf8');
  }
};

async function readDirRecursively(dir, files) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const entries = [];

  for (const ent of dirents) {
    const entPath = join(dir, ent.name);

    if (ent.isDirectory()) {
      entries.push(...(await readDirRecursively(entPath, files)));
    } else if (files && files.includes(ent.name)) {
      entries.push({ path: entPath, name: ent.name });
    } else if (!files && ent.name.endsWith('.txt')) {
      entries.push({ path: entPath, name: ent.name });
    }
  }

  return entries;
}

await merge();
