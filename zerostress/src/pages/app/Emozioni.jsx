import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { useToast } from '../../lib/ToastContext'
import { salvaEmozione, getDiario } from '../../lib/data'
import styles from './Emozioni.module.css'

const emotionData = {
  ansioso: {
    title: '😰 Sei ansioso/a — ecco cosa fare ORA',
    color: 'var(--orange)',
    tips: [
      { icon: '🫁', text: 'Fai la respirazione 4-7-8: inspira 4 sec, trattieni 7, espira 8' },
      { icon: '🌍', text: 'Usa il grounding 5-4-3-2-1 nella sezione Anti-Ansia' },
      { icon: '📦', text: 'Scrivi la tua preoccupazione nella Box (la "parcheggi" mentalmente)' },
      { icon: '💬', text: 'Parla con un amico o il tuo prof di sostegno' },
      { icon: '🎵', text: 'Metti le cuffie: musica strumentale o lo-fi' },
      { icon: '⚙️', text: 'Concentrati su COSA sai, non su cosa temi. Lista 3 punti forti!' },
    ],
  },
  confuso: {
    title: '😵‍💫 Sei confuso/a — riorganizziamo le idee',
    color: 'var(--blue)',
    tips: [
      { icon: '📝', text: 'Fai una mappa mentale di ciò che sai già su quell\'argomento' },
      { icon: '❓', text: 'Scrivi le domande specifiche che ti bloccano' },
      { icon: '🔍', text: 'Studia per blocchi: un concetto alla volta, non tutto insieme' },
      { icon: '🤝', text: 'Chiedi aiuto a un compagno o al professore' },
      { icon: '📺', text: 'Cerca un video che spieghi il concetto in modo diverso' },
      { icon: '💤', text: 'Se stai girando in tondo: fermati 10 min, poi riprendi fresco' },
    ],
  },
  stanco: {
    title: '😴 Sei stanco/a — ricarica prima di continuare',
    color: 'var(--purple)',
    tips: [
      { icon: '😴', text: 'Power nap da 20 minuti: mettiti una sveglia e riposa davvero' },
      { icon: '🚶', text: 'Fai una camminata di 10 minuti fuori' },
      { icon: '💧', text: 'Bevi dell\'acqua! La disidratazione aumenta la stanchezza' },
      { icon: '🍎', text: 'Uno spuntino sano: frutta, frutta secca, yogurt' },
      { icon: '🤸', text: 'Fai gli esercizi di stretching nella sezione Relax' },
      { icon: '🎵', text: 'Musica energica per 5 minuti — poi torna al lavoro!' },
    ],
  },
  tranquillo: {
    title: '😊 Sei tranquillo/a — sfrutta questo momento!',
    color: 'var(--green)',
    tips: [
      { icon: '🎯', text: 'Questo è il momento migliore per studiare le materie più difficili' },
      { icon: '🍅', text: 'Avvia subito il Pomodoro e vai in modalità focus profondo' },
      { icon: '📋', text: 'Pianifica le prossime 2 ore con chiarezza nel Piano Studio' },
      { icon: '🌟', text: 'Sei in stato ottimale — inizia con la materia più impegnativa' },
      { icon: '📔', text: 'Scrivi nel diario: cosa ti ha aiutato a stare bene oggi?' },
      { icon: '💪', text: 'Questo è il tuo stato naturale — puoi tornarci sempre!' },
    ],
  },
  demotivato: {
    title: '😔 Sei demotivato/a — ritrova la spinta',
    color: 'var(--red)',
    tips: [
      { icon: '🏆', text: 'Pensa a: perché hai scelto questo percorso? Cosa ti appassiona?' },
      { icon: '✅', text: 'Fai la cosa più piccola possibile: anche solo 10 minuti contano' },
      { icon: '📊', text: 'Guarda i tuoi progressi: hai già fatto molto più di quanto pensi!' },
      { icon: '👥', text: 'Studia con un compagno: la motivazione è contagiosa' },
      { icon: '🎯', text: 'Metti un micro-obiettivo: finisco SOLO questo argomento, poi vedo' },
      { icon: '🌟', text: 'Vai nella sezione Progressi e leggi una citazione' },
    ],
  },
  carico: {
    title: '💪 Sei caricissimo/a — vai a tutto gas!',
    color: 'var(--yellow)',
    tips: [
      { icon: '🚀', text: 'Inizia SUBITO la materia più difficile mentre hai questa energia' },
      { icon: '🍅', text: 'Fai 2-3 pomodori di fila: oggi puoi farcela' },
      { icon: '📚', text: 'Metti giù il telefono e fai una sessione senza interruzioni' },
      { icon: '🎯', text: 'Sfidati: quanto riesci a fare in 90 minuti di focus totale?' },
      { icon: '🔋', text: 'Attenzione: non esagerare! Pausa ogni 25 min per durare' },
      { icon: '🏆', text: 'Questo è il momento per guadagnarti un badge — vai!' },
    ],
  },
}

