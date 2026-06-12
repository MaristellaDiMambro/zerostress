import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { getUltimaEmozione, getStreak, getPomodoriOggi } from '../../lib/data'
import styles from './Dashboard.module.css'

// Per ogni emozione: messaggio + sezioni proposte in ordine di priorità
const piani = {
  ansioso: {
    msg: 'Va tutto bene. Iniziamo con qualcosa che ti calmi subito.',
    color: 'var(--orange)',
    sezioni: [
      { to: '/app/ansia', icon: '🆘', title: 'Tecniche Anti-Ansia', desc: 'Respirazione 4-7-8 e grounding — 2 minuti per sentirti meglio' },
      { to: '/app/emozioni', icon: '💜', title: 'Diario Emotivo', desc: 'Scrivi cosa ti preoccupa, aiuta a fare chiarezza' },
      { to: '/app/relax', icon: '🧘', title: 'Angolo Relax', desc: 'Musica e mindfulness per abbassare la tensione' },
    ],
  },
  confuso: {
    msg: 'Ok, rimettiamo ordine insieme. Un passo alla volta.',
    color: 'var(--blue)',
    sezioni: [
      { to: '/app/studio', icon: '📚', title: 'Piano di Studio', desc: 'Scegli UNA materia su cui concentrarti adesso' },
      { to: '/app/pomodoro', icon: '🍅', title: 'Timer Pomodoro', desc: '25 minuti su un solo argomento, senza distrazioni' },
      { to: '/app/ansia', icon: '🆘', title: 'Box Preoccupazioni', desc: 'Scrivi i dubbi specifici che hai in testa' },
    ],
  },
  stanco: {
    msg: 'Capito. Prima ricarichiamo un po\' le energie.',
    color: 'var(--purple)',
    sezioni: [
      { to: '/app/relax', icon: '🧘', title: 'Angolo Relax', desc: 'Stretching rapido o pausa con musica' },
      { to: '/app/pomodoro', icon: '🍅', title: 'Pomodoro breve', desc: 'Quando sei pronto/a, inizia con un blocco leggero' },
      { to: '/app/progressi', icon: '⭐', title: 'I tuoi Progressi', desc: 'Guarda quanto hai già fatto — te lo sei meritato' },
    ],
  },
  tranquillo: {
    msg: 'Ottimo stato! È il momento perfetto per concentrarti.',
    color: 'var(--green)',
    sezioni: [
      { to: '/app/studio', icon: '📚', title: 'Piano di Studio', desc: 'Affronta la materia più impegnativa adesso' },
      { to: '/app/pomodoro', icon: '🍅', title: 'Timer Pomodoro', desc: 'Avvia subito un blocco di focus profondo' },
      { to: '/app/progressi', icon: '⭐', title: 'I tuoi Progressi', desc: 'Tieni traccia di questa sessione' },
    ],
  },
  demotivato: {
    msg: 'Capisco. Ripartiamo da qualcosa di piccolo e dai tuoi risultati.',
    color: 'var(--red)',
    sezioni: [
      { to: '/app/progressi', icon: '⭐', title: 'I tuoi Progressi', desc: 'Guarda quanta strada hai già fatto' },
      { to: '/app/studio', icon: '📚', title: 'Piano di Studio', desc: 'Scegli un\'attività piccola, anche 10 minuti' },
      { to: '/app/emozioni', icon: '💜', title: 'Diario Emotivo', desc: 'Scrivi cosa ti farebbe sentire meglio oggi' },
    ],
  },
  carico: {
    msg: 'Energia al massimo! Sfruttiamola bene.',
    color: 'var(--yellow)',
    sezioni: [
      { to: '/app/pomodoro', icon: '🍅', title: 'Pomodoro', desc: 'Inizia subito — punta a 2-3 cicli di fila' },
      { to: '/app/studio', icon: '📚', title: 'Piano di Studio', desc: 'Affronta la materia più difficile mentre hai questa carica' },
      { to: '/app/progressi', icon: '⭐', title: 'I tuoi Progressi', desc: 'Punta a un nuovo badge oggi!' },
    ],
  },
}

