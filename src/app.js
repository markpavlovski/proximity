let currentLocationPromise = getCurrentLocation();
let fallbackLocation, currentLocation;

(function() {
  'use strict';

  // get location data
  currentLocationPromise.then(res => currentLocation = `${res.coords.latitude}, ${res.coords.longitude}`)
  axios.get('https://json.geoiplookup.io/api').then(res=> {
    fallbackLocation = `${res.data.latitude}, ${res.data.longitude}`
    return fallbackLocation
  })
  .then(location => {
    updateCoordinateFeedback()
    getMessages(distanceEl.value, messageContainer, location)
  })

  const distanceEl = document.querySelector('#distance-range')
  const toggleEl = document.querySelector('#friendsOnlyCheckbox')
  const formEl = document.querySelector('form')
  const messageInputEl = document.querySelector('#message-input')
  const messageContainer = document.querySelector('main')

  const socket = io.connect('https://warm-temple-56216.herokuapp.com', {reconnect: true});

  console.log(distanceEl.value);
  console.log(toggleEl.checked);
  console.log(messageContainer);
  console.log(messageInputEl);



  //
  // const location = currentLocation ? currentLocation : fallbackLocation
  // getMessages(distanceEl.value, messageContainer, location)


  distanceEl.addEventListener('mouseup',event=>{
    const location = currentLocation ? currentLocation : fallbackLocation
    updateCoordinateFeedback()
    getMessages(distanceEl.value, messageContainer, location, toggleEl.checked)
  })
  toggleEl.addEventListener('change',event=>{
    const location = currentLocation ? currentLocation : fallbackLocation
    updateCoordinateFeedback()
    getMessages(distanceEl.value, messageContainer, location, toggleEl.checked)
  })
  formEl.addEventListener('submit',event=>{
    const location = currentLocation ? currentLocation : fallbackLocation
    updateCoordinateFeedback()
    event.preventDefault()
    sendMessage(messageInputEl.value, location)
    socket.emit('chat message',`${messageInputEl.value}`)
    messageInputEl.value=''
  })
  document.addEventListener('mousedown',event=>{
    if(event.target.classList.contains('follow-link')){
      const id = event.target.getAttribute('userid')
      console.log(id);
      console.log(event.target.innerText);
      if (event.target.innerText == 'follow') addFriend(id)
      if (event.target.innerText == 'unfollow') removeFriend(id)
    }
  })


  // var socket = io.connect('http://localhost:3000', {reconnect: true});
  socket.on('chat message response', function(msg){
    const location = currentLocation ? currentLocation : fallbackLocation
    updateCoordinateFeedback()
    getMessages(distanceEl.value, messageContainer, location, toggleEl.checked)
    // document.querySelector('#scroll-target').scrollIntoView()
  })




})();


function getMessages(distance, container, location, onlyFriends = false){
    let activeId
    let msg
    // authe gate
    request('/auth/token')
    .then(function(response){
      return response
    })
    .then(response=>{
      console.log(`user ${response.data.id} is logged in`)
      activeId = response.data.id
      const query = onlyFriends ? '&onlyFriends=true' : ''
      console.log(query);
      return request(`/messages/${distance}?location=${location}${query}`)
    })
    .then(messages => {
      msg = messages.data.data
      return request(`/users_users`)
    })
    .then(friends => {
      console.log(friends.data.data);
      renderMessages(msg, container, activeId,friends.data.data)
      window.scrollTo(0, document.body.scrollHeight)

    })
    .catch(function(error){
      console.log('something went wrong');
      window.location = '/index.html'

    })
}


function renderMessages(messages,container, activeId, friends){
  while (container.firstElementChild) container.removeChild(container.firstElementChild)
  messages.map(message=>{
    const messageEl = createMessageCard(message,activeId,friends)
    container.appendChild(messageEl)
  })
}



function createMessageCard(message,activeId,friends){
  console.log(activeId);
  const friendIds = friends.map(friend=>friend.friends_id)
  console.log('!!!!',friendIds);
  const messageCard = document.createElement('div')
  messageCard.classList.add('row')
  messageCard.classList.add('message-card')
  messageCard.setAttribute('style', 'margin-top:40px;')
  const display = message.users_id == activeId ? 'none' : 'inline-block'
  const linkText = friendIds.find(friendsId => friendsId == message.users_id) ? 'unfollow' : 'follow'
  messageCard.innerHTML =
    `
      <div class="col s10 offset-s1 white z-depth-2 m6 offset-m3 l4 offset-l4" style="padding:0px 40px 0px 40px; border-radius: 4px;">
        <div class="row">
          <div class="input-field col s12">
            <h6 style='display: inline-block'>${message.username}</h6>
            <a class='follow-link' userid='${message.users_id}'
            style='display: inline-block; cursor: pointer; font-size: 10px; line-height: 20px; margin-left: 6px; display: ${display}'>
              ${linkText}
            </a>
            <p>${message.message}</p>
            <p style='font-size: 8px;'>${message.created_at}</p>
            <p style='font-size: 8px;'>${message.location}</p>
          </div>
        </div>
      </div>
    `
  return messageCard
}


function sendMessage(message, location){
  return request(`/messages`, 'post', {message, location})
  .then(response => console.log(response))
}


function updateCoordinateFeedback(){
  const location = currentLocation ? currentLocation : fallbackLocation
  document.querySelector('#coordinate-feedback').innerHTML = location
}

function addFriend(friendsId){
  return request(`/users_users`, 'post', {friendsId})
}
function removeFriend(friendsId){
  return request(`/users_users`, 'delete', {friendsId})
}
