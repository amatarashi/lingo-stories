import { toon, canvasTex, glow } from '../stage.js';

export function buildLighthouse({ THREE, L, scene, add, box, cyl }) {
  scene.background = new THREE.Color('#a5c4d0');
  scene.fog = new THREE.Fog('#a5c4d0', 19, 83);
  scene.add(new THREE.HemisphereLight('#e9f5f6', '#59634e', 2.35));
  const sun = new THREE.DirectionalLight('#ffe5b1', 2.7);
  sun.position.set(-6, 9, 5); scene.add(sun);

  const grass = toon('#657f54'), earth = toon('#65615c'), stone = toon('#7f898b');
  const plaster = toon('#e9e1cc'), slate = toon('#34474c'), rust = toon('#87493c');
  const wood = toon('#695744'), trim = toon('#393f3c');
  const masonry = canvasTex(256, 192, (g, w, h) => {
    g.fillStyle = '#737b78'; g.fillRect(0, 0, w, h);
    const shades = ['#9ba29a', '#8a928b', '#959990', '#8c958e', '#a5a69a'];
    for (let y = 0, row = 0; y < h; y += 24, row++) {
      for (let x = -34 * (row % 2), col = 0; x < w; x += 64, col++) {
        g.fillStyle = shades[(row * 3 + col * 7) % shades.length];
        g.fillRect(x + 1, y + 1, 62, 22);
        g.fillStyle = 'rgba(255,250,220,.18)'; g.fillRect(x + 4, y + 2, 48, 2);
        g.fillStyle = 'rgba(30,43,38,.17)'; g.fillRect(x + 5, y + 20, 52, 2);
      }
    }
  }, { repeat: [2, 2] });
  const shedWall = new THREE.MeshToonMaterial({ map: masonry });
  const plate = (w, h, x, y, z, map, parent, rot) => add(
    new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map }), x, y, z, parent, { rot },
  );
  const paper = (heading, rows, { dark = false, crossed = false } = {}) => canvasTex(512, 384, (g, w, h) => {
    g.fillStyle = dark ? '#2b4038' : '#e8d9b7'; g.fillRect(0, 0, w, h);
    g.strokeStyle = dark ? '#d9c883' : '#9c8260'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20);
    g.fillStyle = dark ? '#f9edbd' : '#293d3d';
    g.font = 'bold 43px serif'; g.textAlign = 'center'; g.fillText(heading, w / 2, 100, w - 65);
    g.font = '29px monospace';
    rows.forEach((row, i) => g.fillText(row, w / 2, 166 + i * 58, w - 65));
    if (crossed) {
      g.strokeStyle = '#ac5549'; g.lineWidth = 5;
      g.beginPath(); g.moveTo(76, 274); g.lineTo(w - 76, 283); g.stroke();
    }
  });

  // The road stays well above the shoreline. The gate on the coast path is closed.
  const seaMap = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#4d858e'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 130; i++) {
      g.fillStyle = i % 2 ? 'rgba(221,243,235,.22)' : 'rgba(24,63,79,.24)';
      g.fillRect((i * 43) % w, (i * 31) % h, 8 + i % 27, 1 + i % 3);
    }
  }, { repeat: [18, 18] });
  add(new THREE.PlaneGeometry(180, 180), new THREE.MeshBasicMaterial({ map: seaMap }),
    -20, -3.2, -20, undefined, { rot: [-Math.PI / 2, 0, 0] });
  add(box(38, 3.1, 48), earth, 13, -1.58, -8);
  add(box(38, 0.14, 48), grass, 13, -0.09, -8);
  const pathMap = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#a59a84'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 270; i++) {
      g.fillStyle = i % 2 ? '#b8ad97' : '#918574';
      g.fillRect((i * 41) % w, (i * 59) % h, 1 + i % 5, 1 + i % 3);
    }
  }, { repeat: [2, 6] });
  add(new THREE.PlaneGeometry(2.1, 18), new THREE.MeshToonMaterial({ map: pathMap }),
    0.65, -0.008, 1.05, undefined, { rot: [-Math.PI / 2, 0, 0] });
  for (let i = 0; i < 20; i++) {
    const rock = add(new THREE.DodecahedronGeometry(0.62 + i % 3 * 0.19, 0), earth,
      -5.9 - i % 3 * 0.45, -1.5 - i % 3 * 0.27, i * 1.63 - 24);
    rock.scale.set(1.45, 2, 1.35);
  }
  for (const [x, z, r] of [[-28,-32,8],[-36,-41,11],[-48,-52,15],[-22,-58,12]]) {
    const hill = add(new THREE.IcosahedronGeometry(r, 1), toon('#719396'), x, -3.5, z);
    hill.scale.set(1.8, 0.42, 0.9);
  }
  for (const [x, z, r] of [[10,-21,8],[19,-27,13],[39,-52,16]]) {
    const bank = add(new THREE.IcosahedronGeometry(r, 2), toon('#779174'), x, -1.9, z);
    bank.scale.set(1.8, .35, .83);
  }
  const tuft = new THREE.Object3D();
  const grasses = new THREE.InstancedMesh(new THREE.ConeGeometry(.11, .44, 4), toon('#a5a263'), 90);
  const grassColor = new THREE.Color();
  for (let i = 0; i < grasses.count; i++) {
    const side = i % 3 === 0 ? -1 : 1;
    tuft.position.set(side < 0 ? -4.95 + ((i * 17) % 31) / 10 : 3.95 + ((i * 23) % 57) / 10,
      .105, 8.9 - ((i * 29) % 213) / 10);
    tuft.scale.set(.55 + i % 5 * .1, .52 + i % 7 * .08, .59);
    tuft.rotation.set(.2, i * .7, -.28 + i % 5 * .10);
    tuft.updateMatrix();
    grasses.setMatrixAt(i, tuft.matrix);
    grasses.setColorAt(i, grassColor.setHSL(.135 + i % 5 * .025, .3, .51 + i % 4 * .08));
  }
  scene.add(grasses);
  for (const x of [-4.8,-3.7,-2.6,-1.5,2.1,3.2,4.3]) {
    add(box(0.85, 0.55, 0.34), stone, x, 0.25, 3.6);
    add(box(0.92, 0.095, 0.4), trim, x, 0.57, 3.6);
  }
  add(box(0.13, 1.25, 0.13), wood, -1.2, 0.63, 3.45);
  const signs = new THREE.Group(); signs.position.set(-1.2, 1.03, 3.53); scene.add(signs);
  add(box(0.95, 0.29, 0.06), wood, 0, 0.22, 0, signs);
  add(box(0.95, 0.29, 0.06), wood, 0, -0.13, 0, signs);
  plate(0.89, 0.27, 0, 0.22, 0.037, paper('COAST PATH', ['CLOSED'], { dark: true }), signs);
  plate(0.89, 0.27, 0, -0.13, 0.037, paper('LIGHTHOUSE', ['INLAND ROAD'], { dark: true }), signs);
  L.clues.signs = signs;

  // White masonry tower, red lantern roof and keeper's stone shelter.
  const tx = 2.6, tz = -3.4;
  add(cyl(1.21, 1.32, 0.32, 20), stone, tx, 0.12, tz);
  add(cyl(0.82, 1.17, 5.4, 24), plaster, tx, 2.95, tz);
  for (const y of [1, 1.84, 2.68, 3.52, 4.36, 5.2]) {
    const r = 1.17 - (y - 0.25) / 5.4 * 0.35;
    add(cyl(r + .012, r + .012, 0.028, 24), toon('#c5bea6'), tx, y, tz);
  }
  add(cyl(1.16, 0.93, 0.25, 20), slate, tx, 5.73, tz);
  add(cyl(0.79, 0.79, 0.92, 12), toon('#81a7aa'), tx, 6.27, tz);
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    add(box(0.045, 0.95, 0.045), slate, tx + Math.cos(a) * 0.8, 6.26, tz + Math.sin(a) * 0.8);
  }
  add(cyl(0.06, 0.97, 0.63, 16), rust, tx, 7.05, tz);
  add(cyl(0.028, 0.028, 0.38, 8), slate, tx, 7.49, tz);
  add(box(0.72, 1.5, 0.22), stone, tx, 0.81, tz + 1.07);
  add(box(0.56, 1.30, 0.045), slate, tx, 0.77, tz + 1.192);
  add(box(.035, .047, .028), new THREE.MeshBasicMaterial({ color: '#c79b56' }), tx + .18, .78, tz + 1.226);
  add(box(0.33, 0.52, 0.08), slate, tx, 3.6, tz + 0.98);
  add(box(3.15, 2.35, 2.1), shedWall, -1.65, 1.15, -2.75);
  for (const side of [-1, 1]) {
    add(box(1.83, 0.12, 2.38), slate, -1.65 + side * 0.79, 2.55, -2.75,
      undefined, { rot: [0, 0, -side * 0.26] });
  }
  add(box(0.64, 1.62, 0.08), wood, -2.56, 0.82, -1.665);
  add(box(0.88, 0.83, 0.1), trim, -0.68, 1.49, -1.66);
  add(box(0.73, 0.65, 0.016), toon('#597877'), -0.68, 1.49, -1.598);
  add(box(0.042, 0.64, 0.04), plaster, -0.68, 1.49, -1.58);
  add(box(1, 0.065, 0.42), wood, -0.68, 1.11, -1.52);
  const lamp = new THREE.Group(); lamp.position.set(-0.67, 1.15, -1.34); scene.add(lamp);
  add(cyl(0.10, 0.12, 0.055, 14), slate, 0, 0.022, 0, lamp);
  add(cyl(0.085, 0.085, 0.19, 14), new THREE.MeshBasicMaterial({ color: '#f7d78c' }), 0, 0.14, 0, lamp);
  add(cyl(0.065, 0.12, 0.06, 14), slate, 0, 0.26, 0, lamp);
  const lampGlow = glow('#f2bf77', 0.28, 0.22);
  lampGlow.position.set(0, .14, .02); lamp.add(lampGlow);
  L.clues.glass = lamp;

  // The keeper left the book and envelope on the sheltered bench.
  add(box(1.86, 0.09, 0.67), wood, -2.06, 0.77, -0.88);
  for (const x of [-2.8,-1.33]) add(box(0.1, 0.76, 0.44), slate, x, 0.38, -0.88);
  const oldPage = paper('VISITOR BOOK', ['23 AUG · SAM', 'ENVELOPE FOR KEEPER', '24 AUG · FERRY'], { crossed: true });
  const newPage = canvasTex(512, 384, (g, w, h) => {
    g.fillStyle = '#e8d9b7'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#9c8260'; g.lineWidth = 7; g.strokeRect(10, 10, w - 20, h - 20);
    g.fillStyle = '#293d3d'; g.textAlign = 'center'; g.font = 'bold 42px serif'; g.fillText('VISITOR BOOK', w / 2, 108);
    g.font = '29px monospace'; g.fillText('FRIDAY · YESTERDAY', w / 2, 187);
    g.font = 'italic 59px cursive'; g.fillText('Sam', w / 2, 288);
  });
  const ledger = new THREE.Group(); ledger.position.set(-2.35, 0.83, -0.78); scene.add(ledger);
  add(box(0.56, 0.036, 0.38), rust, 0, -0.005, 0, ledger);
  const page = plate(0.52, 0.34, 0, 0.016, 0, oldPage, ledger, [-Math.PI / 2, 0, 0]);
  L.clues.ledger = ledger;
  const envelope = new THREE.Group(); envelope.position.set(-1.61, .831, -.8); scene.add(envelope);
  add(box(.34, .013, .22), plaster, 0, 0, 0, envelope);
  plate(.33, .21, 0, .009, 0, paper('FOR THE KEEPER', ['S.']), envelope, [-Math.PI / 2, 0, -.17]);
  L.clues.envelope = envelope;
  L.fx.reset = () => { page.material.map = oldPage; };
  L.fx['new-signature'] = () => { page.material.map = newPage; };

  L.spots = {
    duncan: { pos: [-2.55, 0, -0.02], ry: 0.25, base: 'idle' },
    kai: { pos: [1.55, 0, 0.45], ry: -.28, base: 'idle' },
  };
  L.shots = {
    establish: () => ({ pos: [3.9, 2.35, 10.45], at: [0.85, 2.95, -3.5], fov: 61, fixed: true }),
    wide: () => L.shots.establish(),
    tower: () => ({ pos: [1.25, 1.95, 4.4], at: [0.05, 1.6, -1.98], fov: 64, fixed: true }),
    'search-gate': () => ({ pos: [-0.84, 1.7, 5.55], at: [-1.2, 0.98, 3.51], fov: 64, fixed: true }),
    signs: () => ({ pos: [-1.18, 1.42, 4.94], at: [-1.2, 1.01, 3.55], fov: 59, fixed: true }),
    'search-bench': () => ({ pos: [-1.95, 1.92, 0.95], at: [-2.26, 0.71, -0.78], fov: 62, fixed: true }),
    'search-window': () => ({ pos: [-0.56, 1.7, 0.72], at: [-0.67, 1.43, -1.33], fov: 62, fixed: true }),
    ledger: () => ({ pos: [-2.37, 1.76, -0.26], at: [-2.35, .82, -.65], fov: 56, fixed: true }),
    glass: () => ({ pos: [-0.58, 1.66, -0.04], at: [-0.67, 1.11, -1.34], fov: 54, fixed: true }),
    envelope: () => ({ pos: [-1.61, 1.7, -.15], at: [-1.61, .75, -.68], fov: 56, fixed: true }),
  };
}
