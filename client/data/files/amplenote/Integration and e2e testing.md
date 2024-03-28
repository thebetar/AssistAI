---
title: Integration and e2e testing
uuid: 5dbf9c48-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:42Z'
tags:
  - testing
  - frontend
  - programming
  - imported/markdown
---

# Integration and e2e testing

Integration and e2e testing unlike components do test a complete flow to trigger every component that will is needed to complete an action and see if the right result comes back. This is done by simulating what a user would do. To explain it very simply if you were to test your own website manually by following the steps you just created and looking at if the right result is shown this is what integration testing and e2e testing does for you automatically. But what is the difference

## Integration testing

With integration testing you are only testing the frontend part of you application, you want to mock the responses of all the requests that are sent. This is because you want to test if your client is working and do not want your tests to fail if the backend is not working properly. Also writing integration tests is a lot simpler since you do not have to actually call the API and write some data to the database that will be persisted after (you can of course setup a test database but this is more work than just mocking the response that you were supposed to get. Within my own projects where I do not work with a team this is my preferred way to test my application since it takes less time to write the tests and they do test a lot of functionality. While this is less thorough than unit testing but for efficiency purposes I recommend sticking to only writing integration tests.

I prefer to use `Cypress` for all my integration testing purposes, it seems like the most feature rich and robust framework out there today. It has a lot of features to select components which are very nested in some frameworks as well, here is a quick example of how a test with cypress would look

```jsx
describe('Login page', () => {
	it('should succeed', () => {
		const loginCredentials = {
			username: 'johndoe',
			password: 'test123'
		};

		cy
			.intercept('POST', '/login', { 
				statusCode: 200,
				body: {
					success: true, token: 'test-token' 
				}
			})
			.as('postLogin');

		cy.visit('/login-page');

		cy
			.get('[name="username"]')
			.should('be.visible')
			.type(loginCredentials.username);
		cy
			.get('[name="password"]')
			.should('be.visible')
			.type(loginCredentials.password);

		cy
			.get('[type="submit"]')
			.should('be.visible')
			.click();

		cy
			.wait('@postLogin')
			.its('request.body')
			.should('deep.equal', loginCredentials);

		cy.url().should('include', 'user-profile');
	});
});	
```

You can also test your backend with integration tests, this of course is a little different than testing a frontend application. But the idea is the same you only want to call the application in an isolated environment where you sent some data and check if the right actions are being performed and the correct data is being sent back. This is done mostly by using a tool like `insomnia` or `postman` to send a request and then see if the correct response has been sent back.

## E2E testing

End to end testing goes a little further than integration testing with this you test the whole chain of events from the entering of a field to the clicking of a button to the request being sent to the server and with a full request of what the server responds with. For this I also use `cypress` but I do not `cy.intercept` the request but let it call the actual server and see if the right response is returned by it this will change the test declared before to look something like this

```jsx
describe('Login page', () => {
	it('should succeed', () => {
		const loginCredentials = {
			username: 'johndoe',
			password: 'test123'
		};

		cy
			.intercept('POST', '/login')
			.as('postLogin');

		cy.visit('/login-page');

		cy
			.get('[name="username"]')
			.should('be.visible')
			.type(loginCredentials.username);
		cy
			.get('[name="password"]')
			.should('be.visible')
			.type(loginCredentials.password);

		cy
			.get('[type="submit"]')
			.should('be.visible')
			.click();

		cy
			.wait('@postLogin')
			.its('request.body')
			.should('deep.equal', loginCredentials);

		cy
			.wait('@postLogin')
			.its('response.body.success')
			.should('equal', true);

		cy.url().should('include', 'user-profile');
	});
});	
```

Source: [https://www.cypress.io/](https://www.cypress.io/)