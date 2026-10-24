import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { ThemeProvider } from './components/theme-provider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RenderClock } from './lib/clock';
import { ResumeData } from './types';

export function render(data: ResumeData, renderedAt: string) {
  return renderToString(<StrictMode><RenderClock at={renderedAt}><ThemeProvider defaultTheme="dark" storageKey="portfolio-test1-theme"><ErrorBoundary><App initialData={data} /></ErrorBoundary></ThemeProvider></RenderClock></StrictMode>);
}
