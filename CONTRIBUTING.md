# Contibuting to app.json

### Clone

Fork the repo, or clone the canonical one:

```sh
git clone https://github.com/app-json/app.json
cd app.json
```

### Test

```
npm install
npm test
```

### Develop

To use the CLI from your local code instead of an installed node package:

```sh
npm remove app.json -g
cd ~/my/copy/of/app.json
npm link
```

Now when you run `app.json` in the shell, you're using your local code. To
install the "real" thing later:

```sh
npm remove app.json -g
npm install app.json -g
```

### Bundle

To prepare a browser-ready bundle, run the following:

```sh
npm run build
```

### Schema Documentation

The schema documentation is generated from these two files:

- [templates/schema.mustache.html](/templates/schema.mustache.html)
- [lib/schema.js](/lib/schema.js)

Use the command below to genarate human-friendly docs from the schema and copy the markdown to the system
clipboard. Then paste the updated schema doc into the [app-json-schema Dev Center
article](https://devcenter.heroku.com/admin/articles/edit/2061).

```sh
npm run doc
cat dist/schema.md | pbcopy
```

### Releasing a New Version

- Run `npm run build`
- Update version number in [package.json](/package.json) and [bower.json](/bower.json).
- Create a new GitHub release for bower at https://github.com/app-json/app.json/releases/new
- `npm publish`
