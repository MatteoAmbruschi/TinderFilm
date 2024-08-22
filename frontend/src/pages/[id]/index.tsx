import TinderFilmCard from '@/components/tinderFilmCard/TinderFilmCard'
import Link from 'next/link'

function MovieId({className, idApp}: {className: string, idApp: any}) {

    return(
        <>
        {
        idApp ? 
            <div>
                <TinderFilmCard className={className}></TinderFilmCard>
            </div>
        :
        <div>
            <Link href={'/'}>Lobby</Link>
        </div>
        }
        </>
    )
}

export default MovieId