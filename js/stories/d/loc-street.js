// Backstage: a Soho back street at night behind the venue. Wet cobbles, a stage door, neon, and paparazzi with flashes.
import { toon, toonMap, canvasTex, glow, MOBILE } from '../stage.js';

export function buildStreet(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl } = ctx;
  const basic = o => new THREE.MeshBasicMaterial({ toneMapped: false, ...o });
  scene.background = new THREE.Color('#0d0d18');
  scene.fog = new THREE.Fog('#0d0d18', 9, 22);

  // ------------------------------------------------ wet cobbles with reflections of the neon
  const cobble = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#1c1c26'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 18) for (let x = (y / 18) % 2 ? -12 : 0; x < w; x += 24) { g.fillStyle = `hsl(240,8%,${14 + Math.random() * 8}%)`; g.beginPath(); g.ellipse(x + 12, y + 9, 10, 7, 0, 0, 7); g.fill(); }
    for (let i = 0; i < 18; i++) { g.fillStyle = ['rgba(255,90,170,.18)', 'rgba(90,200,255,.15)', 'rgba(255,190,90,.15)'][i % 3]; g.fillRect(Math.random() * w, Math.random() * h, 3, 30 + Math.random() * 40); }
  }, { repeat: [4, 4] });
  add(new THREE.PlaneGeometry(14, 12), toonMap(cobble, { emissive: '#ffffff', emissiveIntensity: 0.04 }), 0, 0, 1, statics, { rot: [-Math.PI / 2, 0, 0] });
  // brick walls: the venue behind, a building on the right
  const brick = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#2a2026'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { g.fillStyle = `hsl(10,${25 + Math.random() * 15}%,${16 + Math.random() * 8}%)`; g.fillRect(x + 1, y + 1, 30, 14); } }, { repeat: [5, 3] });
  const bm = toonMap(brick);
  add(box(14, 6, 0.3), bm, 0, 3, -1.6);
  add(box(0.3, 6, 10), bm, 4.2, 3, 2.4);
  // the stage door with a caged lamp
  add(box(1.1, 2.2, 0.1), toon('#3a3a44'), 0.0, 1.1, -1.42); add(box(1.3, 0.1, 0.2), toon('#5a5a66'), 0.0, 2.28, -1.4);
  add(new THREE.PlaneGeometry(0.6, 0.18), basic({ color: '#e8e2d8' }), 0.0, 1.85, -1.36);
  const dl = new THREE.PointLight('#ffd08a', 3.0, 5, 1.5); dl.position.set(0, 2.55, -1.1); scene.add(dl);
  const dg = glow('#ffd08a', 0.7, 0.9); dg.position.set(0, 2.55, -1.3); scene.add(dg);
  // neon sign of the venue
  const neon = canvasTex(512, 128, (g, w, h) => { g.font = 'italic bold 70px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#ff4aa8'; g.shadowBlur = 20; g.fillStyle = '#ffd0ea'; g.fillText('The Lantern', w / 2, h / 2); });
  add(new THREE.PlaneGeometry(2.4, 0.6), basic({ map: neon, transparent: true, depthWrite: false }), -2.3, 3.2, -1.43);
  const ng = glow('#ff4aa8', 3.5, 0.45); ng.position.set(-2.3, 3.2, -1.2); scene.add(ng);
  const nl = new THREE.PointLight('#ff4aa8', 2.4, 7, 1.4); nl.position.set(-2.3, 3.0, -0.6); scene.add(nl);
  // street furniture
  place('Streetlight_Single', 3.4, 0, 0.5, -Math.PI / 2, 0.6); place('Trashcan_Small1', 2.2, 0, -1.2, 0, 0.55); place('Trashcan_Small1', 2.8, 0, -1.25, 0.4, 0.55);
  place('Sign_NoParking', -3.6, 0, -1.2, 0, 0.6);
  for (const [x, z] of [[-1.4, -1.3], [-1.0, -1.25]]) add(box(0.5, 0.5, 0.4), toon('#5a4a3a'), x, 0.25, z); // flight cases from the gig
  const sl = new THREE.PointLight('#ffb070', 2.2, 7, 1.5); sl.position.set(3.0, 3.4, 0.5); scene.add(sl);
  const sg = glow('#ffcf8a', 1.0, 0.7); sg.position.set(3.0, 3.45, 0.5); scene.add(sg);
  scene.add(new THREE.HemisphereLight('#4a4a7a', '#140c14', 0.9));
  const moon = new THREE.DirectionalLight('#7a8aff', 0.7); moon.position.set(-3, 6, 4); scene.add(moon);

  // drizzle in the lamp light
  const N = MOBILE ? 120 : 260, p = new Float32Array(N * 6);
  for (let i = 0; i < N; i++) { const x = -5 + Math.random() * 10, y = Math.random() * 5, z = -1 + Math.random() * 6; p.set([x, y, z, x - 0.01, y - 0.18, z], i * 6); }
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(p, 3));
  scene.add(new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: '#9ab0e0', transparent: true, opacity: 0.35 })));
  L.anims.push(dt => { const a = rg.attributes.position.array; for (let i = 0; i < N; i++) { const j = i * 6; let y = a[j + 1] - dt * 6; if (y < 0) y += 5; a[j + 1] = y; a[j + 4] = y - 0.18; } rg.attributes.position.needsUpdate = true; });

  // ------------------------------------------------ camera flashes: a burst of white lights at the paparazzi
  const flashes = [[-1.3, 1.75, 2.4], [0.1, 1.7, 2.75], [1.3, 1.8, 2.45]].map(pos => {
    const l = new THREE.PointLight('#ffffff', 0, 6, 1.2); l.position.set(...pos); scene.add(l);
    const s = glow('#ffffff', 0.9, 0); s.position.set(...pos); scene.add(s);
    return { l, s, t: 0 };
  });
  let burst = 0;
  L.fx.flash = () => { burst = 1.6; };
  L.fx.reset = () => { burst = 0; };
  L.anims.push(dt => {
    burst = Math.max(0, burst - dt);
    for (const f of flashes) {
      f.t = Math.max(0, f.t - dt * 7);
      if (burst > 0 && f.t <= 0 && Math.random() < dt * 5) f.t = 1;
      f.l.intensity = f.t * 30; f.s.material.opacity = f.t;
    }
  });

  // ------------------------------------------------ people and shots
  L.spots = {
    kit: { pos: [0.3, 0, 0.4], ry: 0.15, base: 'idle', side: 1 },
    me: { pos: [-0.35, 0, 0.55], ry: -0.05, base: 'idle', side: -1 },
    pap1: { pos: [-1.3, 0, 2.6], ry: Math.PI - 0.35, base: 'phone' },
    pap2: { pos: [0.1, 0, 2.95], ry: Math.PI, base: 'phone' },
    pap3: { pos: [1.3, 0, 2.65], ry: Math.PI + 0.35, base: 'phone' },
  };
  L.pan = 1.2;
  L.shots = {
    establish: () => ({ pos: [2.6, 2.4, 6.2], at: [-0.3, 1.4, -0.6], portrait: { pos: [1.6, 2.4, 6.6], at: [-0.1, 1.2, -0.4], fov: 68 } }),
    wide: () => ({ pos: [0.6, 1.9, 5.4], at: [0.0, 1.2, 0.0], portrait: { pos: [0.4, 2.0, 6.0], at: [0.0, 1.0, 0.0], fov: 70 } }),
    flash: () => ({ pos: [0.6, 1.75, 4.2], at: [0.0, 1.35, 0.3], portrait: { pos: [0.4, 1.8, 4.6], at: [0.0, 1.2, 0.3], fov: 66 } }),
  };
}
