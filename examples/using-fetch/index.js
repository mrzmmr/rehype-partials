const {readFileSync} = require('fs');
const rehype = require('rehype');
const format = require('rehype-format');
const report = require('vfile-reporter');
const fetch = require('isomorphic-unfetch');
const partials = require('../..');

function handle(path, callback) {
	return fetch(path)
		.then(result => result.text())
		.then(result => callback(null, result))
		.catch(error => callback(error));
}

rehype()
	.data('settings', {
		emitParseErrors: true,
		noresolve: true,
		fatal: true,
		handle
	})
	.use(partials)
	.use(format)
	.process(readFileSync('./index.html'), (error, file) => {
		console.error(report(error || file));
		console.log(String(file));
	});
