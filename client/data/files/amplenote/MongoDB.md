---
title: MongoDB
uuid: 4de55b82-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:34Z'
tags:
  - javascript
  - imported/markdown
  - programming
  - database
---

# MongoDB

## Summary

Like most Javascript developers I love it that MongoDB delivers my data as `BSON` which is a superset of `JSON`. This makes it very easy to work with `MongoDB`. How I like to see this database is as some separate drawers of  data where I can decide myself what I write in each document. This is a real strength but can also be a weakness of `MongoDB`. It is easy to make changes on the fly but if you are not careful you data can get really unorganised where some documents contain some data and others don’t. Furthermore a downside to `MongoDB` is that it does not support `foreign keys` which means you cannot link documents together. Some ORMs fix this by doing a separate query under the hood, but this is inefficient. To sum up in which cases I use `MongoDB` is when I have a clear idea what data I will store and where efficiency is not key I always go for `MongoDB`, it is just easier to work with and the speed is in 99% of the cases I work with more than enough. The only exception is application where a lot of data needs to be linked with `foreign keys`.

## Querying

To query MongoDB you can use `Javascript` based queries. This really handy if you are an adept `Javascript` user. A query will look something like this

```jsx
db.users.findOne({ 
	email: "john.doe@mail.com" 
});
```

You can even use native Javascript functions to create something like a date

```jsx
db.users.insertOne({ 
	email: "john.doe@mail.com", 
	createdAt: new Date().toISOString() 
});
```

## Indexing

To improve the speed at which MongoDB can find data you can create `indexes` these are pre configured lists sorted based on a specified query where `MongoDB` will be able to find the document more quickly. For instance if you query by the `email` field ofter you can create and index for this in the following way

```jsx
db.users.createIndex({
	email: 1
});
```

Also some options can be provided like if this value has to be `unique` which is nice for something like this example (email). Also you can add a `name` for the index. When using these your code will look something like

```jsx
db.users.createIndex(
	{
		email: 1,
	}, 
	{
		name: "email-asc",
		unique: true
	}
);	
```

### Partial indexes

A neat way to improve the performance even more is by using the `partialFilterExpression` option when using this you create what is called a **partial index** this means that the index does not contain all the documents and will also only be used if the query falls within the partial index so lets say you want to query clients with a lot of credits.

```jsx
db.users.createIndex(
	{
		credits: 1,
	},
	{
		name: "large-customers",
		partialFilterExpression: {
			credits: {
				$gte: 500
			}
		}
	}
);
```

This **partial index** will only be used when you query something like

```jsx
db.users.find({ credits: { $gte: 800 } });
```

As you can see this will not match the full index but since every `user` with more than `800 credits` will be represented the index will be used. I have rarely used this feature since I was not in need of the performance increases that this provided.

### Text indexes

One more type of index that I have used is a **text index**. This is used if you for instance want to create a query where you search for blog posts contain some text within the `title` or `description`. You can create one of these indexes like this

```jsx
db.posts.createIndex({
	title: "text",
	description: "text"
});
```

Then you can start querying within this `collection` with the following statement

```jsx
db.posts.find({
	$text: {
		$search: "Lorem"
	}
});
```

## MongoDB compass

I recommend using MongoDB compass for getting a better more visual overview of what documents you have in your `collections`

Source: [https://www.mongodb.com/](https://www.mongodb.com/)