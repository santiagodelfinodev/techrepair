import { useState, useEffect } from 'react'
import { supabase, passwordSetupRequested } from './supabase.js'
import PasswordSetup from './components/PasswordSetup.jsx'
import PublicPage from './components/PublicPage.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import LoginModal from './components/LoginModal.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [setupPassword, setSetupPassword] = useState(passwordSetupRequested)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'PASSWORD_RECOVERY') setSetupPassword(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f1a' }}>
      <div className="spinner" />
    </div>
  )

  if (setupPassword) return <PasswordSetup session={session} onDone={() => setSetupPassword(false)} />
  if (session) return <AdminPanel onPasswordChange={() => setSetupPassword(true)} onLogout={() => supabase.auth.signOut()} />

  return (
    <>
      <PublicPage onLoginClick={() => setShowLogin(true)} />
      {showLogin && (
        <LoginModal
          onSuccess={() => setShowLogin(false)}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  )
}
