---
title: Typescript
uuid: 5f179820-da0b-11ee-9a0e-ca8ae82b63ae
version: 4
created: '2024-03-04T09:38:42Z'
tags:
  - imported/markdown
  - programming
---

# Typescript

Typescript is a superset originally created to add types to javascript. Since javascript is type inferring language it does not support types (although it will in a future update as an option). This creates some issues when scaling your codebase up to bigger project since you will not know what type a paramtere should be to a function or what the function will even return, for this types are very handy. Aside from this typescript has also gained a lot of functionality over they ears

## Type vs Interface

When deciding between using types and interfaces the rule most of the time is use `type` as long as you do not necessarily need an `interface`

## Basic types

Tyepscript supports some basic types which are

- `number` for numbers, typescript does not make a difference between floats, integers, etc.

- `string` for strings

- `boolean` for true or false values

- `void` for when nothing is returned

- `undefined` for undefined values

- `null` for null values

- `unknown` for unknown values

- `any` for values that can be any type


  ```tsx
  string[]
  number[]
  boolean[]
  // etc...
  ```

These can be used on variables and functions like this

```tsx
const stringValue: string = "Lorem ipsum";

function foo(x: string, y: number): string {
	return x + " ".repeat(y);
}

foo(stringvalue, 5);
```

## Object types

Within typescript you can also define objects with values this is done with the object notation and using basic types in tandem like this

```tsx
const object: {
	name: string;
	address: string;
	dateOfBirth: string;
} = {
	name: "John Doe",
	address: "Frontendstreet 1",
	dateOfBirth: "1999-08-06"
};
```

or if you want to declare the type as a variable like this

```tsx
type PersonType = {
	name: string;
	address: string;
	dateOfBirth: string;
};

const object: PersonObjectType = {
	name: "John Doe",
	address: "Frontendstreet 1",
	dateOfBirth: "1999-08-06"
};
```

within objects you can also have properties which are **optional** these are properties which are not mandatory within the object. Normal behaviour will have typescript throwing errors because the property which is defined does not exist. Optional properties omit this. The example can be changed to include this like this

```tsx
type PersonType = {
	name: string;
	address?: string;
	dateOfBirth?: string;
};
```

be aware that when using these properties they will now have a type of the defined type or undefined

Objects can also be made arrays by appending the `\[\]` basic type after the type this is done like this

```tsx
type PersonType = {
	name: string;
	address?: string;
	dateOfBirth?: string;
};

const persons: PersonType[] = [
	{
		name: "John Doe"
	},
	{
		name: "Jane Doe",
		dateOfBirth: "1999-08-06"
	}
];
```

## Operators

Within typescript you can also define a prop or variable to have more than one type with the `\|` operator or you can extend a type by using the `&` operator. These can be used like this

```tsx
type PersonType = {
	name: string;
	age: string | number;
};

type PersonWithAddressObjectType = PersonObjectType & { address: string };
```

## Generics

### Generic types

In some cases where you do not want to use `unknown` or `any` to define some property type but want to be able to pass a type to your type to declare what type the prop is you can use generics. For instance if you have an unknown type within an object which can be multiple things in multiple instances. This can be done like this

```tsx
interface Box<Type> {
	contents: Type;
}

type NumberBox = Box<number>;
type StringBox = Box<string>;
```

This is powerful stuff when scaling up and having bigger interfaces where for instance you have a dataobject where a field can be joined already or not

```tsx
interface User {
	name: string;
	skills: string[];
}

interface JobOffer<UserType> {
	title: string;
	description: string;
	branch: string;
	user: UserType;
}

const user = getFromDatabase() as JobOffer<string>;
const userWithJoin = joinUserField(user); as JobOffer<User>;
```

### Generic functions

This can also be used on functions to create a generic function

```tsx
// From
function multiply(value: any): any {
	if(typeof value === 'number') {
		return value * 2;
	} else if(typeof value === 'string') {
		return value.repeat(2);
	} else {
		return value;
	}
}

// To
function multiply<T>(value: T): T {
	if(typeof value === 'number') {
		return value * 2;
	} else if(typeof value === 'string') {
		return value.repeat(2);
	} else {
		return value;
	}
}
```

The big advantage of this is that typescript knows what the return value of the function is. A case where this would be a bigger advantage is the following

```tsx
interface User {
	name: string;
	skills: string[];
}

interface JobOffer<UserType> {
	title: string;
	description: string;
	branch: string;
	user: UserType;
}

async function getJobOffer<T>(id: string, populated = false): JobOffer<T> {
	if(populated) {
		return await jobOfferModel.findById(id).populate('user');
	} else {
		return await jobOfferModel.findById(id);
	}
}

const jobOffer = getJobOffer<User>('11', true);
// Works
console.log(jobOffer.user.name);
```

### **Constraints**

When using generic functions you can also use constraints to limit the properties that can be accessed by the function this is done using the `extends` keyword for instance if you would do something with the job offer created by the example above this would look something like this

```tsx
async function shortenDescription<T extends { description: string }>(
	jobOffer: JobOffer<T>
): JobOffer<T> {
	return {
		...jobOffer
		description: jobOffer.description.slice(0, 20)
	};
}

shortDescription<string>(jobOffer);
```

## Classes

Classes used to be something that were only available in Typescript, but since es2015 they have also been added to javascript as syntactic sugar. Typescript can still be used to give the properties within classes types which javascript still cannot do. Also interfaces do not exist in javascript yet so the `implements` keyword is typescript specific. Finally typescript also supports visiblity classes. An example class would look something like this

