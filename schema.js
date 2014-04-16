module.exports = {
  properties: {
    name: {
      description: "A URL-friendly string that uniquely identifies the template app",
      type: 'string',
      required: true,
      allowEmpty: false
    },
    description: {
      description: "A brief summary of the app: what it does, who it's for, why it exists, etc.",
      type: 'string'
    },
    keywords: {
      description: "An array of strings, to avoid space-vs-comma ambiguity.",
      type: 'array'
    },
    website: {
      description: "The project's website, if there is one.",
      type: 'string',
      format: 'url',
      allowEmpty: false
    },
    repository: {
      description: "The location of the application's source code. Can be a git URL, a GitHub URL, or a tarball URL.",
      type: 'string',
      format: 'url',
      allowEmpty: false
    },
    logo: {
      description: "The location of the application's logo image. Can be an SVG or a PNG.",
      type: 'string',
      format: 'url',
      allowEmpty: false
    },
    success_url: {
      description: "A URL specifying where to redirect the user once their new app is deployed. If value is a fully-qualified URL, the user should be redirected to that URL. If value is begins with a slash `/`, the user should be redirected to that path in their newly deployed app.",
      type: 'string',
      allowEmpty: false
    },
    scripts: {
      description: "A key-value object specifying scripts or shell commands to execute at different stages in the build/release process.",
      type: 'object'
    },
    env: {
      description: "A key-value object for environment variables, or config vars in Heroku parlance.",
      type: 'object'
    },
    addons: {
      description: "An array of strings specifying Heroku addons to provision on the app before deploying. Each addon should be in the format `addon:plan`. If plan is omitted, that addon's default plan will be provisioned.",
      type: 'array'
    }
  }
}
