module.exports = function(model, options){
  return {
    name: options.action + ':destroy',
    
    description: 'Destroys a record',
    inputs: {
      required: ['id'],
      optional: []
    },
    outputExample: {},
    
    
    run: function(api, connection, next){
      var Model = api.db.Model(model);
      
      var record = Model.setContext(connection).find(connection.params.id, function(record){
        record.destroy(function(res){
          connection.response.success = res;
          connection.response.errors = this.errors;
          next(connection, true);
        });
      });
    }
  };
}