'use strict';

var express = require('express');
var app = express();
var socketServer = require('http').Server(app);
var io = require('socket.io').listen(socketServer);
var next = require('next');

var routes = require("./routes/routes.js");
var path = require("path");
var serveStatic = require("serve-static");

//const dev = process.env.NODE_ENV !== 'production';
var dev = false;
var port = process.env.PORT || 9000;
var ROOT_URL = dev ? 'http://localhost:' + port : 'http://localhost:' + port;

var nextApp = next({
  dev: dev
});
var nextHandler = nextApp.getRequestHandler();

// Nextjs's app prepared
nextApp.prepare().then(function () {
  console.log("test");
  app.use(express.json());
  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });
  app.use(routes);
  //console.log("serve static: ", path.join(__dirname, 'public'));
  app.use(serveStatic(path.join(__dirname, 'public')));
  app.get('*', function (req, res) {
    //    console.log ("get something", req);
    return nextHandler(req, res);
  });

  // starting express app
  //let socketapp = app.listen(port);
  //  io = require('socket.io').listen(socketapp);

  //console.log ("io: ", io);
  console.log("app listening on port ", port);
  // app.listen(port, (err) => {
  //   if (err) throw err;
  //   console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  // });

  socketServer.listen('9000', function () {
    console.log('socket listening on port 9000');
  });

  //const app = require("../app.js");
  //console.log("app.io: ", app.io);
}).catch(function (err) {
  console.log("app prepare error: ", err);
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('my other event', function (data) {
    console.log("other event", data);
  });
});

module.exports.sendSomething = function (aoContacts) {
  console.log("sending something: ", JSON.stringify(aoContacts));
  io.emit('news', {
    something: JSON.stringify(aoContacts)
  });
};