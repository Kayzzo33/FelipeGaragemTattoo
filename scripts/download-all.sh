#!/bin/bash
set -e

mkdir -p /public/videos

download_and_convert() {
  NAME=$1
  FILE_ID=$2
  TOTAL=$3
  PARTS=${4:-8}
  OUTPUT="/app/applet/public/videos/${NAME}.mp4"
  RAW="/tmp/${NAME}-merged.mov"

  if [ -f "$OUTPUT" ] && [ $(stat -c%s "$OUTPUT") -gt 1000000 ]; then
    echo "$NAME already exists, skipping."
    return
  fi

  echo "=================================================="
  echo "Downloading $NAME ($(( TOTAL / 1024 / 1024 ))MB) with $PARTS parallel streams..."
  echo "=================================================="

  URL="https://drive.usercontent.google.com/download?id=${FILE_ID}&export=download&confirm=t"
  CHUNK=$(( (TOTAL + PARTS - 1) / PARTS ))

  rm -f /tmp/${NAME}.part*
  for i in $(seq 0 $((PARTS - 1))); do
    START=$(( i * CHUNK ))
    END=$(( (i + 1) * CHUNK - 1 ))
    if [ $END -ge $TOTAL ]; then END=$(( TOTAL - 1 )); fi
    curl -sL --retry 10 --retry-delay 1 -r ${START}-${END} -o /tmp/${NAME}.part${i} "$URL" &
  done

  wait
  echo "All parts for $NAME downloaded. Merging..."
  cat /tmp/${NAME}.part* > "$RAW"
  rm -f /tmp/${NAME}.part*

  echo "Transcoding $NAME to web MP4 (H.264 / AAC / faststart)..."
  ffmpeg -y -i "$RAW" -c:v libx264 -preset veryfast -crf 22 -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "$OUTPUT"
  rm -f "$RAW"
  echo ">>> SUCCESS: $OUTPUT created ($(( $(stat -c%s "$OUTPUT") / 1024 / 1024 ))MB) <<<"
}

# 1. Amenizador 3D (Video 2)
download_and_convert "video2" "1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj" 243018276 8

# 2. Estilo Autoral & Identidade (Video 1)
download_and_convert "video1" "1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC" 579552449 12

echo "ALL VIDEOS READY IN /public/videos/!"
