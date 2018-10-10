const unified = require('unified')
const parser = require('rehype-parse')
const format = require('rehype-format')
const stringify = require('rehype-stringify')
const vfile = require('to-vfile')
const { join } = require('path')
const { test } = require('tap')
const fs = require('fs')
const partials = require('../')

const readdir = fs.readdirSync
const read = fs.readFileSync

test('Partials()', t => {
  t.doesNotThrow(() => {
    return unified()
      .use(parser)
      .use(stringify)
      .use(partials)
      .freeze()
  }, 'Should not throw with no options')

  t.doesNotThrow(() => {
    return unified()
      .use(parser)
      .use(stringify)
      .use(partials, { max: 10 })
      .freeze()
  }, 'Should not throw with options')
  t.end()
})

test('Fixtures:', async t => {
  let fixtures
  let base
  let i

  base = join(__dirname, 'fixtures')
  fixtures = readdir(base)
  i = -1

  while (++i < fixtures.length) {
    let settings
    let fixture
    let wanted
    let found
    let start
    let files
    let path
    let end

    fixture = fixtures[i]
    settings = {}

    path = join('./fixtures', fixture)
    start = await vfile.read(join(path, 'start.html'))
    end = await vfile.read(join(path, 'end.html'))
    files = readdir(path)

    if (files.indexOf('settings.json') > -1) {
      settings = read(join(path, 'settings.json'))
      settings = JSON.parse(settings)
    }

    ({found, wanted} = await run(start, end, settings))
    t.equal(found.toString(), wanted.toString(), fixture)
  }
  t.end()
})

async function run (start, end, settings) {
  const found = await unified()
    .use(parser)
    .use(stringify)
    .use(partials, settings)
    .use(format)
    .process(start)

  const wanted = await unified()
    .use(parser)
    .use(stringify)
    .use(format)
    .process(end)

  return { found, wanted }
}
