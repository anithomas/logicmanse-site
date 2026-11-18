import math, numpy as np, wave, os
from PIL import Image, ImageDraw, ImageFont
W,H,FPS=1920,1080,30
S='fonts/'
bold=lambda s:ImageFont.truetype(S+'Poppins-Bold.ttf',s)
semi=lambda s:ImageFont.truetype(S+'Poppins-SemiBold.ttf',s)
NAVY=(37,33,64); ORANGE=(196,104,16)
os.makedirs('work/intro',exist_ok=True); os.makedirs('work/pills',exist_ok=True)

def ease_out_back(t):
    c1=1.70158;c3=c1+1;t=min(max(t,0),1)
    return 1+c3*(t-1)**3+c1*(t-1)**2
def ease(t): t=min(max(t,0),1); return 1-(1-t)**3

# ---- background (vertical cream gradient + the soft circles of the original)
bg=Image.new('RGB',(W,H))
px=ImageDraw.Draw(bg)
for y in range(H):
    k=y/H; px.line([(0,y),(W,y)],fill=(int(255-2*k),int(246-6*k),int(228-23*k)))
ov=Image.new('RGBA',(W,H),(0,0,0,0)); od=ImageDraw.Draw(ov)
od.ellipse([-500,-100,600,600],fill=(250,225,190,110))
od.ellipse([1420,640,2300,1520],fill=(205,222,190,150))
bg=Image.alpha_composite(bg.convert('RGBA'),ov).convert('RGB')

# ---- intro 2.5 s: two-line pain-point hook
l1="Tired of the daily battle…"
parts=[("to get them ",NAVY),("writing and counting",ORANGE),("?",NAVY)]
f=bold(92)
def line_w(items): return sum(f.getlength(t) for t,_ in items)
for i in range(int(2.5*FPS)):
    t=i/FPS
    im=bg.copy(); d=ImageDraw.Draw(im)
    # line 1: 0.05-0.55
    a=ease((t-0.05)/0.5); 
    if a>0:
        layer=Image.new('RGBA',(W,H),(0,0,0,0)); ld=ImageDraw.Draw(layer)
        w=f.getlength(l1); ld.text(((W-w)/2,380+int((1-a)*30)),l1,font=f,fill=NAVY+(int(255*a),))
        im=Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB')
    a=ease((t-0.95)/0.5)
    if a>0:
        layer=Image.new('RGBA',(W,H),(0,0,0,0)); ld=ImageDraw.Draw(layer)
        x=(W-line_w(parts))/2
        for txt,col in parts:
            ld.text((x,540+int((1-a)*30)),txt,font=f,fill=col+(int(255*a),)); x+=f.getlength(txt)
        im=Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB')
    im.save(f'work/intro/{i:04d}.png')

# ---- character name pills overlay: transparent RGBA, 5.5 s starting at original t=22.0
PILLS=[("the Owl",(42,154,165),360,22.55),("the Rabbit",(232,115,26),760,23.05),
       ("the Butterfly",(138,85,200),1160,23.30),("the Dog",(192,48,44),1560,23.55)]
T0=22.0; END=27.6; HOLD_END=26.4
pf=semi(34)
for i in range(int((END-T0)*FPS)):
    t=T0+i/FPS
    layer=Image.new('RGBA',(W,H),(0,0,0,0))
    for name,col,cx,st in PILLS:
        k=(t-st)/0.45
        if k<=0: continue
        s=ease_out_back(k)
        fade=1.0 if t<HOLD_END else max(0,1-(t-HOLD_END)/0.5)
        if fade<=0: continue
        tw=pf.getlength(name); pw,ph=int(tw+56),58
        pill=Image.new('RGBA',(pw+8,ph+8),(0,0,0,0)); pd=ImageDraw.Draw(pill)
        pd.rounded_rectangle([4,4,pw+4,ph+4],radius=29,fill=col+(255,))
        pd.text((4+28,4+ph/2),name,font=pf,fill=(255,255,255,255),anchor='lm')
        sw,sh=max(1,int(pill.width*s)),max(1,int(pill.height*s))
        pill=pill.resize((sw,sh),Image.LANCZOS)
        if fade<1:
            al=pill.getchannel('A').point(lambda v:int(v*fade)); pill.putalpha(al)
        layer.alpha_composite(pill,(int(cx-sw/2),int(742-sh/2)))
    layer.save(f'work/pills/{i:04d}.png')

# ---- SFX track (48k stereo), output timeline = original + 2.3 s
SR=48000; DUR=46.5
buf=np.zeros(int(SR*DUR))
def add(t,sig,g=1.0):
    i=int(t*SR); buf[i:i+len(sig)]+=sig[:len(buf)-i]*g
def tone(f0,f1,dur,env=8,wave_='sin'):
    n=int(dur*SR); t=np.arange(n)/SR
    ph=2*np.pi*(f0*t+(f1-f0)*t*t/(2*dur))
    s=np.sin(ph) if wave_=='sin' else np.sign(np.sin(ph))*0.5
    return s*np.exp(-env*t/dur)*np.minimum(1,t/0.004)
def noise(dur,env=5):
    n=int(dur*SR); t=np.arange(n)/SR
    return np.random.default_rng(1).standard_normal(n)*np.exp(-env*t/dur)*np.minimum(1,t/0.004)
# hook: soft tick-pops as each line lands, record "bonk" on line 2
add(0.05,tone(520,700,0.12),0.5); add(0.95,tone(300,180,0.22,6),0.7)
# whoosh into the cover (cover lands at 2.3 s)
n=int(0.45*SR); t=np.arange(n)/SR
w=noise(0.45,2.5)*np.sin(np.pi*t/0.45); 
# crude lowpass sweep
k=np.convolve(w,np.ones(40)/40,mode='same'); add(2.1,k,0.9)
# character pops: owl hoot, bunny boing, butterfly flutter, dog bark
D=2.3
add(22.55+D,tone(440,330,0.28,4)*0.8+tone(660,495,0.28,4)*0.3,0.55)           # hoot
add(23.05+D,tone(250,700,0.22,5),0.55)                                        # boing
fl=sum(tone(1200+90*j,1500+90*j,0.05,4) for j in range(1)) 
for j in range(5): add(23.30+D+j*0.045,tone(1300+60*j,1700+60*j,0.05,4),0.28)  # flutter
add(23.55+D,tone(260,150,0.14,5,'sq')*0.7+noise(0.1,6)[:int(0.14*SR)].mean()*0,0.45)  # bark
add(23.55+D+0.002,noise(0.09,6)*0.35,0.45)
buf/=max(1,np.abs(buf).max()/0.9)
st=np.stack([buf,buf],1)
with wave.open('work/sfx.wav','wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
    wf.writeframes((st*32767).astype('<i2').tobytes())
print('ok')