```tsx
class User {
	private _name: string;
	public age: number;
	public addres?: string;

	constructor(name: string, age: number, address?: string) {
		this._name = name;
		this.age = age;
		this.address = address;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string): void {
		this._name = value;
	}

	public doubleAge(): number {
		this.age = this.age * 2;
		return this.age;
	}
}

const user = new User("John Doe", 23);
```

within a class you can define properties and methods. To declare how the initialisation is done in the constructor. As you can see in the example to access the properties within the class the `this` keyword is used. This also has to be done to access the methods.

within this example there are some things to see lets walk through them

### Visiblity classes

Within typescript there are three visibility classes known

- `public` for properties that can be accessed from outside the class on the entity created like this


  ```tsx
  class User {
  	public name: string;
  
  	getName() {
  		return this.name;
  	}
  }
  
  const user = new User();
  console.log(user.name); // Returns name
  console.log(user.getName()); // Returns name
  ```

- `private` for properties that should not be accessed from outside of the class, even subclasses cannot access these properties


  ```tsx
  class User {
  	private name: string;
  
  	getName() {
  		return this.name;
  	}
  }
  
  const user = new User();
  console.log(user.name); // Returns error
  console.log(user.getName()); // Returns name
  ```

- `protected` for properties that should not be accessed from outisde of the classes, but have to be able to be accessed from sub classes.

### Readonly

For the readonly property I can be very brief, when a property is declared with the `readonly` property it means that the value cannot be changed this looks something like this

```tsx
class User {
	public name: string;
	public readonly classType = 'USER';
}
```

### Heritage

Since javascript also supports classes nowadays the `extends` keyword can also be used in plain javascript, however the `implements` keyword is still unique to typescript. These are used to create a class that is like it’s superclass or interface, how i like to look at these is

- `extends` to create a class that has everything the superclass has and more!

- `implements` to use the interface as a architectural drawing for your class, you still need to buid everything yourself this will just tell you what you need to at least build for it to confirm to the interface

A good example of this is with animals like this

```tsx
class Animal {
	public legs: number;
	public name: string;

	constructor(legs: number, name: string) {
		this.legs = legs;
		this.name = name;
	}
}

class Bird extends Animal {
	public wings: number;

	constructor(legs: number, name: string, wings: number) {
		super(legs, name);
		this.wings = wings;
	}
}

const bird = new Bird(2, "Dove", 2);
console.log(bird.name); // Returns Dove
```

be aware that when using the `extends` keyword that you also need to call the `super` method if the superclass contains a constructor.

If this example would be recreated with an interface it would look something like

```tsx
interface Animal {
	public legs: number;
	public name: string;
}

class Bird implements Animal {
	public legs: number;
	public name: string;
	public wings: number;

	constructor(legs: number, name: string, wings: number) {
		this.legs = legs;
		this.name = name;
		this.wings = wings;
	}
}

const bird = new Bird(2, "Dove", 2);
console.log(bird.name); // Returns Dove
```

the main difference here is that the interface only describes which fields need to be present in the inheriting class. The main difference in usage is that the interface cannot be used by itself while the class can.

### Static members

A class can also contain static properties and methods. The difference between a normal property or method and a static one is that static members do not live on the created instance, they live on the class like it is an object. This looks something like this

```tsx
class Object {
	public x = 5;
	public y: number;
}

const object = new Object();
console.log(object.x); // Returns 5

class StaticObject {
	public static x = 5;
	public static y: string;
}
console.log(StaticObject.x); // Returns 5
```

to access static properties it is preferred to also use the `ClassName.property` syntax instead of `this.property`

### Getters and setters

As shown in the example you can also set getters and setters, these can be used if you want the value to be set in a specific way or to be returned in a specific way. The convention is to add a `_` before the private property that the getter and setter access a simple example of this is

```tsx
class User {
	private _name: string;

	constructor(name: string) {
		this._name = name;
	}
	
	get name(): string {
		return this._name;
	}

	set name(value: string): void {
		// some logic to check if the name is valid
		this._name = value;
	}
}
```

## Configuration file

I have struggled many times configuring a typescript project to do the correct things that I want. After finally having taken the time to read the documentation my long days of fighting are over! Here are some of the things I learnt

- **include** to define which files to include in the compilation

- **exclude** which paths to exclude from the include

- **compilerOptions** to specify how to compile the end result

    - **Type checking** is a list of checks to do on compilation the available checks can be found here (docs: [https://www.typescriptlang.org/tsconfig](https://www.typescriptlang.org/tsconfig))

    - **Modules** defines how modules are handled within typescript specific options can be found in the docs ([https://www.typescriptlang.org/tsconfig](https://www.typescriptlang.org/tsconfig)) but let’s discuss the most important here as well

        - **module** define what the resulting format of the modules created by typescript will be these are

            - **CommonJS** for node.js modules

            - **ESNext** for browser supported modules

            - **UMD** for universal usage

    - **Emit** defines which files are emitted specifics can also be found in the docs ([https://www.typescriptlang.org/tsconfig](https://www.typescriptlang.org/tsconfig)) but here are some commonly used properties

        - **outDir** defines the name of the directory which the files are compiled to

        - **soureMap** enables source maps to the pre compiled code, this is good for development but not recommended for production

    - **Javascript support** Javascript can also be supported this is useful when migrating step by step from a javascript codebase

        - **allowJs** allow javascript files to be imported into typescript files

        - **checkJs** do the same checks on javascript files as on typescript files (allowJs has to be active for this)

    - Other types are also available but not generally used see the docs ([https://www.typescriptlang.org/tsconfig](https://www.typescriptlang.org/tsconfig)) to find these.

# Completed tasks<!-- {"omit":true} -->

- [x]  for array types these have to be behind a type to make it an array like this<!-- {"uuid":"88b5cac3-3ca3-4bd7-92f1-d9be4a76f5f7"} -->