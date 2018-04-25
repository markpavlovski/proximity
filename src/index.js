(function() {
  'use strict';



  const buttonEl = document.querySelector('#register-button')
  const buttonBlock = document.querySelector('#button-block')
  const usernameEl = document.querySelector('#username')
  const passwordEl = document.querySelector('#password')



  request('/auth/token')
  .then(function(response){
    // user is authenticated

  })
  .catch(function(error){
    console.log('hi');
    // user is not authenticated
  })



  // login form
  document.querySelector('#login-button').addEventListener('click', function(event){
    event.preventDefault()
    console.log('hello');

    const username = usernameEl.value
    const password = passwordEl.value

    request('/auth/token', 'post', { username , password })
    .then(function(response){
      localStorage.setItem('token', response.data.token)
      window.location = '/register.html'
    })
    .catch(function(error){
      console.log(error);
    })
  })
})();
