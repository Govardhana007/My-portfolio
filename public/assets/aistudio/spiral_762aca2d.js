/* ===== spiral.js: 3D certificate spiral (three.js), adapted from your Infinite Image Spiral ===== */
(function () {
  const host = document.getElementById('spiral'), cap = document.getElementById('cap');
  if (!host || !window.THREE) return;
  const items = [...document.querySelectorAll('#certs a')].map(a => ({ pdf: a.href, img: a.dataset.img, label: a.textContent }));
  const N = 18, R = 15, STEP = 0.42, STEP_Y = 2.2, SPAN = N * STEP, CW = 7.4, CH = 5.2;
  let scene, cam, ren, cards = [], prog = 0, tgt = 0, dir = 1, run = false, built = false, looping = false;
  let sc = 0, ent = { v: 0 };
  let drag = false, x0 = 0, y0 = 0, t0 = 0, moved = 0;
  const ray = new THREE.Raycaster(), v = new THREE.Vector2();

  function texture(src) {
    const c = document.createElement('canvas'); c.width = 640; c.height = 450;
    const x = c.getContext('2d'); x.fillStyle = '#DEDCDC'; x.fillRect(0, 0, 640, 450);
    const t = new THREE.CanvasTexture(c), im = new Image();
    im.onload = () => {
      const s = Math.max(640 / im.width, 450 / im.height), w = im.width * s, h = im.height * s;
      x.drawImage(im, (640 - w) / 2, h > 450 ? 0 : (450 - h) / 2, w, h);
      x.strokeStyle = 'rgba(247,244,238,.9)'; x.lineWidth = 10; x.strokeRect(5, 5, 630, 440);
      t.needsUpdate = true;
    };
    im.src = (window.CERT_IMGS && CERT_IMGS[src]) || src; return t;
  }
  function build() {
    const W = host.clientWidth, H = host.clientHeight;
    scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x0e0f11, 0.012);
    cam = new THREE.PerspectiveCamera(45, W / H, 0.1, 200); cam.position.set(0, 0, 36);
    ren = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ren.setPixelRatio(Math.min(devicePixelRatio, 1.5)); ren.setSize(W, H); host.appendChild(ren.domElement);
    const geo = new THREE.CylinderGeometry(R, R, CH, 24, 1, true, Math.PI - CW / R / 2, CW / R), tex = items.map(i => texture(i.img));
    for (let i = 0; i < N; i++) {
      const k = i % items.length, m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex[k], side: THREE.DoubleSide, transparent: true }));
      m.userData.k = k; cards.push(m); scene.add(m);
    }
    const el = ren.domElement;
    el.addEventListener('pointerdown', e => { drag = true; x0 = e.clientX; y0 = e.clientY; t0 = performance.now(); moved = 0; host.style.cursor = 'grabbing'; });
    addEventListener('pointermove', e => {
      if (drag) { tgt += (e.clientX - x0) * 0.006; moved += Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0); x0 = e.clientX; y0 = e.clientY; }
      else if (run) { const h = pick(e); cap.textContent = h ? items[h.userData.k].label : ''; el.style.cursor = h ? 'pointer' : 'grab'; }
    });
    addEventListener('pointerup', e => {
      if (!drag) return; drag = false; host.style.cursor = 'grab';
      if (moved < 8 && performance.now() - t0 < 400) { const h = pick(e); h ? window.open(items[h.userData.k].pdf, '_blank', 'noopener') : 0; }
    });
    addEventListener('pointercancel', () => { drag = false; host.style.cursor = 'grab'; });
    addEventListener('resize', () => { const W = host.clientWidth, H = host.clientHeight; cam.aspect = W / H; cam.updateProjectionMatrix(); ren.setSize(W, H); });
  }
  function pick(e) {
    const r = ren.domElement.getBoundingClientRect();
    v.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(v, cam);
    const h = ray.intersectObjects(cards, false).find(x => x.object.material.opacity > 0.4);
    return h && h.object;
  }
  function place() {
    const maxY = (SPAN / 2) * STEP_Y;
    cards.forEach((c, i) => {
      let a = i * STEP - prog; a = ((a % SPAN) + SPAN) % SPAN - SPAN / 2;
      const y = a * STEP_Y; c.position.set(Math.sin(a) * R, y, Math.cos(a) * R - R); c.lookAt(0, y, -R);
      const n = Math.abs(y) / (maxY * 0.85); c.material.opacity = (n > 0.6 ? Math.max(0, 1 - (n - 0.6) / 0.4) : 1) * ent.v; c.scale.setScalar(0.5 + 0.5 * ent.v);
    });
  }
  function loop() {
    if (!run) { looping = false; return; }
    requestAnimationFrame(loop);
    prog += (tgt + sc - prog) * 0.18; place(); ren.render(scene, cam);
  }
  window.Spiral = { scroll(p) { sc = p * SPAN * 0.65; }, set(on) {
    run = on; if (!on) return;
    if (!built) { build(); built = true; gsap.to(ent, { v: 1, duration: 1.8, ease: 'power3.out' }); }
    if (!looping) { looping = true; loop(); }
  } };
})();
