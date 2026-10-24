import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './components/theme-provider';
import { RenderClock } from './lib/clock';
import { ResumeData, ResumeDataSchema } from './types';
import App from './App';
import './index.css';

let initialData: ResumeData | undefined;
let renderedAt = new Date().toISOString();
try {
  const content = document.getElementById('portfolio-bootstrap')?.textContent;
  if (content) {
    const payload = JSON.parse(content);
    initialData = ResumeDataSchema.parse(payload.data);
    if (typeof payload.renderedAt === 'string' && Number.isFinite(Date.parse(payload.renderedAt))) renderedAt = payload.renderedAt;
  }
} catch (cause) { console.error('Embedded portfolio data was not valid.', cause); }
const root = document.getElementById('root')!;
const application = <StrictMode><RenderClock at={renderedAt}><ThemeProvider defaultTheme="dark" storageKey="portfolio-test1-theme"><ErrorBoundary><App initialData={initialData} /></ErrorBoundary></ThemeProvider></RenderClock></StrictMode>;
if (root.dataset['prerendered'] === 'true' && initialData) hydrateRoot(root, application);
else createRoot(root).render(application);
