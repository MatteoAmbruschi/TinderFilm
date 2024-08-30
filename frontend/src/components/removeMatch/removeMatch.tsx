import axios from "axios";
export default function removeMatch ({idApp, idMovie}: {idApp: any, idMovie: any}) {
    const data = {idApp: idApp, idMovie: idMovie}
    console.log(idMovie)
    
    axios.put(process.env.NEXT_PUBLIC_BACKEND + '/removeMatch', {data})
    .then((response) => {
        if(response.status === 200) {
            /* setIsMatch(response.data) */
            return response.data
          } else {
            console.log('Error fetching movie types:', response.status);
          }
        }).catch((error) => {
          console.log("Error sending request:", error)
        })
}