/*88888888 file to start and stop the server 88888888*/

//Dependencies
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const config = require('./config');
const https = require('https');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./handlers');
const helpers = require('./helpers');


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
  //Callback-----------------
  (req, res) => server.unifiedServer(req, res)
);

//All server logic in a single unified function
server.unifiedServer = (req, res) => {

  //Parse the url in req
  const parsedUrl = url.parse(req.url,true);

  //Getting the path
  const path = parsedUrl.pathname;
  const trimmedPathname = path.replace(/^\/+|\/+$/g,'');

  //get the queryString as object
  let queryStringObject = parsedUrl.query;

  //get methods, header from reqobject;
  const method = req.method.toLowerCase();
  const headers = req.headers;
  const decoder = new StringDecoder('utf-8');

  let buffer = '';
  req.on('data',function(data){
    buffer+=decoder.write(data);
  });

  req.on('end',
  //callback-----------------
    ()=>{
      buffer += decoder.end();

      //choose handler based on the path given by the user
      let choosenHandler = typeof(server.router[trimmedPathname]) !== 'undefined' ? server.router[trimmedPathname] : handlers.notFound;

      var data ={
        'trimmedPath' : trimmedPathname,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : helpers.parseJsonToObject(buffer)
      };

      //route the request data to the handler specified in the router
      choosenHandler(data,
        //callback-----------------
        (statusCode,payload)=>{

          //ststus cde returned from the handler
          statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

          //payload returned from if not, set to empty
          payload = typeof(payload) == 'object' ? payload : {};

          //Convert payload to the string
          var payloadString = JSON.stringify(payload);

          res.setHeader('Content-Type', 'application/json');
          res.writeHead(statusCode);
          res.end(payloadString);

          console.log(data,statusCode);
        }
      );
    });
};

//server Initialization
server.init = () => {
  server.httpServer.listen(config.httpPort,
    //callback
    () =>  console.log('https server starts listening in the port '+config.httpPort)
  );

  server.httpsServer.listen(config.httpsPort,
    //callback
    () => console.log('https server starts listening in the port '+config.httpsPort)
  );
};


server.router={
  'ping' : handlers.ping,
  'users' : handlers.users,
  // 'tokens' : handlers.tokens
};

module.exports = server;
