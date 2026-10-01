import { useState } from 'react'
import { supabase } from '../supabase.js'

const EMPTY = { nombre: '', categoria: 'celular', precio: '', stock: '', min_stock: '', imagen_url: '' }

export default function ProductosTab({ productos, onRefresh }) {
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')

  function openAdd() {
    setForm(EMPTY); setEditId(null); setError(''); setModal(true)
  }
  function openEdit(p) {
    setForm({ ...p, precio: String(p.precio), stock: String(p.stock), min_stock: String(p.min_stock) })
    setEditId(p.id); setError(''); setModal(true)
  }
  function closeModal() { setModal(false) }

  async function handleSave() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    setSaving(true); setError('')
    const payload = {
      nombre:      form.nombre.trim(),
      categoria:   form.categoria,
      precio:      Number(form.precio) || 0,
      stock:       Number(form.stock) || 0,
      min_stock:   Number(form.min_stock) || 0,
      imagen_url:  form.imagen_url || null,
    }
    const { error } = editId
      ? await supabase.from('productos').update(payload).eq('id', editId)
      : await supabase.from('productos').insert(payload)
    setSaving(false)
    if (error) { setError(error.message); return }
    setModal(false); onRefresh()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto?')) return
    await supabase.from('productos').delete().eq('id', id)
    onRefresh()
  }

  async function changeStock(id, delta) {
    const p = productos.find(x => x.id === id)
    const next = Math.max(0, p.stock + delta)
    await supabase.from('productos').update({ stock: next }).eq('id', id)
    onRefresh()
  }

  const list = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18 }}>Productos ({productos.length})</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input className="input" style={{ width: 200 }} placeholder="🔍 Buscar…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openAdd}>+ Agregar</button>
        </div>
      </div>

      <div className="table-wrap" style={{ background: '#fff' }}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#6b6b8a', padding: 32 }}>No hay productos</td></tr>
            )}
            {list.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 700 }}>
                  {p.imagen_url && (
                    <img src={p.imagen_url} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', marginRight: 8, verticalAlign: 'middle' }} />
                  )}
                  {p.nombre}
                </td>
                <td>
                  <span className={`tag ${p.categoria === 'celular' ? 'tag-purple' : p.categoria === 'repuesto' ? 'tag-gray' : 'tag-blue'}`}>
                    {p.categoria}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: '#7B2FBE' }}>
                  ${p.precio.toLocaleString('es-AR')}
                </td>
                <td>
                  <div className="stock-ctrl">
                    <button className="stock-btn" onClick={() => changeStock(p.id, -1)}>−</button>
                    <span className="stock-num" style={{ color: p.stock <= p.min_stock ? '#dc2626' : '#1a1a2e' }}>
                      {p.stock}
                    </span>
                    <button className="stock-btn" onClick={() => changeStock(p.id, +1)}>+</button>
                  </div>
                </td>
                <td>
                  {p.stock === 0
                    ? <span className="tag tag-red">Sin stock</span>
                    : p.stock <= p.min_stock
                    ? <span className="tag tag-amber">Stock bajo</span>
                    : <span className="tag tag-green">OK</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editId ? 'Editar producto' : 'Nuevo producto'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Nombre</label>
                <input className="input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div>
                <label className="label">Categoría</label>
                <select className="input" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                  <option value="celular">Celular</option>
                  <option value="accesorio">Accesorio</option>
                  <option value="repuesto">Repuesto</option>
                </select>
              </div>
              <div>
                <label className="label">Precio (ARS)</label>
                <input className="input" type="number" min="0" value={form.precio}
                  onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} placeholder="0" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Stock actual</label>
                  <input className="input" type="number" min="0" value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
                </div>
                <div>
                  <label className="label">Stock mínimo</label>
                  <input className="input" type="number" min="0" value={form.min_stock}
                    onChange={e => setForm(f => ({ ...f, min_stock: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="label">URL de imagen (opcional)</label>
                <input className="input" value={form.imagen_url || ''} placeholder="https://…"
                  onChange={e => setForm(f => ({ ...f, imagen_url: e.target.value }))} />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: 12 }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando…' : (editId ? 'Guardar cambios' : 'Agregar producto')}
                </button>
                <button className="btn btn-secondary" style={{ flex: 1, padding: 12 }} onClick={closeModal}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
