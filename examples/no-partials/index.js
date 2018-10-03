var reporter = require('vfile-reporter')
var format = require('rehype-format')
var vfile = require('to-vfile')
var rehype = require('rehype')
var partials = require('../../')

rehype()
  .use(partials)
  .use(format)
  .process(vfile.readSync('./index.html'), (err, file) => {
    console.error(reporter(err || file))
    console.log(String(file))
  })
