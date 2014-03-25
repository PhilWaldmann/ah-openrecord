var OpenRecord = require('openrecord');

exports.database = function(api, next){

  api.db = new OpenRecord(api.config.database);
  api.db.ready(next);
  
};