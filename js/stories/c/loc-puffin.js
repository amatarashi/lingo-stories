// Fresh Start: The Puffin, Fiona's café on Harbour Street (bright autumn afternoon), and your little room upstairs.
import { toon, toonMap, canvasTex, glow, MOBILE } from '../stage.js';

const basicM = (THREE, o = {}) => new THREE.MeshBasicMaterial({ toneMapped: false, ...o });
// the harbour seen through a window: sky, sea, boats, the far shore
function harbourTex(evening = false) {
  return canvasTex(512, 256, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.55);
    if (evening) { sky.addColorStop(0, '#3a4a78'); sky.addColorStop(1, '#f0a07a'); } else { sky.addColorStop(0, '#9cc0dc'); sky.addColorStop(1, '#f4dcc0'); }
    g.fillStyle = sky; g.fillRect(0, 0, w, h * 0.55);
    g.fillStyle = evening ? '#4d5866' : '#7d8f8a'; g.beginPath(); g.moveTo(0, h * 0.55); for (let x = 0; x <= w; x += 32) g.lineTo(x, h * 0.55 - 14 - Math.sin(x / 70) * 10); g.lineTo(w, h * 0.55); g.fill();
    const sea = g.createLinearGradient(0, h * 0.55, 0, h); sea.addColorStop(0, evening ? '#7a7f96' : '#7fa6b8'); sea.addColorStop(1, evening ? '#2e3a4c' : '#3f6478'); g.fillStyle = sea; g.fillRect(0, h * 0.55, w, h);
    for (const [x, c] of [[90, '#c9473a'], [300, '#f2c230'], [420, '#2f6f8a']]) { g.fillStyle = c; g.beginPath(); g.moveTo(x, h * 0.72); g.lineTo(x + 46, h * 0.72); g.lineTo(x + 38, h * 0.79); g.lineTo(x + 6, h * 0.79); g.fill(); g.fillStyle = '#f2ece0'; g.fillRect(x + 20, h * 0.6, 3, 34); g.beginPath(); g.moveTo(x + 23, h * 0.6); g.lineTo(x + 40, h * 0.69); g.lineTo(x + 23, h * 0.69); g.fill(); }
    g.fillStyle = '#6b6258'; g.fillRect(0, h * 0.86, w, h * 0.14); // the quay
  });
}

