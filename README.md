# Heroku App Manifest

A validator of Heroku app.json manifests, designed to work in node.js and the browser.

## Schema

The app.json schema is defined using the [JSON Schema](http://json-schema.org/)
specification and is validated with the awesome
[revalidator](https://github.com/flatiron/revalidator#readme) node module.

See the schema at [schema.js](/schema.js).

## Usage

### With Node.js or Browserify

Download the module from npm:

```sh
npm install app-manifest --save
```

Require it in your script:

```js
var Manifest = require("app-manifest")
```

### In Browser (without Browserify)

If browserify isn't your thing, use the pre-compiled browser-ready bundle in
`dist/app-manifest.js`. Include this file in your html page and it will create
`window.Manifest` for you.

## API

### new Manifest(payload)

Instantiate with a JSON filename:

```js
var manifest = new Manifest(__dirname + "/path/to/app.json")
```

Instantiate with a JSON string:

```js
var rawJSON = "{name: \"small-sharp-tool\", description: \"This app does one little thing, and does it well.\"}"
var manifest = new Manifest(rawJSON)
```

Instantiate with a JavaScript object:

```js
var manifest = new Manifest({
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

Once you've instantiated a manifest, you can validate it:

#### .valid

Validates the manifest and returns `true` or `false`

#### .errors

Returns `null` if manifest is valid.

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

## Manifest.fetch(url, callback)

You can fetch manifests straight from GitHub. The
[github-raw-cors-proxy](https://github.com/zeke/github-raw-cors-proxy) service is used
to make the `app.json` file downloadable from browsers.

```js
var Manifest = require("app-manifest")
Manifest.fetch('zeke/harp-slideshow-template', function(err, manifest) {
  console.log(err, manifest)
})
```

## Tests

```
npm install
npm test
```

## Building

To prepare a browser-ready bundle in `dist/app-manifest.js`, run the following:

```
npm run build
```

## License

MIT
