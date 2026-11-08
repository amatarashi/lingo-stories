// Backstage: the Camden flat you share with Ava. Morning light, or night with fairy lights and the phone glow (mood 'night').
import { toon, toonMap, canvasTex, glow, MOBILE } from '../stage.js';

// London rooftops through the window: chimneys, a crane, the sky (day or night)
function roofsTex(night) {
  return canvasTex(512, 256, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h);
    if (night) { sky.addColorStop(0, '#141a33'); sky.addColorStop(1, '#4a3a5c'); } else { sky.addColorStop(0, '#a9c8e6'); sky.addColorStop(1, '#f6dcc4'); }
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    if (night) for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(Math.random() * w, Math.random() * h * 0.4, 1.5, 1.5); }
    // far skyline
    g.fillStyle = night ? '#232339' : '#9aa3b4';
    for (let x = 0; x < w; x += 26) { const bh = 40 + Math.random() * 70; g.fillRect(x, h * 0.62 - bh, 24, bh + 10); }
    g.fillRect(380, 30, 6, 120); g.fillRect(330, 34, 120, 5); // a crane
    // near roofs with chimneys
    g.fillStyle = night ? '#2b2230' : '#8a5a4a';
    g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 64) { g.lineTo(x, h * 0.7); g.lineTo(x + 32, h * 0.6); } g.lineTo(w, h); g.fill();
    for (let x = 30; x < w; x += 110) { g.fillRect(x, h * 0.48, 16, 40); g.fillStyle = night ? '#3a2e3a' : '#b0705a'; g.fillRect(x - 2, h * 0.46, 20, 6); g.fillStyle = night ? '#2b2230' : '#8a5a4a'; }
    if (night) for (let i = 0; i < 26; i++) { g.fillStyle = Math.random() < 0.5 ? '#ffd27a' : '#ffb35a'; g.fillRect(Math.random() * w, h * 0.3 + Math.random() * h * 0.3, 4, 5); }
  });
}
function posterTex(bg, fg, title, sub) {
  return canvasTex(128, 180, (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = fg; g.beginPath(); g.arc(w / 2, h * 0.42, 34, 0, 7); g.fill();
    g.font = 'bold 16px sans-serif'; g.textAlign = 'center'; g.fillText(title, w / 2, h * 0.8); g.font = '10px sans-serif'; g.fillText(sub, w / 2, h * 0.9);
  });
}

