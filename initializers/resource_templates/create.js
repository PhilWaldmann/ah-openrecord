module.exports = function(model, options){
  return {
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
        connection.response.errors = this.errors;
        connection.response.data = this.toJson();
        next(connection, true);
      });
    }
  };
}