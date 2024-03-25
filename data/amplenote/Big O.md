---
title: Big O
uuid: 2cb36b2a-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:00Z'
tags:
  - imported/markdown
  - math
---

# Big O

Big O notation is something that is used a lot in the mathematics and programming world it is used to classify the run time or resources a functions needs based on it’s input. Within programming this is extremely handy because this way you can calculate how much memory or time a function will consume with a given input. Big O notation describes the worst-case scenario of an operations runtime.

This is calculated by looking at how the operations of a function change based on it’s input length for instance if you have a function which does something like this

```python
def get_first_element(array):
	return array[0]
```

The runtime will not change based on the length of the array given, within the big O notation this is described as a `O(1)` function. A function that has a constant runtime.

But some functions run over an array and perform some operation, in this case the length of the array does matter on the amount of operations done, for instance in a function like this

```python
filtered_array = []

def filter_array(array):
	for i in range(len(array)):
		if array[i].condition == True:
			filtered_array.append(array[i])
```

within this function one operation is done per item within the array. This makes it so a longer array results in a longer run time. This is described as `O(n)` within big O notation.

Other functions go even further and need to run over an array twice

```python
def bubble_sort(array):
    for i in range(len(array)):
        for j in range(len(array) - 1):
            if array[j] > array[j + 1]:
                array[j], array[j + 1] = array[j + 1], array[j]
    return array
```

this is mostly done with sorting, within the big O notation this is described as `O(n^2)`.

Another example that is used within programming is going over an array and within each item of the array going over a nested array for instance if you need to check each post from each author separetely. Normally of course this would be done by just going over all the posts where within a post the author is mentioned but there are some instances where iterating over a nested array is needed when doing something like this

```python
blogs = []

def get_all_blogs(authors):
	for author in authors
		for blog in author.blogs
			blogs.append(blog)
```

within the big O notation since it tries to calculate the maximum runtime the largest nested array has to be found which will be the letter `m` in the notation of `O(n+m)`

Lastly there also exists a logarithmic function of the big O notation which is used for specific sorting algorithms. These algorithms go from start to finish so the array that it is iterating over keeps getting smaller and smaller, hence why the operation gets shorter after each iteration this is described with `O(log n)`