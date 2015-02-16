var serialosc = require('serialosc');
var uvrun = require('uvrun');

var activeDevice;

var grid = {
  ready: false,
  keyCb: function () {}
};

grid.key = function (cb) {
  grid.keyCb = cb;
};

grid.refresh = function (led) {
  if (!activeDevice) {
    return;
  }
  for (var yOffset = 0; yOffset < activeDevice.sizeY; yOffset += 8) {
    for (var xOffset = 0; xOffset < activeDevice.sizeX; xOffset += 8) {
      var mapLed = [];
      for (var y = yOffset; y < yOffset + 8; y++) {
        if (typeof led[y] == 'undefined') {
          continue;
        }
        for (var x = xOffset; x < xOffset + 8; x++) {
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

module.exports = function (id) {
  var addEvent = id ? id + ':add' : 'device:add';

  serialosc.start({
    startDevices: false
  });

  serialosc.on(addEvent, function (device) {
    if (activeDevice) {
      return;
    }
    if (device.type != 'grid') {
      return;
    }
    if (device.id.match(/m\d+/)) {
      grid.varibright = true;
    }
    activeDevice = device;
    device.on('initialized', function () {
      device.on('key', function (press) {
        grid.keyCb(press.x, press.y, press.s);
      });
      grid.ready = true;
    });
    device.start();
  });
  while (!grid.ready) {
    uvrun.runOnce();
  }
  return grid;
};
