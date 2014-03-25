exports.action = {
  name: 'resource',
  description: 'Returns the resource definition',
  inputs: {
    required: ['name'],
    optional: []
  },
  outputExample: {
    fields:[]
  },
  run: function(api, connection, next){
    connection.response.resource = connection.params.name;
    next(connection, true);
  }
};