---
title: ORM
uuid: 4abeb2a0-da0b-11ee-a972-c250cfa702b7
version: 6
created: '2024-03-04T09:38:32Z'
tags:
  - database
  - orm
  - imported/markdown
  - programming
---

# ORM

ORM stands for Object relational mapping. Which means… I don't really know. But I do know what it does!

An ORM is a backend developers favorite tool to interface with the database. What it does is create an easy way to define your database models in code and use the templates you write to create tables or collections in your database.

ORMs can do even more like validating your data before you write it to your database. This is really useful so you have another check on your data before writing it to the database.

Aside from being able to define what data you want with which properties an ORM also gives a really neat way to communicate to the database and to query it. With most ORMs you don’t even need to know a single SQL query to be able to use an SQL database. This makes it that as a backend developer you only need to know how to host a database (and secure it) to be able to be a database master!

Some of my favorite choices are `Prisma`, `mongoose` and `typeORM`. I have to admit that my favorite from these three is definitely `Prisma` since creating the template is really easy and organized. Also the features to query data are very rich. I used to be an avid user of `mongoose` since my preferred stack is the `MEVN` stack. But I ran into some issues when trying to `populate` data, which I know if you want relationships between data you’re better off using a relational database. And `Prisma` also supports a lot of different databases so if you master this tool you are able to use a lot of different technologies.

Again each of the above mentoined technologies will get their own page but here are some short summaries of why each is a favorite of mine

## [Prisma](ORM.md)

Prisma is easy to work with, has a nice templating syntax and can be used on a wide variety of database technologies. This makes it perfect for almost every project. It works with two aspects, the schema which lives in a separate `schema.prisma` file and the client which has the ability to read the schema and provide typing on it’s client. When using the client I have not come across a query that Prisma does not support yet which is amazing.

## Mongoose

Mongoose is specifically for `MongoDB`. Which makes it good in a lot of projects (see my opinion about mongodb [here](MongoDB.md)). Mongoose is a simple ORM that serves all the functionality that you would typically need in a project. But the problem is that sometimes you do not know at the start what queries you are going to want. Which makes it not preferable for me to use it anymore.

## TypeORM

TypeORM like prisma is very feature rich, but sadly I am less of a fan of the usage of this framework. I do use it in projects where I write my backend in `Nest.js` since it is the advised standard for this framework.

[Prisma](Prisma.md)

[Mongoose ](Mongoose.md)