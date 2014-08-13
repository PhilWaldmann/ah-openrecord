var OpenRecord = require('openrecord');

exports.database = function(api, next){

  api.config.database.logger = api.logger;  
  api.logger.trace = function(){};
  
  api.db = new OpenRecord(api.config.database);
  api.db.ready(next);
  
  //put a reference of the actionhero api into openrecord
  api.db.api = api;
};