#!/bin/zsh
# Cuts every camera move into a WebP frame sequence for canvas scrubbing.
# Every 2nd source frame (79 of 158); the player cross-blends neighbours, so it still reads as motion.
#   public/seq/<t>/<tier>/NNN.webp   tiers: 1600 + 1024 (16:9 desktop), m720 (9:16 phones)
set -e
cd "$(dirname $0)/video"
OUT=../../public/seq
TMP=$(mktemp -d)
for t in T12-tilt:t12 T23-dive:t23 T34-pan:t34 T45-dusk:t45; do
  s=${t%%:*}; d=${t##*:}
  for src in "$s:d" "m$s:m"; do
    f=${src%%:*}; o=${src##*:}
    rm -rf $TMP/png; mkdir -p $TMP/png
    ffmpeg -loglevel error -y -i $f.mp4 -vf "select='not(mod(n\,2))'" -fps_mode vfr $TMP/png/%03d.png
    if [[ $o == d ]]; then tiers=(1600 1024); else tiers=(m720); fi
    for tier in $tiers; do
      w=${tier#m}
      rm -rf $OUT/$d/$tier; mkdir -p $OUT/$d/$tier
      ls $TMP/png | sed 's/.png$//' | xargs -P 8 -I{} cwebp -quiet -q 62 -m 5 -resize $w 0 $TMP/png/{}.png -o $OUT/$d/$tier/{}.webp
      echo "$d/$tier: $(ls $OUT/$d/$tier | wc -l | tr -d ' ') frames, $(du -sh $OUT/$d/$tier | cut -f1)"
    done
  done
done
rm -rf $TMP
