# i18n-loader

An "i18n loader" for WebPack that uses [i18next]() and [React]().

## Usage: the `t()` function

``` javascript
// get an i18n-scope bound function:
var t = require("i18n!dashboard");

// using t() will now prefix all keys with the "ns_dashboard." scope.
// => ns_dashboard.header
t('header', { defaultValue: 'Dashboard' });
```

Scopes are prefixed by `ns_` which isn't currently configurable.

### HTML using `t.htmlSafe()`

Use the `t.htmlSafe()` helper for rendering strings that contain (valid and sanitized) HTML markup inside a React component:

```javascript
t.htmlSafe('header', { defaultValue: "<strong>Dashboard</strong>" });
```

Will generate something like this:

```
React.DOM.span({
  dangerouslySetInnerHtml: {
    __html: "<strong>Dashboard</strong>"
  }
});
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)