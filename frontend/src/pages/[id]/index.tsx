import TinderFilmCard from '@/components/tinderFilmCard/TinderFilmCard'
import Link from 'next/link'
import styles from './movie.module.css'
import ButtonLobby from '@/components/buttonLobby/ButtonLobby'

function MovieId({className, idApp}: {className: string, idApp: any}) {

    return(
        <>
        {
        idApp ? 
            <div>
                <TinderFilmCard idApp={idApp} className={className}></TinderFilmCard>
            </div>
        :
            <ButtonLobby></ButtonLobby>
        }
        </>
    )
}

export default MovieId