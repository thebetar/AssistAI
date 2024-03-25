---
title: NMAP
uuid: 4188e84a-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:26Z'
tags:
  - unix
  - hacking
  - imported/markdown
  - programming
  - linux
---

# NMAP

NMAP is a tool for network mapping this is useful to check what is going on on your or someone else’s network. To simply run this on your own network use

```bash
nmap -sP 192.168.0.0/24
```

In this command `-sP` is used to skip a port scan and only map the hosts on a network.

The home IP adress is **192.168.0.**\* where all the hosts are within this one IP address. **/24** is added to search on the range from **192.168.0.0** to **192.168.0.255**

There are multiple ways to scan a network these are

- `-sP` which skips a port scan and is just a quick scan of all the hosts that are available on a network

- `-sT` is a connect scan and tries to establish a connection with all the hosts to see which hosts and ports are available

- `-sS` is a connect scan which does not establish a connection but just performs the first handshake, when it gets a response so that it can send data it will not send data and log this host and/or port as open. This is why it is considered more secure.

- `-p` only scan on specific ports for each host this is useful when you want to discover if a http server is being hosted by adding `-p 80,443` or for ssh with `-p 22`

- `-O` to find out what operating system the host is using.

- `-A` to find out as much as possible (OS, version number, etc.)

- `-D` to also send the same request from a decoy

- `--script` which is used to also run a script over the results which got received, some popular choices are `vuln` for finding vulnerabilities,