import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase.js'
import ProductosTab from './ProductosTab.jsx'
import ReparacionesTab from './ReparacionesTab.jsx'
import StockBajoTab from './StockBajoTab.jsx'

export default function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState('dashboard')
  const [productos, setProductos]       = useState([])
  const [reparaciones, setReparaciones] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [{ data: prods }, { data: reps }] = await Promise.all([
      supabase.from('productos').select('*').order('created_at'),
      supabase.from('reparaciones').select('*').order('created_at'),
    ])
    setProductos(prods || [])
    setReparaciones(reps || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const stockBajo = productos.filter(p => p.stock <= p.min_stock)
  const totalInv  = productos.reduce((a, p) => a + p.precio * p.stock, 0)

  const TABS = [
    { id: 'dashboard',    label: '📊 Dashboard' },
    { id: 'productos',    label: '📦 Productos' },
    { id: 'reparaciones', label: '🔧 Reparaciones' },
    { id: 'stock',        label: `⚠️ Stock bajo${stockBajo.length ? ` (${stockBajo.length})` : ''}` },
  ]

  return (
    <div className="admin-wrap">
      {/* Topbar */}
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg,#c44dff,#4A90E2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}>🔧</div>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>
            Tech Repair <span style={{ color: '#c44dff', fontSize: 11, fontWeight: 700 }}>ADMIN</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={fetchAll}>↻ Actualizar</button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div className="admin-content">
        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 20 }}>
          {TABS.map(t => (
            <button key={t.id} className={`tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" />
          </div>
        ) : (
          <>
            {tab === 'dashboard' && (
              <Dashboard
                productos={productos}
                reparaciones={reparaciones}
                stockBajo={stockBajo}
                totalInv={totalInv}
                onTabChange={setTab}
              />
            )}
            {tab === 'productos' && (
              <ProductosTab productos={productos} onRefresh={fetchAll} />
            )}
            {tab === 'reparaciones' && (
              <ReparacionesTab reparaciones={reparaciones} onRefresh={fetchAll} />
            )}
            {tab === 'stock' && (
              <StockBajoTab items={stockBajo} onRefresh={fetchAll} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Dashboard({ productos, reparaciones, stockBajo, totalInv, onTabChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Productos</div>
          <div className="stat-value">{productos.length}</div>
          <div className="stat-sub">en catálogo</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Reparaciones</div>
          <div className="stat-value">{reparaciones.length}</div>
          <div className="stat-sub">servicios</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Stock bajo</div>
          <div className="stat-value" style={{ color: stockBajo.length > 0 ? '#dc2626' : '#15803d' }}>
            {stockBajo.length}
          </div>
          <div className="stat-sub">a reponer</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valor inventario</div>
          <div className="stat-value" style={{ fontSize: 22 }}>
            ${totalInv.toLocaleString('es-AR')}
          </div>
          <div className="stat-sub">stock × precio</div>
        </div>
      </div>

      {stockBajo.length > 0 && (
        <div style={{ background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 14, padding: '16px 20px' }}>
          <div style={{ fontWeight: 800, color: '#dc2626', fontSize: 14, marginBottom: 12 }}>
            ⚠️ Necesitás reponer stock
          </div>
          {stockBajo.map(p => (
            <div key={p.id} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '7px 0', borderBottom: '1px solid #fee2e2', fontSize: 13
            }}>
              <span style={{ fontWeight: 600 }}>{p.nombre}</span>
              <span style={{ color: '#dc2626', fontWeight: 700 }}>
                Stock: {p.stock} (mín: {p.min_stock})
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Accesos rápidos</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onTabChange('productos')}>
            + Nuevo producto
          </button>
          <button className="btn btn-primary" onClick={() => onTabChange('reparaciones')}>
            + Nueva reparación
          </button>
        </div>
      </div>
    </div>
  )
}
