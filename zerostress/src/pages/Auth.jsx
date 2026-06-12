import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import styles from './Auth.module.css'

export default function Auth({ mode }) {
  const isRegister = mode === 'register'
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!email || !password || (isRegister && !nome)) {
      setError('Compila tutti i campi.')
      return
    }
    if (password.length < 6) {
      setError('La password deve avere almeno 6 caratteri.')
      return
    }

    setLoading(true)
    if (isRegister) {
      const { error } = await signUp(email, password, nome)
      setLoading(false)
      if (error) {
        setError(traduciErrore(error.message))
        return
      }
      setInfo('Account creato! Controlla la tua email per confermare, poi accedi.')
    } else {
      const { error } = await signIn(email, password)
      setLoading(false)
      if (error) {
        setError(traduciErrore(error.message))
        return
      }
      navigate('/app')
    }
  }

  function traduciErrore(msg) {
    if (msg.includes('Invalid login credentials')) return 'Email o password non corretti.'
    if (msg.includes('already registered')) return 'Esiste già un account con questa email.'
    if (msg.includes('Email not confirmed')) return 'Devi confermare la tua email prima di accedere.'
    return 'Si è verificato un errore. Riprova.'
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.bg} />
      <Link to="/" className={styles.logo}>🎓 Zero Stress</Link>

      <div className={styles.card}>
        <h1 className={styles.title}>
          {isRegister ? 'Crea il tuo account' : 'Bentornato/a! 👋'}
        </h1>
        <p className={styles.subtitle}>
          {isRegister
            ? 'Per iniziare il tuo percorso verso una maturità senza stress.'
            : 'Accedi per continuare il tuo percorso.'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegister && (
            <div>
              <label className={styles.label}>Come ti chiami?</label>
              <input
                className="input"
                type="text"
                placeholder="Il tuo nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className={styles.label}>Email</label>
            <input
              className="input"
              type="email"
              placeholder="nome@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className={styles.label}>Password</label>
            <input
              className="input"
              type="password"
              placeholder="Almeno 6 caratteri"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          {error && <div className={styles.error}>⚠️ {error}</div>}
          {info && <div className={styles.info}>✅ {info}</div>}

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? 'Un momento...' : (isRegister ? 'Registrati →' : 'Accedi →')}
          </button>
        </form>

        <p className={styles.switch}>
          {isRegister ? (
            <>Hai già un account? <Link to="/accedi">Accedi</Link></>
          ) : (
            <>Non hai un account? <Link to="/registrati">Registrati</Link></>
          )}
        </p>
      </div>
    </div>
  )
}
