import { createContext, ReactNode, useContext } from 'react';
const ClockContext = createContext<string | null>(null);
export function RenderClock({ at, children }: { at: string; children: ReactNode }) {
  return <ClockContext.Provider value={at}>{children}</ClockContext.Provider>;
}
// Context and its consumer intentionally share this small module.
// eslint-disable-next-line react-refresh/only-export-components
export function useRenderDate() {
  const at = useContext(ClockContext);
  return at ? new Date(at) : new Date();
}
