import { Component, ErrorInfo, ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Portfolio rendering failed.', error, info); }
  render() {
    if (this.state.failed) return <main role="alert" className="min-h-screen flex flex-col items-center justify-center gap-4 p-8"><h1 className="text-2xl font-semibold">The portfolio could not be displayed.</h1><p>Please reload the page to try again.</p><button className="px-6 py-3 bg-primary text-primary-foreground rounded" onClick={() => window.location.reload()}>Reload portfolio</button></main>;
    return this.props.children;
  }
}
