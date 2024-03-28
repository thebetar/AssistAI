---
title: ESLint
uuid: 5c6fc3d6-da0b-11ee-9a0e-ca8ae82b63ae
version: 4
created: '2024-03-04T09:38:42Z'
tags:
  - javascript
  - linting
  - programming
  - quality
  - imported/markdown
---

# ESLint

Within the `Javascript`, `Typescript` and `Node.js` space eslint is **THE** go to linting tool. It supports a lot of rules that will force you to write consistent consistent coding standards. To create these rules you first have to install `eslint` and then create an `.eslintrc` file with the extension of your choosing (I always use `.json`).

Then within this config you wil be able to add some rules this is a simple example of such a file

```json
{
  "env": {
      "browser": true,
      "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
}
```

Now you can try and run `npx eslint .` or the recommended way add this

```json
"lint": "eslint ."
```

To your `package.json` file.

## Extends

The usual way people work with `eslint` is by extending the `.eslintrc.json` file with rules pre defined by the framework they are using using the `extends` keyword. For instance you can change the above `.eslintrc.json` to something like

```json
{
  "env": {
      "browser": true,
      "es2021": true
  },
  "extends": [
		"eslint:recommended",
		"plugin:vue/vue3-recommended"
	]
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
}
```

A lot of the module that frameworks provide in this instance `eslint-plugin-vue` also provide multiple choices of how strict you want your linting to be in this example it provides

- `"plugin:vue/base"`: basic rules to enable eslint for vue

- `"plugin:vue/vue3-essential"`: for only the essentials

- `"plugin:vue/vue3-strongly-recommended"`: for essentials and linting rules strongly recommended by the community

- `"plugin:vue/vue3-recommended"`: for essentials and all linting rules recommended by the community

There are also different variations available for `eslint-plugin-react` and `eslint-plugin-svelte`

Aside from this there are also some standards by the `eslint` dependency which is `eslint:recommended`

## Plugins

Aside from the `extends` keyword the configuration also has a property available called `plugins` the big difference is that `extends` defines configuration while `plugins` only defines rules that can be used but does not enforce any yet this has to be set manually.

## Rules

If you do not agree with some of the rules provided by the plugin you are using you can always add some custom rules to you configuration files this is done by adding this rule to the list off `rules` in the configuration and deciding between `off`, `warn` and `error`. This can also be extended with some extra rules. Here is a small example:

```jsx
{
  "env": {
      "browser": true,
      "es2021": true
  },
  "extends": [
		"eslint:recommended",
		"plugin:vue/vue3-recommended"
	]
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
	"rules": {
		"semi": ["error", "always"],
		"curly": ["error", "all"],
		"quotes": ["warn", "single"]
		"key-spacing": "off"
	}
}
```

The specific settings that can be used after the initial value (`off`, `error` or `warn`) differ per rule. For the specific values that can be provided the eslint documentation or the specific configuration that is being used can be consulted.

## Environment

As seen in the example file of the configuration there also exists a property called `env` this is used to set which global functions are available and which are not. The properties that can be set are

- `browser` for global variables that are available in browsers like the `window` object.

- `node` for global variables that are available in node, like the `require` method.

- `commonjs` for global variables that exist in commonjs

- `es6` for global variables that got added in ES6 except for modules

- For more see: [https://eslint.org/docs/latest/use/configure/language-options#specifying-environments](https://eslint.org/docs/latest/use/configure/language-options#specifying-environments) 

My default config looks something like this

```json
{
	"env": {
		"browser": true,
		"node": true,
		"es6": true
	},
	...
}
```

## Parser options

Aside from adding global variables using the `env` property ESLint can also be configured to parse the code in a different way. This is important since by default ES modules are disabled. The properties availble in this `parserOptions` are

- `ecmaVersion` where the version of the `ecmascript` standard can be set. This property accept a number as a value for the latest major verson or `latest` can be used.

- `sourceType` where the type of file is set. The default value is `script` but in most modern projects this should be set to `module`

- `ecmaFeatures` where specific ecma features can be enabled or disabled. This is mostly used to set the `impliedStrict` property or the `jsx` property

My default config looks something like this

```json
{
	...
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	}
}
```

## Parser

Parser options are used for projects written in javascript that don’t use any special file types like `typescript` and `vue`. Some notable options are

- `@typescript-eslint/parser` which is used to parse typescript to javascript

- `@babel/eslint-parser` which is used to parse using babel

- `vue-eslint-parser` which is used to parse `vue` files

[Custom rules](Custom%20rules.md) 