import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { useToast } from '../../lib/ToastContext'
import { getMaterie, addMateria, toggleMateria, deleteMateria } from '../../lib/data'
import styles from './Studio.module.css'

const subjectColors = ['#FF6B35', '#4361EE', '#FF4D8D', '#06D6A0', '#FFD93D', '#7B2FBE', '#17C3B2', '#EF233C']

export default function Studio() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [materie, setMaterie] = useState([])
  const [loading, setLoading] = useState(true)

  const [nome, setNome] = useState('')
  const [priorita, setPriorita] = useState('media')
  const [minuti, setMinuti] = useState('')

  useEffect(() => {
    async function load() {
      const data = await getMaterie(user.id)
      setMaterie(data)
      setLoading(false)
    }
    load()
  }, [user.id])

  async function handleAdd() {
    const nomeTrim = nome.trim()
    if (!nomeTrim) {
      showToast('Inserisci il nome della materia!', 'var(--red)', 'white')
      return
    }
    const colore = subjectColors[materie.length % subjectColors.length]
    const min = parseInt(minuti) || 30
    const { error } = await addMateria(user.id, {
      nome: nomeTrim, priorita, minuti: min, colore, completata: false,
    })
    if (!error) {
      setNome('')
      setMinuti('')
      const data = await getMaterie(user.id)
      setMaterie(data)
      showToast(`📚 ${nomeTrim} aggiunta!`, 'var(--blue)', 'white')
    }
  }

  async function handleToggle(m) {
    await toggleMateria(m.id, !m.completata)
    setMaterie(materie.map(x => x.id === m.id ? { ...x, completata: !x.completata } : x))
    if (!m.completata) showToast(`✅ ${m.nome} completata! Ottimo lavoro!`)
  }

  async function handleDelete(id) {
    await deleteMateria(id)
    setMaterie(materie.filter(x => x.id !== id))
  }

  return (
    <div className={styles.wrap}>
      <div className="section-tag" style={{ background: 'rgba(67,97,238,0.15)', color: 'var(--blue)' }}>📚 Organizzati</div>
      <h1 className={styles.title}>Piano di <span style={{ color: 'var(--blue)' }}>Studio</span></h1>
      <p className="text-dim mb-16" style={{ fontWeight: 600 }}>
        Gestisci le materie, i tempi e le priorità. Tieni traccia di cosa hai già studiato.
      </p>

      {/* ── ADHD banner ── */}
      <div className={styles.adhdBanner}>
        <div className={styles.adhdIcon}>🧠</div>
        <div style={{ flex: 1 }}>
          <h3>💡 Metodo ADHD-friendly</h3>
          <p>Blocchi da 25 min · Obiettivi piccoli · Una cosa alla volta</p>
          <div className={styles.adhdTips}>
            <span className={styles.adhdTip}>⏱ Micro-obiettivi</span>
            <span className={styles.adhdTip}>✅ Checklist visiva</span>
            <span className={styles.adhdTip}>🎯 Una materia alla volta</span>
            <span className={styles.adhdTip}>🏆 Celebra ogni passo</span>
          </div>
        </div>
      </div>

      {/* ── Lista materie ── */}
      <div className="card">
        <h3 className={styles.cardTitle}>📋 Materie da studiare</h3>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 100 }}><div className="spinner" /></div>
        ) : materie.length === 0 ? (
          <p className="text-dim" style={{ fontWeight: 600, padding: '8px 0' }}>Aggiungi le materie da studiare!</p>
        ) : (
          <div className={styles.list}>
            {materie.map(m => (
              <div key={m.id} className={styles.row}>
                <div className={styles.dot} style={{ background: m.colore }} />
                <div className={styles.name}>{m.nome}</div>
                <div className={styles.time}>{m.minuti} min</div>
                <span className={`badge-pill badge-${m.priorita}`}>{m.priorita}</span>
                <div
                  className={`${styles.check} ${m.completata ? styles.checked : ''}`}
                  onClick={() => handleToggle(m)}
                >
                  {m.completata ? '✓' : ''}
                </div>
                <span className={styles.delete} onClick={() => handleDelete(m.id)} title="Elimina">✕</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Form aggiungi ── */}
        <div className={styles.form}>
          <input
            className="input"
            placeholder="Materia..."
            value={nome}
            onChange={e => setNome(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{ flex: '2 1 140px' }}
          />
          <select className="input" value={priorita} onChange={e => setPriorita(e.target.value)} style={{ flex: '1 1 100px', cursor: 'pointer' }}>
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="bassa">🟢 Bassa</option>
          </select>
          <input
            className="input"
            placeholder="Min."
            type="number"
            min="5"
            max="180"
            value={minuti}
            onChange={e => setMinuti(e.target.value)}
            style={{ flex: '0 1 70px' }}
          />
          <button className="btn btn-blue btn-sm" onClick={handleAdd}>+ Aggiungi</button>
        </div>
      </div>
    </div>
  )
}
