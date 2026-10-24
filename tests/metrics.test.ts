import { expect, it } from 'vitest';
import data from '../public/data.json';
import { ResumeDataSchema } from '../src/types';
import { enrichProjects, formatYears, parseDateRange } from '../src/lib/portfolioMetrics';

it('uses explicit source values and conversion assumptions', () => {
  const portfolio = ResumeDataSchema.parse(data);
  const rates = { USD: 1 as const, CAD: 0.5, EUR: 2 };
  const projects = enrichProjects(portfolio.key_projects, rates);
  for (const project of projects) {
    expect(project.parsedValueMillions).toBe(project.value_millions * rates[project.currency]);
  }
});

it('retains the approved legacy experience rounding with a fixed render date', () => {
  const range = parseDateRange('01.2003 - Present', new Date('2026-10-24T12:00:00Z'))!;
  expect(formatYears(range.years)).toBe('24+');
});
