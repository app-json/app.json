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
    success_url: {
      description: "A string specifying where to redirect the user once the app is deployed.",
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
      description: "An array of strings specifying Heroku addons to provision on the app before deploying.",
      type: 'array'
    }
  }
}
