---
title: Express js
uuid: 576b75f6-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:38Z'
tags:
  - javascript
  - backend
  - framework
  - imported/markdown
  - programming
---

# Express.js

Express is a self proclaimed “Minimalist” framework. This means that it is has little features aside from what is needed. Even though this is the case Express is still very flexible. What I really like is that time from idea to a working application is very small.

With Express the developer has to keep in mind that the structure of the project should be maintained by the developer, there is no enforced way to work. This is a strength and a weakness. This makes it so you can create your endpoints and logic in any way you want, but might cause some trouble when scaling up.

I really like to use the structure that Nest.js enforces within Express.js. This makes the application very resilient even when scaling up, while keeping the freedom to write code in your own way if you want to. This flows really well with the style of coding I really like. First write the code so it works but without paying to much attention to code best practices, and after the code is done refactor the code so the coding standards are adhered to, express gives this freedom.

Express also has a lot of nice packages that can be used like `express-validator` for validating data easily using middlewares and much more. But first lets get into the base concepts of express.

## **Application**

The application is really easily created within express. You can do this with only a few lines of code. Within the example I will be using the module structure that is used when working with typescript since I think it is important to always go for typescript instead of javascript.

```jsx
import express from 'express';

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
	res.status(200).send({ message: 'Hello world' });
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
```

And that’s all the code that is needed to start an express server. Of course this is not enough to create a full scale application but this is the start!

Another handy feature the **Application** object has is the `.set` and `.get` functionality. This way you can set some data across the application and get it within another route on a different request. This is used like this

```jsx
app.set('key', 'value');

const value = app.get('key'); // 'value' is returned
```

## **Router**

When the application is created you can start thinking about routing. In the code above you see a small example of how to listen on a route with `.get('/', (req, res) => ...` this of course does not scale up very well. For this the `Router` class is used. An example of a router for a `Blog` is the following

```jsx
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	// Some logic to get blogs goes here;
	return data;
});

router.get('/:id', (req, res) => {
	// Some logic to get a blog goes here;
	return data;
});

router.post('/', (req, res) => {
	// Some logic to create a blog goes here;
	return blog;
});

router.patch('/', (req, res) => {
	// Some logic to update a blog goes here;
	return blog;
});

router.delete('/', (req, res) => {
	// Some logic to delete a blog goes here;
	return blog;
});

app.use('/blogs', router);
```

Basically it is a sub object which you can bind to a route where every route from there is handled. This example above is pretty extensive and shows you the average routes you will use in an average CRUD application. Express does not handle the getting of data and the business logic that is handled. This is done by some custom written code for logic and the `ORM` for reading and writing data to and from the database. The methods available are the `get`, `post`, `patch`, `put`, `delete` and the `all` methods. Where each handles their own method except `all` which catches all different methods.

To define routes all kinds of things can be used but in most cases the following patterns are used

- `/path`

- `/path/:id`

- `/path/\*`

- `/path/:id?`

## Middleware

Express also supports middleware. This is some code that you can create to run before or after a handler to do some validation or add some data to the request. The most common usage is for authentication. Something like this.

```jsx
const AuthMiddleware = (req, res, next) => {
	if(req.token) {
		// Some logic to authenticate the user by token;
		return next();
	}
	res.status(401).send({ message: 'You are not logged in' });
};

router.get('/personal-data', AuthMiddleware, (req, res) => {
	// Some logic to get some personal data;
	return data;
});
```

As you see above it handles some logic and then `next` can be called which will move on to the next handler that is defined in the method of the router. If `next` is not called it will not go to the next method and the request will not go through. A very well known middleware which I use in every project is the `body-parser` middleware. This middleware parsers `JSON` data that is send as a request.

Another very important middleware is the `cors` middleware. This is used to define where requests can come from. It is good to handle this carefully so your express server only sends data to your web server and your web server only send data to your express server.

## Request

The request object contains a lot of data that can be used in all kinds of ways. You can access header from the request body which are used to get some data from the client to the server without making a mess of the request object, think about a token or some locale that the client want to send with their request. Also the `ip` address of the client is sent so you can recognize who is who without needing people to login (of course this is not as accurate since one person can use multiple devices. or the other way around). Also parameters can be send when you define a route with `/:id` with this example the parameters can be accessed like this

```jsx
router.get('/:id', (req, res) => {
	const id = req.params.id;
	// Some logic to get a specific blog by id
	return blog;
});
```

This can also be done with the `query` object but you do not need to defined this this can be accessed using `req.query.id`. Another powerful feature when handling parameters is setting them as optional like this

```jsx
router.get('/:id/:field?', (req, res) => {
	const id = req.params.id;
	const field = req.params.field;
	// Some logic to get a specific blog by id and only return some fields that are defined;
	return blog
});
```

Source: [https://expressjs.com/](https://expressjs.com/) 