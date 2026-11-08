// Packs a VRoid Studio export (.vrm, 0.x or 1.0) into a light GLB for the game: the humanoid bone map and the
// facial expressions are written to scene.extras.vrm by NAME, unused morph targets are dropped, textures go to WebP
// (face kept sharper than the rest), geometry is meshopt-compressed. The game needs no VRM runtime.
// Run from a folder that has @gltf-transform/{core,extensions,functions}, meshoptimizer and sharp installed:
//   node vrm2glb.mjs in.vrm out.glb [faceTex=2048] [bodyTex=1024]
import { readFileSync, writeFileSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, meshopt, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';

const [, , inFile, outFile, faceTex = '2048', bodyTex = '1024'] = process.argv;
const bytes = new Uint8Array(readFileSync(inFile));
const view = new DataView(bytes.buffer, bytes.byteOffset);
const json = JSON.parse(new TextDecoder().decode(bytes.subarray(20, 20 + view.getUint32(12, true))));

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.readBinary(bytes);
const root = doc.getRoot(), nodes = root.listNodes(), meshes = root.listMeshes();
const nodeOfMesh = m => nodes.find(n => n.getMesh() === m);

// ---- read the VRM data (the two versions store it differently)
const V1 = json.extensions?.VRMC_vrm, V0 = json.extensions?.VRM;
if (!V1 && !V0) throw new Error('not a VRM file');
const bones = {};
const raw = {}; // expression name -> [[mesh, morphIndex, weight 0..1]]
if (V1) {
  for (const [b, { node }] of Object.entries(V1.humanoid.humanBones)) bones[b] = nodes[node].getName();
  const sets = { ...(V1.expressions?.preset || {}), ...(V1.expressions?.custom || {}) };
  for (const [name, e] of Object.entries(sets)) {
    raw[name] = (e.morphTargetBinds || []).map(b => [nodes[b.node].getMesh(), b.index, b.weight]);
  }
} else {
  // 0.x thumbs are named one joint further along than 1.0
  const THUMB = { Proximal: 'Metacarpal', Intermediate: 'Proximal', Distal: 'Distal' };
  for (const { bone, node } of V0.humanoid.humanBones) {
    const m = bone.match(/^(left|right)Thumb(Proximal|Intermediate|Distal)$/);
    bones[m ? `${m[1]}Thumb${THUMB[m[2]]}` : bone] = nodes[node].getName();
  }
  const NAME = { a: 'aa', i: 'ih', u: 'ou', e: 'ee', o: 'oh', joy: 'happy', sorrow: 'sad', fun: 'relaxed', blink: 'blink', angry: 'angry', surprised: 'surprised' };
  for (const g of V0.blendShapeMaster?.blendShapeGroups || []) {
    const name = NAME[g.presetName]; if (!name) continue;
    raw[name] = (g.binds || []).map(b => [meshes[b.mesh], b.index, b.weight / 100]);
  }
}

// ---- keep only the morph targets an expression uses, and renumber the binds
const KEEP = ['aa', 'ih', 'ou', 'ee', 'oh', 'blink', 'happy', 'angry', 'sad', 'relaxed', 'surprised'];
const used = new Map(); // mesh -> sorted morph indices
for (const k of KEEP) for (const [m, i] of raw[k] || []) { if (!used.has(m)) used.set(m, new Set()); used.get(m).add(i); }
const remap = new Map();
for (const m of meshes) {
  const keep = [...(used.get(m) || [])].sort((a, b) => a - b);
  remap.set(m, new Map(keep.map((old, i) => [old, i])));
  for (const p of m.listPrimitives()) {
    const targets = p.listTargets();
    targets.forEach((t, i) => { if (!keep.includes(i)) p.removeTarget(t); });
  }
  m.setWeights(keep.map(() => 0));
  m.setExtras({});
}
const faces = {};
for (const k of KEEP) {
  const binds = (raw[k] || []).filter(([, , w]) => w > 0);
  if (binds.length) faces[k] = binds.map(([m, i, w]) => [nodeOfMesh(m).getName(), remap.get(m).get(i), w]);
}
const missing = ['hips', 'head', 'leftUpperArm', 'rightUpperArm', 'leftUpperLeg', 'rightUpperLeg'].filter(b => !bones[b]);
if (missing.length) throw new Error('missing bones: ' + missing);
// a 0.x model looks down -Z; the game wants everybody looking down +Z
root.listScenes()[0].setExtras({ vrm: { bones, faces, flip: !V1 } });

// ---- textures: the face is what the camera comes close to
let n = 0;
for (const m of used.keys()) for (const p of m.listPrimitives()) {
  const t = p.getMaterial()?.getBaseColorTexture();
  if (t && !t.getName().startsWith('FACE_')) t.setName(`FACE_${n++}`);
}
await doc.transform(prune({ keepLeaves: true, keepAttributes: true, keepExtras: true }), dedup());
await doc.transform(
  textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 90, resize: [+faceTex, +faceTex], pattern: /^FACE_/ }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 84, resize: [+bodyTex, +bodyTex], pattern: /^(?!FACE_)/ }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);
await io.write(outFile, doc);

let tris = 0; for (const m of meshes) for (const p of m.listPrimitives()) tris += (p.getIndices()?.getCount() || 0) / 3;
console.log(JSON.stringify({ out: outFile, kb: Math.round(readFileSync(outFile).length / 1024), tris, version: V1 ? '1.0' : '0.x', expressions: Object.keys(faces), bones: Object.keys(bones).length }));
