import { execFileSync } from 'node:child_process';
import { copyFile, lstat, mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const work = resolve(root, '.wrangler');
const target = resolve(work, 'staging-assets');
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0');
const files = tracked.filter(path => path &&
  !/^(?:\.(?!well-known\/)|docs\/|edge\/|tests\/|test-output\/|node_modules\/)/.test(path) &&
  !/\.(?:md|sql|sqlite3?|db|pem|key|log)$/i.test(path) &&
  !/^(?:package[^/]*\.json|wrangler\.jsonc|_redirects|_headers|CNAME)$/i.test(path));
await mkdir(work, { recursive: true });
const output = await mkdtemp(resolve(work, 'assets-'));
try {
  for (const file of files) {
    const source = resolve(root, file);
    if (!(await lstat(source)).isFile()) throw new Error(`Unexpected staging asset: ${file}`);
    const to = resolve(output, file);
    await mkdir(dirname(to), { recursive: true });
    await copyFile(source, to);
  }
  await rm(target, { recursive: true, force: true });
  await rename(output, target);
  console.log(`Prepared ${files.length} tracked staging assets.`);
} finally {
  await rm(output, { recursive: true, force: true });
}
