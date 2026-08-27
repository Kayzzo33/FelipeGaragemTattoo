const fs = require('fs');
const { spawnSync, execSync } = require('child_process');
const path = require('path');

function downloadFull(fileId, targetName, totalSize, numParts = 8) {
  console.log(`Starting clean download for ${targetName} (${(totalSize/1024/1024).toFixed(1)}MB)...`);
  const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  const chunkSize = Math.ceil(totalSize / numParts);

  const partFiles = [];
  for (let i = 0; i < numParts; i++) {
    const partPath = `/tmp/${targetName}_clean_${i}.part`;
    partFiles.push(partPath);
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    const expected = end - start + 1;

    if (fs.existsSync(partPath) && fs.statSync(partPath).size === expected) {
      console.log(`Part ${i} already complete.`);
      continue;
    }

    console.log(`Downloading part ${i}/${numParts} (${start}-${end}, ${(expected/1024/1024).toFixed(1)}MB)...`);
    const res = spawnSync('curl', [
      '-sL',
      '--retry', '5',
      '-r', `${start}-${end}`,
      '-o', partPath,
      url
    ], { stdio: 'inherit' });

    const finalSize = fs.existsSync(partPath) ? fs.statSync(partPath).size : 0;
    console.log(`Part ${i} result size: ${(finalSize/1024/1024).toFixed(1)}MB / ${(expected/1024/1024).toFixed(1)}MB`);
  }

  // Merge
  const rawPath = `/tmp/${targetName}_raw.mov`;
  const outFd = fs.openSync(rawPath, 'w');
  for (let i = 0; i < numParts; i++) {
    const partPath = partFiles[i];
    const data = fs.readFileSync(partPath);
    fs.writeSync(outFd, data);
    fs.unlinkSync(partPath);
  }
  fs.closeSync(outFd);

  console.log(`Merged ${targetName}: ${(fs.statSync(rawPath).size/1024/1024).toFixed(1)}MB`);
  const finalMp4 = path.join(process.cwd(), 'public', 'videos', `${targetName}.mp4`);
  
  console.log(`Encoding to ${finalMp4}...`);
  execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -preset fast -crf 23 -vf "scale='min(1080,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${finalMp4}"`, { stdio: 'inherit' });
  fs.unlinkSync(rawPath);

  const probe = execSync(`ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "${finalMp4}"`).toString();
  console.log(`SUCCESS! ${targetName}.mp4 verified:`, probe.trim());
}

async function run() {
  downloadFull('1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj', 'video2', 243018276, 8);
  downloadFull('1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC', 'video1', 579552449, 12);
}

run().catch(e => console.error(e));
