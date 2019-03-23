const {readFileSync, writeFileSync, readdirSync} = require('fs');
const {join} = require('path');
const format = require('rehype-format');
const rehype = require('rehype');
const partials = require('..');

const base = join(__dirname, 'fixtures');
const fixtures = readdirSync(base);

fixtures.forEach(fixture => {
	const path = join(base, fixture);
	const start = readFileSync(join(path, 'start.html'));
	let settings = {};

	try {
		settings = JSON.parse(
			readFileSync(join(path, 'settings.json'))
		);
	} catch (error) {}

	settings.cwd = path;

	rehype()
		.data('settings', settings)
		.use(partials)
		.use(format)
		.process(start, (error, file) => {
			if (error) {
				throw error;
			}

			writeFileSync(join(path, 'expected.html'), String(file), 'utf-8');
		});
});
