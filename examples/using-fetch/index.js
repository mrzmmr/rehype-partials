var callbackify = require('util').callbackify
var fetch = require('isomorphic-unfetch')
var reporter = require('vfile-reporter')
var format = require('rehype-format')
var vfile = require('to-vfile')
var rehype = require('rehype')

var partials = require('../../')

function get (path, callback) {
  return (async (path) => {
    try {
      const res = await (await fetch(path)).text()
      callback(null, res)
    } catch (err) {
      callback(err)
    }
  })(path)
}

rehype()
  .data('settings', {emitParseErrors: true})
  .use(partials, {handler: get, messages: true})
  .use(format)
  .process(vfile.readSync('./index.html'), function (err, file) {
    console.error(reporter(err || file))
    console.log(String(file))
  })
