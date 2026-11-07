// Backstage: Tidewater Records in Soho. The lobby (reception, gold discs, a neon logo) with a corridor of studio doors behind it,
// and Studio 2's control room (mixing desk, monitors, a glass window into the live room).
import { toon, toonMap, canvasTex, glow, MOBILE } from '../stage.js';

const basicM = (THREE, o = {}) => new THREE.MeshBasicMaterial({ toneMapped: false, ...o });
function neonTex(text, color, font = 'bold 64px sans-serif', w = 512, h = 128) {
  return canvasTex(w, h, (g) => { g.clearRect(0, 0, w, h); g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = color; g.shadowBlur = 18; g.fillStyle = '#fff'; g.fillText(text, w / 2, h / 2); g.shadowBlur = 0; g.fillStyle = color; g.globalAlpha = 0.35; g.fillText(text, w / 2, h / 2); });
}
const discTex = canvasTex(128, 160, (g, w, h) => {
  g.fillStyle = '#1b1b22'; g.fillRect(0, 0, w, h); g.fillStyle = '#c9a24a'; g.fillRect(4, 4, w - 8, h - 8); g.fillStyle = '#1b1b22'; g.fillRect(10, 10, w - 20, h - 20);
  const gr = g.createRadialGradient(64, 66, 4, 64, 66, 46); gr.addColorStop(0, '#fff3c0'); gr.addColorStop(0.3, '#e8c25a'); gr.addColorStop(1, '#9a7420');
  g.fillStyle = gr; g.beginPath(); g.arc(64, 66, 46, 0, 7); g.fill(); g.fillStyle = '#1b1b22'; g.beginPath(); g.arc(64, 66, 6, 0, 7); g.fill();
  g.fillStyle = '#e8d8b0'; g.fillRect(24, 128, 80, 6); g.fillRect(36, 138, 56, 4);
});

