const fs = require('fs');
const { spawn, execSync } = require('child_process');
const path = require('path');

const totalSize = 579552449;
const numParts = 16;
const chunkSize = Math.ceil(totalSize / numParts);
const fileId = '1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC';
const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
const rawFile = '/tmp/video1-raw.mov';
const outFile = path.join(process.cwd(), 'public', 'videos', 'video1.mp4');

console.log('=== Starting Video 1 (579MB) 16-Chunk Parallel Download ===');

async function downloadPart(i) {
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize - 1, totalSize - 1);
  const expected = end - start + 1;
  const partFile = `/tmp/video1.part${i}`;

  return new Promise((resolve, reject) => {
    function tryDownload() {
      let currentSize = fs.existsSync(partFile) ? fs.statSync(partFile).size : 0;
      if (currentSize >= expected) {
        console.log(`[Part ${i}] already completed!`);
        return resolve();
      }

      const reqStart = start + currentSize;
      const fd = fs.openSync(partFile, 'a');
      const proc = spawn('curl', ['-sL', '--retry', '10', '--retry-delay', '1', '-r', `${reqStart}-${end}`, url], {
        stdio: ['ignore', fd, 'inherit']
      });

      proc.on('close', (code) => {
        fs.closeSync(fd);
        const finalSize = fs.existsSync(partFile) ? fs.statSync(partFile).size : 0;
        if (finalSize >= expected) {
          console.log(`[Part ${i}] Finished 100%!`);
          resolve();
        } else {
          console.log(`[Part ${i}] partial (${(finalSize/1024/1024).toFixed(1)}MB), resuming...`);
          setTimeout(tryDownload, 500);
        }
      });

      proc.on('error', () => {
        try { fs.closeSync(fd); } catch(e) {}
        setTimeout(tryDownload, 500);
      });
    }

    tryDownload();
  });
}

async function main() {
  const tasks = [];
  for (let i = 0; i < numParts; i++) {
    tasks.push(downloadPart(i));
  }

  await Promise.all(tasks);
  console.log('\nAll 16 parts of Video 1 downloaded successfully! Merging...');

  const outFd = fs.openSync(rawFile, 'w');
  for (let i = 0; i < numParts; i++) {
    const partFile = `/tmp/video1.part${i}`;
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    const expected = end - start + 1;
    
    const buffer = Buffer.alloc(expected);
    const inFd = fs.openSync(partFile, 'r');
    fs.readSync(inFd, buffer, 0, expected, 0);
    fs.closeSync(inFd);
    fs.writeSync(outFd, buffer, 0, expected);
    fs.unlinkSync(partFile);
  }
  fs.closeSync(outFd);

  console.log(`Raw Video 1 merged: ${(fs.statSync(rawFile).size / 1024 / 1024).toFixed(2)}MB`);
  console.log('Transcoding Video 1 to web MP4 (H.264 / AAC / faststart)...');
  execSync(`ffmpeg -y -i "${rawFile}" -c:v libx264 -preset veryfast -crf 22 -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${outFile}"`, { stdio: 'inherit' });
  fs.unlinkSync(rawFile);
  console.log(`>>> SUCCESS: video1.mp4 is ready! Final size: ${(fs.statSync(outFile).size / 1024 / 1024).toFixed(2)}MB <<<`);
}

main().catch(err => {
  console.error('Error in video1 pipeline:', err);
});
