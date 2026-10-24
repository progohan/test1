import { ResumeDataSchema } from '../src/types.ts';

const parseWorkDate = (text: string) => {
  const match = /^(0[1-9]|1[0-2])\.(\d{4})$/.exec(text);
  if (!match) throw new Error(`Invalid work date: ${text}`);
  return Number(match[2]) * 12 + Number(match[1]);
};

export function validatePortfolio(input: unknown) {
  const data = ResumeDataSchema.parse(input);
  if (!data.work_experience.length) throw new Error('Work experience must not be empty.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal_info.contact.email)) {
    throw new Error('A valid contact email is required.');
  }
  const linkedin = new URL(data.personal_info.contact.linkedin);
  if (linkedin.protocol !== 'https:' || !/(^|\.)linkedin\.com$/.test(linkedin.hostname)) {
    throw new Error('LinkedIn must use an HTTPS LinkedIn URL.');
  }
  for (const job of data.work_experience) {
    if (!job.company.trim() || !job.position.trim() || !job.responsibilities.length) {
      throw new Error('Each job needs a company, title, and responsibilities.');
    }
    const dates = job.duration.split(/\s+[-–—]\s+/);
    if (dates.length !== 2) throw new Error(`Invalid date range: ${job.duration}`);
    const start = parseWorkDate(dates[0]!);
    const end = dates[1] === 'Present' ? Infinity : parseWorkDate(dates[1]!);
    if (end < start) throw new Error(`End precedes start: ${job.company}`);
  }
  const names = data.key_projects.map(project => project.name);
  if (new Set(names).size !== names.length) throw new Error('Project names must be unique.');
  return data;
}
