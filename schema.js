module.exports = {
  properties: {
    name: {
      description: "A URL-friendly string that uniquely identifies the template app",
      type: 'string',
      required: true,
      allowEmpty: false,
      example: "small-sharp-tool"
    },
    description: {
      description: "A brief summary of the app: what it does, who it's for, why it exists, etc.",
      type: 'string',
      example: "This app does one little thing, and does it well."
    },
    keywords: {
      description: "An array of strings, to avoid space-vs-comma ambiguity.",
      type: 'array',
      example: ["productivity", "HTML5", "scalpel"]
    },
    website: {
      description: "The project's website, if there is one.",
      type: 'string',
      format: 'url',
      allowEmpty: false,
      example: "https://jane-doe.github.io/small-sharp-tool"
    },
    repository: {
      description: "The location of the application's source code. Can be a git URL, a GitHub URL, or a tarball URL.",
      type: 'string',
      format: 'url',
      allowEmpty: false,
      example: "https://github.com/jane-doe/small-sharp-tool"
    },
    logo: {
      description: "The location of the application's logo image. Can be an SVG or a PNG.",
      type: 'string',
      format: 'url',
      allowEmpty: false,
      example: "https://jane-doe.github.io/small-sharp-tool/logo.svg"
    },
    success_url: {
      description: "A URL specifying where to redirect the user once their new app is deployed. If value is a fully-qualified URL, the user should be redirected to that URL. If value is begins with a slash `/`, the user should be redirected to that path in their newly deployed app.",
      type: 'string',
      allowEmpty: false,
      example: "/welcome"
    },
    scripts: {
      description: "A key-value object specifying scripts or shell commands to execute at different stages in the build/release process.",
      type: 'object',
      example: {"postdeploy": "bundle exec rake bootstrap"}
    },
    env: {
      description: "A key-value object for environment variables, or config vars in Heroku parlance.",
      type: 'object',
      example: {
        "BUILDPACK_URL": "https://github.com/stomita/heroku-buildpack-phantomjs",
        "SECRET_TOKEN": {
          "description": "A secret key for verifying the integrity of signed cookies.",
          "generator": "secret"
        },
        "WEB_CONCURRENCY": {
          "description": "The number of processes to run.",
          "default": 5
        }
      }
    },
    addons: {
      description: "An array of strings specifying Heroku addons to provision on the app before deploying. Each addon should be in the format `addon:plan`. If plan is omitted, that addon's default plan will be provisioned.",
      type: 'array',
      example: [
        "openredis",
        "mongolab:shared-single-small"
      ]
    }
  }
}
