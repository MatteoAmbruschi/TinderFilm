import ButtonLobby from "@/components/buttonLobby/ButtonLobby";

function Match({className, idApp}: {className: string, idApp: any}) {
  return (
    <>
    {
    idApp ? 
        <div>
            ciao
        </div>
    :
        <ButtonLobby></ButtonLobby>
    }
    </>
  );
}

export default Match;
