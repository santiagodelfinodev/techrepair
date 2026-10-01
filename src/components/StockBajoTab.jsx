import { supabase } from '../supabase.js'

export default function StockBajoTab({ items, onRefresh }) {
  if (items.length === 0) return (
    <div className="card" style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
      <div style={{ fontWeight: 800, color: '#15803d', fontSize: 16 }}>Todo el stock está en niveles correctos</div>
      <div style={{ color: '#6b6b8a', fontSize: 13, marginTop: 6 }}>No hay productos por reponer</div>
    </div>
  )

  async function changeStock(p, delta) {
    const next = Math.max(0, p.stock + delta)
    await supabase.from('productos').update({ stock: next }).eq('id', p.id)
    onRefresh()
  }

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>
        Items con stock bajo o agotado
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{p.nombre}</div>
              <div style={{ fontSize: 12, color: '#6b6b8a', marginTop: 3 }}>
                {p.categoria} · ${p.precio.toLocaleString('es-AR')}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6b6b8a', fontWeight: 700 }}>ACTUAL</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: p.stock === 0 ? '#dc2626' : '#f59e0b' }}>{p.stock}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6b6b8a', fontWeight: 700 }}>MÍNIMO</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#6b6b8a' }}>{p.min_stock}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="btn btn-primary btn-sm" onClick={() => changeStock(p, +5)}>+5 unidades</button>
                <button className="btn btn-secondary btn-sm" onClick={() => changeStock(p, +1)}>+1 unidad</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
