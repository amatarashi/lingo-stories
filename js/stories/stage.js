// Shared 3D stage for a story: ONE renderer (phones dislike several WebGL contexts), any number of locations.
// A location is built once by a builder (loc-cafe.js, loc-office.js…) and kept; switching fades through black.
// Look: toon shading with soft bands, colour grading, glow sprites instead of bloom, CC0 Quaternius models.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { retarget, vrmMap } from '../engine/retarget.js';
import { makeFace } from '../engine/face.js';

export const MOBILE = matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
const M_URL = new URL('../../assets/models/', import.meta.url).href;

// ---------------------------------------------------------------- shared look (also used by the location builders)
export const GRAD = (() => { // 4 soft light bands
  const d = new Uint8Array([70, 140, 205, 255]);
  const t = new THREE.DataTexture(d, 4, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();
const matCache = new Map();
export function toon(color, o = {}) {
  const c = new THREE.Color(color);
  const key = c.getHexString() + JSON.stringify(o);
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshToonMaterial({ color: c, gradientMap: GRAD, ...o }));
  return matCache.get(key);
}
// VRoid faces and hair are already painted with their shading: a high floor keeps the toon bands from cutting across them
const GRAD_SOFT = (() => {
  const d = new Uint8Array([178, 214, 240, 255]);
  const t = new THREE.DataTexture(d, 4, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.LinearFilter; t.needsUpdate = true; return t;
})();
export const toonMap = (map, o = {}) => new THREE.MeshToonMaterial({ map, gradientMap: GRAD, ...o });
// a little colour grading so every model sits in the same palette (warm interior, slightly desaturated)
function grade(c) {
  const hsl = {}; c.getHSL(hsl);
  return new THREE.Color().setHSL(hsl.h, hsl.s * 0.82, Math.min(0.92, hsl.l * 1.04 + 0.015)).lerp(new THREE.Color('#ffb070'), 0.06);
}
export function toonify(root, { skinned = false, tint = {}, dark = false, painted = false } = {}) {
  root.traverse(o => {
    if (!o.isMesh) return;
    const conv = m => {
      let base = tint[m.name] ? new THREE.Color(tint[m.name]) : grade(m.color.clone());
      if (dark) base = new THREE.Color('#0c0e14');
      // textured characters (image-to-3D, Backstage): keep the painted texture, only toon-shade it
      // VRoid recolours (Shader Color) live in the material colour, not in the texture, so painted models keep it
      if (skinned && m.map && !dark) return new THREE.MeshToonMaterial({ map: m.map, color: tint[m.name] ? new THREE.Color(tint[m.name]) : painted ? m.color.clone() : new THREE.Color('#ffffff'), gradientMap: painted ? GRAD_SOFT : GRAD, name: m.name, transparent: m.transparent, alphaTest: m.alphaTest, side: m.side, depthWrite: m.depthWrite });
      return skinned ? new THREE.MeshToonMaterial({ color: base, gradientMap: GRAD, name: m.name }) : toon(base);
    };
    o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
  });
}
export function canvasTex(w, h, draw, { repeat, srgb = true } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  t.anisotropy = 4; return t;
}
const glowTex = canvasTex(128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
});
export function glow(color, size, opacity = 0.6) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  s.scale.setScalar(size); return s;
}
// rain falling behind windows: a box of line segments
export function rainLines(parent, { count, x0, x1, y1 = 4.2, z0, z1, speed = 8.5, opacity = 0.45, color = '#8fb0e0' }) {
  const p = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) { const x = x0 + Math.random() * (x1 - x0), y = Math.random() * y1, z = z0 + Math.random() * (z1 - z0); p.set([x, y, z, x - 0.02, y - 0.3, z], i * 6); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
  parent.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity, fog: false })));
  return dt => {
    const a = geo.attributes.position.array;
    for (let i = 0; i < count; i++) { const j = i * 6; let y = a[j + 1] - dt * speed; if (y < 0) y += y1; a[j + 1] = y; a[j + 4] = y - 0.3; }
    geo.attributes.position.needsUpdate = true;
  };
}
export function streakTexture() {
  return canvasTex(256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { const x = Math.random() * w, y = Math.random() * h, l = 10 + Math.random() * 40; g.strokeStyle = `rgba(200,220,255,${0.15 + Math.random() * 0.3})`; g.lineWidth = 1 + Math.random() * 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.random() * 2 - 1, y + l); g.stroke(); g.fillStyle = 'rgba(220,235,255,.5)'; g.beginPath(); g.arc(x, y + l, 1.6, 0, 7); g.fill(); }
  }, { repeat: [1, 1] });
}

