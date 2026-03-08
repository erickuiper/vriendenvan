import { useMemoryGame } from './hooks/useMemoryGame'
import { useTabletOrTouch } from './hooks/useTabletOrTouch'
import { Header } from './components/Header'
import { NumberPicker } from './components/NumberPicker'
import { MemoryBoard } from './components/MemoryBoard'
import { Celebration } from './components/Celebration'
import styles from './App.module.css'

export function App() {
  const isTabletOrTouch = useTabletOrTouch()
  const { state, showMismatch, chooseNumber, flipCard, goToStart, playAgain } = useMemoryGame()
  const rootAttrs = { 'data-tablet-ui': isTabletOrTouch ? 'true' : 'false' } as const

  if (state.status === 'start') {
    return (
      <div {...rootAttrs} className={styles.screen}>
        <Header
          title="Vriendjes van Getallen"
          subtitle="Kies een getal en zoek de combinaties die dat getal maken!"
        />
        <NumberPicker onChoose={chooseNumber} />
      </div>
    )
  }

  if (state.status === 'won') {
    return (
      <div {...rootAttrs} className={styles.wonWrapper}>
        <Celebration />
        <div className={`${styles.screen} ${styles.wonContent}`}>
          <Header title="Goed gedaan!" />
          <div className={styles.winActions}>
            <button type="button" className={styles.primaryButton} onClick={playAgain}>
              Nog een keer
            </button>
            <button type="button" className={styles.secondaryButton} onClick={goToStart}>
              Kies een ander getal
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div {...rootAttrs} className={`${styles.screen} ${styles.screenGame}`}>
      <div className={styles.gameHeader}>
        <button
          type="button"
          className={styles.backButton}
          onClick={goToStart}
          aria-label="Terug naar getalkeuze"
        >
          ← Terug
        </button>
        <span className={styles.targetBadge} aria-live="polite">
          Getal: {state.targetNumber}
        </span>
      </div>
      <p className={styles.hint}>Zoek de combinaties die samen {state.targetNumber} maken!</p>
      <MemoryBoard
        cards={state.cards}
        showMismatch={showMismatch}
        selectedCardIds={state.flippedCardIds}
        onCardClick={flipCard}
      />
    </div>
  )
}
