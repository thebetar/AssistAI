---
title: Derivatives
uuid: 29d50c92-da0b-11ee-9a0e-ca8ae82b63ae
version: 5
created: '2024-03-04T09:37:52Z'
tags:
  - math
  - imported/markdown
---

# Derivatives

# Linear and non-linear programming

A derivative calculates the rate of change. For instance if a car is moving and the distance is meassured, the rate of change would be the speed of the car. A derivative is often written as $d\\above{1pt}dx$ where $x$ can be interchanged for some variable. This can be used for instance to say the derivative of a function is a value like this ${d \\above{1pt} dx}\[f(x)\] = f'(x)$. Here the square brackets say this is the derivative of function … and the function with the $’$ means that it is the derivative of a function with the order of the amount of $’$ there are.

# Second derivative

Derivatives can be used even further, if we take the example in the paragraph above we can make a derivative of the derivative which would be the acceleration or deceleration of the car. This is of course a very simple example.

# Antiderivarive

A reverse derivative, so reverse the calculation so to summarize $F’(x) = f(x)$. In this example $F$ is the *antiderivarive.* Another name for antiderivartives are undefinite integrals.

# Rules

To calculate a derivative multiple rules can be used to make calculation of these derivatives easier these are

## Constant rule

For the constant rule the rate of change has to be constant, for instance when two trains start to move from point A to point B where one train moves 2 times faster than the other. When this is true the constant rule can be applied and say that lets call the trains $X$ and $Y$ that the faster train let’s say train $X$ has a speed of $X’$ then the speed of train $Y$ can be described as being $2X’$

## Sum rule

When two functions create a shared result the sum rule can be used to create the derivatives of each. So if ${d \\above{1pt} dx}\[f(x) + g(x)\] = f'(x) + g'(x)$

## Product rule

To describe the product rule it has to be understood that the increased value of a combination of two functions can be describe in multiple ways this can be done with $f(x + \\Delta x)g(x + \\Delta x)$ which is the easiest way but when thinking about a square this can also be written as\
$f(x)g(x) + f(x)\\Delta g + g(x)\\Delta f$ this of course describe $\\Delta f$ and $\\Delta g$ as the result of the growth so basically $f(x) - f(\\Delta x)$ or $g(x) - g(\\Delta x)$ but we can use them as placeholders here. Now it is deductable that ${d\\above{1pt}dx}\[f(x)g(x)\] = f(x)g'(x) + g(x)f'(x)$. This of course is an explanation of what is going on but in a basic sense what is above here can be used so to repeat one more time ${d\\above{1pt}dx}\[f(x)g(x)\] = f(x)g'(x) + g(x)f'(x)$

## Power rule

The power rule is the simplest to apply it works like this\
${d\\above{1pt}dx} = nx^{n-1}$

## Chain rule

The chain rule is useful when working with high powers or chain functions it works like this

${d \\above{1pt} dx} \[(f \\circ g)(x)\] = f’(g(x))g’(x)$ or when using it with high powers

${d \\above{1pt} dx}\[(x^3 - 2x)^{100}\] = 100(x^3 - 2x)^{99} (3x^2 - 2)$

These are similar in the way that the power rule is combined with also taking taking out one of the values and multiplying by it.

## Quotient rule

The quotient rule combines all these rules for the calculation and ends up with\
${d \\above{1pt} dx}\[{f(x)\\above{1pt}g(x)}\] = {g(x)f’(x) - f(x)g’(x) \\above{1pt} g(x)^2}$

## Trigonometric functions

When trying to get the derivative there are some exceptions. One of them is with trigonometric functions like sine, consine and the tangent. These rules are

- ${d \\above{1pt} dx} sin(x) = cos(x)$

- ${d \\above{1pt} dx} cos(x) = -sin(x)$

- ${d \\above{1pt} dx} tan(x) = sec^2(x)$

# Partial derivative

Partial derivatives are useful when working with functions that have multiple parameters like $f(x,y)$ this makes it hard to find the actual derivative and for this purpose partial derivatives have been invented. Lets say a function $f(x, y) = x^2 + y^2$ to take the partial derivative with respect to $x$ the $y$ variable has to be held at a constant, this can be any number since the derivative of any number will result in a $0$ value. So the partial derivative of $f$ with respect to $x$ is $f’(x) = 2x$. Within this notation there is one big flaw, we cannot see to what respect the partial derivative is from or if it even is a partial derivative, that is why the commonly used notation is ${\\partial f \\above{1pt} \\partial x} = 2x$. If we do this but with respect to $y$ this would give ${\\partial f \\above{1pt} \\partial y } = 2y$.

This is how the partial derivative is calculated when the value that is derived from is not dependent on another variable in this case something different happesn for instance for the function $f(x, y) = x^2 + 2xy + y$ the partial derivative of $x$ would be ${\\partial f \\above{1pt} \\partial x} = 2x + 2y$ this is because the derivative of $2x$ is $2$ but since it relates to $y$ this cannot be transformed into a constant and will be transported into the partial derivative.

This theory can be used even further to take the partial derivative of a partial derivative this looks something like this for the function $f(x, y) = x^2y + 2xy^2 + y$. Where ${\\partial f \\above{1pt} \\partial y \\partial x} = 2x + 4y$. This is calculated by going from right to left and first taking the partial derivative with respect to $x$ and then taking the partial derivative with respect to $y$ of the result.

# Evolutionary computation

## Genetic algorithms

Genetic algorithms work by creation a population which is the amount of samples generated per interation or generation.  For each of the samples in the population the fitness is evaluated with a fitness function. After this it is checked if the stop condition is met (the max value is reached if set at all), if not the population is updated, mutated and recombined and send to the next iteration or generation. This keeps going untill the stop condition is met, otherwise it will go on for infinite time.

### Recombination

Within a generation of genetic algorithms two ways of changing the data are used. These are recombination and mutation. Recombination is the step of crossing over values of one sample to the other by creating a cut point and swapping the values before the cut point from two samples

### Mutation

Mutation works by setting a percentage chance of a value mutation and this being calculated for each separate item in the sample. This is the percentage chance of the value switching to the other binary value (0 or 1).

**Juxtaposition** is the placing of the values next to each other to show the differences

## Knapsack problem

The knapsack or backpackers problem is the problem wherein items with the features value and weight have to be optimally placed in a limiting size so that the value is maximised while the weight is minimised.