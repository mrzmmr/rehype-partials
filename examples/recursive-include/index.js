var unified = require('unified')
var parser = require('rehype-parse')
var stringify = require('rehype-stringify')
var format = require('rehype-format')
var vfile = require('to-vfile')
var partials = require('../../')

var reporter = require('vfile-reporter')
var format = require('rehype-format')
var vfile = require('to-vfile')
var rehype = require('rehype')
var partials = require('../../')

rehype()
    .use(partials, {max: 2})
    .use(format)
    .process(vfile.readSync('./index.html'), (err, file) => {
        console.error(reporter(err || file))
        console.log(String(file))
    })

