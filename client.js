const net = require('node:net');
const { readFile } = require('node:fs');

const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  
  // client.write('world!\r\n');
});
readFile('./images/hongye1.jpeg', (err, chunk) => {
  client.write(chunk);
})
client.on('data', (data) => {
  // console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
