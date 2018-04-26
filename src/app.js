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

  const socket = io.connect('http://localhost:3000', {reconnect: true});

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
    console.log(distanceEl.value);
    getMessages(distanceEl.value, messageContainer, location, toggleEl.checked)
  })
  toggleEl.addEventListener('change',event=>{
    const location = currentLocation ? currentLocation : fallbackLocation
    updateCoordinateFeedback()
    console.log(toggleEl.checked);
    getMessages(distanceEl.value, messageContainer, location, toggleEl.checked)
  })
  formEl.addEventListener('submit',event=>{
    const location = currentLocation ? currentLocation : fallbackLocation
    updateCoordinateFeedback()
    event.preventDefault()
    console.log(messageInputEl.value, location)
    sendMessage(messageInputEl.value, location)
    socket.emit('chat message',`${messageInputEl.value}`)
    messageInputEl.value=''
    console.log(event);
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
    console.log('!!!!',onlyFriends);

    // authe gate
    request('/auth/token')
    .then(function(response){
      return response
    })
    .then(response=>{
      console.log(`user ${response.data.id} is logged in`)
      const query = onlyFriends ? '&onlyFriends=true' : ''
      console.log(query);
      return request(`/messages/${distance}?location=${location}${query}`)
    })
    .then(messages => {
      const data = messages.data.data
      renderMessages(data, container)
      window.scrollTo(0, document.body.scrollHeight)

    })
    .catch(function(error){
      console.log('something went wrong');
      window.location = '/index.html'

    })
}


function renderMessages(messages,container){
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
            <h6>${message.username}</h6>
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
