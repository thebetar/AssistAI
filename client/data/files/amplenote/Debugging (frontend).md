---
title: Debugging (frontend)
uuid: 468be5a4-da0b-11ee-a972-c250cfa702b7
version: 5
created: '2024-03-04T09:38:30Z'
tags:
  - javascript
  - imported/markdown
  - debug
  - programming
  - frontend
---

# Debugging (frontend)

Debugging is a very important and often overlooked skill. Whenever you get stuck solving an issue it is important to know which tools you have at your disposal and know how to use them. Within the frontend stack the most important tool to achieve this is the chrome devtools. Which has a lot of neat features to make debugging a breeze. So let’s go over each feature.

## Elements

Within the elements tab all the elements placed on the page are found. This tab can be mostly used to do styling and immediately see how the changes will look on the page. This can be done by selecting an element and using the styles panel to define styles. In this tab all the styling that is applied to the element is shown.

Within elements you can also toggle different element states like `:focus`, `:disabled`, etc.

Elements can also be stored within a global variable. This is useful because you can access the elements within the console tab to dispatch event or select a sub element of the stored element.

## Console

Within the console tab a CLI interface is shown with your browser. This is used a lot to display log, warn and error messages. But this can also be used to check on specific values or perform an action specific to your application.

## Sources

The most important tab within debugging a frontend is the Sources tab. Within this tab the code of the application is shown. In this overview you can place breakpoints like in most debuggers so whenever the code is run at the breakpoints marker the code will be paused and you will be able to walk through the code step by step. This is the ideal way to do debugging since you do not have to place a lot of `console.log`  statements to know what happens where but can walk through the failing code from start to finish to see what is happening. Within the step by step walkthrough there are a couple of things you can use to get all the information you need to understand the scope

- **Scope** see which variables are declared in the scope the debugger is in, this contains the local, parent and global scope.

- **Call stack** see which methods called the method the debugger is currently watching and which method call the method that called the method the debugger is currently in etc.

## Network

When trying to debug functionality that makes an HTTP request to a backend the networks tab can be used to view what is sent and what the response is that was received from the backend. This is very useful if you have an issue with receiving the wrong data. Furthermore the networks tab can be used to see other requests as well which is mostly useful to see if there are not extra files that are not used being fetched and to see which files that a long time to fetch.

Let’s dive a little deeper to what can be seen from an sent HTTP request. When selecting `Fetch/XHR` the tab will filter only requests sent from the application with a fetch or xhr request. When a request is selected a new panel will appear with some extra information about this request. This information is

- **Headers** here the headers sent with the request and received within the response are shown, this is mostly useful to see if the right headers are present when sending a request that is failing on authorisation but can also be used for other purposes

- **Payload** shows the sent request body

- **Preview** shows a preview of the received response, this is mostly useful when receiving document or HTML pages

- **Response** shows the received response body in a unparsed way, this is the best way when receiving JSON or XML responses since the preview doesn’t handle this well

## Application

Within the application tab data that is stored by the browser for the domain that is visited can be seen, this mostly contains cookies that track your action for analytics and tokens that handle authentication after being logged in. Sometimes also data is stored within the storage to prevent the application from needing to sent a new GET request each time you refresh or revisit a page.

## Performance

Within the performance tab you can track how much time reloading or handling an event takes. This is useful when trying to analyse what causes long reload times. Within this tab the time is split apart into what part takes up the time

## Lighthouse

Lighthouse is used to run analysis on your current webpage and shows you metrics of performance and other SEO important aspects. It also provides tips for improving these metrics.