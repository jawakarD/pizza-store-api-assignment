/*
 * index file for the start up
 *
 */

//Dependencies
const workers = require('./lib/workers');
const server = require('./lib/server');

//Creating the app
var app = {};

app.init = () => {
  //Initializing server
  server.init()

  //Initializing workers
  workers.init();
}


//Excicuting the whole Init
app.init();

//Exporting the app
module.exports = app;
