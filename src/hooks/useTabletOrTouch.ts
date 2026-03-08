import { useState, useEffect } from 'react'

const TOUCH_MEDIA = '(pointer: coarse), (hover: none)'
const TABLET_MIN_WIDTH = 600

/**
 * Detects tablet or touch device with enough screen size for tablet-style UX.
 * When true, we apply larger touch targets, bigger cards, and more spacing.
 */
export function useTabletOrTouch(): boolean {
  const [isTabletOrTouch, setIsTabletOrTouch] = useState(false)

  useEffect(() => {
    const touchQuery = window.matchMedia(TOUCH_MEDIA)
    const widthQuery = window.matchMedia(`(min-width: ${TABLET_MIN_WIDTH}px)`)

    const update = () => {
      const touch = touchQuery.matches
      const wideEnough = widthQuery.matches
      setIsTabletOrTouch(touch && wideEnough)
    }

    update()
    touchQuery.addEventListener('change', update)
    widthQuery.addEventListener('change', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      touchQuery.removeEventListener('change', update)
      widthQuery.removeEventListener('change', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return isTabletOrTouch
}
