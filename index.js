var parser = require('rehype-parse')
var unified = require('unified')

module.exports = partials

function partials (options) {
  var settings
  var handle

  options = options || {}
  settings = this.data('settings')
  settings = Object.assign({}, settings, options, {fragment: true})

  try {
    handle = settings.handler || require('fs').readFile
  } catch (err) {}

  return transformer

  function transformer (tree, file, next) {
    visit(tree, visitor, next)

    function visit (node, visitor) {
      var left = 0

      function done (err, node, file) {
        if (node) {
          all(node)
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
      var match
      var test

      if (node.type !== 'comment') {
        return true
      }

      test = /^include\s*href=['"](.*?)['"]\s*$/
      match = test.exec(node.value)

      if (!match) {
        return true
      }

      handle(match[1], handler)

      function handler (err, data) {
        var processor
        var children
        var subfile
        var subtree

        if (err) {
          done(err)
        }

        subfile = {
          messages: [],
          contents: trim(String(data)),
          history: [match[1]]
        }

        processor = unified().use(parser, settings)
        subtree = processor().parse(subfile)
        children = parent.children

        processor().run(subtree, subfile, function (err, child, childfile) {
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

