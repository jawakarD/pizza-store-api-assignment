//  Helpers to various function of the api


var helpers = {};

helpers.parseJsonToObject = (str) => {
  try{
    var obj = JSON.parse(str);
    return obj;
  }catch(e){
    return {};
  }
};

module.exports = helpers;
