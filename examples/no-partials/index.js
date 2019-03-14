const reporter = require('vfile-reporter');
const format = require('rehype-format');
const vfile = require('to-vfile');
const rehype = require('rehype');
const partials = require('../..');

rehype()
	.use(partials)
	.use(format)
	.process(vfile.readSync('./index.html'), (err, file) => {
		console.error(reporter(err || file));
		console.log(String(file));
	});
