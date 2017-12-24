const serialosc = require('serialosc');

let activeDevice;

let grid = {
  ready: false,
  keyCb: () => {}
};

grid.key = (cb) => grid.keyCb = cb;

grid.refresh = (led) => {
  if (!activeDevice) {
    return;
  }
  for (let yOffset = 0; yOffset < activeDevice.sizeY; yOffset += 8) {
    for (let xOffset = 0; xOffset < activeDevice.sizeX; xOffset += 8) {
      let mapLed = [];
      for (let y = yOffset; y < yOffset + 8; y++) {
        if (typeof led[y] == 'undefined') {
          continue;
        }
        for (let x = xOffset; x < xOffset + 8; x++) {
          if (typeof led[y][x] == 'undefined') {
            led[y][x] = 0;
          }
          if (typeof led[y][x] != 'number') {
            led[y][x] = 0;
          }
          if (!grid.varibright && !mapLed[y - yOffset]) {
            mapLed[y - yOffset] = [];
          }
          if (grid.varibright) {
            mapLed[((y - yOffset) * 8) + x - xOffset] = led[y][x];
          } else {
            mapLed[y - yOffset][x - xOffset] = led[y][x] ? 1 : 0;
          }
        }
      }
      if (grid.varibright) {
        activeDevice.levelMap(xOffset, yOffset, mapLed);
      } else {
        activeDevice.map(xOffset, yOffset, mapLed);
      }
    }
  }
};

module.exports = (id, cb) => {
  return new Promise((resolve, reject) => {
    let addEvent = id ? id + ':add' : 'device:add';

    serialosc.start({
      startDevices: false
    });

    serialosc.on(addEvent, (device) => {
      if (activeDevice) {
        return;
      }
      if (device.type != 'grid') {
        return;
      }
      if (device.id.match(/^m\d+$/)) {
        grid.varibright = true;
      }
      activeDevice = device;
      device.on('initialized', () => {
        device.on('key', (press) => {
          grid.keyCb(press.x, press.y, press.s);
        });
        grid.ready = true;
        resolve(grid);
      });
      device.start();
    });
  });
};
