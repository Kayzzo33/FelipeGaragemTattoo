const fs = require('fs');
const { spawn } = require('child_process');

const totalSize = 243018276;
const numParts = 8;
const chunkSize = Math.ceil(totalSize / numParts);
const url = 'https://drive.usercontent.google.com/download?id=1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj&export=download&confirm=t';

// Check which parts are below 50%
[0, 1, 4, 5, 6].forEach(i => {
  const file = `/tmp/video2.part${i}`;
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize - 1, totalSize - 1);
  const expected = end - start + 1;
  const current = fs.existsSync(file) ? fs.statSync(file).size : 0;
  if (current < expected) {
    const rangeStart = start + current;
    console.log(`Boosting part ${i}: byte ${rangeStart} to ${end}`);
    const fd = fs.openSync(file, 'a');
    spawn('curl', ['-sL', '--retry', '5', '-r', `${rangeStart}-${end}`, url], {
      stdio: ['ignore', fd, 'inherit']
    });
  }
});
