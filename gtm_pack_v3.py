"""GTM Universal Visualizer Pack v3 validator.

A deliberately bounded declarative program VM. Manifest JSON cannot execute
JavaScript, Python, files, URLs, system calls, shaders or third party code.
This is expressive 2D visual logic, not an unrestricted native plugin system.
"""
import math
import re

NAME = re.compile(r'^[a-z][a-z0-9_]{0,31}$')
PACK_ID = re.compile(r'^[a-z][a-z0-9_]{2,62}$')
COLOR = re.compile(r'^#[0-9a-fA-F]{6}$')
INPUTS = {'time', 'dt', 'low', 'mid', 'high', 'beat', 'rms', 'energy', 'pi', 'tau', 'width', 'height', 'paused','p1x','p1y','p1a','p2x','p2y','p2a','human1','human2','mode','connected1','connected2','audio_paused','disconnect_countdown','player1_side'} | {f'p{player}{button}' for player in (1,2) for button in ('lb','rb','lt','rt','xbtn','ybtn')} | {f'band{i}' for i in range(12)}
OPS = {'get': 1, 'add': 2, 'sub': 2, 'mul': 2, 'div': 2, 'mod': 2,
       'pow': 2, 'atan2': 2, 'min': 2, 'max': 2, 'lt': 2, 'lte': 2,
       'gt': 2, 'gte': 2, 'eq': 2, 'and': 2, 'or': 2, 'sin': 1,
       'cos': 1, 'tan': 1, 'abs': 1, 'sqrt': 1, 'floor': 1,
       'ceil': 1, 'round': 1, 'fract': 1, 'not': 1, 'hash': 1,
       'clamp': 3, 'mix': 3, 'smoothstep': 3}
DRAW = {'rect': ('x','y','w','h'), 'circle': ('x','y','r'), 'line': ('x','y','x2','y2'), 'text': ('x','y')}
CATEGORIES = {'retro','rhythm','signature','anime','arcade'}
SCENERIES = {'solid','arcade','storm','stars','nebula','aurora','ocean','sunset','forest','city'}
OVERLAYS = {'sparks','lightning','rings','stardust','comets','scanlines','confetti','orbits','hexagons','laser','snow','embers','grid','waves','shards','flares','bubbles'}
EFFECTS = {'crt_pulse','liquid_chrome','disc_prism','beat_pinball','seismic_mountains','mechanical_iris','sakura_tempest','supernova_bloom','neon_pong','tidal_bloom','y2k_spectrum','cyber_tunnel','laser_oscilloscope','prism_loom','celestial_clockwork','liquid_hologram','vhs_nightdrive','fracture_cathedral','mercury_tide','prism_kaleid','solar_reactor','data_rain','heart_pulse','solar_array','digital_rainforest'}

def fail(message):
    raise ValueError('Pack v3: ' + message)

def label(value, path, max_len=90):
    if not isinstance(value,str) or not 1<=len(value.strip())<=max_len:
        fail(f'invalid {path}')
    return value.strip()

def numeric(value, path, lo=-1000000, hi=1000000):
    if type(value) not in (int,float) or not math.isfinite(value) or not lo<=value<=hi:
        fail(f'invalid number in {path}')
    return value

def identifier(value,path):
    if not isinstance(value,str) or not NAME.fullmatch(value):
        fail(f'invalid identifier in {path}')
    return value

