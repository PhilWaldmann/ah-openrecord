module.exports = function(model, options){  
  var action = {
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
    
      var chain = Model.chain().setContext(connection);
    
      if(params['limit'] || params['offset']){
        var limit = params['limit'] || 100;
        var offset = params['offset'] || 0;
        chain.limit(limit, offset);
      }
      
      if(params['sort']){
        var order = JSON.parse(params['sort']);
        if (!(order instanceof Array)){
          order = [order];
        }
        order.forEach(function(ord){
          if (ord.property){
            var desc = ord.direction.toLowerCase() == 'desc';
            chain.order(ord.property, desc);
          }  
        });        
      }
      
      
      if(options.scope){
        if(!(options.scope instanceof Array)) options.scope = [options.scope];
        for(var i = 0; i < options.scope.length; i++){
          var scope = options.scope[i];
          if(typeof chain[scope] === 'function'){
            chain[scope](params);
          }
        }
      }      
      
            
      chain.exec(function(res){
        res = res ? res : [];
        if(res.toJson) res = res.toJson();
        
        connection.response.data = res;
        next(connection, true);
      });
    }
  };
    
  return this.mergeConfig(action, options.list);
}