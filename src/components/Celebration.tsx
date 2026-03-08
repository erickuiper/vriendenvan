import { useEffect, useRef, useState } from 'react'
import styles from './Celebration.module.css'

const BALLOON_COUNT = 8

export function Celebration() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [popped, setPopped] = useState<Set<number>>(new Set())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#7c3aed', '#0891b2']
    const confetti: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      rotation: number
      dr: number
    }> = []

    for (let i = 0; i < 120; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        dr: (Math.random() - 0.5) * 10,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      confetti.forEach((c) => {
        c.x += c.vx
        c.y += c.vy
        c.rotation += c.dr
        if (c.y > canvas.height + 20) c.y = -20
        if (c.x < -20) c.x = canvas.width + 20
        if (c.x > canvas.width + 20) c.x = -20
        ctx.save()
        ctx.translate(c.x, c.y)
        ctx.rotate((c.rotation * Math.PI) / 180)
        ctx.fillStyle = c.color
        ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2)
        ctx.restore()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handlePop = (i: number) => {
    if (popped.has(i)) return
    setPopped((prev) => new Set(prev).add(i))
  }

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.balloons}>
        {[...Array(BALLOON_COUNT)].map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.balloon} ${popped.has(i) ? styles.balloonPopped : ''}`}
            style={{
              '--i': i,
              '--hue': (i * 45 + 200) % 360,
            } as React.CSSProperties}
            onClick={() => handlePop(i)}
            aria-label="Ballon kapot maken"
          />
        ))}
      </div>
    </div>
  )
}
