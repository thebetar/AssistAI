---
title: Prisma
uuid: 580b49dc-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:40Z'
tags:
  - javascript
  - imported/markdown
  - orm
  - programming
  - database
---

# Prisma

## Summary

Prisma is easy to work with, has a nice templating syntax and can be used on a wide variety of database technologies. This makes it perfect for almost every project. It works with two aspects, the schema which lives in a separate `schema.prisma` file and the client which has the ability to read the schema and provide typing on it’s client. When using the client I have not come across a query that Prisma does not support yet which is amazing.

## Schema

Within the schema you can create the models for the types of data you want to store within your chosen database stack. Other configuration for Prisma also lives in the schema. It consists of three main parts. The data sources to define the connection, the generator to define what generation model to use and the data models which define the data. After creating the configuration you can run `npx prisma generate` to generate the prisma client and `npx prisma db push` to push the models to the database.

### Data sources

Within the datasources part of the schema the connection to the database. Here you define what url prisma can use to connect to the database and what type of database it is, this looks something like this

```graphql
## For MongoDB
datasource db {
	provider = "mongodb"
	url      = "http://localhost:27017/mydb"
}

## For postgres
datasource db {
	provider = "postgresql"
	url      = "http://localhost:5432/mydb"
```

Within the `datasource` it is also nice to use the `env('VARIABLE')` command, this uses and environment variable to set the value this looks something like

```graphql
datasource db {
	provider = "mongodb"
	url      = env("DATABASE_URL")
```

### Generators

Within the generators part you can define what parts are generated, currently only `prisma-client-js` is supported, defining this looks someting like

```graphql
generator client {
  provider = "prisma-client-js"
}
```

The generate is what is used to take the information from the schema and generate the code needed when running `npx prisma generate`

### Data models

The part where most of the configuration is done is the data models part, here the data models used are defined which will be created as table or collections in the database depending on which database you use and queries will be generated on the prisma client to access from the backend to query to the database. Defining a model also has some attributes which can be used. Defining a simple model looks something like this

```graphql
model User {
  id       String   @id @default(auto()) @map("_id") @db.ObjectId
  email    String   @unique
  name     String?
	password String
}
```

With each field in the model a `Scalar type` should be provided, within these the standard type exist  like `String`, `Boolean`, `Number`, etc.

**Relational fields**

A very powerful feature of Prisma is using relational fields to connect your models together. The queries that can be written on these relational fields are also really powerful. A relational field looks something like this

```graphql
model Post {
	id             Int    @id @default(autoincrement())
	title          String
  description    String
  comments       Comment[]
}

model Comment {
  id      Int    @id @default(autoincrement())
  post    Post?   @relation(fields: [postId], references: [id])
  postId  Int?
```

**Attributes**

After filling in the fields and the scalar types some fields still need some extra to be able to default to a certain state or map the data to a differently named field in the database, attributes are used for this, for instance to generate and id which defaults to a value. The attributes defined by Prisma are the `@id`, `@default`, `@unique`, `@index` and `@map`. Aside from this also some logic can be accessed using the `@db` attribute which will give methods specific to the database used. When combining this to create a user this can look something like this

```graphql
model User {
	id          String @id @default(auto()) @map("_id") @db.ObjectId
  email       String @unique
  name        String

	@@index([email])
}
```

Within this example the `@id` attribute defines which property will be the primary key and by extension the unique identifier, the `@default` call what is defined within it which is this case is the is `auto()` which generates an ObjectId. The `@map` attribute is used to map the required `id` field to the `_id` field that is used by MongoDB. The `@unique` attribute defines a field which must be unique so if another item is added with the same value as in another this will throw an exception. And lastly the `@@index` to define an index.

**Enums**

Sometimes a field can only have a certain set of values for this case an enum is used. This defines the values that can be used and does not allow a value outside of this. This looks something like this

```graphql
model User {
  id     String  @id @default(autoincrement())
  email  String  @unique
  name   String
  role   Role    @default(USER)
}

enum Role {
  AUTHOR
  USER
  ADMIN
}
```

**Composite types**

Composite types sound scarier than they actually are, basically this is used to define a type which should not have a separate model in the database for an address object on an order, like this

