---
title: Sessions tokens
uuid: 594ad5e2-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:40Z'
tags:
  - imported/markdown
  - backend
  - programming
  - security
  - authentication
---

# Sessions / tokens

## JWT

`jsonwebtoken` for creating tokens that are sent with the request header as a bearer token. This is the simplest way of authentication and is the go to way when learning `node.js` because of this. The token is created with a secret only known to the server which is used to encrypt and decrypt the token. When logging in the server sends back the token with the user data stored inside of it in an encrypted token. On the next request this token can be decrypted and used to check that a specific user is sending a request.

Creating a token looks like this

```tsx
import { sign } from 'jsonwebtoken';

app.post('/login', (req, res) => {
	const user = await UserModel.findOne({ email: req.body.email });
	// Logic for checking password
	const token = sign({ userId: user._id }, process.env.JWT_SECRET); // Generates a JWT

	res.status(200).send({ token });
});
```

Authenticating using a token looks like this

```tsx
import { verify } from 'jsonwebtoken';

const AuthMiddleware(req, res, next) {
	if(req.headers?.authorization) {
		try {
			const token = req.headers.authorization.split(' ').pop(); // Token is usuallly stored with 'Bearer ' in front
			
			const { userId } = verify(token, process.env.JWT_SECRET);
			req.headers.userId = userId;
			next(); // Go to request
		} catch(_) {
			return res.status(401).send({ message: 'Invalid token' });
		}
	}
	return res.status(401).send({ message: 'Authorization header missing' });
}

app.get('/cars', AuthMiddleware, (req, res) => {
	const cars = await CarModel.find({ userId: req.headers.userId });
	res.status(200).send({ cars });
});
```

## Passport.js

Aside from creating your own `jsonwebtoken` and verifying it, passport.js can also be used. This is a very well known library within the node.js space which handles authentication. The above example is a simple way of handling authentication is good for small applications, but for bigger applications `passport.js` is preferred. Passport.js contains a lot of build in functionality and provides a large number of strategies to authenticate. The most common way is to use the username and password method using sessions with the `passport-local` strategy. If OAuth or SAML authentication ways are needed, `passport.js` also supports this!

One of the drawbacks of `passport.js` is that it still uses a lot of callbacks which in current coding standards make the code a little unreadable.

To start using passport first the passport session needs to be initialised like this

```tsx
import passport from 'passport';

app.use(passport.initialize());
app.use(passport.session());
```

To create an authentication route using passport.js your code should look something like this

```tsx
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { compareSync } from 'bcrypt';

passport.use(new LocalStrategy((username, password, callback) => {
	const user = UserModel.findOne({ username });

	if(!user) {
		// Exception if no user with username exists
		return callback(null, false, { message: 'User does not exist' });
	}
	
	if(compareSync(password, user.password)) {
		// Success if user exists and password compare is successful
		return callback(null, user);
	}

	// Exception if password compare failed
	return callback(null, false, { message: 'Incorrect password' });
});
```

Now that the middleware is setup it can be used by the `express.js` application like this

```tsx
app.post('/login', passport.authenticate('local'), (req, res) => {
	res.status(200).send({ message: 'Logged in successfully' });
});
```

Now the authentication part is done, but we still need a way to protect the routes that should be protected in a way. How will they know the user is logged in already so they can return some data. Passport.js uses sessions for this, in this example we will use `express-session` like this.

```tsx
import session from 'express-session';

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false, // For deprecation warnings
	saveUninitialized: false, // For deprecation warnings
});
```

Once this is setup every route will be protected by the `LocalStrategy` unless the `passport.authenticate` middleware is called.