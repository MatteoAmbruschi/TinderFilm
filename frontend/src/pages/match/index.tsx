import ButtonLobby from "@/components/buttonLobby/ButtonLobby";
import CheckMatch from "@/components/checkMatch/CheckMatch";
import { CarouselCustomIndicator } from "@/components/myUi/Carousel/CarouselMP";
import { useEffect } from "react";

function Match({className, idApp, idUser}: {className: string, idApp: any, idUser: any}) {

  return (
    <>
    {
    idApp ? 
          <div className="flex justify-center">
            <CarouselCustomIndicator className={className} idApp={idApp} idUser={idUser} />
          </div>
    :
        <ButtonLobby></ButtonLobby>
    }
    </>
  );
}

export default Match;
