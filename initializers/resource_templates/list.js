module.exports = function(model, options){  
  var action = {
    name: options.action + ':list',
    route: {get: options.action.replace(':', '/')},
    
    description: 'Returns a list of records',
    inputs: {
      required: [],
      optional: ['limit', 'offset', 'sort', 'filter', 'query']
    },
    outputExample: {},
    
    
    run: function(api, connection, next){
    
      var Model = api.db.Model(model);    
      var chain = Model.chain().setContext(connection);
          
      if(options.scope){
        if(!(options.scope instanceof Array)) options.scope = [options.scope];
        for(var i = 0; i < options.scope.length; i++){
          var scope = options.scope[i];
          if(typeof chain[scope] === 'function'){
            chain[scope](connection.params);
          }
        }
      }      
      
            
      chain.exec(function(res){
        res = res ? res : [];
        if(res.toJson) res = res.toJson();
        connection.response.data = res;
        next(connection, true);
        
      }).catch(function(err){
        api.logger.error(err);
        connection.error = api.config.general.serverErrorMessage;
        connection.response.data = [];
        next(connection, true);
      });
    }
  };
  
  action = this.mergeConfig(action, options.defaults)  
  return this.mergeConfig(action, options.list);
}