export function buildPuffin(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl, head } = ctx;
  const basic = o => basicM(THREE, o);
  scene.background = new THREE.Color('#e9dcc8');
  scene.fog = new THREE.Fog('#efe2cf', 12, 26);
  const W = 9, D = 7, H = 3.0, backZ = -D / 2;

  // ------------------------------------------------ shell: honey planks, cream walls, sage wainscot
  const floorTex = canvasTex(256, 256, (g, w, h) => {
    for (let y = 0; y < h; y += 32) for (let x = (y / 32) % 2 ? -60 : 0; x < w; x += 120) { g.fillStyle = `hsl(32,${45 + Math.random() * 10}%,${52 + Math.random() * 8}%)`; g.fillRect(x, y, 118, 30); g.fillStyle = 'rgba(90,55,25,.3)'; g.fillRect(x, y + 30, 120, 2); }
  }, { repeat: [3, 3] });
  const wallTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f1e6d2'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(200,170,130,.12)'; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * w, Math.random() * h, 30, 2); }, { repeat: [3, 1] });
  const wainTex = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#8fa58c'; g.fillRect(0, 0, w, h); g.fillStyle = '#7b9178'; for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 3, h); g.fillStyle = '#f2ece0'; g.fillRect(0, 0, w, 10); }, { repeat: [5, 1] });
  add(new THREE.PlaneGeometry(W, D), toonMap(floorTex), 0, 0, 0, statics, { rot: [-Math.PI / 2, 0, 0] });
  const wallMat = toonMap(wallTex), wainMat = toonMap(wainTex);
  // back wall with a big window onto the harbour
  const wx0 = -3.6, wx1 = -0.4, wy0 = 0.9, wy1 = 2.4;
  const piece = (x0, x1, y0, y1) => add(box(x1 - x0, y1 - y0, 0.2), wallMat, (x0 + x1) / 2, (y0 + y1) / 2, backZ - 0.1);
  piece(-W / 2, wx0, 0, H); piece(wx1, W / 2, 0, H); piece(wx0, wx1, 0, wy0); piece(wx0, wx1, wy1, H);
  add(box(0.2, H, D), wallMat, -W / 2 - 0.1, H / 2, 0); add(box(0.2, H, D), wallMat, W / 2 + 0.1, H / 2, 0);
  add(box(W, 0.9, 0.05), wainMat, 0, 0.45, backZ + 0.03); add(box(0.05, 0.9, D), wainMat, -W / 2 + 0.03, 0.45, 0); add(box(0.05, 0.9, D), wainMat, W / 2 - 0.03, 0.45, 0);
  add(box(W + 0.4, 0.1, D + 0.4), toon('#f2ece0'), 0, H + 0.05, 0);
  for (let x = -3.5; x <= 3.5; x += 1.75) add(box(0.16, 0.16, D), toon('#8a6040'), x, H - 0.08, 0);
  add(new THREE.PlaneGeometry(wx1 - wx0, wy1 - wy0), basic({ map: harbourTex() }), (wx0 + wx1) / 2, (wy0 + wy1) / 2, backZ - 0.3);
  const frame = toon('#f2ece0');
  for (const y of [wy0, wy1]) add(box(wx1 - wx0 + 0.16, 0.1, 0.22), frame, (wx0 + wx1) / 2, y, backZ);
  for (let x = wx0; x <= wx1 + 0.01; x += (wx1 - wx0) / 3) add(box(0.07, wy1 - wy0, 0.16), frame, x, (wy0 + wy1) / 2, backZ);
  add(box(wx1 - wx0 + 0.2, 0.05, 0.3), frame, (wx0 + wx1) / 2, wy0 + 0.02, backZ + 0.12);
  // window lettering, seen from inside (mirrored)
  const letTex = canvasTex(512, 96, (g, w, h) => { g.translate(w, 0); g.scale(-1, 1); g.fillStyle = 'rgba(255,255,255,.9)'; g.font = 'italic bold 52px Georgia'; g.textAlign = 'center'; g.fillText('The Puffin', w / 2, 62); });
  add(new THREE.PlaneGeometry(1.9, 0.36), basic({ map: letTex, transparent: true, depthWrite: false }), (wx0 + wx1) / 2, 2.05, backZ - 0.02);

  // ------------------------------------------------ counter with a cake stand, till, tea pots; shelves behind
  const CX = 2.4, CZ = -1.7;
  add(box(3.4, 1.0, 0.7), toon('#7a5236'), CX, 0.5, CZ);
  add(box(3.5, 0.06, 0.8), toon('#e9e2d4'), CX, 1.02, CZ);
  add(box(3.4, 0.12, 0.05), toon('#8fa58c'), CX, 0.85, CZ + 0.36);
  const dome = add(new THREE.SphereGeometry(0.28, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshToonMaterial({ color: '#dff0ff', transparent: true, opacity: 0.35, gradientMap: null }), CX - 0.9, 1.08, CZ + 0.05);
  for (const [dx, c] of [[-0.1, '#c46a3a'], [0.08, '#f2d7a0'], [0.0, '#8a4a2a']]) add(cyl(0.11, 0.11, 0.08, 12), toon(c), CX - 0.9 + dx, 1.12 + (c === '#8a4a2a' ? 0.08 : 0), CZ + 0.05 + dx);
  for (const [dx, c] of [[0.1, '#2f6f8a'], [0.45, '#c9473a']]) { add(new THREE.SphereGeometry(0.1, 12, 8), toon(c), CX + dx, 1.13, CZ); add(cyl(0.02, 0.02, 0.07, 6), toon(c), CX + dx + 0.1, 1.15, CZ); }
  add(box(0.32, 0.22, 0.26), toon('#3d4a52'), CX + 1.1, 1.16, CZ);
  add(box(4.0, 0.05, 0.3), toon('#7a5236'), 2.4, 1.55, backZ + 0.18); add(box(4.0, 0.05, 0.3), toon('#7a5236'), 2.4, 1.95, backZ + 0.18);
  const jarCols = ['#e9b44c', '#c9473a', '#8fa58c', '#f2ece0', '#2f6f8a', '#d98a5a'];
  for (const y of [1.58, 1.98]) for (let x = 0.7; x < 4.2; x += 0.3) { add(cyl(0.07, 0.07, 0.2, 8), toon(jarCols[(Math.random() * 6) | 0]), x, y + 0.11, backZ + 0.18); }
  const menuTex = canvasTex(256, 192, (g, w, h) => { g.fillStyle = '#2d3a35'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2ece0'; g.font = 'bold 22px Georgia'; g.fillText('THE PUFFIN', 54, 32); g.font = '16px Georgia'; [['Tea', '£2.20'], ['Coffee', '£2.80'], ['Hot chocolate', '£3.00'], ['Scone & jam', '£2.50'], ['Soup of the day', '£4.50']].forEach(([a, b], i) => { g.fillText(a, 20, 66 + i * 26); g.fillText(b, 190, 66 + i * 26); }); });
  add(new THREE.PlaneGeometry(1.07, 0.8), toonMap(menuTex), 1.3, 2.57, backZ + 0.02);
  // ------------------------------------------------ tables, a sofa corner, books, plants, a guitar case
  for (const [x, z] of [[-2.6, -1.2], [-1.2, 0.6], [-3.2, 1.6]]) { place('Table_RoundSmall', x, 0, z, 0, 0.5); place('Chair_2', x + 0.6, 0, z, -Math.PI / 2, 0.5); place('Chair_2', x - 0.6, 0, z, Math.PI / 2, 0.5); }
  place('Couch_Small1', 3.9, 0, 1.4, -Math.PI / 2, 0.55); place('Carpet_Round', 3.2, 0.005, 1.4, 0, 0.5);
  place('Bookshelf', -4.3, 0, 0.1, Math.PI / 2, 0.55);
  const bookCols = ['#7a2e2e', '#2e4a6a', '#c9a24a', '#3e6b52', '#5a3e6a', '#b8b0a0'];
  for (const y of [0.42, 0.95, 1.48]) { let z = -0.45; while (z < 0.65) { const wd = 0.05 + Math.random() * 0.05, hh = 0.26 + Math.random() * 0.12; add(box(0.22, hh, wd), toon(bookCols[(Math.random() * 6) | 0]), -4.3, y + hh / 2, z); z += wd + 0.005; } }
  place('Houseplant_3', 4.1, 0, -2.9, 0, 0.6); place('Houseplant_7', -4.0, 0, -3.0, 0, 0.6); place('Houseplant_1', -0.15, 0, -3.1, 0, 0.5);
  place('Light_Ceiling2', -2.0, H - 0.7, -0.4, 0, 0.5); place('Light_Ceiling2', 0.6, H - 0.7, 0.4, 0, 0.5);
  const guitar = new THREE.Group(); guitar.position.set(0.9, 0, -2.1); guitar.rotation.z = -0.25; scene.add(guitar);
  add(new THREE.CylinderGeometry(0.22, 0.28, 0.08, 14), toon('#1d2226'), 0, 0.45, 0, guitar, { rot: [Math.PI / 2, 0, 0] });
  add(box(0.09, 0.75, 0.07), toon('#1d2226'), 0, 0.95, 0, guitar);
  const key = new THREE.Group(); key.position.set(CX - 0.3, 1.06, CZ + 0.25); scene.add(key);
  add(new THREE.TorusGeometry(0.03, 0.008, 6, 14), toon('#c9a24a'), 0, 0.005, 0, key, { rot: [Math.PI / 2, 0, 0] });
  add(box(0.09, 0.008, 0.016), toon('#c9a24a'), 0.07, 0.005, 0, key);
  add(box(0.05, 0.004, 0.08), toon('#c9473a'), -0.07, 0.003, 0.02, key);
  L.clues.key = key;

  // ------------------------------------------------ warm daylight from the harbour window
  scene.add(new THREE.HemisphereLight('#fff3e0', '#8a7058', 1.7));
  const sun = new THREE.DirectionalLight('#ffe2b8', 2.2); sun.position.set(-2.5, 4, -8); sun.target.position.set(0, 0, 1); scene.add(sun, sun.target);
  if (!MOBILE) { sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -0.0008; Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 20 }); }
  for (const x of [-2.0, 0.6]) { const l = new THREE.PointLight('#ffc98a', 2.2, 5, 1.6); l.position.set(x, H - 0.9, -0.5); scene.add(l); const gl = glow('#ffd9a0', 0.8, 0.35); gl.position.set(x, H - 0.85, -0.5); scene.add(gl); }
  const DUST = MOBILE ? 40 : 90;
  const dp = new Float32Array(DUST * 3); for (let i = 0; i < DUST; i++) dp.set([-3.6 + Math.random() * 3.4, 0.5 + Math.random() * 2, -3.2 + Math.random() * 3], i * 3);
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: '#fff3d6', size: 0.02, transparent: true, opacity: 0.6, depthWrite: false })));
  L.anims.push((dt, t) => { const p = dustGeo.attributes.position.array; for (let i = 0; i < DUST; i++) p[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.0006; dustGeo.attributes.position.needsUpdate = true; });

  // ------------------------------------------------ people and shots
  L.spots = {
    kai: { pos: [2.6, 0, -2.45], ry: 0.15, base: 'idle', side: -1 },
    fiona: { pos: [0.7, 0, -0.6], ry: 0.55, base: 'idle', side: 1 },
  };
  L.pan = 1.8;
  L.shots = {
    establish: () => ({ pos: [-1.0, 1.9, 3.3], at: [0.6, 1.2, -2.0], portrait: { pos: [-0.2, 1.9, 3.4], at: [0.8, 1.0, -2.0], fov: 66 } }),
    wide: () => ({ pos: [-0.4, 1.9, 3.2], at: [0.8, 1.0, -1.6], portrait: { pos: [0.2, 2.0, 3.4], at: [0.9, 0.8, -1.6], fov: 70 } }),
    window: () => ({ pos: [-1.6, 1.5, 0.4], at: [-2.0, 1.6, -5], fixed: true }),
    key: () => ({ pos: [2.0, 1.55, -0.9], at: [2.1, 1.05, -1.45], fixed: true, portrait: { pos: [2.0, 1.5, -0.6], at: [2.1, 0.7, -1.6], fixed: true } }),
    'over-kai': () => { const f = head('fiona'), k = head('kai'); return { pos: [f.x + 0.4, f.y + 0.15, f.z + 0.75], at: [k.x, k.y - 0.2, k.z] }; },
  };
}

