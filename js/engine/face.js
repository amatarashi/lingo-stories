// A living face for VRM-based characters: blinking, a mouth that moves while the line plays, and moods.
// Works on the morph targets listed in scene.extras.vrm.faces (see tools/vrm2glb.mjs).
const VISEMES = ['aa', 'oh', 'ee', 'ih', 'ou'];
// what a beat's `mood` looks like on the face (a full-strength "happy" closes the eyes: keep it subtle)
const MOODS = {
  smile: { happy: 0.5 }, happy: { happy: 0.8 }, warm: { relaxed: 0.55 },
  nervous: { sad: 0.4, surprised: 0.12 }, sad: { sad: 0.75 },
  shock: { surprised: 0.85 }, angry: { angry: 0.6 }, cool: { angry: 0.18 },
};

export function makeFace(root, faces) {
  const byName = {}; root.traverse(o => { if (o.name) byName[o.name] = o; });
  const binds = {}; // expression -> [{ inf (the influence array), i, w }]
  const touched = new Set();
  for (const [expr, list] of Object.entries(faces)) {
    binds[expr] = [];
    for (const [node, i, w] of list) {
      byName[node]?.traverse(m => {
        if (!m.morphTargetInfluences) return;
        binds[expr].push({ inf: m.morphTargetInfluences, i, w }); touched.add(m.morphTargetInfluences);
      });
    }
  }
  const cur = {}, goal = {}; // current and wanted weight of each expression
  for (const e of Object.keys(binds)) cur[e] = goal[e] = 0;
  let blinkIn = 1 + Math.random() * 3, blinkT = -1, nextViseme = 0, mouthT = 0;

  function setMood(name) {
    for (const e of ['happy', 'relaxed', 'sad', 'angry', 'surprised']) goal[e] = 0;
    Object.assign(goal, MOODS[name] || {});
  }
  function update(dt, talking) {
    // blink, less often and less fully when a smile is already narrowing the eyes
    blinkIn -= dt;
    if (blinkIn <= 0 && blinkT < 0) { blinkT = 0; blinkIn = 1.8 + Math.random() * 4.2; }
    let blink = 0;
    if (blinkT >= 0) { blinkT += dt; blink = Math.max(0, 1 - Math.abs(blinkT - 0.07) / 0.07); if (blinkT > 0.14) blinkT = -1; }
    goal.blink = blink * (1 - (cur.happy || 0));
    // mouth: a new shape every ~100 ms while the line plays, closing for a moment now and then
    mouthT += dt;
    if (mouthT >= nextViseme) {
      mouthT = 0; nextViseme = 0.075 + Math.random() * 0.07;
      for (const v of VISEMES) goal[v] = 0;
      if (talking && Math.random() > 0.16) goal[VISEMES[Math.floor(Math.random() * VISEMES.length)]] = 0.3 + Math.random() * 0.4;
    }
    for (const inf of touched) inf.fill(0);
    for (const e of Object.keys(binds)) {
      const fast = e === 'blink' ? 1 : VISEMES.includes(e) ? 1 - Math.pow(1e-5, dt) : 1 - Math.pow(0.01, dt);
      cur[e] += ((goal[e] || 0) - cur[e]) * fast;
      if (cur[e] < 0.002) continue;
      for (const b of binds[e]) b.inf[b.i] = Math.min(1, b.inf[b.i] + b.w * cur[e]);
    }
  }
  return { update, setMood };
}
