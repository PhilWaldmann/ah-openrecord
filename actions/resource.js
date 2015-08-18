exports.action = {
  name: 'resource',
  description: 'Returns the resource definition',
  outputExample: {},
  inputs:{
    name:{required:true}
  },

  run: function(api, data, next){
    data.response.resource = data.connection.params.name;
    next();
  }

};