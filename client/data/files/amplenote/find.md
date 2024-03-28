---
title: find
uuid: b5ed5a48-e575-11ee-ae6a-22082232206a
version: 27
created: '2024-03-18T22:20:21Z'
tags:
  - commandline
  - linux
  - unix
---

The `find` command is very important and especially powerful when combining it with the [unix pipe](Unix%20pipe.md) . Find can be used in multiple ways to list file and directories with the following parameters

1. `find . -name "<file pattern>"` to find a file matching a name with matching case

1. `find . -iname "<file pattern>"` to find a file matching a name withouth matching case

1. `find . -type d` to find all matching directories

1. `find . -type f` to find all matching files

1. `find . -exec <command>` to execute a command on each result

1. `find . -mindepth 1` to find every file from depth 1

1. `find . -maxdepth 1` to find every file till depth 1

1. `find . -mindepth 1 -maxdepth 1` to find files only in the current directory and not in sub directories.