```graphql
model Order {
  id         String  @id @default(autoincrement())
  amount     Int
  product    Product @relation(fields: [productId], references: [id])
	productId  Int
  address    Address
}

type Address {
  street     String
  postalCode String
  city       String
}
```

## Client

After the schema has generated the Prisma Client this can be used using the `@prisma/client` dependency. Now the fun can begin! To initialise the Prisma client use this

```tsx
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

### Querying

Once the client is initialised the querying of data can start! On the `prisma` variable all the models exist that were generated by the schema. For instance if you have created a `model User` the prisma client can now be used like this

```tsx
const user = {
	email: 'john.doe@mail.com',
  name: 'John Doe'
}

async function create() {
	await prisma.user.create(user);
}

async getByName(name: string) {
  const user = await prisma.user.findUnique({
		where: {
			name
		}
	});

	return user;
}
```

The queries that can now be used are

- `.findUnique` to find unique

- `.findUniqueOrThrow` to find unique or throw

- `.findFirst` to find first in case that there is more than one

- `.findFirstOrThrow` to find first in case that there is more than one or throw

- `.findMany` to find list

- `.create` to create one

- `.createMany` to create more than one

- `.delete` to delete one

- `.deleteMany` to delete many

- `.update` to update one

- `.updateMany` to update many

- `.upsert` to update one and if not exists create one

- `.count` to count result

Each query is self descriptive in what you can do with them and what they are used for. To write a query prisma has query options, for the examples I will use `.findUnique` but of course other queries can be used as well. Be aware that the queries relating to creation and updating also need the `data` query option to define the data that needs to be posted or updated.

### Query options

**where**

Where can be used to query a field with the same corresponding keys like this

```tsx
getById(id: string) {
	const user = await prisma.user.findUnique({
		where: {
			id
		}
	});
	return user;
}
```

Where also has a lot of options for querying with conditions like `endsWith`, etc. these can be found on their website.

**select**

Select can be used to determine which data is returned from the query, this comes in handy if you do not want the user to have access to hash you have stored for their password for instance, using this looks like

```tsx
getByEmail(email: string) {
	const user = await prisma.user.findUnique({
		where: {
			email
		},
		select: {
			email: true,
			name: true
		}
	});
	return user;
}
```

**include**

Include is used to also query the relations that are defined within a model for instance if we would use our example with a Blog it would look something like this

```tsx
getByTitle(title: string) {
	const blog = await prisma.blog.findUnique({
		where: {
			title
		},
		include: {
			comments: true
		}
	});
	return blog;
}
```

### Nested queries

Sometimes when creating a new item some items relating to this item have to be created as well, for example if in a store a user signs up while making their first order this can be done with nested queries

**create**

With create a single item can be created that is immediately connected to the main item

```tsx
const author = await prisma.author.create({
	data: {
		name: "John Doe",
		email: "john.doe@mail.com",
		blogs: {
			create: {
				title: "Lorem ipsum"
				description: "Lorem ipsum"
			}
		}
	}
});
```

Sometimes creating one item is not enough for instance when migrating something for this you can pass an array to the create property like this

```tsx
const author = await prisma.author.create({
	data: {
		name: "John Doe",
		email: "john.doe@mail.com",
		blogs: {
			create: [
				{
					title: "Lorem ipsum"
					description: "Lorem ipsum"
				},
				{
					title: "Ipsum lorem",
					description: "Ipsum lorem"
				}
			]
		}
	}
});
```

**connect**

If you want to add something that should be connected to an already existing item let’s say a blog post to an author that was already created this can be done using connect like this

```tsx
const blog = await prisma.blog.create({
	data: {
		title: "Lorem ipsum",
		description: "Lorem ipsum",
		author: {
			connect: {
				email: "john.doe@mail.com",
			}
		}
	}
});
```

**connectOrCreate**

The two nested queries above can also be combined to check if the connection can be established and if not to create an item some extra data has to be provided though

```tsx
const blog = await prisma.blog.create({
	data: {
		title: "Lorem ipsum",
		description: "Lorem ipsum",
		author: {
			connectOrCreate: {
				where: {
					email: "john.doe@mail.com",
				},
				create: {
					name: "John Doe",
					email: "john.doe@mail.com"
				}
			}
		}
	}
})
```