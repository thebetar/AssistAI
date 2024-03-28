---
title: Mongoose
uuid: 58a9bd2e-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:40Z'
tags:
  - javascript
  - database
  - imported/markdown
  - programming
  - orm
---

# Mongoose

Mongoose is a simple yet feature rich ORM specifically designed for use with MongoDB. It works with the concepts of Schemas and Models. These are used to define the data and create a model to interact with the database.

# Schema

Schema’s define the data structure of the documents that will live in the conneced MongoDB database. Fields are defined in a schema and their types and other options a basic schema is created like this

```jsx
const userSchema = new Schema({
	firstName: {
		type: String,
		required: false
	},
	lastName: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: true
	}
});
```

In this example there are two properties that are defined `type` and `required` these annotate the type that the value must hold and if this field is required in the document or not. Mongoose will throw an error if a document is trying to get created which does not contain a required field.

## Schema field options

Schemas support a lot of different options for defining fields in the Schema some interesting ones are

- `type` the type property defines the type that the field will hold, this can be any standard type within javascript

- `required` the required property defines if a field is required or not and will throw an error if a document is trying to be created without this field

- `index` the index property defines if a field needs to be indexed in the mongodb database. This means that the database will create an index so the documents can be queried faster.

- `default` the default property accepts a function which is called when a document is created, this can be used to for instance create a date for a field or to generate an ID, but this can be any function that returns a value.

- `validate` the validate property accepts a function which gets called by the value of the field that has been created and has to return a boolean. If the boolean returned is `false` it will stop the creation or updating of the document

## Schema options

Schemas also support some options for the schema itself this can be helpful when a schema needs some extra functionality or defaults some interesting ones are

- `timestamps` automatically creates the fields `createdAt` and `updatedAt` and updates them automatically according to what their name describes.

- `collection` assigns the collection which the schema should be added to, if not defined it will take the name defined in the `Model`

## 

# Models

Models are constructors that use a schema to create an object that contains functions to be used in the server to access the database. Where the schema is used to define what the documents look like the Model is used to make this usable. Create a model looks like this

```jsx
const userModel = model('Users', userSchema, 'users');
```

The object returned contains the functions that can be used to access the data like this

```jsx
const user = await userModel.findOne({ email: 'john.doe@mail.com' });
```

To create a document the best way is like this

```jsx
const newUser = new userModel(userObj);
```

The other queries that can be used are

- `find` to find multiple documents

- `findOne` to find a single document

- `findById` to find a single document by id

- `insertMany` to insert multiple documents

- `updateMany` to update multiple documents

- `updateOne` to update a single document

- `findByIdAndUpdate` to find a single document by id and update

- `deleteMany` to delete multiple documents

- `deleteOne` to delete a single document

- `findByIdAndDelete` to find a single document by id and delete