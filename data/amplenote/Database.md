---
title: Database
uuid: 3fd8e158-da0b-11ee-9a0e-ca8ae82b63ae
version: 6
created: '2024-03-04T09:38:26Z'
tags:
  - imported/markdown
  - programming
  - database
---

# Database

Databases are very important because they essentially store all the data gathered from your users. The application can disappear and you can just pull another copy from your repository and you're back in the game. Things are not this easy with databases. While your application will work again all data will be lost.

This makes data resiliency very important within databases where this is not as important with **[Frontend](Frontend.md)** and **[Backend](Backend.md)**.

Furthermore there are things like the amount of data and the speed you need the data with things to consider. The two database technologies that I prefer are `MongoDB` and `Postgres`.

Within this page I will not have a lot to tell about the aspect of databases I will only go into why I like `MongoDB` and `Postgres` a little bit here and write separate pages for each as well. Data resiliency will be discussed in **[Operations](Operations.md).**

### [MongoDB](MongoDB.md)

Like most Javascript developers I love it that MongoDB delivers my data as `BSON` which is a superset of `JSON`. This makes it very easy to work with `MongoDB`. How I like to see this database is as some separate drawers of  data where I can decide myself what I write in each document. This is a real strength but can also be a weakness of `MongoDB`. It is easy to make changes on the fly but if you are not careful you data can get really unorganised where some documents contain some data and others don’t. Furthermore a downside to `MongoDB` is that it does not support `foreign keys` which means you cannot link documents together. Some ORMs fix this by doing a separate query under the hood, but this is inefficient. To sum up in which cases I use `MongoDB` is when I have a clear idea what data I will store and where efficiency is not key I always go for `MongoDB`, it is just easier to work with and the speed is in 99% of the cases I work with more than enough. The only exception is application where a lot of data needs to be linked with `foreign keys`.

### Postgres

If `MongoDB` doesn’t cut it I will go for `Postgres`, which does support everything SQL supports and much more! Postgres has the edge over `MongoDB` in speed and by being able to use `foreign keys`. Which makes connecting data a breeze. I have to admit that most of the times I use my ORM to design the database structure and to query it. I would not call myself an expert enough on postgres to talk about it more than these advantages

### SQLite

A small honourable mention to `SQLite` which I like to use when making small demo applications where I do not want the work of creating a database within a container or process.

[MongoDB](MongoDB.md)