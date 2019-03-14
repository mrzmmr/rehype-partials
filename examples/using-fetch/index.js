const fetch = require('isomorphic-unfetch');
const reporter = require('vfile-reporter');
const format = require('rehype-format');
const vfile = require('to-vfile');
const rehype = require('rehype');

const partials = require('../..');

function get(path, callback) {
	return (async path => {
		try {
			const res = await (await fetch(path)).text();
			callback(null, res);
		} catch (error) {
			callback(error);
		}
	})(path);
}

rehype()
	.data('settings', {emitParseErrors: true})
	.use(partials, {handle: get, messages: true})
	.use(format)
	.process(vfile.readSync('./index.html'), (err, file) => {
		console.error(reporter(err || file));
		console.log(String(file));
	});
