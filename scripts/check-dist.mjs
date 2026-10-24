import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';

const dist = resolve('dist');
const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
const base = process.env['VITE_BASE_PATH'] || '/test1/';
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('Base path must start and end with /.');
const files = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
  .map(match => match[1]).filter(url => !/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(url));
for (const url of files) {
  const pathname = new URL(url, `https://portfolio.example${base}`).pathname;
  if (!pathname.startsWith(base)) throw new Error(`Asset uses the wrong repository base: ${url}`);
  const path = resolve(dist, decodeURIComponent(pathname.slice(base.length).split(/[?#]/)[0]));
  const rel = relative(dist, path);
  if (rel.startsWith('..') || isAbsolute(rel) || !existsSync(path)) throw new Error(`Missing build asset: ${url}`);
}
const data = JSON.parse(readFileSync(resolve(dist, 'data.json'), 'utf8'));
if (data.personal_info.cv_url && !existsSync(resolve(dist, data.personal_info.cv_url))) {
  throw new Error('The published build is missing its downloadable CV.');
}
console.log(`Build files checked for ${base}; ${files.length} HTML assets, portfolio data, and CV are present.`);
