import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import data from '../public/data.json';

it('keeps every header anchor connected to a real section', () => {
  const anchors = data.site_content.navigation.map(link => link.id);
  const components = ['Hero', 'PortfolioSnapshot', 'About', 'Experience', 'CoreCompetencies', 'KeyProjects', 'Education', 'Contact'];
  const sections = components.map(name => readFileSync(resolve(`src/components/${name}.tsx`), 'utf8')).join('\n');
  for (const anchor of anchors) expect(sections).toContain(`id="${anchor}"`);
});
