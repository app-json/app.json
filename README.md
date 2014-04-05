# Heroku App Manifest

A validator of Heroku app.json manifests, designed to work in node.js and the browser.

## Installation

```sh
npm install app-manifest --save
```

## API

Start by requiring the module:

```js
var Manifest = require("app-manifest")
```

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

## Tests

```
npm install
npm test
```

## License

MIT
