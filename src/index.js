let currentLocation = getCurrentLocation();

(function() {
  'use strict';



  const buttonEl = document.querySelector('#register-button')
  const buttonBlock = document.querySelector('#button-block')
  const usernameEl = document.querySelector('#username')
  const passwordEl = document.querySelector('#password')



  request('/auth/token')
    .then(function(response) {
      // user is authenticated
      console.log('asdasd');
    })
    .catch(function(error) {
      console.log('hi');
      // user is not authenticated
    })


  passwordEl.addEventListener('keydown', (event) => {
    // console.log(event.key);
    if (event.key === 'Tab') {
      event.preventDefault()
    }

    if (event.key === 'Enter') {
      event.preventDefault()


      const username = usernameEl.value
      const password = passwordEl.value

      clear(usernameEl, passwordEl)


      request('/auth/token', 'post', {
          username,
          password
        })
        .then(function(response) {
          localStorage.setItem('token', response.data.token)
          window.location = '/app.html'
        })
        .catch(function(error) {
          console.log(error);
        })
    }

  })



  // login form
  document.querySelector('#login-button').addEventListener('click', function(event) {
    event.preventDefault()
    console.log('hello');

    const username = usernameEl.value
    const password = passwordEl.value

    request('/auth/token', 'post', {
        username,
        password
      })
      .then(function(response) {
        localStorage.setItem('token', response.data.token)
        window.location = '/app.html'
      })
      .catch(function(error) {
        console.log(error);
      })
  })
})();
