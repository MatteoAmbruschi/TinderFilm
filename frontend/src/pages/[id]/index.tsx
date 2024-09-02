import TinderFilmCard from '@/components/tinderFilmCard/TinderFilmCard'
import Link from 'next/link'
import styles from './movie.module.css'
import ButtonLobby from '@/components/buttonLobby/ButtonLobby'
import { useParams } from 'next/navigation'
import { useRouter } from "next/router"
import { useEffect } from 'react'

function MovieId({className, idApp, idUser}: {className: string, idApp: any, idUser:any}) {
    const path = useParams()
    const router = useRouter()
    /* console.log(path) */

    useEffect(() => {
        if(path && Number(path.id) && !idApp) {
          router.push(`/invite?lobby=${path.id}`);
        }
      }, [path])
    
    return(
        <>
        {
        idApp ? 
            <div className={styles.container}>
                <TinderFilmCard idApp={idApp} idUser={idUser} className={className}></TinderFilmCard>
            </div>
        :
            <ButtonLobby></ButtonLobby>
        }
        </>
    )
}

export default MovieId