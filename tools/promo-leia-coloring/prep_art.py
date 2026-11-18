"""Crops the interior pages out of the Etsy listing slideshow (the only place the coloured
pages exist in the repo), a circular Leia avatar from the cover, and a real QR code.
Usage: python3 prep_art.py <repo-root>"""
import sys, json
from PIL import Image, ImageFilter
import segno
root = sys.argv[1]
def frame(t, name):
    import subprocess
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',f'{root}/public/leia-coloring-book/promo-video.mp4','-frames:v','1',name],check=True)
frame(3.4,'/tmp/etsy_collage.png'); frame(5.6,'/tmp/etsy_bw.png')
c = Image.open('/tmp/etsy_collage.png').convert('RGB'); b = Image.open('/tmp/etsy_bw.png').convert('RGB')
def up(im, box, name, k=2.4):
    cr = im.crop(box); cr = cr.resize((int(cr.width*k), int(cr.height*k)), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.6, 70, 2)); cr.save(f'assets/{name}.jpg', quality=92); print(name, cr.size)
up(c,(46,104,372,352),'page-garden'); up(c,(388,98,714,346),'page-forest'); up(c,(48,382,374,624),'page-kitchen'); up(c,(388,386,714,630),'page-xmas')
up(b,(54,115,375,535),'forest-bw'); up(b,(381,115,702,535),'forest-color')
cv = Image.open('assets/cover-front.jpg').convert('RGB'); W, H = cv.size
av = cv.crop((300, 90, 760, 550)).resize((420,420), Image.LANCZOS); av.save('assets/leia-avatar.jpg', quality=92)
qr = segno.make('https://www.logicmanse.ca/LeiaColoringBook/', error='m', boost_error=False)
m = [[1 if v else 0 for v in row] for row in qr.matrix]
open('assets/qr.js','w').write('window.QR='+json.dumps(m)+';'); print('qr', len(m))
