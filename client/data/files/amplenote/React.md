---
title: React
uuid: 54329cfc-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:38Z'
tags:
  - javascript
  - framework
  - imported/markdown
  - programming
  - frontend
---

# React

## Summary

The strong point about Vue is how it uses its own `.vue` files. Within these files they have separated the templating, the scripting and the styling. I really like this because it keeps all the logic of a component within one file. This makes it really easy to work on styling and logic at the same time. Furthermore I have experienced the fastest idea to actual product with `Vue`

## Defining a component

Within React there are two ways of using classes and using functions. Since the hooks have been added the functional component has become the standard way. This looks something like this

```jsx
export function Component() {
	return (
		<div>
			Lorem ipsum
		</div>
	)
}
```

Components must return a single JSX element but there is a simple trick for having two root elements and that is by wrapping the elements within a `<> ... </>` this looks something like

```jsx
export function Component() {
	return (
		<>
			<div>
				Lorem ipsum
			</div>
			<div>
				Doler morit
			</div>
		</>
	)
}
```

### Defining state

This of course is not a very useful component, to add some data the `useState()` hook is used. This function returns an array with the first item being the value and the second item being the setter. Using this will look something like this.

```jsx
export function Component() {
	const [value, setValue] = useState('');

	return (
		<div>
			Lorem ipsum
		</div>
	)
}
```

To display the data within the component the `{ value }` syntax can be used like this

```jsx
export function Component() {
	const [value, setValue] = useState('ipsum');

	return (
		<div>
			Lorem { value }
		</div>
	)
}
```

To change the state we can also use the event listeners within react like this

```jsx
export function Component() {
	const [value, setValue] = useState('ipsum');

	return (
		<div>
			Lorem { value }
			<button onClick={() => setValue('doler')}>
				Click me
			</button>
		</div>
	)
}
```

All this logic combines already makes a pretty powerful framework.

### Props

Now that we know how to handle data within one component it is also important to know how to share data across components. Within react this is used for data but also for calling methods from a parent component, unlike `Vue.js` which uses an event emitter. Using a prop for data looks something like this

```jsx
export function ListItem({ title }) {
	return (
		<li>{ title }</li>
	)
}

export function List() {
	return (
		<ul>
			<ListItem title="Lorem" />
			<ListItem title="Ipsum" />
		</ul>
	)
}
```

Or when passing a methods

```jsx
import { useState } from 'react';

export function StyledButton({ onClick, title }) {
	return (
		<button 
			style={ padding: '4px', borderRadius: '4px' } 
			onClick={onClick}
		>
			{ title }
		</button>
	)
}

export function List() {
	const [counter, setCounter] = useState(1);

	return (
		<div>
			<div>{ counter }</div>
			<StyledButton onClick={() => setCounter(counter + 1)} title="Increment" />
		</div>
	)
}
```

### Conditional rendering

The react syntax for using javascript within the returned element (with `{ ... }`) this can also be used for conditional rendering by using a tenary expression like `value ? resultA : resultB`. This looks something like this

```jsx
export function Component() {
	const [toggle, setToggle] = useState(false);

	function handleToggle() {
		setToggle(!toggle);
	};	

	return (
		<div>
			<button onClick={handleToggle}>Toggle</button>
			{ toggle ? (
				<div>Statement is now true</div>
			) :  (
				<div> Statement is now false </div> 
			)}
		</div>
	);
}
```

This can also be used with props and having multiple return statements the logic behind this is the same but it looks a little different, here is an example

```jsx
export function Component({ color = 'red' }) {
	if(color === 'blue') {
		return <div style={ color: 'blue' }>Blue</div>
	}
	if(color === 'red') {
		return <div style={ color: 'red' }>Red</div>
	}
	return null;
}
```

Finally this can also be used in combination with the `&&` operator to only show some content when the result is truthy, this looks something like this

```jsx
export function Component({ title, status = 'TODO' }) {
	return <li>{ title } { status === 'DONE' && '✔' }</li>
}
```

### Rendering lists

To render a list within react you can pass an Array of JSX element this is done mostly with the `.map` function and looks something like this

```jsx
export function Component() {
	const fruits = ['apple', 'pear', 'banana'];

	return (
		<ul>
			{ fruits.map(fruit => <li>{ fruit }</li>) }
		</ul>
	);
}
```

## Hooks

Hooks are used to access React functionality from within a component, for instance to get state within a component

### useState

This hook was already discussed in defining state, but to summarise, `useState` is used to define state and provide a setter function to change the state, when using this setter function to change the state react is notified and will update all the places where the state is referenced

```jsx
export default function Component() {
	const [name, setName] = useState('');

	return (
		<div>
			<div>{ name }</div>
			<input 
				type="text" 
				name="name" 
				value={name} 
				onChange={event => {
					setName(event.target.value);
				}
			/>
		</div>
	);
}¥
```

Be aware that when changing arrays or objects the whole array or object needs to be changed, this looks something like this

```jsx
// For objects
setObject({ ...object, key: value });

// For arrays
setArray([ ...array, newItem ]);
```

### useContext

Context was recently added to React to handle data sharing between components. I still prefer to use `Redux` for bigger projects but it is a great solution when the amount of data that needs to be shared between components is medium sized to small. This is done by using `createContext` to create context, then with the created context wrapping a component with it’s `Provider` value and then within that component referencing this context and using the value. This looks something like this

```jsx
export const CustomContext = createContext(100);

export default function CustomPage() {
	return (
		<CustomContext.Provider value={200}>
			<CustomComponent />
		</CustomContext.Provider>

export default function CustomComponent() {
	const size = useContext(CustomContext);

	// Displays 200
	return (
		<div>{ size }</div>
	)
}
```

