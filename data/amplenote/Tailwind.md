---
title: Tailwind
uuid: 562496aa-da0b-11ee-a972-c250cfa702b7
version: 4
created: '2024-03-04T09:38:38Z'
tags:
  - programming
  - imported/markdown
  - frontend
  - styling
---

# Tailwind

## Summary

Tailwind is perfect for smaller projects it offers a helper classes for everything you want. Basically every `CSS property` has a helper class with multiple values. So for instance if you want a card you can just do it like\
`<div class="px-4 py-2 rounded border-2 bg-white">Lorem ipsum</div>`\
as you can see everything has a nice little class. Why I do not like using tailwind in more customisable projects as opposed to some other developers is that I do not like them in tandem. I either want everything in my `SCSS` file or everything in classes and when making things very custom Tailwind makes you have to add a lot of classes and still create some custom CSS for things that are just not able doable by helper classes. Even though these things for projects like portfolio websites or other things it is perfect!

## Base classes

Within Tailwind everything has helper classes like explained in the summary. So for instance of you want the height set at `4rem` you can use the `h-16` class this will look something like this

```html
<div class="h-16">
	Lorem ipsum
</div>
```

You can use these helper classes to create a whole lot. There are also classes that do not work with number values like `h-16` does but with `XS`, `sm`, `md`, `lg`and `xl`. For instance the `rounded` class so if we use the knowledge above and some of these classes we can create a card like this

```html
<div class="px-4 py-2 border-2 rounded-md">
	Lorem ipsum
</div>
```

There are also classes which use color, for instance for a background you can use `bg-white` these colours accept two more values you can add the tint and the `opacity` for instance if you want a background to be a little grey with an `opacity` of `0.75` this can be done with `bg-slate-300/75` for instance. With this you will end up with

```html
<div class="px-4 py-2 border-2 border-slate-600 rounded-md bg-slate-300/75">
	Lorem ipsum
</div>
```

## Conditional classes

Tailwind also supports some conditional classes I will not go into every single one but will give a general example on how to use some of them. For instance now that we have our card maybe we want it to change background when we hover the card this can be done by adding the `hover:` conditional I will also add the `transition` class to make the card transition from one to the other. The code below will transition the card from having a color with `opacity` of `0.75` to one with full opacity (`opacity: 1`)

```html
<div class="
	px-4 py-2 border-2 border-slate-600 rounded-md 
	bg-slate-300/75 hover:bg-slate-300
	transition
">
	Lorem ipsum
</div>
```

There are also classes for `disabled`, `focus`, etc. you can use these for instance to create a button that is greyed out when disabled.

```html
<button class="
	p-4 border-2 rounded-md border-slate-600 
	bg-slate-300 hover:bg-slate-400 disabled:bg-slate-500 disabled:text-slate-300
">
	Click me!
</button>
```

Source: [https://tailwindcss.com/](https://tailwindcss.com/) 