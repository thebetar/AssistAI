---
title: Encryption
uuid: 59e5941a-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:40Z'
tags:
  - backend
  - imported/markdown
  - security
  - programming
---

# Encryption

Encryption is very important for storing data that is confidential in a hash. Encryption nowadays mostly applies to passwords and requests and responses. The strategies used for passwords are different though than for requests and responses.

## Password encryption

Encrypting passwords is important because you do not want to store the actual password of a user in case of a data leak or other dangers that can occur when handling a users precious data.

Passwords do not have to be decrypted you want an algorithm that consistently spews out the same value when the same value is inserted. There are some extra steps to this with salt but that is the basic principle.

### How to

In `node.js` the most used library for this is called `bcrypt`. `bcrypt` is a library that uses the above described method in combination with generating a salt. The generated `hash` from bcrypt looks something like thsib

```tsx
$2a$12$Lkl60oyJKcN020JZKe0hDumVLu9dgG.6Yiz64RCv0dHxpI1u2WpUq
```

This hash consists of a couple of parts seperated by a `.` or `$`.

This first part `$2a$` describes the algorithm used to encrypt.

The second part `12$` describe the rounds used when creating the salt.

The third part `Lkl60oyJKcN020JZKe0hDumVLu9dgG` is the generated salt.

The fourth part `6Yiz64RCv0dHxpI1u2WpUq` is the actual hash.

This basic principle is very handy to know when trying to understand bcrypt. Now lets see how to create a hash and how to check a password against it. Firstly creating a hash

```tsx
import { hash } from 'bcrypt';

const SALT_ROUNDS = 10;

async function createHash(password: string): Promise<string> {
	const generatedHash = await hash(password, SALT_ROUNDS); 
}

const passwordHash = await createHash('lorem');
```

This simple function will return a hash when provide with a password. Now lets see how to check this hash against a provided password

```tsx
import { compare } from 'bcrypt';

async function comparePassword(password: string, hash: string): Promise<boolean> {
	return await compare(password, hash);
}

const checkPassword = await comparePassword('lorem', passwordHash); // Returns true
```

and that’s all there is to it.

## Message encryption

Encrypting messages is important to prevent a man in the middle attack. The best example of this is the difference between HTTP and HTTPS. HTTP requests are sent with the actual data of the web, while HTTPS requests are encrypted on the client side with a public key and decrypted on the sever side with the private key.

The encryption of messages can go two ways depending on the security needed. The solution for encrypting both direction, end-to-end encryption is most often used. This is a way to encrypt messages on both sides using a shared public key and a non shared private key and the other party being able to decrypt the message using the same public key in combination with that party’s own private key.

## How to

When trying to create a server that communicates over HTTPS two things are needed, a certificate and a public key. These are used to decrypt the data sent from the client and to let the client know how to encrypt their data that is sent. Setting this up is something that is not done often I use `certbot` when I have to establish an HTTPS connection because this tool makes it easy to generate everything that is needed.

The result returned can then be used to create an https server using the `https` module from `node.js`

```tsx
import fs from 'fs';
import https from 'https';
import express from 'express';

const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
const app = express();

https.createServer({
	
}, app);

https.listen(433);
```