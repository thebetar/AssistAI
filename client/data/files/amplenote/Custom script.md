---
title: Custom script
uuid: c621cdac-e5d1-11ee-a1f9-f682521de7a6
version: 34
created: '2024-03-19T09:19:22Z'
tags:
  - programminglanguage
  - linux
  - unix
---

One of the very powerful features of linux is that you can very easily write your own binaries to execute some code through an alias in the terminal. This is done by writing a simple script and storing it in the `/usr/local/bin` folder. The script should have the name that it will be called with from the terminal.

The default in most linux system is `bash` or `zsh` there are slight difference between these two but the shell interpreter can be set at the top of the file with something called a **shebang.** A shebang is written with a leading `#!` and followed by the location of the binary for instance `#! /usr/bin/env bash` to start bash as the shell interpreter.

An example file for a simple project selector that opens selected dirs with a minimal depth with fuzzy finder and opens the result in a new tmux session looks like this.

```
#!/usr/bin/env bash

selected_project=$(find ~/Projects ~/Classes /mnt/Shared/Projects /mnt/Shared/Classes -mindepth 1 -maxdepth 1 -type d | fzf)

selected_name=$(basename "$selected_project" | tr . _)
tmux_running=$(pgrep tmux)

if [[ -z $TMUX ]] && [[ -z $tmux_running ]]; then
    tmux new-session -s $selected_name -c $selected_project
    exit 0
fi

if ! tmux has-session -t=$selected_name 2> /dev/null; then
    tmux new-session -ds $selected_name -c $selected_project
fi

tmux switch-client -t $selected_name
```