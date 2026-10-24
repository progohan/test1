import { useEffect, useRef, useState } from 'react';
import { ModeToggle } from './mode-toggle';
import { ResumeData } from '../types';

interface HeaderProps {
  name: string;
  links: ResumeData['site_content']['navigation'];
}

export default function Header({ name, links }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isMenuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setIsMenuOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isMenuOpen]);
  const renderLinks = (mobile = false) => links.map(link => (
    <a key={link.id} href={`#${link.id}`} onClick={() => setIsMenuOpen(false)}
      className={mobile ? 'block py-2 text-foreground hover:text-primary' : 'text-foreground hover:text-primary transition-colors'}>
      {link.label}
    </a>
  ));
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="fixed top-0 w-full bg-background/90 backdrop-blur-sm border-b border-border z-40">
        <nav aria-label="Primary navigation" className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-3">
            <div className="text-base sm:text-xl font-bold text-primary">{name}</div>
            <div className="flex items-center gap-4">
              <div className="hidden xl:flex gap-5">{renderLinks()}</div>
              <ModeToggle />
              <button ref={toggle} type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="xl:hidden text-foreground hover:text-primary p-2"
                aria-label="Toggle navigation menu" aria-expanded={isMenuOpen} aria-controls="mobile-menu">
                <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            </div>
          </div>
          {isMenuOpen && <div id="mobile-menu" className="xl:hidden mt-4 bg-background p-4 rounded-lg shadow-lg">{renderLinks(true)}</div>}
        </nav>
      </header>
    </>
  );
}
