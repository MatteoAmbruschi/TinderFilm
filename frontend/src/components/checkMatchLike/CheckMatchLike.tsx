import axios from "axios";
export default function CheckMatchLike ({dataMatch}: {dataMatch: any}) {
    console.log(dataMatch)

    axios.put(process.env.NEXT_PUBLIC_BACKEND + '/checkMatchLike', {dataMatch})
    .then((response) => {
        if(response.status === 200) {
            console.log(response.data)
           /*  return response.data */
          } else {
            console.log('Error fetching movie types:', response.status);
          }
        }).catch((error) => {
          console.log("Error sending request:", error)
        })
}