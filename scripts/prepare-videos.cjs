const fs = require('fs');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');
const path = require('path');

const VIDEOS_DIR = path.join(__dirname, '..', 'public', 'videos');
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

function getFileSize(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return getFileSize(res.headers.location).then(resolve).catch(reject);
      }
      const len = parseInt(res.headers['content-length'] || '0', 10);
      resolve(len);
    });
    req.on('error', reject);
    req.end();
  });
}

function downloadChunk(url, start, end, chunkFile) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(chunkFile);
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Range': `bytes=${start}-${end}`
      }
    }, (res) => {
      if (res.statusCode !== 200 && res.statusCode !== 206) {
        return reject(new Error(`Status ${res.statusCode} for chunk ${start}-${end}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    req.on('error', reject);
  });
}

async function fastParallelDownload(url, destPath, totalSize, numChunks = 16) {
  console.log(`[FastDownload] Downloading ${(totalSize / 1024 / 1024).toFixed(1)}MB with ${numChunks} parallel connections...`);
  const chunkSize = Math.ceil(totalSize / numChunks);
  const promises = [];
  const chunkFiles = [];

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    if (start >= totalSize) break;
    const chunkFile = `${destPath}.part${i}`;
    chunkFiles.push(chunkFile);
    promises.push(
      downloadChunk(url, start, end, chunkFile).then(() => {
        console.log(`[FastDownload] Chunk ${i + 1}/${numChunks} complete.`);
      })
    );
  }

  await Promise.all(promises);
  console.log(`[FastDownload] All chunks received. Merging...`);

  const destStream = fs.createWriteStream(destPath);
  for (const chunkFile of chunkFiles) {
    const data = fs.readFileSync(chunkFile);
    destStream.write(data);
    fs.unlinkSync(chunkFile);
  }
  destStream.end();
  console.log(`[FastDownload] Merged to ${destPath}`);
}

function transcodeToWebMP4(inputPath, outputPath) {
  console.log(`[Transcoding] ${inputPath} -> ${outputPath}`);
  // Usamos h264 + aac + faststart para reprodução e autoplay instantâneo em qualquer tela e navegador
  const cmd = `ffmpeg -y -i "${inputPath}" -c:v libx264 -preset fast -crf 23 -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${outputPath}"`;
  execSync(cmd, { stdio: 'inherit' });
  const stats = fs.statSync(outputPath);
  console.log(`[Transcode Complete] Output size: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
}

async function main() {
  const sources = [
    {
      name: 'video2',
      id: '1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj',
      size: 243018276,
      url: 'https://drive.usercontent.google.com/download?id=1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj&export=download&confirm=t',
      output: path.join(VIDEOS_DIR, 'video2.mp4')
    },
    {
      name: 'video1',
      id: '1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC',
      size: 579552449,
      url: 'https://drive.usercontent.google.com/download?id=1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC&export=download&confirm=t',
      output: path.join(VIDEOS_DIR, 'video1.mp4')
    },
    {
      name: 'video3',
      id: '1dgr8-gsp2VB7SjrP3a6j13h0P7vnkb0s',
      size: 10250811,
      url: 'https://res.cloudinary.com/utnt7lxo/video/upload/v1787266575/395ee917-5e35-47a0-bcc8-d8cc3b9adb6c.mp4',
      output: path.join(VIDEOS_DIR, 'video3.mp4')
    }
  ];

  for (const src of sources) {
    if (fs.existsSync(src.output)) {
      const existing = fs.statSync(src.output);
      if (existing.size > 1000000) {
        console.log(`[Skip] ${src.name} already exists (${(existing.size / 1024 / 1024).toFixed(2)}MB)`);
        continue;
      }
    }

    const rawTemp = path.join('/tmp', `${src.name}-raw.tmp`);
    console.log(`\n=== Processing ${src.name} ===`);
    try {
      await fastParallelDownload(src.url, rawTemp, src.size, 16);
      transcodeToWebMP4(rawTemp, src.output);
      if (fs.existsSync(rawTemp)) fs.unlinkSync(rawTemp);
      console.log(`[Success] ${src.name} is ready at ${src.output}`);
    } catch (err) {
      console.error(`[Error] Failed processing ${src.name}:`, err);
    }
  }

  console.log('\nAll videos processed successfully!');
}

main();
