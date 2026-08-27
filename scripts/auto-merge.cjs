const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function checkAndAssemble(targetName, totalSize, numParts) {
  const chunkSize = Math.ceil(totalSize / numParts);
  for (let i = 0; i < numParts; i++) {
    const file = `/tmp/${targetName}_clean_${i}.part`;
    if (!fs.existsSync(file)) return false;
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    const expected = end - start + 1;
    if (fs.statSync(file).size < expected) return false;
  }

  console.log(`\n==============================================`);
  console.log(`>>> ALL PARTS FOR ${targetName} COMPLETE! ASSEMBLING... <<<`);
  console.log(`==============================================`);

  const rawPath = `/tmp/${targetName}_complete_raw.mov`;
  const outFd = fs.openSync(rawPath, 'w');
  for (let i = 0; i < numParts; i++) {
    const file = `/tmp/${targetName}_clean_${i}.part`;
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, totalSize - 1);
    const expected = end - start + 1;

    const buffer = Buffer.alloc(expected);
    const inFd = fs.openSync(file, 'r');
    fs.readSync(inFd, buffer, 0, expected, 0);
    fs.closeSync(inFd);
    fs.writeSync(outFd, buffer, 0, expected);
  }
  fs.closeSync(outFd);

  const finalMp4 = path.join(process.cwd(), 'public', 'videos', `${targetName}.mp4`);
  console.log(`Transcoding ${rawPath} to ${finalMp4}...`);
  execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -preset veryfast -crf 23 -vf "scale='min(1080,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${finalMp4}"`, { stdio: 'inherit' });
  fs.unlinkSync(rawPath);

  // Clean up parts
  for (let i = 0; i < numParts; i++) {
    try { fs.unlinkSync(`/tmp/${targetName}_clean_${i}.part`); } catch (e) {}
  }

  const probe = execSync(`ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "${finalMp4}"`).toString();
  console.log(`>>> ${targetName}.mp4 SAVED SUCCESSFULLY! <<<`, probe.trim());
  return true;
}

let v2Done = false;
let v1Done = false;

const interval = setInterval(() => {
  if (!v2Done) {
    v2Done = checkAndAssemble('video2', 243018276, 8);
  }
  if (!v1Done) {
    v1Done = checkAndAssemble('video1', 579552449, 16);
  }

  if (v2Done && v1Done) {
    console.log('ALL VIDEOS ASSEMBLED AND ENCODED!');
    clearInterval(interval);
    process.exit(0);
  }
}, 3000);
