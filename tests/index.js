const {readdirSync, readFileSync} = require('fs');
const {join} = require('path');
const {test} = require('tap');
const rehype = require('rehype');
const format = require('rehype-format');
const partials = require('..');

test('partials', t => {
	const base = join(__dirname, 'fixtures');
	const fixtures = readdirSync(base);
	const withoutPartial = '<div></div>';
	const withComment = '<div><!-- comment --></div>';
	const withPartial = '<div><!-- href="div.html" --></div>';

	t.plan(11 + fixtures.length);

	t.resolves(rehype()
		.use(partials)
		.process(withoutPartial),
	'should resolve without partial comment.');

	t.resolves(rehype()
		.use(partials)
		.process(withComment),
	'should resolve with non partial comment.');

	t.resolves(rehype()
		.use(partials)
		.process(withPartial)
		.then(file => t.equal(file.messages.length, 1)),
	'should resolve with message if `fatal` is false.');

	t.resolves(rehype()
		.use(partials, {messages: false})
		.process(withPartial)
		.then(file => t.equal(file.messages.length, 0)),
	'should resolve with no messages if `messages` is false.');

	t.resolves(rehype()
		.use(partials, {handle: (_, f) => f(new Error('failed'))})
		.process(withPartial)
		.then(file => t.equal(file.messages.length, 1)),
	'should resolve with message with custom `handle`.');

	t.resolves(rehype()
		.use(partials)
		.data('settings', {
			fatal: true,
			handle: (_, f) => f(new Error('rejects'))
		})
		.process(withPartial)
		.then(
			t.fail,
			t.pass
		),
	'should reject with custom `handle` when `fatal` is true.');

	t.rejects(rehype()
		.use(partials, {fatal: true})
		.process(withPartial),
	'should reject when fatal is `true`.');

	fixtures.forEach(fixture => {
		const path = join(base, fixture);
		const start = readFileSync(join(path, 'start.html'));
		const expected = readFileSync(join(path, 'expected.html'));
		let settings = {};

		try {
			settings = JSON.parse(
				readFileSync(join(path, 'settings.json'))
			);
		} catch (error) {}

		settings.cwd = path;

		t.test(fixture, t => {
			t.plan(2);

			rehype()
				.data('settings', settings)
				.use(partials)
				.use(format)
				.process(start, (error, file) => {
					t.error(error);
					t.equal(
						String(file),
						String(expected),
						'should be equal.'
					);
				});
		});
	});
});
