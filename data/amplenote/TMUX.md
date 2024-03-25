---
title: TMUX
uuid: 33e17c7e-da20-11ee-a972-c250cfa702b7
version: 60
created: '2024-03-04T12:10:33Z'
tags:
  - tools
  - linux
  - unix
  - programming
---

Tmux is a CLI tool that can be used for terminal emulation. It helps the developer by managing multiple windows and panes from a single terminal, where normally multiple terminals or windows within a terminal have to be opened. It improves the workflow a lot when multiple processes need to be run or managed.

To create a session with tmux use `tmux new -s <NAME>` after creating the commands under this paragraph will be useful.

To start a command from tmux press `ctrl + b`. The following commands after this are the most useful

- `%` split pane horizontally

- `"` split pane vertically

- `x` close pane

- `!` convert pane to window

- `&` kill window

- `q` show pane numbers

- `?` show documentation

- `d` detach from current window

- `c` create new window

- `,` rename window

- `w` list all windows

- `n` go to next window

- `p` go to previous window3

- `<NUMBER>` switch to window with number

- `<ARROW-KEY>` switch between panes

- `ctrl + <ARROW-KEY>` resize pane

When detached from a window `tmux ls` can be used to list the current running window (if all are not killed). To append to a window again use `tmux -t <NAME>` and you will be back in!

A good source for further commands (aside from the manual with `ctrl + b, q` is [https://tmuxcheatsheet.com/](https://tmuxcheatsheet.com/) 