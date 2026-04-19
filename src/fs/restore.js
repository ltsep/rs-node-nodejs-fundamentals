import { readFile, writeFile, access, mkdir } from 'fs/promises';
import path from 'path';

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored

  const cwd = process.cwd();

  const snapshotPath = path.join(cwd, 'snapshot.json');

  try {
    await access(snapshotPath);
  } catch {
    console.log('FS operation failed');
    return;
  }

  const restorePath = path.join(cwd, 'workspace_restored');

  try {
    await access(snapshotPath);
    console.log('FS operation failed');
  } catch {}

  const snapshotStr = await readFile(snapshotPath, 'utf8');
  const { entries } = JSON.parse(snapshotStr);

  for (const entry of entries) {
    const nextPath = path.join(restorePath, entry.path);

    if (entry.type === 'directory') {
      await mkdir(nextPath, { recursive: true });
    } else {
      await writeFile(nextPath, entry.content, 'utf8');
    }
  }
};

await restore();
