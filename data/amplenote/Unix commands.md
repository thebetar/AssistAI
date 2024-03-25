---
title: Unix commands
uuid: 3ccfe2a4-da0b-11ee-9a0e-ca8ae82b63ae
version: 6
created: '2024-03-04T09:38:20Z'
tags:
  - imported/markdown
  - programming
  - unix
  - linux
---

# Unix commands

The preferred operating system for most developers are unix based systems. In practise this means MacOS or linux based operating systems. This is because unix contains a lot of useful commands and has a very usable file structure to it. These are the most useful commands that one should know

1. `cp` copy something

    1. `cp <file> <path>` to copy a file

    1. `cp -r <folder> <path>` to copy a folder

1. `mv <file/folder> <path>` to move a location, can also be used to rename a file

1. `find` find files

    1. `find . -name "<file pattern>"` to find a file matching a name with matching case

    1. `find . -iname "<file pattern>"` to find a file matching a name withouth matching case

1. `cd <path>` change directory to path

1. `pwd` print current path

1. `cat` print file content

1. `rm` remove something

    1. `rm <path>` remove a file

    1. `rm -r <path>` remove directory

    1. `rm -rf <path>` force remove directory (dangerous)

1. `touch <path>` create file

1. `mkdir <path>` create directory

1. `ls` list files in current path (add `-l` to format and `-a` to view all files including hidden files)

1. `chmod` update permissions on route

    1. `chmod <num><num><num> <filepath>` change permission for a single file with left to right it sets the rights for owner, group and others the number sums up to a total of the rights where the value `4` is read, `2` is write and `1` is execute

1. `sudo <command>` run command as superuser

1. `exit` exit current terminal

1. `which <program>` display path to program

1. `ln -s <target file> <symlink name>` to create a symbolic link to a file, this is useful when adding packages to the bin

1. `resolvectl flush-caches` to clear DNS cache

1. `for <variable> in <path>; <command> $<variable>` to run a for loop over all files in a path

1. `$<variable>` to use variables

1. `$(<variable>/target/replacement)` to replace text in string, very useful when iterating over items.

1. `who` to see which user is logged in

1. `<command> \| <command>` the pipe in a command pipes input from one command to another the order is left to right

1. `du -sh <path>` to show disk usage per file or directory

1. `ssh user@url` is used to establish an SSH connection with a server.

1. `scp user@url:filepath filepath` is used to securely copy files from a server over SSH

Some more in deth analysis are on these packages

- [grep](grep.md) 

- [NMAP](NMAP.md) 

# Important packages to know

- **parted:** for resizing partitions

- **screen:** run multiple windows in terminal

[NMAP](NMAP.md) 

[grep](grep.md) 

[curl](curl.md) 