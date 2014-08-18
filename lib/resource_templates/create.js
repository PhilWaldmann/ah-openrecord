module.exports = function(model, options){
  var action = {
    name: options.action + ':create',
    route: {post: options.action.replace(':', '/')},
    
    description: 'Creates a new record',
    inputs: {
      required: ['data'],
      optional: ['limit', 'offset', 'sort']
    },
    outputExample: {},
    
    
    run: function(api, connection, next){
      var Model = api.db.Model(model);
      var chain = Model.setContext(connection);
      
      if(typeof options.before === 'function'){
        options.before(connection.params, connection);
      }
      
      if(options.scope){
        if(!(options.scope instanceof Array)) options.scope = [options.scope];
        for(var i = 0; i < options.scope.length; i++){
          var scope = options.scope[i];
          if(typeof chain[scope] === 'function'){
            chain[scope](connection.params);
          }
        }
      }
      
      chain.create(connection.params.data, function(res){
        var data = this.toJson();
        
        if(typeof options.after === 'function'){
          data = options.after(data, connection);
        }
        
        connection.response.success = res;
        if(!res) connection.response.error = this.errors;
        connection.response.data = data;
        next(connection, true);
      }).catch(function(err){
        api.log(err.toString() + '\n' + (err.stack ? err.stack : 'NO STACK'), 'error');
        connection.error = api.config.errors.serverErrorMessage();
        connection.response.success = false;
        connection.response.data = {};
        next(connection, true);
      });
    }
  };
  
  action = this.mergeConfig(action, options.defaults)
  return this.mergeConfig(action, options.create);
}