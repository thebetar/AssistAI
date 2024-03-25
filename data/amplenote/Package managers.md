---
title: Package managers
uuid: 4fc4d7d4-da0b-11ee-9a0e-ca8ae82b63ae
version: 6
created: '2024-03-04T09:38:36Z'
tags:
  - javascript
  - programming
  - imported/markdown
---

# Package managers

Package managers are an important part of the javascript and node.js ecosystem, they make it very easy to get some code from the community and use it so you do not have to write everything yourself. This goes even further with the major projects like frameworks which make a programmer’s life way easier. For package managers within the node.js ecosystem there are a couple of flavours

- `npm` which is the go to standard that is constantly updated and maintained

- `yarn` which used to be a very popular competitor but since `npm` can now do a lot of things yarn can as well it has fallen from grace

- `pnpm` which is a new competitor to `npm` but in my humble opinion will probably have the same problem as `yarn` since npm will just get updated

For other programming languages you may find

- `pip` for python

## Packages

To use the package manager you can run the following command after installing `node.js`

```bash
npm init -y
```

To initialise a project and then run

```bash
npm install package
```

This will install the package in your `node_modules` folder. Be careful to only install packages which will be bundled and shipped with `npm install` other dependencies are what is known as dev dependencies and can be installed with

```bash
npm install package -D
```

this way the package will be listed as a `devDependency` within the `package.json`

After running one of these files the `package.json` file wil lbe created which lists all the dependencies and other metadata from your `npm` project. It will look something like this

```bash
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "is-odd": "^3.0.1"
  },
	"devDependencies": {
    "is-even": "^1.0.0"
  }
}
```

## Scripts

Within the `scripts` tag some cool stuff can be done as well, here some custom logic can be written which can be triggered easily with the command `npm run script` for instance if we wanted a dev server with `nodemon` which runs and watches a javascript file we would do something like this

```bash
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
		"start": "nodemon index.js",
		"dev": "npm run start",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "is-odd": "^3.0.1"
  },
	"devDependencies": {
    "is-even": "^1.0.0",
		"nodemon": "^2.0.22"
  }
}
```

## Versioning

Aside from git version control within your `package.json` you want to keep your semantic versioning. This is used to keep a record of how big a change was and if it is breaking or not this is why you see in the version a number like `1.0.0` where the first number represents the major version, the second the minor version and the last the patch. If a lot of breaking changes are made where the package logic is not able to be used the same this will be a major version. If some breaking changes are made but not everything is unusable this is a minor change. Things like small fixes or refactors can be done as a patch. These versions can be incremented using the `npm version` command like this

- `npm version major` for increasing a major version (1.0.0 > 2.0.0)

- `npm version minor` for increasing a minor version (1.0.0 > 1.1.0)

- `npm version patch` for increasing a patch (1.0.0 > 1.0.1)

- `npm version prerelease --preid prerelease` for creating a prerelease version (1.0.0 > 1.0.1-prerelease.0)

A good package to use for versioning is `standard-version` this will also edit your `\[changelog.md\](http://changelog.md)` file and will keep track of all the changes made per version if you create nice descriptive commit messages (using commitlint). To do the same as mentioned above with `standard-version`

- `npx standard-version --release-as major` for increasing a major version (1.0.0 > 2.0.0)

- `npx standard-version --release-as minor` for increasing a minor version (1.0.0 > 1.1.0)

- `npx standard-version --release-as patch` for increasing a patch (1.0.0 > 1.0.1)

Currently `standard-version` is being deprecated and a good alternative fork was not created yet after one year. The recommended way recommended by `standard-version` is switching over to `release-please` from **Google**. This is a Github action which will create a PR on your repository to increment the version  based on your commit messages. So no package needs to be installed.

[package.json](package%20json.md) 