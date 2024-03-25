---
title: Regular expressions
uuid: 3b92fe3a-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:18Z'
tags:
  - imported/markdown
  - programming
---

# Regular expressions

Regular expressions are used to find certain combinations within strings. This is really handy for validation of fields within an application, for instance to check if someone has filled in a correctly structured email address. Here is a simple example if this

```tsx
/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
```

To structure a regulare expressions a couple of things can be used

- Character classes (\\d, \\w, \\s)

- Anchors

- Groups

- Quantifiers

## Character classes

Within the character classes used in regex there are two ways that I use, at first you have the classes that match all digits, words or white spaces these are\]

- **.** for all characters

- **\\d** for digits

- **\\w** for words

- **\\s** for whitespace

- **\\D** for not digits

- **\\W** for not words

- **\\S** for not whitespace (great for required fields)

These correspond to a preset range of characters if this is not enough brackets can be used to indicate a specific range like 3 to 9 with `\[3-9\]` or a specific sets of characters like `\[3456789\]` I also prefer to use this as I think it is more readable.

## Anchors

Anchors are used to tell the regular expression if it has to search within the string or if the string has to start or end somewhere. When anchoring the start of a regex the `^` is used and the `$` is used for the end of the string.

```tsx
/^John\sDoe$/
```

## Groups

To define a group wrap the regex in `(` and `)`

## Quantifiers

To define a range of characters you can use the following

- `{2}` for exactly 2

- `{2,}` for 2 or more

- `{1,3}` for 1 to 3 length

- `\*` for 0 or more

- `+` for 1 or more

- `?` for 0 or 1

## Cheatsheet

```tsx
export default {
  email: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
  phone: /^[+]?[(]?[0-9]{2,3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  postalCode: /^[0-9]{4}[ ]{0,1}[A-Za-z]{2}$/,
  address: /^[\w- ]+[\d/+]+$/,
  required: /\S+/,,
  url: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
  number: /^[1-9][0-9]*$/,
};
```