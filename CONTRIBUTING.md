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
