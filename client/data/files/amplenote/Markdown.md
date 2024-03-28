---
title: Markdown
uuid: 3724637a-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:14Z'
tags:
  - imported/markdown
  - programminglanguage
  - programming
---

# Markdown

Markdown is a very feature rich editor for documentation that can be used to write all sorts of documentation from programming to science. It supports a lot!

[https://www.markdownguide.org/cheat-sheet/](https://www.markdownguide.org/cheat-sheet/) 

## The basics

Within a markdown file there are some simple basics which are used to write 90% of the documentation written in markdown, these basics are

### Headers

When defining a header in markdown you need to append text with the `#` key. One `#` is an h1 tag, two will create a smaller in size h2 tag and this continues to six `#` keys and the smallest header which is h6

### Paragraphs

When a new line is needed within markdown two linebreaks need to be added. This is a great feature to keep the markdown file readable since you can add a single linebreak for readability while this will not result in a linebreak in the resulting page.

### Emphasis

Within text some markup tools are available to highlight some text in multiple ways these are

- `\*` before and after a word to make it italic

- `\*\*` before and after a word to make it bold

- `\*\*\*` before and after a word to make it bold and italic

- `>` to create a blockquote, this also works on multiple lines

- `>>` to create a nested blockquote

- 
  ``` before and after a word or sentence to mark something as code
  
  ```

### Lists

There are also multiple ways to create a list these are

- ordered, this is done by adding a `1.` to the start of a line and then adding the next number in this case `2.` to the start of the next line.

- unordered, this can be done by simply adding a `-` in front of a line and each line that also needs to be an item in the list that comes right after.

### Horizontal line

By adding three or more `-` characters in a single line you can create a horizontal line.

### Links

Links can be created by using the following format

```markdown
[Link text](<Link url>)

[Example](http://example.com)
```

### Images

Images can be created by using the formated of a link but appending it with a `!`

```markdown
![Example image](https://placekitten.com/640/360)
```

## Advanced concepts

The basics can be used to write simple documentation for your project but sometimes this doesn’t cut it there are more advanced features which are very useful

### Tables

Sometimes data needs to be display and is done in a table a lot of times. To create a table within markdown you need to add at least three `-` characters to each column and each side should have a `\|` character, here is an example

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

Within tables aligning text can be important to increase readabity this is done by adding a `:` to the side the text should be aligned to are adding the `:` character to both sides to center the text here is an example of this

```markdown
| Column 1 | Column 2 | Column 3 |
| :------- | :------: | -------: |
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

### Code blocks

Sometimes one line of code is not enough, then codeblocks can be used by adding a line that contains three \`\`\` characters and then the language that should be used for highlighting the code this looks something like this

```markdown
```javascript
import { add } from "./utils";

const result = add(3, 4);

console.log(result);
```

```

### Task lists

Markdown also supports the creation of task lists that can be used to create a checklist for tasks that have to be completed or that are already completed here is an example of this

```markdown
- [ ] Task 1
- [x] Task 2
- [ ] Task 3
```

### Emojis

Emojis are easily added by writing the word that fits the emoji between two `:` characters

```markdown
:joy:
:tent:
```