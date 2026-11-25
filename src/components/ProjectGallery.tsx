import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Code2, Eye, Film, LayoutGrid, Sparkles } from 'lucide-react';
import { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  AI_WORK_SHOWCASE,
  PROFILE,
  PROJECTS,
  ProjectCategory,
  ProjectItem,
  ThemeMode,
} from '../data/portfolio';
import { SplitHeading } from './SplitHeading';

gsap.registerPlugin(ScrollTrigger);

interface ProjectGalleryProps {
  themeMode: ThemeMode;
  onSelectProject: (project: ProjectItem) => void;
}

const CATEGORIES: ProjectCategory[] = ['All', 'AI & ML', 'Full Stack', 'Data Analytics'];

export function ProjectGallery({ themeMode, onSelectProject }: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [viewMode, setViewMode] = useState<'kinetic' | 'editorial'>('kinetic');
  const [touchOpenId, setTouchOpenId] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // GSAP batch scroll entrance on project cards
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('.project-card-anim');
      if (cards.length === 0) return;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 56, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 72%',
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedCategory, viewMode]);

  const handleCardPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
  };

  const handleCardPointerLeave = (e: PointerEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  const openRelatedProject = (projectId: string) => {
    const found = PROJECTS.find((p) => p.id === projectId);
    if (found) onSelectProject(found);
  };

  const isPaper = themeMode === 'paper';

  return (
    <section
      id="projects"
      ref={sectionRef}
      data-section="projects"
      className={`py-24 lg:py-32 transition-colors duration-500 ${
        isPaper ? 'bg-[#FFFFFF] text-[#0E0F11]' : 'bg-[#0E0F11] text-[#F7F4EE]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Heading + Interactive Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-current/15">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C82333] mb-3">
              02 · AI Work &amp; Selected Projects
            </p>
            <SplitHeading
              as="h2"
              text="Projects"
              className="font-display font-extrabold tracking-tight text-5xl sm:text-6xl lg:text-7xl leading-[0.94]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div
              role="group"
              aria-label="Filter projects by discipline"
              className="flex flex-wrap items-center gap-2"
            >
              {CATEGORIES.map((category) => {
                const count =
                  category === 'All'
                    ? PROJECTS.length
                    : PROJECTS.filter((p) => p.category === category).length;
                const active = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={active}
                    className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-[50px] border transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333] ${
                      active
                        ? 'bg-[#C82333] border-[#C82333] text-[#FFFFFF]'
                        : isPaper
                        ? 'bg-[#F7F4EE] border-[#0E0F11]/15 text-[#0E0F11]/80 hover:border-[#0E0F11]'
                        : 'bg-[#0E0F11] border-[#F7F4EE]/20 text-[#F7F4EE]/80 hover:border-[#FFFFFF]'
                    }`}
                  >
                    {category}{' '}
                    <span className="font-mono text-[11px] opacity-75 tabular-nums ml-1">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Motion Gallery Style Switcher */}
            <div
              role="group"
              aria-label="Gallery motion style"
              className={`inline-flex items-center p-1 rounded-[50px] border ${
                isPaper
                  ? 'bg-[#F7F4EE] border-[#0E0F11]/15'
                  : 'bg-[#0E0F11] border-[#F7F4EE]/20'
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode('kinetic')}
                aria-pressed={viewMode === 'kinetic'}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-[50px] transition-colors cursor-pointer ${
                  viewMode === 'kinetic'
                    ? 'bg-[#C82333] text-[#FFFFFF]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Kinetic Reveal</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('editorial')}
                aria-pressed={viewMode === 'editorial'}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-[50px] transition-colors cursor-pointer ${
                  viewMode === 'editorial'
                    ? 'bg-[#C82333] text-[#FFFFFF]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Editorial Bento</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated AI Engineering & Applied Systems Showcase (User AI Visuals) */}
        <div className="pt-12 pb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#C82333]">
              AI Engineering &amp; Applied Systems
            </h3>
            <span className="font-mono text-xs opacity-60">
              Deep Learning · Computer Vision · Decision Intelligence
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {AI_WORK_SHOWCASE.map((item) => (
              <article
                key={item.id}
                className={`group rounded-[50px] border p-5 sm:p-6 flex flex-col justify-between transition-colors duration-300 ${
                  isPaper
                    ? 'bg-[#F7F4EE] border-[#0E0F11]/15 hover:border-[#C82333]'
                    : 'bg-[#0E0F11] border-[#F7F4EE]/18 hover:border-[#C82333]'
                }`}
              >
                <div
                  className={`relative w-full aspect-[16/9] rounded-[50px] overflow-hidden border border-current/10 mb-5 flex items-center justify-center ${
                    item.lightSurface ? 'bg-[#FFFFFF]' : 'bg-[#0E0F11]'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-[1.03] ${
                      item.lightSurface ? 'object-contain p-4' : 'object-cover'
                    }`}
                  />
                </div>

                <div className="px-2 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs opacity-65 tabular-nums">
                    <span className="text-[#C82333] font-semibold">{item.index}</span>
                    <span>{item.focus}</span>
                  </div>

                  <h4 className="font-display font-bold text-2xl tracking-tight leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-sm leading-relaxed opacity-80">{item.description}</p>

                  <ul className="space-y-1.5 text-xs sm:text-sm opacity-75 pt-1">
                    {item.capabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#C82333]" aria-hidden="true">
                          —
                        </span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-current/12 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => openRelatedProject(item.relatedProjectId)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C82333] hover:underline cursor-pointer"
                    >
                      <span>Inspect related case study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* VIEW 1: Signature Kinetic Tilt + Hover-Reveal Cards */}
        {viewMode === 'kinetic' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pt-10">
            {filteredProjects.map((project) => {
              const isOpen = touchOpenId === project.id;
              return (
                <article
                  key={project.id}
                  data-open={isOpen ? 'true' : 'false'}
                  onPointerMove={handleCardPointerMove}
                  onPointerLeave={handleCardPointerLeave}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a,button')) return;
                    setTouchOpenId((prev) => (prev === project.id ? null : project.id));
                  }}
                  className={`project-card-anim kinetic-card group relative min-h-[470px] p-5 rounded-[50px] border overflow-hidden flex flex-col justify-between text-center ${
                    isPaper
                      ? 'bg-[#F7F4EE] border-[#0E0F11]/15 hover:border-[#C82333]'
                      : 'bg-[#0E0F11] border-[#F7F4EE]/20 hover:border-[#C82333]'
                  }`}
                >
                  {/* Ambient Crimson Aura */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-20 group-hover:opacity-45 transition-opacity duration-500 blur-3xl"
                    style={{
                      background:
                        'radial-gradient(circle at 25% 25%, #C82333 0%, transparent 58%)',
                    }}
                  />

                  {/* Resting Cover Numeral State */}
                  <div className="kinetic-cover absolute inset-0 z-20 flex flex-col items-center justify-center p-8 pointer-events-none">
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-55 mb-3">
                      Selected Work
                    </span>
                    <em className="font-display not-italic font-extrabold text-[5.5rem] leading-[0.85] tracking-tight text-[#C82333] mb-4">
                      {project.index}
                    </em>
                    <span className="font-display font-bold text-xl tracking-tight mb-2">
                      {project.title}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
                      Hover or tap to unfold
                    </span>
                  </div>

                  {/* Unfolding Stage: Image + Marquee + Info + Circular 50% Links */}
                  <div className="kinetic-stage relative z-10 flex flex-col items-center justify-between flex-1 w-full">
                    <figure className="w-full h-[196px] rounded-[50px] overflow-hidden border border-current/12 bg-[#0E0F11]">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.imageAlt}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-5 text-[#F7F4EE] bg-[#0E0F11]">
                          <Film className="w-9 h-9 text-[#C82333] mb-2" aria-hidden="true" />
                          <span className="font-display font-bold text-lg">{project.title}</span>
                          <span className="font-mono text-[11px] opacity-65 mt-1">
                            PHP · MySQL · Schema Auth
                          </span>
                        </div>
                      )}
                    </figure>

                    {/* Kinetic Sliding Marquee Bar */}
                    <div
                      aria-hidden="true"
                      className="w-[calc(100%+2.5rem)] -mx-5 my-2.5 py-1.5 border-y border-current/12 overflow-hidden"
                    >
                      <div className="animate-marquee-fast font-mono text-[10px] uppercase tracking-[0.22em] opacity-75">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <span key={i} className="flex items-center gap-3 px-2 whitespace-nowrap">
                            <span>{project.stack.join(' · ')}</span>
                            <span className="text-[#C82333]">✦</span>
                            <span>{project.category}</span>
                            <span className="text-[#C82333]">✦</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="px-2 flex flex-col items-center gap-2">
                      <h3 className="font-display font-bold text-2xl tracking-tight leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed opacity-75 line-clamp-2 max-w-[30ch]">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Circular 50% Action Controls */}
                    <div className="flex items-center justify-center gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        aria-label={`Inspect ${project.title} case study`}
                        className="w-12 h-12 rounded-full border border-current/25 flex items-center justify-center hover:bg-[#C82333] hover:border-[#C82333] hover:text-[#FFFFFF] hover:-translate-y-1 transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333]"
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </button>

                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} code on GitHub`}
                        className="w-12 h-12 rounded-full border border-current/25 flex items-center justify-center hover:bg-[#C82333] hover:border-[#C82333] hover:text-[#FFFFFF] hover:-translate-y-1 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#C82333]"
                      >
                        <Code2 className="w-4 h-4" aria-hidden="true" />
                      </a>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live demo`}
                          className="w-12 h-12 rounded-full bg-[#C82333] text-[#FFFFFF] flex items-center justify-center hover:scale-105 hover:-translate-y-1 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#C82333]"
                        >
                          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: Editorial Bento Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7 pt-10">
            {filteredProjects.map((project, idx) => {
              const spanClass =
                selectedCategory === 'All' && idx === 0
                  ? 'lg:col-span-7'
                  : selectedCategory === 'All' && idx === 1
                  ? 'lg:col-span-5'
                  : 'lg:col-span-6';
              return (
                <article
                  key={project.id}
                  className={`project-card-anim group rounded-[50px] border p-4 sm:p-5 flex flex-col justify-between transition-colors duration-300 ${spanClass} ${
                    isPaper
                      ? 'bg-[#F7F4EE] border-[#0E0F11]/15 hover:border-[#C82333]'
                      : 'bg-[#0E0F11] border-[#F7F4EE]/18 hover:border-[#C82333]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="relative w-full aspect-[16/10] rounded-[50px] overflow-hidden cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-[#C82333]"
                    aria-label={`Inspect ${project.title} details`}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.imageAlt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0E0F11] text-[#F7F4EE]">
                        <Film className="w-10 h-10 text-[#C82333] mb-2" aria-hidden="true" />
                        <span className="font-display font-bold text-2xl">{project.title}</span>
                      </div>
                    )}
                  </button>

                  <div className="px-3 pt-5 pb-2 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs opacity-65 mb-2 tabular-nums">
                        <span>
                          {project.index} · {project.category}
                        </span>
                        <span>{project.year}</span>
                      </div>
                      <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-2">
                        <button
                          type="button"
                          onClick={() => onSelectProject(project)}
                          className="text-left hover:text-[#C82333] transition-colors cursor-pointer"
                        >
                          {project.title}
                        </button>
                      </h3>
                      <p className="text-sm leading-relaxed opacity-80">{project.tagline}</p>
                    </div>

                    <div className="pt-4 border-t border-current/12 flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xs opacity-70">
                        {project.stack.join(' · ')}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[50px] border border-current/25 hover:border-[#C82333] hover:text-[#C82333] transition-colors"
                        >
                          <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Code</span>
                        </a>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-[50px] bg-[#C82333] text-[#FFFFFF] hover:bg-transparent hover:text-current border border-[#C82333] transition-colors"
                          >
                            <span>Live</span>
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* See All Repositories CTA */}
        <div className="pt-14 flex justify-center">
          <a
            href={PROFILE.githubReposUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium rounded-[50px] border border-current/30 hover:bg-[#C82333] hover:border-[#C82333] hover:text-[#FFFFFF] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#C82333]"
          >
            <span>See all repositories on GitHub</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
