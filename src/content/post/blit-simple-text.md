---
title: "2D text blitting, the simple approach"
description: "Providing a basic text renderer for my 2D library"
publishDate: "2025-08-12"
tags: ["c", "banjo", "text", "2d"]
draft: true
---

- [ ] Tell context about Pong and the simple way I made score

- [ ] Present the features we want for our text


## The General Approach

The first thing I need is designing an 8x8 bitmap font.

8x8 is pretty convenient, because it means that each character can be nicely represented by eight 8-bit integers.
If we take for example the 'B' character, the rows, from top to bottom, can we encoded this way

- [ ] Show the 'B' character in pixel, then encoded

As such, the 'B' can be:

```c
char B[] = {
    0xFC, // 1st (top-most) row
    0x66, // 2nd row
    0x66, // ...
    0x7C,
    0x66,
    0x66,
    0xFC,
    0x00, // last (bottom) row
};
```

To tell if we draw the pixel at `column`/`row` for character `B`, we perform a bit shift at index `row` of `B`.
Putting this all together, drawing a 'B' will correspond to this code:

```c
// Draw B on 'bitmap' at 'x'/'y'
for(size_t row = 0 ; row < 8 ; ++row) {
    for(size_t column = 0 ; column < 8 ; ++column) {
        if((B[row] >> (7 - column)) & 0x01) {
            write_pixel(bitmap, x + column, y + row, white);
        }
    }
}
```
This draws an unscaled 8x8 pixel character at the given position (`x`/`y`).

Now, this could be simplified first, by horizontally flipping the encoded character.
This way, the bit shift is directly taken from the column:

- [ ] Do like above, but horizontally split

```c
char B[] = { 0x3F, 0x66, 0x66, 0x3E, 0x66, 0x66, 0x3F, 0x00, };

for(size_t row = 0 ; row < 8 ; ++row) {
    for(size_t column = 0 ; column < 8 ; ++column) {
        if((B[row] >> column) & 0x01) {
            write_pixel(bitmap, x + column, y + row, white);
        }
    }
}
```

And of course, we don't want to write a single char, but a text entirely.

## Creating a Font

First, we will stick to the usual Latin-1 characters, and make an entire array of letters (horizontally flipped).
Fortunately, [someone already did it](https://github.com/dhepper/font8x8A), which was a time saver for me:

```c
#define CHAR_PIXEL_H 8
#define CHAR_PIXEL_W 8 // Used later

static char charset_latin1[][CHAR_PIXEL_H] = {
    { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00},   // U+0000 (nul)
    { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00},   // U+0001
    // ... Lots of lines ...
    { 0x0C, 0x1E, 0x33, 0x33, 0x3F, 0x33, 0x33, 0x00},   // U+0041 (A)
    { 0x3F, 0x66, 0x66, 0x3E, 0x66, 0x66, 0x3F, 0x00},   // U+0042 (B)
    { 0x3C, 0x66, 0x03, 0x03, 0x03, 0x66, 0x3C, 0x00},   // U+0043 (C)
    { 0x1F, 0x36, 0x66, 0x66, 0x66, 0x36, 0x1F, 0x00},   // U+0044 (D)
    // ... Lots of lines ...
};
```

This table, covers, all letters from [Basic Latin](https://en.wikipedia.org/wiki/List_of_Unicode_characters#Basic_Latin), the first Unicode block.
This will be a good start from simple text rendering.
But most importantly, this also means that, in a first time, I'll be able to directly take the `char` ASCII values from a C-style string, and use it as an index for my array (`charset_latin1['B']`).

Now, let's make a dedicated bitmap to contain all the characters of this table.
First, we want to decide about the dimension of our character bitmap.
It will be an NxM grid, each cell containing the glyph for a character.
I arbitrarily decided that the bitmap will contain rows of 16 characters.
The number of rows itself, will depend on the total number of character to support.
In the case of the `charset_latin1` page I showed above, it's 128 characters.
But I will make this a runtime information in order to support, later on, other pages of characters.

Eventually, we get enough data to create a bitmap to hold our charset:

```c
#define CHARSET_CHAR_PER_ROW 16 // Given at compile-time

// The total number of characters in the page (here, 128)
const size_t charset_char_len     = sizeof charset_latin1 / sizeof charset_latin1[0];

// The number of characters displayed in a column
const size_t charset_char_per_col = 
    charset_char_len / CHARSET_CHAR_PER_ROW 
    + (charset_char_len % CHARSET_CHAR_PER_ROW > 0);

// Dimensions of the charset bitmap
const size_t charset_pixel_width  = CHARSET_CHAR_PER_ROW * CHAR_PIXEL_W;
const size_t charset_pixel_height = charset_char_per_col * CHAR_PIXEL_H;

bitmap* charset create_bitmap(charset_width, charset_height);
```

Another thing we need to get easily, is the X/Y coordinate of a character, given its index in `charset_latin1`.
I make it a function-like macro because I know this will be used in a couple of lines:

```c
#define CHAR_PIXEL_X(c) ((c % CHARSET_CHAR_PER_ROW) * CHAR_PIXEL_W)
#define CHAR_PIXEL_Y(c) ((c / CHARSET_CHAR_PER_ROW) * CHAR_PIXEL_H)
```


```c
for(size_t c = 0 ; c < charset_char_len ; ++c) {
    const size_t x = CHAR_PIXEL_X(c);
    const size_t y = CHAR_PIXEL_Y(c);

    for(size_t row = 0 ; row < CHAR_PIXEL_H ; ++row) {
        for(size_t column = 0 ; column < CHAR_PIXEL_W ; ++column) {
            if((charset_latin1[c][row] >> column) & 0x01) {
                write_pixel(charset, x + column, y + row, white);
            }

        }
    }
}
```

Ok, so we got a bitmap, hopefully correctly filled in.
Let's display it as-in on a screen, and we get:

![The full character set](basic_charset.png "My charset")

Looks promising.
Of course the display is tiny, but that's because each character is taking only 8x8 pixels.
But hey, we have a character set in a bitmap, and that's more that enough to start writing text after all.








