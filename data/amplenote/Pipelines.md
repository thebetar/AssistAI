---
title: Pipelines
uuid: 52c3157c-da0b-11ee-9a0e-ca8ae82b63ae
version: 3
created: '2024-03-04T09:38:38Z'
tags:
  - programming
  - imported/markdown
  - ops
---

# Pipelines

Pipe are an important part of CI and CD which respectively mean continuous integration and continuous delivery. This is a way to work with software to release every working change as you finish them, so making a lot of patches or versions. A pipeline in it’s most basic sense is a chronological list of steps that it will run through and on success do an action like publish a package or deploy an application. If the pipeline fails on a step it will not continue to the last step. Pipelines can also just run tests.

The configuration of a pipeline most of the time checks which branch a push happened on a run specific steps based on the branch, for instance when some code is pushed to a `feature/\*` branch or to the `develop` branch it will most likely run some testing and linting steps to check if everything still works. When some code is pushed to the `main`, `master` or `prerelease` branch a deployment step is most likely declared (this is how most pipelines are setup and I also advise to do the same).

The basic step a pipeline usually goes through are the following

- Get code from a repository

- Download dependencies

- Run linting

- Run tests

- Build bundle (or docker image)

- Deploy to destination or publish new version to artifactory

This of course is a simple example of a pipeline and can be made much more complex with end to end testing etc.

Pipelines reduce the amount of human error that can occur when releasing a new version. It can create a way to publish while also restricting access to the production server by humans (almost) completely. This is great because we are all human in the end and on a bad day we do not want to run the risk of deleting something on production. When a pipeline is configured it can only do what it is designed to do and nothing else.

Some common technologies for creating and running pipelines are `jenkins`, `azure devops` and `github actions`. I prefer using `github actions` since it is very beginner friendly and it has the design philosophy of KISS (keep it simple stupid), which is one of my favorite ways to think about technology. It also has an expanding amount of plugins (while still having some catching up to do compared to jenkins) but is way easier to use. This is because it lives on your github repository so you only have to add a file to your repository (within `.github/worksflows/` and voila you have just created a pipeline.

Like in other subject I will not go into other pipelines technologies and just focus on `github actions` here.

A simple example of a `github actions` pipeline looks something like this

```yaml
name: vonkprogramming-pipeline
on:
  push:
    branches:
      - master
jobs:
  publish:
    name: Publish
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: 💻 Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: 💻 Install npm dependencies
        run: npm ci
			 - name: 🔍 Test
				 run: npm run test
      - name: 🔍 Lint
        run: npm run lint
      - name: 🗒️ Vulnerability scan
        run: npm run audit
      - name: 🔨 Build
        run: npm run build --production
      - name: 📁 Publish
        uses: Creepios/sftp-action@v1.0.3
        with:
          host: 'ssh.strato.com'
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          localPath: './dist'
          remotePath: './'
```

Source: https://github.com/features/actions