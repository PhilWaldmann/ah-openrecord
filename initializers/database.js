var OpenRecord = require('openrecord');

module.exports = {
  loadPriority:  1000,
  startPriority: 1000,
  stopPriority:  1000,
  initialize: function(api, next){
    
    api.config.database.logger = api.logger;  
    api.logger.trace = function(){};  
    api.logger.warn = api.logger.warning;
      
    api.config.database.api = api;
      
    api.db = new OpenRecord(api.config.database); 
    api.db.ready(next);
    
    api.db.on('exception', function(err){
      api.exceptionHandlers.report(err, 'database', api.config.database.type, {}, 'error');
    });
    
    //put a reference of the actionhero api into openrecord
    api.db.api = api;
    
  },
  stop: function(api, next){
    api.db.close(next);
  }
}