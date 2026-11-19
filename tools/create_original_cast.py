"""Reproducible original Backstage cast. Python standard library only.

All geometry, palettes, joint positions and animation keyframes are defined here.
No model, texture, preset, reference image, VRoid data or UAL clip is imported.
Run: python tools/create_original_cast.py
"""
from pathlib import Path
import hashlib
import json
import math
import struct

ROOT = Path(__file__).resolve().parents[1]
CAST = {
    'kit': dict(skin='#bb8567', hair='#211a2a', coat='#42223b', shirt='#6e2d4b', pants='#272438', eye='#916329', height=1.90, width=.219, jaw=.115, cheek=.126),
    'leo': dict(skin='#d0a184', hair='#9b482a', coat='#bb557c', shirt='#df89a5', pants='#23324b', eye='#724527', height=1.81, width=.237, jaw=.109, cheek=.134),
    'ava': dict(skin='#9b6551', hair='#302039', coat='#dc6f8d', shirt='#ffb2b7', pants='#a27b47', eye='#83562d', height=1.66, width=.174, jaw=.080, cheek=.133),
    'dana': dict(skin='#d5ac93', hair='#272039', coat='#272647', shirt='#b8a5ba', pants='#292637', eye='#4c7366', height=1.79, width=.188, jaw=.090, cheek=.119),
    'sienna': dict(skin='#a87352', hair='#c58b3e', coat='#eee0c2', shirt='#bd8c56', pants='#a57a37', eye='#86532b', height=1.85, width=.173, jaw=.081, cheek=.126),
    'heroine': dict(skin='#d7a689', hair='#793924', coat='#82bbc2', shirt='#b8e2d9', pants='#263953', eye='#586b56', height=1.72, width=.185, jaw=.086, cheek=.123),
}

