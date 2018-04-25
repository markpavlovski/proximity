(function() {
  'use strict';

  const distanceEl = document.querySelector('#distance-range')
  console.log(distanceEl.value);


  getMessages(distanceEl.value)


  distanceEl.addEventListener('mouseup',event=>{
    console.log(distanceEl.value);
    getMessages(distanceEl.value)
  })


})();


function getMessages(distance,friendsOnly = false){

    // authe gate
    request('/auth/token')
    .then(function(response){
      return response
    })
    .then(response=>{
      console.log(`user ${response.data.id} is logged in`)
      return request(`/messages/${distance}`)
    })
    .then(messages => console.log(messages.data.data.rows))
    .catch(function(error){
      console.log('hiiii');
    })
}
