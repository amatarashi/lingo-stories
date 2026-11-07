# Rigs a generated (image-to-3D) character mesh onto a clean skeleton built from the UAL T-pose with Quaternius bone names,
# so the engine's UAL retargeting works with it unchanged.
#
#   blender -b --python tools/rig_character.py -- <project_dir> <raw.glb> <out.glb> [tris=20000] [tex=1024] [preview.png|-] [height=1.87]
#
# Steps: clean the Quaternius armature -> scale/centre the raw mesh to the same height ->
# decimate -> rotate the arm chains down to the mesh's arms (A-pose) -> automatic weights ->
# pose back to the T-pose, bake it into the mesh, make T-pose the rest -> shrink textures -> export.
import bpy, sys, math, os
from mathutils import Vector, Matrix

args = sys.argv[sys.argv.index('--') + 1:]
PROJ, RAW, OUT = args[0], args[1], args[2]
TRIS = int(args[3]) if len(args) > 3 else 20000
TEX = int(args[4]) if len(args) > 4 else 1024
PREVIEW = args[5] if len(args) > 5 and args[5] != '-' else None
HEIGHT = float(args[6]) if len(args) > 6 else 1.87   # metres; the Quaternius men are 1.87

bpy.ops.wm.read_factory_settings(use_empty=True)
C = bpy.context

def sel(objs, active=None):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    C.view_layer.objects.active = active or objs[0]

def verts_world(o):
    return [o.matrix_world @ v.co for v in o.data.vertices]

# ---------- 1. a clean armature built from the UAL skeleton's T-pose (anim_ual1.glb stores it as empties),
# with Quaternius bone names, so the engine's UAL->Quaternius retarget map applies unchanged.
Q_H = HEIGHT
bpy.ops.import_scene.gltf(filepath=os.path.join(PROJ, 'assets/models/anim_ual1.glb'))
P = {o.name: o.matrix_world.to_translation() for o in bpy.data.objects}
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
for a in list(bpy.data.actions): bpy.data.actions.remove(a)
UAL_H = P['Head'].z + 0.19                    # top of the skull above the head joint
k = Q_H / UAL_H
BONES = [  # name, UAL joint, UAL joint the tail points at (or a direction), parent
    ('Hips', 'pelvis', 'spine_01', None), ('Abdomen', 'spine_01', 'spine_02', 'Hips'), ('Torso', 'spine_02', 'spine_03', 'Abdomen'),
    ('Chest', 'spine_03', 'neck_01', 'Torso'), ('Neck', 'neck_01', 'Head', 'Chest'), ('Head', 'Head', (0, 0, 0.18), 'Neck'),
]
for sd, L in (('L', 'l'), ('R', 'r')):
    BONES += [(f'Shoulder.{sd}', f'clavicle_{L}', f'upperarm_{L}', 'Chest'), (f'UpperArm.{sd}', f'upperarm_{L}', f'lowerarm_{L}', f'Shoulder.{sd}'),
              (f'LowerArm.{sd}', f'lowerarm_{L}', f'hand_{L}', f'UpperArm.{sd}'), (f'Hand.{sd}', f'hand_{L}', f'middle_01_{L}', f'LowerArm.{sd}'),
              (f'UpperLeg.{sd}', f'thigh_{L}', f'calf_{L}', 'Hips'), (f'LowerLeg.{sd}', f'calf_{L}', f'foot_{L}', f'UpperLeg.{sd}'),
              (f'Foot.{sd}', f'foot_{L}', f'ball_{L}', f'LowerLeg.{sd}'), (f'Toes.{sd}', f'ball_{L}', f'ball_leaf_{L}', f'Foot.{sd}')]
ad = bpy.data.armatures.new('CharacterArmature'); arm = bpy.data.objects.new('CharacterArmature', ad)
C.scene.collection.objects.link(arm); sel([arm]); bpy.ops.object.mode_set(mode='EDIT')
E = ad.edit_bones
for name, j, t, par in BONES:
    b = E.new(name); b.head = P[j] * k
    b.tail = (P[j] + Vector(t)) * k if isinstance(t, tuple) else P[t] * k
    if par: b.parent = E[par]; b.use_connect = False
for b in E: b.roll = 0
print('Q_H', Q_H, 'hips', tuple(round(x, 3) for x in E['Hips'].head), 'arm L', tuple(round(x, 3) for x in E['UpperArm.L'].head), 'hand L', tuple(round(x, 3) for x in E['Hand.L'].head))
bpy.ops.object.mode_set(mode='OBJECT')

