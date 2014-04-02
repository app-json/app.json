# Heroku App Manifest

A validator of Heroku app.json manifests.

## Installation

```sh
npm install app-manifest --save
```

## Usage

```js
manifest = new Manifest({
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

manifest.isValid()
// true

manifest.payload.name = null
manifest.payload.urls.website = "derp.org"
manifest.isValid()
// false

manifest.errors
// [
//   {property: "name", message: "name is required"},
//   {property: "urls.source", message: "urls.source is not a valid URL"}
// ]
```
