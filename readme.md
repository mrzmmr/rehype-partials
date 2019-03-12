# rehype-partials

[![Coverage Status](https://coveralls.io/repos/github/mrzmmr/rehype-partials/badge.svg?branch=master)](https://coveralls.io/github/mrzmmr/rehype-partials?branch=master)

Partials support for rehype.

**WIP:** This is very much a work in progress

### Example

With the following html,

##### index.html

```html
<div class='container'>
  <!--include href='./hello.html' -->
</div>
```

##### ./partials/hello.html

```html
<div class='hello'>
  <!--include href='./world.html' -->
</div>
```

##### ./partials/world.html

```html
<div class='world'>
  <p>world</p>
</div>
```

and the following js,

##### index.js

```js
var reporter = require('vfile-reporter')
var format = require('rehype-format')
var vfile = require('to-vfile')
var rehype = require('rehype')
var partials = require('rehype-partials')

rehype()
  .use(partials)
  .use(format)
  .process(toVfile.readSync('./index.html'), function (err, file) {
    console.error(reporter(err || file))
    console.log(String(file))
  })
```

will output:

```
./index.html: no issues found
```

```html
<html>
  <head></head>
  <body>
    <div class="container">
      <div class="hello">
        <div class="world">
          <p>world</p>
        </div>
      </div>
    </div>
  </body>
</html>
```

## License

MIT © Paul Zimmer

