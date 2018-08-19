/*88888888------Configurationinformations for the api by environments------8888888*/


//Container
var environments = {};

environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging'
};

environments.producton = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production'
};

var currentEnvironment = typeof(process.NODE_ENV) == 'string' ? process.NODE_ENV.toLowerCase() : '';

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments['staging'] ;

module.exports = environmentToExport;
