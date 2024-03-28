---
title: Component framework
uuid: 44911850-da0b-11ee-9a0e-ca8ae82b63ae
version: 4
created: '2024-03-04T09:38:28Z'
tags:
  - javascript
  - frontend
  - imported/markdown
  - styling
  - programming
---

# Component framework

Component frameworks are to `CSS` what frameworks are to `Javascript`. There are other things to consider though. Since of course styling is a lot different than scripting.

One big difference I have to address here is that not every project uses a component framework, sometimes it is preferable to write all the `CSS`. In these cases I always use `SCSS` since this makes it way more organised to write a lot of styling.

The three libraries which I recommended were `Material design`, `Bootstrap` and `Tailwind` while tailwind is more of a library than a framework. Each has their own school of thinking which I will summarise here and will also write a separate page on.

### [Material design](Material%20design.md)

Material design is a framework which needs little customisation, that is why I as a developer love it. Material design is perfect for projects where styling does not need to be custom it just has to be usable and look good at the same time. I have used this for every project where I make dashboards or non client facing applications. Since in these cases it has to be usable, recognisable and be fast. Also the design of Material design is based on the design principles of google. This is why it is recognisable.

### [Tailwind](Tailwind.md)

Tailwind is perfect for smaller projects it offers a helper classes for everything you want. Basically every `CSS property` has a helper class with multiple values. So for instance if you want a card you can just do it like\
`<div class="px-4 py-2 rounded border-2 bg-white">Lorem ipsum</div>`\
as you can see everything has a nice little class. Why I do not like using tailwind in more customisable projects as opposed to some other developers is that I do not like them in tandem. I either want everything in my `SCSS` file or everything in classes and when making things very custom Tailwind makes you have to add a lot of classes and still create some custom CSS for things that are just not able doable by helper classes. Even though these things for projects like portfolio websites or other things it is perfect!

### Bootstrap

Bootstrap offers a little extra customisation while still bringing a lot to the table itself. This is for project where some customisation is needed but not too much. In these cases the `row`, `col` and `container` classes are still super useful while also writing your own `CSS`.

[Material design](Material%20design.md)

[Tailwind](Tailwind.md)