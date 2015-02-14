# node-monome-grid

Simple monome grid library.

# Installation

Install via NPM:

```
npm install monome-grid
```

# Example

```javascript
var grid = require('monome-grid')('m1000079');

function refresh() {
  var led = [];
  for (var y = 0; y < 8; y++) {
    led[y] = [];
    for (var x = 0; x < 16; x++) {
      led[y][x] = Math.floor(Math.random() * 16);
    }
  }
  grid.refresh(led);
}

setInterval(refresh, 100);

grid.key(function (x, y, s) {
  console.log('x: ' + x + ', y: ' + y + ', s: ' + s);
});

```

# Usage

First create a grid object:

```javascript
var grid = require('monome-grid')('m1000079');
```

You can leave the id (m1000079) empty to bind to the first grid object:

```javascript
var grid = require('monome-grid')();
```

## Key Listener

You can define a key listener that gets called whenever a key press event is received.  The x and y arguments represent the coordinates of the button press and the s argument represents the state (1 = pressed, 0 = released):

```javascript
grid.key(function (x, y, s) {
  console.log('x: ' + x + ', y: ' + y + ', s: ' + s);
  // prints x: 2, y: 3, s: 1
});
```

## Refresh LED State

The refresh() method takes a 2-dimensional LED array as an argument.  The first dimension is y and the second dimension is x.  This will automatically adjust for varibright or non-varibright grids.  For example:

```javascript
// initialize empty led array
var led = [];
// iterate over 8 columns
for (var y = 0; y < 8; y++) {
  // initialize second dimension of array (x values)
  led[y] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
}
grid.refresh(led)
```

You should initialize the LED array to the size of your monome.  For example, a 128 should use an 8x16 array.
