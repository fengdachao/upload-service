const net = require('node:net');
const { writeFile } = require('node:fs');


const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
  c.on('data', (chunk) => {
    console.log('recv chunk:', chunk.toString('utf-8'));
    writeFile('./tmp.jpeg', chunk, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    
  })
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
