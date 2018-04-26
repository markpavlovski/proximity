
function getCurrentLocation(options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

//
// getCurrentLocation()
//   .then((position) => {
//     console.log(position);
//     document.body.innerHTML = `${position.coords.latitude}, ${position.coords.longitude}`
//     // alert(`${position.coords.latitude}, ${position.coords.longitude}`);
//
//   })
//   .catch((err) => {
//     console.error(err.message);
//     // console.error('using IP for location detection');
//     //
//     // axios.get('https://json.geoiplookup.io/api')
//     // .then(res=>{
//     //   document.body.innerHTML = ` ${res.data.latitude}, ${res.data.longitude}`
//     //   return res
//     // })
//     // .then(res=>initializeApp({longitude: res.data.longitude, latitude: res.data.latitude}))
//
//   });
