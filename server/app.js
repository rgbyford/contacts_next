import express from 'express';
import next from 'next';
import list from './list';
import {
  readCatsFile
} from './models/database';
const routes = require("./routes/routes.js");
const path = require("path");
const serveStatic = require("serve-static");

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://ssr-csr.builderbook.org';

const app = next({
  dev
});

const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  // server.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });
  server.use(routes);
  //console.log("serve static: ", path.join(__dirname, 'public'));
  server.use(serveStatic(path.join(__dirname, 'public')));
  server.get('*', (req, res) => {
    //console.log ("get something");
    return handle(req, res)
  });

  // starting express server
  console.log ("Server listening on port ", port);
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });
}).catch ((err) => {
  console.log ("app prepare error: ", err);
});

//console.log("app get");
  //server.get('*', function (req, res) {
  //    console.log("contacts sendFile: ", path.join(__dirname, req.params[0]));
  //    res.sendFile(path.join(__dirname, req.params[0]));
  //    console.log("contacts sendFile done: ", path.join(__dirname, req.params[0]));
  //});
  

  // server.get('/api/v1/public/list', async (req, res) => {
  //   console.log("server get");
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

  // server.post('/api/v1/public/contacts', async (req, res) => {
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

