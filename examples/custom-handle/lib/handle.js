const {readFile} = require('fs')
const {extname} = require('path')
const unified = require('unified')
const remark = require('remark-parse')
const stringify = require('rehype-stringify')
const html = require('remark-rehype')

module.exports = handle

function handle (path, callback) {
	return readFile(path, (error, data) => {
		if (error) {
			return callback(error)
		}

		if (extname(path) !== '.md') {
			return callback(null, data)
		}

		return unified()
			.use(remark)
			.use(html)
			.use(stringify)
			.process(data, (error, file) => {
				if (error) {
					return callback(error)
				}

				return callback(null, String(file))
			})
	})
}
