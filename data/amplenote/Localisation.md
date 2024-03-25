---
title: Localisation
uuid: 47e14016-da0b-11ee-9a0e-ca8ae82b63ae
version: 2
created: '2024-03-04T09:38:30Z'
tags:
  - javascript
  - imported/markdown
  - frontend
  - programming
---

# Localisation

Localisation is very important if you want to serve your application in multiple languages. While in an ever globalising world a lot of people speak English, there still are a lot of people that do not. If you make a client facing application it might be a smart idea to offer the option for the user to change the language that the text is displayed in. This can be done by localisation the most popular library for this and the only one I have used is `i18n`.

## How does it work

When using a library for localisation you will have to start thinking about all the text that is displayed within your application and replace this with language labels. These are references to your translation files where they correspond to a value in every language and the corresponding translation.

To give an example for a website with the languages **English** and **Dutch.** You will need to create two files, one for each language with in every file the same language labels defined, this will look something like this

```jsx
// Within "en.js"
export default {
	HELLO_WORLD: "Hello world",
	GREETINGS: "Greetings",
	PAGES: {
		HOME_PAGE: {
			HEADER: "Welcome from homepage"
		}
	}
};

// Within "nl.js"
export default {
	HELLO_WORLD: "Hallo wereld",
	GREETINGS: "Gegroet",
	PAGES: {
		HOME_PAGE: {
			HEADER: "Welkom op de homepage"
		}
	}
};
```

With the translations set the localisation needs to be initialised, I will use `i18next` in this example

```jsx
import englishTranslations from './translations/en.js';
import dutchTranslations from './translations/nl.js';

i18next.init({
	lng: localStorage.getItem('language') || 'en',
  resources: {
    en: englishTranslations,
		nl: dutchTranslations
  }
});
```

When the localisation is setup you can access the data by referencing this language label within your application like this

```jsx
// Example react component
export function Component() {
	return (
		<div>
			{ i18next.t('HELLO_WORLD') }
			{ i18next.t('PAGES.HOME_PAGE.HEADER') }
		</div>
	);
}
```

### Interpolation

Aside from providing the language label that corresponds with a key in the translations file you can also use interpolation, this means using variables within your strings and much more, you can use this like so

```jsx
// In translations file
export default {
	LABEL: "I want {{amount}} of apples"
};

// In react component
<div>{ i18next.t('LABEL', { amount: 8 })</div> // Will print "I want 8 apples"
```