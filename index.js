const path = require('path');
const unified = require('unified');
const parse = require('rehype-parse');

module.exports = partials;

function partials(options = {}) {
	let pathsList = [];
	let left = 0;
	let tree;
	let file;
	let next;

	const defaultOptions = {
		max: 1,
		cwd: '',
		handle: null,
		messages: true,
		noresolve: false
	};

	const data = this.data('settings') || {};

	const settings = Object.assign(
		defaultOptions,
		data,
		options,
		{fragment: true}
	);

	const processor = unified().use(parse, settings);

	return transformer;

	function transformer(_tree, _file, _next) {
		tree = _tree;
		file = _file;
		next = _next;

		/* istanbul ignore next */
		try {
			const {handle} = settings;
			settings.handle = handle || require('fs').readFile;
		} catch (error) {
			return next(error);
		}

		return each(tree);
	}

	function each(node, parent, dirname = '') {
		left += 1;

		return handle(node, parent, dirname, () => {
			if (!node.children) {
				return done();
			}

			for (const child of node.children) {
				each(child, node, dirname);
			}

			return done();
		});
	}

	function done() {
		left -= 1;

		if (left < 1) {
			return next(null, tree, file);
		}
	}

	function handle(node, parent, dirname, callback) {
		if (node.type !== 'comment') {
			return callback();
		}

		const current = handlePath(node, dirname);

		if (!current) {
			return callback();
		}

		return settings.handle(current, (error, data) => {
			if (error) {
				return handleError(error, node, callback);
			}

			const subtree = handlePartial(current, data);
			const index = parent.children.indexOf(node);

			parent.children.splice(
				...[index, 1].concat(subtree.children)
			);

			each(subtree, node, path.dirname(current));

			return callback();
		});
	}

	function handleError(error, node, callback) {
		if (settings.fatal) {
			return next(error);
		}

		if (settings.messages) {
			file.message(
				error.message,
				node.position,
				'partials:' + error.code
			);
		}

		return callback();
	}

	function handlePartial(path, data) {
		const subfile = {
			path,
			messages: [],
			contents: String(data).trim()
		};

		const subtree = processor()
			.parse(subfile);

		if (settings.messages) {
			file.messages = file.messages.concat(subfile.messages);
		}

		return subtree;
	}

	function handlePath(node, dirname) {
		const match = node.value.match(
			/^\s*href=['"](.*)['"]\s*$/
		);

		if (!match) {
			return;
		}

		let current;

		if (settings.noresolve) {
			current = match[1];
		} else {
			current = path.resolve(
				settings.cwd,
				dirname,
				match[1]
			);
		}

		pathsList.push(current);

		if (occurs(current, pathsList) > settings.max) {
			pathsList = [];
			return;
		}

		return current;
	}

	function occurs(path, pathsList) {
		return pathsList.filter(item => item === path).length;
	}
}
