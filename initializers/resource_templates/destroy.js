module.exports = function(model, options){
  var action = {
    name: options.action + ':destroy',
    
    description: 'Destroys a record',
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
            chain[scope](params);
          }
        }
      }
      
      chain.find(connection.params.id, function(record){
        record.destroy(function(res){
          connection.response.success = res;
          connection.response.error = this.errors;
          next(connection, true);
        });
      });
    }
  };  

  return this.mergeConfig(action, options.destroy);
}