import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, relative } from 'path';

const snapshot = async () => {
  // Write your code here
  // Recursively scan workspace directory
  // Write snapshot.json with:
  // - rootPath: absolute path to workspace
  // - entries: flat array of relative paths and metadata
  // Example:
  // {
  //   "rootPath": "/home/user/workspace",
  //   "entries": [
  //     { "path": "file1.txt", "type": "file", "size": 1024, "content": "file contents as base64 string" },
  //     { "path": "subdir", "type": "directory" },
  //     { "path": "subdir/nested.txt", "type": "file", "size": 512, "content": "nested file contents as base64 string" }
  //   ]
  // }

  const rootPath = process.cwd();
  const entries = await readDirRecursively(rootPath);

  const data = {
    rootPath,
    entries,
  };

  await writeFile('snapshot.json', JSON.stringify(data));
};

await snapshot();

async function readDirRecursively(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const entries = [];

  for (const entry of dirents) {
    const path = join(dir, entry.name);
    const relativePath = relative(process.cwd(), path);
    const { size } = await stat(path);
    if (entry.isDirectory()) {
      entries.push(
        { path: relativePath, type: 'directory' },
        ...(await readDirRecursively(path))
      );
    } else {
      const content = await readFile(path, 'base64');
      entries.push({ path: relativePath, type: 'file', size, content });
    }
  }

  return entries;
}
