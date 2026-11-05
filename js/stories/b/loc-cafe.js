// The Gull café. mood 'night' (case 1, part 1) or 'morning' (part 2: grey dawn, neon off, a few lamps, lighter rain).
import { toon, toonMap, canvasTex, glow, rainLines, streakTexture, MOBILE } from './stage.js';

export function buildCafe(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl, mood = 'night', head, portrait } = ctx;
  const morning = mood === 'morning';
  scene.background = new THREE.Color(morning ? '#1a2333' : '#0d1424');
  scene.fog = new THREE.Fog(morning ? '#283447' : '#101a2e', 9, 26);

  // ------------------------------------------------ room shell
  const floorTex = canvasTex(256, 256, (g, w) => {
    const n = 4, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 ? '#2a2622' : '#d8cdb8'; g.fillRect(i * s, j * s, s, s); }
    g.globalAlpha = 0.08; for (let k = 0; k < 900; k++) { g.fillStyle = Math.random() < 0.5 ? '#000' : '#fff'; g.fillRect(Math.random() * w, Math.random() * w, 2, 2); }
  }, { repeat: [5, 4] });
  const wallTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#2f4a4c'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,230,190,.07)'; g.lineWidth = 2;
    for (let x = 0; x <= w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 16; y < h; y += 64) for (let x = 16; x < w; x += 64) { g.fillStyle = 'rgba(255,220,170,.06)'; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
  }, { repeat: [5, 1] });
  const panelTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#4a2f22'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#2c1a12'; g.lineWidth = 4;
    for (let x = 0; x < w; x += 64) g.strokeRect(x + 8, 12, 48, h - 24);
    g.fillStyle = '#5e3c2a'; g.fillRect(0, 0, w, 8);
  }, { repeat: [5, 1] });

  const W = 10, D = 8, H = 3.3, backZ = -D / 2;
  add(new THREE.PlaneGeometry(W, D), toonMap(floorTex), 0, 0, 0, statics, { rot: [-Math.PI / 2, 0, 0] });
  const wallMat = toonMap(wallTex), wainMat = toonMap(panelTex);
  const wallPiece = (x0, x1, y0, y1, z = backZ) => add(box(x1 - x0, y1 - y0, 0.2), wallMat, (x0 + x1) / 2, (y0 + y1) / 2, z);
  wallPiece(-5, -4.55, 0, H); wallPiece(-2.65, -2.35, 0, H); wallPiece(-0.45, 5, 0, H);
  wallPiece(-4.55, -0.45, 0, 1.0); wallPiece(-4.55, -0.45, 2.75, H);
  add(box(0.2, H, D), wallMat, -W / 2, H / 2, 0);
  add(box(0.2, H, D), wallMat, W / 2, H / 2, 0);
  add(box(W, 1.0, 0.06), wainMat, 0, 0.5, backZ + 0.12);
  add(box(0.06, 1.0, D), wainMat, -W / 2 + 0.12, 0.5, 0);
  add(box(0.06, 1.0, D), wainMat, W / 2 - 0.12, 0.5, 0);
  add(box(W, 0.1, D), toon('#1e1712'), 0, H, 0);
  for (let x = -4; x <= 4; x += 2) add(box(0.22, 0.22, D), toon('#3b271c'), x, H - 0.12, 0);

  // ------------------------------------------------ outside: rainy street through the windows
  const outside = new THREE.Group(); scene.add(outside);
  const cityTex = canvasTex(512, 256, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h);
    if (morning) { sky.addColorStop(0, '#3d5170'); sky.addColorStop(0.7, '#8e93a4'); sky.addColorStop(1, '#c4a68e'); }
    else { sky.addColorStop(0, '#0a1222'); sky.addColorStop(1, '#1d2b4a'); }
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    let x = 0; while (x < w) {
      const bw = 40 + Math.random() * 70, bh = 90 + Math.random() * 140; g.fillStyle = morning ? `hsl(220,14%,${26 + Math.random() * 8}%)` : `hsl(222,30%,${8 + Math.random() * 6}%)`; g.fillRect(x, h - bh, bw, bh);
      for (let wy = h - bh + 10; wy < h - 10; wy += 16) for (let wx = x + 6; wx < x + bw - 8; wx += 12) if (Math.random() < (morning ? 0.1 : 0.35)) { g.fillStyle = Math.random() < 0.8 ? '#ffcf7a' : '#9ad1ff'; g.globalAlpha = 0.5 + Math.random() * 0.5; g.fillRect(wx, wy, 5, 7); g.globalAlpha = 1; }
      x += bw + 4;
    }
  });
  add(new THREE.PlaneGeometry(16, 8), new THREE.MeshBasicMaterial({ map: cityTex, fog: false }), -2.5, 2.4, -11, outside);
  add(new THREE.PlaneGeometry(14, 6), toon(morning ? '#3a404c' : '#151a22'), -2.5, -0.02, -7, outside, { rot: [-Math.PI / 2, 0, 0] });
  L.anims.push(rainLines(outside, { count: (MOBILE ? 260 : 520) * (morning ? 0.5 : 1), x0: -6, x1: 2, z0: -9.4, z1: -4.4, opacity: morning ? 0.3 : 0.45, color: morning ? '#c8d4e6' : '#8fb0e0' }));
  const streakTex = streakTexture();
  const glassMat = new THREE.MeshBasicMaterial({ map: streakTex, transparent: true, opacity: morning ? 0.6 : 0.85, depthWrite: false, color: '#c9dcff' });
  for (const x of [-3.6, -1.4]) add(new THREE.PlaneGeometry(1.95, 1.75), glassMat, x, 1.88, backZ + 0.02, scene);
  L.anims.push(dt => { streakTex.offset.y += dt * 0.05; });
  const frameM = toon('#20160f');
  for (const x of [-3.6, -1.4]) { add(box(2.1, 0.1, 0.25), frameM, x, 1.0, backZ + 0.05); add(box(2.1, 0.1, 0.25), frameM, x, 2.75, backZ + 0.05); add(box(0.06, 1.75, 0.12), frameM, x, 1.88, backZ + 0.04); }
  const openTex = canvasTex(256, 96, (g) => { g.font = 'bold 64px Trebuchet MS, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = morning ? 'transparent' : '#3cf'; g.shadowBlur = 18; g.fillStyle = morning ? '#3a4650' : '#c8f6ff'; g.fillText(morning ? 'CLOSED' : 'OPEN', 128, 50); g.fillText(morning ? 'CLOSED' : 'OPEN', 128, 50); });
  const openSign = add(new THREE.PlaneGeometry(0.8, 0.3), new THREE.MeshBasicMaterial({ map: openTex, transparent: true, toneMapped: false, depthWrite: false }), -1.4, 2.35, backZ + 0.06, scene);

  // ------------------------------------------------ signage, chalkboard menu, clock
  const neonTex = canvasTex(512, 128, (g) => { g.font = 'bold 78px Trebuchet MS, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#ff4f9a'; g.shadowBlur = morning ? 0 : 26; g.fillStyle = morning ? '#6a4a5a' : '#ffd6ea'; g.fillText('THE GULL', 256, 66); g.fillText('THE GULL', 256, 66); });
  const neon = add(new THREE.PlaneGeometry(2.2, 0.55), new THREE.MeshBasicMaterial({ map: neonTex, transparent: true, toneMapped: false, depthWrite: false }), 2.5, 2.85, backZ + 0.13, scene);
  const neonGlow = glow('#ff4f9a', 3.2, morning ? 0 : 0.35); neonGlow.position.set(2.5, 2.85, backZ + 0.3); scene.add(neonGlow);
  const menuTex = canvasTex(256, 320, (g, w, h) => {
    g.fillStyle = '#1d2420'; g.fillRect(0, 0, w, h); g.strokeStyle = '#6b4a30'; g.lineWidth = 14; g.strokeRect(0, 0, w, h);
    g.fillStyle = '#f2efe6'; g.font = 'bold 34px Georgia, serif'; g.textAlign = 'center'; g.fillText('MENU', w / 2, 56);
    g.font = '22px Georgia, serif'; g.textAlign = 'left';
    [['Latte', '3.50'], ['Espresso', '2.20'], ['Hot chocolate', '3.00'], ['Apple pie', '4.00'], ['Toast', '2.50']].forEach(([a, b], i) => { g.fillText(a, 24, 104 + i * 40); g.textAlign = 'right'; g.fillText('£' + b, w - 24, 104 + i * 40); g.textAlign = 'left'; });
    g.font = 'italic 18px Georgia, serif'; g.fillStyle = '#f7c873'; g.textAlign = 'center'; g.fillText('Open 7 am – 10 pm', w / 2, h - 22);
  });
  add(new THREE.PlaneGeometry(0.8, 1.0), toonMap(menuTex), 0.55, 2.0, backZ + 0.14, statics);
  // the clock tells the time of the scene: 00:00 at night, 06:10 in the morning
  const clockTex = canvasTex(128, 128, (g) => {
    g.fillStyle = '#efe6d2'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.strokeStyle = '#2b1d14'; g.lineWidth = 8; g.stroke();
    g.lineWidth = 3; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(64 + Math.sin(a) * 46, 64 - Math.cos(a) * 46); g.lineTo(64 + Math.sin(a) * 54, 64 - Math.cos(a) * 54); g.stroke(); }
    const hA = morning ? Math.PI * 2 * (6 + 10 / 60) / 12 : 0.02, mA = morning ? Math.PI * 2 * 10 / 60 : Math.PI * 0.2;
    g.lineWidth = 6; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + Math.sin(hA) * 30, 64 - Math.cos(hA) * 30); g.stroke();
    g.lineWidth = 4; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + Math.sin(mA) * 44, 64 - Math.cos(mA) * 44); g.stroke();
  });
  add(new THREE.CircleGeometry(0.28, 24), toonMap(clockTex), -4.88, 2.45, -1.0, statics, { rot: [0, Math.PI / 2, 0] });

  // ------------------------------------------------ counter, coffee machine, cups
  const counterFront = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#5a3624'; g.fillRect(0, 0, w, h); g.fillStyle = '#4a2b1c'; for (let x = 0; x < w; x += 22) g.fillRect(x, 0, 4, h); g.fillStyle = '#7a4c33'; g.fillRect(0, 0, w, 10); }, { repeat: [4, 1] });
  add(box(4.6, 1.02, 0.7), toonMap(counterFront), 2.45, 0.51, -2.45);
  add(box(4.8, 0.07, 0.85), toon('#c9a77c'), 2.45, 1.05, -2.45);
  add(box(4.6, 0.12, 0.05), toon('#c8a24a', { emissive: '#3a2a08' }), 2.45, 0.12, -2.08);
  const cm = new THREE.Group(); cm.position.set(1.0, 1.08, -2.6); statics.add(cm);
  add(box(0.75, 0.55, 0.45), toon('#b9c2c8'), 0, 0.28, 0, cm); add(box(0.75, 0.08, 0.45), toon('#3a2b22'), 0, 0.6, 0, cm);
  for (const x of [-0.18, 0.18]) add(cyl(0.04, 0.05, 0.12), toon('#2b2b2b'), x, 0.06, 0.2, cm);
  add(new THREE.SphereGeometry(0.06, 8, 6), toon('#c0392b', { emissive: '#400' }), 0.28, 0.42, 0.23, cm);
  for (let i = 0; i < 4; i++) add(cyl(0.05, 0.04, 0.09, 10), toon('#f4efe6'), 1.6 + i * 0.13, 1.13, -2.75);
  add(cyl(0.2, 0.2, 0.02, 16), toon('#e8e0d0'), 4.1, 1.09, -2.45);
  add(cyl(0.16, 0.18, 0.12, 12), toon('#9a5b3a'), 4.1, 1.16, -2.45);
  add(new THREE.SphereGeometry(0.21, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshToonMaterial({ color: '#cfe8ff', transparent: true, opacity: 0.35 }), 4.1, 1.09, -2.45, scene);
  if (morning) { // fresh trays of buns: Daisy has been baking
    add(box(0.6, 0.03, 0.4), toon('#9aa3ab'), 0.0, 1.1, -2.5);
    for (let i = 0; i < 6; i++) add(new THREE.SphereGeometry(0.06, 8, 6), toon('#d79a52'), -0.2 + (i % 3) * 0.2, 1.15, -2.6 + Math.floor(i / 3) * 0.18);
  }

  // ------------------------------------------------ clues
  const C = L.clues;
  const till = new THREE.Group(); till.position.set(3.35, 1.09, -2.42); scene.add(till);
  add(box(0.5, 0.26, 0.42), toon('#8a6d3b'), 0, 0.13, 0, till, { cast: true });
  add(box(0.42, 0.14, 0.18), toon('#2e3b31'), 0, 0.33, -0.08, till, { rot: [-0.5, 0, 0] });
  for (let i = 0; i < 6; i++) add(box(0.05, 0.03, 0.05), toon('#e9e2cf'), -0.12 + (i % 3) * 0.12, 0.29, 0.08 + Math.floor(i / 3) * 0.07, till);
  add(box(0.44, 0.08, 0.32), toon('#3b2a1a'), 0, 0.03, 0.3, till);
  C.till = till;
  const cctv = new THREE.Group(); cctv.position.set(-0.2, 3.0, backZ + 0.15); scene.add(cctv);
  add(box(0.08, 0.08, 0.2), toon('#ddd'), 0, 0, 0.08, cctv); add(box(0.28, 0.14, 0.14), toon('#eee'), 0.06, -0.08, 0.22, cctv, { rot: [0.4, 0.6, 0] });
  const camLed = add(new THREE.SphereGeometry(0.018, 6, 4), new THREE.MeshBasicMaterial({ color: '#300' }), 0.12, -0.12, 0.3, cctv);
  C.camera = cctv;
  let apronChairPos = [-1.85, 0, 2.1];
  if (!morning) {
    C.receipt = add(new THREE.PlaneGeometry(0.11, 0.2), toon('#fbfbf4', { side: THREE.DoubleSide }), 2.25, 1.092, -2.2, scene, { rot: [-Math.PI / 2, 0, 0.5] });
    const umb = new THREE.Group(); umb.position.set(4.45, 0, 1.25); umb.rotation.z = -0.22; scene.add(umb);
    add(new THREE.ConeGeometry(0.16, 0.85, 8, 1, true), toon('#15161b', { side: THREE.DoubleSide }), 0, 0.5, 0, umb, { cast: true });
    add(cyl(0.012, 0.012, 1.0, 5), toon('#444'), 0, 0.5, 0, umb);
    add(new THREE.TorusGeometry(0.06, 0.015, 5, 10, Math.PI), toon('#6b4426'), -0.06, 1.0, 0, umb, { rot: [0, 0, Math.PI] });
    add(new THREE.CircleGeometry(0.35, 16), new THREE.MeshBasicMaterial({ color: '#7fa6e6', transparent: true, opacity: 0.25, depthWrite: false }), 4.4, 0.006, 1.25, scene, { rot: [-Math.PI / 2, 0, 0] });
    C.umbrella = umb;
  } else {
    // a wet yellow raincoat on a hook by the door, with a puddle under it
    const coat = new THREE.Group(); coat.position.set(-4.82, 1.6, 2.15); coat.rotation.y = Math.PI; scene.add(coat);
    add(cyl(0.02, 0.02, 0.12, 6), toon('#3a2b22'), -0.04, 0.22, 0, coat, { rot: [0, 0, Math.PI / 2] });
    add(new THREE.ConeGeometry(0.3, 1.05, 10, 1, true), toon('#f2c230', { side: THREE.DoubleSide }), -0.2, -0.32, 0, coat, { cast: true });
    add(new THREE.SphereGeometry(0.16, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon('#e0b020'), -0.2, 0.2, 0, coat);
    add(cyl(0.07, 0.09, 0.62, 8), toon('#e8b828'), -0.2, -0.18, 0.24, coat, { rot: [0.25, 0, 0] });
    add(new THREE.CircleGeometry(0.32, 16), new THREE.MeshBasicMaterial({ color: '#7fa6e6', transparent: true, opacity: 0.28, depthWrite: false }), -4.6, 0.006, 2.15, scene, { rot: [-Math.PI / 2, 0, 0] });
    C.raincoat = coat;
    // Daisy's bag on a stool with a letter sticking out
    const bag = new THREE.Group(); bag.position.set(2.1, 0.66, -1.75); bag.rotation.y = 0.3; scene.add(bag);
    add(box(0.42, 0.3, 0.18), toon('#7a4a3a'), 0, 0.15, 0, bag, { cast: true });
    add(new THREE.TorusGeometry(0.13, 0.015, 5, 12, Math.PI), toon('#5a3428'), 0, 0.3, 0, bag);
    add(box(0.2, 0.14, 0.01), toon('#f6f1e2'), 0.06, 0.34, 0.03, bag, { rot: [0, 0, -0.2] });
    add(box(0.06, 0.04, 0.012), toon('#c0392b'), 0.1, 0.38, 0.04, bag, { rot: [0, 0, -0.2] });
    C.letter = bag;
    // a laptop on table 3 shows the morning camera recording
    const lap = new THREE.Group(); lap.position.set(-0.6, 0.53, -1.4); lap.rotation.y = 0.5; scene.add(lap);
    add(box(0.42, 0.02, 0.3), toon('#2a2d33'), 0, 0.01, 0, lap);
    const scrTex = canvasTex(256, 160, (g, w, h) => {
      g.fillStyle = '#0d1a14'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#2c3b33'; g.fillRect(150, 70, 90, 60); g.fillStyle = '#4a5a50'; g.fillRect(160, 60, 70, 18);
      g.fillStyle = '#f2c230'; g.beginPath(); g.moveTo(40, 160); g.lineTo(150, 95); g.lineTo(165, 112); g.lineTo(70, 160); g.fill();
      g.fillStyle = '#d9b39a'; g.beginPath(); g.arc(158, 100, 9, 0, 7); g.fill();
      g.fillStyle = '#8fffa0'; g.font = 'bold 18px monospace'; g.fillText('CAM 1  05:12', 10, 22); g.fillStyle = '#ff4a4a'; g.beginPath(); g.arc(236, 16, 6, 0, 7); g.fill();
    });
    add(new THREE.PlaneGeometry(0.4, 0.26), new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false }), 0, 0.15, -0.16, lap, { rot: [-0.25, 0, 0] });
    add(box(0.42, 0.28, 0.012), toon('#2a2d33'), 0, 0.15, -0.17, lap, { rot: [-0.25, 0, 0] });
    C.video = lap;
    apronChairPos = null;
  }

  // ------------------------------------------------ furniture (CC0 props)
  [['Kitchen_3Drawers', 0.6], ['Kitchen_Cabinet1', 1.25], ['Kitchen_Sink', 1.9], ['Kitchen_2Drawers', 2.55], ['Kitchen_3Drawers', 3.2]].forEach(([n, x]) => place(n, x, 0, -3.62, 0, 0.62));
  place('Kitchen_Fridge', 4.2, 0, -3.55, 0, 0.62);
  place('Shelf_Small1', 1.6, 2.15, -3.82, 0, 0.62); place('Shelf_Small2', 3.3, 2.0, -3.82, 0, 0.62);
  const jarCols = ['#c97b5a', '#e4b363', '#8fae7b', '#d9d2c3', '#a0675a'];
  for (let i = 0; i < 9; i++) add(cyl(0.07, 0.07, 0.2, 10), toon(jarCols[i % 5]), 1.05 + i * 0.13, 2.47, -3.82);
  for (let i = 0; i < 6; i++) add(cyl(0.06, 0.06, 0.24, 10), toon(jarCols[(i + 2) % 5]), 2.95 + i * 0.13, 2.28, -3.82);
  for (const x of [1.2, 2.1, 3.0, 3.9]) place('Stool', x, 0, -1.75, 0, 0.55);
  [[-3.0, -0.9], [-2.6, 2.1], [-0.6, -1.4]].forEach(([x, z], i) => { place(i === 2 ? 'Table_RoundSmall2' : 'Table_RoundSmall', x, 0, z, 0, 0.42); });
  if (morning) { // before opening: chairs still upside down on the tables
    place('Chair_2', -3.0, 1.0, -0.9, 0.4, 0.5).rotation.z = Math.PI;
    place('Chair_2', -3.75, 0, -0.9, Math.PI / 2); place('Chair_2', -0.6, 0, -0.65, Math.PI);
  } else {
    place('Chair_2', -3.75, 0, -0.9, Math.PI / 2); place('Chair_2', -2.25, 0, -0.9, -Math.PI / 2);
    place('Chair_2', -3.35, 0, 2.1, Math.PI / 2); place('Chair_2', -0.6, 0, -0.65, Math.PI);
    add(cyl(0.05, 0.04, 0.09, 10), toon('#f4efe6'), -2.85, 0.53, -0.8); add(cyl(0.11, 0.11, 0.015, 14), toon('#efe7da'), -3.15, 0.49, -1.0);
    add(cyl(0.05, 0.04, 0.09, 10), toon('#f4efe6'), -0.5, 0.56, -1.35);
  }
  if (apronChairPos) {
    const apronChair = place('Chair_3', ...apronChairPos, -Math.PI / 2, 0.5, scene);
    const apron = new THREE.Group(); apronChair.add(apron); apron.position.set(0, 1.55, -0.55);
    add(box(0.75, 0.9, 0.06), toon('#3f6f5a'), 0, 0, 0, apron, { rot: [0.25, 0, 0] });
    add(box(0.75, 0.6, 0.06), toon('#3f6f5a'), 0, -0.3, 0.45, apron, { rot: [1.2, 0, 0] });
    add(box(0.22, 0.12, 0.02), toon('#f4f1de'), 0.18, 0.15, 0.05, apron);
    C.apron = apron;
  }
  place('Couch_Small1', -4.4, 0, 0.65, Math.PI / 2, 0.5);
  place('Houseplant_1', -4.55, 0, -3.5, 0, 0.62); place('Houseplant_7', 4.55, 0, -0.5, 0, 0.5); place('Houseplant_3', 4.4, 1.08, -2.6, 0, 0.45);
  place('Carpet_1', 3.9, 0.005, 1.6, Math.PI / 2, 0.45);
  place('Door_4', 4.9, 0, 1.6, -Math.PI / 2, 0.5);
  place('Trashcan_Small1', 4.6, 0, -1.6, 0, 0.6);
  place('Light_Floor1', -4.5, 0, 2.9, 0, 0.62);

  // ------------------------------------------------ lights
  const lampSpots = [[1.4, -2.45], [3.4, -2.45], [-2.8, -0.9], [-2.4, 2.1]];
  lampSpots.forEach(([x, z], i) => {
    place('Light_Ceiling1', x, H - 0.82, z, 0, 0.62);
    if (morning && i >= 2) return; // only the counter lamps are on before opening
    const gl = glow('#ffb35c', 1.4, 0.55); gl.position.set(x, H - 0.92, z); scene.add(gl);
    if (!MOBILE || i < 2) { const l = new THREE.PointLight('#ffb062', MOBILE ? 7 : 6, 6.5, 1.6); l.position.set(x, H - 1.0, z); scene.add(l); }
  });
  scene.add(new THREE.HemisphereLight(morning ? '#a9b9d6' : '#7f8fc0', '#3a2a20', morning ? 1.6 : 1.1));
  const sky = new THREE.DirectionalLight(morning ? '#cfdcf5' : '#9bb8ff', morning ? 2.2 : 1.2); sky.position.set(-3, 5, -9); sky.target.position.set(0, 0, 1); scene.add(sky, sky.target);
  if (!MOBILE) {
    const key = new THREE.SpotLight('#ffcf9a', morning ? 18 : 30, 12, 0.7, 0.6, 1.5); key.position.set(1.2, H - 0.1, 0.8); key.target.position.set(1.5, 0, -1.2);
    key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0008; scene.add(key, key.target);
  }
  const neonLight = new THREE.PointLight('#ff4f9a', morning ? 0 : 5, 6, 1.6); neonLight.position.set(2.5, 2.6, -3.3); scene.add(neonLight);

  // dust in the lamp light, steam over the coffee machine
  const DUST = MOBILE ? 60 : 140;
  const dp = new Float32Array(DUST * 3); for (let i = 0; i < DUST; i++) dp.set([-4 + Math.random() * 8, 0.5 + Math.random() * 2.5, -3 + Math.random() * 5], i * 3);
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: morning ? '#e6ecf5' : '#ffd9a0', size: 0.025, transparent: true, opacity: 0.55, depthWrite: false })));
  L.anims.push((dt, t) => { const p = dustGeo.attributes.position.array; for (let i = 0; i < DUST; i++) { p[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.0008; p[i * 3] += Math.cos(t * 0.3 + i * 1.7) * 0.0006; } dustGeo.attributes.position.needsUpdate = true; });
  const steam = [];
  for (let i = 0; i < 4; i++) { const s = glow('#ffffff', 0.18, 0); s.material.blending = THREE.NormalBlending; scene.add(s); steam.push({ s, t: i / 4 }); }
  L.anims.push(dt => { for (const st of steam) { st.t = (st.t + dt * 0.35) % 1; st.s.position.set(1.6 + Math.sin(st.t * 6) * 0.03, 1.2 + st.t * 0.45, -2.75); st.s.material.opacity = Math.sin(st.t * Math.PI) * 0.22; st.s.scale.setScalar(0.12 + st.t * 0.22); } });
  L.anims.push((dt, t) => {
    if (!morning) { const fl = Math.random() < 0.01 ? 0.3 : 1; neon.material.opacity = fl; neonGlow.material.opacity = 0.35 * fl; neonLight.intensity = 5 * fl; openSign.material.opacity = 0.85 + Math.sin(t * 3) * 0.1; }
    camLed.material.color.set(Math.sin(t * 3) > 0.6 ? '#ff2a2a' : '#300');
  });

  // ------------------------------------------------ where people stand
  L.spots = morning ? {
    reyes: { pos: [0.55, 0, 1.05], ry: -0.35, base: 'fold' },
    tom: { pos: [3.9, 0, -3.15], ry: -0.1, base: 'idle', side: -1 },
    daisy: { pos: [1.6, 0, -3.1], ry: 0.15, base: 'fold' },
  } : {
    reyes: { pos: [0.55, 0, 1.05], ry: -0.35, base: 'fold' },
    tom: { pos: [2.55, 0, -3.15], ry: 0.12, base: 'idle' },
  };

  // ------------------------------------------------ camera shots
  L.shots = {
    title: () => ({ pos: [5.2, 2.6, 6.6], at: [0.4, 1.3, -1.6], portrait: { pos: [2.4, 2.0, 4.2], at: [1.2, 1.6, -2.5] } }),
    establish: () => ({ pos: [-1.2, 2.2, 6.8], at: [-1.6, 1.8, -4.5] }),
    wide: () => ({ pos: [4.4, 3.0, 5.4], at: [-0.2, 1.0, -0.9], portrait: { pos: [0.9, 2.95, 3.85], at: [0.6, 0.5, -1.3], fov: 72 } }),
    // on portrait screens: face-on and a bit lower in frame so the dialogue box does not cover it
    reyes: () => { const h = head('reyes'), p = portrait(); return { pos: [h.x + (p ? 0.3 : 0.85), h.y + 0.05, h.z + (p ? 2.3 : 1.9)], at: [h.x + (p ? 0.05 : 0), h.y - (p ? 0.45 : 0.08), h.z], fixed: true }; },
    'reyes-close': () => { const h = head('reyes'), p = portrait(); return { pos: [h.x + (p ? 0.15 : 0.35), h.y + 0.02, h.z + (p ? 1.2 : 0.95)], at: [h.x, h.y - (p ? 0.25 : 0.02), h.z], fixed: true }; },
    tom: () => { const h = head('tom'), p = portrait(); return { pos: [h.x - (p ? 0.2 : 0.55), h.y + 0.05, h.z + (p ? 2.6 : 2.2)], at: [h.x, h.y - (p ? 0.5 : 0.12), h.z], fixed: true }; },
    'over-tom': () => { const r = head('reyes'), t = head('tom'); return { pos: [r.x + 0.45, r.y + 0.2, r.z + 0.7], at: [t.x, t.y - 0.2, t.z] }; },
    'over-daisy': () => { const r = head('reyes'), t = head('daisy'); return { pos: [r.x + 0.45, r.y + 0.2, r.z + 0.7], at: [t.x, t.y - 0.2, t.z] }; },
    daisy: () => { const h = head('daisy'), p = portrait(); return { pos: [h.x + (p ? 0.15 : 0.5), h.y + 0.05, h.z + (p ? 2.6 : 2.2)], at: [h.x, h.y - (p ? 0.5 : 0.12), h.z], fixed: true }; },
    'daisy-close': () => { const h = head('daisy'), p = portrait(); return { pos: [h.x + (p ? 0.1 : 0.3), h.y + 0.02, h.z + (p ? 1.3 : 1.0)], at: [h.x, h.y - (p ? 0.28 : 0.02), h.z], fixed: true }; },
    counter: () => ({ pos: [3.7, 2.1, 0.9], at: [2.4, 1.1, -2.4] }),
    till: () => ({ pos: [3.3, 1.75, -0.9], at: [3.35, 1.15, -2.42] }),
    receipt: () => ({ pos: [2.15, 1.65, -1.35], at: [2.25, 1.09, -2.2] }),
    umbrella: () => ({ pos: [2.9, 1.5, 2.9], at: [4.4, 0.6, 1.25] }),
    'umbrella-close': () => ({ pos: [3.75, 1.15, 1.75], at: [4.45, 0.9, 1.2] }),
    apron: () => ({ pos: [-0.6, 1.55, 3.4], at: [-1.95, 0.75, 2.1] }),
    camera: () => ({ pos: [0.9, 2.1, -1.6], at: [-0.2, 2.9, backZ] }),
    raincoat: () => ({ pos: [-2.9, 1.6, 2.9], at: [-4.7, 1.2, 2.15], fixed: true }),
    letter: () => ({ pos: [2.3, 1.45, -0.55], at: [2.1, 0.9, -1.75], fixed: true }),
    video: () => ({ pos: [-0.1, 1.15, -0.55], at: [-0.66, 0.66, -1.5], fixed: true }),
  };
}
