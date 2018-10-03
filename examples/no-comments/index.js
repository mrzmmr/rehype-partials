var rehype = require('rehype')
var vfile = require('to-vfile')
var format = require('rehype-format')
var reporter = require('vfile-reporter')
var partials = require('../../')

rehype()
  .use(partials)
  .use(format)
  .data('settings', {emitParseErrors: true})
  .process(vfile.readSync('index.html'), (err, file) => {
    console.error(reporter(err || file))
    console.log(String(file))
  })
