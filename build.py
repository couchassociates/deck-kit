#!/usr/bin/env python3
"""Assemble a single-file deck from a content file plus player.css and player.js.

Usage:
    python build.py <content.html> <out.html>

The content file is any HTML that contains a #stage with <section class="slide"> children
(template.html is the starting point). Whatever the content file has after the
"ZONE 3" banner, or any <link href="player.css"> / <script src="player.js"> tags, is
replaced by the inlined player. Everything before it is kept verbatim, so a deck built
this way can be rebuilt from itself after content edits.
"""
import io,os,re,sys
HERE=os.path.dirname(os.path.abspath(__file__))
if len(sys.argv)<3:
    print(__doc__); sys.exit(1)
src_path,out_path=sys.argv[1],sys.argv[2]
src=io.open(src_path,encoding='utf-8').read()
css=io.open(os.path.join(HERE,'player.css'),encoding='utf-8').read().strip()
js=io.open(os.path.join(HERE,'player.js'),encoding='utf-8').read().strip()

# cut everything from the zone-3 banner (or the first kit link/script/style) onward
cut=len(src)
for pat in (r'<!-- =+\s*ZONE 3', r'<link[^>]+player\.css', r'<script[^>]+player\.js', r'<style id="player-css">'):
    m=re.search(pat,src)
    if m: cut=min(cut,m.start())
head=src[:cut].rstrip()
if '</div>' not in head or 'id="stage"' not in head:
    sys.exit('content must contain <div id="viewport"><div id="stage"> ... </div></div> before the player')

banner=('\n\n<!-- ============================================================\n'
        '     ZONE 3 · PLAYER (inlined from deck-kit; do not edit here, edit the kit and rebuild)\n'
        '     ============================================================ -->\n')
out=head+banner+'<style id="player-css">\n'+css+'\n</style>\n<script id="player-js">\n'+js+'\n</script>\n'
io.open(out_path,'w',encoding='utf-8').write(out)
n=len(re.findall(r'<section class="slide',re.sub(r'<!--.*?-->','',head,flags=re.S)))
print('built %s · %d slides · %d bytes'%(out_path,n,len(out)))
