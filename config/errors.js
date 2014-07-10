// error messages can be strings of objects

exports.default = {
  errors: function(api){
    return {
      '_toExpand': true,
      
      recordNotFound: function(){
        return 'record not found';
      } 
      
    }
  }
};