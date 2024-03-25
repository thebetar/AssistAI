---
title: Bundling
uuid: 45f29778-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:30Z'
tags:
  - javascript
  - programming
  - backend
  - imported/markdown
  - frontend
  - quality
---

# Bundling

Bundling is very important part of optimising a frontend application. Without bundlers we would still be working in seperate HTML, JS and CSS files where code would be shipped as it was written.

Once frontend development started getting package managers the amount of files increased dramatically, to keep this optimised the idea to write all the files and put them into one file (a bundle) was brought up. Since then the idea has come way further. A bundler can now also minify your code by making it a one liner, uglify it by making variable names as short as possible as long as the functionality stays the same and much more.

## Minifying

Minifying is making your well formatted code into a single line of code, this reduces the file size while making it easier to read by a computer. It will go from this

```jsx
const text="Hello world";

document.querySelector("div").innerText=text;
```

to this

```jsx
const text="Hello world";document.querySelector("div").innerText=text
```

## Uglifying

Uglifying goes one step further and also changes variable names to a shorter version the above code will be turned into the following

```jsx
const o="Hello world";document.querySelector("div").innerText=o;
```

of course within this small example the real advantage is not shown very clearly but within files with over 1000 lines of code the amount of size saved is noteworthy.

## Treeshaking

Tree shaking searches for dead code that is not used and will not include this into the final bundle, it does this by look at exported code and checks if it is imported anywhere, if this is not the case the code is not bundled. This is very handy when you are using dependencies which have functionality that you do not use.

## Compressing

Modern browsers can also accept gzipped files instead of HTML, javascript and CSS. Within the bundler this can be configured as well. This way the resulting files will be in a gzipped format which will also save some filesize so the amount of data sent over a connection is minimized.

## CSSNano

CSSnano is a well known CSS library to minify CSS as well. It will order CSS property alphabetically so they are compressed better, it will remove empty classes and minify the code. There is a whole list of extra things it does which can be found [here](https://cssnano.co/docs/what-are-optimisations/).

## PurgeCSS

PurgeCSS is a less well known way to optimise a bundler. PurgeCSS is a library which can scan what classes are used within your application by scanning the HTML, javascript and Vue files (others can be specified as well) and then checking within your CSS which classes that are defined are not used. This is especially handy when using a CSS framework where you are not using every class that is provided. This will reduce the amount of CSS being shipped dramatically.