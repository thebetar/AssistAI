---
title: Matrices
uuid: 3d732ec8-da0b-11ee-a972-c250cfa702b7
version: 4
created: '2024-03-04T09:38:20Z'
tags:
  - imported/markdown
  - math
---

# Matrices

A matrix is a group of numbers arranged in rows and columns, this can be used for additions, substraction and multiplication. The addition and substraction part is fairly easy but the multiplication is a little harder.

## Addition

So let’s first start with addition and substraction. This looks something like this

$\\begin{bmatrix}4 & 5\\2 & -6\\end{bmatrix} + \\begin{bmatrix}10 & 3\\4 & 5\\end{bmatrix} = \\begin{bmatrix}14 & 8\\6 & -1\\end{bmatrix}$

$\\begin{bmatrix}4 & 5\\2 & -6\\end{bmatrix} - \\begin{bmatrix}10 & 3\\4 & 5\\end{bmatrix} = \\begin{bmatrix}-6 & 2\\-2 & -11\\end{bmatrix}$

A matrix can also be a negative this looks something like this

$-\\begin{bmatrix}3 & 2\\-4 & 5\\end{bmatrix} = \\begin{bmatrix}-3 & -2\\4 & -5\\end{bmatrix}$

As you can see this is basically doing multiple additions or substractions and putting the results in a matrix. This is also the case when multiplying by a constant like this

$4\\begin{bmatrix}2 & 3\\4 & 2\\end{bmatrix} = \\begin{bmatrix}8 & 12\\16 & 8\\end{bmatrix}$

Matrices are commonly shown with a capital letter.^

