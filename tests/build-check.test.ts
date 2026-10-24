import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, expect, it } from 'vitest';

const directories: string[] = [];
const checker = resolve('scripts/check-dist.mjs');
function fixture(asset = '/test1/app.js', includeAsset = true) {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-build-test-'));
  directories.push(root);
  mkdirSync(join(root, 'dist'));
  writeFileSync(join(root, 'dist/index.html'), `<script src="${asset}"></script>`);
  writeFileSync(join(root, 'dist/data.json'), JSON.stringify({ personal_info: { cv_url: 'cv.pdf' } }));
  writeFileSync(join(root, 'dist/cv.pdf'), 'fixture');
  if (includeAsset) writeFileSync(join(root, 'dist/app.js'), '// fixture');
  return spawnSync(process.execPath, [checker], {
    cwd: root, encoding: 'utf8', env: { ...process.env, VITE_BASE_PATH: '/test1/' },
  });
}
afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});
it('accepts a build with correct local assets and CV', () => {
  expect(fixture().status).toBe(0);
});
it('rejects an asset pointing at the production EF path', () => {
  const result = fixture('/EF/app.js');
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('wrong repository base');
});
it('rejects a missing published asset', () => {
  const result = fixture('/test1/app.js', false);
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('Missing build asset');
});
