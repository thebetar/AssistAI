---
title: 'Linting, formatting and auditing'
uuid: 4e81f6ea-da0b-11ee-a972-c250cfa702b7
version: 4
created: '2024-03-04T09:38:34Z'
tags:
  - javascript
  - quality
  - programming
  - imported/markdown
  - linter
---

# Linting, formatting and auditing

Linting is very important to keep the quality of your code and project up to standards. There are a lot of ways to lint your code. Linters like `eslint` have an enormous amount of configurations which can even be extended to fit your project. Aside from code linting there are also things like commit linting with  `husky`, style linting with `stylelint`.

Formatting helps with adhering to these linting standards, for instance there is an `eslint` formatter within `VScode`. Another popular choice is `prettier`

## ESLint

Within the `Javascript`, `Typescript` and `Node.js` space eslint is **THE** go to linting tool. It supports a lot of rules that will force you to write consistent consistent coding standards. To create these rules you first have to install `eslint` and then create an `.eslintrc` file with the extension of your choosing (I always use `.json`).

### Lint-staged

An honourable mention for a very powerful tool to use in combination with `eslint` is `lint-staged` what this package does is scan for the changed files using your Git history and lint only the change files this is especially handy when combined with the husky hook `pre-push` (read below on how this works) so it will only lint the files that were changed in your last push.

## Husky

Husky is aside from a commit linter also able to create hooks for git actions. For instance a `pre-push` hook, a `pre-commit` hook or a `commit-msg` hook.

**Hooks**

Hooks are a great feature from husky, they allow you to for instance force the unit tests to run and succeed before pushing something to a branch. Hooks can also check the commit message that was send making commit linting possible. What the `pre-push` hook is used for mostly is running `eslint`, then running the `tests` and checking if everything went according to plan. This is really powerful stuff to ensure that standards are adhered to.

To create a hook run `npx husky add .husky/commit-msg "npx commitlint --edit $1"`.

**Commit linting**

Husky provides a way to run some code before commiting. This can be used to check if the commit message adheres to the conventions. This is important to keep your git history clean and know what you did in each commit. I have seen in many past projects where me or some teammates got lazy and typed some unclear commit messages. This caused rollbacks to become way harder because we had to look at each commit separately instead of finding the correct one just by the commit message.

To use commit linting the package `@commitlint/cli` must be installed. I mostly also use the default settings which can be found in the pacakge `@commitlint/config-conventional` when these two packages are installed the `commitlintrc.json` file has to be created with the following content

```bash
{
	"extends": ["@commitlint/config-conventional"]
}
```

This can be then used by Husky in the `commit-msg` hook by using `npx commitlint --edit`

Commit linting checks if a commit follows the conventions that are described on the `\[conventionalcommits.org\](http://conventionalcommits.org)` website. To read more about this convention I have made a separate [page](Conventional%20commits.md) for this.

## Stylelint

Stylelinting is basically the same as `eslint` just a bit simpler. Since stylelint rules are the same across frameworks and component frameworks. So this also makes me recommend just using `stylelint` and the recommended settings from the framework you are using, in this example vue, and going for their most standard configuration which is

```json
{
    "extends": [
        "stylelint-config-standard-scss",
        "stylelint-config-recommended-vue/scss"
    ]
}
```

## Auditing

Auditing dependencies is an important part of keeping your code up to date. Within the node.js and javascript landscape we have a lot of dependencies which have sub dependencies. Building a system that will be secure for years to come just isn’t possible because of the usage of dependencies upon dependencies. This is why auditing your current dependencies and keeping them up to date is very important if you want your system to be secure and reliable. There are two tools which can be used `npm audit` and `retire.js`. `npm audit` is a command supported by the `npm` package manger which will scan your dependencies and check if there are any known vulnerabilities with the packages and the versions you are using. The same is done by `retire.js` only this is a node package itself, these can be run like this

```bash
npm audit
```

```bash
npx retire
```

be aware to run these every so often within your project to ensure that no major security warnings pop up.

[Conventional commits](Conventional%20commits.md)

[ESLint](ESLint.md)