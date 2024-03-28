---
title: Frameworks
uuid: 4a2b2a1c-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:32Z'
tags:
  - javascript
  - imported/markdown
  - programming
  - backend
---

# Frameworks

For Backend frameworks the same applies as frontend frameworks. There are almost too many flavours to choose from. I have to say that within this space I have only tried three options which are `Express.js`, `Nest.js` and `Koa`.

Like in the Frontend frameworks I will go more in depth what dependencies I like to use with each framework and much more but here are some summarisations of what I like about each.

### [Express.js](Express%20js.md)

Express prides itself about being a very minimalist framework and this shows. You can basically get a webserver working within **5 minutes** which is amazing. Like everything within the programming space this is a strength and a weakness. Because it is very minimalist what happens quite often is when scaling your project you get to a point where your server becomes very unorganised and even chaotic (believe this has happened often in the past). When using Express.js you really have to be strict with yourself in maintaining good coding standards and keeping the `controller`, `service` and `repository` layout. When you do this scaling is fine. And you keep the advantage that if you have to do something irregular you have all the freedom to do it the way you want to easily. I would recommend Express.js for every project where you work alone or with a small team where you can maintain your coding standards, otherwise I would not recommend it at all but that’s where the next framework comes in.

### Nest.js

Where Express is really minimalist Nest.js is not. But this makes it perfect for the instances where Express falls short. Nest.js enforces the `controller`, `service` and `repository` layout which makes you not have to focus on where to place a file or what to call it. Also Nest.js supports a lot within its ecosystem and has everything documented very well on their [website](https://nestjs.com/). What I have experienced with Nest.js is that you find yourself often going back to their documentation to look up how something is done. This is very doable because the documentation is well written, but does cost development speed. This summarises what my opinion about `Nest.js` is really well. When speed is not key or when working with a medium to large team I would recommend using `Nest.js`

### Koa

I do not have the expertise yet to speak about this framework

[Express.js](Express%20js.md)