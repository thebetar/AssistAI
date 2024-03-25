---
title: Payments
uuid: 4d4d2f88-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:34Z'
tags:
  - imported/markdown
  - programming
---

# Payments

When creating a service, payments are very important once the product has to start creating an income. For this many services exist that make this very easy like Mollie, Stripe, ideal, etc. Each has it’s own advantages but it’s best to go for simple and fast first and then once the application scales up start looking at a more cost efficient way.

## Stripe

Stripe makes it very easy to create payment within your application. Stripe works with 3 important parts to get simple payments going. The first is the `client` which will connect to the stripe account. The second is the `checkout` which is the payment that a custommers does and the third is the `event` which is a POST request send to a webhook defined by the user where stripe sends a message to once a payment has succeeded

First you have to connect to stripe client on your backend with your account by using

```tsx
import Stripe from 'stripe';

const stripe = new Stripe('api-key');
```