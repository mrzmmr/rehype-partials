const http = require('http');

const server = http.createServer((req, res) => {
	res.end(`
    <div class='from' class='server'>
      <p>Hello</p>
    </div>
  `);
});

server.listen('3000', '127.0.0.1', () => {
	console.log('Listening on 127.0.0.1:3000');
	console.log('Run: > node index.js');
});
