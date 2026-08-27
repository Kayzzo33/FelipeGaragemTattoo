const fs = require('fs');
const { spawnSync, execSync } = require('child_process');
const path = require('path');

async function downloadAndEncode(fileId, targetName, totalSize, numChunks = 10) {
  console.log(`\n========================================`);
  console.log(`Starting ${targetName} (${(totalSize / 1024 / 1024).toFixed(1)}MB)`);
  console.log(`========================================`);

  const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  const chunkSize = Math.ceil(totalSize / numChunks);
  const partFiles = [];

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    const expected = end - start + 1;
    const partPath = `/tmp/${targetName}.part${i}`;
    partFiles.push(partPath);

    let attempts = 0;
    while (attempts < 8) {
      const currentSize = fs.existsSync(partPath) ? fs.statSync(partPath).size : 0;
      if (currentSize === expected) {
        break;
      }
      if (currentSize > expected) {
        fs.unlinkSync(partPath);
      }
      attempts++;
      const reqStart = start + (fs.existsSync(partPath) ? fs.statSync(partPath).size : 0);
      console.log(`[${targetName} Part ${i}/${numChunks}] Range: ${reqStart}-${end} (Attempt ${attempts})`);
      
      const fd = fs.openSync(partPath, 'a');
      const res = spawnSync('curl', [
        '-sL',
        '--connect-timeout', '10',
        '--max-time', '30',
        '-r', `${reqStart}-${end}`,
        url
      ], { stdio: ['ignore', fd, 'inherit'] });
      fs.closeSync(fd);

      const newSize = fs.existsSync(partPath) ? fs.statSync(partPath).size : 0;
      if (newSize === expected) {
        console.log(`[${targetName} Part ${i}] Completed 100% (${(expected/1024/1024).toFixed(2)}MB)`);
        break;
      }
    }
  }

  // Combine
  const rawPath = `/tmp/${targetName}-raw.mov`;
  const outFd = fs.openSync(rawPath, 'w');
  for (let i = 0; i < numChunks; i++) {
    const partPath = partFiles[i];
    const data = fs.readFileSync(partPath);
    fs.writeSync(outFd, data);
    fs.unlinkSync(partPath);
  }
  fs.closeSync(outFd);

  console.log(`Combined raw file: ${(fs.statSync(rawPath).size / 1024 / 1024).toFixed(2)}MB`);

  const finalMp4 = path.join(process.cwd(), 'public', 'videos', `${targetName}.mp4`);
  console.log(`Transcoding to ${finalMp4}...`);
  execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -preset veryfast -crf 22 -vf "scale='min(1080,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${finalMp4}"`, { stdio: 'inherit' });
  fs.unlinkSync(rawPath);

  const probe = execSync(`ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "${finalMp4}"`).toString();
  console.log(`SUCCESS! Transcode verified:`, probe.trim());
}

async function run() {
  // First video 2 (243MB)
  await downloadAndEncode('1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj', 'video2', 243018276, 8);
  // Then video 1 (579MB)
  await downloadAndEncode('1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC', 'video1', 579552449, 12);
}

run().catch(err => {
  console.error('Fatal error in video pipeline:', err);
});
