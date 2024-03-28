---
title: Nginx
uuid: 60fe8eaa-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:44Z'
tags:
  - ops
  - imported/markdown
  - programming
---

# Nginx

## Summary

Nginx is a reverse proxy server that can serve your files to an end user via HTTP it can also handle caching strategies by itself to make the handling of requests simpler. I personally use nginx for two use cases, for serving my application to an end user or to create a proxy between multiple systems.

## Configuration

When using Nginx it will use configuration file to decide how it will run. Within this file a lot can be configured. Here is a basic example of such config file

```jsx
http {
	server {
    listen 80;

    root /var/www/html;

    server_name example-client;

    location / {
        try_files $uri /index.html;
    }

		location /api {
			proxy_pass 123.45.678.910:3000;
	}
}
```

In this example a couple of basic things are done, the port that should be listened on for requests is defined, the root folder where the applicaiton lives, the name of the application process and a fallback with `try_files`. This is a basic setup for a simple http server. Lets go over each attribute that is used one by one

### http

Sets the context of the http server

### server

Sets the context of a virtual server within the http server, multiple of these can exist for load balancing

### listen

Defines the address and port the virtual server will listen on for requests aside from the address and port the `default_server` argument can be provided to set the virtual server as the default server on this address and port

### root

Sets the root of the virtual server where it will serve files from. Simply said this is the path that points to your application.

### server_name

Sets the name of a virtual server, this needs to be something descriptive

### location

Sets configuration based on the request URI. This means that within these code blocks you can define what you want nginx to respond with, like in the example this is handy if you want to proxy a request from your application to a server. Regular expressions can also be used this is handy for handling file requests for instance for images this looks something like

```jsx
location ~ \.(gif|jpg|png)$ {
    root /data/images;
}
```

### try_files

Checks the existence of a file in order of the arguments, in this case this is used to reroute to the `index.html` file. This is because a lot of application only build an index.html file and handle routing programmatically. In the example this is done like this `try_files $uri /index.html;`

### proxy_pass

Maps the request that is sent to the web server to the specified URI this is used to make your web server also act as the proxy of your application.

### client_max_body_size

Sets the maximum size of the request body that is handled by the server if the request exceeds the size the server will return a `413` error. If this value is set to 0 this setting will be disabled so it will not check for a maximum size and allow everything.

### include

Imports configuration from the specified file to the current block

### return

Sets a simple status code and message to return on a specific URI

## Load balancing

Load balancing with nginx is quite easy, basically if you define multiple virtual servers with the `server` attribute and include them in the attribute `upstream` it will already start distributing requests evenly over the specified servers (if they are listening on the same address and port of course).  This looks something like this

```jsx
http {
    upstream backend {
        server backend-server-1;
        server backend-server-2;
        server backend-server-backup;
    }
}
```

For this load balancing some configurations can be added these are

- **None** if you do not add configuration it will use the `Round Robin` method which means it will distribute the requests evenly

- **least_conn** if you use the this attribute it will distribute the request to the server with the least connections

- **ip_hash** if you need the user to be connected to the same server each time this method will do this based on the requests ip address

Using these attributes looks something like this

```jsx
http {
    upstream backend {
				least_conn;
        server backend-server-1;
        server backend-server-2;
        server backend-server-backup;
    }
}
```

Also server weights can be defined, the default is 1 but if you want the default `Round Robin` load balancing method to distribute more requests to one server you can add weights, this looks something like this

```jsx
http {
    upstream backend {
        server backend-server-1 weight=5;
        server backend-server-2;
        server backend-server-backup;
    }
}
```

## HTTPS

Nginx can also be configured to use **SSL**. This means encrypting the data sent on the go for this a certificate and a key are needed. The certificate is public and will be sent to the end user and the key will be private and be stored somewhere on the server nginx is running on. This configuration looks something like this

```jsx
server {
	listen               443 ssl;
  server_name          test_client;
  ssl_certificate      www.example.com.crt;
   ssl_certificate_key www.example.com.key;
```