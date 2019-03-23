const http = require('http');

function server() {
	return http.createServer((req, res) => {
		res.end([
			'<div id="foo" id="bar">' +
			'<p>hello</p>' +
			'</div>'
		].join('\n'));
	});
}

server().listen('3000', '127.0.0.1', () => {
	console.log('listening on 127.0.0.1:3000');
	console.log('run: node ./index.js');
});
