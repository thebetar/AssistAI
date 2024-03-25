---
title: Mail templates
uuid: 498af862-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:30Z'
tags:
  - javascript
  - imported/markdown
  - backend
  - programming
---

# Mail templates

Creating mail templates can be tricky since different clients support different HTML and CSS. This makes it hard since things like flexboxes and other modern CSS features cannot be used. The website [https://www.caniemail.com/](https://www.caniemail.com/) can be used to see which HTML and CSS is supported by which email provider. Aside from this also the use of multiple devices need to be taken into account. The general rule of thumb is to use `<table>` elements to center and align content within the page. Also images have to be sent as attachments if you would like to use them.

## Nodemailer

Nodemailer is a library within the node.js space for sending emails via SMTP. This is very important to do things like verification of clients or sending them informational emails. To create a client using the package nodemailer looks something like this

```tsx
const client = createTransport({
	host: 'smtp.example.com', // Here goes the SMTP server
	port: 587,
	secure: false,
	auth: {
		user: 'john.doe@mail.com',
		pass: 'password123'
	}
});
```

After this the client can be used to send emails if it logs in correctly using

```tsx
await client.sendMail({
	to: 'jane.doe@mail.com',
	from: 'John <john.doe@mail.com',
	subject: 'Test message',
	text: 'Hello Jane this is a test message',
	html: `
		<html>
			<body>
				<h1>Hello Jane,</h1>
				<p>
					This is a test message
				<p>
			</body>
		</html>
	`
});
```