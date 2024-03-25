---
title: Best practises
uuid: 3aefb766-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:16Z'
tags:
  - programming
  - imported/markdown
---

# Best practises

Within coding there are a lot of best practises to keep your code clean and readable. This is very important because after working on a project for a while your code can get really messy if you don’t use the right standards. Best practises help with this! A great ay to think about it in my opinion is that code that does something difficult should still be easy to read and very understandable. Hard to read code is not because it is complex it is because it is badly written e.g. people that still use callback hell.

## Never nesting

A very important way to keep your code readable is to prevent nesting this means that you should use as little layers of if statements or methods as posisble. Here is an example of bad code

```tsx
render() {
  const personToLookFor = 'Thierry'
  const [result, loading] = doesPersonExists(personToLookFor)

  if (!loading) {
    let message
    if (result) {
      message = `${personToLookFor} already exists.` 
    } else {
      message = `${personToLookFor} doesn't exist.`
    }
    return message
  } else {
    return 'Loading...'
  }
}
```

This is a simple example of course but it illustrates the point. When using early returns so the nesting is reduced you’ll get

```tsx
render() {
  const personToLookFor = 'Thierry'
  const [result, loading] = doesPersonExists(personToLookFor)

  if (loading) {
		return 'Loading...';
	}
  if (result) {
    return `${personToLookFor} already exists.`;
  }
  return `${personToLookFor} doesn't exist.`;
}
```

As you can see the second code does the same thing but is way more readable. This is the idea of never nesting since there aren’t a lot of layers you won’t lose in what scope you are currently.

## Naming conventions

Naming methods in what they do. This can be very long and descriptive names which I prefer since they explain better what they do. This seems simple but ends up being the hardest thing possible in programming. Some good rules are

- Don’t abbreviate

- Make it descriptive

- Place units in variable name if possible

- Use names by abstraction, don’t name things Utils class or something general

## Functions

Functions within programming are very useful. They are used to run some code when called so the code does not have to be repeated in multiple places. While this is the reason functions exist they can be used for much more! Here are some best practises

- A function should only do one thing, NO SIDE EFFECTS!

- Extract as much logic into function as you can this is really useful for long if statements where you can just name the function “isSomething” which is more descriptive

## Classes and components

Keep classes and components very minimal the more logic you add the less flexible it becomes especially with frontend components. It is a good practise to make a component as simple and reusable as possible and if a component with other styling or logic is needed create a new one. The logic gets cluttered and unreadable very quickly.