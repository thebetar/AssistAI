---
title: Component testing
uuid: 56cb7024-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:38Z'
tags:
  - javascript
  - imported/markdown
  - frontend
  - programming
  - testing
---

# Component testing

Sometimes unit testing does not cut it and a solution is needed to be able to manually test a single component where a lot of control of the data that goes into the component is needed. For this certain libraries like storybook exist! Storybook supports all the big frameworks and also supports normal HTML. This is great since you can use it for every project if you need it. Some good use cases are

- When building separate features for a bigger application

- To render mail templates that do not live in a frontend application

- To test important components that are used a lot in different places

- When developing a library of components

Using storybook you can think of it as an isolated environment where you can load in a component and give it all kinds of argument and even make a form for it. To setup storybook up is very easy you can run

```tsx
npx storybook@latest init
```

From here a menu is given to which framework is used and for every framework the setup works a little differently but the core concepts of each are the following

## Arguments

Arguments are data passed to the component that is defined in storybook. These arguments can be static and dynamic. For each argument storybook will also generate fields where you can edit this data wihle viewing the storybook component. To get control of these fields the `argTypes` parameter can be used this looks something like this

```tsx
import Button from './Button.tsx';

export default {
	title: 'Button'
}

export const Primary = {
	render: (args) => (
		<Button {...args} />
	),
	args: {
		buttonText: 'Click me!'
	},
	argTypes: {
		type: {
			options: ['primary', 'secondary', 'warning', 'danger'],
			control: 'select'
		}
	}
};			
```

## Loaders

Within storybook sometimes asynchronous data has to be loaded in. For this storybook has the concept of loaders. This is an array of Promises that return objects that are combined in an object provided to the render function. This makes it so storybook can fetch some data and then provide it to the component like this

```tsx
import TodoList from '@src/components/TodoList.tsx';

export default {
	title: 'TodoList'
}

export const FromAPI = {
	render: (args, { loaded: { todos } }) => <TodoList todos={todos} />,
	loadres: [
		async = () => {
			const response = await fetch('http://jsonplaceholder.typicode.com/todos');
			return {
				todos: await response.json()
			};
		}
	]
};
```

## Documentation

Aside from creating isolated components storybook can also be used to write documentation and also show the components that the documentation is about in markdown (`.mdx`). This is one of the best ways to show how a component works and what the thought was behind it. When doing this for the above example this would look like this

```markdown
import { Meta, Canvas } from '@storybook/blocks'; 
import * as TodoList from './TodoList.stories.ts';

<Meta of={TodoList} />

# Todo list

We have created a todo list component to show all the todos that come from the API it looks like this

<Canvas of={TodoList.FromAPI} />

To use this you can import it with this code in this repository

<Code code="import TodoList from '@/src/components/TodoList.tsx'" />
```