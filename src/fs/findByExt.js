import { access, readdir } from 'fs/promises';
import { join, relative } from 'path';
import { parseArgs } from 'util';

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)

  const { values: argValues } = parseArgs({
    args: process.argv.slice(2),
    options: {
      ext: { type: 'string' },
    },
    allowPositionals: false,
  });

  const ext = argValues.ext || '.txt';

  const cwd = process.cwd();
  const workspacePath = join(cwd, 'workspace');

  try {
    await access(workspacePath);
  } catch {
    console.log('FS operation failed');
    return;
  }

  const entries = await readDirRecursively(workspacePath, ext, workspacePath);
  const sorted = entries.sort();

  sorted.forEach((item) => {
    console.log(item);
  });
};

async function readDirRecursively(dir, ext, relativeTo) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const entries = [];

  for (const ent of dirents) {
    const entPath = join(dir, ent.name);
    const relativePath = relative(relativeTo, entPath);

    if (ent.isDirectory()) {
      entries.push(...(await readDirRecursively(entPath, ext, relativeTo)));
    } else if (ent.name.includes(ext)) {
      entries.push(relativePath);
    }
  }

  return entries;
}

await findByExt();
