import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function LoginModal({ onSuccess, onClose }) {
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    setLoading(false)
    if (error) {
      setError('Usuario o contraseña incorrectos')
    } else {
      onSuccess()
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg,#c44dff,#4A90E2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 14px'
          }}>🔒</div>
          <h3 style={{ marginBottom: 4 }}>Acceso Admin</h3>
          <p style={{ color: '#6b6b8a', fontSize: 13 }}>Tech Repair — Panel de gestión</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label">Email</label>
            <input
              className="input" type="email" required autoFocus
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@techrepair.com"
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              className="input" type="password" required
              value={pass} onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ padding: '12px', marginTop: 4, opacity: loading ? .7 : 1 }}>
            {loading ? 'Ingresando…' : 'Ingresar al panel'}
          </button>
          <button className="btn btn-secondary" type="button" onClick={onClose}
            style={{ padding: '10px' }}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  )
}
