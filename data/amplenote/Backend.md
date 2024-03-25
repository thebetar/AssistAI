---
title: Backend
uuid: 3f4538ea-da0b-11ee-9a0e-ca8ae82b63ae
version: 19
created: '2024-03-04T09:38:26Z'
tags:
  - backend
  - imported/markdown
  - programming
---

# Backend

Since I am a web application developer my experience for backend servers is mostly with `node.js` this will be reflected in this documentation.

Within writing backend servers the most important thing in my opinion is keeping all the logic separated within their own files and folders. I like to use the `controller` , `service` and `repository` architecture. There are still some other folders like `utils` and `models` which I use but these describe best what is done. Some backend frameworks already enforce this structure like `Nest.js` and others give you the freedom to decide for yourself like `Express.js` and `Koa`.

With these three backend frameworks we immediately have all the ones that I have tried. But first like in the Frontend chapter lets see what important parts we have within our backend.

## Aspects of backend programming

- [Framework](Frameworks%20\(1\).md) (Express.js, Nest.js, Koa)

- [ORM](ORM.md) (Prisma.js, Mongoose, TypeORM)

- [Authentication](Authentication.md) (passport.js)

    - [Session / token](Sessions%20tokens.md) (passport.js / jsonwebtoken)

    - [Encryption](Encryption.md) (bcrypt)

- [Validation](Validation.md) (express-validators, class-validator)

- [Debugging](Debugging%20\(backend\).md) (VScode debugger)

- [Linting, formatting and auditing](Linting,%20formatting%20and%20auditing.md) (eslint, prettier)

- [Testing](Testing.md) 

    - [Unit testing](Unit%20testing.md) (jest, supertest)

    - [Integration testing](Integration%20and%20e2e%20testing.md) (Insomnia, postman)

    - [e2e testing](Integration%20and%20e2e%20testing.md) (Cypress)

- [Supersets](Supersets.md) (Typescript, mjs, cjs)

    - [Typescript](Typescript.md) 

- [Package managers](Package%20managers.md) (npm, pnpm, yarn)

Some optional steps include

- Receiving payments (Stripe)

- [Content management system](Content%20management%20system.md) (Strapi)

[Frameworks](Frameworks%20\(1\).md) 

[ORM](ORM.md) 

[Authentication](Authentication.md) 

[Debugging (backend)](Debugging%20\(backend\).md) 

[Content management system](Content%20management%20system.md) 

[Payments](Payments.md) 