import { toon, canvasTex } from '../stage.js';

// Aurora-7's heating plant. The panel lights follow the same sequence as Maya's instructions.
export function buildGenerator({ THREE, L, scene, add, box, cyl }) {
  scene.background = new THREE.Color('#172b38');
  scene.fog = new THREE.Fog('#172b38', 6, 14);
  const steel = toon('#4a616c'), frame = toon('#243640'), brass = toon('#b88a42');
  const teal = toon('#366761'), dark = toon('#101c23'), black = toon('#091114');
  const glow = color => new THREE.MeshBasicMaterial({ color });
  const plate = (width, height, x, y, z, draw) => {
    const map = canvasTex(512, Math.round(512 * height / width), draw);
    return add(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map }), x, y, z);
  };
  const label = (value, width, x, y, z, tint = '#d8e6da') => plate(width, width * 0.5, x, y, z, (g, w, h) => {
    g.fillStyle = '#18282d'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#617776'; g.lineWidth = 9; g.strokeRect(10, 10, w - 20, h - 20);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 57px monospace';
    g.fillStyle = tint; g.fillText(value, w / 2, h / 2, w - 50);
  });
  const light = (color, intensity, x, y, z) => {
    const lamp = new THREE.PointLight(color, intensity, 8);
    lamp.position.set(x, y, z); scene.add(lamp);
  };
  scene.add(new THREE.HemisphereLight('#adcad9', '#3a4643', 1.7));
  light('#ffcb83', 9, -1.3, 2.58, 1.1);
  light('#71bdd7', 6, 1.8, 2.3, -0.45);
  add(box(6.4, .15, 6.65), frame, 0, -.1, .875);
  add(box(6.4, .12, 6.65), frame, 0, 2.94, .875);
  add(box(.15, 2.9, 6.65), frame, -3.2, 1.45, .875);
  add(box(.15, 2.9, 6.65), frame, 3.2, 1.45, .875);
  add(box(6.4, 2.9, .15), frame, 0, 1.45, 4.2);
  for (let i = -3; i <= 3; i++) {
    add(box(.88, 2.85, .12), steel, i * .91, 1.42, -2.35);
    add(box(.035, 2.85, .06), dark, i * .91 + .44, 1.42, -2.27);
  }
  for (let i = 0; i < 17; i++) {
    add(box(.033, .014, 4), steel, (i - 8) * .17, -.01, .25);
    add(box(2.88, .015, .028), steel, 0, -.009, (i - 8) * .235 + .25);
  }
  for (const x of [-2.63, 2.63]) {
    add(cyl(.09, .09, 4.8, 12), brass, x, 2.64, -.12, undefined, { rot: [Math.PI / 2, 0, 0] });
    add(cyl(.11, .11, 1.96, 12), steel, x, 1.16, -1.76);
    add(cyl(.17, .17, .14, 12), frame, x, 1.92, -1.76);
    add(box(.84, .06, .18), frame, x * .63, 2.78, -.3);
    add(box(.69, .03, .105), glow('#ffdfa9'), x * .63, 2.735, -.3);
  }

  // Turbine casing, guarded base and raised analogue control panel.
  add(box(2.65, .22, 1.52), frame, 0, .1, -1.25);
  add(box(2.45, .91, 1.15), teal, 0, .72, -1.39);
  const flywheel = new THREE.Group(); flywheel.position.set(-.73, .67, -.77); scene.add(flywheel);
  add(cyl(.29, .29, .11, 24), dark, 0, 0, 0, flywheel, { rot: [Math.PI / 2, 0, 0] });
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5;
    add(box(.055, .25, .025), brass, Math.sin(a) * .125, Math.cos(a) * .125, .063, flywheel, { rot: [0, 0, -a] });
  }
  add(new THREE.TorusGeometry(.33, .03, 8, 28), steel, -.73, .67, -.69);
  for (let i = 0; i < 8; i++) add(box(.033, .32, .037), dark, -.16 + i * .16, .59, -.795, undefined, { rot: [0, 0, -.32] });
  for (let i = 0; i < 10; i++) add(box(.104, .08, .023), i % 2 ? brass : black, (i - 4.5) * .19, .13, -.478, undefined, { rot: [0, 0, -.30] });
  add(box(2.24, .95, .28), frame, 0, 1.46, -.95);
  add(box(2.11, .83, .023), teal, 0, 1.46, -.801);
  label('AURORA-7  /  HEATING', 1.25, 0, 2.2, -1.12);

  const needles = [];
  for (const x of [-.6, 0, .6]) {
    const y = 1.72;
    add(new THREE.CircleGeometry(.151, 28), dark, x, y, -.78);
    add(new THREE.TorusGeometry(.136, .016, 8, 24), brass, x, y, -.77);
    for (let i = 0; i < 7; i++) {
      const a = (i - 3) * .37;
      add(box(.008, .019, .008), glow('#d6ddd0'), x + Math.sin(a) * .105, y + Math.cos(a) * .105, -.758, undefined, { rot: [0, 0, -a] });
    }
    const needle = new THREE.Group(); needle.position.set(x, y, -.747); scene.add(needle);
    add(box(.009, .105, .006), glow('#efac66'), 0, .046, 0, needle);
    needles.push(needle);
  }
  const controls = [
    { key: 'left', x: -.78, title: 'RADIO', color: '#e2a447' },
    { key: 'start', x: -.26, title: 'START', color: '#63cf87' },
    { key: 'right', x: .26, title: 'OLD ROOM', color: '#7ac2de' },
    { key: 'both', x: .78, title: 'BOTH', color: '#c6a1e9' },
  ];
  const switches = new THREE.Group(); scene.add(switches);
  for (const control of controls) {
    const { key, x, title, color } = control;
    add(box(.38, .24, .055), dark, x, 1.38, -.776);
    const cap = add(box(.28, .16, .085), toon(color), x, 1.38, -.714, switches);
    const lamp = add(new THREE.SphereGeometry(.026, 10, 8), glow('#20312f'), x, 1.53, -.759);
    Object.assign(control, { cap, lamp });
    L.clues[key] = cap;
    label(title, .45, x, 1.17, -.767, color);
  }
  const ready = add(new THREE.SphereGeometry(.048, 12, 8), glow('#2b392d'), 1, 1.81, -.76);
  label('READY', .42, .99, 1.92, -.77);

  add(box(.98, 1.22, .07), dark, -1.89, 1.49, -1.98);
  const paper = add(box(.84, 1.03, .032), toon('#ded2ae'), -1.89, 1.49, -1.925);
  L.clues.map = paper;
  plate(.8, .99, -1.89, 1.49, -1.902, (g, w, h) => {
    g.fillStyle = '#dfd2ab'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#22383e'; g.font = 'bold 40px monospace'; g.fillText('HEATING PLAN', 30, 87);
    g.strokeStyle = '#766747'; g.lineWidth = 3; g.beginPath(); g.moveTo(30, 113); g.lineTo(482, 113); g.stroke();
    g.font = '33px monospace';
    ['LEFT: RADIO ROOM', 'RIGHT: OLD ROOM', 'START: ONE ROOM', 'READY: PRESS BOTH'].forEach((text, i) => g.fillText(text, 30, 190 + i * 91));
  });

  const active = new Set();
  let speed = 0, warmed = false;
  L.fx = {
    press(key) {
      active.add(key);
      if (key === 'both') { active.add('left'); active.add('right'); }
    },
    ready() { warmed = true; },
    reset() { active.clear(); warmed = false; speed = 0; flywheel.rotation.z = 0; },
  };
  L.anims.push((dt, t) => {
    speed += ((active.has('start') ? 1 : 0) - speed) * Math.min(1, dt * 3);
    flywheel.rotation.z -= dt * speed * 10;
    needles.forEach((n, i) => { n.rotation.z = 1.1 - speed * (1.25 + Math.sin(t * 7 + i) * .07); });
    for (const { key, cap, lamp, color } of controls) {
      const on = active.has(key);
      cap.position.z = on ? -.745 : -.714;
      lamp.material.color.set(on ? color : '#20312f');
    }
    ready.material.color.set(warmed ? '#8cffad' : '#2b392d');
  });

  const wide = () => ({
    pos: [-.3, 2.03, 3.55], at: [-.63, 1.43, -1.15], fov: 58,
    portrait: { pos: [-.35, 1.96, 3.7], at: [-.6, 1.3, -1.15], fov: 74 },
  });
  L.pan = .7;
  L.shots = {
    wide,
    establish: wide,
    map: () => ({ pos: [-1.89, 1.72, -.21], at: [-1.89, 1.28, -1.92], fixed: true }),
  };
}
