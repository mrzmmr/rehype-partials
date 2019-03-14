const {join, dirname} = require('path');
const parse = require('rehype-parse');
const unified = require('unified');

const {assign} = Object;

module.exports = partials;

function partials(options = {}) {
	let handle;
	let tree;
	let file;

	const settings = assign(
		{},
		this.data('settings'),
		options,
		{fragment: true}
	);

	if (settings.max || settings.max === 0) {
		settings.max -= 2;
	} else {
		settings.max = -1;
	}

	try {
		handle = settings.handle || require('fs').readFile;
	} catch (error) {}

	return (_tree, _file, next) => {
		tree = _tree;
		file = _file;

		visit(tree, next, visitor);
	};

	function visitor(node, index, parent, done) {
		if (node.type !== 'comment') {
			return true;
		}

		const match = node.value.match(
			/^include\s*href=['"](.*?)['"]\s*$/
		);

		if (!match) {
			return true;
		}

		let filename;

		/* istanbul ignore next ; hard to test */
		try {
			({parent: {filename} = {}} = module);
		} catch (error) {
			filename = '';
		}

		const path = settings.cwd ?
			join(settings.cwd, match[1]) :
			join(dirname(filename), match[1]);

		handle(path, (error, data) => {
			if (error) {
				done(error);
			}

			const processor = unified()
				.use(parse, settings);

			const subfile = {
				path,
				messages: [],
				contents: trim(String(data))
			};

			const subtree = processor()
				.parse(subfile);

			const {children} = parent;

			processor().run(subtree, subfile, (error, child, childFile) => {
				/* istanbul ignore next ; hard to test */
				if (error) {
					done(error);
				}

				if (settings.messages) {
					file.messages = file.messages.concat(childFile.messages);
				}

				children.splice(...[index, 1].concat(child.children));

				done(error, tree, file);
			});
		});
	}

	function visit(tree, next, visitor) {
		let count = settings.max;
		let left = 0;

		one(tree);

		function done(error, node, file) {
			if (node && count >= 0) {
				all(node);

				count -= 1;
			}

			left -= 1;

			if (error || left === 0) {
				next(error, node, file);
			}
		}

		function one(node, index, parent) {
			left += 1;

			if (node.children) {
				all(node);
			}

			const result = visitor(node, index, parent, done);

			if (result) {
				done();
			}
		}

		function all(node) {
			node.children.forEach((child, index) => (
				one(child, index, node)
			));
		}
	}

	function trim(string) {
		return string.replace(/\n*/, '').trim();
	}
}
