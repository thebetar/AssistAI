---
title: Strapi
uuid: 5a8d399a-da0b-11ee-9a0e-ca8ae82b63ae
version: 2
created: '2024-03-04T09:38:40Z'
tags:
  - imported/markdown
  - programming
  - cms
  - frontend
---

# Strapi

# Summary

The most well known headless CMS solution within the javascript space is strapi. It offers an easily configurable solution to creating a backend with authentication and a dashboard to access the data stored. Strapi is also very customizable. A downside I have experienced is that it does not support mongodb in the latest version which is a database that fits really well into a lot of stacks.

# Configuring the API

Aside from not supporting MongoDB at the moment Strapi is very customizable when using the right database architecture (I prefer postgres). It contains a very extensive way to declare API. Create hooks that run before and after a specific CRUD action, services to create more extensive functioanality that can be called from these hooks etc. Within a project that did support mongodb this was also the way to make nested fields work by mapping them from the strapi form field to the actual database nested field. This is just an example of how this configuration can allow great flexiblity.