const fs = require('fs');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const dgram = require('dgram');

// create express app
const app = express();
app.server = require('http').createServer(app);

// socket.io
const io = require('socket.io')(app.server);

// body parser set up
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// use static folder
app.use(express.static('public'));
app.use(express.static('public/vendor.bundle.js'));
app.use(express.static('public/app.bundle.js'));
app.use(express.static('public/assets'));

const port = process.env.PORT || 8081;
app.server.listen(port, '0.0.0.0', () => {
  console.log('Server is running on localhost:' + port + '/');
});

const udpServer = dgram.createSocket('udp4');

udpServer.on('listening', () => {
  const addr = udpServer.address();
  console.log('UDP Server listening on ' + addr.address + ':' + addr.port);
});

udpServer.on('close', () => {
  console.log('UDP Server Close!');
});

udpServer.bind(5007);

const watch_dir = '/Users/jasonsitu/Desktop/receiver';

io.on('connection', (socket) => {
  console.log('New client connected!');

  udpServer.on('message', (message, remote) => {
    console.log(remote.address + ':' + remote.port + ' - ' + message);
    const msg = message.toString();
    const cond = /^\d+$/.test(msg);
    if (cond) {
      console.log('Received distance');
      socket.emit('distance-update', parseInt(msg));
    }
    if (msg == 'brake') {
      console.log('Received BRAKE!!!');
      socket.emit('brake', true);
    }
  });

  fs.watch(watch_dir, { encoding: 'buffer' }, (eventType, filename) => {
    if (filename) {
      imgName = decodeURIComponent(escape(filename));
      if (imgName.startsWith('image')) {
        const imgFile = fs.readFileSync(watch_dir + '/' + imgName);
        const imgBase64 = new Buffer(imgFile).toString('base64');
        console.log('Sending Image to the front-end...');
        socket.emit('img', imgBase64);
      }
    }
  });

  socket.on('distance-update', () => {
    // send distance data
  });

  socket.on('disconnect', () => {
    console.log('Client Disconnected.')
  });
});
