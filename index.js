var visit = require('unist-util-visit')
var join = require('path').join
var fs = require('fs')

module.exports = partials

function partials (options) {
  options = options || {}
  var attachers
  var settings
  var fragment
  var parser
  var parse
  var self

  self = this
  attachers = self.attachers
  parser = locate(attachers, 'parse')
  settings = parser[1] || {}
  parse = parser[0]
  fragment = settings.fragment || false

  return transformer

  function transformer (tree, file) {
    visit (tree, 'text', function (node, index, parent) {
      var children
      var content
      var matches
      var offset
      var child
      var paths
      var value
      var path
      var base
      var test
      var i

      value = node.value
      children = parent.children
      test = /\{\{\s+?(.*?)\}\}/
      matches = value.match(RegExp(test, 'g'))

      if (!matches) {
        return
      }

      paths = format(matches, test, file.cwd)

      if (!paths || !paths.length) {
        return
      }

      offset = index
      i = -1

      while (++i < paths.length) {
        path = paths[i][1]
        base = paths[i][0]
        file.history.push(base)

        if (!fragment) {
          settings.fragment = true
          parse.call(self, settings)
        }

        content = fs.readFileSync(path, 'utf-8')
        child = self.Parser(content, file)
        children.splice.apply(children, [offset, 0].concat(child.children))
        offset += child.children.length
        file.history.pop()
      }

      settings.fragment = fragment
      parse.call(self, settings)
      children.splice(offset, 1)
    })
  }
}

function locate (attachers, value) {
  var attacher
  var name
  var i
  var j

  i = -1

  while (++i < attachers.length) {
    attacher = attachers[i]
    j = -1

    while (++j < attacher.length) {
      name = funcName(attacher[j])

      if (name && name === value) {
        return attacher
      }
    }
  }

  return
}

function funcName (func) {
  var match
  var type
  var test

  type = typeof func === 'function'
  test = /function ([^\(]+)/

  if (type) {
    match = test.exec(func.toString())

    if (match) {
      return match[1].trim()
    }
  }

  return
}

function format (matches, test, cwd) {
  var fullPath
  var paths
  var match
  var i

  paths = []
  i = -1

  while (++i < matches.length) {
    if (matches[i]) {
      match = matches[i].match(test)

      if (match) {
        path = match[1].trim()

        if (path.indexOf('partial') === 0) {
          path = path.replace('partial', '').trim()
          fullPath = join(cwd, path)
          paths.push([path, fullPath])
        }
      }
    }
  }

  return paths.length ? paths : null
}
