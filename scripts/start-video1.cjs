const fs = require('fs');
const { spawn } = require('child_process');

const totalSize = 579552449;
const numParts = 16;
const chunkSize = Math.ceil(totalSize / numParts);
const url = 'https://drive.usercontent.google.com/download?id=1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC&export=download&confirm=t';

for (let i = 0; i < numParts; i++) {
  const file = `/tmp/video1.part${i}`;
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize - 1, totalSize - 1);
  const expected = end - start + 1;
  const current = fs.existsSync(file) ? fs.statSync(file).size : 0;
  if (current < expected) {
    const rangeStart = start + current;
    const fd = fs.openSync(file, 'a');
    spawn('curl', ['-sL', '--retry', '10', '-r', `${rangeStart}-${end}`, url], {
      stdio: ['ignore', fd, 'inherit']
    });
  }
}
console.log('Video 1: 16 parallel download threads launched!');
