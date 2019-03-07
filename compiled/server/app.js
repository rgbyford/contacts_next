'use strict';

var _database = require('./models/database');

var express = require('express');
var app = express();
var socketServer = require('http').Server(app);
var io = require('socket.io').listen(socketServer);
var next = require('next');

var routes = require("./routes/routes.js");
var path = require("path");
var serveStatic = require("serve-static");
//import list from './list';


// var util = require('util');
// var vCard = require('vcard');
// var card = new vCard();
// /* Use readFile() if the file is on disk. */
// card.readFile("test.vcf", function(err, json) {
// 	console.log(util.inspect(json));
// });

var dev = process.env.NODE_ENV !== 'production';
var port = process.env.PORT || 8000;
var ROOT_URL = dev ? 'http://localhost:' + port : 'https://ssr-csr.builderbook.org';

var nextApp = next({
  dev: dev
});
var nextHandler = nextApp.getRequestHandler();

// Nextjs's app prepared
nextApp.prepare().then(function () {
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

  socketServer.listen('8000', function () {
    console.log('socket listening on port 8000');
  });

  //const app = require("../app.js");
  //console.log("app.io: ", app.io);
}).catch(function (err) {
  console.log("app prepare error: ", err);
});

io.on('connection', function (socket) {
  console.log('a user connected');
  // socket.emit('news', {
  //     hello: 'world'
  // });
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

//console.log("app get");
//app.get('*', function (req, res) {
//    console.log("contacts sendFile: ", path.join(__dirname, req.params[0]));
//    res.sendFile(path.join(__dirname, req.params[0]));
//    console.log("contacts sendFile done: ", path.join(__dirname, req.params[0]));
//});


// app.get('/api/v1/public/list', async (req, res) => {
//   console.log("app get");
//   try {
//     console.log("/api/v1/public/list");
//     const aoCats = readCatsFile();
//     //      const listOfItems = await list();   // just builds the list
//     //      res.json({ listOfItems });    // and sends it
//     res.json({
//       aoCats
//     }); // and sends it
//     // setTimeout(() => { res.json({ listOfItems }); }, 2000);
//     //console.log(listOfItems);
//   } catch (err) {
//     res.json({
//       error: err.message || err.toString()
//     });
//   }
// });

// app.post('/api/v1/public/contacts', async (req, res) => {
//   console.log("get contacts");
//   try {
//     console.log("/api/v1/public/contacts");
//     console.log(req.body);
//     //      const aoCats = readCatsFile();
//     //      const listOfItems = await list();   // just builds the list
//     //      res.json({ listOfItems });    // and sends it
//     //      res.json({ aoCats });    // and sends it
//     // setTimeout(() => { res.json({ listOfItems }); }, 2000);
//     //console.log(listOfItems);
//   } catch (err) {
//     console.log("get contacts error");
//     res.json({
//       error: err.message || err.toString()
//     });
//   }
// });