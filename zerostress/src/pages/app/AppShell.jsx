import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import styles from './AppShell.module.css'

const navItems = [
  { to: '/app/dashboard', icon: '🏠', label: 'Home' },
  { to: '/app/emozioni', icon: '💜', label: 'Emozioni' },
  { to: '/app/ansia', icon: '🆘', label: 'Anti-Ansia' },
  { to: '/app/studio', icon: '📚', label: 'Studio' },
  { to: '/app/pomodoro', icon: '🍅', label: 'Pomodoro' },
  { to: '/app/relax', icon: '🧘', label: 'Relax' },
  { to: '/app/progressi', icon: '⭐', label: 'Progressi' },
]

export default function AppShell() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <div className={styles.shell}>
      {/* ── Top bar ── */}
      <header className={styles.topbar}>
        <NavLink to="/app/dashboard" className={styles.logo}>🎓 Zero Stress</NavLink>
        <div className={styles.userArea}>
          <span className={styles.userName}>Ciao, {profile?.nome || 'studente'}! 👋</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Esci</button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className={styles.content}>
        <Outlet />
      </main>

      {/* ── Bottom nav (mobile-friendly) ── */}
      <nav className={styles.bottomNav}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
