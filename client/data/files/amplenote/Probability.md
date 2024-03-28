---
title: Probability
uuid: 2fd8d024-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:06Z'
tags:
  - imported/markdown
  - math
---

# Probability

Probability is the science of predicting an outcome based on past data. An easy way to say this is if you go see how many cars go past a street every hour and do this $n$ times and after a while you compute this data to ${(x1 + x2 + x3 + … + xn) \\above{1pt} n}$ this will give the average of how many cars pass every hour.

# Deviation and variance

To calaculate the standard deviation the following is done.

1. Get dataset for instance grades \[6,7,8,6,9,6\]

1. Calculate the average by adding all values and dividing them by the amount of values $(6 + 7 + 8 + 6 + 9 + 6) / 6 = 42 / 6 = 7$

1. Calculate the squared difference by subtracting the average from each value and squaring the result $(6 - 7)^2 + (7 - 7)^2 + (8 - 7)^2 + (6 - 7)^2 + (9 - 7)^2 + (6 - 7)^2 = 8$

1. Calculate the variance by dividing the squared difference by the amount of datapoint minus one value. $8/(6 - 1) = 8/5 = 1.6$

1. Finally the deviation is the square root of the variance $\\sqrt{1.6} \\approx 1.2649$

The average is mostly described with the lowercase mu “$\\mu$”

Variance is mostly described with with the lowercase sigma to the power of 2 “$\\sigma^2$”

Deviation is mostly describe with the lowercase sigma “$\\sigma$”

The steps above can also be described in one single formula which is

$\\sigma = \\sqrt{{1\\above{1pt}n-1}\\sum_{k=1}^n (x_n - \\mu)^2}$

The calculation for the variance looks like this

$\\sigma^2 = {1\\above{1pt}n-1}\\sum_{k=1}^n (x_n - \\mu)^2$

This looks a lot more complicated so let’s break it down a little bit.

In step 5 we take the square root of the variance which is the square root wrapping the whole calculation.

In step 4 we divide by the length $n$ minus 1 which is the ${1\\above{1pt}n-1}$ part of the equation since the result has to be deviced by $n-1$ but this can also be done by multiplying it by ${1\\above{1pt}n-1}$.

In step 3 we subtract the average denoted by $\\mu$ here from the current value in the set which is iterated over by the summation and for each iteration is placed in $x_n$. Then the result is squared and added together which is by the brackets and the power of 2 and the summation adds all results together. And there we have it an equation that looks difficult made easy!

For the average: ${1\\above{1pt}n}\\sum_{k=1}^n x_n$

## Bias

The general rule of thumb is to see if a constant value is being added or subtracted from that data.

# Average vs mean

Two terms that are often used in combination are average and mean. Sometimes mean is even used to mean average while this is not the case! Both mean and average are very simple concepts. The average is ${sum \\above{1pt} length}$ while the mean is the value that occurs most often. To

## Makarov chains

A makarov chains is a set of values where a probability is given for moving from one value to the other. This can differ per value that the chain is currently on or not.

### Recurrent class

A recurring class in a makarov chain is a value that is guaranteed to be hit again if the chain runs long enough

### Transient class

A transient class in a makarov chain is a value that is guaranteed to only be hit a limited amount of time and after long enough will never be hit again.

# Bayessian analysis

Bayessian analysis with regards to probability is the theorem that a probability changes based on new evidence that has been presented. For instance the probability of a person being over some weight will increase once the evidence is given that this person is longer than average for instance.

## A priori probability

When using bayessian analysis the a priori probability is the initial probability without evidence.

# Principal component analysis

Principal component analysis aims to reduce the dimensionality of data. But what does this mean? The dimensionality of data can be easiest thought of as the columns in a table. Each column holds some data about the row in the table. When analysing datasets with a high amount of columns it can be come tricky to find which columns are interesting to check for making decision on where this datapoint falls under. For this the principal component analysis can be done which tries to find data with high variance across the dataset. This is done by drawing a new axis along the data and trying to find an axis that can be drawn with a high variance but a low amount of error. The error is calculated by seeing if the points along the axis where the original data used to live are far or close to the new principal component. This can be done multiple times and within machine learning this is done for the developer and will show a list of principal components which can be chosen in descending order based on the variance of the total dataset they contain. This can reduce the amount of data greatly!