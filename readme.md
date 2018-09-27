# rehype-partials

Partials support for rehype.

**WIP:** This is very much a work in progress

### Example

With the following html,

##### index.html

```html
<div>
  {{ partial ./partials/hello.html }}
  {{ partial ./partials/world.html }}
</div>
```

##### ./partials/hello.html

```html
<header>
  <h1 class='foo'>Hello</h1>
</header>
```

##### ./partials/world.html

```html
<main>
  <h2 class='bar'>World!</h2>
</main>
```

and the following js,

##### index.js

```js
var unified = require('unified')
var parse = require('rehype-parse')
var format = require('rehype-format')
var document = require('rehype-document')
var stringify = require('rehype-stringify')
var reporter = require('vfile-reporter')
var toVfile = require('to-vfile')
var partials = require('../')

unified()
  .use(parse, { fragment: true })
  .use(stringify)
  .use(partials)
  .use(document, { title: 'Example' })
  .use(format)
  .process(toVfile.readSync('./index.html'), function (err, file) {
    console.error(reporter(err || file))
    console.log(String(file))
  })
```

will output:

```
./index.html: no issues found
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <div>
      <header>
        <h1 class="foo">Hello</h1>
      </header>
      <main>
        <h2>World</h2>
      </main>
    </div>
  </body>
</html>
```

## License

MIT © Paul Zimmer
