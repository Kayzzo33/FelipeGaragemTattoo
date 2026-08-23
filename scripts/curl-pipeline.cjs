const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

function runCurlChunk(url, start, end, outPath) {
  return new Promise((resolve, reject) => {
    const args = [
      '-sL',
      '--retry', '5',
      '--retry-delay', '1',
      '-r', `${start}-${end}`,
      '-o', outPath,
      url
    ];
    const proc = spawn('curl', args);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`curl exited with code ${code}`));
    });
    proc.on('error', reject);
  });
}

async function downloadAndConvert(name, id, totalSize, numParts = 8) {
  const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
  const outputFile = path.join(VIDEOS_DIR, `${name}.mp4`);
  const rawFile = `/tmp/${name}-raw.mp4`;

  console.log(`\n========================================`);
  console.log(`Processing ${name} (${(totalSize / 1024 / 1024).toFixed(1)}MB)`);
  console.log(`========================================`);

  const chunkSize = Math.ceil(totalSize / numParts);
  const partFiles = [];
  const promises = [];

  for (let i = 0; i < numParts; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    const partPath = `/tmp/${name}.part${i}`;
    partFiles.push(partPath);
    console.log(`[Part ${i}] Launching: bytes=${start}-${end}`);
    promises.push(
      runCurlChunk(url, start, end, partPath).then(() => {
        console.log(`[Part ${i}] Finished!`);
      })
    );
  }

  await Promise.all(promises);
  console.log(`All parts downloaded! Merging with cat...`);
  execSync(`cat ${partFiles.join(' ')} > "${rawFile}"`);
  partFiles.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));

  console.log(`Transcoding to web-optimized MP4 with faststart...`);
  execSync(`ffmpeg -y -i "${rawFile}" -c:v libx264 -preset veryfast -crf 23 -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${outputFile}"`, { stdio: 'inherit' });
  if (fs.existsSync(rawFile)) fs.unlinkSync(rawFile);

  const finalStat = fs.statSync(outputFile);
  console.log(`[SUCCESS] ${name}.mp4 is ready! Final size: ${(finalStat.size / 1024 / 1024).toFixed(2)}MB`);
}

async function main() {
  // Video 2 (243MB)
  await downloadAndConvert('video2', '1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj', 243018276, 8);
  // Video 1 (579MB)
  await downloadAndConvert('video1', '1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC', 579552449, 12);
  console.log('\nAll videos successfully prepared!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