const emozioniBtns = [
  { id: 'ansioso', emoji: '😰', label: 'Ansioso/a' },
  { id: 'confuso', emoji: '😵‍💫', label: 'Confuso/a' },
  { id: 'stanco', emoji: '😴', label: 'Stanco/a' },
  { id: 'tranquillo', emoji: '😊', label: 'Tranquillo/a' },
  { id: 'demotivato', emoji: '😔', label: 'Demotivato/a' },
  { id: 'carico', emoji: '💪', label: 'Carico/a' },
]

const moodEmojiMap = {
  ansioso: '😰', confuso: '😵‍💫', stanco: '😴',
  tranquillo: '😊', demotivato: '😔', carico: '💪',
}

export default function Emozioni() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [selected, setSelected] = useState(null)
  const [moodText, setMoodText] = useState('')
  const [diario, setDiario] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await getDiario(user.id, 15)
      setDiario(data)
      setLoading(false)
    }
    load()
  }, [user.id])

  function handleSelect(id) {
    setSelected(id)
  }

  async function handleSave() {
    if (!moodText.trim() && !selected) {
      showToast('Scegli un\'emozione o scrivi qualcosa', 'var(--red)', 'white')
      return
    }
    setSaving(true)
    await salvaEmozione(user.id, selected || 'diario', moodText.trim() || null)
    setSaving(false)
    setMoodText('')
    showToast('📔 Salvato nel diario!', 'var(--pink)', 'white')
    const data = await getDiario(user.id, 15)
    setDiario(data)
  }

  function formatData(iso) {
    return new Date(iso).toLocaleDateString('it-IT', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  const data = selected ? emotionData[selected] : null

  return (
    <div className={styles.wrap}>
      <div className="section-tag" style={{ background: 'rgba(255,77,141,0.15)', color: 'var(--pink)' }}>💜 Come ti senti</div>
      <h1 className={styles.title}>Come stai <span style={{ color: 'var(--pink)' }}>oggi?</span></h1>
      <p className="text-dim mb-16" style={{ fontWeight: 600 }}>
        Scegli l'emozione che senti in questo momento. Riceverai strategie pensate per te.
      </p>

      {/* ── Selettore emozioni ── */}
      <div className={styles.grid}>
        {emozioniBtns.map(e => (
          <button
            key={e.id}
            className={`${styles.emotionCard} ${selected === e.id ? styles.selected : ''}`}
            style={{ '--accent': emotionData[e.id].color }}
            onClick={() => handleSelect(e.id)}
          >
            <span className={styles.emoji}>{e.emoji}</span>
            <span className={styles.ename}>{e.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tips dinamici ── */}
      {data && (
        <div className={styles.tipsBox} style={{ '--accent': data.color }}>
          <h3 style={{ color: data.color }}>{data.title}</h3>
          <div className={styles.tipsList}>
            {data.tips.map((t, i) => (
              <div key={i} className={styles.tipItem}>
                <span className={styles.tipIcon}>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Diario ── */}
      <div className={styles.diary}>
        <h3>📔 Diario Emotivo</h3>
        <p className="text-dim mb-16" style={{ fontWeight: 600, fontSize: '0.88rem' }}>
          Scrivi come ti senti — resta solo per te.
        </p>
        <textarea
          className="input"
          placeholder="Oggi mi sento..."
          value={moodText}
          onChange={e => setMoodText(e.target.value)}
          style={{ minHeight: 90, resize: 'vertical', marginBottom: 12 }}
        />
        <button className="btn btn-pink btn-sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Salvataggio...' : '💾 Salva nel diario'}
        </button>

        <div className={styles.entries}>
          {loading ? (
            <p className="text-dim" style={{ fontWeight: 600, padding: 8 }}>Caricamento...</p>
          ) : diario.length === 0 ? (
            <p className="text-dim" style={{ fontWeight: 600, padding: 8 }}>Nessuna voce ancora. Scrivi come ti senti!</p>
          ) : (
            diario.map(d => (
              <div key={d.id} className={styles.entry}>
                <span className={styles.entryEmoji}>{moodEmojiMap[d.emozione] || '📝'}</span>
                <div>
                  <div className={styles.entryDate}>{formatData(d.created_at)}</div>
                  {d.testo && <div>{d.testo}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
