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
      
      if(typeof options.before === 'function'){
        options.before(connection.params, connection);
      }
      
      Model.setContext(connection).create(connection.params.data, function(res){
        var data = this.toJson();
        
        if(typeof options.after === 'function'){
          data = options.after(data, connection);
        }
        
        connection.response.success = res;
        if(!res) connection.response.error = this.errors;
        connection.response.data = data;
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
  return this.mergeConfig(action, options.create);
}