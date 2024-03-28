---
title: Payload CMS
uuid: 5b3937c2-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:40Z'
tags:
  - javascript
  - frontend
  - cms
  - imported/markdown
  - programming
---

# Payload CMS

# Summary

Payload CMS is a new content management system that was created to be very barebones and easily customisable. The standard database used is MongoDB. This makes it very useful for developers using the MERN, MEVN or MEAN stack. This content management system is very new though so a lot of learning and fixing will have to be done by the developer.

# Configuration

Like explained in the summary payload’s strength is it’s simplicity. It is build on top of mongodb and within the configuration this is immediately apparent. Aside from some extra options that can be set the main thing that is defined in the main config is the collections that exist in the application. This looks something like this

```tsx
import { buildConfig } from 'payload/config';
import UsersCollection from './collections/users';

export default buildConfig({
	admin: {
		user: UsersCollection.slug
	},
	collections: [
		UsersCollection
	]
});
```

## Email

To use email within payload CMS the `payload` object can be used after logging in. This is done with adding the `email` property when `payload.init` is called. This can be found in the `src/server.ts` file if the project was generated and then adding the `email` property with the right information, this looks something like this

```tsx
payload.init({
	...,
	email: {
			transportOptions: {
				host: 'smtp.mail.com',
				port: 587,
				secure: false,
					user: 'john.doe@mail.com',
					pass: 'Password123',
				},
			},
			fromName: 'John Doe',
			fromAddress: 'john.doe@mail.com',
		},
});
```

## Collections

Collections are defined with the fields that should exist in the database and with which type. These types can be found here [https://payloadcms.com/docs/fields/overview](https://payloadcms.com/docs/fields/overview). Aside from defining the fields some other data needs to be defined. All the fields that are recommended are

- **slug** for naming the collection

- **defaultSort** for the way the list is sorted when showing

- **access** to define the access from the API to the data, default is off

- **labels** to define human readable labels for in the CMS

- **fields** to define the fields with types and names

- **indexes** to define indexes for in the MongoDB database this improves performance of the database

A collection looks something like this

```tsx
export const UsersCollection: CollectionConfig = {
	slug: 'users',
	defaultSort: '-createdAt',
	access: {
		read: () => true,
	},
	labels: {
		singular: 'User',
		plural: 'Users',
	},
	fields: [
		{
			name: 'email',
			type: 'email'
		},
		{
			name: 'password',
			type: 'text'
		},
		{
			name: 'username',
			type: 'text'
		},
		{
			name: 'createdAt',
			type: 'date'
		}
	]
};
```

### Hooks

Collections can also contain hooks. This is not common but for specific instances this is a very useful feature, for instance for sending emails to user with a specific setting. For this a hook can be created that triggers when a document is created for example in a collection named email to follow the example given, which triggers after the email document was created and then loops over all users that should receive this email and sends it. Payload CMS even supports nodemailer out of the box. Such a hook looks like this

```tsx
{
	...,
  hooks: {
    beforeChange: [
      async ({ data, operation, req: { payload } }) => {
        if (operation !== "create" && operation !== "update") {
          return data;
        }

        const users = await payload.find({
          collection: "users",
          where: {
            mail: {
              equals: true,
            },
          },
        });

        for (const user of users.docs) {
          await payload.sendMail({
            subject: data.subject,
            to: user.email,
            html: data.html,
          });
        }

        return data;
      },
    ];
  }
}
```

### Endpoints

When creating a full backend with payload CMS, most likely the standard generated routes won’t be enough, for instance if you want to get some data that is calculated from some documents, etc. For this custom endpoints can be used. These can be defined within collections and look something like this.

```tsx
export const Users: CollectionConfig = {
	slug: "users",
	fields: [
		// ...
	],
	endpoints: [
		{
			path: "/count",
			method: "get",
			handler: async (req, res, next) => {
				const response = await payload.find({
					collection: "users"
				});

				const users = response.docs;

				res.status(200).json(users.length);
			}
		]
};
```

In this example queries are used, read below for an explanation how these work.

## Query

A very powerful feature of payload CMS is the system to write queries. This is very useful when creating custom endpoints or using hooks. Queries are used for getting, creating, updating and deleting data from the database. Using queries looks something like this

```tsx
export const Orders: CollectionConfig = {
  slug: "orders",
  fields: [
    // ...
  ],
  endpoints: [
    {
      path: "/:id/status",
      method: "get",
      handler: async (req, res, next) => {
				const response = await payload.find({
					collection: "orders",
					where: {
						id: {
							equals: req.params.id
						}
					},
					sort: "-createdAt"
				});

				const order = response.docs[0];
				
				res.status(200).json({ status: order.status });
      },
    },
  ],
};
```