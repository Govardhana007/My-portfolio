import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, ChevronDown, GraduationCap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EDUCATION, EXPERIENCES, PROFILE, SKILL_GROUPS, ThemeMode } from '../data/portfolio';
import { SplitHeading } from './SplitHeading';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  themeMode: ThemeMode;
}

const ABOUT_COUNTERS = [
  { value: 6, label: 'Deployed Projects' },
  { value: 6, label: 'Verified Certificates' },
  { value: 4, label: 'Technical Internships' },
];

export function AboutSection({ themeMode }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [expandedExp, setExpandedExp] = useState<string>(EXPERIENCES[0].id);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('[data-count-target]').forEach((node) => {
        const target = Number(node.dataset.countTarget || 0);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            node.textContent = String(Math.round(obj.val)).padStart(2, '0');
          },
        });
      });

      gsap.fromTo(
        '.about-rv',
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isDarkSurface = themeMode === 'obsidian';

  return (
    <section
      id="about"
      ref={sectionRef}
      data-section="about"
      className={`py-24 lg:py-32 transition-colors duration-500 ${
        isDarkSurface ? 'bg-[#0E0F11] text-[#F7F4EE]' : 'bg-[#F7F4EE] text-[#0E0F11]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Heading + Portrait Identity & Lead Summary */}
        <div className="grid lg:grid-cols-12 gap-8 pb-12 border-b border-current/15">
          <div className="lg:col-span-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C82333] mb-3">
              01 · Profile &amp; Trajectory
            </p>
            <SplitHeading
              as="h2"
              text="About me"
              className="font-display font-extrabold tracking-tight text-5xl sm:text-6xl lg:text-7xl leading-[0.94]"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <img
              src={PROFILE.portrait}
              alt={PROFILE.portraitAlt}
              referrerPolicy="no-referrer"
              className="about-rv w-20 h-20 rounded-full object-cover object-top border-2 border-[#C82333] shrink-0"
            />
            <p className="about-rv text-base sm:text-lg leading-relaxed opacity-85">
              I study Computer Engineering (AI &amp; ML) at Presidency University and build complete,
              deployable products—from convolutional neural networks and Random Forest inference APIs
              to kinetic, scroll-driven front-end interfaces.
            </p>
          </div>
        </div>

        {/* Animated Rish Tabular Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-12 border-b border-current/15">
          {ABOUT_COUNTERS.map((counter) => (
            <div key={counter.label} className="about-rv pt-4 border-t border-current/25">
              <span
                data-count-target={counter.value}
                className="block font-display text-6xl sm:text-7xl font-extrabold tracking-tight leading-none tabular-nums"
              >
                {String(counter.value).padStart(2, '0')}
              </span>
              <span className="block font-mono text-xs uppercase tracking-[0.16em] opacity-65 mt-3">
                {counter.label}
              </span>
            </div>
          ))}
        </div>

        {/* Education, Unboxed Skills, and Internship Accordion */}
        <div className="grid lg:grid-cols-12 gap-12 pt-12">
          <div className="lg:col-span-5 space-y-10">
            <div className="about-rv">
              <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] opacity-65 mb-5">
                <GraduationCap className="w-4 h-4 text-[#C82333]" aria-hidden="true" />
                <span>Education</span>
              </h3>

              <div className="divide-y divide-current/15 border-y border-current/15">
                {EDUCATION.map((edu) => (
                  <div key={edu.institution} className="py-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="font-display font-bold text-lg">{edu.institution}</h4>
                      <span className="font-mono text-xs tabular-nums text-[#C82333] font-semibold">
                        {edu.score}
                      </span>
                    </div>
                    <p className="text-sm opacity-85 mt-0.5">{edu.degree}</p>
                    <p className="font-mono text-xs opacity-60 mt-1 tabular-nums">
                      {edu.period} · {edu.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean Zero-Pill Technical Stack */}
            <div className="about-rv">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] opacity-65 mb-5">
                Technical Capabilities
              </h3>

              <div className="divide-y divide-current/15 border-y border-current/15">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.label} className="py-3.5 grid sm:grid-cols-12 gap-2">
                    <span className="sm:col-span-4 font-mono text-xs uppercase tracking-wider opacity-60 pt-0.5">
                      {group.label}
                    </span>
                    <span className="sm:col-span-8 text-sm font-medium leading-relaxed">
                      {group.items.join(' · ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 about-rv">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] opacity-65 mb-5">
              <Briefcase className="w-4 h-4 text-[#C82333]" aria-hidden="true" />
              <span>Internship Experience</span>
            </h3>

            <div className="space-y-4">
              {EXPERIENCES.map((exp) => {
                const isOpen = expandedExp === exp.id;
                return (
                  <div
                    key={exp.id}
                    className={`rounded-[50px] border transition-colors duration-300 overflow-hidden ${
                      isDarkSurface
                        ? 'bg-[#0E0F11] border-[#F7F4EE]/18'
                        : 'bg-[#FFFFFF] border-[#0E0F11]/15'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedExp(isOpen ? '' : exp.id)}
                      aria-expanded={isOpen}
                      className="w-full px-7 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333] rounded-[50px]"
                    >
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h4 className="font-display font-bold text-lg sm:text-xl">{exp.role}</h4>
                          <span className="text-sm font-medium text-[#C82333]">{exp.company}</span>
                        </div>
                        <p className="font-mono text-xs opacity-60 mt-1 tabular-nums">
                          {exp.period} · {exp.location}
                        </p>
                      </div>
                      <span
                        className={`w-9 h-9 rounded-full border border-current/20 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 border-[#C82333] text-[#C82333]' : ''
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-7 pb-6 pt-3 border-t border-current/12">
                        <p className="text-sm font-medium opacity-90 mb-3">{exp.summary}</p>
                        <ul className="space-y-2 text-sm opacity-75">
                          {exp.points.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="text-[#C82333] mt-0.5 text-xs" aria-hidden="true">
                                —
                              </span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
