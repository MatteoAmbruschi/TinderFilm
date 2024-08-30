import React, { useState, useMemo, useRef, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import styles from './tinderFilmCard.module.css'
import axios from 'axios'
import { DialogBasicOne } from '../myUi/dialogCard/DialogCard'
import seedrandom from 'seedrandom';
import CheckMatchLike from '../checkMatchLike/CheckMatchLike'
import removeMatch from '../removeMatch/removeMatch'

function Advanced ({className, idApp, idUser}) {

  const saved = () => {
    const savedState = localStorage.getItem(`advanced-state-${idApp}`);
    if (savedState) {
      return JSON.parse(savedState);
    } else {
      return { savedIteration: 1, savedCurrentIndex: -1 };
    }
  };

  const savedState = saved();
  const [currentIndex, setCurrentIndex] = useState(savedState.savedCurrentIndex)
  const [lastDirection, setLastDirection] = useState(null)
  
  const currentIndexRef = useRef(currentIndex)

  const [movies, setMovies] = useState([])
  const [iteration, setIteration] = useState(savedState.savedIteration )
  const [page, setPage] = useState(randomPage(savedState.savedIteration))
  const [info, setInfo] = useState('')
  const [isMatch, setIsMatch] = useState({})

  useEffect(() => {
    if (movies.length > 0) {
      localStorage.setItem(`advanced-state-${idApp}`, JSON.stringify({
        savedIteration: iteration,
        savedCurrentIndex: currentIndex,
      }));
    }
  }, [movies, iteration, currentIndex, page, idApp]);

  
  function randomPage(iteration) {
    if (!idApp) {
      console.error('idApp is undefined or null');
      return Math.floor(Math.random() * 10) + 1;
    }

    const seed = idApp + '-' + iteration;
    const rng = seedrandom(seed);
    return Math.floor(rng() * 500) + 1; 
  }

  useEffect(() => {
    if (idApp) {
      setPage(randomPage(iteration));
    }
  }, [idApp, iteration]);
  
  useEffect(() => {
    axios.post(process.env.NEXT_PUBLIC_BACKEND + `/getMovieGenre/${idApp}`, {page})
    .then((response) => {
      if(response.status === 200) {
        if (response.data.status_code === 22) {
          setIteration(prev => prev + 1);
        } else {
          if (savedState.savedCurrentIndex === -1) {
            return setMovies(response.data.results);
          } else { 
            const movieSliced = response.data.results.splice(0, savedState.savedCurrentIndex + 1)
            return setMovies(movieSliced);
          }
        }
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


  const callTheLike = async(movie) => {
    const data ={movie: movie, idUser: idUser}
    console.log(data)
    axios.post(process.env.NEXT_PUBLIC_BACKEND + `/selectedMovie`, {data})
    .then((response) => {
      if(response.status === 200) {
        const dataMatch = {movie, idApp}
        CheckMatchLike({dataMatch, setIsMatch})
      } else {
        console.log('Error fetching movie types:', response.status);
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  const undoSwipe = async() => {
    const idMovie = movies[currentIndex + 1]?.id

    const data ={idUser: idUser, idMovie: idMovie}
    axios.put(process.env.NEXT_PUBLIC_BACKEND + `/undoSwipe`, {data})
    .then((response) => {
      if(response.status === 200) {
        console.log('undoSwipe Partito 200')
          removeMatch({idApp, idMovie})
      } else {
        console.log('Error fetching movie types:', response.status);
      }
    }).catch((error) => {
      console.log(error)
    })
  }

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

  const swiped = (direction, movie, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)

    if(index === 0) {
      setIteration(prev => prev + 1)
    }

    if(direction === 'right'){
      callTheLike(movie)
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
    undoSwipe()

    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }


  return (
    <div className={`${styles.container} ${className}`}>
      <h1 className={styles.h1}>{info.type ? info.type : 'Loading...'}</h1>
      <div className={styles.cardContainer}>
        {movies?.map((movie, index) => (
            <TinderCard
              ref={childRefs[index]}
              className={styles.swipe}
              key={movie.title}
              onSwipe={(dir) => swiped(dir, movie, index)}
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
