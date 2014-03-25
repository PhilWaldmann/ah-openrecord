module.exports = function(model, options){
  return {
    name: options.action + ':list',
    
    description: 'Returns a list of records',
    inputs: {
      required: [],
      optional: ['limit', 'offset', 'sort']
    },
    outputExample: {},
    
    
    run: function(api, connection, next){
        
        var Model = api.db.Model(model);
        
        var params = connection.params;
        
        var chain = Model.chain();

        if (params['limit'] || params['offset']){
          var limit = params['limit'] || 100;
          var offset = params['offset'] || 0;
          chain.limit(limit, offset);
        }
        
        if (params['sort']){
          var order = JSON.parse(params['sort']);
          if (!util.isArray(order)){
            order = [order];
          }
          order.forEach(function(ord){
            if (ord.property){
              var desc = ord.direction.toLowerCase() == 'desc';
              chain.order(ord.property, desc);
            }  
          });
          
        }
        
        chain.exec(function(res){
          connection.response.data = res.toJson();
          next(connection, true);
        });
      }
  }  
}