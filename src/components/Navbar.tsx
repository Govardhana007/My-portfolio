import { FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { PROFILE, ThemeMode } from '../data/portfolio';

interface NavbarProps {
  themeMode: ThemeMode;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
}

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar({ themeMode, activeSection, onNavigate, onOpenResume }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  const isPaper = themeMode === 'paper';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 h-18 transition-colors duration-300 border-b backdrop-blur-md ${
        isPaper
          ? 'bg-[#F7F4EE]/92 border-[#0E0F11]/12 text-[#0E0F11]'
          : 'bg-[#0E0F11]/88 border-[#F7F4EE]/12 text-[#F7F4EE]'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="font-display text-2xl font-extrabold tracking-tight whitespace-nowrap rounded-[50px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C82333]"
        >
          {PROFILE.wordmark}
        </a>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.id);
                }}
                className={`relative text-sm font-medium whitespace-nowrap transition-colors duration-300 rounded-[50px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C82333] ${
                  isActive
                    ? 'text-[#C82333]'
                    : isPaper
                    ? 'text-[#0E0F11]/75 hover:text-[#0E0F11]'
                    : 'text-[#F7F4EE]/75 hover:text-[#FFFFFF]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C82333]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenResume}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-[50px] border border-[#C82333] bg-[#C82333] text-[#FFFFFF] hover:bg-transparent hover:text-current transition-all duration-300 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C82333]"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Resume</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden w-10 h-10 rounded-full border border-current/25 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className={`md:hidden border-b px-6 py-5 flex flex-col gap-3 ${
            isPaper
              ? 'bg-[#F7F4EE] border-[#0E0F11]/12 text-[#0E0F11]'
              : 'bg-[#0E0F11] border-[#F7F4EE]/12 text-[#F7F4EE]'
          }`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
              className={`py-2 text-base font-medium transition-colors ${
                activeSection === link.id ? 'text-[#C82333]' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
