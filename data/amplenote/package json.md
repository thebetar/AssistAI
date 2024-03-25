---
title: package json
uuid: 5e6a2c1c-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:42Z'
tags:
  - javascript
  - imported/markdown
---

# package.json

Aside from the properties mentioned in the parent page there also exist fields within the `package.json` file to declare information like author, keywords and other package meta information. These are

- `description` a string with a short description of what this package does

- `name` the name of the published package from this repository

- `version` the current version of the HEAD commit

- `keywords` an array of keywords that describe the package and make it searchable with these keywords

- `homepage` the url to the project’s homepage

- `license` the type of license used for this package

- `author` the name, email and url of the author

- `files` an array of filepaths to include in the package, be aware that when adding this property all file paths not defined won’t be shipped this can break your application

- `main` is the main entrypoint of the package

- `scripts` and object defining commands that can be used

- `dependencies` dependencies used by the package

- `devDependencies` dependencies used to develop the package

- `private` if true cannot publish