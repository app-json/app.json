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

## Class Methods

### App.new(payload)

Instantiate with a JSON filename:

```js
var app = App.new(__dirname + "/path/to/app.json")
```

Instantiate with a JSON string:

```js
var json = "{name: \"small-sharp-tool\", description: \"This app does one little thing, and does it well.\"}"
var app = App.new(json)
```

Instantiate with a JavaScript object:

```js
var app = App.new({
  name: "small-sharp-tool",
  description: "This app does one little thing, and does it well."
})
```

### App.fetch(url, callback)

You can fetch app manifests straight from GitHub. The
[github-raw-cors-proxy](https://github.com/zeke/github-raw-cors-proxy) service is used
to make the `app.json` file downloadable from browsers.

`url` can be a fully qualified GitHub URL, or a shorthand `user/repo` string:

```js
App.fetch('zeke/harp-slideshow-template', function(err, manifest) {
  console.log(err, manifest)
})
```

### App.example

Generates an example manifest from example content in the [schema](/schema.js).

```js
App.example
```

## Instance Methods

### app.valid

A getter method that validates the app manifest and returns `true` or `false`

### app.errors

Returns `null` if app manifest is valid.

Returns an array of error objects if invalid:

```js
[
  {property: "name", message: "is required"},
  {property: "website", message: "is not a valid url"}
]
```

### app.toJSON()

Return a pretty JSON string representation of the manifest, without any superfluous properties.

### app.getAddonsPrices(callback)

Make a web request to [concoction](https://github.com/zeke/concoction) for a
list of addon prices.

## Tests

```
npm install
npm test
```

## Bundle

To prepare a browser-ready bundle, run the following:

```sh
npm run build

# Wrote dist/app.js
# Wrote dist/app.min.js
```

## Docs

Genarate human-friendly docs from the schema

```sh
npm run docs

# Wrote dist/schema.md
# Wrote dist/schema.html
```

## License

MIT
