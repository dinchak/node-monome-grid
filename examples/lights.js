const monomeGrid = require('../index');

async function run() {
  let grid = await monomeGrid();
  
  grid.key((x, y, s) => console.log(`x: ${x}, y: ${y}, s: ${s}`));

  setInterval(() => {
    let led = [];
    for (let y = 0; y < 8; y++) {
      led[y] = [];
      for (let x = 0; x < 16; x++) {
        led[y][x] = Math.floor(Math.random() * 16);
      }
    }
    grid.refresh(led);
  }, 100);
}

run();
