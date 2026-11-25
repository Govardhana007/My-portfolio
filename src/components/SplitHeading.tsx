import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface SplitHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  staggerFrom?: 'start' | 'random' | 'center';
  immediate?: boolean;
}

export function SplitHeading({
  text,
  as = 'h2',
  className = '',
  staggerFrom = 'random',
  immediate = false,
}: SplitHeadingProps) {
  const rootRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const chars = el.querySelectorAll('.split-char');
      if (chars.length === 0) return;

      if (immediate) {
        gsap.fromTo(
          chars,
          { autoAlpha: 0, yPercent: 115 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: { each: 0.022, from: staggerFrom },
            delay: 0.25,
          },
        );
      } else {
        gsap.fromTo(
          chars,
          { autoAlpha: 0, yPercent: 115 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.95,
            ease: 'power3.out',
            stagger: { each: 0.018, from: staggerFrom },
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [immediate, staggerFrom, text]);

  const words = text.trim().split(' ');
  const Tag = as;

  return (
    <Tag ref={rootRef} aria-label={text} className={className}>
      {words.map((word, wIdx) => (
        <span key={wIdx}>
          <span className="split-word" aria-hidden="true">
            {[...word].map((char, cIdx) => (
              <span key={cIdx} className="split-char">
                {char}
              </span>
            ))}
          </span>
          {wIdx < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
