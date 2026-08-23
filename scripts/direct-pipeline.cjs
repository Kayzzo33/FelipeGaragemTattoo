const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

function processDirect(name, id, originalExt = 'mov') {
  const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
  const rawFile = `/tmp/${name}-source.${originalExt}`;
  const outFile = path.join(VIDEOS_DIR, `${name}.mp4`);

  console.log(`[1/3] Downloading ${name} from Google Drive directly with curl...`);
  // -L follow redirects, -C - resume if interrupted, --retry 10
  execSync(`curl -L --retry 10 --retry-delay 2 -o "${rawFile}" "${url}"`, { stdio: 'inherit' });

  const rawSize = fs.statSync(rawFile).size;
  console.log(`[2/3] Downloaded ${name} successfully! Size: ${(rawSize / 1024 / 1024).toFixed(2)}MB`);

  console.log(`[3/3] Transcoding ${name} to Web MP4 (H.264/AAC + faststart)...`);
  execSync(
    `ffmpeg -y -i "${rawFile}" -c:v libx264 -preset veryfast -crf 22 -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${outFile}"`,
    { stdio: 'inherit' }
  );

  fs.unlinkSync(rawFile);
  const outSize = fs.statSync(outFile).size;
  console.log(`[DONE] ${name}.mp4 ready in /public/videos/! Final web size: ${(outSize / 1024 / 1024).toFixed(2)}MB\n`);
}

async function run() {
  console.log('=== Starting Direct Video Processing Pipeline ===');
  
  // Process Video 2 (Amenizador 3D - 231MB)
  if (!fs.existsSync(path.join(VIDEOS_DIR, 'video2.mp4')) || fs.statSync(path.join(VIDEOS_DIR, 'video2.mp4')).size < 1000000) {
    processDirect('video2', '1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj', 'mov');
  } else {
    console.log('video2.mp4 already exists!');
  }

  // Process Video 1 (Estilo Autoral - 552MB)
  if (!fs.existsSync(path.join(VIDEOS_DIR, 'video1.mp4')) || fs.statSync(path.join(VIDEOS_DIR, 'video1.mp4')).size < 1000000) {
    processDirect('video1', '1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC', 'mov');
  } else {
    console.log('video1.mp4 already exists!');
  }

  console.log('ALL VIDEOS READY FOR AUTOPLAY & PLAYBACK!');
}

run();
