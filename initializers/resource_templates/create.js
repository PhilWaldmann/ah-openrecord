module.exports = function(model, options){
  var action = {
    name: options.action + ':create',
    
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
      });
    }
  };

  return this.mergeConfig(action, options.create);
}