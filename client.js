const net = require('node:net');
const { readFile } = require('node:fs');
const { argv } = require('node:process')

const db = require('./db')

const port = argv[2] || 9001
// host: '43.143.198.28'
const client = net.createConnection({ port }, () => {
  // 'connect' listener.
  console.log('connected to server with port', port);
  
  // client.write('world!\r\n');
});
readFile('./upload-images/images.jpeg', (err, chunk) => {
  client.write(chunk);
})
client.on('data', (data) => {
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
