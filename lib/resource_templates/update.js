module.exports = function(model, options){
  var action = {
    name: options.action + ':update',
    route: {put: options.action.replace(':', '/') + '/:id'},
    
    description: 'Updates a record',
    inputs: {
      required: ['id', 'data'],
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
      
      chain.find(connection.params.id, function(record){
        if(record){
          record.set(connection.params.data);
          record.save(function(res){
            var data = this.toJson();
        
            connection.response.success = res;
            if(!res) connection.response.error = this.errors;
            connection.response.data = data;
            
            if(typeof options.afterUpdate === 'function'){
              return options.afterUpdate(api, connection, next);
            }
            
            next(connection, true);
          }).catch(function(err){
            api.log(err.toString() + '\n' + (err.stack ? err.stack : 'NO STACK'), 'error');
            connection.error = 'internal error';;
            connection.response.success = false;
            connection.response.data = {};
            next(connection, true);
          });
        }else{
          connection.response.success = false;
          connection.error = 'record not found'; //api.config.errors.recordNotFound();
          next(connection, true);
        }
      }).catch(function(err){
        api.log(err.toString() + '\n' + (err.stack ? err.stack : 'NO STACK'), 'error');
        connection.error = 'internal error';;
        connection.response.success = false;
        connection.response.data = {};
        next(connection, true);
      });
    }
  } 
  
  action = this.mergeConfig(action, options.defaults)
  return this.mergeConfig(action, options.update);
}