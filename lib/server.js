/*88888888 file to start and stop the server 88888888*/

//Dependencies
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const config = require('./config');
const https = require('https');

//Creating the server object
var server = {};

//Creating http server
server.httpServer = http.createServer(
  //Callback
  (req, res) => server.unifiedServer(req,res)
);

//Setting httpsOptionsTo-- Required
server.httpsServerOptions = {
  'key' : fs.readFileSync(path.join(__dirname,'./../https/key.pem')),
  'cert': fs.readFileSync(path.join(__dirname,'./../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions,
  //Callback
  (req, res) => server.unifiedServer(req, res)
);

//All server logic in a single unified function
server.unifiedServer = (req, res) => {

  //Parse the url in req
  let parsedUrl = url.parse(req.url,true);

  console.log(parsedUrl);
};

//server Initialization
server.init = () => {
  server.httpServer.listen(config.httpPort,
    //callback
    () =>  console.log('https server starts listening in the port '+config.httpPort)
  );

  server.httpsServer.listen(config.httpsPort,
    //callback
    () => console.log('https server starts listening in the port '+config.httpPort)
  );
};
