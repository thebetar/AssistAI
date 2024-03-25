---
title: Integrals
uuid: 3233dcf6-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:10Z'
tags:
  - imported/markdown
  - math
---

# Integrals

An integral is the area underneath a line in a graph between the value of the line and $y=0$. This is useful to calculate in a lot of instances for instance in a graph of speed the area under te graph indicates the distance travelled by the object. To calculate this the easiest way is to use **Rieman’s sum** which is done by breaking up the graph between two points into smaller and smaller subintervals and calculating the area of each sub interval by calculating the length of the base over $x$ and the height that is in the interval by using $f({x_n + x_{n+1} \\above{1pt} 2})$ this very simply says between $x_n$ and $x_{n+1}$ what is the height or $y$. The length of $x$ is calculated by doing $x_{n+1} - x_n$ which results in the length of the base of the interval.

When calculating integrals the fundamental theorem of calculus can be useful when trying to calculate the distance travelled for instance in a graph of speed.

$f(b) - f(a) = \\int_a^b f’(x)dx$

This basically says that if the function $f’$ is speed and $f$ is distance then the integral over time from $a$ to $b$ is the same as subtracting the result of distance from point $a$ and $b$ resulting in $f(b)-f(a)$ being the same as $\\int_a^b f’(x)dx$. Because of this a shorthand was created for the calculation $f(b)-f(a)$ which can also be written as $f\|_a^b$.

# Antiderivatives

For this usecase the idea of **antiderivatives** becomes interesting. Since if we have a function that is not a derivative the fundamental theorem of calculus can still be used. This is done by reversing the **power rule**. One thing to keep in mind is that calculating backwards gives no guarantees on constants that might exist so there are shown to maybe exist using the letter $C$. So for instance for function $f$ the antiderivative can be $f = F’$ so the antiderivative is $F$ in this case this means that for instance an integral $\\int_a^b f$ would result in $(F(b) + C) - (F(a) + C)$. Since this value is unknown this is still written as $F(b)-F(a)$ where it is given the name and **indefinite integral**.