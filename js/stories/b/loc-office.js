// Blackwood & Reyes Investigations: the agency office, the home base of the whole series.
// Grey rainy morning through venetian blinds, warm desk lamps, Jenna's glowing monitors, a cork board with red string.
import { toon, toonMap, canvasTex, glow, rainLines, streakTexture, MOBILE } from './stage.js';

export function buildOffice(ctx) {
  const { THREE, L, scene, statics, add, place, box, cyl, head, portrait } = ctx;
  scene.background = new THREE.Color('#141b28');
  scene.fog = new THREE.Fog('#1b2333', 8, 22);
  const W = 9, D = 7, H = 3.2, backZ = -D / 2, leftX = -W / 2, rightX = W / 2;

  // ------------------------------------------------ shell: plank floor, plum wallpaper, dark wainscot
  const floorTex = canvasTex(256, 256, (g, w, h) => {
    for (let y = 0; y < h; y += 32) for (let x = (y / 32) % 2 ? -60 : 0; x < w; x += 120) {
      g.fillStyle = `hsl(25,${30 + Math.random() * 10}%,${20 + Math.random() * 7}%)`; g.fillRect(x, y, 118, 30);
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x, y + 30, 120, 2);
    }
    g.globalAlpha = 0.06; for (let k = 0; k < 600; k++) { g.fillStyle = '#000'; g.fillRect(Math.random() * w, Math.random() * h, 8, 1); }
  }, { repeat: [3, 3] });
  const wallTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#4a3340'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,210,180,.06)'; g.lineWidth = 10;
    for (let x = 0; x <= w; x += 42) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  }, { repeat: [4, 1] });
  const wainTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#2e1f18'; g.fillRect(0, 0, w, h); g.strokeStyle = '#1c120d'; g.lineWidth = 4;
    for (let x = 0; x < w; x += 64) g.strokeRect(x + 8, 12, 48, h - 24);
    g.fillStyle = '#4a3226'; g.fillRect(0, 0, w, 8);
  }, { repeat: [4, 1] });
  add(new THREE.PlaneGeometry(W, D), toonMap(floorTex), 0, 0, 0, statics, { rot: [-Math.PI / 2, 0, 0] });
  const wallMat = toonMap(wallTex), wainMat = toonMap(wainTex);
  // back wall with one big window (x -1.4..1.6, y 0.95..2.75)
  const wx0 = -1.4, wx1 = 1.6, wy0 = 0.95, wy1 = 2.75;
  const wallPiece = (x0, x1, y0, y1) => add(box(x1 - x0, y1 - y0, 0.2), wallMat, (x0 + x1) / 2, (y0 + y1) / 2, backZ);
  wallPiece(leftX, wx0, 0, H); wallPiece(wx1, rightX, 0, H); wallPiece(wx0, wx1, 0, wy0); wallPiece(wx0, wx1, wy1, H);
  add(box(0.2, H, D), wallMat, leftX, H / 2, 0);
  add(box(0.2, H, D), wallMat, rightX, H / 2, 0);
  add(box(W, 0.9, 0.06), wainMat, 0, 0.45, backZ + 0.12);
  add(box(0.06, 0.9, D), wainMat, leftX + 0.12, 0.45, 0);
  add(box(0.06, 0.9, D), wainMat, rightX - 0.12, 0.45, 0);
  add(box(W, 0.1, D), toon('#d8cfc0'), 0, H, 0);
  add(box(W, 0.12, 0.12), toon('#3a281e'), 0, H - 0.06, backZ + 0.15);

  // ------------------------------------------------ outside: the harbor on a grey rainy morning
  const outside = new THREE.Group(); scene.add(outside);
  const harborTex = canvasTex(512, 256, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.6); sky.addColorStop(0, '#3c4c66'); sky.addColorStop(1, '#a5a4ad'); g.fillStyle = sky; g.fillRect(0, 0, w, h);
    g.fillStyle = '#5d6576'; g.fillRect(0, h * 0.6, w, h * 0.4);                               // water
    g.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * w, h * 0.62 + Math.random() * h * 0.36, 20 + Math.random() * 30, 1);
    g.fillStyle = '#4a5162';                                                                       // far shore
    let x = 0; while (x < w) { const bw = 20 + Math.random() * 40, bh = 10 + Math.random() * 40; g.fillRect(x, h * 0.6 - bh, bw, bh); x += bw; }
    g.strokeStyle = '#363d4c'; g.lineWidth = 5;                                                   // two cranes
    for (const cx of [120, 360]) { g.beginPath(); g.moveTo(cx, h * 0.6); g.lineTo(cx, h * 0.18); g.lineTo(cx + 90, h * 0.18); g.moveTo(cx - 30, h * 0.18); g.lineTo(cx, h * 0.18); g.moveTo(cx + 60, h * 0.18); g.lineTo(cx + 60, h * 0.36); g.stroke(); g.fillStyle = '#ff5a4a'; g.fillRect(cx - 3, h * 0.17, 6, 4); }
    g.fillStyle = '#2b303b'; g.fillRect(230, h * 0.56, 90, 14); g.fillRect(250, h * 0.5, 40, 10);    // a ship
    g.fillStyle = '#ffcf7a'; for (let i = 0; i < 6; i++) g.fillRect(236 + i * 13, h * 0.585, 4, 3);
  });
  add(new THREE.PlaneGeometry(14, 7), new THREE.MeshBasicMaterial({ map: harborTex, fog: false }), 0.2, 2.0, -10, outside);
  L.anims.push(rainLines(outside, { count: MOBILE ? 200 : 400, x0: -3, x1: 3.5, z0: -8, z1: -4, opacity: 0.35, color: '#c8d4e6' }));
  const streak = streakTexture();
  add(new THREE.PlaneGeometry(wx1 - wx0, wy1 - wy0), new THREE.MeshBasicMaterial({ map: streak, transparent: true, opacity: 0.6, depthWrite: false, color: '#c9dcff' }), (wx0 + wx1) / 2, (wy0 + wy1) / 2, backZ + 0.02, scene);
  L.anims.push(dt => { streak.offset.y += dt * 0.04; });
  const frame = toon('#1d140f');
  add(box(wx1 - wx0 + 0.16, 0.1, 0.28), frame, (wx0 + wx1) / 2, wy0, backZ + 0.06); add(box(wx1 - wx0 + 0.16, 0.08, 0.2), frame, (wx0 + wx1) / 2, wy1, backZ + 0.05);
  add(box(0.06, wy1 - wy0, 0.12), frame, (wx0 + wx1) / 2, (wy0 + wy1) / 2, backZ + 0.05);
  // venetian blinds, half open: light comes through in stripes
  const slat = toon('#d9cdb4');
  for (let y = wy1 - 0.08; y > wy0 + 1.2; y -= 0.07) add(box(wx1 - wx0, 0.035, 0.012), slat, (wx0 + wx1) / 2, y, backZ + 0.13, statics, { rot: [0.9, 0, 0] });
  add(box(wx1 - wx0 + 0.1, 0.06, 0.08), slat, (wx0 + wx1) / 2, wy0 + 1.17, backZ + 0.14);
  // painted name on the door glass, read from inside (mirrored)
  const doorTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#c9d6dc'; g.globalAlpha = 0.55; g.fillRect(0, 0, w, h); g.globalAlpha = 1;
    g.save(); g.translate(w, 0); g.scale(-1, 1);
    g.fillStyle = '#1d1a1a'; g.textAlign = 'center'; g.font = 'bold 30px Georgia, serif'; g.fillText('BLACKWOOD', w / 2, 92); g.fillText('& REYES', w / 2, 128);
    g.font = '18px Georgia, serif'; g.fillText('INVESTIGATIONS', w / 2, 162); g.restore();
  });
  place('Door_1', rightX - 0.08, 0, 2.2, -Math.PI / 2, 0.5);
  add(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ map: doorTex, transparent: true }), rightX - 0.17, 1.65, 1.76, scene, { rot: [0, -Math.PI / 2, 0] });

  // ------------------------------------------------ cork board with photos and red string (left wall)
  const boardTex = canvasTex(512, 320, (g, w, h) => {
    g.fillStyle = '#b48552'; g.fillRect(0, 0, w, h);
    g.globalAlpha = 0.25; for (let i = 0; i < 1500; i++) { g.fillStyle = Math.random() < 0.5 ? '#7a5530' : '#d9b07a'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } g.globalAlpha = 1;
    const pins = [[70, 70], [230, 50], [400, 80], [120, 220], [300, 200], [440, 240]];
    g.strokeStyle = '#c0182b'; g.lineWidth = 3; g.beginPath();
    [[0, 1], [1, 2], [1, 4], [3, 4], [4, 5], [0, 3]].forEach(([a, b]) => { g.moveTo(...pins[a]); g.lineTo(...pins[b]); }); g.stroke();
    const cols = ['#f2efe6', '#d8e4ea', '#efe0b0', '#f2efe6', '#e8d4d4', '#f2efe6'];
    pins.forEach(([x, y], i) => {
      g.save(); g.translate(x, y); g.rotate((Math.random() - 0.5) * 0.2);
      g.fillStyle = cols[i]; g.fillRect(-40, -10, 80, 64); g.fillStyle = i === 4 ? '#2a2a2a' : '#7a8794'; g.fillRect(-32, -4, 64, 40);
      if (i === 4) { g.fillStyle = '#c0182b'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.fillText('?', 0, 28); }
      g.fillStyle = '#333'; g.font = '11px monospace'; g.textAlign = 'center'; g.fillText(['HARBOR', 'DOCK 9', 'GRANT?', 'THE GULL', 'WHO?', 'MARKET'][i], 0, 50); g.restore();
      g.fillStyle = '#e01c34'; g.beginPath(); g.arc(x, y - 4, 6, 0, 7); g.fill();
    });
  });
  add(box(0.05, 1.15, 1.85), toon('#4a3020'), leftX + 0.12, 1.85, -1.2);
  add(new THREE.PlaneGeometry(1.75, 1.05), toonMap(boardTex), leftX + 0.16, 1.85, -1.2, statics, { rot: [0, Math.PI / 2, 0] });
  place('Drawer_1', leftX + 0.35, 0, -2.6, Math.PI / 2, 0.55);
  place('Drawer_1', leftX + 0.35, 0, 0.1, Math.PI / 2, 0.55);

  // ------------------------------------------------ desks (made here: the pack has none)
  const wood = toon('#6b4630'), woodDark = toon('#4a2f20'), paper = toon('#f3efe4');
  function desk(x, z, ry = 0) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; statics.add(g);
    add(box(1.7, 0.07, 0.85), wood, 0, 0.78, 0, g);
    add(box(0.5, 0.74, 0.8), woodDark, -0.58, 0.37, 0, g); add(box(0.06, 0.74, 0.8), woodDark, 0.8, 0.37, 0, g);
    for (let i = 0; i < 3; i++) add(box(0.4, 0.02, 0.02), toon('#c9a24a'), -0.58, 0.18 + i * 0.22, 0.41, g);
    add(box(1.6, 0.4, 0.04), woodDark, 0.1, 0.5, -0.38, g);
    return g;
  }
  const chair = (x, z, ry) => { place('Chair_1', x, 0, z, ry, 0.5); };
  // Reyes: neat
  const rd = desk(-1.9, -1.15);
  add(box(0.5, 0.32, 0.04), toon('#20242c'), 0.2, 1.0, -0.2, rd); add(box(0.46, 0.27, 0.01), new THREE.MeshBasicMaterial({ color: '#2d4a66' }), 0.2, 1.0, -0.175, rd);
  add(box(0.08, 0.16, 0.06), toon('#20242c'), 0.2, 0.86, -0.22, rd);
  for (let i = 0; i < 4; i++) add(box(0.32, 0.03, 0.24), toon(['#9a3b2e', '#2e4a6a', '#d9c9a3', '#3e6b52'][i]), -0.5, 0.83 + i * 0.03, 0.1, rd);
  add(cyl(0.05, 0.045, 0.1, 10), toon('#e8e2d4'), 0.62, 0.86, 0.15, rd);
  place('Light_Desk', -2.55, 0.81, -1.3, 0.6, 0.55);
  chair(-1.9, -0.45, Math.PI);
  // Blackwood: chaos (the clues live here)
  const bd = desk(1.9, -1.15);
  for (let i = 0; i < 9; i++) add(new THREE.PlaneGeometry(0.21, 0.29), paper, -0.6 + Math.random() * 1.1, 0.816 + i * 0.001, -0.15 + Math.random() * 0.4, bd, { rot: [-Math.PI / 2, 0, Math.random() * 1.2 - 0.6] });
  for (const [x, z] of [[0.55, 0.25], [0.7, -0.05]]) add(cyl(0.05, 0.045, 0.1, 10), toon('#c9c2b4'), x, 0.87, z, bd);
  add(cyl(0.15, 0.17, 0.05, 14), toon('#2a2a2a'), -0.55, 0.84, -0.22, bd); add(cyl(0.09, 0.09, 0.08, 12), toon('#2a2a2a'), -0.55, 0.9, -0.22, bd); // his hat
  place('Light_Desk', 2.6, 0.81, -1.35, -0.4, 0.55);
  chair(1.9, -0.4, Math.PI + 0.5);
  // Jenna's corner: two monitors full of code
  const jd = desk(-3.0, 2.0, Math.PI / 2);
  const codeTex = canvasTex(256, 160, (g, w, h) => {
    g.fillStyle = '#071318'; g.fillRect(0, 0, w, h);
    for (let y = 12; y < h; y += 12) { let x = 8; while (x < w - 20) { const l = 8 + Math.random() * 40; g.fillStyle = ['#47d6ff', '#9dff9a', '#ffcf6a', '#d58cff', '#5b7a88'][Math.random() * 5 | 0]; g.fillRect(x, y, l, 5); x += l + 6; if (Math.random() < 0.2) break; } }
  });
  const scr = new THREE.MeshBasicMaterial({ map: codeTex, toneMapped: false });
  for (const dz of [-0.33, 0.33]) {
    add(box(0.05, 0.36, 0.6), toon('#15181d'), -0.15, 1.05, dz, jd);
    add(new THREE.PlaneGeometry(0.56, 0.32), scr, -0.12, 1.05, dz, jd, { rot: [0, Math.PI / 2, 0] });
  }
  add(box(0.2, 0.02, 0.5), toon('#2a2d33'), 0.15, 0.82, 0, jd);
  const jg = glow('#47d6ff', 1.2, 0.18); jg.position.set(-2.8, 1.1, 2.0); scene.add(jg);
  const jl = new THREE.PointLight('#5fd8ff', 0.9, 1.6, 2); jl.position.set(-3.0, 1.1, 2.0); scene.add(jl);
  place('Chair_1', -2.35, 0, 2.0, -Math.PI / 2, 0.5);
  // coffee corner, couch, shelves, plants
  add(box(0.9, 0.85, 0.5), woodDark, 3.6, 0.43, -3.05);
  add(box(0.36, 0.42, 0.3), toon('#59626a'), 3.45, 1.06, -3.05); add(box(0.36, 0.05, 0.3), toon('#3a2b22'), 3.45, 1.29, -3.05);
  for (let i = 0; i < 3; i++) add(cyl(0.045, 0.04, 0.09, 10), toon(['#e8e2d4', '#b8442e', '#2e4a6a'][i]), 3.75 + (i % 2) * 0.1, 0.9, -3.1 + i * 0.1);
  place('Bookshelf', 4.15, 0, 0.35, -Math.PI / 2, 0.55);
  // fill the shelves: files, books, a box
  const bookCols = ['#7a2e2e', '#2e4a6a', '#c9a24a', '#3e6b52', '#5a3e6a', '#b8b0a0', '#8a4a2a'];
  for (const y of [0.42, 0.95, 1.48, 2.0]) {
    let z = -0.2;
    while (z < 0.9) { const w = 0.05 + Math.random() * 0.05, h = 0.26 + Math.random() * 0.14; add(box(0.24, h, w), toon(bookCols[Math.random() * 7 | 0]), 4.2, y + h / 2, z); z += w + 0.004; if (Math.random() < 0.12) z += 0.15; }
  }
  place('Couch_Medium1', 2.9, 0, 2.85, Math.PI, 0.5);
  place('Houseplant_5', -0.0 - 3.9, 0, 3.0, 0, 0.6); place('Houseplant_1', 2.15, 0, -3.1, 0, 0.55);
  place('Carpet_Round', 0.0, 0.005, 0.6, 0, 0.55);
  place('Trashcan_Small1', 2.95, 0, -0.75, 0, 0.55);
  // coat rack by the door with a trench coat
  add(cyl(0.025, 0.03, 1.85, 6), toon('#2a1c14'), 4.0, 0.93, 1.1); add(cyl(0.22, 0.25, 0.04, 10), toon('#2a1c14'), 4.0, 0.02, 1.1);
  add(new THREE.ConeGeometry(0.26, 1.0, 10, 1, true), toon('#8a7350', { side: THREE.DoubleSide }), 4.0, 1.3, 1.17);

  // ceiling fan, slowly turning
  const fan = new THREE.Group(); fan.position.set(0.2, H - 0.45, 0.6); scene.add(fan);
  add(cyl(0.02, 0.02, 0.4, 6), toon('#2a2018'), 0, 0.22, 0, fan); add(cyl(0.12, 0.12, 0.12, 12), toon('#3a2a20'), 0, 0, 0, fan);
  for (let i = 0; i < 4; i++) { const b = add(box(0.75, 0.015, 0.14), toon('#5a3e2a'), 0, -0.02, 0, fan); b.rotation.y = i * Math.PI / 2; b.translateX(0.45); }
  L.anims.push(dt => { fan.rotation.y += dt * 1.6; });

  // ------------------------------------------------ clues on Blackwood's desk
  const C = L.clues, deskTop = 0.815, bx = 1.9, bz = -1.15;
  const ticket = new THREE.Group(); ticket.position.set(bx - 0.5, deskTop + 0.004, bz + 0.25); ticket.rotation.y = 0.3; scene.add(ticket);
  const ticketTex = canvasTex(256, 112, (g, w, h) => {
    g.fillStyle = '#f7f4ec'; g.fillRect(0, 0, w, h); g.fillStyle = '#1e5aa8'; g.fillRect(0, 0, w, 22);
    g.fillStyle = '#fff'; g.font = 'bold 14px sans-serif'; g.fillText('BOARDING PASS', 8, 16);
    g.fillStyle = '#222'; g.font = 'bold 26px sans-serif'; g.fillText('HBC → LIS', 8, 56); g.font = '14px sans-serif'; g.fillText('BLACKWOOD / OSCAR', 8, 80); g.fillText('FRI 08:15', 8, 100);
    g.strokeStyle = '#bbb'; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(190, 0); g.lineTo(190, h); g.stroke();
  });
  add(new THREE.PlaneGeometry(0.3, 0.13), toonMap(ticketTex), 0, 0, 0, ticket, { rot: [-Math.PI / 2, 0, 0] });
  C.ticket = ticket;
  const card = new THREE.Group(); card.position.set(bx + 0.05, deskTop + 0.006, bz + 0.3); card.rotation.y = -0.4; scene.add(card);
  const cardTex = canvasTex(160, 100, (g, w, h) => {
    g.fillStyle = '#2f4a4c'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd6ea'; g.font = 'bold 16px sans-serif'; g.fillText('THE GULL', 10, 22);
    for (let i = 0; i < 10; i++) { g.strokeStyle = '#f2efe6'; g.lineWidth = 2; g.beginPath(); g.arc(20 + (i % 5) * 28, 50 + Math.floor(i / 5) * 28, 9, 0, 7); g.stroke(); if (i < 9) { g.fillStyle = '#ffb35c'; g.beginPath(); g.arc(20 + (i % 5) * 28, 50 + Math.floor(i / 5) * 28, 6, 0, 7); g.fill(); } }
  });
  add(new THREE.PlaneGeometry(0.16, 0.1), toonMap(cardTex), 0, 0, 0, card, { rot: [-Math.PI / 2, 0, 0] });
  C.card = card;
  // sticky note on the desk lamp
  const note = new THREE.Group(); note.position.set(2.48, 1.12, -1.22); note.rotation.y = -0.3; scene.add(note);
  const noteTex = canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#ffe873'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a2a6a'; g.font = 'bold 22px "Comic Sans MS", cursive'; g.fillText('22:40', 12, 34); g.fillText('The Gull', 12, 62); g.fillText('T. – cam', 12, 90); g.fillText('OFF!', 12, 116); });
  add(new THREE.PlaneGeometry(0.13, 0.13), toonMap(noteTex), 0, 0, 0, note, { rot: [0, 0, 0.08] });
  C.note = note;
  const photo = new THREE.Group(); photo.position.set(bx + 0.35, deskTop, bz - 0.25); photo.rotation.y = -0.25; scene.add(photo);
  const photoTex = canvasTex(128, 160, (g, w, h) => {
    g.fillStyle = '#e9e2d0'; g.fillRect(0, 0, w, h); g.fillStyle = '#4e5a68'; g.fillRect(10, 10, w - 20, h - 40);
    g.fillStyle = '#1b1d22'; g.beginPath(); g.arc(42, 62, 14, 0, 7); g.fill(); g.fillRect(26, 76, 32, 60);    // Blackwood
    g.fillStyle = '#0c0d10'; g.beginPath(); g.arc(88, 64, 16, 0, 7); g.fill(); g.beginPath(); g.moveTo(66, 66); g.lineTo(88, 40); g.lineTo(110, 66); g.fill(); g.fillRect(72, 78, 34, 58); // someone in a hood
    g.fillStyle = '#333'; g.font = 'italic 12px Georgia'; g.fillText('dock 9', 40, h - 12);
  });
  add(box(0.17, 0.21, 0.015), toon('#3a2618'), 0, 0.11, 0, photo, { rot: [-0.15, 0, 0] });
  add(new THREE.PlaneGeometry(0.14, 0.18), toonMap(photoTex), 0, 0.11, 0.009, photo, { rot: [-0.15, 0, 0] });
  C.photo = photo;

  // ------------------------------------------------ lights: cold window, warm lamps, cyan screens
  scene.add(new THREE.HemisphereLight('#9fb0cf', '#3a2a24', 1.25));
  const win = new THREE.DirectionalLight('#c9d8f2', 1.8); win.position.set(0.2, 3.2, -8); win.target.position.set(0.2, 0, 1.5); scene.add(win, win.target);
  if (!MOBILE) { win.castShadow = true; win.shadow.mapSize.set(1024, 1024); win.shadow.bias = -0.0008; Object.assign(win.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 16 }); }
  for (const [x, z] of [[-2.5, -1.25], [2.55, -1.3]]) {
    const gl = glow('#ffc070', 0.9, 0.5); gl.position.set(x, 1.15, z); scene.add(gl);
    const l = new THREE.PointLight('#ffb062', MOBILE ? 4 : 4.5, 3.5, 1.6); l.position.set(x, 1.2, z + 0.15); scene.add(l);
  }
  place('Light_Ceiling5', 0.2, H - 0.75, -1.4, 0, 0.55);
  const neonOut = glow('#ff4f9a', 2.4, 0.2); neonOut.position.set(1.2, 2.5, -6.5); scene.add(neonOut);
  const DUST = MOBILE ? 50 : 110;
  const dp = new Float32Array(DUST * 3); for (let i = 0; i < DUST; i++) dp.set([-1.6 + Math.random() * 3.6, 0.6 + Math.random() * 2.2, -3.2 + Math.random() * 3.5], i * 3);
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: '#e6ecf5', size: 0.022, transparent: true, opacity: 0.5, depthWrite: false })));
  L.anims.push((dt, t) => { const p = dustGeo.attributes.position.array; for (let i = 0; i < DUST; i++) { p[i * 3 + 1] += Math.sin(t * 0.4 + i) * 0.0007; } dustGeo.attributes.position.needsUpdate = true; codeTex.offset.y = (t * 0.05) % 1; });
  codeTex.wrapT = THREE.RepeatWrapping;

  // ------------------------------------------------ people and shots
  L.spots = {
    reyes: { pos: [0.75, 0, -0.1], ry: -0.55, base: 'fold' },
    jenna: { pos: [-2.0, 0, 1.55], ry: 0.75, base: 'idle', side: 1 },
  };
  L.pan = 2.2;
  L.shots = {
    establish: () => ({ pos: [3.6, 2.4, 3.4], at: [-0.6, 1.3, -1.6], portrait: { pos: [2.2, 2.2, 4.4], at: [0.0, 1.2, -1.4] } }),
    wide: () => ({ pos: [0.6, 2.9, 4.6], at: [0.4, 0.9, -1.0], portrait: { pos: [0.5, 2.9, 3.3], at: [0.4, 0.5, -1.2], fov: 72 } }),
    window: () => ({ pos: [-1.0, 1.55, 0.5], at: [0.5, 1.75, -6], fixed: true }),
    desk: () => ({ pos: [2.1, 1.75, 0.45], at: [1.95, 0.85, -1.2], fixed: true }),
    'desk-empty': () => ({ pos: [0.6, 1.35, 1.2], at: [2.0, 0.95, -1.3] }),
    board: () => ({ pos: [-2.2, 1.8, -0.9], at: [leftX, 1.8, -1.2], fixed: true }),
    door: () => ({ pos: [1.6, 1.6, 2.0], at: [rightX, 1.6, 2.2] }),
    ticket: () => ({ pos: [1.45, 1.35, -0.4], at: [1.4, 0.82, -0.9], fixed: true }),
    card: () => ({ pos: [2.0, 1.32, -0.35], at: [1.95, 0.82, -0.85], fixed: true }),
    note: () => ({ pos: [2.2, 1.25, -0.6], at: [2.48, 1.12, -1.22], fixed: true }),
    photo: () => ({ pos: [2.15, 1.2, -0.75], at: [2.25, 0.92, -1.4], fixed: true }),
    'over-jenna': () => { const r = head('reyes'), j = head('jenna'); return { pos: [r.x + 0.5, r.y + 0.15, r.z + 0.8], at: [j.x, j.y - 0.2, j.z] }; },
    'over-reyes': () => { const r = head('reyes'), j = head('jenna'); return { pos: [j.x - 0.3, j.y + 0.15, j.z + 0.75], at: [r.x, r.y - 0.2, r.z] }; },
  };
}
