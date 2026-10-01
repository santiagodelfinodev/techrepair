import { useState } from 'react'
import { supabase } from '../supabase.js'

const EMPTY = { nombre: '', telefono: '', localidad: '', notas: '' }

export default function ClientesTab({ clientes, onRefresh }) {
  const [form, setForm] = useState(EMPTY)
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    setSaving(true); setError('')
    const { error: saveError } = await supabase.from('clientes').insert({
      nombre: form.nombre.trim(), telefono: form.telefono.trim(), localidad: form.localidad.trim(), notas: form.notas.trim(),
    })
    setSaving(false)
    if (saveError) { setError(saveError.message); return }
    setForm(EMPTY); setModal(false); onRefresh()
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este cliente?')) return
    await supabase.from('clientes').delete().eq('id', id); onRefresh()
  }

  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div><h2 style={{ fontWeight: 800, fontSize: 18 }}>Clientes ({clientes.length})</h2><p style={{ color: '#6b6b8a', fontSize: 13 }}>Registro de clientes del emprendimiento</p></div>
      <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setError(''); setModal(true) }}>+ Nuevo cliente</button>
    </div>
    <div className="table-wrap" style={{ background: '#fff' }}><table><thead><tr><th>Nombre</th><th>Teléfono</th><th>Localidad</th><th>Notas</th><th>Acciones</th></tr></thead><tbody>
      {clientes.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#6b6b8a' }}>Todavía no hay clientes cargados</td></tr>}
      {clientes.map(c => <tr key={c.id}><td style={{ fontWeight: 700 }}>{c.nombre}</td><td>{c.telefono || '—'}</td><td>{c.localidad || '—'}</td><td>{c.notas || '—'}</td><td><button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>✕</button></td></tr>)}
    </tbody></table></div>
    {modal && <div className="overlay" onClick={() => setModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><h3>Nuevo cliente</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Nombre y apellido" value={form.nombre} onChange={v => setForm(f => ({ ...f, nombre: v }))} />
      <Field label="Teléfono / WhatsApp" value={form.telefono} onChange={v => setForm(f => ({ ...f, telefono: v }))} />
      <Field label="Localidad" value={form.localidad} onChange={v => setForm(f => ({ ...f, localidad: v }))} />
      <div><label className="label">Notas</label><textarea className="input" rows="3" value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} /></div>
      {error && <div className="alert alert-error">{error}</div>}<button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar cliente'}</button><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
    </div></div></div>}
  </div>
}

function Field({ label, value, onChange }) { return <div><label className="label">{label}</label><input className="input" value={value} onChange={e => onChange(e.target.value)} /></div> }
