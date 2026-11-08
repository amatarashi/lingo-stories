// Retargets Universal Animation Library clips (UE-style skeleton) onto Quaternius modular characters.
// Method: per frame take each source bone's world-space rotation change from its rest pose and apply it
// to the matching target bone's rest pose (world space), then convert back to local rotations.
import * as THREE from 'three';

const side = (s, t) => [[`${s}_l`, `${t}L`], [`${s}_r`, `${t}R`]];
export const UAL_TO_MODULAR = Object.fromEntries([
  ['pelvis', 'Hips'], ['spine_01', 'Abdomen'], ['spine_02', 'Torso'], ['spine_03', 'Chest'], ['neck_01', 'Neck'], ['Head', 'Head'],
  ...side('clavicle', 'Shoulder'), ...side('upperarm', 'UpperArm'), ...side('lowerarm', 'LowerArm'), ...side('hand', 'Hand'),
  ...side('thigh', 'UpperLeg'), ...side('calf', 'LowerLeg'), ...side('foot', 'Foot'),
  ...['index', 'middle', 'ring', 'pinky', 'thumb'].flatMap(f => [1, 2, 3].flatMap(i => side(`${f}_0${i}`, `${f[0].toUpperCase() + f.slice(1)}${i}`))),
]);

// the same, for a VRM humanoid: `bones` is { hips: 'J_Bip_C_Hips', leftUpperArm: … } from scene.extras.vrm
export function vrmMap(bones) {
  const m = { pelvis: bones.hips, spine_01: bones.spine, spine_02: bones.chest, spine_03: bones.upperChest, neck_01: bones.neck, Head: bones.head };
  for (const [s, v] of [['l', 'left'], ['r', 'right']]) {
    Object.assign(m, { [`clavicle_${s}`]: bones[`${v}Shoulder`], [`upperarm_${s}`]: bones[`${v}UpperArm`], [`lowerarm_${s}`]: bones[`${v}LowerArm`], [`hand_${s}`]: bones[`${v}Hand`], [`thigh_${s}`]: bones[`${v}UpperLeg`], [`calf_${s}`]: bones[`${v}LowerLeg`], [`foot_${s}`]: bones[`${v}Foot`] });
    for (const [f, F, a] of [['index', 'Index', 'Proximal'], ['middle', 'Middle', 'Proximal'], ['ring', 'Ring', 'Proximal'], ['pinky', 'Little', 'Proximal'], ['thumb', 'Thumb', 'Metacarpal']]) {
      const joints = F === 'Thumb' ? [a, 'Proximal', 'Distal'] : [a, 'Intermediate', 'Distal'];
      joints.forEach((j, i) => { m[`${f}_0${i + 1}_${s}`] = bones[`${v}${F}${j}`]; });
    }
  }
  return Object.fromEntries(Object.entries(m).filter(([, t]) => t));
}

function bonesByName(root) { const m = {}; root.traverse(o => { if (o.name) m[o.name] = o; }); return m; }

// pose the source skeleton at time t of clip
function sampler(srcRoot, clip) {
  const mixer = new THREE.AnimationMixer(srcRoot);
  const act = mixer.clipAction(clip); act.play();
  return t => { mixer.setTime(t); srcRoot.updateMatrixWorld(true); };
}

/**
 * @param target  skinned character scene (in bind pose)
 * @param srcRoot UAL skeleton scene
 * @param clips   UAL clips; restClip = the T-pose clip used as the source rest pose
 */
export function retarget(target, srcRoot, clips, restClip, { fps = 24, map = UAL_TO_MODULAR, mappedOnly = false } = {}) {
  const S = bonesByName(srcRoot), T = bonesByName(target);
  const pairs = Object.entries(map).filter(([s, t]) => S[s] && T[t]).map(([s, t]) => ({ s: S[s], t: T[t] }));
  const tName = new Map(pairs.map(p => [p.t, p.s]));

  // target bones in hierarchy order
  const hips = T[map.pelvis];
  const order = []; hips.parent.updateMatrixWorld(true);
  hips.traverse(o => { if (o === hips || (mappedOnly ? tName.has(o) : o.isBone || o.type === 'Bone' || o.type === 'Object3D')) order.push(o); }); // VRM: hair and skirt bones stay out

  // rest poses
  target.updateMatrixWorld(true);
  const tRestLocal = new Map(order.map(o => [o, o.quaternion.clone()]));
  const tRestWorld = new Map(order.map(o => [o, o.getWorldQuaternion(new THREE.Quaternion())]));
  const tHipsRestPos = hips.position.clone();
  const tHeight = hips.getWorldPosition(new THREE.Vector3()).y - target.getWorldPosition(new THREE.Vector3()).y;

  const setRest = sampler(srcRoot, restClip); setRest(0);
  const sRestWorld = new Map(pairs.map(p => [p.s, p.s.getWorldQuaternion(new THREE.Quaternion())]));
  const sHipsRest = S.pelvis.getWorldPosition(new THREE.Vector3());
  const sHeight = sHipsRest.y - srcRoot.getWorldPosition(new THREE.Vector3()).y;
  const hScale = tHeight / sHeight;
  const parentInv = new THREE.Matrix4().copy(hips.parent.matrixWorld).invert();
  const parentInvQ = hips.parent.getWorldQuaternion(new THREE.Quaternion()).invert();

  const q = new THREE.Quaternion(), d = new THREE.Quaternion(), v = new THREE.Vector3();
  const out = [];
  for (const clip of clips) {
    const pose = sampler(srcRoot, clip);
    const n = Math.max(2, Math.round(clip.duration * fps) + 1);
    const times = new Float32Array(n);
    const rot = new Map(order.map(o => [o, new Float32Array(n * 4)]));
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const t = Math.min(clip.duration, i / fps); times[i] = t; pose(t);
      const world = new Map();
      for (const o of order) {
        const parentW = o === hips ? hips.parent.getWorldQuaternion(new THREE.Quaternion()) : world.get(o.parent) || o.parent.getWorldQuaternion(new THREE.Quaternion());
        const s = tName.get(o);
        let w;
        if (s) {
          d.copy(s.getWorldQuaternion(q)).multiply(sRestWorld.get(s).clone().invert()); // world delta of source
          w = d.clone().multiply(tRestWorld.get(o));
        } else w = parentW.clone().multiply(tRestLocal.get(o));
        world.set(o, w);
        const local = parentW.clone().invert().multiply(w);
        rot.get(o).set([local.x, local.y, local.z, local.w], i * 4);
      }
      // hips translation: source pelvis movement, scaled to the target's size, in the hips' parent space
      S.pelvis.getWorldPosition(v).sub(sHipsRest).multiplyScalar(hScale);
      v.applyQuaternion(parentInvQ);
      const sc = hips.parent.getWorldScale(new THREE.Vector3());
      pos.set([tHipsRestPos.x + v.x / sc.x, tHipsRestPos.y + v.y / sc.y, tHipsRestPos.z + v.z / sc.z], i * 3);
    }
    const tracks = [];
    for (const o of order) if (tName.has(o)) tracks.push(new THREE.QuaternionKeyframeTrack(`${o.name}.quaternion`, times, rot.get(o)));
    tracks.push(new THREE.VectorKeyframeTrack(`${hips.name}.position`, times, pos));
    out.push(new THREE.AnimationClip(clip.name, clip.duration, tracks));
  }
  // leave the target in bind pose
  for (const o of order) o.quaternion.copy(tRestLocal.get(o));
  hips.position.copy(tHipsRestPos);
  return out;
}
