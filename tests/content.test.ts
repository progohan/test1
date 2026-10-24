import { describe, expect, it } from 'vitest';
import data from '../public/data.json';
import { validatePortfolio } from '../scripts/content-validation';

describe('portfolio content validation', () => {
  it('accepts the current portfolio without changing its content', () => {
    expect(validatePortfolio(data)).toEqual(data);
  });
  it('rejects missing required content', () => {
    expect(() => validatePortfolio({})).toThrow();
  });
  it('rejects invalid work dates', () => {
    const copy = structuredClone(data);
    copy.work_experience[0]!.duration = '13.2026 - Present';
    expect(() => validatePortfolio(copy)).toThrow('Invalid work date');
  });
  it('rejects reversed date ranges', () => {
    const copy = structuredClone(data);
    copy.work_experience[0]!.duration = '09.2026 - 08.2026';
    expect(() => validatePortfolio(copy)).toThrow('End precedes start');
  });
  it('rejects duplicate project names', () => {
    const copy = structuredClone(data);
    copy.key_projects.push(copy.key_projects[0]!);
    expect(() => validatePortfolio(copy)).toThrow('Project names must be unique');
  });
  it('rejects invalid contact links', () => {
    const copy = structuredClone(data);
    copy.personal_info.contact.linkedin = 'http://example.com';
    expect(() => validatePortfolio(copy)).toThrow();
  });
  it('rejects impossible map coordinates', () => {
    const copy = structuredClone(data);
    copy.key_projects[0]!.map.latitude = 91;
    expect(() => validatePortfolio(copy)).toThrow();
  });
  it('rejects invalid currency conversion assumptions', () => {
    const copy = structuredClone(data);
    copy.metrics_assumptions.conversion_rates.CAD = 0;
    expect(() => validatePortfolio(copy)).toThrow();
  });
  it('rejects display and structured employment date disagreement', () => {
    const copy = structuredClone(data);
    copy.work_experience[0]!.start_date = '2026-08';
    expect(() => validatePortfolio(copy)).toThrow();
  });
});
