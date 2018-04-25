(function() {
  'use strict';

  


  // authe gate
  request('/auth/token')
  .then(function(response){
    return response
  })
  .then(response=>{
    console.log(`user ${response.data.id} is logged in`)
    return request(`/messages/10000`)
  })
  .then(messages => console.log(messages.data.data.rows))
  .catch(function(error){
    console.log('hiiii');
  })


})();
