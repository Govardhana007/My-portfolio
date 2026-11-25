import { PROFILE } from '../data/portfolio';

export function Footer() {
  return (
    <footer className="bg-[#0E0F11] text-[#F7F4EE]/70 border-t border-[#F7F4EE]/10 py-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        <span>{PROFILE.location} · Built with React, GSAP &amp; Three.js</span>
      </div>
    </footer>
  );
}
