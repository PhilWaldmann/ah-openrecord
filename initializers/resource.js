var path = require('path');
var templates = require('./resource_templates');

global.RECORD_NOT_FOUND = 'record not found';

exports.resource = function(api, next){
  var current_file;
  
  //global Resource method
  global.Resource = function(model, config){

    var actions = {};
    var filename = path.basename(current_file, '.js');
    
    config = config || {};
    
    if(config.prefix){
      filename = config.prefix + ':' + filename;
    }
    
    
    config.actions = config.actions || Object.keys(templates);
    config.action = config.action || filename
    
    
    for(var i = 0; i < config.actions.length; i++){
      var action = config.actions[i];
      if(templates[action]){
        var act = templates[action](model, config);
        
        if(typeof act === 'object'){
          actions[action] = act;
          if(config.requireAuth !== undefined) actions[action].requireAuth = config.requireAuth;
          if(config.requireRole !== undefined) actions[action].requireRole = config.requireRole;
        }
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