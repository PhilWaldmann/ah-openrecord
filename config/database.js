require('../lib/resource');

/**
 * openrecord configuration.
 */

exports.default = {
  database: function(api){
    return {
      type      : 'postgres',
      host      : '127.0.0.1',
      user      : 'my-user',
      password  : 'my-password',
      database  : 'my-database',
      charset   : 'utf8',
      models    : __dirname + '/../models/*',
      migrations: __dirname + '/../migrations/*'
    }
  }
}
/*
exports.test = {
  database: function(api){
    return {
      type      : 'postgres',
      host      : '127.0.0.1',
      user      : 'my-test-user',
      password  : 'my-test-password',
      database  : 'my-test-database',
      charset   : 'utf8',
      models    : __dirname + '/../models/*',
      migrations: __dirname + '/../migrations/*'
    }
  }
}
*/