// static props merged by material: a whole room in a few dozen draw calls
function mergeStatics(scene, statics) {
  statics.updateMatrixWorld(true);
  const groups = new Map();
  statics.traverse(o => {
    if (!o.isMesh || Array.isArray(o.material)) return;
    const k = o.material.uuid + (o.receiveShadow ? 'r' : '') + (o.castShadow ? 'c' : '');
    if (!groups.has(k)) groups.set(k, { m: o.material, list: [], recv: o.receiveShadow, cast: o.castShadow });
    groups.get(k).list.push(o);
  });
  const merged = new THREE.Group();
  for (const g of groups.values()) {
    const geos = g.list.map(o => {
      const geo = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      for (const n of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(n)) geo.deleteAttribute(n);
      if (!geo.attributes.normal) geo.computeVertexNormals();
      if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
      for (const n of ['position', 'normal', 'uv']) {
        const a = geo.attributes[n];
        if (!(a.array instanceof Float32Array) || a.normalized || a.isInterleavedBufferAttribute) {
          const f = new Float32Array(a.count * a.itemSize);
          for (let i = 0; i < a.count; i++) for (let c = 0; c < a.itemSize; c++) f[i * a.itemSize + c] = a.getComponent(i, c);
          geo.setAttribute(n, new THREE.BufferAttribute(f, a.itemSize));
        }
      }
      geo.applyMatrix4(o.matrixWorld);
      return geo;
    });
    const mg = mergeGeometries(geos, false);
    if (!mg) continue;
    const mesh = new THREE.Mesh(mg, g.m); mesh.receiveShadow = g.recv; mesh.castShadow = g.cast; mesh.matrixAutoUpdate = false;
    merged.add(mesh);
  }
  scene.remove(statics); scene.add(merged);
}

const CLIP = { idle: 'Idle_Loop', talk: 'Idle_Talking_Loop', fold: 'Idle_FoldArms_Loop', no: 'Idle_No_Loop', yes: 'Yes', hit: 'Hit_Chest', phone: 'Idle_TalkingPhone_Loop', think: 'Idle_FoldArms_Loop', point: 'Interact', walk: 'Walk_Formal_Loop', sit: 'Sitting_Idle_Loop' };
const ONESHOT = new Set(['yes', 'hit', 'point']);

