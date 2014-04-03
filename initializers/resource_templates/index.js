module.exports = {
  list: require('./list'),
  get: require('./get'),
  create: require('./create'),
  update: require('./update'),
  destroy: require('./destroy'),
  
  
  mergeConfig: function(action, merge){
    if(!merge) return action;
    
    for(var i in merge){
      if(merge.hasOwnProperty(i)){
        if(action[i]){
          if(typeof action[i] === 'string'){
            action[i] = merge[i]; //just replace the string
          }
        
          if(typeof action[i] === 'object'){
            if(action[i] instanceof Array){
              action[i] = action[i].concat(merge[i]);
            }else{
              this.mergeConfig(action[i], merge[i]); //object -> recursion
            }
          }
        }else{ //if not existing
          action[i] = merge[i];
        }
      }
    }

    return action;
  }
};