#!/bin/zsh
set -e
cd "$(dirname $0)/video"; OUT=../../public/video; mkdir -p $OUT
for t in T12-tilt:t12 T23-dive:t23 T34-pan:t34 T45-dusk:t45; do s=${t%%:*}; d=${t##*:}
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=1920:-2 -c:v libx264 -preset slow -crf 27 -g 4 -bf 0 -pix_fmt yuv420p -movflags +faststart $OUT/$d-1080.mp4
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slow -crf 27 -g 4 -bf 0 -pix_fmt yuv420p -movflags +faststart $OUT/$d-720.mp4
done
for t in L1-hero:hero L2-sky:sky L3-pond:pond L5-room:room; do s=${t%%:*}; d=${t##*:}
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=1920:-2 -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good -cpu-used 2 $OUT/$d-1080.webm
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=1920:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart $OUT/$d-1080.mp4
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=1280:-2 -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 $OUT/$d-720.webm
  ffmpeg -loglevel error -y -i $s.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart $OUT/$d-720.mp4
done
ls -la $OUT | awk '{print $5/1e6 "MB", $9}'