class Model:
    def __init__(self):
        self.blob=bytearray();self.views=[];self.accessors=[];self.nodes=[];self.meshes=[];self.materials=[];self.animations=[];self.sphere_cache={}
    def array(self, values, kind, count, **extras):
        while len(self.blob)%4:self.blob.append(0)
        offset=len(self.blob);self.blob.extend(struct.pack('<'+'f'*len(values),*values))
        self.views.append(dict(buffer=0,byteOffset=offset,byteLength=len(self.blob)-offset))
        self.accessors.append(dict(bufferView=len(self.views)-1,componentType=5126,count=count,type=kind,**extras))
        return len(self.accessors)-1
    def material(self, name, color, roughness=.85, metal=0):
        rgb=[int(color[i:i+2],16)/255 for i in (1,3,5)]
        # Hex palettes are sRGB; glTF baseColorFactor stores linear values.
        rgb=[c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in rgb]
        self.materials.append(dict(name=name,pbrMetallicRoughness=dict(baseColorFactor=rgb+[1],roughnessFactor=roughness,metallicFactor=metal)))
        return len(self.materials)-1
    def sphere(self, material, shape=1, rings=10, segments=16):
        key=(material,shape,rings,segments)
        if key in self.sphere_cache:return self.sphere_cache[key]
        points=[];normals=[]
        def vertex(i,j):
            a=math.pi*i/rings;b=2*math.pi*j/segments
            return (math.sin(a)*math.cos(b),math.cos(a),math.sin(a)*math.sin(b))
        for i in range(rings):
            for j in range(segments):
                a,b,c,d=vertex(i,j),vertex(i+1,j),vertex(i+1,j+1),vertex(i,j+1)
                for tri in ((a,c,b),(a,d,c)):
                    for v in tri:
                        points.extend(math.copysign(abs(x)**shape,x) for x in v)
                        normal=[math.copysign(abs(x)**(2-shape),x) for x in v]
                        length=math.sqrt(sum(x*x for x in normal))
                        normals.extend(x/length for x in normal)
        n=len(points)//3
        p=self.array(points,'VEC3',n,min=[min(points[i::3]) for i in range(3)],max=[max(points[i::3]) for i in range(3)])
        normal=self.array(normals,'VEC3',n)
        self.meshes.append(dict(primitives=[dict(attributes=dict(POSITION=p,NORMAL=normal),material=material)]))
        self.sphere_cache[key]=len(self.meshes)-1;return len(self.meshes)-1
    def node(self,name,parent=None,at=(0,0,0),mesh=None,scale=None):
        ix=len(self.nodes);n=dict(name=name,translation=list(at));self.nodes.append(n)
        if mesh is not None:n['mesh']=mesh
        if scale:n['scale']=list(scale)
        if parent is not None:self.nodes[parent].setdefault('children',[]).append(ix)
        return ix
    def part(self,name,parent,at,size,material,shape=1):
        return self.node(name,parent,at,self.sphere(material,shape),size)
    def loft(self, name, parent, material, rings, sides=24):
        """Build a smooth surface from horizontal elliptical cross sections.

        Each ring gives height, width radius, depth radius, and center x/z.
        """
        rows = []
        for y, width, depth, x, z in rings:
            rows.append([(x + width * math.cos(i * math.tau / sides), y,
                          z + depth * math.sin(i * math.tau / sides)) for i in range(sides)])
        vertex_normals = []
        for j, row in enumerate(rows):
            lower, upper = rows[max(0, j - 1)], rows[min(len(rows) - 1, j + 1)]
            normals = []
            for i in range(sides):
                a, b = row[(i - 1) % sides], row[(i + 1) % sides]
                u = [hi - lo for lo, hi in zip(lower[i], upper[i])]
                v = [hi - lo for lo, hi in zip(a, b)]
                n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]
                length = math.sqrt(sum(k*k for k in n))
                normals.append(tuple(k / length for k in n))
            vertex_normals.append(normals)
        positions, normals = [], []
        for j in range(len(rows) - 1):
            for i in range(sides):
                k = (i + 1) % sides
                for r, c in [(j,i),(j+1,i),(j+1,k),(j,i),(j+1,k),(j,k)]:
                    positions.extend(rows[r][c])
                    normals.extend(vertex_normals[r][c])
        count = len(positions) // 3
        position = self.array(positions, 'VEC3', count, min=[min(positions[i::3]) for i in range(3)], max=[max(positions[i::3]) for i in range(3)])
        normal = self.array(normals, 'VEC3', count)
        self.meshes.append(dict(primitives=[dict(attributes=dict(POSITION=position, NORMAL=normal), material=material)]))
        return self.node(name, parent, mesh=len(self.meshes)-1)
    def animation(self,name,poses,duration=2.4):
        samplers=[];channels=[];times=[0,duration*.25,duration*.5,duration*.75,duration]
        t=self.array(times,'SCALAR',len(times),min=[0],max=[duration])
        for node,axis,angles in poses:
            values=[]
            for angle in angles:
                q=[0,0,0,math.cos(angle/2)];q[axis]=math.sin(angle/2);values.extend(q)
            v=self.array(values,'VEC4',5);samplers.append(dict(input=t,output=v,interpolation='LINEAR'))
            channels.append(dict(sampler=len(samplers)-1,target=dict(node=node,path='rotation')))
        self.animations.append(dict(name=name,samplers=samplers,channels=channels))
    def write(self,file,extras):
        while len(self.blob)%4:self.blob.append(0)
        doc=dict(asset=dict(version='2.0',generator='Lingo Stories procedural cast v3',extras=dict(provenance='AI-assisted original procedural geometry and keyframes; see tools/create_original_cast.py')),
                 scene=0,scenes=[dict(nodes=[0],extras=extras)],nodes=self.nodes,meshes=self.meshes,materials=self.materials,animations=self.animations,
                 buffers=[dict(byteLength=len(self.blob))],bufferViews=self.views,accessors=self.accessors)
        raw=json.dumps(doc,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4)
        result=struct.pack('<III',0x46546c67,2,12+8+len(raw)+8+len(self.blob))+struct.pack('<II',len(raw),0x4e4f534a)+raw+struct.pack('<II',len(self.blob),0x004e4942)+self.blob
        file.write_bytes(result);return hashlib.sha256(result).hexdigest()