The `Provider` logic is nice because the `createContext` let’s you define a default value and then you can use it’s `Provider` in multiple places.

### useReducer

The Context used in combination with the `useReducer` hook makes you able to also change data within the Context. This basically creates a simple way to share state between components. Within the examples in the react documentation this is done with a two Contexts.

To create a reducer you need two things, a reducer and an initial state. The reducer will define which actions you allow and what each action does to the state. The initial state defines what the starting state is of the reducer. Creating a reducer looks something like this

```jsx
function usersReducer(users, action) {
	switch(action.type) {
		case "ADD_USER":
			return [
				..users,
				action.payload
			];
		case "DELETE_USER":
			return users.filter(user => user.id !== action.payload);
		default:
			return users;
	}
}

const INITIAL_USERS = [
	{
		name: "John Doe",
		age: 30
	}
];

export default function Component() {
	const [users, dispatch] = useReducer(usersReducer, INITIAL_USERS);

	return (
		<div>
			<ul>
				{ users.map(user => <li>{user.name}</li>) }
			</ul>
		
		</div>
	)
}
```

and then to call an action would look something like this

```jsx
export default function Component() {
	// Code is hidden in this example but see first example of this subject
	const [users, dispatch] = useReducer(usersReducer, INITIAL_USERS);

	function addUser() {
		dispatch({
			type: "ADD_USER",
			payload: {
				name: "Jane Doe"
			}
		});
	};

	return (
		<div>
			<ul>
				{ users.map(user => <li>{user.name}</li>) }
			</ul>
			<button onClick={addUser}>
				Add user
			</button>
		</div>
	)
}
```

This by itself is just another way to manage state within a component and I would not recommend using `useReducer` by itself if not used in combination with context. This is because you have to write a lot of extra code that is not necessarily more readable. This said when using it in combination with context it becomes a very powerful tool. For this it is best to create two contexts, one for the state and one for the dispatch

```jsx
import { createContext } from 'react';

const UsersContext = createContext(null);
const UsersDispatchContext = createContext(null);
```

After this you can use it like this

```jsx
const UsersContext = createContext(null);
const UsersDispatchContext = createContext(null);

export default function CustomPage() {
	// Code is hidden in this example but see first example of this subject
	const [users, dispatch] = useReducer(usersReducer, INITIAL_USERS);

	return (
		<UsersContext.Provider value={users}>
			<UsersDispatchContext.Provider value={dispatch}>
				<CustomComponent />
			<UsersDispatchContext.Provider>
		<UsersContext.Provider>

export default function CustomComponent() {
	const users = useContext(UsersContext);

	// Displays users list
	return (
		<div>
			<ul>
				{users.map(user => <li>{user.name}</li>)}
			</ul>
		</div>
	)
}
```

With this long example we finally have created a truly powerful way to share data with relatively little code. This makes you able to share data easily to nested components of the root component (in this case the `CustomPage`). In this example the true power of this is not shown but when your application scales to have components nested 5 to 10 layers deep and still being able to dispatch a data change from a form component and a list component being able to immediately see that data changed and display this change is powerful stuff!

### useEffect

The useEffect hook is another really handy hook to use within React. It makes you able to run some code when a component is loaded, you would think that this is done when something is placed within the function but this code is run every time the component is updated. This of course is not preferable if for instance you want to do an API call to get a list of data to display on the screen, then your API would be called each time some state changes which in most cases is not preferable. The useEffect hook can also be appended with some state to watch so that if this state changes the hook will run again. Using this hook looks something like this

```jsx
export default function Component() {
	const [users, setUsers] = useState([]);

	useEffect(getUsers, []);

	async function getUsers() {
		const response = await fetch('/api/users');
		setUsers(await response.json();
	}

	// Displays users list
	return (
		<div>
			<ul>
				{users.map(user => <li>{user.name}</li>)}
			</ul>
		</div>
	);
}
```

### useMemo

The useMemo hook is very useful for optimising your application. It enables you to cache some data and change it when one of it’s dependencies is changed this looks something like this

```jsx
export default function Component() {
	const [users, setUsers] = useState([ ... ]);
	const [minAge, setMinAge] = useState(18);

	const minAgeUsers = useMemo(
		() => users.filter(user => user.age >= minAge), 
		[users, minAge]
	);

		// Displays users with minimum age list
	return (
		<div>
			<ul>
				{minAgeUsers.map(user => <li>{user.name}</li>)}
			</ul>
		</div>
	);
}
```

This makes you able to not have to re-render the data each time the component updates without one of the dependencies updating.

### useCallback

The useCallback hook works a little like the useMemo hook but for functions. This is useful when in a top level component you want to define an endpoint to send a form to that is filled in within a nested component, this looks something like this

```jsx
export function ParentComponent({ id }) {
	const handleUpdate = useCallback((form) => {
		await fetch(`/items/${id}`, { method: 'post' });
	});

	return (
		<div>
			<FormComponent handleSubmit={handleUpdate} />
		</div>
	);
}

export function FormComponent({ handleSubmit }) {
	const [title, setTitle] = useState('');

	function submit() {
		handleSubmit({ title });
	}
	
	return (
		<div>
			<input 
				name="title" 
				value={title} 
				onChange={event => setTitle(event.target.value)}
			/>
			<button onClick={submit}>
				Submit
			</button>
		</div>
	);
}
```

Source: [https://react.dev/](https://react.dev/)