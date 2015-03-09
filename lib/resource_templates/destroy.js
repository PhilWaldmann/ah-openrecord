module.exports = function(model, options){
  var action = {
    name: options.action + ':destroy',
    route: {delete: options.action.replace(':', '/') + '/:id'},
    
    description: 'Destroys a record',
    inputs: {
      required: ['id'],
      optional: []
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
      
      chain.find(connection.params.id).destroy(function(res){
        
        connection.response.success = res;
        if(!res){
          var errors = [];          
          for (var i = 0; i < this.length; i++) {
            if(Object.keys(this[i].errors).length > 0){
              errors.push(this[i].errors);
            }
          }
          
          if(!(connection.params.id instanceof Array)){
            errors = errors[0];
          }
          
          connection.response.error = errors;
        }
        
        if(typeof options.afterDestroy === 'function'){
          return options.afterDestroy(api, connection, next);
        }
        
        next(connection, true);
       
      }).catch(function(err){
        api.log(err.toString() + '\n' + (err.stack ? err.stack : 'NO STACK'), 'error');
        connection.error = 'internal error';;
        connection.response.success = false;
        connection.response.data = {};
        next(connection, true);
      });
    }
  };  
  
  action = this.mergeConfig(action, options.defaults)
  return this.mergeConfig(action, options.destroy);
}