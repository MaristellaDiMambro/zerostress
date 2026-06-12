import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { useToast } from '../../lib/ToastContext'
import { getPomodoriCount, getStreak, aggiornaStreak, getMaterie, calcolaBadge } from '../../lib/data'
import styles from './Progressi.module.css'

const quotes = [
  { text: '"La maturità non misura il tuo valore, ma il percorso che hai costruito."', author: '— Zero Stress Team' },
  { text: '"Non devi essere perfetto/a. Devi solo essere presente."', author: '— Filosofia ADHD-friendly' },
  { text: '"Un pomodoro alla volta, una pagina alla volta. Ce la fai."', author: '— Francesco Cirillo' },
  { text: '"Il cervello che fatica oggi è il muscolo che vince domani."', author: '— Neuroscienze dello studio' },
  { text: '"Ogni piccolo passo conta. Anche solo aprire il libro conta."', author: '— Zero Stress Team' },
  { text: '"L\'ansia è l\'adrenalina del successo. Domala, non combatterla."', author: '— Psicologia positiva' },
  { text: '"Sei più forte di quanto pensi. Un passo alla volta, ce la farai!"', author: '— Il tuo prof preferito' },
  { text: '"Gli errori sono i migliori insegnanti. Ogni sbaglio ti avvicina alla risposta giusta."', author: '— Einstein (più o meno)' },
]

export default function Progressi() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [pomodoriTotali, setPomodoriTotali] = useState(0)
  const [streakGiorni, setStreakGiorni] = useState(0)
  const [materie, setMaterie] = useState([])
  const [quoteIdx, setQuoteIdx] = useState(0)

  useEffect(() => {
    async function load() {
      const [pCount, s, mat] = await Promise.all([
        getPomodoriCount(user.id),
        getStreak(user.id),
        getMaterie(user.id),
      ])
      setPomodoriTotali(pCount)
      setStreakGiorni(s.giorni || 0)
      setMaterie(mat)
      setQuoteIdx(Math.floor(Math.random() * quotes.length))
      setLoading(false)
    }
    load()
  }, [user.id])

  async function handleAddStreak() {
    const result = await aggiornaStreak(user.id)
    if (result.gia_fatto) {
      showToast('✅ Hai già contato oggi!', 'var(--yellow)', 'var(--bg)')
    } else {
      setStreakGiorni(result.giorni)
      showToast(`🔥 Streak: ${result.giorni} ${result.giorni === 1 ? 'giorno' : 'giorni'}! Continua così!`)
    }
  }

  function changeQuote() {
    setQuoteIdx(prev => (prev + 1) % quotes.length)
  }

  const materieCompletate = materie.filter(m => m.completata).length
  const badges = calcolaBadge({
    pomodoriTotali, streakGiorni,
    materieCompletate, materieTotali: materie.length,
  })

  if (loading) {
    return <div className="loading-screen" style={{ minHeight: '40vh' }}><div className="spinner" /></div>
  }

  return (
    <div className={styles.wrap}>
      <div className="section-tag" style={{ background: 'rgba(255,217,61,0.12)', color: 'var(--yellow)' }}>⭐ Risultati</div>
      <h1 className={styles.title}>I miei <span style={{ color: 'var(--yellow)' }}>Progressi</span></h1>
      <p className="text-dim mb-16" style={{ fontWeight: 600 }}>
        Ogni piccolo passo conta. Celebra ciò che hai fatto finora.
      </p>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard} style={{ borderColor: 'rgba(255,107,53,0.2)' }}>
          <div className={styles.statValue} style={{ color: 'var(--orange)' }}>{pomodoriTotali}</div>
          <div className={styles.statLabel}>🍅 Pomodori totali</div>
        </div>
        <div className={styles.statCard} style={{ borderColor: 'rgba(67,97,238,0.2)' }}>
          <div className={styles.statValue} style={{ color: 'var(--blue)' }}>{pomodoriTotali * 25}</div>
          <div className={styles.statLabel}>⏱ Minuti di studio</div>
        </div>
        <div className={styles.statCard} style={{ borderColor: 'rgba(6,214,160,0.2)' }}>
          <div className={styles.statValue} style={{ color: 'var(--green)' }}>{materieCompletate}</div>
          <div className={styles.statLabel}>✅ Attività fatte</div>
        </div>
        <div className={styles.statCard} style={{ borderColor: 'rgba(255,217,61,0.2)' }}>
          <div className={styles.statValue} style={{ color: 'var(--yellow)' }}>{streakGiorni}</div>
          <div className={styles.statLabel}>🔥 Giorni streak</div>
        </div>
      </div>

      <div className={styles.section}>
        {/* ── Materie progress ── */}
        <div className="card">
          <h3 className={styles.cardTitle}>📚 Preparazione materie</h3>
          {materie.length === 0 ? (
            <p className="text-dim" style={{ fontWeight: 600, fontSize: '0.88rem' }}>
              Aggiungi materie nella sezione Studio.
            </p>
          ) : (
            <>
              {materie.slice(0, 6).map(m => (
                <div key={m.id} className={styles.pbItem}>
                  <div className={styles.pbTop}>
                    <span>{m.nome}</span>
                    <span style={{ color: m.colore }}>{m.completata ? '100%' : '0%'}</span>
                  </div>
                  <div className="pb-track">
                    <div className="pb-fill" style={{ width: m.completata ? '100%' : '0%', background: m.colore }} />
                  </div>
                </div>
              ))}
              <p className="text-dim mt-12" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                Spunta le attività nella sezione Studio per aggiornare i progressi.
              </p>
            </>
          )}
        </div>

        {/* ── Streak + Badge ── */}
        <div className="card">
          <h3 className={styles.cardTitle}>🏆 Badge conquistati</h3>
          <div className={styles.streakDisplay}>
            <div className={styles.streakFire}>🔥</div>
            <div>
              <div className={styles.streakNum}>{streakGiorni}</div>
              <div className={styles.streakLabel}>giorni di fila!</div>
            </div>
            <button className="btn btn-orange btn-sm" style={{ marginLeft: 'auto' }} onClick={handleAddStreak}>
              + Oggi ho studiato!
            </button>
          </div>
          <div className={styles.badgesGrid}>
            {badges.map((b, i) => (
              <div key={i} className={`${styles.badgeItem} ${b.earned ? styles.earned : styles.locked}`} title={b.desc}>
                <div className={styles.badgeIcon}>{b.icon}</div>
                <div className={styles.badgeName}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quote ── */}
      <div className={styles.quoteBox}>
        <div className={styles.quoteMark}>"</div>
        <div className={styles.quoteText}>{quotes[quoteIdx].text}</div>
        <div className={styles.quoteAuthor}>{quotes[quoteIdx].author}</div>
        <button className="btn btn-outline btn-sm mt-16" onClick={changeQuote}>🔀 Nuova citazione</button>
      </div>
    </div>
  )
}
