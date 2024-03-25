# Finals

In this document each lecture is summarised for the test

## Basic: shortnote

Variance: $\sigma = \sqrt{{1\above{1pt}n-1}\sum_{k=1}^n (x_n - \mu)^2}$

Standard deviation: $\sigma^2 = {1\above{1pt}n-1}\sum_{k=1}^n (x_n - \mu)^2$

Vector magnitude: $||u||^2 = u^Tu$

# Lecture 3: Estimation regression

Estimation regression is the act of calculation back from a probability to for instance find out the noise that has to be taken into account. For this some estimators can be used which are:

- ML estimator: which means the maximum likelihood estimator which is best to be used when there is no prior state information
- MAP estimator: which means the maximum posterior estimator which works better than the ML estimator if there is information about the prior state
- LSE estimator: the least squared error estimator is the simplest and most used one and it tries to minimise the square of the error of the expected and received result

Optimisation using the LSE is done by calculating the squared difference between the wanted value and the received value and multiplying this by the derivative of the PDF

# Lecture 4: classification

There are multiple ways to classify data into classes. Some famous one are simple linear classifiers, bayes classifiers, one vs rest classifier, one vs one classifier, etc. Lets go over some.

## Bayes classifier

Bayes classifier use the theory of bayes theorem which states $P(A|B) = {P(B|A)P(A) \above{1pt} P(B)}$. This can be seen in the classifier world as if we see feature B what is the probablity that class A is true. One important thing for the bayes classifier is the each feature is independent this means that they do not influence each other at all. In this classifier this can also be written as $P(Y|x_0, x_1, …, x_n) = {P(Y) \prod_{i = 0}^n P(Y|x_i) \above{1pt} \prod_{i = 0}^n P(x_i)}$ but all the feature probabilities combined sum to one since the chance of any of the features happening is 100% so this simplifies to $P(Y|x_0, x_1, …, x_n) = P(Y) \prod_{i = 0}^n P(Y|x_i)$.

This means in a set of data where lets say the following data exists

| ID | Feature 1 | Feature 2 | Class |
| --- | --- | --- | --- |
| 1 | 1 | 1 | 1 |
| 2 | 1 | 2 | 1 |
| 3 | 2 | 1 | 2 |
| 4 | 1 | 3 | 2 |

This would mean that $P(C_1|X) = P(C_1)P(F_1)P(F_2)$ in this equation $C_1$ refers to class one $F_1$ refers to feature one and $F_2$ refers to feature 2. So this would calculcate the probability of class 1 after a specfic feature vector by calculating the total probability of class one by the probability of the feature happening in feature 1 and the probability of the feature happening in feature 2. So when some features are given this can be used to check for both classes what the probability is when seeing these features of it being class 1 or class 2.

## Bayes classifier: short note

Bayes theorem: $P(A|B) = {P(B|A)P(A) \above{1pt} P(B)}$

Bayes classifier: $P(Y|x_0, x_1, …, x_n) = P(Y) \prod_{i = 0}^n P(Y|x_i)$ where $x_n$ is a feature have any value. And $Y$ is a class.

## Minimum distance classifier

The minimum distance classifier is one that is easy to do by hand. The gist of it is to calculate the centroid of a class by taking the mean of all values and drawing a point in the middle so for 2D data that would mean ${1 \above{1pt} n} \sum_{i=0}^n X_{n}$ for each feature and draw the result. Then if there is a new point calculate the distance between the new point and the centroid. The closest centroid is the class this new point belongs to. This is done by using pythogoras theorem to calculate the magnitude to each with $d = \sqrt{X^2 + Y^2}$

## Decision trees

Decision trees are one of the simplest and widely used ways of solving classification problems. This is because they work very intuitively to the human brain. They provide a set of yes or no questions (also sometimes questions with 3 answers) and based on this they progress onto a new question untill some N layers down the answers lead to a specific class. The goal with decision trees is to make the amount of levels as little as possible.

The power of decision trees is their simplicity, they can be trained quickly and classify quickly on easy to classify data sets.

