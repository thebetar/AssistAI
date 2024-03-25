---
title: Visual studio code
uuid: 38eb6532-da0b-11ee-a972-c250cfa702b7
version: 22
created: '2024-03-04T09:38:16Z'
tags:
  - imported/markdown
  - ide
  - programming
  - tools
---

# Visual studio code

# Summary

Visual studio code is a widely used IDE and is the best editor to start with when you start programming. It has a lot of features while also be extensible with some great choices. Visual studio code also contains a very easy to use debugger which ties into it’s terminal. The downside of Visual studio code is that it is written in Javscript using electron. This causes it to not perform on the levels of neovim for instance. Also the shortcuts are more limited than other choices.

# Important lessons

When using visual studio code a couple of things can help boost productivity greatly these are important to keep in mind these are

- Having the right extensions

- Not having too many extensions

- Knowing all shortcuts

- Knowing how to use the debugger

These have separate paragraphs talking about them

# Extensions

Depending on what programming language you are using there are specific extensions that will help you out while coding. In this page I will focus on javascript / typescript specific extensions that are nice to have these are

- **ESLint:** this extension will highlight code that isn’t compliant with the esint configuration within the project

## Snippets

Snippets can be downloaded as extensions or written by the user by using the “Snippets: Configure User Snippets”. This is a really useful feature since you can automate boiler plate code so you don’t have to keep writing it. After finding out this feature I immediately started writing one for my default Vue component this setup looks like this

```tsx
{
	"New component": {
		"prefix": "vbase",
		"body": [
			"<template>",
			"  <div>",
			"  </div>",
			"</template>",
			"",
			"<script lang=\"ts\">",
			"import { defineComponent } from 'vue';",
			"",
			"export default defineComponent({",
			"  name: '$1',",
			"});",
			"</script>",
			"",
			"<style lang=\"scss\" scoped>",
			"",
			"</style>"
		],
		"description": "New Vue component"
	}
}
```

I prefer writing all my snippets myself since this keeps my configuration more clean. While it is useful when starting with a language or framework to use the recommended snippets i like to move away from these or only keep the most basic since a clean configuration keeps VSCode semi fast.

# Shortcuts

VSCode supports a lot of shortcuts, some are more useful than others to view them all visit the following links for each OS respectively (or press CTRL + K, CTRL + S to open them)

- [Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf) 

- [Linux](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf) 

- [MacOS](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf) 

Of course memorizing all of them will take some time but here is a list of some important ones (keep in mind that CTRL is Command on mac and ALT is the Option key on mac)

## **General**

- **ctrl + p** to open a file 

- **ctrl + g** go to line

- **ctrl + n** to open a new tab

- **ctrl + shift + n** to open a new window

- **ctrl + w** to close current tab

- **ctrl + shift + w** to close current window

- **ctrl + b** toggle sidebar

- **ctrl + \`** toggle terminal

- **ctrl + shift + \`** open new terminal

- **ctrl + PageUp** go up one terminal

- **ctrl + PageDown** go down one terminal

## **File editing**

- **F2** rename symbol

- F**8** go to next problem

- **alt + up** \|\| **alt + down** to move an item up or down a line

- **alt + z** toggle word wrap

- **ctrl + /** to toggle line comment

- **ctrl + space** to trigger suggestion

- **ctrl + .** toggle quick fix

- **ctrl + shift + \[** \|\| **ctrl + shift + \]** to wrap or unwrap current region (\[ to wrap, \] to unwrap) (Command + Option for mac)

- **ctrl + k, ctrl + \[** \|\| **ctrl + k, ctrl + \]** to wrap or unwrap all regions

- **ctrl + shift + k** to delete current line

## Window management

- **ctrl + p** to open a file 

- ***ctrl + \\ *** split editor to new workspace

- **ctrl + $(number)** switch to workspace

- **alt + $(number)** switch to file in workspace

## Multicursor editing

- **ctrl + alt + up** \|\| **ctrl + alt + down** add cursor above or below

- **ctrl + d** select next occurence of selection

- **ctrl + F2** select all occurences of seleciton

## **Finding stuff**

- **ctrl + t** find a symbol

- **ctrl + shift + f** find in all files

# Debugger

The debugger in visual studio code is a very powerful tool that can be used for all languages as long as there is native support or via extensions.

To use the debugger navigate to the debugger tab or when debugging JavaScript just open a JavaScript debugging terminal and run your usual command to run the node.js process.

After running the debugger click on the left of the line number where a braking needs to be placed. The code will pause once the process runs the code in this line.

When paused on the right the call stack and the variables from different scores can be observed and even changed.