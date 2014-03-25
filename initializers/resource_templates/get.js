module.exports = function(model, options){
  return {
    name: options.action + ':get',
    
    description: 'Returns a record',
    inputs: {
      required: ['id'],
      optional: []
    },
    outputExample: {},
    
    
    run: function(api, connection, next){
      var Model = api.db.Model(model);
      
      Model.find(connection.params.id).asJson().exec(function(res){
        connection.response.success = !!res;
        connection.response.data = res;
        next(connection, true);
      });
    }
  };
}