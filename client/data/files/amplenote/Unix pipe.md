---
title: Unix pipe
uuid: f75ca01c-e55a-11ee-b3c0-52ac9bb55973
version: 17
created: '2024-03-18T19:08:54Z'
tags:
  - unix
  - linux
---

Pipes are very useful when chaining command. For instance when wanting to pass a list to a program with `find`

To use pipes write

```c
<command1> | <command2>
```