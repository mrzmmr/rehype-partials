const {readFileSync} = require('fs');
const rehype = require('rehype');
const format = require('rehype-format');
const report = require('vfile-reporter');
const partials = require('../..');

rehype()
	.use(partials, {max: 2})
	.use(format)
	.process(readFileSync('./index.html'), (error, file) => {
		console.error(report(error || file));
		console.log(String(file));
	});

