---
title: Definitions
uuid: 29338552-da0b-11ee-9a0e-ca8ae82b63ae
version: 5
created: '2024-03-04T09:37:52Z'
tags:
  - imported/markdown
  - math
---

# Definitions

Within math there are a lot of defintions that have to be understood. Most of the time the definition is pretty easy but has to be remembered to be used.

# Trigonometry

Is the calculation if the angle in a triangle for this three functions are used **sine**, **cosine** and the **tangent**. This is when to use each

- $\\tan \\theta = {opposite \\above{1pt} adjecent}$

- $\\sin \\theta = {opposite \\above{1pt} hypotenuse}$

- $\\cos \\theta = {adjecent \\above{1pt} hypotenuse}$

In this example the words stand for a triangle that is lying on its side where adjacent is the floor and opposite is at a 90 degree angle. While hypotenuse is the angled side.

Within trigonetry the calculations above are very important to for instance deduct the length of a side that is missing or find the angle of a side. Of course also the all the angles of a triangle add up to 180 degrees as well so calculating one side and already knowing one side is 90 degrees gives a lot of information here. This can be done by for instance already knowing the *opposite* and the *adjecent* for instance 2.5 and 3. Now the angle can be calculated using the inverse of the **tangent** which looks like $\\tan^{-1}{2.5\\above{1pt}3} = \\theta$.

In Dutch we have the rule of

- **SOS**: sinus is overstaande en schuine zijden

- **CAS**: cosinus is aanliggende en schuine zijden

- **TOA**: tangens is overstaande en aanliggende zijden

To make this work keep in mind to angle the triangle like a slope where the angled side goes up from left to right.

# Factorial

A factorial (annotated with an !) can be simple described as a number and then multiplying it by the next number subtract by 1 untill 1 is reached so for $7!$ it will become $7 \* 6 \* 5 \* 4 \* 3 \* 2 \* 1 = 5040$

# Integral

An integral is the area below or above a line in a domain on a graph. This is mostly annotated with a lot l shaped letter. The integral adheres to the **fundamental theorem of calculus** which is\
$f(b) - f(a) = \\int_a^b f’(x)dx$.

This means that the integral is calculated by the derivative of f between position $a$ and $b$.

# Euler’s number

Eulers number is a very special number just as $\\pi$. But unlike $\\pi$ it is not used to calculate the circumference of a circle but it is used to describe expontential growth. It is written like an $e$. The special thing about this number that is related to $e^x$ in a graph is that its value is always its derivative/slope

# Maxima and minima functions

The maxima and minima functions refer to the local or global maximum or minimum. A local maximum or minimum is the locally highest or lowest value before going into the other direction again. This does not necessarily mean that in another point in the graph the value will rise above or below the given maximum or minimum. This is different from the global maximum or minimum. This value is the absolute highest or lowest value that can be achieved within the graph.

An easy way to find out what the minimum is for a graph is when the graph has no constant values and only variables the local minimum is always at f(0, 0) or f(0) and the global one as well if all values are added and not one is subtracted.