def validate_program(program, extra_inputs=frozenset()):
    if not isinstance(program,dict) or set(program)-{'version','state','update','draw'} or program.get('version')!=1:
        fail('program must contain version 1, state, update and draw only')
    state=program.get('state',{})
    if not isinstance(state,dict) or len(state)>32:
        fail('state supports up to 32 named registers')
    for name,value in state.items():
        identifier(name,'state')
        if name in INPUTS or name in extra_inputs or name in {'i','j','k'}:fail('state shadows an input or loop index')
        numeric(value,'state')
    def expr(value, scope, depth=0):
        if depth>12:fail('expression nesting exceeds 12')
        if type(value) in (int,float):
            numeric(value,'expression');return 1
        if not isinstance(value,list) or not value or not isinstance(value[0],str) or value[0] not in OPS:
            fail('expression must be a finite number or an allowed operation array')
        op=value[0]
        if len(value)!=OPS[op]+1:fail('wrong number of expression operands')
        if op=='get':
            if not isinstance(value[1],str) or value[1] not in (INPUTS|set(state)|scope|extra_inputs):
                fail('unknown input, state variable or loop index')
            return 1
        return 1+sum(expr(item,scope,depth+1) for item in value[1:])
    def color(value,scope):
        if isinstance(value,str) and COLOR.fullmatch(value):return 1
        if isinstance(value,dict) and set(value)=={'hsl'} and isinstance(value['hsl'],list) and len(value['hsl'])==3:
            return 1+sum(expr(a,scope) for a in value['hsl'])
        fail('colors must be #RRGGBB or bounded hsl expression')
    def instructions(items,scope,mode,depth=0):
        if depth>4 or not isinstance(items,list) or len(items)>96:
            fail('too many commands or excessive nested blocks')
        total=0
        for item in items:
            if not isinstance(item,dict) or not isinstance(item.get('do'),str):fail('invalid program command')
            kind=item['do'];cost=1
            if kind=='set':
                if set(item)!={'do','var','value'} or item['var'] not in state:
                    fail('set may only update declared state registers')
                cost+=expr(item['value'],scope)
            elif kind=='if':
                if set(item)-{'do','test','then','else'} or 'test' not in item or 'then' not in item:
                    fail('invalid if command')
                cost+=expr(item['test'],scope)
                cost+=max(instructions(item['then'],scope,mode,depth+1),instructions(item.get('else',[]),scope,mode,depth+1))
            elif kind=='repeat':
                if set(item)!={'do','count','index','body'}:fail('invalid repeat')
                if type(item['count'])!=int or not 1<=item['count']<=96:fail('repeat count must be 1–96')
                if item['index'] not in ('i','j','k') or item['index'] in scope:fail('repeat uses i, j, k without shadowing')
                cost+=item['count']*instructions(item['body'],scope|{item['index']},mode,depth+1)
            elif kind in DRAW:
                if mode!='draw':fail('drawing commands are only allowed in draw stage')
                allowed={'do',*DRAW[kind],'color','alpha','size','value','text','stroke'}
                if set(item)-allowed or not all(field in item for field in DRAW[kind]):fail('invalid draw command fields')
                for field in DRAW[kind]:cost+=expr(item[field],scope)
                cost+=color(item.get('color','#ffffff'),scope)
                if 'alpha' in item:cost+=expr(item['alpha'],scope)
                if 'size' in item:cost+=expr(item['size'],scope)
                if kind=='text':
                    label(item.get('text'),'draw text',64)
                    if 'value' in item:cost+=expr(item['value'],scope)
                elif 'text' in item or 'value' in item:fail('text/value only apply to text commands')
                if 'stroke' in item and (kind!='circle' or type(item['stroke'])!=bool):fail('stroke must be boolean on circles')
            else:fail('unknown program command ' + kind)
            total+=cost
            if total>3500:fail('stage instruction budget exceeds 3500 operations')
        return total
    if 'update' not in program or 'draw' not in program:fail('both update and draw stages are required')
    update_cost=instructions(program['update'],set(),'update')
    draw_cost=instructions(program['draw'],set(),'draw')
    if update_cost>1000 or draw_cost>2300:fail('per-stage program budget exceeded')
    return {'version':1,'state':dict(state),'update':program['update'],'draw':program['draw']}

