#!/bin/zsh
set -e
cd "$(dirname $0)/video"; OUT=../../public/video
for t in mT12-tilt:t12 mT23-dive:t23 mT34-pan:t34 mT45-dusk:t45; do s=${t%%:*}; d=${t##*:}
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=720:-2 -c:v libx264 -preset slow -crf 27 -g 4 -bf 0 -pix_fmt yuv420p -movflags +faststart $OUT/$d-m-720.mp4
done
for t in mL1-hero:hero mL2-sky:sky mL3-pond:pond mL5-room:room; do s=${t%%:*}; d=${t##*:}
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=1080:-2 -c:v libvpx-vp9 -b:v 0 -crf 37 -row-mt 1 -deadline good -cpu-used 2 $OUT/$d-m-1080.webm
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=1080:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart $OUT/$d-m-1080.mp4
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=720:-2 -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 $OUT/$d-m-720.webm
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=720:-2 -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart $OUT/$d-m-720.mp4
done
ls -la $OUT | grep -- "-m-" | awk '{print $5/1e6 "MB", $9}'
