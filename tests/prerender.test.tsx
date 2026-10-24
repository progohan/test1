import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import { StrictMode } from 'react';
import { render } from '../src/entry-server';
import App from '../src/App';
import { RenderClock } from '../src/lib/clock';
import { ThemeProvider } from '../src/components/theme-provider';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { ResumeDataSchema } from '../src/types';
import raw from '../public/data.json';

it('hydrates the prerendered portfolio without losing content or reporting mismatches', async () => {
  const data = ResumeDataSchema.parse(raw);
  const at = '2026-10-24T12:00:00.000Z';
  const host = document.createElement('div');
  document.body.append(host);
  host.innerHTML = render(data, at);
  expect(host.textContent).toContain('Aecon');
  expect(host.querySelector('#experience')).not.toBeNull();
  expect(host.querySelector('.leaflet-container')).toBeNull();
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(host, <StrictMode><RenderClock at={at}><ThemeProvider defaultTheme="dark" storageKey="portfolio-test1-theme"><ErrorBoundary><App initialData={data} /></ErrorBoundary></ThemeProvider></RenderClock></StrictMode>, { onRecoverableError: error => errors.push(error) });
  });
  expect(errors).toEqual([]);
  await act(async () => root.unmount());
  host.remove();
});
