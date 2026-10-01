import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import PublicPage from './components/PublicPage.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import LoginModal from './components/LoginModal.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f1a' }}>
      <div className="spinner" />
    </div>
  )

  if (session) return <AdminPanel onLogout={() => supabase.auth.signOut()} />

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
