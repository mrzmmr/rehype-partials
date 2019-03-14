const {readdirSync, readFileSync, writeFileSync} = require('fs');
const {join} = require('path');
const unified = require('unified');
const parse = require('rehype-parse');
const stringify = require('rehype-stringify');
const format = require('rehype-format');
const partials = require('..');

const base = join(__dirname, 'fixtures');
let fixtures = readdirSync(base);

fixtures = fixtures.map(fixture => {
	const path = join(base, fixture);
	const start = readFileSync(join(path, 'start.html'));
	let settings = {};

	try {
		settings = JSON.parse(readFileSync(join(path, 'settings.json')));
	} catch (error) {}

	settings.cwd = path;

	return unified()
		.use(parse)
		.use(stringify)
		.use(partials, settings)
		.use(format)
		.process(start)
		.then(file => {
			writeFileSync(join(path, 'expected.html'), String(file), 'utf-8');
			return path;
		});
});

Promise.all(fixtures).then(
	paths => console.log('generated:', paths),
	console.error
);
