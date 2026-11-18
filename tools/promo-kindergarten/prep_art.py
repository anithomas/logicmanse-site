"""Cut character 'stickers' + land icons out of the free-printables PDF (300 ppi line art).
Usage: python3 prep_art.py <pdf> <outdir>"""
import sys, subprocess, tempfile, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
pdf, out = sys.argv[1], sys.argv[2]
tmp = tempfile.mkdtemp()
subprocess.run(['pdftoppm','-r','300','-png','-f','4','-l','5',pdf,tmp+'/pg'],check=True)
p4 = np.array(Image.open(tmp+'/pg-4.png').convert('L'))
p5 = np.array(Image.open(tmp+'/pg-5.png').convert('L'))
INK = (38, 32, 62)

def sticker(g, box, name, fill, height=720, pad=40, grow=7):
    x0,y0,x1,y1 = box
    c = g[max(0,y0-pad):y1+pad, max(0,x0-pad):x1+pad]
    lines = c < 170
    sil = ndi.binary_fill_holes(ndi.binary_dilation(lines, iterations=grow))
    border = ndi.binary_dilation(sil, iterations=22)
    h, w = c.shape
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[border] = (255,255,255,255)                 # white sticker edge
    rgba[sil] = fill + (255,)                        # coloured interior
    ink_a = np.clip((255 - c.astype(float)) * 1.5, 0, 255).astype(np.uint8)
    inkmask = ink_a > 0
    rgba[...,:3][inkmask & sil] = INK                # line art on top
    rgba[...,3] = np.where(border, 255, 0)
    # line layer separate (so the colour can be wiped on)
    lay_line = np.zeros((h,w,4),np.uint8); lay_line[...,:3]=INK; lay_line[...,3]=ink_a
    lay_fill = np.zeros((h,w,4),np.uint8); lay_fill[border]=(255,255,255,255); lay_fill[sil]=fill+(255,)
    sc = height / h
    for tag, arr in (('fill',lay_fill),('line',lay_line)):
        im = Image.fromarray(arr,'RGBA').resize((int(w*sc),height),Image.LANCZOS)
        im.save(f'{out}/{name}-{tag}.png',optimize=True)
    print(name,(int(w*sc),height))

os.makedirs(out, exist_ok=True)
sticker(p4,(652,771,1893,1962),'leia',(255,244,224),height=640,grow=26)
sticker(p4,(247,2007,804,2697),'ollie',(196,232,236))
sticker(p4,(1047,1997,1532,2707),'ruby',(255,214,176))
sticker(p4,(1731,2027,2320,2640),'bella',(222,206,246),height=640)

# seven land icons from the certificate row: find each circle by connected blobs
strip = p5[2060:2420, 200:2360]
m = ndi.binary_dilation(strip < 170, iterations=14)
lab, n = ndi.label(m)
boxes = sorted([(sl[1].start, sl[0].start, sl[1].stop, sl[0].stop) for sl in ndi.find_objects(lab)
                if (sl[1].stop-sl[1].start) > 200], key=lambda b: b[0])[:7]
for nm,(bx0,by0,bx1,by1) in zip(['alphabet','echo','number','counting','shape','color','puzzle'],boxes):
    cx=(bx0+bx1)//2; r=max(bx1-bx0,by1-by0)//2+4; cy=(by0+by1)//2
    crop=strip[max(0,cy-r):cy+r, max(0,cx-r):cx+r]
    a=np.clip((255-crop.astype(float))*1.5,0,255).astype(np.uint8)
    rgba=np.zeros(crop.shape+(4,),np.uint8); rgba[...,:3]=INK; rgba[...,3]=a
    Image.fromarray(rgba,'RGBA').resize((240,240),Image.LANCZOS).save(f'{out}/land-{nm}.png')
print('lands ok',len(boxes))
