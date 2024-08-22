import React, { useState, useMemo, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import styles from './tinderFilmCard.module.css'

const db = [
  {
    name: 'Richard Hendricks',
    url: 'https://mediaproxy.salon.com/width/1200/height/675/https://media2.salon.com/2019/04/suprised-man.jpg'
  },
  {
    name: 'Erlich Bachman',
    url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=pexels-simon-robben-55958-614810.jpg&fm=jpg'
  },
  {
    name: 'Monica Hall',
    url: 'https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW4lMjBmYWNlfGVufDB8fDB8fHww'
  },
  {
    name: 'Jared Dunn',
    url: 'https://humanorigins.si.edu/sites/default/files/styles/slide_show/public/images/landscape/floresiensis_JG_Recon_Head_CC_3qtr_lt_l2.jpg.webp?itok=JpUMDW1v'
  },
  {
    name: 'Dinesh Chugtai',
    url: 'https://i.pinimg.com/736x/6e/48/e8/6e48e8b6d310388664324f9a129143fc.jpg'
  }
]

function Advanced ({className}) {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1)
  const [lastDirection, setLastDirection] = useState()
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < db.length - 1

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <link
        href='https://fonts.googleapis.com/css?family=Damion&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
        rel='stylesheet'
      />
      <h1 className={styles.h1}>React Tinder Card</h1>
      <div className={styles.cardContainer}>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className={styles.swipe}
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
            preventSwipe={['up', 'down']}
          >
            <div
              style={{ backgroundImage: 'url(' + character.url + ')' }}
              className={styles.card}
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
          <div className={styles.buttons}>
            <div className={styles.buttonRow}>
              <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Swipe left!</button>
              <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Swipe right!</button>
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
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  )
}

export default Advanced