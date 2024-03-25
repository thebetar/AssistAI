---
title: grep
uuid: 421cd942-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:28Z'
tags:
  - commandline
  - imported/markdown
  - linux
  - programming
  - unix
---

# grep

Grep is a very useful tool for finding files or code on the system. It work by searching for a specific string in a file or directory. To do this use

```bash
grep "<body>"
```

Some useful options that can be used with grep are

- `-r` recursive search, this can be used on directories

- `-i` to ignore case

- `-f` to search in a specifc file

- `-c` to count the amount of occurences

- `-l` print files with matches but not line numbers

- `-L` print files without matches

- `-n` print line number with output