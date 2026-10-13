import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function PasswordSetup({ session, onDone }) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function save(event) {
    event.preventDefault()
    if (busy) return
    setError('')
    if (password.length < 8) return setError('Usá al menos 8 caracteres.')
    if (password !== confirmation) return setError('Las contraseñas no coinciden.')
    setBusy(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setPassword(''); setConfirmation(''); setSaved(true)
    } catch (error) { setError(error.message || 'No se pudo guardar. Intentá nuevamente.') }
    finally { setBusy(false) }
  }

  return <div className="overlay"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="password-title">
    <h3 id="password-title">Mi contraseña</h3>
    {!session ? <><p>El enlace venció o no hay una sesión activa. Ingresá al admin o solicitá una nueva invitación.</p><button className="btn btn-secondary" onClick={onDone}>Volver al inicio</button></> : saved ? <>
      <p role="status">Tu contraseña se guardó correctamente.</p><button className="btn btn-primary" onClick={onDone}>Volver al panel</button>
    </> : <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p>Configurá la contraseña de {session.user.email} para ingresar con email y contraseña.</p>
      <div><label className="label" htmlFor="new-password">Nueva contraseña</label><input id="new-password" className="input" type="password" autoComplete="new-password" autoFocus required minLength={8} value={password} disabled={busy} onChange={e => setPassword(e.target.value)} /></div>
      <div><label className="label" htmlFor="confirm-password">Repetir contraseña</label><input id="confirm-password" className="input" type="password" autoComplete="new-password" required minLength={8} value={confirmation} disabled={busy} onChange={e => setConfirmation(e.target.value)} /></div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar contraseña'}</button>
      <button type="button" className="btn btn-secondary" disabled={busy} onClick={onDone}>Cancelar</button>
    </form>}
  </div></div>
}
