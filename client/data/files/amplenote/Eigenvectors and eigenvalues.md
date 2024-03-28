---
title: Eigenvectors and eigenvalues
uuid: 435a8796-da0b-11ee-9a0e-ca8ae82b63ae
version: 4
created: '2024-03-04T09:38:28Z'
tags:
  - imported/markdown
  - math
---

# Eigenvectors and eigenvalues

Within linear algebra matrices are used to describe transformations in a space. These transformations (mostly) change the values of vectors within that space. When changing the space and the accompanying vectors that live in that space the vectors get moved away from what is called their span. This is the line that the vector lived on and that it would follow if the vector was scaled. Not every vector leaves their span though, some vectors stay on their span and get scaled or even sometimes stay the same. These vectors are called eigenvectors and their scalar is called their eigenvalues. When stating the eigen value this is mostly described with the lambda character λ.

A good way to think about eigenvectors or how to calculate them is that a matrix we’ll call $A$ does a transformation on the eigenvector of the space $\\vec{v}$ if $\\vec{v}$ is the eigenvector than multiplying the matrix is the same as multiplying by the eigenvalue $\\lambda$. This results in  $A\\vec{v} = \\lambda \\vec{v}$. When calculating the eigenvalue also an **identity matrix** is often used this is a matrix that has all values of 1 down the diagonal like this$\\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \\end{bmatrix}$this is an example of a 3 by 3 identity matrix but this can be of any size. When used to calculating the eigenvalue the previous $A\\vec{v} = \\lambda \\vec{v}$ can be rewritten as\
$A\\vec{v} = (\\lambda I) \\vec{v}$ since this describes the same transformation as just $\\lambda$. This is because if you multiply a matrix by a number all values will get multiplied by this number and in an identity matrix this will mean that all the diagonal values will equal the number which is this case is $\\lambda$. So for instance when the eigenvalue is 4 this will result in $\\begin{bmatrix} 4 & 0 & 0 \\ 0 & 4 & 0 \\ 0 & 0 & 4 \\end{bmatrix}$.

$A\\vec{v} = (\\lambda I) \\vec{v}$ can also be rewritten as $(A - \\lambda I)\\vec{v} = \\vec{0}$. We know that a vector becomes $\\vec{0}$ when the determinant is $0$ so the result of the transformation on the eigenvector $\\vec{v}$ will have a determinant of 0 so the matrix $det(A-\\lambda I) = 0$. To see how to do this visit the [matrices](Matrices.md) page.

# Symbols

- $\\lambda$ stands for the eigenvalue

- $\\vec{v}$ stands for the eigenvector

## Matrix definite

The eigen value of a matrix also notes if a matrix has a nonnegative or negative definite. This means that all the eigenvalues of a matrix are a nonnegative number.