# ---------- 2. raw mesh: z-up, height = Q_H, centred, feet at 0
bpy.ops.import_scene.gltf(filepath=RAW)
mesh = next(o for o in bpy.data.objects if o.type == 'MESH')
for o in list(bpy.data.objects):
    if o.type == 'EMPTY': bpy.data.objects.remove(o)
sel([mesh]); bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
vs = verts_world(mesh)
ext = [max(v[i] for v in vs) - min(v[i] for v in vs) for i in range(3)]
if ext[1] > ext[2]:                        # y-up mesh: stand it up
    mesh.rotation_euler = (math.pi / 2, 0, 0); bpy.ops.object.transform_apply(rotation=True)
    vs = verts_world(mesh)
mn = Vector([min(v[i] for v in vs) for i in range(3)]); mx = Vector([max(v[i] for v in vs) for i in range(3)])
s = Q_H / (mx.z - mn.z)
mesh.scale = (s, s, s); bpy.ops.object.transform_apply(scale=True)
vs = verts_world(mesh)
mn = Vector([min(v[i] for v in vs) for i in range(3)]); mx = Vector([max(v[i] for v in vs) for i in range(3)])
mesh.location = Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z))
bpy.ops.object.transform_apply(location=True)
mesh.name = 'Body'

# ---------- 3. decimate
tris = sum(len(p.vertices) - 2 for p in mesh.data.polygons)
if tris > TRIS:
    mod = mesh.modifiers.new('dec', 'DECIMATE'); mod.ratio = TRIS / tris
    sel([mesh]); bpy.ops.object.modifier_apply(modifier='dec')
print('tris', sum(len(p.vertices) - 2 for p in mesh.data.polygons))

