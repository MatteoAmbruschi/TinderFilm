import ButtonLobby from "@/components/buttonLobby/ButtonLobby";
import { CarouselCustomIndicator } from "@/components/myUi/Carousel/CarouselMP";
import { useEffect, useState } from "react";
import axios from "axios";

function Match({className, idApp, idUser}: {className: string, idApp: any, idUser: any}) {

  const [match, setMatch] = useState<Array<any>>([])
  useEffect(() => {
    axios.put(process.env.NEXT_PUBLIC_BACKEND + '/checkMatch', {idApp})
    .then((response) => {
        if(response.status === 200) {
            return setMatch(response.data)
          } else {
            console.log('Error fetching movie types:', response.status);
          }
        }).catch((error) => {
          console.log("Error sending request:", error)
      })
  }, [idApp])

  return (
    <>
    {
    idApp ? 
          <div className="flex justify-center">
            <CarouselCustomIndicator className={className} idApp={idApp} idUser={idUser} match={match} />
          </div>
    :
        <ButtonLobby></ButtonLobby>
    }
    </>
  );
}

export default Match;
