# Finals

# Markov chain

Within markov chains there are a couple of important terms to recollect these are

- reducible and irreducible matrices: a matrix is reducible if it can visit some states and not return
- transient class: is a class that can be left and never returned to
- recurring class: is a class that can always be returned to
- period matrix: is a matrix that oscellates in a certain amount of steps with a period and never other than that period times that is greater than 1
- stationary distribution: is the distribution that the probability matrix approaches
- communication class: is a set of two or more classes that can transition with each other

# Poisson process

Within a poisson process there are a couple items to recollect from the midterms, these are

- $\lambda e^{-\lambda x}$ is the formula for the exponential distribution
- ${\lambda^k \above{1pt} k!} e^{-\lambda}$ is the formula for the poisson distribution
- $\tau_n$ denotes a period from 0 to n
- $\lambda$ denotes the rate of change so lets say 2 events per second.
- $k$ is the number of events that have happened
- $\rho_n$ denotes a single time between n and n - 1
- $N_n$ denotes the total value of an iteration so where $\tau$ denotes the time $N$ denotes the value at time.

This logic above can be used to define

- $E(\tau_n) = {n \above{1pt} \lambda}$ since the total time that has passed is the amount of iterations divided by iterations per second which gets the total amount of seconds that have passed although the process is not per second but it is a good reference.
- $E(\rho_n) = 1 / \lambda$ since this is only about the last iteration it is always the average length of an iteration which is 1 over the rate of change.
- $E(N_n) = \lambda * n$ because the average rate of change times the amount of time that has passed is the amount of total events that have happened.
- $\lambda = {E(N_n) \above{1pt} n}$ this is just a reverse of what is said above.
- The exponential distribution is used to calculate the time between two consecutive jumps. The poisson distribution is to calculate the value of the process.

# Probability generating functions

Probability generating functions are used to calculate the probability of a value occuring at a certain iteration given a random variable with a distribution $\alpha$ it is denoted with $G_x(S)$ where the $x$ denotes the iteration and the $S$ the value, so $G_2(4)$ tries to get the probability that the value is $4$ at iteration $2$.

Another important fact about the $pgf$ is that to calculate $G’_x(S)$ the formula $G’_x(S) = E(x)$ and $G’’_x(S) = E(X^2) - E(X)$ and $Var(x) =E(X^2) - E(X)^2$.

The simple $pgf$ is used for random variable that are independent from their history here the formula becomes $G(S) = \sum_{k=0}^{\infin}s^ka_k$.

### Distribution of PGF

The PGF is very useful  for creating the distribution of a process or initial distribution after some iterations this is because when taking the derivative of the PGF the values are returned so for a pgf of $G(S) = a + bS + cS^2 + dS^3 + … + eS^n$ where $P(X = 0) = a$ and $P(X = 1) = b$ and $P(X = 2) = c$, etc, etc. This is called the distribution as well and for a distribution of $n$ possible values this is given for $n$ values with $P(X = n) = ?$

# Branching process

A branching process tries to describe a stochastic process of population growth. It does this with a probability distribution of $\alpha = (a_0, a_1, …, a_n$) where each index stands for the value the each individual can generate in the next generation so $\alpha = (1/3, 1/3, 1/3)$ denotes the probability of $1/3$ of an individual having no offspring, $1/3$ of having a single offspring and $1/3$ of having two offspring.

To calculate the mean of the branching process use $\mu = \sum_{k=0}^{\infin} ka_k$ where $k$ is the amount that is generated of an individual in the next generation so when taking the previous example this would end up as $\mu = (0 * 1/3) + (1 * 1/3) + (2 * 1/3) = 1$. This mean says a lot about the growth of a population since a mean of lower than $1$ denotes that a branching process is **subcritical** which means that it will eventually die out. When it is exactly 1 it is **critical** which means it is stable and remains at about the same size and if it is above 1 it is called **supercritical** which means the population will grow into infinity.

The variance is calculated very similarly to the mean except for that $k$ is squared and the $\mu$ is subtracted which results in $\sigma^2 = (\sum_{k=0}^{\infin} k^2a_k) - \mu^2$.

Important symbols