def validate_pack(payload, legacy_validator):
    if not isinstance(payload,dict) or type(payload.get('format')) is not int or payload['format']!=3:
        fail('requires pack format 3')
    if set(payload)-{'format','pack_id','name','author','version','description','scenes'}:
        fail('unknown top-level field')
    pack_id=payload.get('pack_id')
    if not isinstance(pack_id,str) or not PACK_ID.fullmatch(pack_id):fail('invalid pack ID')
    name=label(payload.get('name'),'pack name')
    author=label(payload.get('author','Community'),'author')
    version=label(payload.get('version','1.0.0'),'version',24)
    description=label(payload.get('description','Universal visualizer pack'),'description',360)
    scenes=payload.get('scenes')
    if not isinstance(scenes,list) or not 1<=len(scenes)<=32:fail('requires 1–32 scenes')
    checked=[];ids=set()
    for scene in scenes:
        if not isinstance(scene,dict) or set(scene)-{'id','title','category','background','overlays','layers','program','interaction','options'}:
            fail('unknown scene field')
        scene_id=scene.get('id')
        if not isinstance(scene_id,str) or not PACK_ID.fullmatch(scene_id) or not scene_id.startswith('world_') or scene_id in ids:
            fail('duplicate or invalid scene ID')
        ids.add(scene_id)
        if scene.get('category') not in CATEGORIES:fail('unknown category')
        if 'program' not in scene:fail('every v3 scene needs a programmable stage')
        options=scene.get('options',[])
        if not isinstance(options,list) or len(options)>8:fail('scene options support at most 8 controls')
        safe_options=[];option_ids=set()
        for option in options:
            if not isinstance(option,dict) or set(option)!={'id','label','choices'}:fail('invalid scene option')
            ident=identifier(option.get('id'),'scene option')
            if len(ident)>20 or ident in option_ids:fail('duplicate or long option ID')
            option_ids.add(ident)
            title=label(option.get('label'),'option label',40)
            choices=option.get('choices')
            if not isinstance(choices,list) or not 2<=len(choices)<=10:fail('option needs 2–10 choices')
            safe_choices=[];vals=set()
            for choice in choices:
                if not isinstance(choice,dict) or set(choice)!={'value','label'}:fail('invalid option choice')
                value=numeric(choice['value'],'option choice',-100,100)
                if value in vals:fail('duplicate choice value')
                vals.add(value)
                safe_choices.append({'value':value,'label':label(choice['label'],'choice label',36)})
            safe_options.append({'id':ident,'label':title,'choices':safe_choices})
        program=validate_program(scene['program'],{f'opt_{ident}' for ident in option_ids})
        interaction=scene.get('interaction')
        if interaction is not None:
            if not isinstance(interaction,dict) or set(interaction)-{'modes','default','kind','action_label'}:
                fail('interaction accepts only kind, modes, default and action_label')
            if interaction.get('kind') not in ('game','interactive_art','spectator'):
                fail('interaction.kind must be game, interactive_art or spectator')
            valid_modes={'ai_ai','player_ai','player_player','solo'}
            modes=interaction.get('modes')
            if not isinstance(modes,list) or not 1<=len(modes)<=4 or len(modes)!=len(set(modes)) or not set(modes)<=valid_modes:
                fail('invalid interaction modes')
            if interaction.get('default','ai_ai') not in modes:
                fail('interaction default must be supported')
            # 4.5.0: shipped spectator worlds are intentionally AI-only. Accept
            # their safe declarative stage, but disallow human-control modes.
            if interaction.get('kind')=='spectator' and modes!=['ai_ai']:
                fail('spectator worlds must be AI vs AI only')
            interaction={'kind':interaction['kind'],'modes':modes,'default':interaction.get('default','ai_ai'),'action_label':label(interaction.get('action_label','Action'),'interaction.action_label',32)}
        if len(scene.get('layers',[]))>3:fail('too many legacy layers')
        for layer in scene.get('layers',[]):
            if not isinstance(layer,dict) or layer.get('effect') not in EFFECTS:fail('unknown layer')
        # Reuse the full version-2 validation for optional legacy layers,
        # backgrounds and overlays; remove the temporary invisible base layer.
        dummy={'effect':'crt_pulse','intensity':.2}
        proxy_scene={k:v for k,v in scene.items() if k not in ('program','interaction')}
        proxy_scene['layers']=scene.get('layers',[]) or [dummy]
        proxy={'format':2,'pack_id':pack_id,'name':name,'author':author,
               'version':version,'description':description,'scenes':[proxy_scene]}
        sanitized=legacy_validator(proxy)['scenes'][0]
        if not scene.get('layers'):sanitized['layers']=[]
        sanitized['program']=program
        if interaction is not None:sanitized['interaction']=interaction
        if safe_options:sanitized['options']=safe_options
        checked.append(sanitized)
    return {'format':3,'pack_id':pack_id,'name':name,'author':author,'version':version,
            'description':description,'scenes':checked}
