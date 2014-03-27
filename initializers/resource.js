var path = require('path');
var templates = require('./resource_templates');

exports.resource = function(api, next){
  var current_file;
  
  //global Resource method
  global.Resource = function(model, config){
    var actions = {};
    
    config = config || {};
    config.actions = config.actions || Object.keys(templates);
    config.action = config.action || path.basename(current_file, '.js');
                
    for(var i = 0; i < config.actions.length; i++){
      var action = config.actions[i];
      if(templates[action]){
        actions[action] = templates[action](model, config);
        
        if(config.requireAuth !== undefined) action[action].requireAuth = config.requireAuth;
        if(config.requireRole !== undefined) action[action].requireRole = config.requireRole;
      }
    }
    
    
    if(config.custom){
      if(!(config.custom instanceof Array)) config.custom = [config.custom];
      for(var i = 0; i < config.custom.length; i++){
        var action = config.custom[i];
        if(action.name){
          actions[action.name] = action;
        }
      }
    }
    
    
    return actions;
  };
  
  
  
  
  if(api.config.general.paths.resource){
    
    api.config.general.paths.resource.forEach(function(p){
      api.utils.recusiveDirecotryGlob(p).forEach(function(f){
        current_file = f;
        api.actions.loadFile(f);
      });
    });

    api.params.buildPostVariables();
    api.documentation.build();
    
  }
  
  next();
}