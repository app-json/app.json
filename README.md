# app.json

`app.json` is a manifest format for describing web apps. It's a file in the root
directory of an app that describes the app's build requirements, environment variables, addons,
and other information.

This repository contains the source for an npm module called
[app.json](https://www.npmjs.org/package/app.json), which has many facets:

- A JavaScript interface for creating, validating, and consuming app.json manifests.
- A module that is designed to work in browsers and Node.js.
- A CLI for creating manifests and producing schema documentation.

## Installation and Usage

### Programmatic usage with Node.js or Browserify

Download the module from npm and save it to your package.json:

```sh
npm install app.json --save
```

Require it in your script:

```js
var App = require("app.json")
```

### Usage in the Browser (without Browserify)

If browserify isn't your thing, use the pre-compiled browser-ready bundle in
[dist/app.js](/dist/app.js). Include this file in your html page and it will create
`window.App` for you.

### Usage on the Command Line

To use this module on the command line, you'll need to install it globally using npm:

```sh
npm install app.json --global
```

Now you can run `app` or `app.json` from any directory:

```sh
$ app

  Usage: app [options] [command]

  Commands:

    schema [options]       Write the app.json schema to STDOUT

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Use 'app <command> --help' to get more information about a specific command.
```

## Schema

The app.json schema is defined using the [JSON Schema](http://json-schema.org/)
specification and is validated with the
[revalidator](https://github.com/flatiron/revalidator#readme) node module. View
the [raw schema](/lib/schema.js) or the auto-generated [app.json
Schema Documentation](https://devcenter.heroku.com/articles/app-json-schema?preview=1) on Heroku Dev Center.

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

### app.getAddonPrices(callback)

Fetch pricing data about the app's required addons by hitting the Heroku Platform API.

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
