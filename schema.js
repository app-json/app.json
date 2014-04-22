var schema = {
  "properties": {
    "name": {
      "description": "A URL-friendly string that uniquely identifies the template app",
      "type": "string",
      "required": true,
      "allowEmpty": false,
      "example": "small-sharp-tool"
    },
    "description": {
      "description": "A brief summary of the app: what it does, who it's for, why it exists, etc.",
      "type": "string",
      "example": "This app does one little thing, and does it well."
    },
    "keywords": {
      "description": "An array of strings, to avoid space-vs-comma ambiguity.",
      "type": "array",
      "example": ["productivity", "HTML5", "scalpel"]
    },
    "website": {
      "description": "The project's website, if there is one.",
      "type": "string",
      "format": "url",
      "allowEmpty": false,
      "example": "https://jane-doe.github.io/small-sharp-tool"
    },
    "repository": {
      "description": "The location of the application's source code. Can be a git URL, a GitHub URL, or a tarball URL.",
      "type": "string",
      "format": "url",
      "allowEmpty": false,
      "example": "https://github.com/jane-doe/small-sharp-tool"
    },
    "logo": {
      "description": "The location of the application's logo image. Can be an SVG or a PNG.",
      "type": "string",
      "format": "url",
      "allowEmpty": false,
      "example": "https://jane-doe.github.io/small-sharp-tool/logo.svg"
    },
    "success_url": {
      "description": "A URL specifying where to redirect the user once their new app is deployed. If value is a fully-qualified URL, the user should be redirected to that URL. If value is begins with a slash `/`, the user should be redirected to that path in their newly deployed app.",
      "type": "string",
      "allowEmpty": false,
      "example": "/welcome"
    },
    "scripts": {
      "description": "A key-value object specifying scripts or shell commands to execute at different stages in the build/release process.",
      "type": "object",
      "example": {"postdeploy": "bundle exec rake bootstrap"}
    },
    "env": {
      "description": "A key-value object for environment variables, or config vars in Heroku parlance. Keys are the names of the environment variables.\n\nValues can be strings or objects. If the value is a string, it will be used and the user will not be prompted to specify a different value. If the value is an object, it defines specific requirements for that variable:\n\ndescription - a human-friendly blurb about what the value is for and how to determine what it should be\ndefault - a default value to use if no override value is provided\ngenerator - a string representing a function to call to generate the value, such as cookie secret\nrequired - a boolean. Default is false.",
      "type": "object",
      "example": {
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
    },
    "addons": {
      "description": "An array of strings specifying Heroku addons to provision on the app before deploying. Each addon should be in the format `addon:plan`. If plan is omitted, that addon's default plan will be provisioned.",
      "type": "array",
      "example": [
        "openredis",
        "mongolab:shared-single-small"
      ]
    }
  }
}

// Assemble an example schema
schema.example = {}
Object.keys(schema.properties).map(function(key){
  schema.example[key] = schema.properties[key].example
})

// Coerce properties into a template-friendly format
schema.decorator = Object.keys(schema.properties).map(function(name) {
  var prop = schema.properties[name]
  prop.name = name
  prop.requiredOrOptional = prop.required ? "required" : "optional"
  // prop.exampleJSON = "{\n\"" + prop.name + "\": \"" + JSON.stringify(prop.example, null, 2) + "\"\n}"

  var jsonDoc = {}
  jsonDoc[prop.name] = prop.example
  prop.exampleJSON = JSON.stringify(jsonDoc, null, 2)
  return prop
})

module.exports = schema
