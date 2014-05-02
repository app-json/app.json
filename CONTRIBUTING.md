# Contibuting to app.json

### Clone

Fork the repo, or clone the canonical one:

```sh
git clone https://github.com/heroku/app.json
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

# Wrote dist/app.js
# Wrote dist/app.min.js
```

### Document

Genarate human-friendly docs from the schema, copy the markdown to the system
clipboard, and paste the updated schema doc into the [app-json-schema Dev Center
article](https://devcenter.heroku.com/admin/articles/edit/2061).

```sh
npm run docs
cat dist/schema.md | pbcopy
```
