
const {readdirSync, readFileSync} = require('fs');
const {join} = require('path');
const unified = require('unified');
const stringify = require('rehype-stringify');
const format = require('rehype-format');
const parse = require('rehype-parse');
const tap = require('tap');
const partials = require('..');

tap.test('rejects', t => {
	t.plan(4);

	t.doesNotThrow(unified()
		.use(parse)
		.use(stringify)
		.use(partials)
		.freeze(),
	'should not throw with no options.'
	);

	t.doesNotThrow(unified()
		.use(parse)
		.use(stringify)
		.use(partials, {max: 1, cwd: './', messages: true})
		.freeze(),
	'should not throw with options.'
	);

	t.rejects(unified()
		.use(parse)
		.use(stringify)
		.use(partials, {handle: (_, f) => f(new Error('rejected'))})
		.process('<p><!--include href="span.html"--></p>'),
	'should reject if handle throws.'
	);

	t.rejects(unified()
		.use(parse)
		.use(stringify)
		.use(partials)
		.process('<p><!--include href="span.html"--></p>'),
	'should reject if no such file or directory.'
	);
});

tap.test('fixtures', t => {
	const base = join(__dirname, 'fixtures');
	const fixtures = readdirSync(base);

	t.plan(fixtures.length);

	fixtures.forEach(each);

	function each(fixture) {
		const path = join(base, fixture);
		const start = readFileSync(join(path, 'start.html'));
		const expected = readFileSync(join(path, 'expected.html'));
		let settings = {};

		try {
			settings = JSON.parse(readFileSync(join(path, 'settings.json')));
		} catch (error) {}

		settings.cwd = path;

		unified()
			.use(parse, settings)
			.use(stringify)
			.use(partials, settings)
			.use(format)
			.process(start, (error, file) => {
				t.test(fixture, t => {
					t.plan(1);
					t.equal(String(expected), String(file), 'should be equal.');
				});
			});
	}
});
