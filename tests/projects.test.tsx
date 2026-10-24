import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import KeyProjects from '../src/components/KeyProjects';
import data from '../public/data.json';
import { ResumeDataSchema } from '../src/types';

vi.mock('../src/components/ProjectMaps', () => ({ default: () => <div>Map placeholder</div> }));
const projects = ResumeDataSchema.parse(data).key_projects;

it('filters projects by region and restores all projects', async () => {
  const user = userEvent.setup();
  render(<KeyProjects projects={projects} intro={data.site_content.projects_intro} />);
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
  render(<KeyProjects projects={projects} intro={data.site_content.projects_intro} />);
  const name = projects[0]!.name;
  screen.getByRole('button', { name: `View details for ${name}` }).focus();
  await user.keyboard('{Enter}');
  expect(within(screen.getByRole('dialog', { name })).getByRole('heading', { name })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Close project details' }));
  expect(screen.getAllByRole('heading', { name })).toHaveLength(1);
});

it('closes with Escape and restores keyboard focus to the project card', async () => {
  const user = userEvent.setup();
  render(<KeyProjects projects={projects} intro={data.site_content.projects_intro} />);
  const card = screen.getByRole('button', { name: `View details for ${projects[0]!.name}` });
  card.focus();
  await user.keyboard('{Enter}');
  const dialog = screen.getByRole('dialog');
  await user.tab();
  expect(dialog).toContainElement(document.activeElement as HTMLElement);
  await user.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await waitFor(() => expect(card).toHaveFocus());
});

it('does not load the map until requested', async () => {
  const user = userEvent.setup();
  render(<KeyProjects projects={projects} intro={data.site_content.projects_intro} />);
  expect(screen.queryByText('Map placeholder')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Show interactive project map' }));
  expect(await screen.findByText('Map placeholder')).toBeInTheDocument();
});
