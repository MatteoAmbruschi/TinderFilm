import React, { useState, useMemo, useRef, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import styles from './tinderFilmCard.module.css'
import axios from 'axios'
import { DialogBasicOne } from '../myUi/dialogCard/DialogCard'
function Advanced ({className, idApp}) {

  const [currentIndex, setCurrentIndex] = useState(-1)
  const [lastDirection, setLastDirection] = useState(null)
  
  const currentIndexRef = useRef(currentIndex)

  const [movies, setMovies] = useState([]) 
  const [page, setPage] = useState(() => Math.floor(Math.random() * 500) + 1)
  const [info, setInfo] = useState('')

  function randomPage() {
    console.log('prova')
    return Math.floor(Math.random() * 500) + 1
  }
  
  useEffect(() => {
    axios.post(process.env.NEXT_PUBLIC_BACKEND + `/getMovieGenre/${idApp}`, {page})
    .then((response) => {
      if(response.status === 200) {
        response.data.status_code === 22 ? setPage(randomPage()) : setMovies(response.data.results)
      }  else {
        console.log('Error fetching movie types:', response.status);
      }
    }).catch((error) => {
      console.log(error)
    })
  }, [idApp, page])


  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_BACKEND + `/getInfo/${idApp}`)
    .then((response) => {
      if(response.status === 200) {
        setInfo(response.data)
      } else {
        console.log('Error fetching movie types:', response.status);
      }
    }).catch((error) => {
      console.log(error)
    })
  }, [])


  const childRefs = useMemo(
    () =>
      Array(movies?.length)
        .fill(0)
        .map(() => React.createRef()),
    [movies] 
  )

  useEffect(() => {
    setCurrentIndex(movies?.length - 1)
  }, [movies])

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < movies?.length - 1
  const canSwipe = currentIndex >= 0

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)

    if(index === 0) {
      setPage(randomPage())
    }
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
/*     if (currentIndexRef.current >= idx) {
      childRefs[idx].current.restoreCard()
    } */
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < movies.length) {
      await childRefs[currentIndex].current.swipe(dir)
    }
  }

  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <h1 className={styles.h1}>{info.type ? info.type : 'Loading...'}</h1>
      <div className={styles.cardContainer}>
        {movies?.map((movie, index) => (
          <>

            <TinderCard
              ref={childRefs[index]}
              className={styles.swipe}
              key={movie.title}
              onSwipe={(dir) => swiped(dir, movie.title, index)}
              onCardLeftScreen={() => outOfFrame(movie.title, index)}
              preventSwipe={['up', 'down']}
            >
              <div
                /* style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})` }} */
                className={styles.card}
              >
                <DialogBasicOne movie={movie}></DialogBasicOne>
              </div>
            </TinderCard>
          </>
        ))}
      </div>
          <div className={styles.buttons}>
            <div className={styles.buttonRow}>
              <button style={{ backgroundColor: 'red' }} onClick={() => swipe('left')}>DISLIKE!</button>
              <button style={{ backgroundColor: 'green' }} onClick={() => swipe('right')}>LIKE!</button>
            </div>
            <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()} className={styles.fullWidthButton}>
              Undo swipe!
            </button>
          </div>
      {lastDirection ? (
        <h2 key={lastDirection} className={styles.infoText}>
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className={styles.infoText}>
          Swipe a card!
        </h2>
      )}
    </div>
  )
}

export default Advanced
