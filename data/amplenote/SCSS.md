---
title: SCSS
uuid: 5fc77556-da0b-11ee-9a0e-ca8ae82b63ae
version: 2
created: '2024-03-04T09:38:42Z'
tags:
  - styling
  - imported/markdown
  - programming
  - frontend
---

# SCSS

## Summary

I’ve recently started using `SCSS` because in a project I was working on I was writing a lot of custom CSS which was getting really unorganised. My favourite feature about SCSS is being able to create nested classes. Another great feature is using `@extend` to include styling from another class so you do not have to create an html tag like `<div class="col col-md-12 light-col-md-12 light-col-md-12__text">Lorem ipsum</div>` SCSS also supports variables and modules, while CSS now also supports variables I like the syntax of SCSS more (`$light-color` vs `var(—light-color)`).

Let’s dive a little deeper into each feature of SCSS below

## Nested classes

Nested classes can reduce the amount of CSS you have to write greatly while also making it much more readable. For instance if you have a `.container` class and you want to target a specific `div` inside this element but only if it is within the `.container` class you can do this like following

```scss
.container {
	width: 100%;
	max-width: 1600px;

	& > div {
		font-size: 0.8rem;
	}
}
```

Another powerful feature with nesting classes is creating subclasses like when you want to have a variant of `.container` that is a little smaller that is called `.container__small` you can create it like this

```scss
.container {
	width: 100%;
	max-width: 1600px;

	&__small {
		width: 100%;
		max-width: 1400px;
	}
}
```

To make this even cleaner we can also use the `@extend` which will be discussed later to create something like this

```scss
.container {
	width: 100%;
	max-width: 1600px;

	&__small {
		@extend .container;

		max-width: 1400px;
	}
}
```

Another great way to use nested classes is by including the `@media` query inside it.

```scss
.container {
	width: 100%;
	max-width: 1600px;

	@media only screen and (width <= 600px) {
		max-width: 480px;
	}
}
```

The final use case i want to discuss is the use case of chaining a pseudo class this can be very handy in a lot of cases like the following

```scss
button {
	padding: 0.75rem;
	border-radius: 0.5rem;
	border: 2px solid #ccc;
	color: black;

	transition: all 0.2s ease-in-out;

	&:hover {
		background-color: #ccc;
		color: white;
	}

	&:disabled {
		opacity: 0.6;
		color: #ccc;
	}
}
```

## At-rules

There are also some very nice @rules that can be used within SCSS, I have already talked a little bit about `@extend` but there are a lot more to talk about

### @use

`@use` can be used to import modules to another file. This is really handy if you want to import only a single `.scss` file that imports all the other files as modules, this can be done by giving a file a name prefixed by `_` like `src/_module.scss` and then importing it with the following code

```scss
@use "src/module" // Code will be imported from here

.container {
	width: 100%;
	max-width: 1600px;
}
```

## @extend

`@extend` is a very handy tool that will reduce the amount of classes you have to write in your HTML file. For instance like already discussed in the nested classes part of this page this can be used when you have a suffix you want to add for a specific type that you can start with the parent as a base to start from. To give a more elaborate example

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;

  &--serious {
    @extend .error;
    border-width: 3px;
  }
}
```

## Properties

In SCSS you can also declare properties, this is very handy if you want your project to have a certain set of colors and a certain set of let’s say font-sizes these can easily be defined as

```scss
$PRIMARY_COLOR: #EA526F;
$SECONDARY_COLOR: #F7F7FF;

$TEXT_LARGE: 1.2rem;
$TEXT_DEFAULT: 0.9rem;
$TEXT_SMALL: 0.6rem;

.header {
	color: $PRIMARY_COLOR;
	font-size: $TEXT_LARGE;
}
```

## Placeholders

A good way to reduce generated CSS is by using placeholders. These are declared within your SCSS file and can be extended on but will not generate CSS in the end. These placeholders are declared by using `%class-name`. For instance these can be used like the following.

```scss
%special-fonts {
	font-family: "Red Hat Display";
	font-style: italic;
}

.header {
	@extend %special-fonts;
	font-size: 1.2rem;
}
```