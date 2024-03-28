---
title: Authentication
uuid: 4b5911ba-da0b-11ee-9a0e-ca8ae82b63ae
version: 5
created: '2024-03-04T09:38:32Z'
tags:
  - javascript
  - authentication
  - programming
  - imported/markdown
  - backend
---

# Authentication

Authentication is a very important part of creating a web server. You want to restrict access to some routes based on the role of a user. This can be done by authenticating a user and seeing if they are authorised to see some content. This can be done in a couple of ways but the most common are by using a jsonwebtoken that is sent in the request header or by using a session which will store the credentials. For these two ways there are two common methods within the `node.js` space.

This is done by logging in and saving the state in an encrypted token or session.

Aside from encrypting tokens, the password must also be encrypted. Password should not be stored in an non encrypted fashion! For this there are a couple of ways to do it, but within `node.js` the standard is `bcrypt`.

To find out more in depth about sessions or encryption I have created two subpages

- [Sessions / tokens](Sessions%20tokens.md) 

- [Encryption](Encryption.md) 

[Sessions / tokens](Sessions%20tokens.md) 

[Encryption](Encryption.md) 