(function() {
  'use strict';

  const distanceEl = document.querySelector('#distance-range')
  const messageContainer = document.querySelector('main')
  console.log(distanceEl.value);
  console.log(messageContainer);


  getMessages(distanceEl.value, messageContainer)


  distanceEl.addEventListener('mouseup',event=>{
    console.log(distanceEl.value);
    getMessages(distanceEl.value, messageContainer)
  })


})();


function getMessages(distance, container, friendsOnly = false){

    // authe gate
    request('/auth/token')
    .then(function(response){
      return response
    })
    .then(response=>{
      console.log(`user ${response.data.id} is logged in`)
      return request(`/messages/${distance}`)
    })
    .then(messages => renderMessages(messages.data.data.rows, container))
    .catch(function(error){
      console.log('hiiii');
    })
}


function renderMessages(messages,container){
  console.log(container);
  console.log(messages);
  while (container.firstElementChild) container.removeChild(container.firstElementChild)
  messages.map(message=>{
    const messageEl = createMessageCard(message)
    container.appendChild(messageEl)
  })
}



function createMessageCard(message){
  const messageCard = document.createElement('div')
  messageCard.classList.add('row')
  messageCard.classList.add('message-card')
  messageCard.setAttribute('style', 'margin-top:40px;')
  messageCard.innerHTML =
    `
      <div class="col s10 offset-s1 white z-depth-2 m6 offset-m3 l4 offset-l4" style="padding:0px 40px 0px 40px; border-radius: 4px;">
        <div class="row">
          <div class="input-field col s12">
            <h6>${message.users_id}</h6>
            <p>${message.message}</p>
          </div>
        </div>
      </div>
    `
  return messageCard
}
