---
title: Astro
uuid: 54c32042-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:38Z'
tags:
  - javascript
  - framework
  - imported/markdown
  - frontend
  - programming
---

# Astro

## Summary

Astro is a framework that is used for creating insanely fast static websites. This framework is the best choice when reactivity and scalablity aren’t a concern. This makes it perfect for portfolio website, like my own website [VonkProgramming.nl](https://vonkprogramming.nl)

## Intergrations

Astro can be used in combination with the popular frameworks like Angular, React and Vue.js to increase performance, but the best performance is reached when using Astro standalone.

## Project structure

Astro requires a specific project structure to build the application to a static performant websites these are

### pages

The pages directory houses the pages which will be converted to routes of the application. The recommended way to create a page is with the `.astro` file extension. Astro files have a special structure where you can define javascript that imports some component or adds an event listener to an element in the page and on build time will get converted to a single static html file.

### components

The components directory houses the reusable components between pages or components used for code splitting

### layouts

The layouts directory houses the layout that is used across multiple pages

### others

The other folder structures are not required and are similar to other frameworks.