`app.json` is a manifest format for describing web apps. It declares environment
variables, addons, and other information required to run apps on Heroku. This document describes the schema in detail.

## Example app.json

```json
{
  "name": "small-sharp-tool",
  "description": "This app does one little thing, and does it well.",
  "keywords": [
    "productivity",
    "HTML5",
    "scalpel"
  ],
  "website": "https://jane-doe.github.io/small-sharp-tool",
  "repository": "https://github.com/jane-doe/small-sharp-tool",
  "logo": "https://jane-doe.github.io/small-sharp-tool/logo.svg",
  "success_url": "/welcome",
  "scripts": {
    "postdeploy": "bundle exec rake bootstrap"
  },
  "env": {
    "BUILDPACK_URL": "https://github.com/stomita/heroku-buildpack-phantomjs",
    "SECRET_TOKEN": {
      "description": "A secret key for verifying the integrity of signed cookies.",
      "generator": "secret"
    },
    "WEB_CONCURRENCY": {
      "description": "The number of processes to run.",
      "default": "5"
    }
  },
  "addons": [
    "openredis",
    "mongolab:shared-single-small"
  ]
}
```

## The Schema

### name

string, required

A URL-friendly string that uniquely identifies the template app.

```json
{
  "name": "small-sharp-tool"
}
```
### description

string, optional

A brief summary of the app: what it does, who it&#39;s for, why it exists, etc.

```json
{
  "description": "This app does one little thing, and does it well."
}
```
### keywords

array, optional

An array of strings describing the app.

```json
{
  "keywords": [
    "productivity",
    "HTML5",
    "scalpel"
  ]
}
```
### website

string, optional

The project&#39;s website, if there is one.

```json
{
  "website": "https://jane-doe.github.io/small-sharp-tool"
}
```
### repository

string, optional

The location of the application&#39;s source code. Can be a git URL, a GitHub URL, or a tarball URL.

```json
{
  "repository": "https://github.com/jane-doe/small-sharp-tool"
}
```
### logo

string, optional

The URL of the application&#39;s logo image. It&#39;s dimensions should be square. Format can be SVG or PNG.

```json
{
  "logo": "https://jane-doe.github.io/small-sharp-tool/logo.svg"
}
```
### success_url

string, optional

A URL specifying where to redirect the user once their new app is deployed. If value is a fully-qualified URL, the user should be redirected to that URL. If value is begins with a slash `/`, the user should be redirected to that path in their newly deployed app.

```json
{
  "success_url": "/welcome"
}
```
### scripts

object, optional

A key-value object specifying scripts or shell commands to execute at different stages in the build/release process.

```json
{
  "scripts": {
    "postdeploy": "bundle exec rake bootstrap"
  }
}
```
### env

object, optional

A key-value object for environment variables, or config vars in Heroku parlance. Keys are the names of the environment variables.

Values can be strings or objects. If the value is a string, it will be used and the user will not be prompted to specify a different value. If the value is an object, it defines specific requirements for that variable:

description - a human-friendly blurb about what the value is for and how to determine what it should be
default - a default value to use if no override value is provided
generator - a string representing a function to call to generate the value, such as cookie secret
required - a boolean. Default is false.

```json
{
  "env": {
    "BUILDPACK_URL": "https://github.com/stomita/heroku-buildpack-phantomjs",
    "SECRET_TOKEN": {
      "description": "A secret key for verifying the integrity of signed cookies.",
      "generator": "secret"
    },
    "WEB_CONCURRENCY": {
      "description": "The number of processes to run.",
      "default": "5"
    }
  }
}
```
### addons

array, optional

An array of strings specifying Heroku addons to provision on the app before deploying. Each addon should be in the format `addon:plan`. If plan is omitted, that addon&#39;s default plan will be provisioned.

```json
{
  "addons": [
    "openredis",
    "mongolab:shared-single-small"
  ]
}
```
