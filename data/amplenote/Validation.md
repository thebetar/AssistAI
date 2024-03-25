---
title: Validation
uuid: 50f73692-da0b-11ee-9a0e-ca8ae82b63ae
version: 2
created: '2024-03-04T09:38:36Z'
tags:
  - imported/markdown
  - programming
  - backend
  - quality
---

# Validation

Validation is an important part of dealing with data, after all you want to guarantee that you are getting the right amount of data and that the data is parsed in the correct way, for this there are a couple of libraries which use `validator.js` under the hood. This library is basically an enormous library with all kinds of regular expressions for every kind of data you would want to validate.

## Frontend

Within frontend applications usually the validation is written by hand. I like to use `validator.js` for this as well since it contains a lot of boilerplate code which I then do not have to write myself. The handling of the validation is done by custom code though so aside from using validator.js to validate the input given and returning a boolean regarding it’s validity it does not do much.

## Backend

Within backend applications there are more feature rich libraries. Like `express-validator` which provides a set of middlewares which can be used to check if the data received is correct and `nest.js` recommends `class-validator` which also uses `validator.js` under the hood but also adds support for decorators within classes which is the practise nest.js follows. Let’s briefly go over these two libraries and provide some examples

### Express-validator

Express validator provides a couple of neat middlewares that can be easily attached to route defined by the express server. The middleware can check the `params`, `query` or the `body`. These each have their own function which accepts a string of the property to validate on and the validation that is used is then chained on the result, this looks something like this.

```tsx
import { body, validationResult } from 'express-validator';

app.post('/users', body('email').isEmail(), (req, res) => {
	const result = validationResult(req);
	if(result.isEmpty()) {
		res.status(200).json({
			message: 'success'
		});
	}

	res.status(400).json({
		message: 'Validation failed',
		error: result.array()
	});
});
```

Within this example `validationResult` is also shown. This is used to get the result of the validation to see if it has succeeded or not and to send an appropriate response accordingly.

To target nested properties within an object like the body a dot notation can be used for instance like `body('user.email')` to validate on the email property within the user property.

To see what validation methods are available you can visit the docs ([https://express-validator.github.io/docs/api/validation-chain/](https://express-validator.github.io/docs/api/validation-chain/)).

## Class-validator

Class validator is a very popular library for project that have chosen the object oriented way of programming within their application. It makes use of decorators to validate properties.

It provides all of the validation methods that can also be found in the `validator.js` library but converts them to work with decorators. If you were to create a class with these decorators it would look something like this

```tsx
import {
	IsEmail,
	Length,
	IsDate
} from 'class-validator';

export class User {
	@IsEmail()
	public email: string;

	@Length(15, 45)
	public password: string;

	@IsDate()
	public createdAt: Date;
}
```

This defines a class with some validation now when creating an instance of this class it will be able to validate if the properties are set correctly when using the `validate` or `validateOrReject` function. Using this will look something like this.

```tsx
import {
	validate,
	validateOrReject
} from 'class-validator';

const user = new User();

user.email = 'john.doe'; // fails
user.password = 'thisisagoodpassword123'; // succeeds
user.createdAt = new Date();

validate(user).then(errors => {
	if(errors.length) {
		throw new Error('Validation error' + errors);
	}
	return true;
});

validateOrReject(user).then(() => true).catch(errors => {
	throw new error('Validation error' + errors);
});
```