export function buildFlat(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl, mood } = ctx;
  const night = mood === 'night';
  const basic = o => new THREE.MeshBasicMaterial({ toneMapped: false, ...o });
  scene.background = new THREE.Color(night ? '#1c1826' : '#efe3d6');
  scene.fog = new THREE.Fog(night ? '#1c1826' : '#efe3d6', 10, 22);
  const W = 7, D = 5.5, H = 2.8, backZ = -D / 2;

  // ------------------------------------------------ shell: herringbone floor, blush walls, one exposed-brick wall
  const floor = canvasTex(256, 256, (g, w, h) => { g.fillStyle = night ? '#3a2a22' : '#8a6a4a'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 64) { g.fillStyle = `hsl(30,${30 + Math.random() * 10}%,${night ? 30 : 58 + Math.random() * 6}%)`; g.fillRect(x + ((y / 16) % 2) * 32, y, 62, 14); } }, { repeat: [3, 3] });
  add(new THREE.PlaneGeometry(W, D), toonMap(floor), 0, 0, 0, statics, { rot: [-Math.PI / 2, 0, 0] });
  const wall = toon(night ? '#6a5560' : '#f0cfc4');
  const brick = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#b8a69a'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { g.fillStyle = `hsl(12,${40 + Math.random() * 15}%,${38 + Math.random() * 10}%)`; g.fillRect(x + 1, y + 1, 30, 14); } }, { repeat: [3, 2] });
  // back wall with a big sash window
  const wx0 = -0.6, wx1 = 2.2, wy0 = 0.85, wy1 = 2.35;
  const piece = (x0, x1, y0, y1) => add(box(x1 - x0, y1 - y0, 0.2), wall, (x0 + x1) / 2, (y0 + y1) / 2, backZ - 0.1);
  piece(-W / 2, wx0, 0, H); piece(wx1, W / 2, 0, H); piece(wx0, wx1, 0, wy0); piece(wx0, wx1, wy1, H);
  add(new THREE.PlaneGeometry(wx1 - wx0, wy1 - wy0), basic({ map: roofsTex(night) }), (wx0 + wx1) / 2, (wy0 + wy1) / 2, backZ - 0.3);
  const fr = toon('#f4efe8');
  for (const y of [wy0, (wy0 + wy1) / 2, wy1]) add(box(wx1 - wx0 + 0.12, 0.07, 0.18), fr, (wx0 + wx1) / 2, y, backZ);
  for (const x of [wx0, (wx0 + wx1) / 2, wx1]) add(box(0.07, wy1 - wy0, 0.16), fr, x, (wy0 + wy1) / 2, backZ);
  add(box(wx1 - wx0 + 0.2, 0.05, 0.3), fr, (wx0 + wx1) / 2, wy0 - 0.02, backZ + 0.12);
  add(box(0.2, H, D), toonMap(brick), -W / 2 - 0.1, H / 2, 0);
  add(box(0.2, H, D), wall, W / 2 + 0.1, H / 2, 0);
  add(box(W + 0.4, 0.1, D + 0.4), toon(night ? '#3a3040' : '#fbf4ee'), 0, H + 0.05, 0);

  // ------------------------------------------------ kitchen corner (left), living corner (right)
  place('Kitchen_2Drawers', -2.9, 0, -2.3, 0, 0.5); place('Kitchen_Sink', -2.0, 0, -2.3, 0, 0.5); place('Kitchen_Fridge', -3.15, 0, -1.2, Math.PI / 2, 0.5);
  place('Kitchen_Cabinet1', -2.4, 1.5, -2.55, 0, 0.5);
  // a kettle and two mugs
  add(cyl(0.09, 0.11, 0.2, 14), toon('#e86a6a'), -2.6, 1.0, -2.3); add(cyl(0.05, 0.05, 0.1, 10), toon('#f4efe8'), -2.2, 0.97, -2.2); add(cyl(0.05, 0.05, 0.1, 10), toon('#f2c94c'), -2.05, 0.97, -2.3);
  place('Couch_Medium1', 2.4, 0, 0.6, -Math.PI / 2, 0.55); place('Carpet_Round', 1.4, 0.005, 0.6, 0, 0.6);
  // a low coffee table (own geometry: its top height is known for the close-ups)
  add(cyl(0.42, 0.42, 0.05, 24), toon('#e8dccb'), 1.35, 0.4, 0.65); add(cyl(0.05, 0.08, 0.38, 10), toon('#7a5236'), 1.35, 0.19, 0.65);
  place('Houseplant_5', 3.1, 0, -2.3, 0, 0.6); place('Houseplant_1', -1.0, 0, -2.4, 0, 0.5); place('Shelf_Small1', 3.35, 1.4, -0.8, -Math.PI / 2, 0.5);
  // posters on the right wall, a mirror, a vinyl player
  const posters = [['#2b2b4a', '#e98ac8', 'VELVET', 'static'], ['#f2c94c', '#2b2b4a', 'SOHO', 'jazz club'], ['#e86a6a', '#f4efe8', 'LDN', 'calling']];
  posters.forEach(([bg, fg, t, s], i) => add(new THREE.PlaneGeometry(0.5, 0.7), toonMap(posterTex(bg, fg, t, s)), W / 2 - 0.01, 1.65, -1.6 + i * 0.7, statics, { rot: [0, -Math.PI / 2, 0] }));
  add(box(0.6, 0.18, 0.45), toon('#3a2e2a'), -3.1, 0.75, 1.4); add(cyl(0.18, 0.18, 0.02, 24), toon('#141414'), -3.1, 0.86, 1.4);
  add(box(0.6, 0.75, 0.45), toon('#7a5236'), -3.1, 0.37, 1.4);
  // the hero's pass on the table (clue shot), Ava's phone, a notebook (night diary)
  const badge = new THREE.Group(); badge.position.set(1.22, 0.428, 0.52); scene.add(badge);
  add(box(0.1, 0.004, 0.14), toon('#f4efe8'), 0, 0, 0, badge); add(box(0.08, 0.005, 0.03), toon('#2f6f8a'), 0, 0.001, -0.04, badge);
  add(box(0.01, 0.003, 0.3), toon('#e98ac8'), 0, 0.001, 0.2, badge);
  L.clues.badge = badge;
  const diary = new THREE.Group(); diary.position.set(1.45, 0.438, 0.78); diary.rotation.y = 0.4; scene.add(diary);
  add(box(0.16, 0.025, 0.22), toon('#c76b98'), 0, 0, 0, diary); add(box(0.15, 0.02, 0.005), toon('#f4efe8'), 0, 0, 0.11, diary);
  add(cyl(0.006, 0.006, 0.16, 6), toon('#2f6f8a'), 0.12, 0.01, 0, diary, { rot: [Math.PI / 2, 0, 0] });

  // ------------------------------------------------ light
  if (night) {
    scene.add(new THREE.HemisphereLight('#8a7aa8', '#2a2030', 0.9));
    const lamp = new THREE.PointLight('#ffb36a', 3.4, 7, 1.4); lamp.position.set(2.6, 1.6, -1.6); scene.add(lamp);
    place('Light_Floor1', 3.0, 0, -1.7, 0, 0.5);
    const moon = new THREE.DirectionalLight('#8fa8ff', 0.6); moon.position.set(1, 3, -6); scene.add(moon);
    // fairy lights along the brick wall
    for (let i = 0; i < 18; i++) { const z = -2.5 + i * 0.28, y = 2.35 - Math.sin(i * 0.9) * 0.08; const s = glow(i % 2 ? '#ffd27a' : '#ff9ac8', 0.22, 0.9); s.position.set(-W / 2 + 0.05, y, z); scene.add(s); }
    const fl = new THREE.PointLight('#ffc0a0', 1.4, 5, 1.6); fl.position.set(-3.0, 2.2, 0); scene.add(fl);
  } else {
    scene.add(new THREE.HemisphereLight('#fff4e6', '#8a6a5a', 1.6));
    const sun = new THREE.DirectionalLight('#ffe2c0', 2.4); sun.position.set(1.5, 4, -7); sun.target.position.set(0, 0, 1); scene.add(sun, sun.target);
    if (!MOBILE) { sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -0.0008; Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 20 }); }
    const s = glow('#fff2d6', 2.4, 0.25); s.position.set(0.8, 1.6, backZ + 0.2); scene.add(s);
  }

  // ------------------------------------------------ people and shots
  L.spots = {
    ava: { pos: [0.55, 0, -0.5], ry: -0.55, base: 'idle', side: -1 },
    me: { pos: [-0.75, 0, 0.0], ry: 0.6, base: 'idle', side: 1 },
  };
  L.pan = 1.2;
  L.shots = {
    establish: () => ({ pos: [-0.6, 1.8, 3.6], at: [0.2, 1.1, -1.6], portrait: { pos: [-0.2, 1.8, 3.8], at: [0.1, 0.9, -1.4], fov: 68 } }),
    wide: () => ({ pos: [-0.2, 1.7, 3.2], at: [0.0, 1.0, -0.8], portrait: { pos: [0.0, 1.8, 3.6], at: [0.0, 0.8, -0.8], fov: 70 } }),
    badge: () => ({ pos: [1.05, 0.95, 1.05], at: [1.25, 0.43, 0.55], fixed: true }),
    diary: () => ({ pos: [1.25, 0.95, 1.3], at: [1.45, 0.44, 0.75], fixed: true }),
  };
}
