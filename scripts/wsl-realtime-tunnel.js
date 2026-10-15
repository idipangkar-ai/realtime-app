// Local development bridge: Windows localhost:19000 -> WSL Socket.IO :9000.
// The listener is loopback-only; adb reverse makes it available to the USB phone.
const net = require('node:net');
const { execFileSync } = require('node:child_process');

let cachedHost;
let checkedAt = 0;
function wslHost() {
  if (!cachedHost || Date.now() - checkedAt > 5000) {
    cachedHost = execFileSync(
      'wsl.exe',
      ['--distribution', 'Ubuntu', '--exec', 'hostname', '-I'],
      { encoding: 'utf8', windowsHide: true, timeout: 10000 },
    )
      .trim()
      .split(/\s+/)[0];
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(cachedHost))
      throw new Error('Could not resolve the WSL IPv4 address.');
    checkedAt = Date.now();
  }
  return cachedHost;
}

const server = net.createServer(client => {
  let upstream;
  try {
    upstream = net.connect({ host: wslHost(), port: 9000 });
  } catch (error) {
    console.error(error.message);
    client.destroy();
    return;
  }
  client.pipe(upstream).pipe(client);
  client.on('error', () => upstream.destroy());
  upstream.on('error', error => {
    console.error(`WSL realtime connection: ${error.message}`);
    client.destroy();
  });
  client.on('close', () => upstream.destroy());
  upstream.on('close', () => client.destroy());
});

server.on('error', error => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(19000, '127.0.0.1', () =>
  console.log('USB realtime bridge listening on 127.0.0.1:19000.'),
);
