import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('keeps every header anchor connected to a real section', () => {
  const header = readFileSync(resolve('src/components/Header.tsx'), 'utf8');
  const anchors = [...header.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  const components = ['Hero', 'PortfolioSnapshot', 'About', 'Experience', 'CoreCompetencies', 'KeyProjects', 'Education', 'Contact'];
  const sections = components.map(name => readFileSync(resolve(`src/components/${name}.tsx`), 'utf8')).join('\n');
  for (const anchor of anchors) expect(sections).toContain(`id="${anchor}"`);
});