export function buildLabel(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl } = ctx;
  const basic = o => basicM(THREE, o);
  scene.background = new THREE.Color('#1a1820');
  scene.fog = new THREE.Fog('#1a1820', 12, 24);
  const W = 8, H = 3.2, front = 4, back = -1.2;   // lobby spans z back..front
  const CW = 2.4, CEnd = -8.5;                     // corridor: x ±CW/2, z back..CEnd

  // ------------------------------------------------ lobby: dark terrazzo, charcoal walls, warm wood slats
  const terr = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#3a3640'; g.fillRect(0, 0, w, h); g.globalAlpha = 0.45; for (let i = 0; i < 260; i++) { g.fillStyle = ['#c9a24a', '#6a6476', '#bdb2a4', '#4a4256'][(Math.random() * 4) | 0]; g.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 3, 2 + Math.random() * 3); } }, { repeat: [3, 3] });
  const floorM = toonMap(terr);
  add(new THREE.PlaneGeometry(W, front - back), floorM, 0, 0, (front + back) / 2, statics, { rot: [-Math.PI / 2, 0, 0] });
  add(new THREE.PlaneGeometry(CW, back - CEnd), floorM, 0, 0, (back + CEnd) / 2, statics, { rot: [-Math.PI / 2, 0, 0] });
  const wall = toon('#2c2a34'), slatM = toon('#5e3e28');
  // back wall of the lobby with the corridor opening in the middle
  add(box(W / 2 - CW / 2, H, 0.2), wall, -(W / 2 + CW / 2) / 2, H / 2, back - 0.1);
  add(box(W / 2 - CW / 2, H, 0.2), wall, (W / 2 + CW / 2) / 2, H / 2, back - 0.1);
  add(box(CW, H - 2.5, 0.2), wall, 0, 2.5 + (H - 2.5) / 2, back - 0.1);
  add(box(0.2, H, front - back), wall, -W / 2 - 0.1, H / 2, (front + back) / 2);
  add(box(0.2, H, front - back), wall, W / 2 + 0.1, H / 2, (front + back) / 2);
  add(box(W + 0.4, 0.1, front - back + 0.4), toon('#1e1c24'), 0, H + 0.05, (front + back) / 2);
  // wood slats behind reception
  for (let x = 1.2; x < 3.9; x += 0.16) add(box(0.08, H - 0.2, 0.06), slatM, x, H / 2, back + 0.02);
  // neon logo
  const logo = add(new THREE.PlaneGeometry(2.6, 0.65), basic({ map: neonTex('TIDEWATER', '#ff7ab8'), transparent: true, depthWrite: false }), 2.55, 2.45, back + 0.08);
  add(new THREE.PlaneGeometry(1.6, 0.3), basic({ map: neonTex('R E C O R D S', '#7ad8ff', 'bold 40px sans-serif', 512, 96), transparent: true, depthWrite: false }), 2.55, 2.02, back + 0.08);
  const lg = glow('#ff7ab8', 3.2, 0.35); lg.position.set(2.55, 2.4, back + 0.3); scene.add(lg);
  // gold discs on the left wall
  for (let i = 0; i < 5; i++) add(new THREE.PlaneGeometry(0.42, 0.52), toonMap(discTex), -W / 2 + 0.01, 1.7, back + 0.7 + i * 0.75, statics, { rot: [0, Math.PI / 2, 0] });
  // reception desk with the coffee tray
  add(box(2.6, 1.05, 0.7), toon('#e8e2d8'), 2.4, 0.525, 0.3); add(box(2.7, 0.06, 0.8), toon('#c9a24a'), 2.4, 1.08, 0.3);
  add(box(0.5, 0.32, 0.04), toon('#1b1b22'), 3.2, 1.28, 0.25); // a monitor
  const tray = new THREE.Group(); tray.position.set(1.7, 1.11, 0.35); scene.add(tray);
  add(box(0.42, 0.02, 0.3), toon('#3a2e2a'), 0, 0, 0, tray);
  for (const [x, z] of [[-0.12, -0.07], [0.0, 0.07], [0.12, -0.07], [-0.04, -0.02]]) { add(cyl(0.04, 0.032, 0.13, 10), toon('#f4efe8'), x, 0.075, z, tray); add(cyl(0.042, 0.042, 0.015, 10), toon('#3a2e2a'), x, 0.145, z, tray); }
  L.clues.tray = tray;
  // waiting corner: a velvet sofa, a big plant, a low table with magazines
  const sofa = place('Couch_Medium1', -2.9, 0, 1.4, Math.PI / 2, 0.55); sofa.traverse(o => { if (o.isMesh) o.material = toon('#7a3a5a'); });
  L.clues.sofa = sofa;
  const plant = place('Houseplant_7', -3.4, 0, -0.6, 0, 0.75); L.clues.plant = plant;
  place('Table_RoundSmall2', -1.9, 0, 1.4, 0, 0.45);
  place('Light_Ceiling1', 0, H - 0.6, 1.2, 0, 0.5); place('Light_Ceiling1', -2.4, H - 0.6, 1.2, 0, 0.5);

  // ------------------------------------------------ corridor: doors on both sides, acoustic panels, a red "ON AIR" light
  add(box(0.2, H, back - CEnd), wall, -CW / 2 - 0.1, H / 2, (back + CEnd) / 2);
  add(box(0.2, H, back - CEnd), wall, CW / 2 + 0.1, H / 2, (back + CEnd) / 2);
  add(box(CW + 0.4, H, 0.2), wall, 0, H / 2, CEnd - 0.1);
  add(box(CW + 0.4, 0.1, back - CEnd), toon('#1e1c24'), 0, H + 0.05, (back + CEnd) / 2);
  const doorM = toon('#5a3a2a'), handleM = toon('#c9a24a');
  const doors = { dl1: [-1, -2.9], dl2: [-1, -5.6], dr1: [1, -2.4], dr2: [1, -5.0] };
  for (const [k, [side, z]] of Object.entries(doors)) {
    const d = new THREE.Group(); d.position.set(side * (CW / 2 - 0.02), 0, z); scene.add(d);
    add(box(0.06, 2.1, 0.95), doorM, 0, 1.05, 0, d); add(box(0.08, 2.18, 1.05), toon('#1b1b22'), side * 0.01, 1.09, 0, d);
    add(box(0.1, 0.04, 0.14), handleM, -side * 0.05, 1.0, 0.33, d);
    add(new THREE.PlaneGeometry(0.22, 0.22), basic({ color: '#2a2a33' }), -side * 0.04, 1.6, 0, d, { rot: [0, -side * Math.PI / 2, 0] });
    const lamp = glow('#7ad8ff', 0.35, 0.8); lamp.position.set(-side * 0.08, 2.35, 0); d.add(lamp);
    L.clues[k] = d;
  }
  for (let z = -1.8; z > CEnd + 0.5; z -= 0.9) { if (Object.values(doors).some(([, dz]) => Math.abs(dz - z) < 0.7)) continue; for (const s of [-1, 1]) add(box(0.05, 0.8, 0.6), toon(z % 1.8 ? '#4a3a5a' : '#3a4a5a'), s * (CW / 2 - 0.03), 1.5, z); }
  for (let z = -2; z > CEnd; z -= 2) { const l = new THREE.PointLight('#ffd0a0', 1.2, 3.5, 1.6); l.position.set(0, H - 0.3, z); scene.add(l); }
  const onair = add(new THREE.PlaneGeometry(0.7, 0.2), basic({ map: neonTex('ON AIR', '#ff3a3a', 'bold 72px sans-serif', 384, 112), transparent: true, depthWrite: false }), 0, 2.6, CEnd + 0.02);

  // ------------------------------------------------ light
  scene.add(new THREE.HemisphereLight('#ffe6d6', '#2a2430', 1.3));
  const key = new THREE.DirectionalLight('#ffd9b8', 1.6); key.position.set(3, 5, 6); scene.add(key);
  if (!MOBILE) { key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0008; Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 20 }); }
  const warm = new THREE.PointLight('#ffb070', 2.4, 6, 1.5); warm.position.set(2.4, 2.4, 1.0); scene.add(warm);
  const pink = new THREE.PointLight('#ff7ab8', 1.6, 5, 1.6); pink.position.set(2.5, 2.4, back + 0.5); scene.add(pink);

  // ------------------------------------------------ people and shots; Kit stays out of sight until he walks out of Studio 2
  L.spots = {
    dana: { pos: [3.0, 0, -0.35], ry: -0.4, base: 'phone', side: -1 },
    sienna: { pos: [-1.6, 0, 1.6], ry: 0.55, base: 'fold', side: 1 },
    me: { pos: [-0.1, 0, 2.6], ry: Math.PI - 0.1, base: 'idle', side: 1 },
    kit: { pos: [-0.35, 0, -5.0], ry: 0.25, base: 'idle', side: 1 },
  };
  let kitShown = false;
  L.anims.push(() => { if (!kitShown && L.chars.kit) L.chars.kit.o.visible = false; });
  L.fx.kit = () => { kitShown = true; if (L.chars.kit) L.chars.kit.o.visible = true; };
  L.fx.reset = () => { kitShown = false; };
  L.pan = 1.4;
  L.shots = {
    establish: () => ({ pos: [-0.8, 2.0, 5.6], at: [0.8, 1.3, -0.8], portrait: { pos: [-0.3, 2.0, 6.0], at: [0.6, 1.1, -0.6], fov: 66 } }),
    wide: () => ({ pos: [-0.4, 2.2, 5.0], at: [0.2, 0.9, 0.4], portrait: { pos: [-0.2, 2.4, 5.6], at: [0.0, 0.8, 0.4], fov: 72 } }),
    corridor: () => ({ pos: [0, 1.7, 1.6], at: [0, 1.2, -6.5], portrait: { pos: [0, 1.7, 1.2], at: [0, 1.0, -6.5], fov: 70 } }),
    tray: () => ({ pos: [1.5, 1.6, 1.2], at: [1.7, 1.1, 0.35], fixed: true }),
  };
}

