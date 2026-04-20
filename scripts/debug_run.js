const { spawn } = require('child_process');
const fs = require('fs');

const out = fs.createWriteStream('run_log.txt');
const child = spawn('node', ['src/config/firebase.js'], { stdio: ['ignore', 'pipe', 'pipe'] });

child.stdout.pipe(out);
child.stderr.pipe(out);

child.on('exit', (code) => {
    console.log('Child exited with code', code);
});
