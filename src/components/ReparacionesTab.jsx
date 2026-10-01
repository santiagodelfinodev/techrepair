import { useState } from 'react'
import { supabase } from '../supabase.js'

const EMPTY = { nombre: '', precio: '', disponible: true }

export default function ReparacionesTab({ reparaciones, onRefresh }) {
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function openAdd() { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  function openEdit(r) {
    setForm({ ...r, precio: String(r.precio) })
    setEditId(r.id); setError(''); setModal(true)
  }

  async function handleSave() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    setSaving(true); setError('')
    const payload = { nombre: form.nombre.trim(), precio: Number(form.precio) || 0, disponible: form.disponible }
    const { error } = editId
      ? await supabase.from('reparaciones').update(payload).eq('id', editId)
      : await supabase.from('reparaciones').insert(payload)
    setSaving(false)
    if (error) { setError(error.message); return }
    setModal(false); onRefresh()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este servicio?')) return
    await supabase.from('reparaciones').delete().eq('id', id)
    onRefresh()
  }

  async function toggleDisp(r) {
    await supabase.from('reparaciones').update({ disponible: !r.disponible }).eq('id', r.id)
    onRefresh()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18 }}>Servicios de reparación ({reparaciones.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Agregar servicio</button>
      </div>

      <div className="table-wrap" style={{ background: '#fff' }}>
        <table>
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Precio aprox.</th>
              <th>Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reparaciones.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#6b6b8a', padding: 32 }}>No hay servicios</td></tr>
            )}
            {reparaciones.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 700 }}>{r.nombre}</td>
                <td style={{ fontWeight: 700, color: '#7B2FBE' }}>${r.precio.toLocaleString('es-AR')}</td>
                <td>
                  <button
                    onClick={() => toggleDisp(r)}
                    style={{
                      background: r.disponible ? '#dcfce7' : '#fee2e2',
                      color: r.disponible ? '#15803d' : '#dc2626',
                      border: 'none', padding: '5px 14px', borderRadius: 8,
                      fontWeight: 700, fontSize: 12, cursor: 'pointer'
                    }}>
                    {r.disponible ? '✓ Sí' : '✗ No'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editId ? 'Editar servicio' : 'Nuevo servicio'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Nombre del servicio</label>
                <input className="input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div>
                <label className="label">Precio aproximado (ARS)</label>
                <input className="input" type="number" min="0" value={form.precio}
                  onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} placeholder="0" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="disp" checked={form.disponible}
                  onChange={e => setForm(f => ({ ...f, disponible: e.target.checked }))}
                  style={{ width: 18, height: 18, accentColor: '#9b3dff' }} />
                <label htmlFor="disp" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Servicio disponible actualmente
                </label>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: 12 }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando…' : (editId ? 'Guardar cambios' : 'Agregar servicio')}
                </button>
                <button className="btn btn-secondary" style={{ flex: 1, padding: 12 }} onClick={() => setModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
