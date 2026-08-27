const fs = require('fs');
const { spawn, execSync } = require('child_process');
const path = require('path');

async function downloadPart(url, targetName, i, start, end) {
  const expected = end - start + 1;
  const partPath = `/tmp/${targetName}.part${i}`;

  return new Promise((resolve) => {
    function tryDownload() {
      const currentSize = fs.existsSync(partPath) ? fs.statSync(partPath).size : 0;
      if (currentSize === expected) {
        console.log(`[${targetName} Part ${i}] Already complete (${(expected/1024/1024).toFixed(1)}MB)`);
        return resolve();
      }
      if (currentSize > expected) {
        fs.unlinkSync(partPath);
      }

      const reqStart = start + (fs.existsSync(partPath) ? fs.statSync(partPath).size : 0);
      const fd = fs.openSync(partPath, 'a');
      const proc = spawn('curl', [
        '-sL',
        '--retry', '5',
        '--retry-delay', '1',
        '-r', `${reqStart}-${end}`,
        url
      ], { stdio: ['ignore', fd, 'inherit'] });

      proc.on('close', () => {
        fs.closeSync(fd);
        const finalSize = fs.existsSync(partPath) ? fs.statSync(partPath).size : 0;
        if (finalSize === expected) {
          console.log(`[${targetName} Part ${i}] Done 100%!`);
          resolve();
        } else {
          console.log(`[${targetName} Part ${i}] Partial ${(finalSize/1024/1024).toFixed(1)}MB / ${(expected/1024/1024).toFixed(1)}MB, retrying...`);
          setTimeout(tryDownload, 500);
        }
      });

      proc.on('error', () => {
        try { fs.closeSync(fd); } catch (e) {}
        setTimeout(tryDownload, 500);
      });
    }

    tryDownload();
  });
}

async function processVideo(fileId, targetName, totalSize, numChunks = 8) {
  console.log(`\n========================================`);
  console.log(`Downloading ${targetName} (${(totalSize/1024/1024).toFixed(1)}MB) with ${numChunks} parallel workers`);
  console.log(`========================================`);

  const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  const chunkSize = Math.ceil(totalSize / numChunks);
  const tasks = [];

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    tasks.push(downloadPart(url, targetName, i, start, end));
  }

  await Promise.all(tasks);
  console.log(`All ${numChunks} parts of ${targetName} downloaded! Merging...`);

  const rawPath = `/tmp/${targetName}-raw.mov`;
  const outFd = fs.openSync(rawPath, 'w');
  for (let i = 0; i < numChunks; i++) {
    const partPath = `/tmp/${targetName}.part${i}`;
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    const expected = end - start + 1;

    const buffer = Buffer.alloc(expected);
    const inFd = fs.openSync(partPath, 'r');
    fs.readSync(inFd, buffer, 0, expected, 0);
    fs.closeSync(inFd);
    fs.writeSync(outFd, buffer, 0, expected);
    fs.unlinkSync(partPath);
  }
  fs.closeSync(outFd);

  const finalMp4 = path.join(process.cwd(), 'public', 'videos', `${targetName}.mp4`);
  console.log(`Transcoding ${rawPath} (${(fs.statSync(rawPath).size/1024/1024).toFixed(1)}MB) to ${finalMp4}...`);
  execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -preset fast -crf 22 -vf "scale='min(1080,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${finalMp4}"`, { stdio: 'inherit' });
  fs.unlinkSync(rawPath);

  const probe = execSync(`ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "${finalMp4}"`).toString();
  console.log(`>>> ${targetName}.mp4 FINISHED AND VERIFIED! <<<`);
  console.log(probe.trim());
}

async function main() {
  // Video 2: 243MB
  await processVideo('1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj', 'video2', 243018276, 8);
  // Video 1: 579MB
  await processVideo('1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC', 'video1', 579552449, 16);
  console.log('\nALL VIDEOS PROCESSED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Pipeline error:', err);
});
