import { Link } from 'react-router-dom'
import styles from './Landing.module.css'

const features = [
  { icon: '💜', color: 'var(--pink)', title: 'Come ti senti?', desc: 'Riconosci le emozioni e ricevi strategie personalizzate per il tuo stato d\'animo.' },
  { icon: '🆘', color: 'var(--orange)', title: 'Tecniche Anti-Ansia', desc: 'Respirazione 4-7-8, grounding 5-4-3-2-1 e la box delle preoccupazioni. Subito, quando ne hai bisogno.' },
  { icon: '📚', color: 'var(--blue)', title: 'Piano Studio', desc: 'Organizza le materie, gestisci le priorità e spunta quello che hai fatto. Metodo ADHD-friendly.' },
  { icon: '🍅', color: 'var(--orange)', title: 'Timer Pomodoro', desc: '25 minuti di focus puro, poi una pausa. Il metodo scientifico per studiare senza esaurirsi.' },
  { icon: '🧘', color: 'var(--purple)', title: 'Angolo Relax', desc: 'Musica, mindfulness e stretching rapido per ricaricarti e tornare al massimo.' },
  { icon: '⭐', color: 'var(--yellow)', title: 'Progressi & Badge', desc: 'Traccia il tuo streak giornaliero, guadagna badge e celebra ogni piccolo risultato.' },
]

const steps = [
  { num: '1', icon: '📧', title: 'Registrati', desc: 'Crea il tuo account con email. Gratis, sempre.' },
  { num: '2', icon: '💚', title: 'Dicci come stai', desc: 'Ogni accesso inizia con una domanda: come ti senti oggi?' },
  { num: '3', icon: '🚀', title: 'Ricevi supporto', desc: 'La dashboard si adatta al tuo stato emotivo e ti propone le risorse giuste.' },
]

export default function Landing() {
  return (
    <div className={styles.landing}>
      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <span className={styles.navLogo}>🎓 Zero Stress</span>
        <div className={styles.navLinks}>
          <a href="#funzionalita">Funzionalità</a>
          <a href="#come-funziona">Come funziona</a>
          <Link to="/accedi" className="btn btn-outline btn-sm">Accedi</Link>
          <Link to="/registrati" className="btn btn-primary btn-sm">Registrati →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🏫 Classe 5ª · Meccatronica · Maturità 2026</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleZero}>ZERO</span>
            <br />
            <span className={styles.titleStress}>STRESS</span>
          </h1>
          <p className={styles.heroSub}>
            Il toolkit digitale per affrontare la maturità con serenità, focus e motivazione.
            Pensato per te, adattato al tuo umore di oggi.
          </p>
          <div className={styles.heroPills}>
            <span className={styles.pill}>🎯 Organizza lo studio</span>
            <span className={styles.pill}>💚 Gestisci le emozioni</span>
            <span className={styles.pill}>⭐ Traccia i progressi</span>
            <span className={styles.pill}>🧘 Ricarica le energie</span>
          </div>
          <div className={styles.heroCtas}>
            <Link to="/registrati" className="btn btn-primary btn-lg">Inizia il percorso →</Link>
            <Link to="/accedi" className="btn btn-outline btn-lg">Ho già un account</Link>
          </div>
        </div>
        {/* Floating emojis */}
        <span className={styles.float} style={{ top: '20%', left: '5%', animationDelay: '0s' }}>🎓</span>
        <span className={styles.float} style={{ top: '30%', right: '5%', animationDelay: '1.5s' }}>⚙️</span>
        <span className={styles.float} style={{ top: '65%', left: '4%', animationDelay: '3s' }}>🔧</span>
        <span className={styles.float} style={{ top: '72%', right: '4%', animationDelay: '0.8s' }}>💡</span>
      </section>

      {/* ── Features ── */}
      <section id="funzionalita" className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className="section-tag" style={{ background: 'rgba(6,214,160,0.12)', color: 'var(--teal)' }}>✨ Cosa trovi dentro</div>
          <h2 className={styles.sectionTitle}>Tutto quello di cui hai bisogno</h2>
          <p className="text-dim" style={{ maxWidth: 520, margin: '0 auto', fontWeight: 600, lineHeight: 1.6 }}>
            Ogni funzionalità è pensata per studenti con ADHD e per chiunque voglia affrontare la maturità con più serenità.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard} style={{ '--accent': f.color }}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 style={{ color: f.color }}>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="come-funziona" className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className="section-tag" style={{ background: 'rgba(255,217,61,0.12)', color: 'var(--yellow)' }}>🗺 Il percorso</div>
          <h2 className={styles.sectionTitle}>Come funziona</h2>
        </div>
        <div className={styles.stepsRow}>
          {steps.map((s, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepIcon}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA bottom ── */}
      <section className={styles.ctaBottom}>
        <div className={styles.ctaCard}>
          <h2>Pronto/a ad affrontare la maturità?</h2>
          <p>Unisciti alla tua classe. Gratis, per sempre.</p>
          <Link to="/registrati" className="btn btn-primary btn-lg">Crea il tuo account →</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>🎓 Zero Stress</div>
        <p>Fatto con ❤️ per la classe 5ª Meccatronica · Maturità 2026</p>
      </footer>
    </div>
  )
}
