import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { validatePortfolio } from './content-validation.ts';

const publicDirectory = resolve('public');
const data = validatePortfolio(JSON.parse(readFileSync(resolve(publicDirectory, 'data.json'), 'utf8')));
const cv = data.personal_info.cv_url;
if (cv) {
  const target = resolve(publicDirectory, cv);
  const localPath = relative(publicDirectory, target);
  if (localPath.startsWith('..') || isAbsolute(localPath) || !existsSync(target)) {
    throw new Error(`CV must reference an existing file inside public/: ${cv}`);
  }
}
console.log(`Validated ${data.work_experience.length} jobs, ${data.key_projects.length} projects, contact links, and CV.`);
