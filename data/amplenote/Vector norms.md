---
title: Vector norms
uuid: 3e0d0700-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:22Z'
tags:
  - imported/markdown
  - math
---

# Vector norms

Within vector norms there are multiple ways to use vectors. For instance to describe a path in a maze or a movement through space. This is done with vector norms. There are three kinds

# Vector norm 1 (L1 / manhattan norm)

For vector norm L1 which is in 2 dimensional space the Manhattan norm is used most of the time which is named after the grid layout in the district of Manhattan. Each vector describes a movement through the city with its (X, Y) since each vector holds two values in 2 dimensional space. The formula of this is written like this

$\|\|v\|\|1 = \|v_1\| + \|v_2\| + … _ \|v_n\|$

Another way this is describe is with a summation

$\|\|v\|\|1 = \\sum_{k=1}^n \|v_k\|$

In this formula $v$ stands for the magnitude of each vector, the $1$ stands for the vector norm and the calculation behind it describes that the movement is described by adding all the vectors together.

An example of this is when there are two vectors $x = (2, -4)$ and $y = (5, 7)$ to use the manhattan norm on this example you can do $\|\|v\|\|1 = \|2\| + \|-4\| + \|5\| + \|7\| = 18$. Pretty easy stuff.

# Vector norm 2 (L2 / euclidean norm)

For vector norm L2 which is in 2 dimensional space. The calculation of the movement for 2 dimensional vectors can be calculated by the following formula

$\|\|v\|\|2 = \\sqrt{\|v_1\|^2 + \|v_2\|^2 + … + \|v_n\|^2}$

Using a summation this formula becomes

$\|\|v\|\|2 = \\sqrt{\\sum_{k=1}^n \|v_k\|^2}$

An example of this with the same vectors $x = (2, -4)$ and $y = (5, 7)$ but using the euclidean norm would result in $\|\|v\|\|2 = \\sqrt{\|2\|^2 + \|-4\|^2 + \|5\|^2 + \|7\|^2} \\approx 9.6954$

# Vector norm $\\infin$ (L$\\infin$ / maximum norm)

For vector norm L$\\infin$ is used to find the biggest magnitude in a vector so the formula is

$\|\|v\|\|\\infin = \\max({\|v_1\|, \|v_2\|, ..., \|v_n\|})$

which means from the set of magnitudes of vectors what is the biggest values

An example using the same vectors $x = (2, -4)$ and $y = (5, 7)$ again we get

$\|\|v\|\|\\infin = \\max({\|2\|, \|-4\|, \|4\|, \|7\|}) = 7$