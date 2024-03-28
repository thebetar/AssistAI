---
title: Concurrency
uuid: 3c2c10d4-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:18Z'
tags:
  - programming
  - imported/markdown
---

# Concurrency

Concurrency in programming describes when a program starts multiple processes at the same time in a concurrent way. A simple example of this is to send multiple http requests and not wait for each response one after the other but to catch responses and then run the code that relates to it. Think about promises or event listeners in javascript.

### Semaphores

Within concurrency semaphores can be used to create shared memory between two threads that are performing tasks. This prevents two tasks from trying to change state at the same time and causing issues.