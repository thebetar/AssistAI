---
title: Go
uuid: 35f0ac48-da0b-11ee-a972-c250cfa702b7
version: 2
created: '2024-03-04T09:38:14Z'
tags:
  - imported/markdown
  - programming
  - programminglanguage
---

# Go

Go fills up a space between the lowest level language that are most performant like C and very easy and useful languages like javascript and python. This was also the idea behind the creation of Go. A language that is easy to pick up while also delivering performance that python and javascript just can’t bring. While it is slower than programs written in C or rust it is still performant enough for most use cases where javascript and python fall short.

# Idea

Go was developed by Google to solve the problem of needing a performant language for specific issues but not having enough developers who understand harder to understand languages like C and C++. For this Go was developed a performant language which still has the niceties like a garbage collector. This makes it easier to learn for new developers while still being able to write very performant software.

# How it works

Go differs in syntax to other languages in their usage of receivers and interfaces. These need to be understood to work with Go.

## Receivers

Receivers are like a method on a class that can be added. Within Go type work like classes since methods can be added to them using receivers. This looks something like this

```go
package main

import (
	"fmt"
)

type Wallet struct {
	cards: []string;
	cash: float32;
}

func (w *Wallet) addCash(amount float32) Wallet {
	w.cash += amount
	return w
}

func (w Wallet) getCents() float32 {
	return (cash % 1) * 100
}

func main() {
	wallet := Wallet{[], 10}
	wallet.addCash(20)
	fmt.println(wallet.cash) // Prints 30
}
	
```

Within this example the method is assigned to the `Wallet` type using the first parameter after the `func` keyword. Also a `\*` has been added to make the received instance a pointer instead of a copy. This makes it so if the value is changed within the scope of the method this will be changed on the actual object that was created.

## Interfaces

Interfaces within go are used to let go know shared functionality between one or more types. This is nice if a function should be able to accept a parameter from differing types but with shared properties. One of the interesting things about how go handles interfaces it that it figures out itself if an interface fits with a type or doesn’t. Using this looks like this

```go
package main

import (
	"fmt"
)

type Shape interface {
	x, y int
}

type Cube struct {
	x, y, z int
}

type Square struct {
	x, y int
}

func (s Shape) getArea() {
	return s.x * s.y
}

func (c Cube) getVolume() {
	return c.x * c.y * c.z
}

func main() {
	cube := Cube{4, 2, 3}
	square := Square{5, 6}

	fmt.println(cube.getArea())
	fmt.println(square.getArea())
	fmt.println(cube.getVolume())
}
```

As you can see in this example the `getArea` function is set on every type that adheres to the template of the interface of `Shape` so both the `Cube` and `Square` type have access to this function.

## Multiple return values

Within Go a function can also return multiple values. In a lot of other languages this is done by returning an object, but Go actually supports multiple values which is neat for error handling among other things. This looks something like this

```go
type Todo struct {
	id int
	author string
	content string
}

func makeGetCall() (resp, err) {
	resp, err := http.Get("https://jsonplaceholder.typicode.com/todos")

	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	var todos []Todo

  json.NewDecoder(response.Body).Decode(&todos)

	for i := 0; i < len(resptodos; i++ {
		todos[i].id = i
	}

	return todos
}
```

This is of course a very simple example but generally

## Routines

Within Go it is sometimes needed to run some code on a different thread. So the main thread does not hang. For this goroutines can be used. This is a simple concept where if you annotate a function with `go` in front of it, the function will be run on the first available thread. This is useful for doing HTTP requests for instance.

```go
package main

import (
	"fmt"
	"net/http"
	"time"
)

func main() {
	links := []string {
		"https://google.com",
		"https://facebook.com",
		"https://stackoverflow.com",
		"https://golang.org",
		"https://amazon.com",
	}

	channel := make(chan string)

	for _, link := range links {
		go checkLink(link, channel)
	}

	for link := range channel {
		go func(innerLink string) {
			time.Sleep((5 * time.Second))
			checkLink(innerLink, channel)
		}(link)
	}
}

func checkLink(link string, channel chan string) {
	_, err := http.Get(link)

	if err != nil {
		fmt.Println(link, "Might be down")
		channel <- link
		return
	}

	fmt.Println(link, "Yep it's up")
	channel <- link
}
```

This example also includes channels which are explained below here, but also goroutines can be seen to be used. 5 different HTTP calls are made and waiting for a response from the server. All these requests are made on different threads and waiting concurrently.

## Channels

Channels in go are like event listeners. They can be used to run some code when some data is pushed to the channel. This is done like this

```go
package main

import (
	"fmt"
)

func main() {
	channel = make(chan string)

	for message := range channel {
		go func(innerMessage string) {
			fmt.println(innerMessage)
		})(message)
	}

	channel <- "Hello world"
}
```