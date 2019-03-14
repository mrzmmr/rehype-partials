const rehype = require('rehype');
const vfile = require('to-vfile');
const format = require('rehype-format');
const reporter = require('vfile-reporter');
const partials = require('../..');

rehype()
	.use(partials)
	.use(format)
	.data('settings', {emitParseErrors: true})
	.process(vfile.readSync('index.html'), (err, file) => {
		console.error(reporter(err || file));
		console.log(String(file));
	});