// your room upstairs: sloped ceiling, bed, desk, a round window, and a loose floorboard
export function buildRoom(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl } = ctx;
  const basic = o => basicM(THREE, o);
  scene.background = new THREE.Color('#2a2430');
  scene.fog = new THREE.Fog('#2a2430', 8, 18);
  const W = 4.4, D = 4.0, H = 2.6;
  const floorTex = canvasTex(256, 256, (g, w, h) => { for (let x = 0; x < w; x += 32) { g.fillStyle = `hsl(28,${35 + Math.random() * 10}%,${36 + Math.random() * 6}%)`; g.fillRect(x, 0, 30, h); g.fillStyle = 'rgba(40,20,10,.4)'; g.fillRect(x + 30, 0, 2, h); } }, { repeat: [2, 2] });
  add(new THREE.PlaneGeometry(W, D), toonMap(floorTex), 0, 0, 0, statics, { rot: [-Math.PI / 2, 0, 0] });
  const paper = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#d9c9a8'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(150,110,80,.35)'; for (let x = 0; x < w; x += 32) for (let y = 0; y < h; y += 32) { g.beginPath(); g.arc(x + 16, y + 16, 3, 0, 7); g.fill(); } }, { repeat: [3, 2] });
  const wm = toonMap(paper);
  add(box(W, H, 0.15), wm, 0, H / 2, -D / 2 - 0.07); add(box(0.15, H, D), wm, -W / 2 - 0.07, H / 2, 0); add(box(0.15, H, D), wm, W / 2 + 0.07, H / 2, 0);
  const slope = add(box(W + 0.3, 0.12, 2.6), toon('#bfae8e'), 0, H + 0.4, -0.6); slope.rotation.x = 0.55;
  // round window with the evening harbour
  add(new THREE.CircleGeometry(0.45, 24), basic({ map: harbourTex(true) }), 0.6, 1.65, -D / 2 + 0.01);
  add(new THREE.TorusGeometry(0.47, 0.05, 8, 28), toon('#f2ece0'), 0.6, 1.65, -D / 2 + 0.03);
  // bed with a patchwork quilt, a desk with a lamp, a chair, a small rug
  const quilt = canvasTex(128, 128, (g) => { const c = ['#c9473a', '#e9b44c', '#2f6f8a', '#8fa58c', '#f2ece0']; for (let x = 0; x < 128; x += 32) for (let y = 0; y < 128; y += 32) { g.fillStyle = c[(Math.random() * 5) | 0]; g.fillRect(x, y, 32, 32); } });
  add(box(1.0, 0.35, 2.0), toon('#6b4a30'), -1.5, 0.18, -0.7); add(box(0.95, 0.15, 1.95), toonMap(quilt), -1.5, 0.43, -0.7); add(box(0.6, 0.12, 0.35), toon('#f2ece0'), -1.5, 0.55, -1.5);
  add(box(1.1, 0.05, 0.55), toon('#7a5236'), 1.4, 0.75, -1.65); for (const [dx, dz] of [[-0.5, -0.22], [0.5, -0.22], [-0.5, 0.22], [0.5, 0.22]]) add(box(0.05, 0.75, 0.05), toon('#5c3d27'), 1.4 + dx, 0.375, -1.65 + dz);
  place('Light_Desk', 1.75, 0.775, -1.75, -0.6, 0.45); place('Chair_1', 1.4, 0, -1.05, Math.PI, 0.5);
  add(new THREE.CircleGeometry(0.7, 20), toon('#8fa58c'), 0.1, 0.006, 0.3, statics, { rot: [-Math.PI / 2, 0, 0] });
  // the loose floorboard, lifted, and the diary in the gap
  const board = new THREE.Group(); board.position.set(0.3, 0.02, 0.9); scene.add(board);
  add(box(0.3, 0.025, 0.9), toon('#7a5236'), 0.12, 0.08, 0, board).rotation.z = 0.35;
  add(box(0.26, 0.02, 0.86), basic({ color: '#120c08' }), -0.1, 0.0, 0, board);
  const diary = new THREE.Group(); diary.position.set(-0.1, 0.03, 0.05); diary.rotation.y = 0.3; board.add(diary);
  add(box(0.18, 0.035, 0.24), toon('#3a5a7a'), 0, 0, 0, diary); add(box(0.17, 0.03, 0.005), toon('#f2ece0'), 0, 0, 0.12, diary);
  L.clues.diary = board;

  scene.add(new THREE.HemisphereLight('#ffd9b0', '#3a2a30', 1.1));
  const lamp = new THREE.PointLight('#ffb36a', 3.2, 5, 1.5); lamp.position.set(1.6, 1.3, -1.6); scene.add(lamp);
  const win = new THREE.DirectionalLight('#9fb6ff', 1.0); win.position.set(0.6, 2, -5); scene.add(win);
  const gl = glow('#ffcf8a', 0.9, 0.4); gl.position.set(1.75, 1.15, -1.7); scene.add(gl);

  L.spots = {}; L.pan = 0.6;
  L.shots = {
    establish: () => ({ pos: [0.9, 1.7, 1.8], at: [-0.2, 0.8, -1.2], portrait: { pos: [0.7, 1.8, 1.9], at: [-0.2, 0.6, -1.2], fov: 72 } }),
    wide: () => L.shots.establish(),
    diary: () => ({ pos: [0.95, 1.45, 2.05], at: [0.15, -0.2, 0.75], fixed: true, portrait: { pos: [0.75, 1.55, 2.2], at: [0.15, -0.35, 0.6], fixed: true } }),
  };
}
