import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { useToast } from '../../lib/ToastContext'
import { registraPomodoro } from '../../lib/data'
import styles from './Pomodoro.module.css'

const WORK = 25 * 60
const SHORT_BREAK = 5 * 60
const LONG_BREAK = 15 * 60
const CIRCUMFERENCE = 565

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function Pomodoro() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [secondsLeft, setSecondsLeft] = useState(WORK)
  const [running, setRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [cycleCount, setCycleCount] = useState(0)
  const [status, setStatus] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  function toggle() {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
    } else {
      setRunning(true)
      intervalRef.current = setInterval(tick, 1000)
    }
  }

  async function tick() {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        handlePhaseEnd()
        return 0
      }
      return prev - 1
    })
  }

  async function handlePhaseEnd() {
    clearInterval(intervalRef.current)
    setRunning(false)

    if (!isBreak) {
      // Fine sessione di studio → registra pomodoro
      const newCycle = cycleCount + 1
      setCycleCount(newCycle)
      await registraPomodoro(user.id)
      showToast('🍅 Pomodoro completato! Bravissimo/a!')

      const isLong = newCycle % 4 === 0
      setIsBreak(true)
      setSecondsLeft(isLong ? LONG_BREAK : SHORT_BREAK)
      setStatus(isLong ? '🎉 Ottimo! Pausa di 15 min meritata!' : '☕ Bravo! 5 min di pausa!')
    } else {
      setIsBreak(false)
      setSecondsLeft(WORK)
      setStatus('💪 Pronto/a per il prossimo round!')
      showToast('⏰ Pausa finita — torna al lavoro!', 'var(--blue)', 'white')
    }
  }

  function reset() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setIsBreak(false)
    setSecondsLeft(WORK)
    setCycleCount(0)
    setStatus('')
  }

  const total = isBreak ? (cycleCount % 4 === 0 && cycleCount > 0 ? LONG_BREAK : SHORT_BREAK) : WORK
  const ratio = secondsLeft / total
  const strokeColor = isBreak ? 'var(--green)' : (cycleCount >= 3 ? 'var(--red)' : 'var(--orange)')

  return (
    <div className={styles.wrap}>
      <div className="section-tag" style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--orange)' }}>🍅 Focus Timer</div>
      <h1 className={styles.title}>Timer <span style={{ color: 'var(--orange)' }}>Pomodoro</span></h1>
      <p className="text-dim mb-16" style={{ fontWeight: 600 }}>
        25 min studio · 5 min pausa · 4 cicli = grande pausa
      </p>

      <div className="card" style={{ maxWidth: 380, margin: '0 auto' }}>
        <div className={styles.container}>
          <div className={styles.ring}>
            <svg className={styles.svg} width="200" height="200" viewBox="0 0 200 200">
              <circle className={styles.track} cx="100" cy="100" r="90" />
              <circle
                className={styles.progress}
                cx="100" cy="100" r="90"
                stroke={strokeColor}
                style={{ strokeDashoffset: CIRCUMFERENCE * ratio }}
              />
            </svg>
            <div className={styles.center}>
              <div className={styles.time}>{formatTime(secondsLeft)}</div>
              <div className={styles.phase}>{isBreak ? (cycleCount % 4 === 0 ? 'PAUSA LUNGA' : 'PAUSA CORTA') : 'FOCUS'}</div>
            </div>
          </div>

          <div className={styles.cycles}>
            <span className={styles.cyclesLabel}>Cicli:</span>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`${styles.dot} ${cycleCount > i ? styles.dotDone : ''}`} />
            ))}
          </div>

          <div className={styles.controls}>
            <button className="btn btn-orange" onClick={toggle}>
              {running ? '⏸ Pausa' : (secondsLeft === total ? (isBreak ? '▶ Inizia Pausa' : '▶ Inizia') : '▶ Riprendi')}
            </button>
            <button className="btn btn-outline btn-sm" onClick={reset}>↺ Reset</button>
          </div>

          {status && <div className={styles.status}>{status}</div>}
        </div>
      </div>

      <div className={styles.tips}>
        <div className={styles.tip}>🎯 Scegli UNA materia dal Piano di Studio prima di iniziare</div>
        <div className={styles.tip}>📵 Metti il telefono in un'altra stanza o in modalità aereo</div>
        <div className={styles.tip}>🚶 Durante la pausa: alzati, muoviti, bevi acqua</div>
      </div>
    </div>
  )
}
