var unified = require('unified')
var parser = require('rehype-parse')
var stringify = require('rehype-stringify')
var format = require('rehype-format')
var vfile = require('to-vfile')
var partials = require('../../')

unified()
  .use(parser)
  .use(stringify)
  .use(partials, { max: 2 })
  .use(format)
  .process(vfile.readSync('./index.html'), (err, file) => {
    if (err) {
      throw err
    }

    console.log(String(file))
  })