export function buildStudio(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl } = ctx;
  const basic = o => basicM(THREE, o);
  scene.background = new THREE.Color('#14121c');
  scene.fog = new THREE.Fog('#14121c', 9, 18);
  const W = 6, D = 5, H = 2.8, backZ = -D / 2;

  // ------------------------------------------------ shell: carpet, fabric panels in plum and teal
  const carpet = canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#2a2633'; g.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }, { repeat: [4, 4] });
  add(new THREE.PlaneGeometry(W, D), toonMap(carpet), 0, 0, 0, statics, { rot: [-Math.PI / 2, 0, 0] });
  const wall = toon('#26222e');
  // back wall with the glass into the live room
  const gx0 = -2.2, gx1 = 1.6, gy0 = 1.05, gy1 = 2.3;
  const piece = (x0, x1, y0, y1) => add(box(x1 - x0, y1 - y0, 0.25), wall, (x0 + x1) / 2, (y0 + y1) / 2, backZ - 0.12);
  piece(-W / 2, gx0, 0, H); piece(gx1, W / 2, 0, H); piece(gx0, gx1, 0, gy0); piece(gx0, gx1, gy1, H);
  add(new THREE.PlaneGeometry(gx1 - gx0, gy1 - gy0), new THREE.MeshBasicMaterial({ color: '#9ad8ff', transparent: true, opacity: 0.08, depthWrite: false }), (gx0 + gx1) / 2, (gy0 + gy1) / 2, backZ);
  for (const y of [gy0, gy1]) add(box(gx1 - gx0 + 0.1, 0.06, 0.3), toon('#1b1b22'), (gx0 + gx1) / 2, y, backZ);
  add(box(0.2, H, D), wall, -W / 2 - 0.1, H / 2, 0); add(box(0.2, H, D), wall, W / 2 + 0.1, H / 2, 0);
  add(box(W + 0.4, 0.1, D + 0.4), toon('#1a1820'), 0, H + 0.05, 0);
  const panelCols = ['#5a2e4a', '#2e4a5a', '#4a2e5a'];
  for (let i = 0; i < 6; i++) { add(box(0.06, 0.9, 0.7), toon(panelCols[i % 3]), -W / 2 + 0.03, 1.5, -1.9 + i * 0.8); add(box(0.06, 0.9, 0.7), toon(panelCols[(i + 1) % 3]), W / 2 - 0.03, 1.5, -1.9 + i * 0.8); }
  // the live room behind the glass: a drum kit, a mic stand, a warm lamp
  const LZ = backZ - 2.2;
  add(new THREE.PlaneGeometry(W, 4), toon('#3a2e2a'), 0, 0, backZ - 2, statics, { rot: [-Math.PI / 2, 0, 0] });
  add(box(W, H, 0.2), toon('#4a3a32'), 0, H / 2, backZ - 4);
  for (const [x, r] of [[-1.2, 0.3], [-0.6, 0.18], [-1.7, 0.2]]) add(cyl(r, r, 0.3, 16), toon('#b02a3a'), x, 0.5, LZ);
  add(cyl(0.22, 0.22, 0.02, 16), toon('#e8c25a'), -1.9, 1.0, LZ - 0.2);
  add(cyl(0.012, 0.012, 1.5, 6), toon('#888'), 0.6, 0.75, LZ + 0.3); add(cyl(0.035, 0.03, 0.12, 8), toon('#2a2a2a'), 0.6, 1.55, LZ + 0.3);
  const lr = new THREE.PointLight('#ffb070', 2.0, 5, 1.5); lr.position.set(0, 2.2, LZ); scene.add(lr);

  // ------------------------------------------------ the mixing desk: faders, glowing meters, two monitors, a laptop
  const deskTex = canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#1c1c24'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 24; i++) { const x = 10 + i * 20.8; g.fillStyle = '#0c0c10'; g.fillRect(x + 7, 50, 4, 70); g.fillStyle = '#d8d8e0'; g.fillRect(x + 2, 60 + ((i * 37) % 50), 14, 8); for (let k = 0; k < 3; k++) { g.fillStyle = ['#7ad8ff', '#ff7ab8', '#f2c94c'][k]; g.beginPath(); g.arc(x + 9, 10 + k * 13, 4, 0, 7); g.fill(); } }
  });
  add(box(2.6, 0.8, 0.9), toon('#3a2e2a'), -0.3, 0.4, -1.1);
  const top = add(new THREE.PlaneGeometry(2.5, 0.8), toonMap(deskTex, { emissive: '#ffffff', emissiveIntensity: 0.15 }), -0.3, 0.86, -1.1, statics, { rot: [-Math.PI / 2 + 0.25, 0, 0] });
  for (const x of [-1.4, 0.8]) { add(box(0.28, 0.42, 0.28), toon('#1b1b22'), x, 1.06, -1.35); add(cyl(0.08, 0.08, 0.02, 14), toon('#c9a24a'), x, 1.0, -1.205, statics, { rot: [Math.PI / 2, 0, 0] }); }
  add(box(0.7, 0.42, 0.04), basic({ color: '#2a3a55' }), -0.3, 1.18, -1.45);
  const meter = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#0c1020'; g.fillRect(0, 0, w, h); for (let i = 0; i < 30; i++) { const bh = 20 + Math.random() * 90; const gr = g.createLinearGradient(0, h, 0, h - bh); gr.addColorStop(0, '#4ae08a'); gr.addColorStop(0.7, '#f2c94c'); gr.addColorStop(1, '#ff4a4a'); g.fillStyle = gr; g.fillRect(6 + i * 8.2, h - bh, 6, bh); } });
  add(new THREE.PlaneGeometry(0.66, 0.38), basic({ map: meter }), -0.3, 1.18, -1.425);
  place('Chair_4', 0.6, 0, -0.2, Math.PI, 0.5); place('Couch_Small1', 2.4, 0, 1.2, -Math.PI / 2, 0.55);
  // LED strip and a neon note
  add(box(W, 0.03, 0.03), basic({ color: '#b07aff' }), 0, H - 0.08, backZ + 0.15);
  add(new THREE.PlaneGeometry(0.6, 0.6), basic({ map: neonTex('♪', '#b07aff', 'bold 100px sans-serif', 128, 128), transparent: true, depthWrite: false }), 2.4, 1.9, backZ + 0.02);

  scene.add(new THREE.HemisphereLight('#c8b8ff', '#201828', 1.0));
  const key = new THREE.PointLight('#ffd0a8', 3.2, 7, 1.4); key.position.set(0.5, 2.4, 1.2); scene.add(key);
  const purple = new THREE.PointLight('#b07aff', 2.0, 6, 1.5); purple.position.set(-2, 2.5, -1.8); scene.add(purple);
  const deskGlow = glow('#7ad8ff', 1.4, 0.25); deskGlow.position.set(-0.3, 1.0, -1.0); scene.add(deskGlow);

  L.spots = {
    leo: { pos: [0.85, 0, -0.35], ry: -0.6, base: 'idle', side: -1 },
    me: { pos: [-0.85, 0, 0.35], ry: 0.65, base: 'idle', side: 1 },
  };
  L.pan = 1.0;
  L.shots = {
    establish: () => ({ pos: [-0.4, 1.8, 3.4], at: [-0.2, 1.1, -1.8], portrait: { pos: [0.0, 1.9, 3.7], at: [0.0, 0.9, -1.6], fov: 70 } }),
    wide: () => ({ pos: [0.0, 1.7, 3.0], at: [0.0, 1.0, -0.6], portrait: { pos: [0.0, 1.8, 3.4], at: [0.0, 0.8, -0.6], fov: 72 } }),
    desk: () => ({ pos: [-0.2, 1.75, 0.3], at: [-0.3, 0.85, -1.15], fixed: true }),
  };
}