- $\mu$ denotes the mean of a distribution with formula $\mu = \sum_{k=0}^{\infin}ka_k$
- $\sigma^2$ denotes the variance calculated with the formula $\sigma^2 = (\sum_{k=0}^{\infin}k^2a_k) - \mu^2$
- $Z_n$ denotes the iteration of the branching process, this is important when using the probability generating function because each iteration has different probabilities like discussed above
    - $G(S) = G_1(S) = a + bS + cS^2$
    - $G_2(S) = G_1(G(S))$
    - $G_n(S) = G_{n-1}(G(S))$
    
    where for each iteration the theorem still holds that $P(Z_2 = 1) = G_2(0)’$ or more generally written as $P(Z_n = N) = N! * G_n(0)’^n$ where $’^n$ denotes the derivate to the $n$-th order.
    
- $E(Z_n) = \mu^n$

## Progeny

Progeny is the total number of individuals up to a generation this is denoted by for the total progeny $\phi = {1 \above{1pt} 1 - \mu}$  for all $\mu < 1$ otherwise it is $+\infin$.

To get the progeny up to a certain point the $EZ_n$ has to be summed so 
$E\phi_n = \sum_{i = 1}^n EZ_i = \sum_{i = 1}^n \mu^i$

## Migration

In a branching process there can also be something called migration which means that outside of the individuals in the process new individuals can enter with a certain set of probability.

## Expected number of individuals in generation

A generation in a branching process is denoted with $Z_n$ where $n$ stands for the generation. To get the $EZ_n$ the formula $\mu^n$ can be used which is the mean value of the distribution to the power of the generation.

## Probability of extinciton

When a pdf is written out as $G(S) = a + bS + cS^2$ this can also be seen as a polynomial $cS^2 + bS + a$ where the probability of extinction is just ${a \above{1pt} c}$ so for $a = (1/4, 1/4, 1/2)$ the probability of extinction becomes $0.25 / 0.5 = 0.5$

In a question with a different form $G(S) = S$ should be solved as well

## Probability of value

Since the generator function extends far and uses the formula $G_n(S) = \sum_{k=0}^{\infin} s^{k}a_{k}$ the values of $P(X = x)$ can be calculated by getting the derivative since $G_n(0) = P(X = 0)$ since all other terms go to zero and since $P(X = x) * s^X$ is used to get $P(X = 1)$ take the derivative of $G_n(0)$ so $G_n’(0) = P(X = 1)$ and $G’’(0) = 2P(X = 2)$

# **Eigen vectors and eigen values**

The eigen vector and eigen value is the vector that gets scaled by a matrix. This means that it is not moved off it’s axis. This is calculated using $Ax = \lambda x$ which means for a matrix A that does a linear transformation of vector x there is a scalar value $\lambda$ that does the same transformation by scaling vector x. This means that this transformation just scaled the vector. To calculate this the **eigenvalue** which is notated by the lambda is transformed to a matrix by multiplying the value with an identity matrix (a matrix with the value 1 over the diagonal). For instance $\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$. This changed the formula to $Ax = \lambda I x$. Then by supplementing this we can get to $(A - \lambda I)x = 0$ where we get to the following matrix (2 by 2 since that is the test questions) $\begin{bmatrix}a - \lambda & b \\ c & d - \lambda \end{bmatrix}$. The next step is to get the value of $\lambda$ by assuming the determinant of this matrix is 0 (to calculate the determinant the following formula is used $ad - bc$). This results in $(a - \lambda)(d - \lambda) - bc = 0$ in this matrix. Then after calculating this a polynomial is shown with $\lambda^2 -  a \lambda - d\lambda + ad - bc = 0$. 

To get the value of $\lambda$ finally the last formula can be used
${ (a + d) \pm \sqrt{(a + d)^2 - 4(ad - bc)} \above{1pt} 2}$ or more simply for the polynomial ${-b \pm \sqrt{b^2 - 4ac} \above{1pt} 2}$. 
Then to find the eigenvector that corresponds to this we have $\begin{bmatrix}a & b \\ c & d \end{bmatrix} \begin{bmatrix}x \\ y \end{bmatrix} = \lambda \begin{bmatrix}x \\ y \end{bmatrix}$  and we take the formula