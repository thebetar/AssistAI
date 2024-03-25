---
title: Supersets
uuid: 505a6c22-da0b-11ee-a972-c250cfa702b7
version: 4
created: '2024-03-04T09:38:36Z'
tags:
  - imported/markdown
  - programming
---

# Supersets

Supersets are an amazing tool to increase productivity and code reliability. To quote a good description I found on the internet

> A programming language that contains all the features of a given language and has been expanded or enhanced to include other features as well.

This describes it very well, the best example of this is `typescript`. Typescript is a superset of `javascript` with a lot of extra functionality. Javascript is soon catching up with a lot of features but there are still many more where typescript leaves javascript in the dust. There are also examples like `SCSS`, which is a superset of `CSS`. These two supersets are also the two that I mostly use so let’s dive in with a short summary, to find more information you can visit the separate pages of these supersets.

## Typescript

Typescript is a probably the most superset out there. It is preferred because it provides a lot of functionality that other programming languages have out-of-the-box and that javascript does not. Like being strongly types, or even supporting types at all! Types are very handy to have because your IDE can understand what properties a value has, so you can’t call string specific functions on a non-string without getting a warning that this will cause errors. This makes you have to think about how you structure your code more and will result in less errors when you ship your code, amazing! Furthermore there is support for a lot of extra cool features that are now in javascript as well like `modules` and `optional chaining`. Aside from the safety reasons it is also nice when using a package to be able to use auto hints to find out what methods and properties a package contains.

## [SCSS](SCSS.md)

I’ve recently started using `SCSS` because in a project I was working on I was writing a lot of custom CSS which was getting really unorganised. My favourite feature about SCSS is being able to create nested classes. Another great feature is using `@extend` to include styling from another class so you do not have to create an html tag like `<div class="col col-md-12 light-col-md-12 light-col-md-12__text">Lorem ipsum</div>` SCSS also supports variables and modules, while CSS now also supports variables I like the syntax of SCSS more (`$light-color` vs `var(—light-color)`).

[Typescript](Typescript.md)

[SCSS](SCSS.md)