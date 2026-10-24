import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import KeyProjects from '../src/components/KeyProjects';
import data from '../public/data.json';
import { ResumeDataSchema } from '../src/types';

vi.mock('../src/components/ProjectMaps', () => ({ default: () => <div>Map placeholder</div> }));
const projects = ResumeDataSchema.parse(data).key_projects;

it('filters projects by region and restores all projects', async () => {
  const user = userEvent.setup();
  render(<KeyProjects projects={projects} />);
  expect(screen.getAllByRole('button', { name: /^View details for / })).toHaveLength(projects.length);
  await user.click(screen.getByRole('button', { name: /^Canada \(/ }));
  expect(screen.getAllByRole('button', { name: /^View details for / })).toHaveLength(
    projects.filter(project => project.region === 'canada').length,
  );
  await user.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(screen.getAllByRole('button', { name: /^View details for / })).toHaveLength(projects.length);
});

it('opens project details from the keyboard and closes them with the close button', async () => {
  const user = userEvent.setup();
  render(<KeyProjects projects={projects} />);
  const name = projects[0]!.name;
  screen.getByRole('button', { name: `View details for ${name}` }).focus();
  await user.keyboard('{Enter}');
  expect(screen.getAllByRole('heading', { name })).toHaveLength(2);
  await user.click(screen.getByRole('button', { name: 'Close project details' }));
  expect(screen.getAllByRole('heading', { name })).toHaveLength(1);
});
