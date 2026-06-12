import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { ToastProvider } from './lib/ToastContext'

// Public pages
import Landing from './pages/Landing'
import Auth from './pages/Auth'

// Private app pages
import AppShell from './pages/app/AppShell'
import Onboarding from './pages/app/Onboarding'
import Dashboard from './pages/app/Dashboard'
import Emozioni from './pages/app/Emozioni'
import AntiAnsia from './pages/app/AntiAnsia'
import Studio from './pages/app/Studio'
import Pomodoro from './pages/app/Pomodoro'
import Relax from './pages/app/Relax'
import Progressi from './pages/app/Progressi'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Caricamento...</p>
    </div>
  )
  return user ? children : <Navigate to="/accedi" replace />
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
    </div>
  )
  return !user ? children : <Navigate to="/app" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Pubblica ── */}
      <Route path="/" element={<Landing />} />
      <Route path="/accedi" element={
        <PublicOnlyRoute><Auth mode="login" /></PublicOnlyRoute>
      } />
      <Route path="/registrati" element={
        <PublicOnlyRoute><Auth mode="register" /></PublicOnlyRoute>
      } />

      {/* ── Area privata ── */}
      <Route path="/app" element={
        <PrivateRoute><AppShell /></PrivateRoute>
      }>
        <Route index element={<Navigate to="/app/benvenuto" replace />} />
        <Route path="benvenuto" element={<Onboarding />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="emozioni" element={<Emozioni />} />
        <Route path="ansia" element={<AntiAnsia />} />
        <Route path="studio" element={<Studio />} />
        <Route path="pomodoro" element={<Pomodoro />} />
        <Route path="relax" element={<Relax />} />
        <Route path="progressi" element={<Progressi />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}
