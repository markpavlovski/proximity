
(function() {
  'use strict';

  const buttonEl = document.querySelector('#register-button')
  const buttonBlock = document.querySelector('#button-block')
  const usernameEl = document.querySelector('#username')
  const passwordEl = document.querySelector('#password')
  const logoText = document.querySelector('#logo-text')



  request('/auth/token')
    .then(function(response) {
      // user is authenticated
    })
    .catch(function(error) {
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
        logoText.innerHTML = 'Incorrect Credentials'
        logoText.setAttribute('style','padding: 0px 0px; margin:60px 0px; color:red !important;')
        setTimeout(()=>{
          logoText.innerHTML = 'proximity'
          logoText.setAttribute('style','padding: 0px 0px; margin:60px 0px;')
        }, 2000)
      })
  })
})();
