var OpenRecord = require('openrecord');

exports.database = function(api, next){

  api.config.database.logger = api.logger;  
  api.logger.trace = function(){};  
  api.logger.warn = api.logger.warning;
    
  api.config.database.api = api;
    
  api.db = new OpenRecord(api.config.database);
  api.db.ready(next);
  
  //put a reference of the actionhero api into openrecord
  api.db.api = api;
};