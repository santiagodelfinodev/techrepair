import { useState } from 'react'
import { supabase } from '../supabase.js'

const EMPTY = { nombre: '', categoria: 'celular', subcategoria: 'extras', precio: '', moneda: 'ARS', costo: '', costo_moneda: 'ARS', stock: '', min_stock: '', imagen_url: '', imagenes_urls: [] }

export default function ProductosTab({ productos, onRefresh }) {
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')
  const [filtro, setFiltro]   = useState('todos')

  function openAdd() {
    setForm(EMPTY); setEditId(null); setError(''); setModal(true)
  }
  function openEdit(p) {
    setForm({ ...EMPTY, ...p, precio: String(p.precio ?? ''), costo: String(p.costo ?? ''), stock: String(p.stock ?? ''), min_stock: String(p.min_stock ?? '') })
    setEditId(p.id); setError(''); setModal(true)
  }
  function openClone(p) {
    setForm({ ...EMPTY, ...p, nombre: `${p.nombre} (copia)`, precio: String(p.precio ?? ''), costo: String(p.costo ?? ''), stock: String(p.stock ?? ''), min_stock: String(p.min_stock ?? '') })
    setEditId(null); setError(''); setModal(true)
  }
  function closeModal() { if (!saving) setModal(false) }

  async function uploadImages(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setError('Usá JPG, PNG, WebP o GIF de hasta 5 MB por foto'); return;
    }
    setSaving(true); setError('');
    try {
      for (const file of files) {
        const path = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('product-images').upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        setForm(f => {
          const images = [...(f.imagenes_urls?.length ? f.imagenes_urls : f.imagen_url ? [f.imagen_url] : []), data.publicUrl];
          return { ...f, imagenes_urls: images, imagen_url: images[0] };
        });
      }
    } catch (error) { setError(`No se pudieron subir todas las fotos: ${error.message}`) }
    finally { setSaving(false) }
  }

  async function handleSave() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    setSaving(true); setError('')
    const payload = {
      nombre:      form.nombre.trim(),
      categoria:   form.categoria,
      subcategoria: form.categoria === 'accesorio' ? form.subcategoria : null,
      precio:      Number(form.precio) || 0,
      moneda:      form.moneda || 'ARS',
      costo:       Number(form.costo) || 0,
      costo_moneda: form.costo_moneda || 'ARS',
      stock:       Number(form.stock) || 0,
      min_stock:   Number(form.min_stock) || 0,
      imagen_url:  form.imagen_url || null,
      imagenes_urls: form.imagenes_urls?.length ? form.imagenes_urls : form.imagen_url ? [form.imagen_url] : [],
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
  ).filter(p => {
    if (filtro === 'todos') return true
    if (filtro === 'celular') return p.categoria === 'celular'
    if (filtro === 'vidrios') return p.subcategoria === 'vidrios' || p.subcategoria === 'vidrio' || p.nombre.toLowerCase().includes('vidrio')
    return p.categoria === 'accesorio' && (p.subcategoria || 'extras') === filtro
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18 }}>Productos ({productos.length})</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input className="input" style={{ width: 200 }} placeholder="🔍 Buscar…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input" style={{ width: 170 }} value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="celular">Celulares</option>
            <option value="cargadores">Cargadores</option>
            <option value="vidrios">Vidrios templados</option>
            <option value="fundas">Fundas</option>
            <option value="cables">Cables</option>
            <option value="extras">Extras</option>
          </select>
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
              <th>Costo de compra</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#6b6b8a', padding: 32 }}>No hay productos</td></tr>
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
                  {p.moneda || 'ARS'} ${Number(p.precio || 0).toLocaleString('es-AR')}
                </td>
                <td>{p.costo_moneda || 'ARS'} ${Number(p.costo || 0).toLocaleString('es-AR')}</td>
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
                    <button className="btn btn-secondary btn-sm" onClick={() => openClone(p)}>Clonar</button>
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
              {form.categoria === 'accesorio' && (
                <div>
                  <label className="label">Tipo de accesorio</label>
                  <select className="input" value={form.subcategoria || 'extras'} onChange={e => setForm(f => ({ ...f, subcategoria: e.target.value }))}>
                    <option value="cargadores">Cargadores</option>
                    <option value="vidrios">Vidrios templados</option>
                    <option value="fundas">Fundas</option>
                    <option value="cables">Cables</option>
                    <option value="extras">Extras</option>
                  </select>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
                <div><label className="label">Precio de venta</label><input className="input" type="number" min="0" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} placeholder="0" /></div>
                <div><label className="label">Moneda</label><select className="input" value={form.moneda || 'ARS'} onChange={e => setForm(f => ({ ...f, moneda: e.target.value }))}><option value="ARS">ARS</option><option value="USD">USD</option></select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
                <div><label className="label">Costo de compra</label><input className="input" type="number" min="0" value={form.costo} onChange={e => setForm(f => ({ ...f, costo: e.target.value }))} placeholder="0" /></div>
                <div><label className="label">Moneda</label><select className="input" value={form.costo_moneda || 'ARS'} onChange={e => setForm(f => ({ ...f, costo_moneda: e.target.value }))}><option value="ARS">ARS</option><option value="USD">USD</option></select></div>
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
                <label className="label">Foto del producto (opcional)</label>
                <input className="input" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" disabled={saving} onChange={uploadImages} />
                <small>Podés seleccionar varias fotos. La primera será la portada.</small>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                  {(form.imagenes_urls?.length ? form.imagenes_urls : form.imagen_url ? [form.imagen_url] : []).map((url, index, images) => <div key={url}><img src={url} alt={`Foto ${index + 1}`} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} /><button className="btn btn-secondary btn-sm" disabled={saving} onClick={() => { const next = images.filter((_, i) => i !== index); setForm(f => ({ ...f, imagenes_urls: next, imagen_url: next[0] || '' })) }}>Quitar</button></div>)}
                </div>
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
