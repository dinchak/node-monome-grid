var grid = require('../index.js')('m1000079');

grid.key(function (x, y, s) {
  console.log('x: ' + x + ', y: ' + y + ', s: ' + s);
});

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

refresh();

setInterval(refresh, 100);
