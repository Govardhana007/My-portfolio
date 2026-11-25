import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { ThemeMode } from '../data/portfolio';

interface HeroNeuralBackdropProps {
  themeMode: ThemeMode;
}

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  layer: number;
  phase: number;
}

interface SynapticPulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

export function HeroNeuralBackdrop({ themeMode }: HeroNeuralBackdropProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const aiLayerRef = useRef<HTMLDivElement | null>(null);

  const isPaper = themeMode === 'paper';

  // Gentle ambient breathing motion on the layered AI neural backdrop image
  useEffect(() => {
    const aiLayer = aiLayerRef.current;
    if (!aiLayer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.to(aiLayer, {
        scale: 1.07,
        rotation: 1.5,
        duration: 14,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, []);

  // Interactive 60fps Canvas Neural Network + Traveling Synaptic Pulses
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = wrapper.clientWidth || 1280;
    let height = wrapper.clientHeight || 800;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = wrapper.clientWidth || window.innerWidth;
      height = wrapper.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const nodeCount = width < 768 ? 34 : 62;
    const maxDist = width < 768 ? 135 : 175;
    const nodes: NeuralNode[] = Array.from({ length: nodeCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      radius: 1.3 + Math.random() * 2.1,
      layer: Math.random(),
      phase: Math.random() * Math.PI * 2,
    }));

    const pulses: SynapticPulse[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let isVisible = true;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    observer.observe(wrapper);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    wrapper.addEventListener('pointerleave', onPointerLeave);

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const lineBase = isPaper ? '14, 15, 17' : '247, 244, 238';
      const accentRgb = '200, 35, 51';

      // Update nodes
      if (!prefersReduced) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;

          if (pointer.active) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 10 && dist < 190) {
              const pull = ((190 - dist) / 190) * 0.014;
              n.x += dx * pull;
              n.y += dy * pull;
            }
          }
        }
      }

      // Draw synaptic connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const strength = 1 - dist / maxDist;
            const nearPointer =
              pointer.active &&
              Math.hypot(pointer.x - (a.x + b.x) * 0.5, pointer.y - (a.y + b.y) * 0.5) < 160;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = nearPointer
              ? `rgba(${accentRgb}, ${(strength * 0.48).toFixed(3)})`
              : `rgba(${lineBase}, ${(strength * (isPaper ? 0.12 : 0.15)).toFixed(3)})`;
            ctx.lineWidth = nearPointer ? 1.2 : 0.8;
            ctx.stroke();

            // Occasionally spawn traveling inference signal pulse
            if (!prefersReduced && pulses.length < 18 && Math.random() < 0.0022) {
              pulses.push({
                fromIdx: i,
                toIdx: j,
                progress: 0,
                speed: 0.018 + Math.random() * 0.022,
              });
            }
          }
        }
      }

      // Draw traveling neural signal pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }
        const from = nodes[pulse.fromIdx];
        const to = nodes[pulse.toIdx];
        if (!from || !to) {
          pulses.splice(p, 1);
          continue;
        }
        const px = from.x + (to.x - from.x) * pulse.progress;
        const py = from.y + (to.y - from.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, 0.92)`;
        ctx.fill();
      }

      // Draw neural nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const glow = 0.55 + 0.45 * Math.sin(time * 0.0018 + n.phase);
        const isAccentNode = i % 5 === 0;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isAccentNode
          ? `rgba(${accentRgb}, ${(0.45 + 0.4 * glow).toFixed(3)})`
          : `rgba(${lineBase}, ${(isPaper ? 0.28 : 0.38 * glow).toFixed(3)})`;
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      rafId = window.requestAnimationFrame(loop);
      if (!isVisible) return;
      drawFrame(time);
    };

    if (prefersReduced) {
      drawFrame(0);
    } else {
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      wrapper.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [isPaper]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Layered AI Neural Network Graphic with soft studio blend */}
      <div
        ref={aiLayerRef}
        className={`absolute inset-0 will-change-transform ${
          isPaper ? 'opacity-[0.06]' : 'opacity-[0.18]'
        }`}
      >
        <img
          src="/assets/aistudio/images001_7b991a24.jpg"
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center ${
            isPaper ? 'grayscale contrast-125' : 'grayscale-[55%] contrast-110 mix-blend-screen'
          }`}
        />
      </div>

      {/* Live Interactive Neural Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Studio Contrast Scrim ensuring razor-sharp readability behind "Hi, I'm" typography */}
      <div
        className="absolute inset-0"
        style={{
          background: isPaper
            ? 'linear-gradient(90deg, rgba(247,244,238,0.92) 0%, rgba(247,244,238,0.68) 52%, rgba(247,244,238,0.45) 100%), linear-gradient(180deg, rgba(247,244,238,0.4) 0%, rgba(247,244,238,0.85) 100%)'
            : 'linear-gradient(90deg, rgba(14,15,17,0.92) 0%, rgba(14,15,17,0.72) 50%, rgba(14,15,17,0.42) 100%), linear-gradient(180deg, rgba(14,15,17,0.35) 0%, rgba(14,15,17,0.88) 100%)',
        }}
      />

      {/* Subtle Crimson Ambient Studio Rim Glow */}
      <div
        className="absolute -top-24 right-[8%] w-[560px] h-[560px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #C82333 0%, transparent 70%)' }}
      />
    </div>
  );
}