[https://www.mathsisfun.com/algebra/functions-maxima-minima.html](https://www.mathsisfun.com/algebra/functions-maxima-minima.html) 

## Critical points

When calculating maximum and minimums of functions the point where the derivative is 0, so the max or min is reached is called the critical point.

## Domain

An area within which calculations are run with or without constraints

## Range

A range is much like a domain but not for the input values but the output values which can be reached in a certain domain.

# Real numbers

Real numbers are all numbers that exist on the number line. This definition is used to declare that a number is not an imaginary or theoretical number like inifnity or the $\\sqrt{-1}$

[https://www.mathsisfun.com/numbers/real-numbers.html](https://www.mathsisfun.com/numbers/real-numbers.html) 

# Absolute values

An absolute value is a non negative value that represents a number this mean that $3$ and $-3$ are the same number since their absolute distance to 0 is the same. An absolute value is denoted by# two vertical lines also called pipes in programming like this $\|-3\|$.

# Imaginary numbers

To explain a little more about imaginary numbers and why $\\sqrt{-1}$ is an imaginary one you will have to think of what value ^2 will en up in a negative number… it cannot be done because a normal number square positive or negative will always be negative so the square root of a negative number does not exist hence why it is imaginary.

[https://www.mathsisfun.com/numbers/imaginary-numbers.html](https://www.mathsisfun.com/numbers/imaginary-numbers.html) 

# Infinitesimal

Is a number that is infinitely small. This is often used to calculate the derivative, slope or gradient of a specific point by calculating the slope of the point and another point on the graph with a small amount added and then decreasing this amount to as close to 0 as possible.

# Functions

Functions within math work just the same as they do in programming. There is an input and an output where the function is the formula that makes the input into the output. If you write a function like $f(x) = y$ this means that every X is related to an element in Y. This means that X has a one to one or one to many relation with Y.

# Convergence

A converging line within a graph that is getting close to but no reaching a specific number.

# Sequence

A sequence is an ordered list of numbers. The difference between a sequence and a set is that a set is not always ordered but cannot repeat numbers which a sequence can but which is always ordered.

# Monotone sequence

A montone sequence is a sequence which either always goes up or down. When a monotone sequence is increasing which means that every entry is higher or equal than the last it is “monotone increasing” or “non-decreasing” when the opposite is true so for each entry it is lower or equal than the last it is “monotone decreasing” or “non-increasing”

# Subsequence

A subsequence is when you take a part of a sequence lets say a list of ages per student which is sorted from youngest to oldest and you filter this list by only including studens which are 14 years or older on the list this list will be a subsequence.

# bolzano weierstrass theorem

This theory is a little weird. It basically states that if you have a long enough sequence of random numbers you will be able to find some subsequence that has some order in it e.g. a small number of entries that always increase.

# Polynomials

A polynomial is a mathematical expression where one or more variables are summed with exponentiantion and coefficients (number which it will multiply, add or subtract with).

# Composition functions

Within mathematics the concept of a composition function exists. This is when one functions result is used in another function. To return some value for instance $(f \\circ g)(x)$ shows us that this basically first lets the function *g* take the value of the variable *x* and the result then is returned to the function of *f*. To write this in a simpler way this does $f(g(x))$

# Metric space

A matric space is a space within rules apply and points exist. The distance between these points can be calculated but the rules of the metric space have to apply.

## Euclidean space

The most familiar metric space is the euclidean space which is the 3 dimensional space we live in.

# Poisson distribution

The poisson distribution is used to calculate the probability of a certain number of events happening when the mean amount of events is known. A good example is when you run a store and the mean customers per hour is known. This can be used to calculte what the odds are of having that number of customers lets say X plus or minus something.

$P(X = k) = (e^{-λ} \* λ^k) / k!$  in this example $k$ is the amount you want the odds for and the lambda is the mean amount.

# Planar

Something is planar if it can be drawn on a 2D surface, think of this as being able to draw it on a correctly sized piece of paper (keep in mind that if it is a really big 2D space the paper will have the same size).

# Bipartite graphs

A bipartite graph is like modelling the relation between entries in two database tables where a row of one table has a one to one or one to many relationship with a row or multiple from the other table. This can also be done with sets in math. Bipartite graphs are also intrinsically graphs with a chromatic number of 2 and are also the only graphs with a chromatic number of 2 that are non planar.

# Chromatic number

The chromatic number of a graph is the minimum number of unique colors needed to draw the vertices (the corners of the lines aka where the axis meet) of a graph. For instance when drawing a cube this number is **2** but when drawing a pentagon with 5 edges because two colors cannot be adjecent the chromatic number will be **3**. When going up to a hexagon this number will return to **2**. This number can also go up if in let’s say a hexagon opposite points also have a relationship with each other represented by a line. Then the chromatic number can go up again since two vertices cannot share the same color.

# Linear form

A linear form is a function that gives an output for each input in a linear fashion this means that the line when drawn in a graph will be straight.

# Graph cycle

a cycle of a graph is a connection of edges where if you follow the cycle you end up on the same point. A graph can have multiple cycles and do no necessarily have to touch every edge to be a cycle. If a graph is linear than it will only contain one cycle

# Piecewise function

A piecewise function is used to denote two different function depending on the value of the input for instance for $f(x) = \\begin{cases} f_1(x) & x \\leq 100 \\ f_2(x) & x > 100\
\\end{cases}$ this means that the function $f_1(x)$ is called when $x$ is lower or equal to 100 and the function $f_2(x)$ is called when $x$ is higher than 100.

# Hyperplane

A hyperplane is subspace whose dimension is one lower than the space the subspace is drawn in. This is mostly used in 2D or 3D space with a line in 2D space and with a plane in 3D space.

# Criterion function

A criterion function is used to calculate the accuracy of a classification. This can be done using multiple ways.

# Discriminant functions

A discriminant function is used to create a hyperplane in an X dimensional space that separates data points the best possible between two or more classes.

# Convex function

A function is called convex if from one point of the function to another point a line can be drawn that does not interesect the line except for the two points where the line is drawn from.

# Dot product

The dot product of two vectors is magnitude of the combined vectors which is calculated by performing $(a, b) \\cdot (c, d) = (a \* b) + (c \* d) = ab + cd$

# Orthogonal

If two vectors are orthogonal their dot product is 0. This means that they go in opposite directions. If an axis is orthogonal to another axis this means it is perpendicular to another axis.