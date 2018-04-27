(function() {
  'use strict';
  //
  // request('/auth/token')
  // .then(function(response){
  //   // user is authenticated
  //
  // })
  // .catch(function(error){
  //   // user is not authenticated
  // })
  //

  const buttonEl = document.querySelector('#register-button')
  const buttonBlock = document.querySelector('#button-block')
  const usernameEl = document.querySelector('#username')
  const passwordEl = document.querySelector('#password')


  // login form
  buttonEl.addEventListener('mousedown', function(event){
    event.preventDefault()

    const username = usernameEl.value
    const password = passwordEl.value

    clear(usernameEl, passwordEl)

    request('/users', 'post', { username , password })
    .then(function(response){
      buttonEl.setAttribute('style','background-color: white; color: #388e3c; box-shadow: none; cursor: auto; font-size: 10px')
      buttonEl.innerHTML = `User ${username} created! Redirecting..`
      setTimeout(()=>window.location = '/index.html', 2000)
    })
    .catch(function(error){
      buttonEl.setAttribute('style','background-color: white; color: #f44336; box-shadow: none; cursor: auto; font-size: 10px')
      console.log(error);
      buttonEl.innerHTML = `${error}`
      setTimeout(()=>{
        buttonEl.removeAttribute('style')
        buttonEl.innerHTML = 'REGISTER'
      }, 2000)
    })
  })

  passwordEl.addEventListener('keydown',(event)=>{
    if (event.key==='Tab') {
      event.preventDefault()
    }


    if (event.key==='Enter') {
      event.preventDefault()

      const username = usernameEl.value
      const password = passwordEl.value

      clear(usernameEl, passwordEl)

      request('/users', 'post', { username , password })
      .then(function(response){

        buttonEl.setAttribute('style','background-color: white; color: #388e3c; box-shadow: none; cursor: auto; font-size: 10px')
        buttonEl.innerHTML = `User <b>${username}</b> created! Redirecting..`
        document.querySelector('#register-new-account').focus()
        setTimeout(()=>window.location = '/index.html', 1000)
      })
      .catch(function(error){
        buttonEl.setAttribute('style','background-color: white; color: #f44336; box-shadow: none; cursor: auto; font-size: 10px')
        console.log(error);
        buttonEl.innerHTML = `${error}`
        setTimeout(()=>{
          document.querySelector('#register-new-account').focus()
          buttonEl.removeAttribute('style')
          buttonEl.innerHTML = 'REGISTER'
        }, 2000)
      })
    }
  })


})();
