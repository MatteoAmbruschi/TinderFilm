import axios from "axios";
export default async function CheckMatch ({dataMatch}: {dataMatch: any}) {
    console.log(dataMatch)

    axios.put(process.env.NEXT_PUBLIC_BACKEND + '/checkMatch', {dataMatch})
    .then((response) => {
        if(response.status === 200) {
            console.log(response.data)
            return response.data
          } else {
            console.log('Error fetching movie types:', response.status);
          }
        }).catch((error) => {
          console.log(error)
        })
}