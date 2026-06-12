import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { useToast } from '../../lib/ToastContext'
import { salvaEmozione } from '../../lib/data'
import styles from './Onboarding.module.css'

const emozioni = [
  { id: 'ansioso', emoji: '😰', label: 'Ansioso/a', color: 'var(--orange)' },
  { id: 'confuso', emoji: '😵‍💫', label: 'Confuso/a', color: 'var(--blue)' },
  { id: 'stanco', emoji: '😴', label: 'Stanco/a', color: 'var(--purple)' },
  { id: 'tranquillo', emoji: '😊', label: 'Tranquillo/a', color: 'var(--green)' },
  { id: 'demotivato', emoji: '😔', label: 'Demotivato/a', color: 'var(--red)' },
  { id: 'carico', emoji: '💪', label: 'Carico/a', color: 'var(--yellow)' },
]

export default function Onboarding() {
  const { user, profile } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  async function handleSelect(emozione) {
    setSaving(true)
    await salvaEmozione(user.id, emozione.id)
    setSaving(false)
    showToast(`Grazie! Ti propongo qualcosa per come ti senti 💚`)
    navigate('/app/dashboard', { state: { emozione: emozione.id } })
  }

  function handleSkip() {
    navigate('/app/dashboard')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.greeting}>
        <span className={styles.wave}>👋</span>
        <h1>Ciao, {profile?.nome || 'studente'}!</h1>
        <p>Prima di iniziare, raccontami: come ti senti in questo momento?</p>
      </div>

      <div className={styles.grid}>
        {emozioni.map(e => (
          <button
            key={e.id}
            className={styles.card}
            style={{ '--accent': e.color }}
            onClick={() => handleSelect(e)}
            disabled={saving}
          >
            <span className={styles.emoji}>{e.emoji}</span>
            <span className={styles.label}>{e.label}</span>
          </button>
        ))}
      </div>

      <button className={styles.skip} onClick={handleSkip} disabled={saving}>
        Salta, vai alla home →
      </button>
    </div>
  )
}
