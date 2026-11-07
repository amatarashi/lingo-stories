// Last Signal: the radio room of polar station Aurora-7. Night, blizzard, aurora over the snow.
// Warm orange lamps inside, cold blue through the window, a red emergency beacon, green console screens.
// Everything the player can press is a "clue" object (tap target); L.fx animates it.
import { toon, toonMap, canvasTex, glow, MOBILE } from '../stage.js';

export function buildRadio(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl } = ctx;
  scene.background = new THREE.Color('#05070d');
  scene.fog = new THREE.Fog('#0b1220', 9, 26);
  const W = 6, D = 5, H = 2.7, backZ = -D / 2, leftX = -W / 2, rightX = W / 2;
  const basic = (o = {}) => new THREE.MeshBasicMaterial({ toneMapped: false, ...o });

  // ------------------------------------------------ shell: metal grating floor, riveted panels, hazard stripe
  const floorTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#2b3036'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 16) { g.fillStyle = (x + y) % 32 ? '#23272c' : '#30353b'; g.fillRect(x + 2, y + 2, 12, 12); }
    g.strokeStyle = '#16191d'; g.lineWidth = 3; for (let x = 0; x <= w; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(w, x); g.stroke(); }
  }, { repeat: [3, 3] });
  const panelTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#7d8893'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 128) for (let y = 0; y < h; y += 128) {
      const gr = g.createLinearGradient(x, y, x, y + 128); gr.addColorStop(0, '#8994a0'); gr.addColorStop(1, '#6e7883');
      g.fillStyle = gr; g.fillRect(x + 3, y + 3, 122, 122);
      g.fillStyle = '#4f575f'; for (const [a, b] of [[10, 10], [116, 10], [10, 116], [116, 116]]) { g.beginPath(); g.arc(x + a, y + b, 3, 0, 7); g.fill(); }
    }
  }, { repeat: [3, 1.2] });
  const stripeTex = canvasTex(256, 32, (g, w, h) => {
    g.fillStyle = '#d9822b'; g.fillRect(0, 0, w, h); g.fillStyle = '#22262b';
    for (let x = -32; x < w; x += 32) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 16, 0); g.lineTo(x + 32, 0); g.lineTo(x + 16, h); g.fill(); }
  }, { repeat: [6, 1] });
  add(new THREE.PlaneGeometry(W, D), toonMap(floorTex), 0, 0, 0, statics, { rot: [-Math.PI / 2, 0, 0] });
  const wallMat = toonMap(panelTex), stripeMat = toonMap(stripeTex);
  const wy0 = 1.0, wy1 = 2.1, wx0 = -2.4, wx1 = -0.6;
  const wallPiece = (x0, x1, y0, y1) => add(box(x1 - x0, y1 - y0, 0.2), wallMat, (x0 + x1) / 2, (y0 + y1) / 2, backZ - 0.1);
  wallPiece(leftX, wx0, 0, H); wallPiece(wx1, rightX, 0, H); wallPiece(wx0, wx1, 0, wy0); wallPiece(wx0, wx1, wy1, H);
  add(box(0.2, H, D), wallMat, leftX - 0.1, H / 2, 0);
  add(box(0.2, H, D), wallMat, rightX + 0.1, H / 2, 0);
  add(box(W, H, 0.2), wallMat, 0, H / 2, D / 2 + 0.1);
  add(box(W, 0.12, D + 0.2), toon('#3a4048'), 0, H + 0.06, 0);
  for (const [w, d, x, z, ry] of [[W, 0.02, 0, backZ + 0.01, 0], [D, 0.02, leftX + 0.01, 0, Math.PI / 2], [D, 0.02, rightX - 0.01, 0, Math.PI / 2]]) {
    const s = add(box(w, 0.14, d), stripeMat, x, 0.07, z); s.rotation.y = ry;
  }
  // pipes along the ceiling and the right wall
  const pipeY = toon('#c9a23a'), pipeG = toon('#5c656e');
  for (const [z, m, r] of [[-1.9, pipeY, 0.06], [-1.6, pipeG, 0.045], [0.4, pipeG, 0.07]]) { const p = add(cyl(r, r, W, 10), m, 0, H - 0.18, z); p.rotation.z = Math.PI / 2; }
  for (const [y, m] of [[2.2, pipeG], [2.36, pipeY]]) { const p = add(cyl(0.04, 0.04, D, 8), m, rightX - 0.12, y, 0); p.rotation.x = Math.PI / 2; }
  for (const x of [-1.8, 0.6, 2.2]) add(box(0.06, 0.2, 0.06), toon('#30353b'), x, H - 0.08, -1.9);

  // ------------------------------------------------ outside: aurora, snowy hills, blizzard
  const outside = new THREE.Group(); scene.add(outside);
  const skyTex = canvasTex(512, 256, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#02040c'); sky.addColorStop(0.6, '#0a1a33'); sky.addColorStop(1, '#16304a');
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.7})`; g.fillRect(Math.random() * w, Math.random() * h * 0.6, 1.5, 1.5); }
    g.filter = 'blur(10px)'; g.globalCompositeOperation = 'lighter';
    for (const [c, y, a] of [['#3dff9a', 70, 0.55], ['#22d6c4', 95, 0.4], ['#a46bff', 55, 0.25]]) {
      g.strokeStyle = c; g.globalAlpha = a; g.lineWidth = 26; g.beginPath();
      for (let x = -20; x <= w + 20; x += 16) g.lineTo(x, y + Math.sin(x / 60) * 22 + Math.sin(x / 23) * 6);
      g.stroke();
    }
    g.filter = 'none'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.fillStyle = '#c9d6e6'; g.beginPath(); g.moveTo(0, h);
    for (let x = 0; x <= w; x += 32) g.lineTo(x, h - 40 - Math.sin(x / 70) * 18 - Math.random() * 6);
    g.lineTo(w, h); g.fill();
  });
  skyTex.wrapS = THREE.RepeatWrapping;
  add(new THREE.PlaneGeometry(11, 3.4), basic({ map: skyTex, fog: false }), -2.0, 1.55, -6.2, outside);
  add(new THREE.PlaneGeometry(12, 4), toon('#aebccd'), -2.0, -0.05, -4.4, outside, { rot: [-Math.PI / 2, 0, 0] });
  // a radio mast outside, blinking red
  add(cyl(0.025, 0.04, 2.6, 6), toon('#2a3038'), -3.3, 1.3, -5.6, outside);
  const mastLight = glow('#ff3030', 0.5, 0.9); mastLight.position.set(-3.3, 2.6, -5.6); outside.add(mastLight);
  const SNOW = MOBILE ? 260 : 520;
  const sp = new Float32Array(SNOW * 3); for (let i = 0; i < SNOW; i++) sp.set([-5 + Math.random() * 6, Math.random() * 4, -5.9 + Math.random() * 3.2], i * 3);
  const snowGeo = new THREE.BufferGeometry(); snowGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const flake = canvasTex(32, 32, (g) => { const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); });
  outside.add(new THREE.Points(snowGeo, new THREE.PointsMaterial({ map: flake, size: 0.07, transparent: true, depthWrite: false, fog: false, color: '#e8f2ff' })));
  // window: frame, frosty glass
  const frostTex = canvasTex(256, 160, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const gr = g.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, w * 0.62); gr.addColorStop(0, 'rgba(220,235,255,0)'); gr.addColorStop(1, 'rgba(220,235,255,.85)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(240,248,255,.35)'; for (let i = 0; i < 40; i++) { const x = Math.random() < 0.5 ? Math.random() * 40 : w - Math.random() * 40, y = Math.random() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.random() * 30 - 15, y + Math.random() * 30 - 15); g.stroke(); }
  });
  const winGroup = new THREE.Group(); winGroup.position.set((wx0 + wx1) / 2, (wy0 + wy1) / 2, backZ + 0.01); scene.add(winGroup);
  add(new THREE.PlaneGeometry(wx1 - wx0, wy1 - wy0), basic({ map: frostTex, transparent: true, depthWrite: false }), 0, 0, 0, winGroup);
  const frameM = toon('#3a4048');
  for (const y of [wy0, wy1]) add(box(wx1 - wx0 + 0.16, 0.1, 0.24), frameM, (wx0 + wx1) / 2, y, backZ + 0.02);
  for (const x of [wx0, wx1, (wx0 + wx1) / 2]) add(box(0.08, wy1 - wy0, 0.2), frameM, x, (wy0 + wy1) / 2, backZ + 0.02);
  add(box(wx1 - wx0 + 0.3, 0.05, 0.3), toon('#e8eef5'), (wx0 + wx1) / 2, wy0 + 0.06, backZ + 0.12); // snow on the sill
  // the shutter: rolled up in its housing; pulled down it covers the window
  const shutter = new THREE.Group(); shutter.position.set((wx0 + wx1) / 2, wy1 + 0.16, backZ + 0.2); scene.add(shutter);
  add(box(wx1 - wx0 + 0.24, 0.2, 0.2), toon('#59626b'), 0, 0, 0, shutter);
  const slats = new THREE.Group(); slats.position.y = -0.1; shutter.add(slats);
  for (let i = 0; i < 12; i++) add(box(wx1 - wx0 + 0.1, 0.085, 0.03), toon(i % 2 ? '#8c96a0' : '#7b858f'), 0, -0.045 - i * 0.095, 0, slats);
  slats.scale.y = 0.02;
  add(box(0.05, 0.22, 0.05), toon('#d9822b'), wx1 + 0.05, wy1 + 0.05, backZ + 0.24); // pull handle

  // ------------------------------------------------ console: desk, ARIA's screen, radar, the radio
  const desk = { x0: 0.1, x1: 2.95, z: -2.12, top: 0.8 };
  add(box(desk.x1 - desk.x0, 0.06, 0.76), toon('#4a525b'), (desk.x0 + desk.x1) / 2, desk.top, desk.z);
  add(box(desk.x1 - desk.x0, desk.top - 0.03, 0.7), toon('#2c3238'), (desk.x0 + desk.x1) / 2, (desk.top - 0.03) / 2, desk.z - 0.02);
  for (let x = 0.4; x < 2.9; x += 0.62) add(box(0.5, 0.5, 0.01), toon('#3a4148'), x, 0.36, desk.z + 0.335);
  // ARIA: a monitor with a breathing waveform
  const ariaCv = document.createElement('canvas'); ariaCv.width = 256; ariaCv.height = 192;
  const ariaTex = new THREE.CanvasTexture(ariaCv); ariaTex.colorSpace = THREE.SRGBColorSpace;
  const drawAria = (t) => {
    const g = ariaCv.getContext('2d'); g.fillStyle = '#031410'; g.fillRect(0, 0, 256, 192);
    g.fillStyle = 'rgba(93,255,176,.08)'; for (let y = 0; y < 192; y += 4) g.fillRect(0, y, 256, 1);
    g.strokeStyle = '#5dffb0'; g.lineWidth = 3; g.shadowColor = '#5dffb0'; g.shadowBlur = 10; g.beginPath();
    for (let x = 0; x <= 256; x += 4) { const k = Math.sin(x / 256 * Math.PI); g.lineTo(x, 96 + Math.sin(x / 14 + t * 5) * 22 * k * (0.5 + 0.5 * Math.sin(t * 1.3)) + Math.sin(x / 5 + t * 9) * 4 * k); }
    g.stroke(); g.shadowBlur = 0;
    g.fillStyle = '#5dffb0'; g.font = 'bold 18px monospace'; g.fillText('A.R.I.A.', 12, 26); g.font = '13px monospace'; g.fillText('PWR 12%  T -40°C', 12, 178);
    ariaTex.needsUpdate = true;
  };
  drawAria(0);
  const mon = (x, map) => {
    const g = new THREE.Group(); g.position.set(x, desk.top + 0.03, desk.z - 0.12); g.rotation.x = -0.08; scene.add(g);
    add(box(0.08, 0.16, 0.08), toon('#22272c'), 0, 0.08, 0, g);
    add(box(0.66, 0.5, 0.06), toon('#1c2025'), 0, 0.42, 0, g);
    add(new THREE.PlaneGeometry(0.6, 0.44), basic({ map }), 0, 0.42, 0.031, g);
    return g;
  };
  const ariaMon = mon(0.55, ariaTex);
  const radarTex = canvasTex(256, 192, (g, w, h) => {
    g.fillStyle = '#04120e'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(93,255,176,.5)'; g.lineWidth = 1.5;
    for (const r of [25, 50, 75]) { g.beginPath(); g.arc(w / 2, h / 2, r, 0, 7); g.stroke(); }
    g.beginPath(); g.moveTo(w / 2 - 85, h / 2); g.lineTo(w / 2 + 85, h / 2); g.moveTo(w / 2, h / 2 - 85); g.lineTo(w / 2, h / 2 + 85); g.stroke();
    g.fillStyle = '#ffcc55'; g.beginPath(); g.arc(w / 2 + 40, h / 2 - 30, 4, 0, 7); g.fill(); g.font = '11px monospace'; g.fillText('NORD 31km', w / 2 + 46, h / 2 - 32);
    g.fillStyle = '#5dffb0'; g.beginPath(); g.arc(w / 2, h / 2, 4, 0, 7); g.fill(); g.fillText('AURORA-7', w / 2 + 8, h / 2 + 16);
  });
  mon(1.25, radarTex);
  // the radio set
  const R = { x: 2.15, y: desk.top + 0.28, z: -2.25 }, face = R.z + 0.2;
  add(box(0.86, 0.52, 0.4), toon('#3f4a3c'), R.x, R.y, R.z);
  add(box(0.9, 0.05, 0.44), toon('#2b3329'), R.x, R.y + 0.28, R.z);
  const grille = canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#20251f'; g.fillRect(0, 0, w, h); g.fillStyle = '#0c0f0b'; for (let y = 6; y < h; y += 10) for (let x = 6; x < w; x += 10) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); } });
  add(new THREE.PlaneGeometry(0.22, 0.22), toonMap(grille), R.x + 0.27, R.y - 0.08, face + 0.002);
  const chCv = document.createElement('canvas'); chCv.width = 128; chCv.height = 48;
  const chTex = new THREE.CanvasTexture(chCv); chTex.colorSpace = THREE.SRGBColorSpace;
  let chText = '', chOn = false;
  const drawCh = () => { const g = chCv.getContext('2d'); g.fillStyle = chOn ? '#1a1200' : '#0a0a08'; g.fillRect(0, 0, 128, 48); if (chOn) { g.fillStyle = '#ffb13b'; g.font = 'bold 30px monospace'; g.fillText(chText, 10, 35); } chTex.needsUpdate = true; };
  drawCh();
  add(new THREE.PlaneGeometry(0.24, 0.09), basic({ map: chTex }), R.x - 0.2, R.y + 0.15, face + 0.003);
  const C = L.clues;
  C.window = winGroup; C.shutter = shutter;
  // big channel knob
  const knob = new THREE.Group(); knob.position.set(R.x - 0.2, R.y - 0.07, face + 0.03); scene.add(knob);
  const knobBody = add(cyl(0.085, 0.095, 0.06, 18), toon('#1d1f22'), 0, 0, 0, knob, { rot: [Math.PI / 2, 0, 0] });
  add(box(0.016, 0.07, 0.012), basic({ color: '#f2e6c8' }), 0, 0.04, 0.032, knobBody.parent);
  C.knob = knob;
  // buttons: green = power, red = emergency (don't!)
  const btn = (x, col) => { const g = new THREE.Group(); g.position.set(x, R.y + 0.15, face + 0.02); scene.add(g); add(cyl(0.05, 0.05, 0.02, 14), toon('#1d1f22'), 0, 0, -0.01, g, { rot: [Math.PI / 2, 0, 0] }); const cap = add(cyl(0.035, 0.035, 0.03, 14), basic({ color: col }), 0, 0, 0.01, g, { rot: [Math.PI / 2, 0, 0] }); g.userData.cap = cap; return g; };
  C.green = btn(R.x + 0.1, '#1f6b3c'); C.red = btn(R.x + 0.32, '#8a1c1c');
  // power lever on the desk
  const lever = new THREE.Group(); lever.position.set(2.82, desk.top + 0.03, desk.z + 0.1); scene.add(lever);
  add(box(0.12, 0.06, 0.16), toon('#2a2f34'), 0, 0.03, 0, lever);
  const stick = new THREE.Group(); stick.position.y = 0.06; lever.add(stick); stick.rotation.x = -0.6;
  add(cyl(0.012, 0.012, 0.2, 6), toon('#9aa3ab'), 0, 0.1, 0, stick); add(new THREE.SphereGeometry(0.03, 10, 8), toon('#d9822b'), 0, 0.2, 0, stick);
  C.lever = lever;
  // microphone, papers, a headset
  add(cyl(0.05, 0.06, 0.03, 10), toon('#22262b'), 1.62, desk.top + 0.045, desk.z + 0.15);
  add(cyl(0.008, 0.008, 0.22, 6), toon('#5c656e'), 1.62, desk.top + 0.15, desk.z + 0.15);
  add(new THREE.SphereGeometry(0.035, 10, 8), toon('#2c3036'), 1.62, desk.top + 0.27, desk.z + 0.18);
  add(box(0.22, 0.004, 0.3), toon('#e9e4d6'), 0.95, desk.top + 0.033, desk.z + 0.18).rotation.y = 0.2;
  place('Chair_1', 1.1, 0, -1.45, Math.PI + 0.3, 0.5);

  // ------------------------------------------------ the rest of the room
  // heater under the window
  const heater = new THREE.Group(); heater.position.set((wx0 + wx1) / 2, 0.34, backZ + 0.12); scene.add(heater);
  const heatTex = canvasTex(128, 64, (g, w, h) => { g.fillStyle = '#d6d0c4'; g.fillRect(0, 0, w, h); g.fillStyle = '#9a9488'; for (let x = 8; x < w; x += 10) g.fillRect(x, 6, 5, h - 12); });
  add(box(1.0, 0.46, 0.14), toonMap(heatTex), 0, 0, 0, heater);
  const heatGlowM = basic({ color: '#ff6a1a', transparent: true, opacity: 0 });
  add(new THREE.PlaneGeometry(0.92, 0.36), heatGlowM, 0, 0, 0.075, heater);
  const heatLed = add(new THREE.SphereGeometry(0.018, 8, 6), basic({ color: '#331a0a' }), 0.42, 0.18, 0.08, heater);
  C.heater = heater;
  // metal locker in the corner, a parka on it
  const locker = new THREE.Group(); locker.position.set(leftX + 0.32, 0, -1.55); scene.add(locker);
  add(box(0.56, 1.85, 0.5), toon('#5f7a8c'), 0, 0.925, 0, locker);
  add(box(0.01, 1.7, 0.46), toon('#3f5566'), 0.285, 0.92, 0, locker);
  for (const y of [1.6, 1.52, 1.44]) add(box(0.005, 0.03, 0.3), toon('#2c3c48'), 0.29, y, 0, locker);
  C.locker = locker;
  // table with the log book and a frozen mug
  const T = { x: -1.3, z: -0.35, top: 0.76 };
  add(box(1.1, 0.05, 0.66), toon('#6b7480'), T.x, T.top, T.z);
  for (const [dx, dz] of [[-0.5, -0.28], [0.5, -0.28], [-0.5, 0.28], [0.5, 0.28]]) add(cyl(0.025, 0.025, T.top, 6), toon('#3a4048'), T.x + dx, T.top / 2, T.z + dz);
  place('Chair_3', T.x - 0.1, 0, T.z + 0.6, 0.2, 0.5);
  const logbook = new THREE.Group(); logbook.position.set(T.x - 0.18, T.top + 0.025, T.z); logbook.rotation.y = 0.15; scene.add(logbook);
  const pageTex = canvasTex(256, 160, (g, w, h) => {
    g.fillStyle = '#efe7d2'; g.fillRect(0, 0, w, h); g.fillStyle = '#c9bea3'; g.fillRect(w / 2 - 1, 0, 2, h);
    g.strokeStyle = 'rgba(80,110,160,.35)'; for (let y = 16; y < h; y += 12) { g.beginPath(); g.moveTo(6, y); g.lineTo(w - 6, y); g.stroke(); }
    g.fillStyle = '#22305a'; g.font = '13px "Comic Sans MS", cursive';
    ['Day 12 – wind 40 km/h', 'Day 13 – radio OK', 'Day 14 – STORM', 'coming. All to NORD.'].forEach((s, i) => g.fillText(s, 10, 28 + i * 24));
    g.fillStyle = '#7a1f1f'; g.fillText('the new one', 138, 52); g.fillText('stays.', 138, 76);
  });
  add(box(0.42, 0.02, 0.3), toon('#2f4a3a'), 0, 0, 0, logbook);
  add(new THREE.PlaneGeometry(0.4, 0.27), toonMap(pageTex), 0, 0.012, 0, logbook, { rot: [-Math.PI / 2, 0, 0] });
  C.logbook = logbook;
  const mug = new THREE.Group(); mug.position.set(T.x + 0.32, T.top + 0.025, T.z - 0.12); scene.add(mug);
  add(cyl(0.045, 0.04, 0.1, 14), toon('#c43d3d'), 0, 0.05, 0, mug);
  add(cyl(0.04, 0.04, 0.005, 14), basic({ color: '#cfe6ff' }), 0, 0.097, 0, mug);
  const handle = add(new THREE.TorusGeometry(0.028, 0.008, 6, 12, Math.PI), toon('#c43d3d'), 0.048, 0.05, 0, mug); handle.rotation.z = -Math.PI / 2;
  C.mug = mug;
  place('Light_Desk', T.x - 0.42, T.top + 0.025, T.z - 0.2, 0.8, 0.45);
  // crew photo on the left wall: six people in the snow, one face cut out
  const photo = new THREE.Group(); photo.position.set(leftX + 0.02, 1.55, -0.45); photo.rotation.y = Math.PI / 2; scene.add(photo);
  const photoTex = canvasTex(192, 144, (g, w, h) => {
    g.fillStyle = '#f2ede2'; g.fillRect(0, 0, w, h);
    const sky = g.createLinearGradient(0, 8, 0, h - 30); sky.addColorStop(0, '#7aa3cf'); sky.addColorStop(1, '#dfe9f2'); g.fillStyle = sky; g.fillRect(8, 8, w - 16, h - 36);
    const cols = ['#d9822b', '#c43d3d', '#3c6fb0', '#2f8a5a', '#d9b23a', '#7a4fb0'];
    for (let i = 0; i < 6; i++) { const x = 24 + i * 29; g.fillStyle = cols[i]; g.fillRect(x - 10, 62, 20, 40); g.fillStyle = '#f0c9a0'; g.beginPath(); g.arc(x, 52, 9, 0, 7); g.fill(); }
    g.fillStyle = '#f2ede2'; g.beginPath(); g.arc(24 + 3 * 29, 52, 11, 0, 7); g.fill(); g.strokeStyle = '#999'; g.stroke();
    g.fillStyle = '#333'; g.font = 'italic 12px Georgia'; g.fillText('Aurora-7 · winter team', 30, h - 12);
  });
  add(box(0.5, 0.39, 0.02), toon('#30353b'), 0, 0, -0.01, photo);
  add(new THREE.PlaneGeometry(0.46, 0.35), toonMap(photoTex), 0, 0, 0.002, photo);
  C.photo = photo;
  // a cot by the front wall: this is where you wake up
  add(box(0.8, 0.3, 1.9), toon('#3a4048'), leftX + 0.5, 0.2, 1.4);
  add(box(0.74, 0.12, 1.84), toon('#7f8c99'), leftX + 0.5, 0.41, 1.4);
  add(box(0.76, 0.07, 1.2), toon('#d9822b'), leftX + 0.5, 0.49, 1.65);
  add(box(0.5, 0.1, 0.3), toon('#e6e2d8'), leftX + 0.5, 0.52, 0.65);
  // heavy door with a porthole on the right wall
  add(box(0.08, 2.0, 1.0), toon('#56616b'), rightX - 0.05, 1.0, 1.35);
  add(cyl(0.16, 0.16, 0.1, 18), toon('#2c3238'), rightX - 0.08, 1.45, 1.35, statics, { rot: [0, 0, Math.PI / 2] });
  add(new THREE.CircleGeometry(0.12, 18), basic({ color: '#0f1a2a' }), rightX - 0.14, 1.45, 1.35, statics, { rot: [0, -Math.PI / 2, 0] });
  add(box(0.06, 0.04, 0.3), toon('#c9a23a'), rightX - 0.12, 1.0, 1.0);
  const signTex = canvasTex(256, 64, (g, w, h) => { g.fillStyle = '#e8e2d0'; g.fillRect(0, 0, w, h); g.fillStyle = '#c4362b'; g.fillRect(0, 0, 18, h); g.fillStyle = '#1b2026'; g.font = 'bold 22px monospace'; g.fillText('AURORA-7', 30, 28); g.font = '15px monospace'; g.fillText('RADIO ROOM · R-02', 30, 52); });
  add(new THREE.PlaneGeometry(0.72, 0.18), toonMap(signTex), 1.5, 2.05, backZ + 0.005);
  // parka on a hook by the door
  add(new THREE.ConeGeometry(0.24, 0.85, 10, 1, true), toon('#c4362b', { side: THREE.DoubleSide }), rightX - 0.2, 1.3, 0.35);
  add(new THREE.SphereGeometry(0.14, 10, 8), toon('#e9e4d6'), rightX - 0.2, 1.72, 0.35);

  // ------------------------------------------------ lights
  scene.add(new THREE.HemisphereLight('#8ea2c4', '#2a2420', 0.9));
  const moon = new THREE.DirectionalLight('#9fc0ff', 1.3); moon.position.set(-1.5, 2.5, -6); moon.target.position.set(-1, 0, 1); scene.add(moon, moon.target);
  if (!MOBILE) { moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024); moon.shadow.bias = -0.0008; Object.assign(moon.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 14 }); }
  const lamps = [];
  for (const [x, z] of [[-1.2, 0.2], [1.6, -1.1]]) {
    add(box(0.6, 0.05, 0.25), toon('#2c3238'), x, H - 0.03, z);
    const panel = add(box(0.52, 0.02, 0.18), basic({ color: '#ffcf8a' }), x, H - 0.065, z);
    const l = new THREE.PointLight('#ffb36a', 3.2, 6, 1.4); l.position.set(x, H - 0.3, z); scene.add(l);
    lamps.push({ l, panel, base: 3.2 });
  }
  const screenLight = new THREE.PointLight('#5dffb0', 1.4, 2.6, 1.6); screenLight.position.set(0.9, 1.25, -1.7); scene.add(screenLight);
  const sg = glow('#5dffb0', 1.1, 0.22); sg.position.set(0.9, 1.25, -1.85); scene.add(sg);
  // red emergency beacon on the right wall
  const beacon = new THREE.Group(); beacon.position.set(rightX - 0.08, 2.3, -0.5); scene.add(beacon);
  add(cyl(0.07, 0.08, 0.05, 10), toon('#2c3238'), 0, -0.03, 0, beacon);
  const dome = add(new THREE.SphereGeometry(0.07, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), basic({ color: '#5a1010' }), 0, 0, 0, beacon);
  const redGlow = glow('#ff2020', 1.6, 0); redGlow.position.copy(beacon.position).add(new THREE.Vector3(-0.1, 0, 0)); scene.add(redGlow);
  const red = new THREE.PointLight('#ff2a2a', 0, 7, 1.2); red.position.set(rightX - 0.4, 2.2, -0.5); scene.add(red);
  const heatLight = new THREE.PointLight('#ff7a2a', 0, 3, 1.5); heatLight.position.set((wx0 + wx1) / 2, 0.5, backZ + 0.6); scene.add(heatLight);

  // ------------------------------------------------ effects driven by the episode
  const state = { alarm: false, lights: 1, lightsGoal: 1, heat: 0, heatGoal: 0, shutter: 0.02, shutterGoal: 0.02, knob: 0, knobGoal: 0, stick: -0.6, stickGoal: -0.6 };
  const initial = { ...state };
  L.fx = {
    // a replay starts from the same room: shutter up, heater off, radio dark
    reset: () => { Object.assign(state, initial); chOn = false; chText = ''; drawCh(); C.green.userData.cap.material.color.set('#1f6b3c'); heatLed.material.color.set('#331a0a'); },
    alarm: on => { state.alarm = !!on; },
    lights: v => { state.lightsGoal = v === 'off' ? 0.03 : v === 'low' ? 0.35 : 1; },
    channel: n => { chOn = n != null; chText = n == null ? '' : 'CH ' + String(n).padStart(2, '0'); drawCh(); if (n != null) state.knobGoal = -n * 0.45; },
    press: k => {
      if (k === 'green') { C.green.userData.cap.material.color.set('#4dff8a'); chOn = true; chText = 'CH --'; drawCh(); }
      if (k === 'red') { C.red.userData.cap.material.color.set('#ff4040'); setTimeout(() => C.red.userData.cap.material.color.set('#8a1c1c'), 400); }
      if (k === 'lever') state.stickGoal = 0.6;
      if (k === 'knob') L.fx.channel(3);
      if (k === 'shutter') state.shutterGoal = 1;
      if (k === 'heater') { state.heatGoal = 1; heatLed.material.color.set('#ff8a2a'); }
    },
  };
  let acc = 0;
  L.anims.push((dt, t) => {
    const p = snowGeo.attributes.position.array;
    for (let i = 0; i < SNOW; i++) { const j = i * 3; p[j] += dt * (1.2 + Math.sin(t + i) * 0.3); p[j + 1] -= dt * (0.7 + (i % 5) * 0.12); if (p[j + 1] < 0) { p[j + 1] = 4; p[j] = -5 + Math.random() * 2; } if (p[j] > 1.2) p[j] = -5; }
    snowGeo.attributes.position.needsUpdate = true;
    skyTex.offset.x = (t * 0.004) % 1;
    mastLight.material.opacity = (t % 1.6) < 0.25 ? 0.95 : 0.15;
    acc += dt; if (acc > 0.05) { acc = 0; drawAria(t); }
    const k = 1 - Math.pow(0.05, dt);
    state.lights += (state.lightsGoal - state.lights) * k;
    for (const lp of lamps) { lp.l.intensity = lp.base * state.lights; lp.panel.material.color.setScalar(0.15 + 0.85 * state.lights).multiply(new THREE.Color('#ffcf8a')); }
    const pulse = state.alarm ? Math.max(0, Math.sin(t * 4)) : 0;
    red.intensity = pulse * 5; redGlow.material.opacity = pulse * 0.6; dome.material.color.set(state.alarm && pulse > 0.3 ? '#ff3030' : '#5a1010');
    state.heat += (state.heatGoal - state.heat) * k * 0.5;
    heatGlowM.opacity = state.heat * (0.55 + Math.sin(t * 2) * 0.05); heatLight.intensity = state.heat * 3;
    state.shutter += (state.shutterGoal - state.shutter) * k * 0.6; slats.scale.y = state.shutter;
    state.knob += (state.knobGoal - state.knob) * k; knob.rotation.z = state.knob;
    state.stick += (state.stickGoal - state.stick) * k; stick.rotation.x = state.stick;
  });

  // ------------------------------------------------ shots (no people in the room: you are the camera)
  L.spots = {};
  L.pan = 1.2;
  L.shots = {
    ceiling: () => ({ pos: [leftX + 0.55, 0.75, 1.95], at: [-0.6, 2.4, -0.4], fixed: true }),
    establish: () => ({ pos: [0.9, 1.7, 2.2], at: [-0.4, 1.1, -2.3], portrait: { pos: [0.4, 1.75, 2.3], at: [-0.3, 1.0, -2.3], fov: 75 } }),
    wide: () => ({ pos: [0.5, 1.8, 2.35], at: [0.1, 1.0, -2.3], portrait: { pos: [0.4, 1.8, 2.35], at: [-0.3, 0.9, -2.3], fov: 75 } }),
    screen: () => ({ pos: [0.6, 1.3, -1.05], at: [0.55, 1.1, -2.3], fixed: true, portrait: { pos: [0.62, 1.35, -0.75], at: [0.55, 1.0, -2.3], fixed: true } }),
    console: () => ({ pos: [2.3, 1.6, -0.4], at: [2.38, 0.95, -2.15], fixed: true, portrait: { pos: [2.3, 1.75, 0.2], at: [2.38, 0.82, -2.15], fov: 70 } }),
    radio: () => ({ pos: [1.4, 1.4, -0.9], at: [2.1, 1.05, -2.2], fixed: true, portrait: { pos: [1.6, 1.5, -0.6], at: [2.15, 0.95, -2.2], fixed: true } }),
    'radio-close': () => ({ pos: [1.95, 1.3, -1.2], at: [2.1, 1.07, -2.1], fixed: true, portrait: { pos: [2.05, 1.35, -0.55], at: [2.12, 0.98, -2.1], fixed: true } }),
    room2: () => ({ pos: [0.5, 1.6, 0.7], at: [-1.6, 1.0, -2.3], fixed: true, portrait: { pos: [0.1, 1.7, 1.0], at: [-1.65, 0.9, -2.3], fov: 74 } }),
    // on phones the clue card covers the lower half: aim lower so the object sits up top
    logbook: () => ({ pos: [-1.45, 1.4, 0.15], at: [-1.48, 0.78, -0.33], fixed: true, portrait: { pos: [-1.45, 1.3, 0.45], at: [-1.48, 0.35, -0.75], fixed: true } }),
    mug: () => ({ pos: [-0.8, 1.2, 0.1], at: [-0.98, 0.82, -0.47], fixed: true, portrait: { pos: [-0.75, 1.15, 0.35], at: [-1.02, 0.45, -0.8], fixed: true } }),
    photo: () => ({ pos: [-2.0, 1.55, -0.45], at: [leftX, 1.55, -0.45], fixed: true, portrait: { pos: [-1.55, 1.6, -0.45], at: [leftX, 1.15, -0.45], fixed: true } }),
    window: () => ({ pos: [-1.4, 1.55, -0.6], at: [-1.6, 1.6, -6], fixed: true, portrait: { pos: [-1.5, 1.4, -0.5], at: [-1.5, 0.6, -6], fixed: true } }),
    green: () => L.shots.console(), red: () => L.shots.console(), knob: () => L.shots.console(), lever: () => L.shots.console(),
    shutter: () => L.shots.room2(), heater: () => L.shots.room2(), locker: () => L.shots.room2(),
  };
}
