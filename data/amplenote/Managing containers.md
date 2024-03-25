---
title: Managing containers
uuid: 606588a4-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:44Z'
tags:
  - imported/markdown
  - orchestration
  - docker
  - ops
  - programming
---

# Managing containers

Containers are amazing, but now that we have resolved the issue of “but it works on my machine”. There is still the overhead of running multiple containers within their own networks to communicate. For this there are a couple of solutions. Docker compose, docker swarm and kubernetes. While **docker compose** is not as powerful as **docker swarm** and **kubernetes** it is easier to use, so let’s dive in what each of them does.

## Docker compose

Docker compose was created to solve the exact problem that is described above. It enables the user to write a sort of template of which images to use or which `Dockerfile` files to create image from and then it can connect them through services or to the outside world and give them some environment variables for custom configuration. This seems like a lot of work but once you have written the configuration for this you have a good overview of what your application does and what it uses. Once you have created the `Docker-compose.yml` where the configuration lives you only need to run `docker compose up` to start up all the declared containers with the correct environment variables. The only thing docker compose misses is being able to create multiple containers of the same type if the container cannot handle the amount of requests or spin up a replacement if a container dies.

[Docker compose](Docker%20compose.md)