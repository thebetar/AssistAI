---
title: Containerisation
uuid: 519d9190-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:36Z'
tags:
  - ops
  - docker
  - imported/markdown
  - programming
---

# Containerisation

Containers are a central part of deploying and running your applications. Without containers the modern ways of hosting could not exist, but what are containers exactly?

Containers are a little bit like virtual machines, but more efficient and with less overhead. Basically what a container allows you to do is create a template with what environment you want your application to run in (an image) and then from this template create a container. Because you have defined what environment you want to run your container in, your container will run the same on every device! This removes the classic problem of “but it works on my machine”.

Within a container you can add what base image it will start from this can be something like `node:latest` or `node:alpine` which will spin up an environment running on a basic linux installation with `node.js` already installed, then you can copy over your files, install your packages and tell the image what to run when the container is created and that’s it! You have a basic container for running a node.js application, this will look something like this

```jsx
FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY index.js index.js
COPY src src

RUN npm run build

EXPOSE 3000

CMD [ "node", "index" ]
```

There are also docker base images you can use like `nginx` for spinning up a web server and serving your frontend application, or images like `mongodb` or `postgres` to immediately spin up a database with everything already working. This is very powerful stuff. To also give a small example on the dockerfile based on `nginx` here it is

```jsx
FROM node:alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
COPY .env.prod .env

RUN npm run build --production

FROM nginx:alpine

COPY --from=builder /app/dist /var/www/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Here an extra step is added to build the project in one `stage` and then copy the resulting bundle to the `nginx` based image.

To have better control which containers are being used and even how many containers of each image are used you can use tools that manage containers like `docker compose` and `kubernetes`

[Managing containers](Managing%20containers.md)

Source: [https://www.docker.com/](https://www.docker.com/)