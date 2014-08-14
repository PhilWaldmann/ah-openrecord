var path = require('path');
var templates = require('./resource_templates');

//global Resource method
global.Resource = function(model, config){
  var current_file = getCallerFile();
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




//from http://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function
function getCallerFile() {
  try {
    var err = new Error();
    var callerfile;
    var currentfile;
    
    Error.prepareStackTrace = function (err, stack) { return stack; };
    
    currentfile = err.stack.shift().getFileName();
    
    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();
      
      if(currentfile !== callerfile) return callerfile;
    }
  } catch (err) {}
  return undefined;
}