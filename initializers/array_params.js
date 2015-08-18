var openrecordParamsMiddleware = {
  name: 'ah-openrecord-plugin params Middleware',
  global: true,
  preProcessor: function(data, next){
    var params = data.connection.params;
    
    for(var name in params){
      if(params.hasOwnProperty(name)){
        match = name.match(/(.+?)\[(.*)\]/);
    
        if(match){
          var elements = match[2].split('][');
          elements.unshift(match[1]); //base name
          elements.push(params[name]); //value
    
          applyToObject(params, elements);
      
          delete params[name];          
        }
      }
    }
    
    next();
  }
};


module.exports = {
  initialize: function(api, next){
    api.actions.addMiddleware(openrecordParamsMiddleware);    
    next();
  }
};


function applyToObject(current, elements){
  var is_array = (elements[0].match(/^\d+$/) || elements[0] === '');
  
  if(is_array){
    elements[0] = parseInt(elements[0], 10);
    
    if(isNaN(elements[0])){
      elements[0] = current.length;
    }
  }
  
  
  if(elements.length == 2){
    current[elements[0]] = elements[1];
    return;
  }
  
  var next_is_array = (elements[1].match(/^\d+$/) || elements[1] === ''); 
  
  current[elements[0]] = current[elements[0]] || (next_is_array ? [] : {});
  
  applyToObject(current[elements[0]], elements.slice(1));
  
}
