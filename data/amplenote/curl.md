---
title: curl
uuid: 42b1612a-da0b-11ee-a972-c250cfa702b7
version: 3
created: '2024-03-04T09:38:28Z'
tags:
  - imported/markdown
  - programming
  - unix
  - linux
---

# curl

Curl is an http client used to send requests from the command line. Curl is installed by default on most unix based systems. To use it to

```bash
curl -X "POST" -d "{\"message\":\"Hello world\"}" "https://example.com"
```

Useful options when using curl are

- `-c <filename>` to tell curl to save the cookies created in the file

- `-b <filename>` to tell curl to read cookies from the file

- `-o <filename>` to tell curl to save the response in a file

- `-F` use content-type **multipart/form-data**

- `-G` send request with method **GET**

- `-H` to specify extra headers to be send

- `-i` include response headers in output, useful when error is returned or more info is needed

- `--json` specifies content-type **application/json**

- `--key <filename>` provide access to private key for SSH connection

- `--pass <password>` password for private key

- `-M` open the manual

- `-m` max time for the request to take

- `-X <method>` used to specify method

- `--retry` retry connection multiple times before failing

- `--ssl-reqd` require SSL

- `-T` upload file

- `-v` verbose mode