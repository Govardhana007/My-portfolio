import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface MouseTrailProps {
  enabled?: boolean;
}

const SHAPE_COUNT = 16;

export function MouseTrail({ enabled = true }: MouseTrailProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>('.trail-node'));
    if (items.length === 0) return;

    const wrap = gsap.utils.wrap(0, items.length);
    const gap = isCoarsePointer ? 46 : 74;
    let index = 0;
    const mousePos = { x: -200, y: -200 };
    const lastMousePos = { x: -200, y: -200 };
    let hasMoved = false;

    const spawnShape = () => {
      const node = items[wrap(index)];
      gsap.killTweensOf(node);
      gsap.set(node, {
        clearProps: 'transform,opacity',
        left: mousePos.x,
        top: mousePos.y,
        xPercent: -50,
        yPercent: -50,
        opacity: 0.85,
        scale: 0,
        rotation: 0,
      });

      const tl = gsap.timeline();
      tl.to(node, {
        scale: 1,
        opacity: 0.85,
        duration: 0.45,
        ease: 'elastic.out(1, 0.45)',
      }).to(
        node,
        {
          rotation: gsap.utils.random(-260, 260),
          y: '+=150',
          opacity: 0,
          scale: 0.25,
          duration: 0.9,
          ease: 'back.in(0.5)',
        },
        0.12,
      );

      index += 1;
    };

    const tick = () => {
      if (!hasMoved) return;
      const dist = Math.hypot(lastMousePos.x - mousePos.x, lastMousePos.y - mousePos.y);
      if (dist > gap) {
        spawnShape();
        lastMousePos.x = mousePos.x;
        lastMousePos.y = mousePos.y;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      lastMousePos.x = e.clientX;
      lastMousePos.y = e.clientY;
      hasMoved = true;
      if (e.pointerType !== 'mouse') {
        spawnShape();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        lastMousePos.x = e.clientX;
        lastMousePos.y = e.clientY;
      }
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      if (!hasMoved) {
        hasMoved = true;
        lastMousePos.x = touch.clientX;
        lastMousePos.y = touch.clientY;
      }
      mousePos.x = touch.clientX;
      mousePos.y = touch.clientY;
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      gsap.ticker.remove(tick);
      items.forEach((n) => gsap.killTweensOf(n));
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-10 pointer-events-none overflow-hidden"
    >
      {Array.from({ length: SHAPE_COUNT }).map((_, i) => {
        const variant = i % 4;
        const color = i % 3 === 0 ? '#C82333' : i % 3 === 1 ? '#F7F4EE' : '#FFFFFF';
        return (
          <div
            key={i}
            className="trail-node fixed opacity-0 w-7 h-7 pointer-events-none"
            style={{ color }}
          >
            {variant === 0 && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
              </svg>
            )}
            {variant === 1 && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-full h-full"
              >
                <circle cx="12" cy="12" r="8" />
              </svg>
            )}
            {variant === 2 && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-full h-full"
              >
                <rect x="5" y="5" width="14" height="14" rx="7" transform="rotate(45 12 12)" />
              </svg>
            )}
            {variant === 3 && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <circle cx="12" cy="12" r="4.5" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