// ---------------------------------------------------------------- stage
export function createStage(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE, powerPreference: 'high-performance' });
  const maxDpr = MOBILE ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(devicePixelRatio, maxDpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = !MOBILE;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 60);

  // -------- assets shared by every location
  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  const cache = {};
  const loadOnce = f => cache[f] ||= loader.loadAsync(M_URL + f);
  let lib = null;
  async function base() {
    const [props, a1, a2] = await Promise.all([loadOnce('props_interior.glb'), loadOnce('anim_ual1.glb'), loadOnce('anim_ual2.glb')]);
    if (!lib) {
      const all = [...a1.animations, ...a2.animations];
      lib = { src: a1.scene, rest: all.find(c => c.name === 'A_TPose'), clips: all.filter(c => Object.values(CLIP).includes(c.name)), props: {} };
      for (const c of props.scene.children) lib.props[c.name] = c;
    }
    return lib;
  }
  const clipCache = {};
  async function makeChar(def) {
    const g = await loadOnce(`m_${def.model}.glb`);
    let o = SkeletonUtils.clone(g.scene);
    const vrm = o.userData.vrm;
    toonify(o, { skinned: true, tint: def.tint || {}, dark: def.silhouette, painted: !!vrm });
    o.traverse(m => { if (m.isMesh) { m.castShadow = !MOBILE; m.frustumCulled = false; } });
    if (vrm?.flip) { const w = new THREE.Group(); o.rotation.y = Math.PI; w.add(o); o = w; }
    clipCache[def.model] ||= retarget(o, lib.src, lib.clips, lib.rest, vrm ? { map: vrmMap(vrm.bones), mappedOnly: true } : undefined);
    const mixer = new THREE.AnimationMixer(o);
    const acts = {}; for (const c of clipCache[def.model]) acts[c.name] = mixer.clipAction(c);
    let headBone = null, neck = null; const headName = vrm?.bones.head || 'Head', neckName = vrm?.bones.neck || 'Neck';
    o.traverse(b => { if (b.name === headName) headBone = b; if (b.name === neckName) neck = b; });
    // an accessory the story needs to be visible (Fiona's red scarf): a knitted ring round the neck + a hanging end
    if (def.scarf && neck) {
      const g = new THREE.Group(), m = new THREE.MeshToonMaterial({ color: def.scarf, gradientMap: GRAD });
      const ws = neck.getWorldScale(new THREE.Vector3()).x || 1;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.035, 8, 16), m); ring.rotation.x = Math.PI / 2; g.add(ring);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.26, 0.03), m); tail.position.set(0.05, -0.13, 0.08); tail.rotation.z = 0.15; g.add(tail);
      g.scale.setScalar(1 / ws); g.position.y = 0.02 / ws; neck.add(g);
    }
    // a VRM head bone may have its own rest rotation: remember it so "look at" starts from the real forward direction
    o.updateMatrixWorld(true);
    const headRest = vrm ? headBone.getWorldQuaternion(new THREE.Quaternion()) : null;
    return { o, mixer, acts, head: headBone, headRest, def, cur: null, lookAt: null, face: vrm && !def.silhouette ? makeFace(o, vrm.faces) : null };
  }

  // -------- locations
  const locs = {};
  let loc = null; // active location
  // build(ctx) creates the room; ctx gives helpers and receives clues / shots / spots
  async function load(key, build, { chars = {}, cast = [], mood } = {}, onProgress) {
    if (locs[key]) { onProgress?.(1); return locs[key]; }
    let done = 0; const steps = 3 + cast.length;
    const tick = () => onProgress?.(Math.min(1, ++done / steps));
    await Promise.all([loadOnce('props_interior.glb').then(tick), loadOnce('anim_ual1.glb').then(tick), loadOnce('anim_ual2.glb').then(tick)]);
    await base();
    const scene = new THREE.Scene(), statics = new THREE.Group(); scene.add(statics);
    const L = { key, scene, statics, clues: {}, shots: {}, spots: {}, anims: [], chars: {}, mixers: [], markers: {}, fx: {}, wide: 'wide', pan: 3.6 };
    const add = (geo, mat, x, y, z, parent = statics, o = {}) => {
      const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
      if (o.rot) m.rotation.set(...o.rot);
      m.receiveShadow = o.recv ?? true; m.castShadow = o.cast ?? false;
      parent.add(m); return m;
    };
    const place = (name, x, y, z, ry = 0, s = 0.5, parent = statics) => {
      const o = lib.props[name].clone(true); o.position.set(x, y, z); o.rotation.y = ry; o.scale.setScalar(s);
      toonify(o); parent.add(o); return o;
    };
    const ctx = {
      THREE, L, scene, statics, add, place, mood, MOBILE,
      box: (w, h, d) => new THREE.BoxGeometry(w, h, d), cyl: (rt, rb, h, s = 12) => new THREE.CylinderGeometry(rt, rb, h, s),
      head: id => head(L, id), portrait,
    };
    build(ctx);
    for (const id of cast) {
      const def = chars[id], spot = L.spots[id]; if (!def?.model || !spot) { tick(); continue; }
      const ch = await makeChar(def);
      ch.o.position.set(...spot.pos); ch.o.rotation.y = spot.ry; ch.base = spot.base || 'idle';
      scene.add(ch.o); L.mixers.push(ch.mixer); L.chars[id] = ch;
      if (L.charTargets?.includes(id)) L.clues[id] = ch.o; // people the player can tap ("find Fiona")
      play(id, ch.base, 0, L);
      add(new THREE.CircleGeometry(0.42, 20), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.35, depthWrite: false }), spot.pos[0], 0.01, spot.pos[2], scene, { rot: [-Math.PI / 2, 0, 0] });
      tick();
    }
    mergeStatics(scene, statics);
    renderer.compile(scene, camera);
    locs[key] = L;
    return L;
  }

  // switch location; fades through black unless instant
  const fade = document.createElement('div');
  fade.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:4;transition:opacity .45s ease';
  document.body.appendChild(fade);
  async function enter(key, startShot = 'wide', instant = false) {
    const L = locs[key]; if (!L || L === loc) { if (L) shot(startShot, instant); return; }
    if (loc && !instant) { fade.style.opacity = '1'; await new Promise(r => setTimeout(r, 480)); }
    if (loc) { setExplore(null); loc.exploring = null; }
    loc = L; panGoal = panCur = savedPan = 0;
    shot(startShot, true);
    if (!instant) { await new Promise(r => setTimeout(r, 60)); fade.style.opacity = '0'; }
  }

  // -------- animation control
  function play(id, name, fade = 0.35, L = loc) {
    const ch = L?.chars[id]; if (!ch) return;
    const act = ch.acts[CLIP[name] || CLIP.idle] || ch.acts[CLIP.idle];
    if (ch.cur === act && !ONESHOT.has(name)) return;
    act.reset(); act.enabled = true; act.setEffectiveWeight(1);
    if (ONESHOT.has(name)) { act.setLoop(THREE.LoopOnce, 1); act.clampWhenFinished = true; }
    else act.setLoop(THREE.LoopRepeat, Infinity);
    act.play();
    if (ch.cur && ch.cur !== act) ch.cur.crossFadeTo(act, fade, false);
    ch.cur = act; ch.curName = name;
    clearTimeout(ch.back);
    if (ONESHOT.has(name)) ch.back = setTimeout(() => { if (ch.cur === act) play(id, ch.talking ? 'talk' : ch.base, 0.4, L); }, act.getClip().duration * 1000 - 250);
  }
  function setBase(id, name) { const ch = loc?.chars[id]; if (ch) ch.base = name; }

  // -------- camera
  function head(L, id) {
    const ch = L.chars[id];
    if (!ch?.head) return new THREE.Vector3(...(L.spots[id]?.pos || [0, 0, 0])).setY(1.6);
    return ch.head.getWorldPosition(new THREE.Vector3());
  }
  const portrait = () => innerWidth / innerHeight < 0.8;
  // Telegram fullscreen draws its own Back / menu buttons over the top of the page
  const safeTop = () => { const s = getComputedStyle(document.documentElement); return (parseFloat(s.getPropertyValue('--tg-safe-area-inset-top')) || 0) + (parseFloat(s.getPropertyValue('--tg-content-safe-area-inset-top')) || 0); };
  // face shot for any character: from the side given by the spot (side: +1 camera to their right), framed lower on phones
  function faceShot(L, id, close = false) {
    const h = head(L, id), sp = L.spots[id] || {}, p = portrait();
    const ry = sp.ry || 0, side = sp.side ?? 1, d = close ? (p ? 1.2 : 0.95) : (p ? 2.4 : 2.0);
    const fx = Math.sin(ry), fz = Math.cos(ry);           // facing direction
    const rx = Math.cos(ry), rz = -Math.sin(ry);          // their right
    const off = (p ? 0.12 : 0.4) * side * (close ? 0.6 : 1);
    return { pos: [h.x + fx * d + rx * off, h.y + 0.05, h.z + fz * d + rz * off], at: [h.x, h.y - (p ? (close ? 0.25 : 0.45) : 0.06), h.z] };
  }
  const cur = { pos: new THREE.Vector3(5, 2.6, 6.6), at: new THREE.Vector3(0, 1.3, -1.6) };
  const goal = { pos: cur.pos.clone(), at: cur.at.clone() };
  let fovGoal = 42;
  const baseFov = () => portrait() ? 55 : 42;
  let shotName = 'wide', panGoal = 0, panCur = 0, savedPan = 0, shakeT = 0;
  function shot(name, instant = false) {
    if (!loc) return;
    let raw;
    if (loc.shots[name]) raw = loc.shots[name]();
    else if (name.endsWith('-close') && loc.chars[name.slice(0, -6)]) raw = faceShot(loc, name.slice(0, -6), true);
    else if (loc.chars[name]) raw = faceShot(loc, name);
    if (!raw) return;
    let s = raw; if (portrait() && raw.portrait) s = { ...raw.portrait, portrait: true };
    if (name === loc.wide) panGoal = savedPan; else { if (shotName === loc.wide) savedPan = panGoal; panGoal = 0; }
    shotName = name;
    fovGoal = s.fov || baseFov();
    goal.at.set(...s.at); goal.pos.set(...s.pos);
    if (portrait() && !s.portrait && !s.fixed && !loc.chars[name] && !loc.chars[name.replace('-close', '')]) goal.pos.sub(goal.at).multiplyScalar(1.25).add(goal.at);
    if (instant) { cur.pos.copy(goal.pos); cur.at.copy(goal.at); camera.fov = fovGoal; camera.updateProjectionMatrix(); }
  }

  // -------- tapping clues
  const markerTex = canvasTex(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 8, 64, 64, 62); gr.addColorStop(0, 'rgba(255,214,120,1)'); gr.addColorStop(0.5, 'rgba(255,190,90,.5)'); gr.addColorStop(1, 'rgba(255,190,90,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); g.fillStyle = '#2a1a05'; g.font = 'bold 56px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', 64, 68);
  });
  const checkTex = canvasTex(128, 128, (g) => { g.fillStyle = 'rgba(120,220,160,.95)'; g.beginPath(); g.arc(64, 64, 30, 0, 7); g.fill(); g.fillStyle = '#063'; g.font = 'bold 44px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('✓', 64, 67); });
  const dotTex = canvasTex(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 6, 64, 64, 62); gr.addColorStop(0, 'rgba(120,255,200,0)'); gr.addColorStop(0.3, 'rgba(120,255,200,0)'); gr.addColorStop(0.42, 'rgba(120,255,200,.55)'); gr.addColorStop(1, 'rgba(120,255,200,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); g.strokeStyle = 'rgba(220,255,240,.95)'; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 22, 0, 7); g.stroke();
  });
  let tapHandler = null;
  function makeMarkers() {
    for (const [k, o] of Object.entries(loc.clues)) {
      if (loc.markers[k]) continue;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, depthTest: false, transparent: true, fog: false }));
      sp.scale.setScalar(0.42); sp.renderOrder = 10; sp.visible = false; loc.scene.add(sp);
      const b = new THREE.Box3().setFromObject(o); const c = b.getCenter(new THREE.Vector3());
      sp.position.set(c.x, b.max.y + 0.28, c.z); sp.userData.top = sp.position.clone(); sp.userData.mid = c.clone(); loc.markers[k] = sp;
    }
  }
  // style 'dot': a plain ring (instructions — the player has to read which one), otherwise a '?'
  function setExplore(list, found, style) {
    if (!loc) return;
    makeMarkers();
    loc.exploring = list; if (!list) panGoal = savedPan = 0;
    for (const [k, sp] of Object.entries(loc.markers)) { sp.visible = !!list && list.includes(k); sp.material.map = found?.has(k) ? checkTex : style === 'dot' ? dotTex : markerTex; sp.userData.small = style === "dot"; sp.position.copy(style === "dot" ? sp.userData.mid : sp.userData.top); }
  }
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let down = null, dragX = null;
  canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; dragX = e.clientX; });
  canvas.addEventListener('pointermove', e => { if (dragX == null || !loc?.exploring || shotName !== loc.wide) return; panGoal = Math.max(-loc.pan, Math.min(loc.pan, panGoal - (e.clientX - dragX) * 0.012)); dragX = e.clientX; });
  addEventListener('pointerup', () => { dragX = null; });
  canvas.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 12 || !loc?.exploring || !tapHandler) return;
    ptr.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    let best = null, bestD = 1e9;
    for (const k of loc.exploring) { const hits = ray.intersectObjects([loc.markers[k], loc.clues[k]].filter(Boolean), true); if (hits.length && hits[0].distance < bestD) { bestD = hits[0].distance; best = k; } }
    if (best) tapHandler(best);
  });

  // -------- portraits for the dialogue box (rendered once per character, in a tiny studio)
  const portraits = {};
  function iconPortrait(def) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 110, 10, 128, 128, 180); gr.addColorStop(0, def.color || '#556'); gr.addColorStop(1, '#0b0f18');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    g.globalAlpha = 0.18; g.fillStyle = '#000'; for (let y = 0; y < 256; y += 6) g.fillRect(0, y, 256, 2); g.globalAlpha = 1;
    g.font = '120px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(def.icon, 128, 136);
    return c.toDataURL('image/jpeg', 0.85);
  }
  async function makePortraits(defs) {
    await base();
    const studio = new THREE.Scene();
    studio.add(new THREE.HemisphereLight('#ffe2c4', '#2a3550', 2.2));
    const kl = new THREE.DirectionalLight('#ffd2a0', 2.2); kl.position.set(1.5, 2, 2); studio.add(kl);
    const rim = new THREE.DirectionalLight('#7fb2ff', 2.0); rim.position.set(-2, 1.5, -1.5); studio.add(rim);
    const cam = new THREE.PerspectiveCamera(26, 1, 0.05, 10);
    const rt = new THREE.WebGLRenderTarget(256, 256, { samples: 4 }); rt.texture.colorSpace = THREE.SRGBColorSpace;
    const px = new Uint8Array(256 * 256 * 4);
    for (const [id, def] of Object.entries(defs)) {
      if (portraits[id]) continue;
      if (!def.model) { if (def.icon) portraits[id] = iconPortrait(def); continue; }
      const ch = await makeChar(def);
      ch.o.rotation.set(0, 0.25, 0); studio.add(ch.o);
      ch.acts[CLIP[def.portraitPose || 'idle']].play(); ch.mixer.setTime(def.portraitPose === 'phone' ? 1.2 : 0.8);
      ch.o.updateMatrixWorld(true);
      const hp = ch.head.getWorldPosition(new THREE.Vector3());
      cam.position.set(hp.x + 0.18, hp.y + 0.05, hp.z + 0.95); cam.lookAt(hp.x, hp.y - 0.02, hp.z);
      studio.background = new THREE.Color(def.color || '#445').multiplyScalar(def.silhouette ? 0.6 : 0.35);
      rim.intensity = def.silhouette ? 5 : 2;
      renderer.setRenderTarget(rt); renderer.render(studio, cam); renderer.setRenderTarget(null);
      renderer.readRenderTargetPixels(rt, 0, 0, 256, 256, px);
      const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
      const img = g.createImageData(256, 256);
      for (let y = 0; y < 256; y++) img.data.set(px.subarray((255 - y) * 1024, (256 - y) * 1024), y * 1024);
      g.putImageData(img, 0, 0);
      portraits[id] = c.toDataURL('image/jpeg', 0.85);
      studio.remove(ch.o);
    }
    rt.dispose();
    return portraits;
  }

  // -------- look-at: heads turn toward whoever is speaking
  const _q = new THREE.Quaternion(), _m = new THREE.Matrix4(), _v = new THREE.Vector3(), _p = new THREE.Quaternion(), _up = new THREE.Vector3(0, 1, 0);
  function applyLook(ch, k) {
    if (!ch.head || !ch.lookAt) return;
    const hp = ch.head.getWorldPosition(_v);
    _m.lookAt(ch.lookAt, hp, _up);
    const want = _q.setFromRotationMatrix(_m);
    if (ch.headRest) want.multiply(ch.headRest);
    const parentQ = ch.head.parent.getWorldQuaternion(_p);
    const local = parentQ.clone().invert().multiply(want);
    ch.lookW = Math.min(1, (ch.lookW || 0) + k);
    ch.head.quaternion.slerp(local, 0.5 * ch.lookW);
  }
  function setSpeaker(who) {
    if (!loc) return;
    for (const [id, ch] of Object.entries(loc.chars)) {
      if (id === who || !who || !loc.chars[who]) ch.lookAt = goal.pos.clone();
      else ch.lookAt = head(loc, who).clone();
    }
  }
  function talk(who, on) {
    const ch = loc?.chars[who]; if (!ch) return;
    ch.talking = on;
    if (on && !ONESHOT.has(ch.curName) && !['fold', 'phone', 'no', 'sit'].includes(ch.curName)) play(who, 'talk');
    if (!on && ch.curName === 'talk') play(who, ch.base);
  }

  // -------- resize + adaptive quality + loop
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; if (!loc) camera.fov = fovGoal = baseFov(); camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();
  let frames = 0, acc = 0, ratio = renderer.getPixelRatio();
  const topDpr = Math.min(devicePixelRatio, maxDpr);
  function adapt(dt) {
    frames++; acc += dt; if (acc < 2) return;
    const fps = frames / acc; frames = 0; acc = 0;
    if (fps < 45 && ratio > 0.75) { ratio = Math.max(0.75, ratio - 0.25); renderer.setPixelRatio(ratio); resize(); }
    else if (fps > 58 && ratio < topDpr) { ratio = Math.min(topDpr, ratio + 0.25); renderer.setPixelRatio(ratio); resize(); }
  }
  const clock = new THREE.Clock(); let t = 0, paused = false;
  renderer.setAnimationLoop(() => {
    if (document.hidden || paused || !loc) return;
    const dt = Math.min(0.05, clock.getDelta()); t += dt;
    adapt(dt);
    for (const m of loc.mixers) m.update(dt);
    for (const ch of Object.values(loc.chars)) { applyLook(ch, dt * 1.5); ch.face?.update(dt, ch.talking); }
    for (const f of loc.anims) f(dt, t);
    const k = 1 - Math.pow(0.02, dt);
    cur.pos.lerp(goal.pos, k); cur.at.lerp(goal.at, k);
    panCur += (panGoal - panCur) * k;
    if (Math.abs(camera.fov - fovGoal) > 0.05) { camera.fov += (fovGoal - camera.fov) * k; camera.updateProjectionMatrix(); }
    shakeT = Math.max(0, shakeT - dt);
    const sh = shakeT * 0.12;
    camera.position.set(cur.pos.x + panCur + Math.sin(t * 0.31) * 0.03 + (Math.random() - 0.5) * sh, cur.pos.y + Math.sin(t * 0.23) * 0.02 + (Math.random() - 0.5) * sh, cur.pos.z);
    camera.lookAt(cur.at.x + panCur, cur.at.y, cur.at.z);
    // far markers grow, so a '?' across the room is still as easy to see and tap as a near one
    for (const sp of Object.values(loc.markers)) if (sp.visible) { const d = Math.max(1, camera.position.distanceTo(sp.position) / 3.2); sp.scale.setScalar(((sp.userData.small ? 0.2 : 0.4) + Math.sin(t * 4) * (sp.userData.small ? 0.02 : 0.04)) * d); }
    renderer.render(loc.scene, camera);
  });

  return {
    MOBILE, load, enter,
    get location() { return loc?.key; },
    present: id => !!loc?.chars[id],
    mood: (id, name) => loc?.chars[id]?.face?.setMood(name),
    shot, setSpeaker, talk, play: (id, n, f) => play(id, n, f), setBase, setExplore,
    onTap: f => { tapHandler = f; },
    tapClue: k => { if (loc?.exploring?.includes(k)) tapHandler?.(k); },
    shake: (s = 0.5) => { shakeT = s; },
    makePortraits, portraits,
    pause: v => { paused = v; if (!v) clock.getDelta(); },
    get info() { return { calls: renderer.info.render.calls, tris: renderer.info.render.triangles, dpr: renderer.getPixelRatio(), loc: loc?.key }; },
    get loc() { return loc; },
    fx: (name, v) => loc?.fx[name]?.(v),
    // markers that are off screen, under Telegram's own buttons (fullscreen) or under the dialogue box
    hidden: keys => {
      if (!loc) return [];
      makeMarkers();
      const cam = camera.clone(); cam.position.copy(goal.pos); cam.position.x += panGoal; cam.fov = fovGoal; cam.updateProjectionMatrix();
      cam.lookAt(goal.at.x + panGoal, goal.at.y, goal.at.z); cam.updateMatrixWorld();
      const top = safeTop() + 56, bottom = innerHeight * (portrait() ? 0.6 : 0.68);
      return keys.filter(k => {
        const m = loc.markers[k]; if (!m) return false;
        const v = m.userData.mid.clone().project(cam);
        const x = (v.x + 1) / 2 * innerWidth, y = (1 - v.y) / 2 * innerHeight;
        return v.z > 1 || x < 24 || x > innerWidth - 24 || y < top || y > bottom;
      });
    },
    // turn the camera so all these objects sit in the free part of the screen
    frame: keys => {
      const ms = keys.map(k => loc?.markers[k]).filter(Boolean); if (!ms.length) return;
      const c = new THREE.Vector3(); for (const m of ms) c.add(m.userData.mid); c.divideScalar(ms.length);
      const ys = ms.map(m => m.userData.mid.y);
      // a bit above the middle: the dialogue box covers the bottom of the screen
      goal.at.set(c.x, c.y - (Math.max(...ys) - Math.min(...ys)) * 0.15 - 0.15, c.z); panGoal = 0;
      fovGoal = Math.max(fovGoal, portrait() ? 74 : 56);
    },
    // look straight at one object (hint)
    peek: k => { const m = loc?.markers[k]; if (!m) return; goal.at.copy(m.userData.mid); goal.at.y -= 0.12; panGoal = 0; },
  };
}
