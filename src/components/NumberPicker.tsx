import { MIN_TARGET, MAX_TARGET } from '../logic/pairs'
import styles from './NumberPicker.module.css'

interface NumberPickerProps {
  onChoose: (n: number) => void
}

const numbers = Array.from(
  { length: MAX_TARGET - MIN_TARGET + 1 },
  (_, i) => MIN_TARGET + i
)

export function NumberPicker({ onChoose }: NumberPickerProps) {
  return (
    <section className={styles.section} aria-label="Kies een getal">
      <div className={styles.buttons}>
        {numbers.map((n) => (
          <button
            key={n}
            type="button"
            className={styles.numberButton}
            onClick={() => onChoose(n)}
            aria-label={`Getal ${n} kiezen`}
          >
            {n}
          </button>
        ))}
      </div>
    </section>
  )
}
