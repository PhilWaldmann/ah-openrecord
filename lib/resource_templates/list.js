module.exports = function(model, options){  
  var action = {
    name: options.action + ':list',
    route: {get: options.action.replace(':', '/')},
    
    description: 'Returns a list of records',
    inputs: {
      required: [],
      optional: ['limit', 'start', 'sort', 'filter', 'query']
    },
    outputExample: {},
    
    
    run: function(api, connection, next){

      var Model = api.db.Model(model);    
      var chain = Model.chain().setContext(connection);
      
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
      
      if(options.totalCount !== false){
        chain.include(':totalCount');
      }
      
      if(options.asJson !== false){
        chain.asJson();
      }
      console.log('LIST!!!>>', Model);
            
      chain.exec(function(res){
        res = res ? res : [];
        console.log('RESULT!');
        if(res.toJson){
          res = res.toJson();
        }
                
        if(typeof options.after === 'function'){
          res = options.after(res, connection);
        }
        
        connection.response.data = res;
        connection.response.totalCount = chain.$totalCount;
        connection.response.success = true;
        next(connection, true);
        
      }).catch(function(err){
        api.log(err.toString() + '\n' + (err.stack ? err.stack : 'NO STACK'), 'error');
        connection.error = api.config.errors.serverErrorMessage();
        connection.response.data = [];
        connection.response.success = false;
        next(connection, true);
      });
    }
  };
  
  action = this.mergeConfig(action, options.defaults)  
  return this.mergeConfig(action, options.list);
}