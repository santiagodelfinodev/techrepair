import { useState } from 'react'
import { supabase } from '../supabase.js'

const EMPTY = { cliente: '', equipo: '', reparacion: '', fecha: new Date().toISOString().slice(0, 10), repuesto: '', precio_cobrado: '', costo_repuesto: '' }

export default function TrabajosTab({ trabajos, clientes, onRefresh }) {
  const [form, setForm] = useState(EMPTY)
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newClient, setNewClient] = useState(null)
  const [editId, setEditId] = useState(null)

  function openAdd() { setForm(EMPTY); setError(''); setModal(true) }
  function openEdit(t) { setEditId(t.id); setForm({ cliente: t.cliente || '', equipo: t.equipo || '', reparacion: t.reparacion || '', fecha: t.fecha, repuesto: t.repuesto || '', precio_cobrado: String(t.precio_cobrado || ''), costo_repuesto: String(t.costo_repuesto || '') }); setError(''); setModal(true) }
  async function remove(id) { if (!confirm('¿Eliminar este trabajo?')) return; await supabase.from('trabajos').delete().eq('id', id); onRefresh() }
  async function save() {
    if (!form.cliente.trim() || !form.reparacion.trim()) { setError('Completá el cliente y la reparación'); return }
    setSaving(true); setError('')
    const payload = {
      cliente: form.cliente.trim(), equipo: form.equipo.trim(), reparacion: form.reparacion.trim(),
      fecha: form.fecha, repuesto: form.repuesto.trim(), precio_cobrado: Number(form.precio_cobrado) || 0,
      costo_repuesto: Number(form.costo_repuesto) || 0,
    }
    const { error: saveError } = editId
      ? await supabase.from('trabajos').update(payload).eq('id', editId)
      : await supabase.from('trabajos').insert(payload)
    setSaving(false)
    if (saveError) { setError(saveError.message); return }
    setModal(false); setEditId(null); onRefresh()
  }

  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div><h2 style={{ fontWeight: 800, fontSize: 18 }}>Trabajos realizados ({trabajos.length})</h2><p style={{ color: '#6b6b8a', fontSize: 13 }}>Registro de reparaciones y ganancias</p></div>
      <button className="btn btn-primary" onClick={openAdd}>+ Nuevo trabajo</button>
    </div>
    <div className="table-wrap" style={{ background: '#fff' }}><table><thead><tr><th>Fecha</th><th>Cliente</th><th>Equipo</th><th>Reparación</th><th>Repuesto</th><th>Cobrado</th><th>Costo</th><th>Ganancia</th><th>Acciones</th></tr></thead>
      <tbody>{trabajos.length === 0 && <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: '#6b6b8a' }}>Todavía no hay trabajos cargados</td></tr>}
        {trabajos.map(t => <tr key={t.id}><td>{new Date(`${t.fecha}T12:00:00`).toLocaleDateString('es-AR')}</td><td style={{ fontWeight: 700 }}>{t.cliente}</td><td>{t.equipo || '—'}</td><td>{t.reparacion}</td><td>{t.repuesto || '—'}</td><td>${Number(t.precio_cobrado).toLocaleString('es-AR')}</td><td>${Number(t.costo_repuesto).toLocaleString('es-AR')}</td><td style={{ color: '#15803d', fontWeight: 800 }}>${(Number(t.precio_cobrado) - Number(t.costo_repuesto)).toLocaleString('es-AR')}</td><td><button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}>Editar</button> <button className="btn btn-danger btn-sm" onClick={() => remove(t.id)}>✕</button></td></tr>)}
      </tbody></table></div>
    {modal && <div className="overlay" onClick={() => setModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><h3>Nuevo trabajo realizado</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div><label className="label">Cliente</label><input className="input" list="clientes-sugeridos" placeholder="Escribí para buscar un cliente" value={form.cliente} onChange={e => setForm(f => ({ ...f, cliente: e.target.value }))} /><datalist id="clientes-sugeridos">{clientes.map(c => <option key={c.id} value={c.nombre} />)}</datalist>{form.cliente.trim() && !clientes.some(c => c.nombre.toLowerCase() === form.cliente.trim().toLowerCase()) && <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => setNewClient({ nombre: form.cliente.trim(), telefono: '', localidad: '', notas: '' })}>+ Crear cliente “{form.cliente}”</button>}</div>
      <Field label="Equipo" placeholder="Ej: iPhone 13" value={form.equipo} onChange={v => setForm(f => ({ ...f, equipo: v }))} />
      <div><label className="label">Reparación realizada</label><input className="input" list="reparaciones-sugeridas" placeholder="Elegí o escribí una reparación" value={form.reparacion} onChange={e => setForm(f => ({ ...f, reparacion: e.target.value }))} /><datalist id="reparaciones-sugeridas"><option value="Módulo" /><option value="Batería" /><option value="Tapa" /><option value="Pin de carga" /><option value="Software" /><option value="Otro" /></datalist></div>
      <Field label="Repuesto utilizado" value={form.repuesto} onChange={v => setForm(f => ({ ...f, repuesto: v }))} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><Field label="Precio cobrado" type="number" value={form.precio_cobrado} onChange={v => setForm(f => ({ ...f, precio_cobrado: v }))} /><Field label="Costo repuesto" type="number" value={form.costo_repuesto} onChange={v => setForm(f => ({ ...f, costo_repuesto: v }))} /></div>
      <Field label="Fecha" type="date" value={form.fecha} onChange={v => setForm(f => ({ ...f, fecha: v }))} />
      {error && <div className="alert alert-error">{error}</div>}<button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar trabajo'}</button><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
    </div></div></div>}
    {newClient && <NewClientModal client={newClient} setClient={setNewClient} onClose={() => setNewClient(null)} onCreated={name => { setForm(f => ({ ...f, cliente: name })); setNewClient(null); onRefresh() }} />}
  </div>
}

function Field({ label, value, onChange, type = 'text', placeholder }) { return <div><label className="label">{label}</label><input className="input" type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} /></div> }

function NewClientModal({ client, setClient, onClose, onCreated }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  async function save() {
    if (!client.nombre.trim()) return
    setSaving(true)
    const { error: saveError } = await supabase.from('clientes').insert(client)
    setSaving(false)
    if (saveError) { setError(saveError.message); return }
    onCreated(client.nombre.trim())
  }
  return <div className="overlay" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}><h3>Crear cliente</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Field label="Nombre y apellido" value={client.nombre} onChange={v => setClient(c => ({ ...c, nombre: v }))} />
    <Field label="Teléfono / WhatsApp" value={client.telefono} onChange={v => setClient(c => ({ ...c, telefono: v }))} />
    <Field label="Localidad" value={client.localidad} onChange={v => setClient(c => ({ ...c, localidad: v }))} />
    <div><label className="label">Notas</label><textarea className="input" rows="3" value={client.notas} onChange={e => setClient(c => ({ ...c, notas: e.target.value }))} /></div>
    {error && <div className="alert alert-error">{error}</div>}<button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Crear cliente'}</button><button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
  </div></div></div>
}
