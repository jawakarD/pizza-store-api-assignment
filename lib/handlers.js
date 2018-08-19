// to handle sone fuction for the server


var handlers = {};

handlers.ping = (data, callback) => callback(200) ;

handlers.notFound = (data,callback)=> callback(404) ;

module.exports = handlers;
