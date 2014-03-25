module.exports = function(model, options){
  return {
    name: options.action + ':update',
    
    description: 'Updates a record',
    inputs: {
      required: ['id', 'data'],
      optional: []
    },
    outputExample: {},
    
    
    run: function(api, connection, next){
      var Model = api.db.Model(model);
      
      Model.find(connection.params.id, function(record){
        
        record.set(connection.params.data);
        record.save(function(res){
          connection.response.success = res;
          connection.response.errors = this.errors;
          connection.response[options.action] = this.toJson();
          next(connection, true);
        });
      });
    }
  }  
}