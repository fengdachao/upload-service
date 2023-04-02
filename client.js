const net = require('node:net');
const { readFile } = require('node:fs');
const { argv } = require('node:process')

const db = require('./db')

const port = argv[2] || 9001
const host = 'localhost'
const client = net.createConnection({ host, port }, () => {
  // 'connect' listener.
  console.log('connected to server with port', port);
  
  // client.write('world!\r\n');
});
readFile('./upload-images/images.jpeg', (err, chunk) => {
  client.write(chunk);
  console.log('reading chunk:', chunk)
})
client.on('data', (data) => {
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
