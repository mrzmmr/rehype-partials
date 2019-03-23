const {readFileSync} = require('fs');
const rehype = require('rehype');
const format = require('rehype-format');
const partials = require('../../..');

const start = readFileSync('./start.html', 'utf-8');

rehype()
	.use(partials)
	.use(format)
	.process(start)
	.then(
		file => console.log(String(file)),
		error => console.error(error)
	);
