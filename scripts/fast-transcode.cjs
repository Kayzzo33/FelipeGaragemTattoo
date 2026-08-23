const fs = require('fs');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');
const path = require('path');

const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

function downloadChunkWithResume(url, chunkFile, startByte, endByte) {
  return new Promise((resolve, reject) => {
    let currentSize = 0;
    if (fs.existsSync(chunkFile)) {
      currentSize = fs.statSync(chunkFile).size;
    }
    const expectedSize = endByte - startByte + 1;
    if (currentSize >= expectedSize) {
      return resolve();
    }

    const reqStart = startByte + currentSize;
    const fileStream = fs.createWriteStream(chunkFile, { flags: 'a' });

    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Range': `bytes=${reqStart}-${endByte}`
      },
      timeout: 10000
    }, (res) => {
      if (res.statusCode !== 200 && res.statusCode !== 206) {
        fileStream.close();
        return reject(new Error(`Bad status ${res.statusCode} for chunk`));
      }

      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        const finalSize = fs.statSync(chunkFile).size;
        if (finalSize >= expectedSize) {
          resolve();
        } else {
          // Retry remaining
          downloadChunkWithResume(url, chunkFile, startByte, endByte).then(resolve).catch(reject);
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      fileStream.close();
      setTimeout(() => {
        downloadChunkWithResume(url, chunkFile, startByte, endByte).then(resolve).catch(reject);
      }, 500);
    });

    req.on('error', (err) => {
      fileStream.close();
      setTimeout(() => {
        downloadChunkWithResume(url, chunkFile, startByte, endByte).then(resolve).catch(reject);
      }, 500);
    });
  });
}

async function fastDownloadFile(url, destPath, totalSize, numChunks = 16) {
  console.log(`[FastDownload] Starting ${(totalSize / 1024 / 1024).toFixed(1)}MB -> ${destPath}`);
  const chunkSize = Math.ceil(totalSize / numChunks);
  const tasks = [];

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    if (start >= totalSize) break;
    const chunkFile = `${destPath}.part${i}`;
    tasks.push(downloadChunkWithResume(url, chunkFile, start, end));
  }

  await Promise.all(tasks);

  console.log(`[FastDownload] Merging chunks into ${destPath}...`);
  const destStream = fs.createWriteStream(destPath);
  for (let i = 0; i < numChunks; i++) {
    const chunkFile = `${destPath}.part${i}`;
    if (fs.existsSync(chunkFile)) {
      destStream.write(fs.readFileSync(chunkFile));
      fs.unlinkSync(chunkFile);
    }
  }
  destStream.end();
  console.log(`[FastDownload] Merged complete: ${destPath}`);
}

async function processVideo(name, url, totalSize, outputName) {
  const finalOutput = path.join(VIDEOS_DIR, outputName);
  if (fs.existsSync(finalOutput) && fs.statSync(finalOutput).size > 1000000) {
    console.log(`[Skip] ${name} already exists: ${finalOutput}`);
    return;
  }

  const rawPath = `/tmp/${name}-raw.tmp`;
  await fastDownloadFile(url, rawPath, totalSize, 16);

  console.log(`[Transcoding] ${name} to Web MP4...`);
  const cmd = `ffmpeg -y -i "${rawPath}" -c:v libx264 -preset veryfast -crf 23 -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${finalOutput}"`;
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
  console.log(`[Success] ${name} is ready at ${finalOutput}!`);
}

async function main() {
  console.log('=== Starting Fast Video Processing ===');
  await processVideo(
    'video2',
    'https://drive.usercontent.google.com/download?id=1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj&export=download&confirm=t',
    243018276,
    'video2.mp4'
  );

  await processVideo(
    'video1',
    'https://drive.usercontent.google.com/download?id=1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC&export=download&confirm=t',
    579552449,
    'video1.mp4'
  );

  console.log('=== All Videos Ready! ===');
}

main();
