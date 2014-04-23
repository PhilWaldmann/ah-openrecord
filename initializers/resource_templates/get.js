module.exports = function(model, options){
  var action = {
    name: options.action + ':get',
    route: {get: options.action.replace(':', '/') + '/:id'},
    
    description: 'Returns a record',
    inputs: {
      required: ['id'],
      optional: []
    },
    outputExample: {},
    
    
    run: function(api, connection, next){
      var Model = api.db.Model(model);
      var chain = Model.setContext(connection);
      
      if(options.scope){
        if(!(options.scope instanceof Array)) options.scope = [options.scope];
        for(var i = 0; i < options.scope.length; i++){
          var scope = options.scope[i];
          if(typeof chain[scope] === 'function'){
            chain[scope](connection.params);
          }
        }
      }
      
      chain.find(connection.params.id).exec(function(res){
        connection.response.success = !!res;
        connection.response.data = res ? res.toJson() : null;
        next(connection, true);
      }).catch(function(err){
        api.logger.error(err);
        connection.error = api.config.general.serverErrorMessage;
        connection.response.success = false;
        connection.response.data = {};
        next(connection, true);
      });
    }
  };
  
  action = this.mergeConfig(action, options.defaults)
  return this.mergeConfig(action, options.get);
}