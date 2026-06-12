import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { useToast } from '../../lib/ToastContext'
import { getPreoccupazioni, addPreoccupazione, deletePreoccupazione } from '../../lib/data'
import styles from './AntiAnsia.module.css'

const groundingSteps = [
  { num: 5, text: <>Cose che <strong>vedo</strong> adesso</> },
  { num: 4, text: <>Cose che posso <strong>toccare</strong></> },
  { num: 3, text: <>Cose che <strong>sento</strong> (udito)</> },
  { num: 2, text: <>Cose che <strong>odoro</strong></> },
  { num: 1, text: <>Cosa <strong>assaggio</strong></> },
]

export default function AntiAnsia() {
  const { user } = useAuth()
  const { showToast } = useToast()

  // ── Respirazione ──
  const [breathing, setBreathing] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | inhale | hold | exhale
  const [count, setCount] = useState(0)
  const breatheTimeout = useRef(null)
  const breatheRunningRef = useRef(false)

  // ── Grounding ──
  const [doneSteps, setDoneSteps] = useState([])

  // ── Worry box ──
  const [worries, setWorries] = useState([])
  const [worryInput, setWorryInput] = useState('')
  const [loadingWorries, setLoadingWorries] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getPreoccupazioni(user.id)
      setWorries(data)
      setLoadingWorries(false)
    }
    load()
    return () => {
      breatheRunningRef.current = false
      clearTimeout(breatheTimeout.current)
    }
  }, [user.id])

  // ── Respirazione logic ──
  function startBreathe() {
    if (breathing) {
      stopBreathe()
      return
    }
    setBreathing(true)
    breatheRunningRef.current = true
    runCycle()
  }

  function stopBreathe() {
    breatheRunningRef.current = false
    clearTimeout(breatheTimeout.current)
    setBreathing(false)
    setPhase('idle')
    setCount(0)
  }

  function runCycle() {
    countdownPhase('inhale', 4, () => {
      countdownPhase('hold', 7, () => {
        countdownPhase('exhale', 8, () => {
          if (breatheRunningRef.current) {
            breatheTimeout.current = setTimeout(runCycle, 400)
          }
        })
      })
    })
  }

  function countdownPhase(phaseName, seconds, onDone) {
    if (!breatheRunningRef.current) return
    setPhase(phaseName)
    let t = seconds
    setCount(t)
    const tick = () => {
      if (!breatheRunningRef.current) return
      t -= 1
      setCount(t)
      if (t <= 0) {
        onDone()
      } else {
        breatheTimeout.current = setTimeout(tick, 1000)
      }
    }
    breatheTimeout.current = setTimeout(tick, 1000)
  }

  const phaseLabels = {
    idle: 'Pronto?',
    inhale: '🌬 Inspira...',
    hold: '🤐 Trattieni...',
    exhale: '💨 Espira...',
  }
  const phaseColors = {
    idle: 'var(--green)',
    inhale: 'var(--teal)',
    hold: 'var(--yellow)',
    exhale: 'var(--blue)',
  }
  const circleClass = phase === 'inhale' || phase === 'hold'
    ? styles.expanded
    : phase === 'exhale' ? styles.contracted : ''

  // ── Grounding ──
  function toggleStep(num) {
    setDoneSteps(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num])
  }

  // ── Worry box ──
  async function handleAddWorry() {
    const text = worryInput.trim()
    if (!text) return
    setWorryInput('')
    const { error } = await addPreoccupazione(user.id, text)
    if (!error) {
      showToast('📦 Preoccupazione chiusa nella scatola!', 'var(--orange)', 'white')
      const data = await getPreoccupazioni(user.id)
      setWorries(data)
    }
  }

  async function handleRemoveWorry(id) {
    await deletePreoccupazione(id)
    setWorries(worries.filter(w => w.id !== id))
  }

  return (
    <div className={styles.wrap}>
      <div className="section-tag" style={{ background: 'rgba(239,35,60,0.15)', color: 'var(--red)' }}>🆘 Supporto immediato</div>
      <h1 className={styles.title}>Tecniche <span style={{ color: 'var(--orange)' }}>Anti-Ansia</span></h1>
      <p className="text-dim mb-16" style={{ fontWeight: 600 }}>
        Strumenti pratici da usare in qualsiasi momento, anche 5 minuti prima dell'orale.
      </p>

      <div className={styles.grid}>
        {/* ── Respirazione 4-7-8 ── */}
        <div className="card" style={{ borderColor: 'rgba(6,214,160,0.2)' }}>
          <span className={styles.cardIcon}>🫁</span>
          <h3>Respirazione 4-7-8</h3>
          <p className={styles.cardDesc}>Calma il sistema nervoso in pochi cicli. Ideale prima di un'interrogazione o esame.</p>

          <div className={styles.breatheBox}>
            <div
              className={`${styles.breatheCircle} ${circleClass}`}
              style={{ borderColor: phaseColors[phase], color: phaseColors[phase] }}
              onClick={startBreathe}
            >
              {phase === 'idle' ? (
                <span style={{ fontSize: '0.85rem', lineHeight: 1.3 }}>Tocca<br />per<br />iniziare</span>
              ) : (
                <span>{count}<br /><span style={{ fontSize: '0.7rem' }}>sec</span></span>
              )}
            </div>
            <div className={styles.breathePhase} style={{ color: phaseColors[phase] }}>
              {phaseLabels[phase]}
            </div>
            <button
              className={breathing ? 'btn btn-outline btn-sm' : 'btn btn-primary btn-sm'}
              onClick={startBreathe}
            >
              {breathing ? '⏹ Stop' : '▶ Avvia'}
            </button>
          </div>
        </div>

        {/* ── Grounding 5-4-3-2-1 ── */}
        <div className="card" style={{ borderColor: 'rgba(255,77,141,0.2)' }}>
          <span className={styles.cardIcon}>🌍</span>
          <h3>Grounding 5-4-3-2-1</h3>
          <p className={styles.cardDesc}>Torna al presente in 1 minuto. Ottimo se la mente va in loop di preoccupazioni.</p>

          <div className={styles.groundingSteps}>
            {groundingSteps.map(s => (
              <div
                key={s.num}
                className={`${styles.groundingStep} ${doneSteps.includes(s.num) ? styles.done : ''}`}
                onClick={() => toggleStep(s.num)}
              >
                <div className={styles.stepNum}>{s.num}</div>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
          {doneSteps.length === 5 && (
            <p className={styles.groundingDone}>🌟 Ottimo lavoro! Come ti senti ora?</p>
          )}
        </div>

        {/* ── Worry box ── */}
        <div className="card" style={{ borderColor: 'rgba(255,107,53,0.2)' }}>
          <span className={styles.cardIcon}>📦</span>
          <h3>Box delle Preoccupazioni</h3>
          <p className={styles.cardDesc}>Scrivi ciò che ti spaventa, mettilo nella "scatola" mentale e libera la testa per studiare.</p>

          <input
            className="input"
            placeholder="Scrivi una preoccupazione..."
            value={worryInput}
            onChange={e => setWorryInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddWorry()}
            style={{ marginBottom: 10, fontSize: '0.88rem' }}
          />
          <button className="btn btn-orange btn-sm btn-block mb-8" onClick={handleAddWorry}>
            📦 Metti nella scatola
          </button>

          <div className={styles.worryList}>
            {loadingWorries ? (
              <p className="text-dim" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Caricamento...</p>
            ) : worries.length === 0 ? (
              <p className="text-dim" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nessuna preoccupazione nella scatola!</p>
            ) : (
              worries.map(w => (
                <div key={w.id} className={styles.worryItem}>
                  <span style={{ flex: 1 }}>{w.testo}</span>
                  <span className={styles.worryDel} onClick={() => handleRemoveWorry(w.id)}>🗑</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
