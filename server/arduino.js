const io = require('socket.io-client');
const five = require('johnny-five');
const config = require('./config');

// Connect to the socket server
const socket = io.connect(config.url);

const board = five.Board();

board.on('ready', function() {

  const ledFour = new five.Led(4); // Set pin 4 for LED
  const ledSeven = new five.Led(7); // Set pin 7 for LED
  /**
   * @param {String} type - NO (Normally Open - light off) or NC (Normally Closed - light on)
   * */
  const relayOne = new five.Relay({
    pin: 10,
    // type: "NC" // isOn --> NC false/NO true
  });

  const relayTwo = new five.Relay({
    pin: 11,
    // type: "NC" // isOn --> NC false/NO true
  });

  console.log('initial relay on');
  console.log('initial led on');
  relayOne.on();
  relayTwo.on();

  ledFour.on();
  ledSeven.on();

  console.log('relay id:', relayOne.id);
  console.log('relay isOn:', relayOne.isOn);
  console.log('relay pin:', relayOne.pin);
  console.log('relay type:', relayOne.type);

  socket.emit('initial relay status', 'open');

  const array = new five.Leds([3, 5]);


  socket.on('change color', (color) => {
    console.log('arduino file Color Changed to: ', color);
  });

  // Turn LED on when event led:on is received
  socket.on('led:on', function(number){
    console.log('arduino led on:', number);
    array[0].pulse();
    setTimeout(function () {
      array[1].pulse();
    }, 1500);
  });

  // Turn LED off when event led:off is received
  socket.on('led:off', function(){
    console.log('arduino file led off:', config.url)
    // led.off();
    // led.stop().off();
    array.stop().off()
  });

  socket.on('relayOne:toggle', () => {
    console.log('arduino relay 1 toggle');
    relayOne.toggle();
  });

  socket.on('relayTwo:toggle', function() {
    console.log('arduino relay 2 toggle');
    relayTwo.toggle();
  });
});
