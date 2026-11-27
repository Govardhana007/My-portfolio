import gsap from 'gsap';
import { ArrowDownRight, ArrowUpRight, Palette, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { KEY_METRICS, PROFILE, PROJECTS, ProjectItem, ThemeMode } from '../data/portfolio';
import { SplitHeading } from './SplitHeading';

interface HeroProps {
  themeMode: ThemeMode;
  trailEnabled: boolean;
  onToggleTrail: () => void;
  onThemeChange: (mode: ThemeMode) => void;
  onExploreProjects: () => void;
  onContact: () => void;
  onSelectProject: (project: ProjectItem) => void;
}

const THEME_OPTIONS: { id: ThemeMode; label: string }[] = [
  { id: 'contrast', label: 'Editorial' },
  { id: 'obsidian', label: 'Obsidian' },
  { id: 'paper', label: 'Warm Paper' },
];

export function Hero({
  themeMode,
  trailEnabled,
  onToggleTrail,
  onThemeChange,
  onExploreProjects,
  onContact,
}: HeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState(PROFILE.rotatorPhrases[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // GSAP entrance for hero reveal elements
  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-rv',
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.35,
        },
      );
    }, heroRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Typewriter loop
  useEffect(() => {
    if (reducedMotion) {
      setTypedText(PROFILE.rotatorPhrases[0]);
      return;
    }

    const currentPhrase = PROFILE.rotatorPhrases[phraseIndex];
    const delay = isDeleting ? 34 : 64;

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === currentPhrase) {
        window.setTimeout(() => setIsDeleting(true), 1350);
        return;
      }
      if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % PROFILE.rotatorPhrases.length);
        return;
      }
      setTypedText((prev) =>
        isDeleting ? prev.slice(0, -1) : currentPhrase.slice(0, prev.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex, reducedMotion]);

  const isPaper = themeMode === 'paper';

  return (
    <section
      id="home"
      ref={heroRef}
      data-section="home"
      className={`relative min-h-screen flex flex-col justify-between pt-24 pb-0 overflow-hidden transition-colors duration-500 ${
        isPaper ? 'bg-[#F7F4EE] text-[#0E0F11]' : 'bg-[#0E0F11] text-[#F7F4EE]'
      }`}
    >
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-10 pt-4 pb-12 lg:pt-8">
        {/* Top Utility Strip: Location + Cursor Flair + Theme Switcher */}
        <div className="hero-rv flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-current/15">
          <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-75">
            Bengaluru, India · AI &amp; ML · Full Stack
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onToggleTrail}
              aria-pressed={trailEnabled}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-[50px] border transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333] ${
                trailEnabled
                  ? 'border-[#C82333] text-[#C82333]'
                  : 'border-current/20 opacity-65 hover:opacity-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Cursor Flair: {trailEnabled ? 'On' : 'Off'}</span>
            </button>

            <div
              role="group"
              aria-label="Portfolio color theme"
              className={`inline-flex items-center gap-1 p-1 rounded-[50px] border ${
                isPaper
                  ? 'bg-[#FFFFFF] border-[#0E0F11]/15'
                  : 'bg-[#0E0F11] border-[#F7F4EE]/20'
              }`}
            >
              <span className="pl-2.5 pr-1 flex items-center gap-1.5 text-xs font-mono opacity-65">
                <Palette className="w-3.5 h-3.5 text-[#C82333]" aria-hidden="true" />
                <span className="hidden sm:inline">Theme</span>
              </span>
              {THEME_OPTIONS.map((opt) => {
                const selected = themeMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onThemeChange(opt.id)}
                    aria-pressed={selected}
                    className={`px-3.5 py-1 text-xs font-medium rounded-[50px] transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333] ${
                      selected
                        ? 'bg-[#C82333] text-[#FFFFFF]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Split-Screen Editorial Hero with Govardhana's Real Portrait */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-10 lg:pt-12">
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="hero-rv font-serif italic text-2xl text-[#C82333] mb-3">
              Hi, I&apos;m
            </span>

            <SplitHeading
              as="h1"
              text={PROFILE.name}
              immediate
              className="font-display font-extrabold tracking-tight leading-[0.92] text-[clamp(3.1rem,8.4vw,6.8rem)] mb-6"
            />

            <p className="hero-rv font-display text-xl sm:text-2xl font-medium tracking-tight mb-5 min-h-[2rem]">
              <span className="opacity-70">I craft </span>
              <span className="text-[#C82333]">{typedText}</span>
              <span
                aria-hidden="true"
                className="inline-block w-[3px] h-[1em] align-middle ml-1 bg-[#C82333] animate-caret"
              />
            </p>

            <p className="hero-rv text-base sm:text-lg leading-relaxed max-w-xl opacity-85 mb-8">
              {PROFILE.bio}
            </p>

            {/* Single Primary CTA + Secondary Text Link */}
            <div className="hero-rv flex flex-wrap items-center gap-7">
              <button
                type="button"
                onClick={onExploreProjects}
                className="inline-flex items-center gap-2.5 px-8 py-4 text-sm sm:text-base font-semibold rounded-[50px] bg-[#C82333] text-[#FFFFFF] border border-[#C82333] hover:bg-transparent hover:text-current active:scale-[0.98] transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C82333]"
              >
                <span>View AI &amp; Web Projects</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onContact}
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-medium border-b border-current/40 pb-1 hover:border-[#C82333] hover:text-[#C82333] transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C82333]"
              >
                <span>Contact me</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Studio Portrait Showcase */}
          <div className="hero-rv lg:col-span-5">
            <div
              className={`rounded-[50px] border p-3.5 transition-colors duration-300 ${
                isPaper
                  ? 'bg-[#FFFFFF] border-[#0E0F11]/15'
                  : 'bg-[#0E0F11] border-[#F7F4EE]/18'
              }`}
            >
              <figure className="relative w-full aspect-[4/5] rounded-[50px] overflow-hidden bg-[#4A0B12]">
                <img
                  src={PROFILE.portrait}
                  alt={PROFILE.portraitAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0E0F11]/88 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <figcaption className="absolute bottom-6 left-6 right-6 text-[#F7F4EE]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F7F4EE]/80 mb-1">
                    Presidency University · B.Tech AI &amp; ML
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                    {PROFILE.roleHeadline}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* Full-Width Key Metrics */}
        <div className="hero-rv relative grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 mt-10 border-t border-current/15">
          {KEY_METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col">
              <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums">
                {metric.value}
              </span>
              <span className="text-xs sm:text-sm opacity-65 mt-1">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Wheel Cue + Marquee Ribbon */}
      <div className="relative z-20 mt-auto">
        <div className="hidden lg:flex justify-center pb-5" aria-hidden="true">
          <div className="relative w-6 h-9 rounded-[50px] border-2 border-current/35">
            <span className="absolute left-1/2 top-1.5 -translate-x-1/2 w-1 h-2 rounded-[50px] bg-[#C82333] animate-rish-wheel" />
          </div>
        </div>

        <div
          aria-hidden="true"
          className={`py-3.5 border-y overflow-hidden select-none ${
            isPaper
              ? 'border-[#0E0F11]/15 bg-[#0E0F11] text-[#F7F4EE]'
              : 'border-[#F7F4EE]/12 bg-[#0E0F11] text-[#F7F4EE]/85'
          }`}
        >
          <div className="animate-marquee font-mono text-xs uppercase tracking-[0.22em]">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 px-4 whitespace-nowrap">
                <span>AI &amp; Neural Systems</span>
                <span className="text-[#C82333]">◆</span>
                <span>Deep Learning &amp; CNNs</span>
                <span className="text-[#C82333]">◆</span>
                <span>Full-Stack Web Architecture</span>
                <span className="text-[#C82333]">◆</span>
                <span>{PROJECTS.length} Deployed Projects</span>
                <span className="text-[#C82333]">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
