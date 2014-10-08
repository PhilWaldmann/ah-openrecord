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




//from http://stackoverflow.com/questions/13227489/how-can-one-get-the-file-path-of-the-caller-function-in-node-js
function getCallerFile() {
  var stack = getStack()

  // Remove superfluous function calls on stack
  stack.shift() // getCaller --> getStack
  stack.shift() // omfg --> getCaller

  // Return caller's caller
  return stack[1].receiver.filename
}


function getStack() {
  // Save original Error.prepareStackTrace
  var origPrepareStackTrace = Error.prepareStackTrace

  // Override with function that just returns `stack`
  Error.prepareStackTrace = function (_, stack) {
    return stack
  }

  // Create a new `Error`, which automatically gets `stack`
  var err = new Error()

  // Evaluate `err.stack`, which calls our new `Error.prepareStackTrace`
  var stack = err.stack

  // Restore original `Error.prepareStackTrace`
  Error.prepareStackTrace = origPrepareStackTrace

  // Remove superfluous function call on stack
  stack.shift() // getStack --> Error

  return stack
}