var parser = require('rehype-parse')
var unified = require('unified')
var { join } = require('path')

module.exports = partials

function partials (options) {
  var settings
  var handle
  var max

  options = options || {}
  settings = this.data('settings')
  settings = Object.assign({}, settings, options, {fragment: true})
  max = options.max

  if (max || max === 0) {
    max = max - 2
  } else {
    max = -1
  }

  try {
    handle = settings.handler || require('fs').readFile
  } catch (err) {}

  return transformer

  function transformer (tree, file, next) {
    visit(tree, visitor, next)

    function visit (node, visitor) {
      var count = max
      var left = 0

      function done (err, node, file) {
        if (node && count >= 0) {
          all(node)
          count = count - 1
        }

        left = left - 1

        if (err || left < 1) {
          next(err, node, file)
        }
      }

      function one (node, index, parent) {
        var result

        left = left + 1

        if (node.children) {
          all(node)
        }

        result = visitor(node, index, parent, done)

        if (result) {
          done()
        }
      }

      function all (node) {
        for (var i = node.children.length - 1; i > -1; i--) {
          one(node.children[i], i, node)
        }
      }

      all(node)
    }

    function visitor (node, index, parent, done) {
      var dirname
      var match
      var test
      var path
      var cwd

      if (node.type !== 'comment') {
        return true
      }

      test = /^include\s*href=['"](.*?)['"]\s*$/
      match = test.exec(node.value)

      if (!match) {
        return true
      }

      cwd = file.cwd || ''
      dirname = file.dirname || ''
      path = join(cwd, dirname, match[1])

      handle(path, handler)

      function handler (err, data) {
        var processor
        var children
        var subfile
        var subtree

        /* istanbul ignore next ; hard to test */
        if (err) {
          done(err)
        }

        subfile = {
          path: path,
          messages: [],
          contents: trim(String(data)),
        }

        processor = unified().use(parser, settings)
        subtree = processor().parse(subfile)
        children = parent.children

        processor().run(subtree, subfile, function (err, child, childfile) {
          /* istanbul ignore next ; hard to test */
          if (err) {
            done(err)
          }

          if (settings.messages) {
            file.messages = file.messages.concat(childfile.messages)
          }

          children.splice.apply(children, [index, 1].concat(child.children))
          done(err, tree, file)
        })
      }
    }
  }

  function trim (string) {
    return string.replace(/\n*/, '').trim()
  }
}

