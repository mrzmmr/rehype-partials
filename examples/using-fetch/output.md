```raw
    1:1-1:1  warning  Missing doctype before other content  missing-doctype      parse-error
  1:17-1:17  warning  Unexpected duplicate attribute        duplicate-attribute  parse-error

⚠ 2 warnings
```

```html

<html>
  <head></head>
  <body>
    <div class="container">
      <div id="foo">
        <p>hello</p>
      </div>
    </div>
  </body>
</html>

```
