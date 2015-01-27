exports.routes = function(api, next){

  var orig = api.routes.loadRoutes;
  
  api.routes.loadRoutes = function(routes){
    orig(routes);
    api.routes.addCustomRoutes();
  };
  

  api.routes.addCustomRoutes = function(){
    var actions = api.actions.actions;
  
    for(var name in actions){
      if(actions.hasOwnProperty(name)){
      
        for(var version in actions[name]){
          if(actions[name].hasOwnProperty(version)){
          
            var action = actions[name][version];
          
            if(action.route){
              for(var type in action.route){
                if(action.route.hasOwnProperty(type)){
                  api.routes.routes[type].push({ path: action.route[type], action: action.name });
                }
              }
            }          
          }
        }      
      }
    }
  
    api.params.buildPostVariables();
  }
  
  api.routes.addCustomRoutes();
  
  next();
  
};