# ---------- 4. find the mesh's arms and rotate the armature's arm chains onto them (edit mode)
vs = verts_world(mesh)
H = Q_H
def hand_point(sign):
    band = [v for v in vs if 0.38 * H < v.z < 0.62 * H and v.x * sign > 0]
    far = sorted(band, key=lambda v: -abs(v.x))[:max(20, len(band) // 60)]
    return sum(far, Vector()) / len(far)
angles = {}
sel([arm]); bpy.ops.object.mode_set(mode='EDIT')
E = arm.data.edit_bones
for side, sign in (('L', 1), ('R', -1)):
    sh = E['UpperArm.' + side].head.copy()
    hp = hand_point(sign)
    tpose_dir = (E['Hand.' + side].head - sh).normalized()
    want = (hp - sh).normalized()
    rot = tpose_dir.rotation_difference(want).to_matrix().to_4x4()
    piv = Matrix.Translation(sh) @ rot @ Matrix.Translation(-sh)
    angles[side] = piv
    chain = [b for b in E if b.name.endswith('.' + side) and (b == E['UpperArm.' + side] or E['UpperArm.' + side] in b.parent_recursive)]
    for b in chain: b.transform(piv)
    print('arm', side, 'hand at', tuple(round(x, 3) for x in hp))
bpy.ops.object.mode_set(mode='OBJECT')

# ---------- 5. weights. AI meshes are rarely watertight, so bone-heat weighting fails on them.
# Weight a voxel-remeshed (closed, single-piece) proxy instead, then copy its weights to the real mesh.
sel([mesh]); bpy.ops.object.duplicate(); proxy = C.active_object; proxy.name = 'proxy'
for m in list(proxy.data.materials): pass
rm = proxy.modifiers.new('vox', 'REMESH'); rm.mode = 'VOXEL'; rm.voxel_size = 0.012 * Q_H / 1.87
bpy.ops.object.modifier_apply(modifier='vox')
dec = proxy.modifiers.new('dec', 'DECIMATE'); dec.ratio = min(1, 30000 / max(1, len(proxy.data.polygons)))
bpy.ops.object.modifier_apply(modifier='dec')
sel([proxy, arm], active=arm); bpy.ops.object.parent_set(type='ARMATURE_AUTO')
def weighted(o): return sum(1 for v in o.data.vertices if any(g.weight > 0.01 for g in v.groups))
print('proxy verts', len(proxy.data.vertices), 'weighted', weighted(proxy))
# real mesh: parent with empty groups, then transfer weights from the proxy
sel([mesh, arm], active=arm); bpy.ops.object.parent_set(type='ARMATURE_NAME')
dt = mesh.modifiers.new('dt', 'DATA_TRANSFER'); dt.object = proxy
dt.use_vert_data = True; dt.data_types_verts = {'VGROUP_WEIGHTS'}; dt.vert_mapping = 'POLYINTERP_NEAREST'
dt.layers_vgroup_select_src = 'ALL'; dt.layers_vgroup_select_dst = 'NAME'
sel([mesh]); bpy.ops.object.datalayout_transfer(modifier='dt')
while mesh.modifiers[0].name != 'dt': bpy.ops.object.modifier_move_up(modifier='dt')
bpy.ops.object.modifier_apply(modifier='dt')
bpy.data.objects.remove(proxy)
print('groups', len(mesh.vertex_groups), 'weighted', weighted(mesh), '/', len(mesh.data.vertices), [m.type for m in mesh.modifiers])

# ---------- 6. pose back to the T-pose, bake it into the mesh, T-pose becomes the rest pose again
sel([arm]); bpy.ops.object.mode_set(mode='POSE')
for side in ('L', 'R'):
    pb = arm.pose.bones['UpperArm.' + side]
    pb.matrix = angles[side].inverted() @ pb.matrix
    C.view_layer.update()
bpy.ops.object.mode_set(mode='OBJECT')
sel([mesh])
mod = next(m for m in mesh.modifiers if m.type == 'ARMATURE')
bpy.ops.object.modifier_copy(modifier=mod.name)
bpy.ops.object.modifier_apply(modifier=mod.name)
sel([arm]); bpy.ops.object.mode_set(mode='POSE'); bpy.ops.pose.armature_apply(selected=False); bpy.ops.object.mode_set(mode='OBJECT')

# ---------- 7. shrink textures, drop the heavy PBR maps the toon shader ignores
for img in list(bpy.data.images):
    if 'normal' in img.name or 'metallic' in img.name or 'roughness' in img.name:
        continue
    if img.size[0] > TEX: img.scale(TEX, TEX)
for m in mesh.data.materials:
    nt = m.node_tree
    for n in list(nt.nodes):
        if n.type == 'TEX_IMAGE' and n.image and ('normal' in n.image.name or 'metallic' in n.image.name or 'roughness' in n.image.name):
            nt.nodes.remove(n)
    for n in nt.nodes:
        if n.type == 'NORMAL_MAP': nt.nodes.remove(n)

# ---------- 8. optional preview: arms raised / walking-ish pose, rendered from the front
if PREVIEW:
    sel([arm]); bpy.ops.object.mode_set(mode='POSE')
    P = arm.pose.bones
    P['UpperArm.L'].rotation_mode = P['UpperArm.R'].rotation_mode = 'XYZ'
    def wrot(name, axis, deg):
        pb = P[name]; h = (arm.matrix_world @ pb.head)
        r = Matrix.Rotation(math.radians(deg), 4, axis)
        pb.matrix = Matrix.Translation(pb.head) @ r @ Matrix.Translation(-pb.head) @ pb.matrix; C.view_layer.update()
    wrot('UpperArm.L', 'Y', -50); wrot('UpperArm.R', 'Y', 50); wrot('UpperLeg.L', 'X', 30); wrot('LowerArm.R', 'Z', 60)
    bpy.ops.object.mode_set(mode='OBJECT')
    scn = C.scene; scn.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_WORKBENCH'
    scn.render.resolution_x, scn.render.resolution_y = 900, 900
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); scn.collection.objects.link(cam)
    cam.location = (0, -5.2, H * 0.55); cam.rotation_euler = (math.pi / 2, 0, 0); cam.data.lens = 50; scn.camera = cam
    sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); scn.collection.objects.link(sun); sun.rotation_euler = (0.8, 0.2, 0.3); sun.data.energy = 3
    w = bpy.data.worlds.new('w'); scn.world = w; w.color = (0.25, 0.25, 0.28)
    scn.render.filepath = PREVIEW; bpy.ops.render.render(write_still=True)
    sel([arm]); bpy.ops.object.mode_set(mode='POSE'); bpy.ops.pose.transforms_clear(); bpy.ops.object.mode_set(mode='OBJECT')

print('DEBUG parent', mesh.parent, [ (m.type, m.object) for m in mesh.modifiers], len(mesh.vertex_groups))
# ---------- 9. export (no animations - the engine retargets UAL clips at runtime)
arm.name = 'CharacterArmature'
sel([arm, mesh], active=arm)
bpy.ops.export_scene.gltf(filepath=OUT, use_selection=True, export_animations=False, export_image_format='JPEG',
                          export_jpeg_quality=85, export_skins=True, export_yup=True)
print('exported', OUT, os.path.getsize(OUT) // 1024, 'KB')
