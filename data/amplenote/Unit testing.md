---
title: Unit testing
uuid: 5d1776bc-da0b-11ee-9a0e-ca8ae82b63ae
version: 2
created: '2024-03-04T09:38:42Z'
tags:
  - javascript
  - imported/markdown
  - frontend
  - testing
  - programming
---

# Unit testing

Unit testing is the lowest level of testing there is. It is testing a specific unit to check if the right value is returned. You can see it like when you have a function like

```jsx
export function add(a, b) {
	return a + b;
}
```

```jsx
import { add } from './utils';

describe('Addition', () => {
	it('1 + 1 = 2', () => {
		expect(add(1, 1)).toEqual(2);
	});

	it('2 + 3 = 5', () => {
		expect(add(2, 3)).toEqual(5);
	});
});
```

Then you can test this like

This is the most basic form of unit testing. Of course this gets a lot more complicated with bigger applications.

Unit testing is a very good tool to ensure that your code functions and keeps functioning. When working in teams it is especially important to write a lot of unit tests. Most unit testing frameworks support the `--coverage` parameter which will scan how many of the functions and methods declared are actually called. This does not 100% guarantee you that everything is tested well since it cannot see how good your tests are.

The amount of coverage can be set in the pipeline to be a value like `minimum of 80%` depending on how thorough you want to be.

Within unit testing there is also a concept called black box testing which means that within frameworks like `vue` and `react` which have isolated component you render the component with the corresponding library and then click a button within the DOM and then see if the right actions are called with the right values. I personally do not prefer this way of testing since it increases the time of development.

My preferred framework to use for testing is `Jest` by facebook, there are also other options like `Jasmine`, `Mocha`, etc. But every option looks like each other.

## Mocking

When writing unit tests writing mocks is an important part, since you want to test a single unit and not the whole chain. So for instance you have a submit function that posts some data to an API from a form, then you can mock the API so you can check if it was called and with what parameters without actually calling the API. You can do this in the following way with `Jest`

```jsx
import axios from 'axios';
import Form from '../components/form.vue';

jest.mock('axios');

describe('Login form', () => {
	it('Submits', async () => {
		axios.post.mockResolvedValue({ message: "Success" });

		const TEST_USER = {
			name: 'John Doe',
			email: 'john.doe@mail.com'
		};

		const wrapper = shallowMount(Form);
		wrapper.name = TEST_USER.name;
		wrapper.email = TEST_USER.email;

		await wrapper.submitForm();
		
		expect(axios.post.mock.calls).toHaveLength(1);
		expect(axios.post.mock.calls[0][0]).toEqual(TEST_USER);
```

Mocking can also be used to mock services that you have created. This is good practice so you are sure you are only testing the logic within the component and will not run into failing tests because some code in another file is creating the error, this can be done like this

```jsx
import { someFunction } from './service-1';

const mock = jest.fn();

jest.mock('./service-2', () => {
	const originalModule = jest.requireActual('./service-2');

	return {
		...originalModule,
		method: mock
	}
};

describe('Test service-1', () => {
	it('calls someFunction', () => {
		// Some test
	});
});
```

Source: [https://jestjs.io/](https://jestjs.io/)