import { render, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import App from '../src/App';
import data from '../public/data.json';

vi.mock('../src/components/Header', () => ({ default: () => <nav>Navigation</nav> }));
vi.mock('../src/components/Hero', () => ({ default: () => <h1>Portfolio loaded</h1> }));
vi.mock('../src/components/About', () => ({ default: () => <section>About</section> }));
vi.mock('../src/components/PortfolioSnapshot', () => ({ default: () => <section>Snapshot</section> }));
vi.mock('../src/components/Experience', () => ({ default: () => <section>Experience</section> }));
vi.mock('../src/components/CoreCompetencies', () => ({ default: () => <section>Expertise</section> }));
vi.mock('../src/components/KeyProjects', () => ({ default: () => <section>Projects</section> }));
vi.mock('../src/components/Education', () => ({ default: () => <section>Education</section> }));
vi.mock('../src/components/Contact', () => ({ default: () => <section>Contact</section> }));
beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

it('loads valid portfolio data', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => data });
  vi.stubGlobal('fetch', fetchMock);
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Portfolio loaded' })).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith('./data.json', expect.objectContaining({ signal: expect.any(AbortSignal) }));
});

it('shows a recovery action after an HTTP error', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' }));
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Error Loading Data' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
});

it('does not render an invalid data response as a valid portfolio', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Error Loading Data' })).toBeInTheDocument();
});
