---
title: Docker compose
uuid: 62ce7718-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:46Z'
tags:
  - imported/markdown
  - orchestration
  - programming
  - docker
  - ops
---

# Docker compose

## Summary

Docker compose was created to solve the exact problem that is described above. It enables the user to write a sort of template of which images to use or which `Dockerfile` files to create image from and then it can connect them through services or to the outside world and give them some environment variables for custom configuration. This seems like a lot of work but once you have written the configuration for this you have a good overview of what your application does and what it uses. Once you have created the `Docker-compose.yml` where the configuration lives you only need to run `docker compose up` to start up all the declared containers with the correct environment variables. The only thing docker compose misses is being able to create multiple containers of the same type if the container cannot handle the amount of requests or spin up a replacement if a container dies.

## Example

Here is an example of a regular application managed with docker-compose

```yaml
services:
    database:
        container_name: test-project-db-container
        image: mongo
        volumes:
            - ./db/data:/data/db
        networks:
            - server-network
    server:
        container_name: test-project-server-container
        image: test-project-server
        depends_on:
            - database
        networks:
            - server-network
            - client-network
        environment:
            - CLIENT_URL=http://test-project-client-container:80
            - MONGO_URL=mongodb://test-project-db-container:27017
            - MONGO_DATABASE=test-database
            - JWT_SECRET=dGVzdC1wcm9qZWN0
            - NODE_ENV=production
    client:
        container_name: test-project-client-container
        image: test-project-client
        ports:
            - '8080:80'
        depends_on:
            - server
        networks:
            - client-network
networks:
    server-network:
			name: test-project-server-network
    client-network:
			name: test-project-client-network
```

# Configuration

In the configuration file about a couple of section can be seen the most important are

- `services` to define the containers that need to be run

- `volumes` to define the shared persistent data between the containers

- `networks` to define the connections between the containers

## Services

When defining the services a couple of important properties can be given, the name, the image or a reference to the dockerfile that it is created from, what other container needs to run before the container is started for instance when running a server that needs to connect to a database, the network the container belongs to, the potential environment variables and extra options. These will be described below

- `container_name` the name of the container that is run

- `image` the base image the container is based on

- `build` the path to the `dockerfile` that needs to be build to create the image

- `volumes` the destination and source path for shared data between the host system and the container for persistent data storage

- `networks` the network a container is connected to for communication between containers

- `ports` the ports a docker container connects from to the host system for instance when hosting a proxy

- `depends_on` the container that needs to be started first before starting the container

- `environment` the environment variables that are passed to the container

## Volumes

Defining volumes is fairly simple and is mostly used if multiple containers need to refer to the same folder. Otherwise the `volumes` option within the `services` section is enough

## Networks

Networks are used to orchastrate communication between containers. This can be done in a couple of different ways and settings. To define what kind of network is required use the `driver` option. The options for the `driver` are:

- `bridge` which is the default driver and creates a network where only the containers within this same network can communicate.

- `host` which connects the connected containers to the local machine thereby removing the isolation provided by docker.

- `overlay` which connects containers in an overarching network, this is used when running multiple services using swarm on multiple different devices.

- `none` completely isolate all containersk from everything when connected to this network.

Aside from this there is the option to not only make the network available for services defined in the docker compose file but also other containers that are run, this can be done by setting the option `attachable` to true.

Lastly the `name` property is useful to create a better memorisable name for the network. A default setup would look something like this

```yaml
services:
	client:
		image: client
		networks:
			- frontend
	server:
		image: server
		networks:
			- frontend
			- backend
	database:
		image: database
		networks:
			- backend
networks:
	backend-network:
		name: backend
		driver: bridge
		attachable: false
	frontend-network:
		name: frontend
		driver: bridge
		attachable: false
```