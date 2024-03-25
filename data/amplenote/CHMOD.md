---
title: CHMOD
uuid: 6a341b28-e575-11ee-a1f9-f682521de7a6
version: 19
created: '2024-03-18T22:18:14Z'
tags:
  - unix
  - commandline
  - linux
---

chmod is used to edit priveleges on files. This is a very important command to know since whenever there is an issue with permission most likely it can be fixed with this command

\

`chmod <num><num><num> <filepath>` change permission for a single file with left to right it sets the rights for owner, group and others the number sums up to a total of the rights where the value `4` is read, `2` is write and `1` is execute. For instance for a custom binary this would be

```c
chmod 755 ./custom-program
```

In this example the binary `custom-program` can get read, written to and executed by the root user and everyone else can read and execute it.