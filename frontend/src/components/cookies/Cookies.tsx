import axios from "axios"

export const setCookie = (cookies: {}) => {
    axios.post(process.env.NEXT_PUBLIC_BACKEND + '/set-cookie', {cookies}, {
      withCredentials: true,
    })
    .then((response) => {
      if(response.status === 200) {
        console.log('Cookie is set', cookies)
      }
    }).catch((error) => {
      console.log(error, 'error!')
    })
  }


export const readCookie = (setIdApp: any, setIdUser: any, router: any) => {

axios.get(process.env.NEXT_PUBLIC_BACKEND + '/read-cookie', {
  withCredentials: true
})
.then((response) => {
  if(response.status === 200) {
    if(response.data.cookie){
      /* console.log(response.data.cookie) */

      setIdApp(response.data.cookie.lobbyId)
      setIdUser(response.data.cookie.idUser)

      router.push(`/lobby/${response.data.cookie.idUser}`);
    } else {
      console.log('No Cookies')
    }
  }
}).catch((error) => {
  console.log(error, 'error!')
})
}