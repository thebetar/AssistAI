---
title: C
uuid: 355ba6a2-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:14Z'
tags:
  - imported/markdown
  - programminglanguage
  - programming
---

# C

C is one of the core languages within computer science. Most programming languages are written in it a lot of household appliances are written in it and everything that needs true non compromising performance is most likely using C. This is because C is a very performant language that allows for almost direct manipulation of memory.

# Datatypes

C knows a lot of datatypes and each data type can also be used as a pointer.

- `char` which is one single character

- `short` short integer which is smaller in size

- `int` normal integer

- `long` long integer which is larger in size but can also store bigger numbers

- `float` floating point number

- `double` bigger floating point number

All these can also be make a list by creating a variable and then adding a length to it like this

`int grades\[10\]` this will create a list of 10 integers.

# Compiler

C is a compiled language, to compile it the **GNU compiler collection** is mostly used. This comes automatically installed on most operating systems and can be used by calling the `gcc <filename>` command. Some good to know parameters are:

- `-o <output-name>` can be used to give a name to the created output file

- `-lm` is used to link the modules to the binary file, this is important to do when using non standard C libraries.

- `-Wall` can be used to print all warnings. This is useful when trying to optimise your code.

- `-Werror` can be used to convert warnings into errors. This can also be useful when optimising code.

- `-S` can be used to compile to assembly language.

# Files

To handle files the `fopen` and `fclose` from the `stdio` lib are used. The `fopen` function returns a pointer to the file which can be used to read lines into a buffer. In C it is important to close the file after finshing the necessary operations.

To read a line from a file `fgets` is used with the following parameters `fgets(<buffer>, <buffer-length>, <file-pointer>)`. It is good to combine this with a while loop to keep reading untill the last line is hit. It is also a good idea when going over characters in a line to check for the `\\n` character which indicates a new line character.