**CART** stands for classification and regression tree.

### Entropy

Entropy is calculated to see how well a node splits the data. This is calculted with the following formula $E(A) =-\sum_{k \in A} P(k) \log_2 P(k)$ for each node where $P(k) = {k \above{1pt} K}$ where small $k$ stands for all datapoints that have the same class and large $A$ denoting all data points in the node. To calculate the max number of entropy use $log_2 K$ where $K$ is the total number of classes.

### Information gain

Information gain is important to see how good an attribute can be used to split the data. First the entropy of each created node by a split is calculated with 
$E_v = -\sum_{k \in K} (P(k) \log_2 P(k))$. 
Then after doing this for each value the weighted sum of all entropies is calculated using 
$W(A) = \sum_{v \in A} ({D_v \above{1pt} D} * E_v)$ where $D_v$ denotes the amount of data points that fall into a value of the attribute and $D$ denotes the total data points in the parent.
Finally the information gain is calculated by combining this with $IG(A) = H - W$.

### Information gain ratio

When the information gain has been calculated also the ratio can be calculated of each attribute this is done by $Split(A) = -\sum_{v \in A}(P(v | A) \log_2(P(v | A))$ and then to get the information gain ratio $IGR(A) = {IG(A) \above{1pt} Split(A)}$

### Gini impurity

When choosing what features to split a decision tree on it is interesting to find out which node will have the highest information gain. This is done by calculating the probability of making a correct guess based on the information. Lets say there are two classes $C_0$ and $C_1$ and each data point has two features $F_1$ and $F_2$. Let’s assume in this case that each feature has two possible values (binary). In different cases the node can be converted into a is higher or lower than for integer values. Then the calculation can be done with the following steps

- If $F_1 = 0$ then the probability of guessing correctly is $P(C_0 | F_1 = 0) + P(C_1|F_1=0)$ which is calculted by taking how many points are in the split with the correct class over the total number of points that arrive in this point so for a total of 100 samples that have feature $F_1 = 0$ lets say 20 have $C_0$ and 80 have $C_1$ this means that the calculationg becomes 
$({20 \above{1pt} 100})^2 + ({80 \above{1pt} 100})^2 = {17 \above{1pt} 25}$ and for $F_1 = 1$ where it splits the 25 of $C_0$ and 25 of $C_1$ this becomes 
$({25 \above{1pt} 50})^2 + ({25 \above{1pt} 50})^2 = {1 \above{1pt} 2}$. This value really easily translates to the gini impurity of this new node with this feature by doing $1 - P(C_0 | F_1 = 0)^2 - P(C_1 | F_1 = 0)^2$ so for the first example $1 - {17 \above{1pt} 25}$
- Next for the first feature it can be calculated what the probability is of getting the correct guess when choosing this feature by taking the total samples which is $100 + 50 = 150$ and multiplying the sahre of each decision by the probability of being correct so for the previous example this would become ${17 \above{1pt} 25} * {100 \above{1pt} 150}$ and ${1 \above{1pt} 2} * {50 \above{1pt} 150}$ which is then combined to |
${17 \above{1pt} 25} * {100 \above{1pt} 150} + {1 \above{1pt} 2} * {50 \above{1pt} 150} = 0.62$ which means the information gain is $62\%$

### Gini splitting

An important part of decision trees is splitting the nodes in a way where there are not a lot of levels needed to the decision tree. To do this the GINI index can be calculated over the data. The formula for this is $GI = 1 - P(A)^2 - P(B)^2$ for a binary tree.

This seems more complicated than it is. It is done in the following steps:

- For binary data
    1. Create a node with True and False per data point and see how it splits the data, all True values are moved to the left, write down how many fall under each class, all False values are moved to the right, also write down how many fall under each class
        
        ![Untitled](Finals%2086c233a6f8ce48eea34ded80ce3657ae/Untitled.png)
        
    2. See which nodes are pure and impure. A node is pure if it only contains one class. It is impure if it contains 2 or more classes (in most cases decision trees are used for 2 class problems)
    3. If a node is impure the gini impurity index can be calculated by using the formula 1 - (probability of class 1)^2 - (probability of class 2)^2. To show this in some code for the image represented here:
        
        ![Untitled](Finals%2086c233a6f8ce48eea34ded80ce3657ae/Untitled%201.png)
        
        ```python
        def get_gini_impurity(class_1, class_2):
        	prob_class_1 = class_1 / (class_1 + class_2)
        	prob_class_2 = class_2 / (class_1 + class_2)
        
        	return 1 - prob_class_1 ** 2 - prob_class_2 ** 2
        
        gini_impurity_leaf_1 = get_gini_impurity(1, 3)
        
        print(gini_impurity_leaf_1) # 0.375
        ```
        
        1. For the next step the gini impurity has to be calculated for both leaves, these values need to be multiplied by the amount of points in this leaf divided by the total number of points in the set. Then the numbers have to be added to each other this would look something like this in code
        
        ```python
        def get_total_gini_impurity(leaf_1, leaf_2):
            gini_imp_l_1 = get_gini_impurity(leaf_1[0], leaf_1[1])
            gini_imp_l_2 = get_gini_impurity(leaf_2[0], leaf_2[1])
            
            total_points = leaf_1[0] + leaf_1[1] + leaf_2[0] + leaf_2[1]
            total_l_1 = leaf_1[0] + leaf_1[1]
            total_l_2 = leaf_2[0] + leaf_2[1]
        
            gini_imp_l_1_multiplier = total_l_1 / total_points
            gini_imp_l_2_multiplier = total_l_2 / total_points
        
            total_gini_imp_l_1 = gini_imp_l_1_multiplier * gini_imp_l_1
            total_gini_imp_l_2 = gini_imp_l_2_multiplier * gini_imp_l_2
        
            return total_gini_imp_l_1 + total_gini_imp_l_2
        
        total_imp = get_total_gini_impurity([1, 3], [2, 1])
        ```
        
        1. Finally pick the feature with the lowest GINI index from it’s leaves to find the ideal decision tree.

## Decision tree: Short note

Entropy: $E(A) =-\sum_{k \in A} P(k) \log_2 P(k)$

Weighted sum of all entropies: $W(A) = \sum_{v \in A} ({D_v \above{1pt} D} * E_v)$

Information gain: $IG(A) = H - W$

Information gain split:  $Split(A) = -\sum_{v \in A}(P(v | A) \log_2(P(v | A))$

Information gain ratio: $IGR(A) = {IG(A) \above{1pt} Split(A)}$

Gini impurity: $GI(A) = 1 - P(C_1)^2 - P(C_2)^2$

## Support vector machines

A support vector machine is a linear classifier algorithm that aims to find the best linear separator with the maximum amount of margin between the classes and the linear separator. It often does this by moving the data into a higher dimension by creating an extra dimension based on one or more dimensions.

To calculate the ideal weight for a hard margin support vector machine the weights and bias used will classify all positive classes with $wx - b \geq 1$ and all negative classes with $wx - b \leq -1$ where all the support vectors of each class live on the exact line where $wx - b = 1$ for the positive classes and $wx - b = -1$ for the negative classes.

One important note about support vector machines is that it can ignore **outliers**.

There are some important terms used when talking about SVMs (support vector machines)

- Hyperplane: the hyperplane is another word for the linear separator that also encompasses higher dimensions where the separator would not be a line. There are however three different hyperplanes to hold into account
    - Separator hyperplane: calculated with $wx - b = 0$
    - Positive hyperplane: calculated with $wx - b = 1$. This is the line where all the support vectors for the positive class live on.
    - Negative hyperplane: calculated with $wx - b = -1$. This is the line where all the support vectors for the negative class live on.
- Support vector: is the vector to the closest data point, the algorithm tries to maximise this distance
- Margin: the margin is the distance between the support vector and the hyperplane as mentioned above
- Kernel: the kernel is a mathematical function that is used to create extra dimensions to the data to make it better separable. For instance when thinking of data that is one dimensional it can add another dimension by taking this feature $x$ and creating $y$ as $y = x^2$ and since squaring $x$ creates a curve it can sometimes help with a problem where the data is one the line like
$C_1, C_1, C_2, C_2, C_1, C_1$ where no point can be drawn to separate. This is only one example of such a kernel the kernels that exist are
    - Polynomial kernel: add an extra dimensions that is $y = x^2$ if this is not enough it can add another which would be $z = x^3$ so the formula is $d = x^n$ where the new dimension is $d$ and the number this dimension is that is added is $n$
- Margin: is the distance between the positive and negative hyperplane calculated with ${2 \above{1pt} ||w||}$ where $w$ is the weight of the linear separator and $||$ denoting that it should be the magnitude of this weight.
- Hard margin: is when the separating hyperplane has no outliers and classifies all the training samples perfectly
- Soft margin: is when the separting hyperplane has some outliers and does not classify perfectly.
- SVM under noise: means that there are data points which produce noise.

The line that the SVM draws is represented by $w^T a + b$

To calculate the distance between this line and the support vector the following formula can be used ${w^T a + b \above{1pt} ||w||}$ where $||w|| = \sqrt{|w_1|^2 + |w_2|^2}$ where $|w_1|$ stands for the absolute value of $w_1$.

To find the positive, negative and separator hyperplanes and the margin between them from a set of support vectors can be done with as little as three support vectors. This will work with the following steps:

- Get the line function from the first line by calculating the slope between the two points that belong to the same class this is done by using the formula ${y_2 - y_1 \above{1pt} x_2 - x_1}$ for the slope. Then with this slope try to add a bias to make it cross through the points by using this new value lets call it $s$ to implement $sx + b = y$ here b can be calculated by substituting the value for $x$ and $y$ with the values of one of the data points $[x_1, y_1]$ or $[x_2, y_2]$
- This gets the line for the first class now for the second class use $sx + b$ but for the bias of the second line use the point that belongs to this class $[x_3, y_3]$ lets assume this is in this case the third and final point in the set.
- Now there are two lines the positive and the negative line now to get the seperator line we can use ${b_1 + b_2 \above{1pt} 2}$ where $b_2$ is the negative line and $b_1$ is the positive line. Check this value because the new point needs the same distance to $b_1$ and $b_2$.
- Now using the formula from trigonomitry to rotate the line using $ax + b = y$ and the rotated line is $ay + b = -x$ which substitutes back to $-{x \above{1pt} a} - b = y$. The bias value for our purposes is useless however so we will end up with just $-{x \above{1pt} a}$
- No we need to find the intersection that this paralel line has with the positive and separator plane this is done by using $-{x \above{1pt} a} = sx + b$ to get the $x$ value for each line of the intersection. The $y$ value is then found by adding the value for $x$ to one of the two functions (since they intersect it will be the same but it is good to check)
- This will result in two positions (vectors) on the graph pointing to the intersection this line has with the positive hyperplane and the separator hyperplane. Finally these two coordinates can be used to $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$
- This is the distance for the margin between the separator and the positive line to get the total number this result has to be doubled $margin = 2d$

### Loss function

The loss function works by calculating the values that are not classified correctly by the SVM, this is important since soft margin SVM are more likely to create a robust classier for new data points. The formula for this is $max(0, 1 - y_i(w x_i - b))$ where $y_i$ is the label of the data point which is either 1 or -1 and $w x_i - b$ stands for the received classification which is between -1 and 1. This means there will be some loss calculated for values that are between -1 and 1 or that have a different label than what is received for instance the label being -1 but the classifier getting 1.

### Vapnik–Chervonenkis dimension

This dimension calculates how many total points can be separated by every possible separating hyperplane. This means for a set of $n$ data points if there is a perfect separator all $n$ points are also in this Vapnik-CHervonenkis dimension. If the SVM has a soft margin where lets say there are two outliers than this wold be $n - 2$. The trick to this is thinking if it is possible to separate the data points into all possible subsets which is sometimes not possible with one separating hyperplane for instance in the image below it shows it is only possible for 3 point in this 2D plane

![Untitled](Finals%2086c233a6f8ce48eea34ded80ce3657ae/Untitled%202.png)

The amount of groups that can be separated are equal to the amount of classes to the power of the amount of points so if the amount of classes is $C$ then it would be $C^n$.

### Dot product

The dot product can be calculated with two formulas:

- $a \cdot b = |a| * |b| * cos(\theta)$ where $|a|$ and $|b|$ stand for the magnitudes of each vector
- $a \cdot b = a_x * b_x + a_y * b_y$

## SVM: Short note

SVM Loss function: $max(0, 1 - y_i(wx_i - b))$

SVM hyperplanes: $H_s = wx - b = 0$ and $H_p = wx - b = 1$ and $H_n = wx - b = -1$

SVM support vector to lines:

- Slope: $a = {y_2 - y_1 \above{1pt} x_2 - x_1}$
- Bias postive hyperplane: $ax + b_p = y$ with support vector $[x_1, y_1]$
- Bias negative hyperplane: $ax + b_n = y$ with support vector $[x_3, y_3]$
- Bias separating hyperplane: $b_s = {b_p + b_n \above{1pt} 2}$
- Margin: perp line $-{x \above{1pt} a} = y$ then get intersection with $ax + b_p = -{x \above{1pt} a}$ and $ax + b_s = -{x \above{1pt} a}$ and plugging in resulting $x$ in both functions to get $[x, y]$ finally calc distance between two points with $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$
- To get vector use deduction where you plug in data point that are support vectors and use them to do $w^Tx_1 + b$, $w^Tx_2 + b$, etc. to deduce. Or when using the method above the sum of the vector needs to be 1 total so if the result is $\begin{bmatrix} -0.6 \\ 1.2 \end{bmatrix}$ this needs to be transformed to $\begin{bmatrix} -{0.6 \above{1pt} 1.8} \\ {1.2 \above{1pt} 1.8} \end{bmatrix}$ which results in $\begin{bmatrix} -{1 \above{1pt} 3} \\ {2 \above{1pt} 3} \end{bmatrix}$

# Lecture 5: ANN and deep learning

The mean squared error is only used to calculate the quality of weights in a network and is not used in back propagation.

An artificial neural network is called deep learning if there are two or more hidden layers.

![Untitled](Finals%2086c233a6f8ce48eea34ded80ce3657ae/Untitled%203.png)

- Input vector $[x_1, x_2, ..., x_n]$
- Weight vector $[w_1, w_2, …, w_n]$
- Layer matrix $\begin{bmatrix} w_{01} & w_{11} & w_{21} & … & w_{n1} \\ w_{02} & w_{12} & .. w_{n2} \\ … & … & … & … \\ w_{0n} & w_{1n} & w_{2n} & … & w_{nn} \end{bmatrix}$ in this matrix one neuron’s weights are $\begin{bmatrix} w_{01} & w_{02} & w_{03} & … w_{0n} \end{bmatrix}$ so the layer matrix can also be described as for every weights vector described as $w_{0n}, w_{1n}, w_{2n}, …, w_{mn}$ where $m$ is the amount of neuron in the layer it would look like $\begin{bmatrix} w_{0n} & w_{1n} & w_{2n} & … & w_{mn} \end{bmatrix}$ this seems a little counter intuitive since the weight vector is horizontal but in the matrix it is shown vertical.
- Error function is calculated by ${1 \above{1pt} n} \sum_{i = 0}^{n} (d_{i} - o_{i})^2$ where $n$ is the amount of features, $d$ is the desired output and $o$ is the received output from the output layer.
- Delta error is calculated using the power rule, the explanation looks a lot scarier most of the time than it actually is.
    - **Output layer**: but it boils down to getting the derivative of the output which is calculated with $o_{oi}(1 - o_{oi})$ this is then multiplied by the total error $d_{oi} - o_{oi}$. There is a lot more to this calculation but since it is a partial derivative over a single variable for the $i$th index it simplifies to this. The delta error is then calculated with combining this to $(d_{oi} - o_{oi})o_{oi}(1 - o_{oi})$. This is the delta error for the output layer in a lot of examples the desired output and received output are more precisely denoted with $d_{oi}$ and $o_{oi}$ to show with the $o$ that it is the output of the output layer. The output of this is mostly converted to a feature vector like $\begin{bmatrix} \delta_{o1} & \delta_{o2} & … & \delta_{on} \end{bmatrix}$
    - **Hidden layer:** the hidden layer works by using the delta of the output layer and implementing it into the above calculation $(\delta_{o1} w_{1i} +  \delta_{o2} w_{2i} + \delta_{o3} w_{3i} + … + \delta_{on} w_{ni}) o_{hi} (1 - o_{hi})$

## Convolution

Within neural networks convolution can be used on 2 dimensional data to classify objects in images better. This is done by moving a kernal across an image with a specific padding. In this kernel the dot product is taken from all the values in the kernel and placed on the center of the kernel. A kernel can also have a step size although this step size usually is 1. The image is redcued in size by the padding of the convolution layer. Padding is not always in the convolutional layer so a convolutional kernel of size 3x3 does not necessarily reduce the size of the image.

- Size: a convolutional layer can have a size of 1x1, 3x3, 5x5 or 7x7 the size of the convolutional layer decides how big the size is of the mean or max with weights on each item in the grid
- Padding: padding says how much the convolutional layer can go outside of the image border this means that a size like 3x3 which would normally reduce the image size with a padding of 1 would not reduce the size
- Stride: the step size is how much the convolutional layer shifts per iteration this has an effect on the result’s size
- Formula: generally the formula for the output size of a concolutional layer is 
$W_{out} = {W_{in} - F_w + 2P_w \above{1pt} S} + 1$ for the width and
$H_{out} = {H_{in} - F_h + 2P_h \above{1pt} S} + 1$ for these formulas $W_{in}$ is input width, $H_{in}$ is input height, $F_w$ is filter width, $F_h$ is filter height, $P_w$ is padding width, $P_h$ is padding height, $S$ is stride.
- Formula: to calculate the weights in a convolutional layer use $w = F_w * F_h * D_{in} * F_d + F_d$ for this formula $D_{in}$ is input depth (third dimension) $F_d$ is filter depth which is equal to the amount of filters. The other variables are the same as the point preceding this one.
- Filters: is the amount of convolutional layers and decides the third dimension

## Pooling

Similar to a convolutional layer pooling tries to generalise the data in the image. It does this by taking the mean or max of a n by n size pool. Pooling however also contains size, padding and stride. This however results in a different size than the convolutional layer

- Formula: generally the formula for the output size of a concolutional layer is 
$W_{out} = {W_{in} - F_w + 2P_w \above{1pt} S_w} + 1$ for the width and
$H_{out} = {H_{in} - F_h + 2P_h \above{1pt} S_h} + 1$

## Activation function

Activation function converts the output of a neuron to something that can be used to classify and calculate relationships with between values. This is very useful in the back propagation step. Activation functions that are used are:

- Linear: that is calculated by $f(x) = x$
- ReLu: that is calculated by $f(x) = max(0, x)$
- LeakyReLu: that is calculated by $f(x) = max(ax, x)$ where $a < 1$
- Sigmoid: that is calculated by $f(x) = {1 \above{1pt} 1 + e^{-x}}$ with derivative $f(x) (1 - f(x))$

## Error functions

The error function is used to calculate the amount of error

- Mean squared error: that is calculated ${1 \above{1pt} n}\sum_{i = 1}^{n} (d_i - o_i)^2$

## Training procedures

There are multiple training procedures using gradient descent these are

- Stochastic gradient descrent: updates weights per samples
- Mini batch gradient descrent: updates weight per batch size
- Batch gradient descent: updates weight per epoch over whole training set

## ANN: Short note

ReLu: $f(x) = max(0, x)$

LeakyReLu: $f(x) = max(ax, x)$ where $a < 1$

Sigmoid: $f(x) = {1 \above{1pt} 1 + e^{-x}}$

Sigmoid derivative: $f’(x) = x (1 - x)$

Convolution size: $X_{out} = {X_{s} - F_s + 2P \above{1pt} S} + 1$ where $s$ is size (height or width)

Convolution weights $w = F_s^2 * X_{z} * F_z + F_z$ where $z$ is depth

Delta error output layer: $\delta_o = (out_o - desired_o)out_o(1 - out_o)$ where $out(1 - out)$ is the derivative of the sigmoid activation funciton so the error is actually $out - desired * f'(x)$

Delta error first hidden layer: $\delta_h = (\delta_o w_o^T)out_h(1 - out_h)$ 

Delta error second hidden layer: $\delta_j = (\delta_h w_h^T)out_j(1 - out_j)$

Error function: $E = {1 \above{1pt} n} \sum_{i = 0}^n (t_i - o_i)^2$ where $t_i$ is target output and $out_i$ is actual.

Update weights: $w = w - \alpha \delta$ where $\alpha$ is learning rate.

# Lecture 8

## **Homogenous region**

is a region within an image that is connected with respect to a certain parameter. Some simple examples of these parameters are color, intensity, pattern, texture.

### Region growing and merging

One way to define this region is by growing or merging. This is done by starting from a single pixel and slowly merging pixels together to form regions. This is done by checking if a pixel that neighbours a starting pixel or region falls within the homogenity criterion. If true add this pixel to the region (or create from this pixel and the starting pixel).

### Split and merge

Works the opposite of region growing by first cutting the image in 4 parts and checking if these newly created regions are homogenous. If so it will not be split again, if so this region will be split into 4 again. The next step will be to check if neighbouring regions have similar homogenity.

This can be described with the following formula $|mean(R_1) - mean(R_2)| < \theta(R_1 \cup R_2)$

## Texture analysis

Texture analysis works by converting the image to a grayscale version and finding regions that have the same values. This is done by comparing the mean of a region to neighbouring pixels or regions.

## Grey level co occurence matrix

The grey level co occurence matrix aims to show how many neighbouring pixels have the same value. It uses $G(d, r)$ where $d$ is for distance and $r$ is for radius. This is then placed in a co occurence matrix of $n^2$ size where $n$ is the amount of unique values.

## Regions: shortnote

- Region merging: $|mean(R_1) - mean(R_2)| < \theta(R_1 \cup R_2)$
- GLCO: $G(d, r)$ where $d$ is distance and $r$ is radius (0 = horizontal, 1 = vertical)

# Lecture 9 object recognition

For object recognition there are multiple ways to try and classify and object a very powerful way is with K-D tree  search

## K-dimensional tree search

For K-D search you have to use a very simple algorithm which works by drawing the points chronologically on a plane, for example a 2D plane and then from first to second point along the axis that change by every iteration see how they split the data for instance in a table with data

| ID | Feature 1 | Feature 2 |
| --- | --- | --- |
| 1 | 4 | 5 |
| 2 | 6 | 3 |
| 3 | 2 | 4 |
| 4 | 1 | 3 |

A tree could be drawn that starts with points (4, 5) which would start as the root node. Then going from dimension to dimension this first points will create a linear separator spanning the X-axis. This means that the next point (6, 3) will fall on the right subtree since the X value is higher than the first value. This will create a new node which creates a linear separator spanning the Y-axis. For points (2, 4) it will fall on the left subtree of the root node so it will create a new subtree also spanning the Y-axis. Finally (1, 3) will go to the left subtree of the root node since the X-axis is also lower and then will go to the left subtree of the second node since the Y value is lower creating the following tree:

![Untitled](Finals%2086c233a6f8ce48eea34ded80ce3657ae/Untitled%204.png)