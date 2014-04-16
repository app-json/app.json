# apps

[apps](https://www.npmjs.org/package/apps) is a node module for creating and validating Heroku app.json files. It works in node.js and the browser.

## Schema

The app.json schema is defined using the [JSON Schema](http://json-schema.org/)
specification and is validated with the awesome
[revalidator](https://github.com/flatiron/revalidator#readme) node module.

See the schema at [schema.js](/schema.js).

## Usage

### With Node.js or Browserify

Download the module from npm:

```sh
npm install apps --save
```

Require it in your script:

```js
var App = require("apps")
```

### In Browser (without Browserify)

If browserify isn't your thing, use the pre-compiled browser-ready bundle in
[dist/app.js](/dist/app.js). Include this file in your html page and it will create
`window.App` for you.

## API

### new App(payload)

Instantiate with a JSON filename:

```js
var app = new App(__dirname + "/path/to/app.json")
```

Instantiate with a JSON string:

```js
var json = "{name: \"small-sharp-tool\", description: \"This app does one little thing, and does it well.\"}"
var app = new App(json)
```

Instantiate with a JavaScript object:

```js
var app = new App({
  name: "small-sharp-tool",
  description: "This app does one little thing, and does it well.",
  keywords: ["productivity", "HTML5", "scalpel"],
  urls: {
    website: "https://small-sharp-tool.github.io",
    success: "/getting-started"
  },
  env: {
    BUILDPACK_URL: "https://github.com/stomita/heroku-buildpack-phantomjs",
  },
  addons: [
    "openredis",
    "mongolab:shared-single-small"
  ]
})
```

### Validation

Once you've instantiated an app, you can validate it:

#### .valid

Validates the app manifest and returns `true` or `false`

#### .errors

Returns `null` if app manifest is valid.

Returns an array of error objects if invalid:

```js
[
  {property: "name", message: "is required"},
  {property: "website", message: "is not a valid url"}
]
```

#### .validate()

Return an object with `valid` and `errors`, per the [revalidator
module](https://github.com/flatiron/revalidator#revalidatorvalidate-obj-schema-options)'s
validation function.

### .toJSON()

Return a pretty JSON string representation of the manifest, without any superfluous properties.

### .getAddonsPrices(callback)

Make a web request to [concoction](https://github.com/zeke/concoction) for a
list of addon prices.

## App.fetch(url, callback)

You can fetch app manifests straight from GitHub. The
[github-raw-cors-proxy](https://github.com/zeke/github-raw-cors-proxy) service is used
to make the `app.json` file downloadable from browsers.

```js
var App = require("apps")
App.fetch('zeke/harp-slideshow-template', function(err, manifest) {
  console.log(err, manifest)
})
```

## App.example

Generates an example manifest from example content in the [schema](/schema.js).

```js
App.example
```

## Tests

```
npm install
npm test
```

```
App
  instantiation
    ✓ accepts a filename
    ✓ accepts a JSON string
    ✓ accepts a JavaScript object
  validation
    ✓ returns null for .errors if app is valid
    ✓ requires name
    ✓ does not allow empty-string name
    ✓ validates website url
    ✓ validates repository url
    ✓ validates logo url
  .toJSON()
    ✓ render pretty JSON
    ✓ ignores properties that are not part of the schema
  .getAddonsPrices()
    ✓ fetches a remote list of addons and their total Price (526ms)
  App.fetch()
    ✓ downloads remote manifests with github shorthand (271ms)
    ✓ downloads remote manifests with fully-qualified github URLs (201ms)
  App.example
    ✓ builds an example manifest from properties found in the schema
    ✓ is valid
    ✓ has expected properties
```

## Building

To prepare a browser-ready bundle in `dist/apps.js`, run the following:

```
npm run build
```

## License

MIT
