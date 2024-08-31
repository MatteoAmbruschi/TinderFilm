import ButtonLobby from "@/components/buttonLobby/ButtonLobby";
import { CarouselCustomIndicator } from "@/components/myUi/Carousel/CarouselMP";
import { useEffect, useState } from "react";
import axios from "axios";
import { TextEffect } from '@/components/myUi/textEffect';

function Match({className, idApp, idUser}: {className: string, idApp: any, idUser: any}) {

  const [match, setMatch] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)

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
      }).finally(() => setLoading(false))
  }, [idApp])

  if(loading) {
    return(
      <div className="flex justify-center">
        <div className="flex justify-center">
            <TextEffect per='char' preset='fade'>
              Loading...
            </TextEffect>
        </div>
      </div>
    )
  }
  
  return (
    <>
    {
    idApp && match.length > 0 ? 
          <div className="flex justify-center">
            <CarouselCustomIndicator className={className} idApp={idApp} idUser={idUser} match={match} />
          </div>
    : 
    idApp && match.length === undefined ?
        <div className="flex justify-center">
            <TextEffect per='char' preset='fade'>
              No match yet
            </TextEffect>
        </div>
      : 
      <ButtonLobby></ButtonLobby>
    }
    </>
  );
}

export default Match;
