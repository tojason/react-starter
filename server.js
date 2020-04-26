const fs = require('fs');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();
app.server = require('http').createServer(app);

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