def create(name,c):
    m=Model();skin=m.material('Own skin palette',c['skin']);hair=m.material('Own hair palette',c['hair']);coat=m.material('Own coat palette',c['coat']);shirt=m.material('Own shirt palette',c['shirt']);pants=m.material('Own trousers palette',c['pants']);eye=m.material('Own iris palette',c['eye']);dark=m.material('Dark details','#222735');white=m.material('Eye white','#f2eadc');lip=m.material('Mouth','#9b5554')
    masculine = name in ('kit','leo')
    if masculine:
        lip = m.material('Mouth shadow', '#754c43' if name=='kit' else '#926255')
    root=m.node('Original_'+name,scale=(c['height']/1.8,)*3)
    hips=m.node('OriginalHips',root,(0,.95,0));chest=m.node('OriginalChest',hips,(0,.28,0));neck=m.node('OriginalNeck',chest,(0,.18,0));head=m.node('OriginalHead',neck,(0,.21,0))
    width=c['width']
    accent=m.material('Accessory color',{'kit':'#b8a39d','leo':'#332f32','ava':'#d19d44','dana':'#8897ba','sienna':'#dcb063','heroine':'#af7351'}[name])
    hoodie = name in ('leo','ava','heroine')
    hem = -.36 if hoodie else -.32
    hem_width = width * (.88 if masculine else 1.08 if hoodie else .97)
    hem_depth = .127 if hoodie else .115
    m.loft('Clothing silhouette',chest,coat,[
        (hem-.006,.01,.012,0,0),(hem,hem_width,hem_depth,0,0),(hem+.035,hem_width,hem_depth,0,0),
        (-.20,width*(.86 if masculine else .97),.114,0,0),(-.10,width*.89,.115,0,0),(.025,width,.113,0,0),
        (.08,width*(.99 if masculine else .92),.094,0,0),(.117,width*.62,.071,0,-.002),(.134,.067,.055,0,-.002)])
    if name in ('kit','dana'):
        for sx in [-1,1]:
            lapel=m.part('Lapel',chest,(sx*.079,.003,.113),(.037,.137,.018),accent if name=='dana' else shirt,.58)
            m.nodes[lapel]['rotation']=[0,0,sx*math.sin(.20),math.cos(.20)]
    elif name in ('leo','ava','heroine'):
        m.part('Hood',chest,(0,.146,-.077),(.128,.089,.07),shirt,.78)
        for sx in [-1,1]:
            m.part('Hood cord',chest,(sx*.043,-.005,.112),(.003,.069,.004),shirt)
        m.part('Kangaroo pocket',chest,(0,-.245,.096),(.112,.054,.024),coat,.66)
        m.part('Pocket seam',chest,(0,-.232,.118),(.074,.003,.003),shirt)
    elif name=='sienna':
        m.part('Collar',chest,(0,.105,.055),(.077,.022,.039),shirt,.65)
    m.part('Neck',neck,(0,.025,-.008),(.064,.09,.055) if masculine else (.050,.09,.047),skin)
    m.loft('Sculpted face',head,skin,[
        (-.139,.025 if masculine else .011,.023,0,.043),(-.125,c['jaw']*(.73 if masculine else .54),.056,0,.034),
        (-.101,c['jaw']*(.99 if masculine else .86),.077,0,.025),(-.062,c['jaw'],.088,0,.015),
        (-.025,c['cheek']*.94,.102,0,.009),(.025,c['cheek'],.108,0,.006),
        (.075,c['cheek']*.97,.108,0,.004),(.12,c['cheek']*.86,.095,0,-.002),
        (.155,c['cheek']*.6,.066,0,-.013),(.175,.008,.01,0,-.014)],32)
    for sx in [-1,1]:m.part('Ear',head,(sx*.13,-.005,-.004),(.023,.043,.027),skin)
    m.loft('Bridge and nose tip',head,skin,[
        (-.046,.010,.006,0,.105),(-.038,.021,.016,0,.112),
        (-.023,.017,.024,0,.111),(.010,.012,.014,0,.107),(.045,.007,.004,0,.111)],16)
    eyes=m.node('OriginalEyes',head)
    for sx in [-1,1]:
        if not masculine:
            m.part('Upper lash',eyes,(sx*.051,.034,.106),(.037,.021,.015),hair)
        m.part('White',eyes,(sx*.051,.031,.107),(.031,.011 if name=='kit' else .013,.013) if masculine else (.033,.018 if name=='dana' else .022,.015),white)
        m.part('Iris',eyes,(sx*.051,.03,.117),(.011,.010,.006) if masculine else (.013,.014,.006),eye)
        m.part('Pupil',eyes,(sx*.051,.03,.12),(.005,.007,.003) if masculine else (.006,.010,.003),dark)
        m.part('Eye light',eyes,(sx*.048,.035,.123),(.003,.004,.002),white)
        brow = m.part('Brow',head,(sx*.052,.065 if masculine else .075,.103),(.038,.010,.008) if masculine else (.035,.008,.01),hair,.72 if masculine else 1)
        if name == 'kit':
            m.nodes[brow]['rotation'] = [0,0,sx*math.sin(.1),math.cos(.1)]
    m.part('OriginalMouth',head,(0,-.074,.105),(.028,.005,.007),lip)
    long_hair = name in ('sienna','heroine')
    fall = -.40 if name == 'heroine' else -.33 if long_hair else -.105 if name == 'ava' else -.059
    m.loft('Hair silhouette',head,hair,[
        (fall-.025,.067,.014,0,-.125),(fall,.120,.026,0,-.118),(-.13 if long_hair else fall+.025,.135,.057,0,-.082),
        (.01,.141,.075,0,-.056),(.076,.145,.103,0,-.034),(.136,.138,.114,0,-.010),
        (.172,.106,.089,0,-.009),(.203,.060,.049,0,-.015),(.212,.008,.010,0,-.018)],32)
    # Flattened tapered sections, with slightly different lengths and parting for each hero.
    fringe = [] if masculine else [-.116,-.087,-.056,-.023,.013,.048,.082,.112]
    for j, x in enumerate(fringe):
        parting = -.023 if name in ('kit','heroine') else .022
        tip = .048 + abs(x-parting)*.37 - (.032 if (j%3==1) else .0)
        if name == 'dana': tip += .024
        side = -1 if x < parting else 1
        m.loft('Swept fringe',head,hair,[
            (tip,.001,.002,x+side*.013,.116-abs(x)*.23),
            (tip+(.161-tip)*.42,.022,.012,x+side*.005,.114-abs(x)*.28),
            (tip+(.161-tip)*.80,.030,.026,x,.089-abs(x)*.20),
            (.170,.024,.030,x*.64,.054),(.193,.009,.012,x*.4,.031)],16)
    for side in (() if masculine else (-1,1)):
        tail = fall if long_hair else -.135 if name=='ava' else -.067
        m.loft('Side lock',head,hair,[
            (tail,.003,.003,side*.137,-.006),(tail+.030,.026,.024,side*.139,-.014),
            (.016,.031,.047,side*.129,-.015),(.090,.032,.051,side*.116,-.014),
            (.146,.013,.034,side*.099,-.026)],16)
    if name == 'kit':
        # High side part and swept crown leave the brow and ears visible.
        for x in (-.085,-.045,-.004,.037,.077):
            m.loft('Swept crown',head,hair,[
                (.102+x*.30,.013,.012,x-.024,.105),
                (.149+x*.14,.031,.031,x-.007,.093),
                (.193,.035,.038,x+.013,.057),
                (.221,.018,.027,x+.025,.009),
                (.231,.003,.005,x+.020,-.020)],16)
    if name == 'leo':
        # Offset locks form a short wavy crop with an open forehead.
        for i, x in enumerate((-.099,-.061,-.023,.015,.053,.091)):
            y = .113 + .009*math.cos(i*1.7)
            m.loft('Short wave',head,hair,[
                (y,.004,.005,x+.016,.113-abs(x)*.24),
                (y+.026,.028,.019,x+.017,.097-abs(x)*.22),
                (.181,.032,.025,x+.008,.067),
                (.212,.016,.018,x-.008,.033),
                (.218,.003,.004,x-.013,.016)],16)
    if name in ('kit','ava','sienna'):
        for sx in ([-1] if name=='kit' else [-1,1]):
            m.part('Earring',head,(sx*.14,-.049,-.004),(.009,.019,.009),accent,.7)
    arms=[];legs=[]
    for sx,label in [(-1,'Left'),(1,'Right')]:
        arm=m.node('Original'+label+'Arm',chest,(sx*(width-.023),.065,0));fore=m.node('Original'+label+'Forearm',arm,(sx*.025,-.245,0));arms.append((arm,fore))
        m.loft('Upper sleeve',arm,coat,[
            (-.278,.050,.053,sx*.023,0),(-.224,.059,.059,sx*.022,0),(-.105,.064,.067,sx*.013,0),
            (.001,.071,.070,0,0),(.047,.049,.054,-sx*.015,0),(.069,.010,.01,-sx*.023,0)])
        m.loft('Lower sleeve',fore,coat,[
            (-.229,.048,.048,0,0),(-.192,.051,.052,0,0),(-.10,.057,.057,0,.003),(.033,.054,.055,0,0)])
        m.part('Cuff',fore,(0,-.214,.007),(.056,.024,.055),shirt,.58)
        m.part('Hand',fore,(0,-.253,.008),(.040,.060,.028),skin,.8)
        m.part('Thumb',fore,(-sx*.035,-.23,.021),(.016,.032,.016),skin)
        leg=m.node('Original'+label+'Leg',hips,(sx*.089,-.04,0));knee=m.node('Original'+label+'Shin',leg,(0,-.39,0));legs.append((leg,knee))
        m.loft('Trouser upper leg',leg,pants,[
            (-.420,.059,.059,0,0),(-.35,.065,.068,0,0),(-.21,.075,.079,0,0),(-.052,.085,.086,0,0),(.058,.083,.083,0,0)])
        m.loft('Trouser lower leg',knee,pants,[
            (-.417,.048,.052,0,0),(-.37,.052,.055,0,0),(-.235,.056,.061,0,0),(-.107,.064,.066,0,0),(.044,.062,.062,0,0)])
        m.part('Shoe',knee,(0,-.44,.048),(.074,.057,.127),dark,.47)
        m.part('Sole',knee,(0,-.48,.053),(.075,.013,.127),shirt if name in ('leo','ava','heroine') else dark,.43)
    if name=='dana':
        # Spectacle frames made here from a ring of small ellipsoids, no catalogue accessory.
        for sx in [-1,1]:
            for j in range(20):
                a=2*math.pi*j/20;m.part('Frame',head,(sx*.051+math.cos(a)*.039,.03+math.sin(a)*.029,.13),(.005,.005,.004),dark)
        m.part('Frame bridge',head,(0,.032,.129),(.016,.004,.004),dark)
    if name=='leo':
        for sx in [-1,1]:m.part('Headphone cup',chest,(sx*.103,.085,.109),(.038,.046,.024),dark)
        for j in range(15):
            a=math.pi*j/14;m.part('Headphone band',chest,(math.cos(a)*.105,.09-math.sin(a)*.049,.10),(.012,.012,.012),dark)
    left,right=arms
    idle=[(chest,2,[0,.012,0,-.012,0]),(left[0],2,[.09,.11,.09,.07,.09]),(right[0],2,[-.09,-.07,-.09,-.11,-.09])]
    m.animation('Idle_Loop',idle,3.2)
    m.animation('Idle_Talking_Loop',idle+[(right[1],0,[-.12,-.48,-.22,-.42,-.12]),(left[1],0,[-.06,-.18,-.3,-.12,-.06])])
    m.animation('Idle_FoldArms_Loop',[(left[0],0,[-.65]*5),(right[0],0,[-.65]*5),(left[1],2,[-.85]*5),(right[1],2,[.85]*5)])
    m.animation('Idle_No_Loop',idle+[(head,1,[0,-.18,0,.18,0])])
    m.animation('Yes',idle+[(head,0,[0,.17,0,.12,0])],1.3)
    m.animation('Hit_Chest',[(chest,0,[0,-.13,.07,-.03,0]),(right[1],0,[0,-1.45,-.4,-.2,0])],1.2)
    m.animation('Idle_TalkingPhone_Loop',[(right[0],0,[-.4]*5),(right[1],0,[-2.15]*5)]+[(chest,2,[0,.012,0,-.012,0])])
    m.animation('Interact',[(right[0],0,[0,-1.3,-1.3,-.6,0]),(right[1],0,[0,-.18,-.18,-.3,0])],1.5)
    m.animation('Walk_Formal_Loop',[(left[0],0,[0,-.3,0,.3,0]),(right[0],0,[0,.3,0,-.3,0]),(legs[0][0],0,[0,.35,0,-.35,0]),(legs[1][0],0,[0,-.35,0,.35,0])],1.2)
    m.animation('Sitting_Idle_Loop',[(legs[0][0],0,[-1.35]*5),(legs[1][0],0,[-1.35]*5),(legs[0][1],0,[1.3]*5),(legs[1][1],0,[1.3]*5)],3)
    target=ROOT/'assets/models'/('m_original_'+name+'.glb')
    sha=m.write(target,dict(originalCast=dict(version=1,head='OriginalHead',neck='OriginalNeck',eyes='OriginalEyes',mouth='OriginalMouth',source='tools/create_original_cast.py',importedAssets=False)))
    return dict(file=target.relative_to(ROOT).as_posix(),sha256=sha,bytes=target.stat().st_size,importedAssets=[],animations=[a['name'] for a in m.animations],source='tools/create_original_cast.py',creation='Procedural geometry and authored keyframes with AI assistance')

if __name__=='__main__':
    records=[create(name,c) for name,c in CAST.items()]
    source=hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    directory=ROOT/'docs/rights';directory.mkdir(parents=True,exist_ok=True)
    (directory/'original-cast.json').write_text(json.dumps(dict(schema=1,generatorSha256=source,models=records),ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    for item in records:print(item['file'],item['bytes'],item['sha256'])
