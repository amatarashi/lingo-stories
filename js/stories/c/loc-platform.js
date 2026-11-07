// Fresh Start: the little railway station of Kinloch at sunset. Sea, a lighthouse, gulls, a red-brick station house.
// Three women wait on the platform; the player has to find Fiona by her description (L.charTargets).
import { toon, toonMap, canvasTex, glow, MOBILE } from '../stage.js';

export function buildPlatform(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl, head } = ctx;
  scene.background = new THREE.Color('#f2b27a');
  scene.fog = new THREE.Fog('#e9b48c', 14, 40);
  const basic = (o = {}) => new THREE.MeshBasicMaterial({ toneMapped: false, ...o });

  // ------------------------------------------------ sky, sea, hills, lighthouse (one painted backdrop + a few 3D bits)
  const skyTex = canvasTex(1024, 512, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.62);
    sky.addColorStop(0, '#5b6f9c'); sky.addColorStop(0.45, '#e39a7a'); sky.addColorStop(1, '#ffd29a');
    g.fillStyle = sky; g.fillRect(0, 0, w, h * 0.62);
    g.fillStyle = 'rgba(255,240,210,.9)'; g.beginPath(); g.arc(w * 0.66, h * 0.55, 34, 0, 7); g.fill();          // low sun
    g.globalAlpha = 0.35; g.fillStyle = '#fff4e6';
    for (const [x, y, r] of [[160, 120, 60], [230, 110, 45], [700, 80, 70], [790, 95, 50], [430, 150, 40]]) { g.beginPath(); g.ellipse(x, y, r * 1.8, r * 0.5, 0, 0, 7); g.fill(); }
    g.globalAlpha = 1;
    g.fillStyle = '#6d7f86'; g.beginPath(); g.moveTo(0, h * 0.62);                                                  // far hills
    for (let x = 0; x <= w; x += 40) g.lineTo(x, h * 0.62 - 30 - Math.sin(x / 140) * 26 - Math.sin(x / 47) * 6); g.lineTo(w, h * 0.62); g.fill();
    const sea = g.createLinearGradient(0, h * 0.62, 0, h); sea.addColorStop(0, '#d9a07e'); sea.addColorStop(0.25, '#6f8a99'); sea.addColorStop(1, '#3d5466');
    g.fillStyle = sea; g.fillRect(0, h * 0.62, w, h * 0.38);
    g.fillStyle = 'rgba(255,225,170,.55)'; for (let i = 0; i < 60; i++) g.fillRect(w * 0.66 - 60 + Math.random() * 120, h * 0.64 + Math.random() * 60, 10 + Math.random() * 30, 2); // sun path
    // lighthouse on a headland
    g.fillStyle = '#4d5a5e'; g.beginPath(); g.moveTo(w * 0.08, h * 0.66); g.quadraticCurveTo(w * 0.2, h * 0.5, w * 0.33, h * 0.66); g.fill();
    g.fillStyle = '#f4efe6'; g.fillRect(w * 0.195, h * 0.36, 22, 90); g.fillStyle = '#c23b2e'; for (let k = 0; k < 3; k++) g.fillRect(w * 0.195, h * 0.38 + k * 30, 22, 12);
    g.fillStyle = '#2b2b2b'; g.fillRect(w * 0.192, h * 0.335, 28, 14); g.fillStyle = '#fff3c4'; g.fillRect(w * 0.197, h * 0.338, 18, 8);
  });
  add(new THREE.PlaneGeometry(40, 20), basic({ map: skyTex, fog: false }), 0, 6.5, -18, scene);
  const lh = glow('#fff1b8', 2.2, 0.5); lh.position.set(-7.6, 9.0, -17.5); scene.add(lh);
  // gulls: little V-shaped sprites wheeling over the sea
  const gullTex = canvasTex(64, 32, (g) => { g.strokeStyle = '#2d2d33'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(4, 12); g.quadraticCurveTo(18, 2, 32, 16); g.quadraticCurveTo(46, 2, 60, 12); g.stroke(); });
  const gulls = [];
  for (let i = 0; i < 5; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: gullTex, transparent: true, fog: false, depthWrite: false })); s.scale.set(0.7, 0.35, 1); scene.add(s); gulls.push({ s, r: 3 + Math.random() * 4, y: 5 + Math.random() * 2.5, sp: 0.15 + Math.random() * 0.2, ph: Math.random() * 6, cx: -3 + Math.random() * 8 }); }

  // ------------------------------------------------ platform: worn concrete, yellow safety line, tracks behind
  const concTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#a49c92'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${Math.random() < 0.5 ? '60,55,50' : '230,225,215'},${Math.random() * 0.12})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    g.strokeStyle = 'rgba(70,64,58,.4)'; g.lineWidth = 2; for (let x = 0; x <= w; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(w, x); g.stroke(); }
  }, { repeat: [6, 3] });
  const PW = 18, PD = 7;
  add(box(PW, 0.6, PD), toonMap(concTex), 0, -0.3, 0);
  add(box(PW, 0.012, 0.18), toon('#e9c23a'), 0, 0.006, PD / 2 - 0.45);                              // safety line (front edge, train side)
  add(box(PW, 0.08, 0.25), toon('#bdb5a8'), 0, 0.0, PD / 2 - 0.12);
  // the tracks in front (towards the camera) and the train you just left
  add(box(PW + 10, 0.05, 4), toon('#5a5048'), 0, -0.85, PD / 2 + 2);
  for (const z of [PD / 2 + 1.3, PD / 2 + 2.7]) add(box(PW + 10, 0.08, 0.08), toon('#8a8f94'), 0, -0.75, z);
  // sea wall + railing at the back of the platform, sea beyond
  add(box(PW, 0.5, 0.3), toon('#8e8478'), 0, 0.25, -PD / 2 + 0.15);
  for (let x = -PW / 2 + 0.5; x < PW / 2; x += 1.2) add(cyl(0.025, 0.025, 0.9, 6), toon('#2f4a5a'), x, 0.95, -PD / 2 + 0.15);
  for (const y of [1.0, 1.4]) add(box(PW, 0.04, 0.04), toon('#2f4a5a'), 0, y, -PD / 2 + 0.15);
  add(new THREE.PlaneGeometry(60, 30), toon('#4d6878'), 0, -1.2, -18, statics, { rot: [-Math.PI / 2, 0, 0] });   // sea surface between
  // ------------------------------------------------ station house: red brick, white trim, KINLOCH sign, clock
  const brickTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#d8cfc2'; g.fillRect(0, 0, w, h);
    for (let y = 0, r = 0; y < h; y += 16, r++) for (let x = (r % 2) * -16; x < w; x += 32) { g.fillStyle = `hsl(${8 + Math.random() * 8},${45 + Math.random() * 15}%,${36 + Math.random() * 8}%)`; g.fillRect(x + 1, y + 1, 30, 14); }
  }, { repeat: [3, 2] });
  const SX = 5.6, SZ = -1.2;
  add(box(4.2, 3.0, 3.2), toonMap(brickTex), SX, 1.5, SZ);
  const roof = add(box(4.8, 0.18, 3.8), toon('#3d4a52'), SX, 3.1, SZ);
  add(new THREE.ConeGeometry(2.7, 1.1, 4, 1), toon('#3d4a52'), SX, 3.75, SZ, statics, { rot: [0, Math.PI / 4, 0] }).scale.set(1, 1, 0.75);
  add(box(4.4, 0.1, 0.5), toon('#f2ece0'), SX, 2.95, SZ + 1.7);                                        // canopy trim
  add(box(1.0, 2.0, 0.08), toon('#2f5a4a'), SX - 0.8, 1.0, SZ + 1.62);                                  // green door
  for (const x of [SX + 0.6, SX + 1.5]) { add(box(0.7, 1.0, 0.06), toon('#f2ece0'), x, 1.55, SZ + 1.62); add(new THREE.PlaneGeometry(0.6, 0.9), basic({ color: '#ffd59a' }), x, 1.55, SZ + 1.66); }
  const signTex = canvasTex(512, 96, (g, w, h) => { g.fillStyle = '#1f3d5a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2ece0'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#f2ece0'; g.font = 'bold 54px Georgia'; g.textAlign = 'center'; g.fillText('KINLOCH', w / 2, 66); });
  add(new THREE.PlaneGeometry(2.4, 0.45), toonMap(signTex), SX, 2.55, SZ + 1.66);
  // a second sign on posts, facing the platform
  add(new THREE.PlaneGeometry(1.8, 0.34), toonMap(signTex), -3.2, 2.15, -1.2);
  for (const x of [-4.0, -2.4]) add(cyl(0.04, 0.04, 2.2, 6), toon('#1f3d5a'), x, 1.1, -1.21);
  // clock on a bracket
  const clockTex = canvasTex(128, 128, (g) => { g.fillStyle = '#f7f3ea'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 6; g.stroke(); g.lineWidth = 3; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(64 + Math.sin(a) * 48, 64 - Math.cos(a) * 48); g.lineTo(64 + Math.sin(a) * 54, 64 - Math.cos(a) * 54); g.stroke(); } g.lineWidth = 5; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + 26, 64 + 14); g.moveTo(64, 64); g.lineTo(64 - 6, 64 - 42); g.stroke(); });
  add(cyl(0.32, 0.32, 0.08, 20), toon('#1f3d5a'), SX - 2.3, 2.6, SZ + 1.3, statics, { rot: [Math.PI / 2, 0, 0] });
  add(new THREE.CircleGeometry(0.28, 20), toonMap(clockTex), SX - 2.3, 2.6, SZ + 1.35);
  // benches, lamps, flower tubs, a luggage trolley
  const bench = (x, z, ry) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; statics.add(g); for (const y of [0.45, 0.5]) add(box(1.6, 0.05, 0.12), toon('#7a5236'), 0, y, -0.12 + (y - 0.45) * 6, g); add(box(1.6, 0.05, 0.12), toon('#7a5236'), 0, 0.75, -0.22, g); add(box(1.6, 0.05, 0.12), toon('#7a5236'), 0, 0.88, -0.22, g); for (const dx of [-0.7, 0.7]) add(box(0.06, 0.48, 0.4), toon('#22303a'), dx, 0.24, -0.08, g); };
  bench(-1.2, -2.6, 0); bench(2.3, -2.6, 0);
  for (const x of [-6.5, -0.4, 3.6]) place('Streetlight_Single', x, 0, -2.9, 0, 0.55);
  for (const x of [-5.2, 1.0]) { add(cyl(0.32, 0.26, 0.45, 10), toon('#3d4a52'), x, 0.22, -2.75); for (let k = 0; k < 7; k++) add(new THREE.SphereGeometry(0.1, 6, 5), toon(['#d9473a', '#f2c230', '#ffffff', '#c95fa0'][k % 4]), x - 0.2 + Math.random() * 0.4, 0.5 + Math.random() * 0.1, -2.75 - 0.15 + Math.random() * 0.3); }
  // your luggage: a suitcase and a backpack, right by the camera
  const lug = new THREE.Group(); lug.position.set(0.9, 0, 2.2); scene.add(lug);
  add(box(0.45, 0.65, 0.25), toon('#2f6f8a'), 0, 0.33, 0, lug); add(box(0.2, 0.04, 0.04), toon('#1d2a30'), 0, 0.68, 0, lug);
  add(box(0.32, 0.42, 0.2), toon('#c97b2e'), 0.45, 0.21, 0.05, lug);
  L.clues.luggage = lug;

  // ------------------------------------------------ light: low golden sun from the sea, soft sky fill
  scene.add(new THREE.HemisphereLight('#ffd9b8', '#5d5866', 1.6));
  const sun = new THREE.DirectionalLight('#ffc48a', 2.6); sun.position.set(4, 5, -12); sun.target.position.set(0, 0, 0); scene.add(sun, sun.target);
  if (!MOBILE) { sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -0.0008; Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 6, bottom: -6, near: 1, far: 30 }); }
  for (const x of [-6.5, -0.4, 3.6]) { const gl = glow('#ffe1a8', 0.7, 0.35); gl.position.set(x + 0.55, 2.55, -2.9); scene.add(gl); }

  L.anims.push((dt, t) => {
    for (const g of gulls) { const a = t * g.sp + g.ph; g.s.position.set(g.cx + Math.cos(a) * g.r, g.y + Math.sin(a * 2) * 0.3, -10 + Math.sin(a) * 2); g.s.scale.y = 0.35 * (0.7 + 0.3 * Math.abs(Math.sin(t * 6 + g.ph))); }
    lh.material.opacity = 0.25 + 0.35 * Math.max(0, Math.sin(t * 1.4));
  });

  // ------------------------------------------------ people and shots
  L.charTargets = ['fiona', 'anne', 'meg'];
  L.spots = {
    fiona: { pos: [-1.1, 0, -1.4], ry: 0.25, base: 'idle', side: 1 },
    anne: { pos: [0.4, 0, -0.7], ry: -0.2, base: 'phone', side: -1 },
    meg: { pos: [1.8, 0, -1.7], ry: -0.45, base: 'fold', side: -1 },
  };
  L.pan = 2.0;
  L.shots = {
    establish: () => ({ pos: [-2.5, 1.9, 5.2], at: [1.0, 1.6, -4], portrait: { pos: [-1.0, 1.8, 6.0], at: [0.4, 1.5, -4], fov: 64 } }),
    wide: () => ({ pos: [0.4, 1.75, 4.2], at: [0.4, 0.95, -1.6], portrait: { pos: [0.35, 1.95, 5.0], at: [0.35, 0.75, -1.4], fov: 74 } }),
    luggage: () => ({ pos: [0.2, 1.4, 3.6], at: [1.0, 0.35, 2.2], fixed: true }),
    fiona: () => { const h = head('fiona'), p = ctx.portrait(); return { pos: [h.x + (p ? 0.15 : 0.5), h.y + 0.05, h.z + (p ? 2.4 : 2.0)], at: [h.x, h.y - (p ? 0.45 : 0.08), h.z], fixed: true }; },
  };
}
