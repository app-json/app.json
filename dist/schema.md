`app.json` is a manifest format for describing web apps. It declares environment
variables, addons, and other information required to run apps on Heroku. This document describes the schema in detail.

## Example app.json

```json
{
  "name": "Small Sharp Tool",
  "description": "This app does one little thing, and does it well.",
  "keywords": [
    "productivity",
    "HTML5",
    "scalpel"
  ],
  "website": "https://small-sharp-tool.com/",
  "repository": "https://github.com/jane-doe/small-sharp-tool",
  "logo": "https://small-sharp-tool.com/logo.svg",
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

A clean and simple name to identify the template. *optional string*

```json
{
  "name": "Small Sharp Tool"
}
```
### description

A brief summary of the app: what it does, who it&#39;s for, why it exists, etc. *optional string*

```json
{
  "description": "This app does one little thing, and does it well."
}
```
### keywords

An array of strings describing the app. *optional array*

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

The project&#39;s website. *optional string*

```json
{
  "website": "https://small-sharp-tool.com/"
}
```
### repository

The location of the application&#39;s source code. Can be a Git URL, a GitHub URL, or a tarball URL. *optional string*

```json
{
  "repository": "https://github.com/jane-doe/small-sharp-tool"
}
```
### logo

The URL of the application&#39;s logo image. Dimensions should be square. Format can be SVG, PNG, or JPG. *optional string*

```json
{
  "logo": "https://small-sharp-tool.com/logo.svg"
}
```
### scripts

A key-value object specifying scripts or shell commands to execute at different stages in the build/release process. Currently, `postdeploy` is the only supported script. *optional object*

```json
{
  "scripts": {
    "postdeploy": "bundle exec rake bootstrap"
  }
}
```
### env

A key-value object for environment variables, or config vars in Heroku parlance. Keys are the names of the environment variables.

Values can be strings or objects. If the value is a string, it will be used and the user will not be prompted to specify a different value. If the value is an object, it defines specific requirements for that variable:

description - a human-friendly blurb about what the value is for and how to determine what it should be
value - a default value to use
generator - a string representing a function to call to generate the value, such as cookie secret *optional object*

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

An array of strings specifying Heroku addons to provision on the app before deploying. Each addon should be in the format `addon:plan` or `addon`. If plan is omitted, that addon&#39;s default plan will be provisioned. *optional array*

```json
{
  "addons": [
    "openredis",
    "mongolab:shared-single-small"
  ]
}
```
