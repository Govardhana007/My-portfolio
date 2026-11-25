import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { CertificateModal } from './components/CertificateModal';
import { CertificateSpiral } from './components/CertificateSpiral';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { MouseTrail } from './components/MouseTrail';
import { Navbar } from './components/Navbar';
import { Preloader } from './components/Preloader';
import { ProjectGallery } from './components/ProjectGallery';
import { ProjectModal } from './components/ProjectModal';
import { ResumeModal } from './components/ResumeModal';
import { CertificateItem, ProjectItem, ThemeMode } from './data/portfolio';

gsap.registerPlugin(ScrollTrigger);

const SECTION_DOTS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
];

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = window.localStorage.getItem('gr_portfolio_theme');
      if (saved === 'contrast' || saved === 'obsidian' || saved === 'paper') {
        return saved;
      }
    } catch {
      // Ignore storage access failures
    }
    return 'contrast';
  });

  const [trailEnabled, setTrailEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

  const handleThemeChange = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      window.localStorage.setItem('gr_portfolio_theme', mode);
    } catch {
      // Ignore storage write errors
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const anyModalOpen = Boolean(selectedProject || selectedCertificate || resumeOpen);
    if (!lenisRef.current) return;
    if (anyModalOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [selectedProject, selectedCertificate, resumeOpen]);

  useEffect(() => {
    const elements = SECTION_DOTS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.1, 0.25, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const activeIdx = Math.max(
    0,
    SECTION_DOTS.findIndex((d) => d.id === activeSection),
  );

  return (
    <div className={themeMode === 'paper' ? '' : 'dark'}>
      <Preloader />
      <MouseTrail enabled={trailEnabled} />
      <div className="rish-grade" aria-hidden="true" />

      <Navbar
        themeMode={themeMode}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* Side Section Indicator Dots */}
      <nav
        aria-label="Section quick navigation"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3.5"
      >
        <span className="font-mono text-xs tracking-[0.25em] tabular-nums mb-2 px-2.5 py-1 rounded-[50px] bg-[#0E0F11]/80 text-[#F7F4EE]">
          0{activeIdx + 1} / 0{SECTION_DOTS.length}
        </span>

        {SECTION_DOTS.map((dot) => {
          const isCurrent = activeSection === dot.id;
          return (
            <button
              key={dot.id}
              type="button"
              onClick={() => scrollToSection(dot.id)}
              aria-label={`Jump to ${dot.label}`}
              aria-current={isCurrent ? 'true' : undefined}
              className="group flex items-center gap-3 cursor-pointer py-0.5 rounded-full focus-visible:outline-2 focus-visible:outline-[#C82333]"
            >
              <span
                className={`font-mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-[50px] bg-[#0E0F11]/85 text-[#FFFFFF] transition-opacity duration-200 ${
                  isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {dot.label}
              </span>
              <span
                className={`block rounded-full border transition-all duration-300 ${
                  isCurrent
                    ? 'w-3 h-3 bg-[#C82333] border-[#C82333] scale-125'
                    : 'w-2.5 h-2.5 bg-[#0E0F11]/35 border-[#F7F4EE]/60 group-hover:border-[#C82333]'
                }`}
              />
            </button>
          );
        })}
      </nav>

      <main>
        <Hero
          themeMode={themeMode}
          trailEnabled={trailEnabled}
          onToggleTrail={() => setTrailEnabled((prev) => !prev)}
          onThemeChange={handleThemeChange}
          onExploreProjects={() => scrollToSection('projects')}
          onContact={() => scrollToSection('contact')}
          onSelectProject={setSelectedProject}
        />

        <AboutSection themeMode={themeMode} />

        <ProjectGallery themeMode={themeMode} onSelectProject={setSelectedProject} />

        <CertificateSpiral
          themeMode={themeMode}
          onSelectCertificate={setSelectedCertificate}
        />

        <ContactSection themeMode={themeMode} />
      </main>

      <Footer />

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
