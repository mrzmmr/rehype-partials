# rehype-partials

[![Build Status](https://travis-ci.org/mrzmmr/rehype-partials.svg?branch=master)](https://travis-ci.org/mrzmmr/rehype-partials)
[![Coverage Status](https://coveralls.io/repos/github/mrzmmr/rehype-partials/badge.svg?branch=master)](https://coveralls.io/github/mrzmmr/rehype-partials?branch=master)

Partials support for [rehype].

## Usage

With the following html,

##### index.html

```html
<div class='container'>
  <!-- href='include/hello.html' -->
</div>
```

##### ./include/hello.html

```html
<div class='hello'>
  <!-- href='world.html' -->
</div>
```

##### ./include/world.html

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

## Options

### `options.handle`

*Type: `function`*

*Default: `fs.readFile`*

Function used to get a partial. [example][handle-example]


### `options.cwd`

*Type: `String`*

*Default: `''`*

Set the current working directory to resolve a partial's path.


### `options.noresolve`

*Type: `Boolean`*

*Default: `false`*

Whether or not to use `path.resolve` when looking for a partial.


### `options.messages`

*Type: `Boolean`*

*Default: `true`*

Whether to include messages generated when parsing a partial.


## License

[MIT][license] © Paul Zimmer

[rehype]: https://github.com/rehypejs/rehype
[handle-example]: https://github.com/mrzmmr/rehype-partials/tree/master/examples/custom-handle
[license]: https://github.com/mrzmmr/rehype-partials/blob/master/license
