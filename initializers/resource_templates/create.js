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
      
      Model.setContext(connection).create(connection.params.data, function(res){
        connection.response.success = res;
        connection.response.error = this.errors;
        connection.response.data = this.toJson();
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