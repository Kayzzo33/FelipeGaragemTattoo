const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// 1. Copy Video 2 if it's already encoded in /tmp/v2_out.mp4
const v2Mp4 = path.join(process.cwd(), 'public', 'videos', 'video2.mp4');
if (fs.existsSync('/tmp/v2_out.mp4')) {
  console.log('Copying /tmp/v2_out.mp4 to public/videos/video2.mp4...');
  fs.copyFileSync('/tmp/v2_out.mp4', v2Mp4);
  fs.unlinkSync('/tmp/v2_out.mp4');
} else if (!fs.existsSync(v2Mp4) || fs.statSync(v2Mp4).size < 10000000) {
  console.log('--- ENCODING VIDEO 2 ---');
  execSync(`ffmpeg -y -i "/tmp/video2_raw.mov" -c:v libx264 -preset ultrafast -crf 24 -vf "scale='min(1080,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${v2Mp4}"`, { stdio: 'inherit' });
}

const v2Probe = execSync(`ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "${v2Mp4}"`).toString().trim();
console.log('>>> VIDEO 2 CONFIRMED & READY! <<<\n', v2Probe);

// 2. Assemble and Process Video 1
console.log('\n--- ASSEMBLING VIDEO 1 ---');
const v1Total = 579552449;
const v1Parts = 16;
const v1Chunk = Math.ceil(v1Total / v1Parts);
const v1Raw = '/tmp/video1_raw.mov';
const v1OutFd = fs.openSync(v1Raw, 'w');

for (let i = 0; i < v1Parts; i++) {
  const p = `/tmp/video1_clean_${i}.part`;
  const start = i * v1Chunk;
  const end = Math.min(start + v1Chunk - 1, v1Total - 1);
  const exp = end - start + 1;
  const buf = Buffer.alloc(exp);
  const inFd = fs.openSync(p, 'r');
  fs.readSync(inFd, buf, 0, exp, 0);
  fs.closeSync(inFd);
  fs.writeSync(v1OutFd, buf, 0, exp);
}
fs.closeSync(v1OutFd);
console.log('Video 1 assembled raw size:', (fs.statSync(v1Raw).size / 1024 / 1024).toFixed(1) + 'MB');

console.log('\n--- ENCODING VIDEO 1 ---');
const v1Mp4 = path.join(process.cwd(), 'public', 'videos', 'video1.mp4');
execSync(`ffmpeg -y -i "${v1Raw}" -c:v libx264 -preset ultrafast -crf 24 -vf "scale='min(1080,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${v1Mp4}"`, { stdio: 'inherit' });

const v1Probe = execSync(`ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "${v1Mp4}"`).toString().trim();
console.log('\n>>> VIDEO 1 CONFIRMED & READY! <<<\n', v1Probe);

console.log('\n========================================');
console.log('ALL VIDEOS FULLY PROCESSED & VERIFIED!');
console.log('========================================');