// Tutte le sezioni — mostrate sempre sotto, per accesso libero
const tutteLeSezioni = [
  { to: '/app/emozioni', icon: '💜', title: 'Emozioni', color: 'var(--pink)' },
  { to: '/app/ansia', icon: '🆘', title: 'Anti-Ansia', color: 'var(--orange)' },
  { to: '/app/studio', icon: '📚', title: 'Studio', color: 'var(--blue)' },
  { to: '/app/pomodoro', icon: '🍅', title: 'Pomodoro', color: 'var(--orange)' },
  { to: '/app/relax', icon: '🧘', title: 'Relax', color: 'var(--purple)' },
  { to: '/app/progressi', icon: '⭐', title: 'Progressi', color: 'var(--yellow)' },
]

export default function Dashboard() {
  const { user, profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [emozione, setEmozione] = useState(location.state?.emozione || null)
  const [streak, setStreak] = useState(0)
  const [pomodoriOggi, setPomodoriOggi] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Se non arriva da Onboarding, prova a recuperare l'ultima emozione di oggi
      if (!emozione) {
        const ultima = await getUltimaEmozione(user.id)
        if (ultima) {
          const oggi = new Date().toDateString()
          const dataUltima = new Date(ultima.created_at).toDateString()
          if (oggi === dataUltima) setEmozione(ultima.emozione)
        }
      }
      const s = await getStreak(user.id)
      setStreak(s.giorni || 0)
      const p = await getPomodoriOggi(user.id)
      setPomodoriOggi(p)
      setLoading(false)
    }
    load()
  }, [user.id])

  const piano = emozione ? piani[emozione] : null

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '40vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      {/* ── Header personalizzato ── */}
      <div className={styles.header}>
        <h1>Ciao, {profile?.nome || 'studente'}! 👋</h1>
        {streak > 0 && (
          <div className={styles.streakBadge}>
            🔥 {streak} {streak === 1 ? 'giorno' : 'giorni'} di fila
          </div>
        )}
      </div>

      {/* ── Quick stats ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: 'var(--orange)' }}>{pomodoriOggi}</div>
          <div className={styles.statLabel}>🍅 Pomodori oggi</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: 'var(--yellow)' }}>{streak}</div>
          <div className={styles.statLabel}>🔥 Streak</div>
        </div>
      </div>

      {/* ── Suggerimenti basati sull'umore ── */}
      {piano ? (
        <div className={styles.suggestSection} style={{ '--accent': piano.color }}>
          <div className={styles.suggestHeader}>
            <span className="section-tag" style={{ background: 'rgba(255,255,255,0.08)', color: piano.color }}>
              ✨ Consigliato per te
            </span>
            <p className={styles.suggestMsg}>{piano.msg}</p>
          </div>
          <div className={styles.suggestGrid}>
            {piano.sezioni.map((s, i) => (
              <Link key={i} to={s.to} className={styles.suggestCard} style={{ '--idx': i }}>
                <span className={styles.suggestIcon}>{s.icon}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>
            ))}
          </div>
          <button className={styles.changeMood} onClick={() => navigate('/app/benvenuto')}>
            Il mio umore è cambiato →
          </button>
        </div>
      ) : (
        <div className={styles.noMood}>
          <p>Non hai ancora detto come ti senti oggi.</p>
          <Link to="/app/benvenuto" className="btn btn-primary">Dimmi come stai →</Link>
        </div>
      )}

      {/* ── Tutte le sezioni ── */}
      <div className={styles.allSection}>
        <h2 className={styles.allTitle}>Tutte le sezioni</h2>
        <div className={styles.allGrid}>
          {tutteLeSezioni.map((s, i) => (
            <Link key={i} to={s.to} className={styles.allCard} style={{ '--c': s.color }}>
              <span className={styles.allIcon}>{s.icon}</span>
              <span className={styles.allLabel}>{s.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
