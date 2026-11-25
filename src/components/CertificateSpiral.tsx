import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Box, Grid3X3, RotateCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CERTIFICATES, CertificateItem, ThemeMode } from '../data/portfolio';
import { SplitHeading } from './SplitHeading';

gsap.registerPlugin(ScrollTrigger);

interface CertificateSpiralProps {
  themeMode: ThemeMode;
  onSelectCertificate: (cert: CertificateItem) => void;
}

export function CertificateSpiral({ themeMode, onSelectCertificate }: CertificateSpiralProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<'spiral' | 'grid'>('spiral');
  const [hoveredCert, setHoveredCert] = useState<CertificateItem | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const onSelectRef = useRef(onSelectCertificate);
  onSelectRef.current = onSelectCertificate;

  const isPaper = themeMode === 'paper';

  useEffect(() => {
    if (viewMode !== 'spiral' || webglFailed) return;
    const container = mountRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglFailed(true);
      setViewMode('grid');
      return;
    }

    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const glRenderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software Rasterizer/i.test(String(glRenderer));

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 560;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSoftwareGl ? 1 : 1.75));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const fogColor = isPaper ? 0xf7f4ee : 0x0e0f11;
    scene.fog = new THREE.FogExp2(fogColor, 0.011);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 200);
    camera.position.set(0, 0, 35);

    const totalCards = 18;
    const radius = 15;
    const angleStep = 0.42;
    const stepY = 2.2;
    const span = totalCards * angleStep;
    const cardW = 7.4;
    const cardH = 5.2;

    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      cardH,
      24,
      1,
      true,
      Math.PI - cardW / radius / 2,
      cardW / radius,
    );

    const createdTextures: THREE.CanvasTexture[] = [];
    const createdMaterials: THREE.MeshBasicMaterial[] = [];
    const cards: THREE.Mesh[] = [];

    const createCertificateTexture = (cert: CertificateItem) => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = isPaper ? '#E5E1D8' : '#0E0F11';
        ctx.fillRect(0, 0, 640, 450);
        ctx.fillStyle = isPaper ? '#0E0F11' : '#F7F4EE';
        ctx.font = '600 22px sans-serif';
        ctx.fillText(cert.title, 32, 215);
        ctx.fillStyle = '#C82333';
        ctx.font = '500 16px monospace';
        ctx.fillText(cert.issuer, 32, 248);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!ctx) return;
        const scale = Math.max(640 / img.width, 450 / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (640 - w) / 2, h > 450 ? 0 : (450 - h) / 2, w, h);
        ctx.strokeStyle = isPaper ? 'rgba(14,15,17,0.22)' : 'rgba(247,244,238,0.88)';
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, 632, 442);
        texture.needsUpdate = true;
      };
      img.src = cert.image;
      createdTextures.push(texture);
      return texture;
    };

    const textures = CERTIFICATES.map(createCertificateTexture);

    for (let i = 0; i < totalCards; i++) {
      const certIdx = i % CERTIFICATES.length;
      const material = new THREE.MeshBasicMaterial({
        map: textures[certIdx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      createdMaterials.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.certIndex = certIdx;
      cards.push(mesh);
      scene.add(mesh);
    }

    let progress = 0;
    let targetOffset = 0;
    let scrollOffset = 0;
    const entrance = { v: prefersReducedMotion ? 1 : 0 };
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let totalMoved = 0;
    let animFrame = 0;
    let isVisible = true;
    let lastFrameTime = 0;
    const minFrameGap = isSoftwareGl ? 60 : 0;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const pickCard = (clientX: number, clientY: number): THREE.Mesh | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(cards, false).find((hit) => {
        const mat = (hit.object as THREE.Mesh).material as THREE.MeshBasicMaterial;
        return mat && mat.opacity > 0.35;
      });
      return hits ? (hits.object as THREE.Mesh) : null;
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startTime = performance.now();
      totalMoved = 0;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        targetOffset += dx * 0.0065;
        totalMoved += Math.abs(dx) + Math.abs(dy);
        startX = e.clientX;
        startY = e.clientY;
        return;
      }
      const hit = pickCard(e.clientX, e.clientY);
      if (hit) {
        const cert = CERTIFICATES[hit.userData.certIndex as number];
        setHoveredCert(cert);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredCert(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
      if (totalMoved < 8 && performance.now() - startTime < 450) {
        const hit = pickCard(e.clientX, e.clientY);
        if (hit) {
          const cert = CERTIFICATES[hit.userData.certIndex as number];
          if (cert) onSelectRef.current(cert);
        }
      }
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        gsap.to(entrance, {
          v: 1,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true,
          },
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          scrollOffset = self.progress * span * 0.72;
        },
      });
    }, sectionRef);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(section);

    const domEl = renderer.domElement;
    domEl.style.cursor = 'grab';
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', onResize);

    const animate = (now: number) => {
      animFrame = window.requestAnimationFrame(animate);
      if (!isVisible) return;
      if (minFrameGap > 0 && now - lastFrameTime < minFrameGap) return;
      lastFrameTime = now;

      if (!isDragging && !prefersReducedMotion && !isSoftwareGl) {
        targetOffset += 0.0008;
      }

      progress += (targetOffset + scrollOffset - progress) * 0.16;

      const maxY = (span / 2) * stepY;
      cards.forEach((card, i) => {
        let angle = i * angleStep - progress;
        angle = (((angle % span) + span) % span) - span / 2;
        const y = angle * stepY;
        card.position.set(Math.sin(angle) * radius, y, Math.cos(angle) * radius - radius);
        card.lookAt(0, y, -radius);
        const norm = Math.abs(y) / (maxY * 0.85);
        const mat = card.material as THREE.MeshBasicMaterial;
        mat.opacity = (norm > 0.6 ? Math.max(0, 1 - (norm - 0.6) / 0.4) : 1) * entrance.v;
        card.scale.setScalar(0.55 + 0.45 * entrance.v);
      });

      renderer.render(scene, camera);
    };

    animFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animFrame);
      ctx.revert();
      observer.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      geometry.dispose();
      createdMaterials.forEach((m) => m.dispose());
      createdTextures.forEach((t) => t.dispose());
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, [viewMode, isPaper, webglFailed]);

  return (
    <section
      id="certificates"
      ref={sectionRef}
      data-section="certificates"
      className={`relative py-24 lg:py-32 transition-colors duration-500 border-t overflow-hidden ${
        isPaper
          ? 'bg-[#F7F4EE] text-[#0E0F11] border-[#0E0F11]/15'
          : 'bg-[#0E0F11] text-[#F7F4EE] border-[#F7F4EE]/15'
      }`}
      style={{
        backgroundImage: isPaper
          ? undefined
          : 'radial-gradient(55% 55% at 50% 54%, rgba(200, 35, 51, 0.22), transparent 72%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header & Mode Switch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-current/15">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C82333] mb-3">
              03 · Verified Credentials
            </p>
            <SplitHeading
              as="h2"
              text="Certificates"
              className="font-display font-extrabold tracking-tight text-5xl sm:text-6xl lg:text-7xl leading-[0.94]"
            />
          </div>

          <div className="flex items-center gap-3">
            {!webglFailed && (
              <div
                role="group"
                aria-label="Certificate viewer mode"
                className={`inline-flex items-center p-1 rounded-[50px] border ${
                  isPaper
                    ? 'bg-[#FFFFFF] border-[#0E0F11]/15'
                    : 'bg-[#0E0F11] border-[#F7F4EE]/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setViewMode('spiral')}
                  aria-pressed={viewMode === 'spiral'}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-[50px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333] ${
                    viewMode === 'spiral'
                      ? 'bg-[#C82333] text-[#FFFFFF]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>3D Spiral</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-[50px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333] ${
                    viewMode === 'grid'
                      ? 'bg-[#C82333] text-[#FFFFFF]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Archive Grid</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Interactive 3D Spiral View */}
        {viewMode === 'spiral' && !webglFailed ? (
          <div className="relative mt-8">
            <div
              ref={mountRef}
              className="w-full h-[460px] sm:h-[560px] rounded-[50px] overflow-hidden border border-current/15"
              aria-label="Interactive 3D certificate spiral. Drag horizontally or scroll to orbit; click any certificate to inspect."
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 min-h-[2.75rem]">
              <p className="inline-flex items-center gap-2 font-mono text-xs opacity-70">
                <RotateCw className="w-3.5 h-3.5 text-[#C82333]" aria-hidden="true" />
                <span>Drag or scroll to spin cylinder · Click any card to inspect PDF</span>
              </p>

              <p
                aria-live="polite"
                className={`px-5 py-2 rounded-[50px] border text-xs sm:text-sm font-medium transition-opacity duration-300 ${
                  hoveredCert
                    ? 'opacity-100 border-[#C82333] text-[#C82333]'
                    : 'opacity-0 border-transparent'
                }`}
              >
                {hoveredCert
                  ? `${hoveredCert.title} — ${hoveredCert.issuer} (${hoveredCert.date})`
                  : ''}
              </p>
            </div>
          </div>
        ) : (
          /* Clean 3-Column Archive Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
            {CERTIFICATES.map((cert) => (
              <article
                key={cert.id}
                className={`group rounded-[50px] border p-4 flex flex-col justify-between transition-colors duration-300 ${
                  isPaper
                    ? 'bg-[#FFFFFF] border-[#0E0F11]/15 hover:border-[#C82333]'
                    : 'bg-[#0E0F11] border-[#F7F4EE]/18 hover:border-[#C82333]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectCertificate(cert)}
                  className="relative w-full aspect-[4/3] rounded-[50px] overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333]"
                  aria-label={`Inspect ${cert.title} certificate`}
                >
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate from ${cert.issuer}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-[1.04]"
                  />
                </button>

                <div className="px-3 pt-4 pb-2 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs opacity-65 tabular-nums mb-1">
                      {cert.issuer} · {cert.date}
                    </p>
                    <h3 className="font-display font-bold text-lg leading-snug">{cert.title}</h3>
                    <p className="text-xs opacity-75 mt-1.5">{cert.credentialNote}</p>
                  </div>

                  <div className="pt-3 border-t border-current/12 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onSelectCertificate(cert)}
                      className="text-xs font-medium text-[#C82333] hover:underline cursor-pointer"
                    >
                      Inspect preview
                    </button>
                    <a
                      href={cert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium opacity-80 hover:opacity-100"
                    >
                      <span>Original PDF</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
