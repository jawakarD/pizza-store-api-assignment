//  Helpers to various function of the api



//Dependencies
const crypto = require('crypto');
const config = require('./config');


var helpers = {};

helpers.parseJsonToObject = (str) => {
  try{
    var obj = JSON.parse(str);
    return obj;
  }catch(e){
    return {};
  }
};

helpers.hash = (str) => {
  if(typeof(str)=='string' && str.length > 0 ){
    return crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
  }else {
    return false;
  }
};










module.exports = helpers;
