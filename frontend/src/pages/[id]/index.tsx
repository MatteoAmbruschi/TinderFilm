import TinderFilmCard from '@/components/tinderFilmCard/TinderFilmCard'
import Link from 'next/link'
import styles from './movie.module.css'
import ButtonLobby from '@/components/buttonLobby/ButtonLobby'

function MovieId({className, idApp, idUser}: {className: string, idApp: any, idUser:any}) {

    return(
        <>
        {
        idApp ? 
            <div>
                <TinderFilmCard idApp={idApp} idUser={idUser} className={className}></TinderFilmCard>
            </div>
        :
            <ButtonLobby></ButtonLobby>
        }
        </>
    )
}

export default MovieId