---
title: Web servers
uuid: 52347b64-da0b-11ee-a972-c250cfa702b7
version: 4
created: '2024-03-04T09:38:38Z'
tags:
  - ops
  - programming
  - imported/markdown
---

# Web servers

Web servers are the technology that serve your frontend application to the user via the internet. There is a lot of things going on under the hood of a web server but my knowledge only goes as far as writing a configuration file a deploying my application to the webserver after I started the process.

The two well known flavours of web servers are `nginx` and `apache`. I prefer to use `nginx` when I have the choice but `apache` is used on most cheap web hosting packages so having some knowledge about this when wanting to configure something like a portfolio website is very beneficial.

## [Nginx](Nginx.md)

Nginx is a reverse proxy server that can serve your files to an end user via HTTP it can also handle caching strategies by itself to make the handling of requests simpler. I personally use nginx for two use cases, for serving my application to an end user or to create a proxy between multiple systems.

## Apache

Apache is the most used way to serve your application to the end user, it is pre installed on almost all web hosting packages that are out there. Apache is an open source simple http server where some specific configurations can really speed up the delivery of your application.

[Nginx](Nginx.md)

[HTTPS](HTTPS.md)