[https://www.mathsisfun.com/algebra/matrix-introduction.html](https://www.mathsisfun.com/algebra/matrix-introduction.html) 

## Transposing

A matrix can be transposed. This is a simple way to flip the matrix. This is used for example to determine what graphics look like when looked at from another angle in games. This is done my transposing matrices. The simplest way to explain how this is done is it is like grabbing the top left and bottom right and flipping the matrix like a shaslick like this.

$\\begin{bmatrix}2 & 4 & 6\\3 & 2 & 8\\end{bmatrix}^T = \\begin{bmatrix}2 & 3\\4 & 2\\6 & 8\\end{bmatrix}$

[https://www.mathsisfun.com/definitions/transpose-matrix-.html](https://www.mathsisfun.com/definitions/transpose-matrix-.html) 

### Symmetry

If a matrix is symmetrical this means that the matrix stays the same after transposing an example of a matrix like this is

$\\begin{bmatrix}1 & 2 & 3\\2 & 5 & 4\\ 3 & 4 & 6\\end{bmatrix}$

### Orthonormal

When a matrix is orthonormal it rotates the given output in a way but does not stretch it.

### Diagonal

When a matrix is diagonal it contains number across the diagonal (top left to bottom right) where all other values are 0.

## Multiplying matrices

Multiplying matrices can seem very difficult at first but once you get the trick it is quite easy (while it takes some time to calculate). It is important which matrix is the first and which is the second. A rule when multiplying matrices is that

> The number of **columns of the 1st matrix** must equal the number of **rows of the 2nd matrix**.

This is important because this determines how many calculations are done over each columns and row. How the multiplication is done is from top left to right to bottom left to right start if you would have a that looks like

$\\begin{bmatrix}a & b\\c & d\\end{bmatrix} \* \\begin{bmatrix}e & f\\g & h\\end{bmatrix} = \\begin{bmatrix}i & j\\k & l\\end{bmatrix}$

You would start with calculating

- *i* by doing *a* \* *e* + *b* \* *g*

- *j* by doing *a* \* *f* + *b* \* *h*

- *k* by doing *c* \* *e* + *d* \* *g*

- *l* by doing *c* \* *f* + *d* \* *h*

This could also look like this

$\\begin{bmatrix}a & b\\c & d\\end{bmatrix} \* \\begin{bmatrix}e & f\\g & h\\end{bmatrix} = \\begin{bmatrix}ae + bg & af + bh\\ce + dg & cf + dh\\end{bmatrix}$

A real world example of this would look like this

$\\begin{bmatrix}3 & 4\\7 & 5\\end{bmatrix} \* \\begin{bmatrix}4 & 2\\6 & 2\\end{bmatrix} = \\begin{bmatrix}36 & 14\\58 & 24\\end{bmatrix}$

This is still a simple example of the matrices that have a simlar size now lets try this out with a 2x3 matrix and a 3x2 matrix.

$\\begin{bmatrix}3 & 4 & 6\\7 & 5 & 2\\end{bmatrix} \* \\begin{bmatrix}4 & 2\\6 & 2\\3 & 6\\end{bmatrix}$

For this the same rule applies the end result will have the amount of rows of the first matrix and the amount of columns of the second matrix.

A simple way to look at it is when looking at the rule “The number of **columns of the 1st matrix** must equal the number of **rows of the 2nd matrix**.” this is needed to do the cross multiplication and addition but the amount of rows in the first matrix just increases the amount of iterations that have to be done over the second matrix and the amount of columns increase the amount of operations in each iterations of the first matrix’s rows.

To describe this better let’s look at an iteration as a row of the first matrix which consists of the numbers in the columns for instance in the example above the numbers 3, 4 and 6. Then within that iteration we will have two operations within each operation the numbers separetely will be multiplied by the rows of the second matrix and then the results added to each other so in the example above $3 \* 4 + 4 \* 6 + 6 \* 3 = 54$ for the first operation and then $3 \* 2 + 4 \* 2 + 6 \* 6 = 50$ and that is the first iteration. The second iteration will do the same but swap the 3, 4 and 6 6 for 7, 5 and 2 since that is the new set of numbers in the columns. After this we will end up with 2 rows an two columns in the result that looks like this

$\\begin{bmatrix}54 & 50\\64 & 36\\end{bmatrix}$

[https://www.mathsisfun.com/algebra/matrix-multiplying.html](https://www.mathsisfun.com/algebra/matrix-multiplying.html) 

## Determinant

The determinant is the number that the linear transformation that the matrix describes scales the area of a vector by this also means that if a determinant is 0 also known as singular than all the vector get squashed into a one dimensional line. A determinant has to be calculated to see if the matrix is singular or non singular. The determinant can be calculated when a matrix is square so it must have a size of $n \* n$. The calculation is done by performing the following calculation on the matix

$\\begin{bmatrix}a & b\\c & d\\end{bmatrix}$ will become $a \* d - b \* c$

So $\\begin{bmatrix}3 & 5\\9 & 4\\end{bmatrix}$ will become $3 \* 4 - 5 \* 9 = 12 - 45 = -33$

This seems to be easy enough but once the matrix starts to scale up the calculation becomes a lot harder. For a 3 x 3 matrix the calculation will start to look like this

$\\begin{bmatrix}a & b & c\\d & e & f\\g & h & i\\end{bmatrix}$ will become $a(ei - fh) - b(di - fg) + c(dh - eg)$

The simple way to explain what is happening here is that $a$ will be multiplied by the result of the determinant of the 2x2 matrix that is not on its row or column $\\begin{bmatrix}e & f\\h & i\\end{bmatrix}$. This is also done for the other columns in the first row. Also the resulting numbers are not all subtracted from each other but will be second subtracted from first and third added to the result. This pattern remains when increasing the matrix.

To annote that somethign is a determinant the pipe characaters are used like this $\|x\|$

### Non singular

Like described in the first paragraph of this section a matrix is non singular if it’s detereminant is not 0.

[https://www.mathsisfun.com/algebra/matrix-determinant.html](https://www.mathsisfun.com/algebra/matrix-determinant.html) 

## Inverse of a matrix

Calculating the inverse of a matrix can be used to calculate back from starting values. This is used by taking the reciprocal of a matrix just like from a number which is 8 = $1\\above{1pt}8$ and for matrixes this is the same only division does not exist so it is written as $a^{-1}$. Normally if you multiply the reciprocal of a number by the actual number you will get 1. With matrices the result will become an identity matrix of the same size.

To start calculating the inverse of a matrix the next method is used

$\\begin{bmatrix}a & b\\c & d\\end{bmatrix} = {1\\above{1pt}ad - bc}\\begin{bmatrix}d & -b\\-c & a\\end{bmatrix}$

### Gaussian elimination

An easier way to calculate the inverse of a matrix is using Gaussian elimination. This way of computing feels more natural this is when you start with a certain matrix lets say

$\\begin{bmatrix}1 & -2 & 3\\3 & 1 & 1\\2 & 1 & -1\\end{bmatrix} \\begin{bmatrix}7\\2\\3\\end{bmatrix}$

The trick is to try and get a upper triangular matrix so you can easily deduce from top to bottom what the last column is the the one before that and so on. The first row is multiplied by three and then subtracted from the second row giving us first\
$3x - 6y + 9z = 21$ because $1 - 2y + 3z = 7$.\
Then when subtracting this from the second row we get\
$0x + 7y -8z = -19$

And then further on we can use these to make the last row\
$0x + 5y -7z = -11$ by subtacting the multiplication of 2 from the first row ($2x - 4y + 6z = 14$)

Then with the last two rows we can try and multiply $y$ to become an even value so that we get

$35y - 40z = -95$\
$35y - 35z = -55$

and then from this we can deduce that

$-5z = -40$\
$z = 8$\
From this we can estimate the other values and then we can calculate where the original vector before the transformation existed.

### Identity matrix

An identity matrix is a matrix of size $n\*n$ where the diagonal entries are $1$ and all other values are $0$.

[https://www.mathsisfun.com/algebra/matrix-inverse.html](https://www.mathsisfun.com/algebra/matrix-inverse.html) 

## Rank

The rank of a matrix is how many rows are unique and not made of other rows for example $\\begin{bmatrix}1 & 2 & 3\\2 & 4 & 6\\end{bmatrix}$ has a rank of 1 since the second row is not unique it is the first row multiplied by 2. If the matrix would be $\\begin{bmatrix}1 & 2 & 3\\2 & 4 & 7\\end{bmatrix}$ the rank would be 2 since the 7 makes the theory not hold up. The amount of ranks is useful to know because if it equals the amount of variables that are present in a calculation a unique value can be found for the variable.

The rank is also equal to the dimensions in the resulting transformation.

## Non square matrices

When using a matrix to describe a linear transformation the first way that is taught is with square matrices. Because this transformation changes all the basis vectors from their position to their new position in space after the transformation. This is not the case when using non square matrices. A square matrix looks like this

$\\begin{bmatrix}3 & 2 & 4\\8 & 4 & 5\\5 & 8 & 6\\end{bmatrix}$ and a non square matrix looks like this $\\begin{bmatrix}3 & 2 & 4\\8 & 4 & 5\\end{bmatrix}$ or like this $\\begin{bmatrix}3 & 2 \\8 & 4\\5 & 8\\end{bmatrix}$

What happesn when describing a linear transformation with a non square matrix is that either basis vectors get a place on a lower dimesion or that there is no basis vector to begin with.

## Epimorphism

A matrix can be described to be an epimorphism of two vectors. What this means is that no matter what output you want there is a certain input that can be transformed by the matrix to result in the output. This kind of means that a function is able to return any result based on what parameter it is given to get to that result.

## Types

Matrices can be of different types based on the properties that live in the matrix. For instance a matrix is square if both sides are of equal length. Lets list all the types

- Square: a matrix with equal length of height and width

- Identity: A matrix that has a diagonal with values 1 and the other values of 0

- Diagonal: A matrix that has all its values over the diagonal and the other values as 0

- Scalar: A matrix that has all its values over the diagonal but the values are also all the same value resulting in a scaling function

- Lower triangular: A matrix where values exist in the diagonal and below the diagonal, all values above the diagonal are 0

- Upper triangular: A matrix where values exist in the diagonal and above the diagonal, all values below the diagonal are 0

- Null: A null matrix contians only 0 values

- Symmetric: A symmetric matrix is symmetric over its main diagonal

- Hermitian: A hermitian matrix is symmetric except for the variables that exist in the matrix

[Eigenvectors and eigenvalues](Eigenvectors%20and%20eigenvalues.md) 