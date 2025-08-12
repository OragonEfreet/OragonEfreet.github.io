---
title: "So, I'm making a game engine"
description: "Thoughts about coding a game engine in C99"
publishDate: "2025-08-12"
tags: ["c", "banjo"]
---

> The story so far: In the beginning, a game engine was created.
> This has made a lot of people very angry and been [widely seen as a bad move](https://geometrian.com/projects/blog/write_games_not_engines.html).

**Banjo API** is my own attempt to create a game framework for my own projects.
The iterations are driven by the progressive development of small games, [from the simplest to the most advanced](/posts/retro-game-dev).

For years, I have been hopping from engines to engines, trying to make video games, and ended up never making a single one.
Now, I am making my own game development framework and I still not make games, and I enjoy it.

## The Project

The project is [hosted on GitHub](https://github.com/OragonEfreet/banjo) and its documentation is [continuously deployed](https://codework-orange.io/banjo).

I don't have a specific roadmap, but [here is a list of things I'm done implementing, or already want to do](https://codework-orange.io/banjo/roadmap.html).

## From Scratch

Banjo is built entirely from scratch — no third-party libraries are baked in.  
Everything, from the windowing layer to the graphics API, is part of Banjo itself.

Of course, some dependencies are simply unavoidable.  
For example, creating windows on Linux requires X11, which means compiling against Xlib.  
Even in these cases, Banjo’s API does **not** directly link to them:

- All such integrations are opt-in — the compiler must [explicitly be told to build with their support](https://codework-orange.io/banjo/build.html).  
- No static or dynamic linking at compile time — they are loaded at runtime instead.

As a result, the Banjo binary itself contains no third-party code.  
The only current exception is the C standard library, which I also plan to make an opt-in dependency at some point.

## Incremental

Banjo grows one small step at a time.
I don’t aim to build it all at once — just the bare minimum to support a feature I need right now.
The cycle is simple: make a game → find something Banjo could do better → add it in → clean it up.
Every new feature comes from real use, tested in practice, then refined for the future.

So to restate: Banjo is driven by [making games](/posts/retro-game-dev), not the other way around.

There’s something deeply satisfying about this process.
The first games I’m making are inspired by the early ’70s and ’80s — titles like Breakout and Asteroids. These games had no engine, no GPU. Their code architecture was built entirely for one specific game, not as a generic framework.

Right now, I’m doing pure software drawing — no rendering engine, just basic drawing primitives on an in-memory bitmap.
Tomorrow, another game might push me to build a better blitter.
Then a software renderer.
Then hardware rendering.
Each step, and every step in between, will be made easier by the experience gained from what I’ve already written.

I’m aware this approach carries a high risk of technical debt.
That’s why I want this mindset to be present from the very beginning and guarded all the way to the end.

## Written in C

Banjo is written in C99.

As I stated it, the priority for me is to have an environment **I enjoy working with**.
And this directly impacts the choice of the programming language.
I've been making C, C++, Python and Rust for years, each time targetting the most modern expression of each technology.
I never felt more comfortable than with the "golden" C/Python stack.

So bear with me.
I _do know_ that choosing a language like C in the 2020's, and more even C99 while C23 is already out, tends to be frowned upon.
So whatever arguments I write in this section is not more important than this statement: **I choosed C99 because I enjoy it**.

Working on a simple language like C as many advantages, especially when it comes to build an API:

Everyone knows C.
Even if you never studied it, you already get the gist, because C is basically a pile of fundamental concepts and nothing else.
Yes, yes — pointers. The mythical dragon everyone swears is impossible to tame.
But honestly? I have a harder time wrapping my head around C++ template metaprogramming or Rust’s borrow checker than I ever did with pointers.

When I say “everyone knows C,” I mean this: give me a clean, well-written C header and I can read it top to bottom without breaking a sweat.
Now I reckon this is not entirely a "language" problem and that the developer itself has many (if not all) parts of responsibility in what makes an API "readable".
But it's never bad gettin the best tool for that.

C is old — and while this [could be seen as a bad thing](https://geometrian.com/projects/blog/use_a_modern_language_already.html), I think there’s a confusion between being old and being obsolete.
Maybe I’m biased, but when a language is still here 26 years (I count from C99), that doesn’t just mean “it’s 26 years old.” It means it’s been modern for 26 years.
C doesn’t need to prove itself anymore, and it’s not going to be swept away by the latest trend in modern programming.

C works everywhere, which is the "software-to-software" equivalent of "Everyone knows C".
Most existing technology have either a native or at least a simple way to communicate effectively to a binary compiled from C.
And C is still the easier language to transpile or overlay, [dramatically facilitating the portability of games](https://www.youtube.com/watch?v=2cOqAHzIfQE) compiled against it.

## Acknowledge, Don't Depend

It's 2025, and I am aware that no line of code in Banjo will reinvent any wheel.
A lot of the source code I write is the result of reading blog posts, books and browsing sources of existing projects.

As such, while the number of dependency is kept to the bare minimum, the number of acknowledgements is a growing metric.
I'll try to [keep track of them all](https://codework-orange.io/banjo/acknowledgements.html).
