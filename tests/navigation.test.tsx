import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import Header from '../src/components/Header';
import { ThemeProvider } from '../src/components/theme-provider';
import data from '../public/data.json';

it('opens the mobile menu, preserves anchor links, and closes it after selection', async () => {
  const user = userEvent.setup();
  render(<ThemeProvider><Header name={data.personal_info.full_name} links={data.site_content.navigation} /></ThemeProvider>);
  const toggle = screen.getByRole('button', { name: 'Toggle navigation menu' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await user.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const menu = document.getElementById('mobile-menu')!;
  const experience = within(menu).getByRole('link', { name: 'Experience' });
  expect(experience).toHaveAttribute('href', '#experience');
  await user.click(experience);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(document.getElementById('mobile-menu')).toBeNull();
});

it('exposes links to every portfolio section', () => {
  render(<ThemeProvider><Header name={data.personal_info.full_name} links={data.site_content.navigation} /></ThemeProvider>);
  expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual([
    '#main-content', '#hero', '#snapshot', '#about', '#experience', '#competencies', '#projects', '#education', '#contact',
  ]);
});
