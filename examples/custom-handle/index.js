const {readFile, readFileSync} = require('fs')
const {extname} = require('path')
const unified = require('unified')
const parse = require('rehype-parse')
const stringify = require('rehype-stringify')
const format = require('rehype-format')
const report = require('vfile-reporter')
const handle = require('./lib/handle')
const partials = require('../../')

const settings = {
	cwd: 'lib',
	handle
}

unified()
.use(parse)
.use(stringify)
.use(partials)
.use(format)
.use(partials, settings)
.process(readFileSync('lib/start.html'), (error, file) => {
	console.error(report(error || file))
	console.log(String(file))
})
