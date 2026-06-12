import { useEffect, useRef, useState } from 'react'
import styles from './Relax.module.css'

const mindfulnessSteps = [
  { emoji: '1️⃣', text: 'Siediti comodamente, schiena dritta' },
  { emoji: '2️⃣', text: 'Chiudi gli occhi e respira 3 volte' },
  { emoji: '3️⃣', text: 'Senti il contatto con la sedia' },
  { emoji: '4️⃣', text: 'Osserva i pensieri senza giudicarli' },
  { emoji: '5️⃣', text: 'Apri gli occhi. Come stai ora?' },
]

const stretchSteps = [
  { num: '1️⃣', text: 'Ruota il collo lentamente: 5 cerchi per lato' },
  { num: '2️⃣', text: 'Stringi e apri le mani: 10 volte' },
  { num: '3️⃣', text: 'Alzati e fai 10 salti sul posto' },
  { num: '4️⃣', text: 'Guarda fuori dalla finestra per 30 sec' },
]

const playlists = [
  { name: 'Lo-fi per studiare', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY' },
  { name: 'Focus Deep Work', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { name: 'Peaceful Piano', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
]

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function Relax() {
  const [activeMind, setActiveMind] = useState([])
  const [stretchSeconds, setStretchSeconds] = useState(null)
  const stretchRef = useRef(null)

  useEffect(() => () => clearInterval(stretchRef.current), [])

  function toggleMind(i) {
    setActiveMind(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  function startStretch() {
    clearInterval(stretchRef.current)
    setStretchSeconds(5 * 60)
    stretchRef.current = setInterval(() => {
      setStretchSeconds(prev => {
        if (prev <= 1) {
          clearInterval(stretchRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className={styles.wrap}>
      <div className="section-tag" style={{ background: 'rgba(123,47,190,0.15)', color: 'var(--purple)' }}>🧘 Ricarica</div>
      <h1 className={styles.title}>Angolo <span style={{ color: 'var(--purple)' }}>Relax</span></h1>
      <p className="text-dim mb-16" style={{ fontWeight: 600 }}>
        Prenditi una pausa. Rilassa la mente e il corpo per tornare più fresco di prima.
      </p>

      <div className={styles.grid}>
        {/* ── Musica ── */}
        <div className="card" style={{ borderColor: 'rgba(30,215,96,0.2)' }}>
          <h3 className={styles.cardTitle}>🎵 Musica Relax</h3>
          <p className={styles.cardDesc}>Playlist pensate per concentrarsi o staccare. Scegli il mood giusto.</p>
          <div className={styles.spotifyArea}>
            <p className={styles.spotifyLabel}>🎧 Playlist consigliate</p>
            <div className={styles.playlistList}>
              {playlists.map((p, i) => (
                <a key={i} href={p.url} target="_blank" rel="noreferrer" className={styles.playlistLink}>
                  {p.name} →
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mindfulness ── */}
        <div className="card" style={{ borderColor: 'rgba(123,47,190,0.2)' }}>
          <h3 className={styles.cardTitle}>🌸 Mindfulness 5 min</h3>
          <p className={styles.cardDesc}>Una piccola pratica di consapevolezza per svuotare la testa. Fai un passo alla volta.</p>
          <div className={styles.mindList}>
            {mindfulnessSteps.map((s, i) => (
              <div
                key={i}
                className={`${styles.mindStep} ${activeMind.includes(i) ? styles.mindActive : ''}`}
                onClick={() => toggleMind(i)}
              >
                <span>{s.emoji}</span> <span>{s.text}</span>
              </div>
            ))}
          </div>
          {activeMind.length === 5 && (
            <p className={styles.mindDone}>🌸 Ottima pratica di mindfulness! Come ti senti?</p>
          )}
        </div>

        {/* ── Stretching ── */}
        <div className="card" style={{ borderColor: 'rgba(255,217,61,0.2)' }}>
          <h3 className={styles.cardTitle}>🤸 Stretching rapido</h3>
          <p className={styles.cardDesc}>5 minuti di movimento per sbloccare la schiena dopo ore di studio. Fallo adesso!</p>
          <div className={styles.stretchList}>
            {stretchSteps.map((s, i) => (
              <div key={i} className={styles.tipItem}>
                <span className={styles.tipIcon}>{s.num}</span>
                <div>{s.text}</div>
              </div>
            ))}
          </div>
          <button className={styles.stretchBtn} onClick={startStretch}>⏱ Timer pausa 5 min</button>
          {stretchSeconds !== null && (
            <div className={styles.stretchStatus}>
              {stretchSeconds > 0
                ? `⏱ ${formatTime(stretchSeconds)} rimanenti`
                : '✅ Pausa finita! Torna allo studio!'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
