import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase.js'
import ProductosTab from './ProductosTab.jsx'
import ReparacionesTab from './ReparacionesTab.jsx'
import StockBajoTab from './StockBajoTab.jsx'
import TrabajosTab from './TrabajosTab.jsx'
import ClientesTab from './ClientesTab.jsx'
import VentasTab from './VentasTab.jsx'
import GananciasTab from './GananciasTab.jsx'

export default function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState('productos')
  const [productos, setProductos]       = useState([])
  const [reparaciones, setReparaciones] = useState([])
  const [trabajos, setTrabajos] = useState([])
  const [clientes, setClientes] = useState([])
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [{ data: prods }, { data: reps }, { data: works }, { data: people }, { data: sales }] = await Promise.all([
      supabase.from('productos').select('*').order('created_at'),
      supabase.from('reparaciones').select('*').order('created_at'),
      supabase.from('trabajos').select('*').order('fecha', { ascending: false }),
      supabase.from('clientes').select('*').order('nombre'),
      supabase.from('ventas').select('*').order('fecha', { ascending: false }),
    ])
    setProductos(prods || [])
    setReparaciones(reps || [])
    setTrabajos(works || [])
    setClientes(people || [])
    setVentas(sales || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const stockBajo = productos.filter(p => p.stock <= p.min_stock)
  const totalInv  = productos.reduce((a, p) => a + p.precio * p.stock, 0)

  const TABS = [
    { id: 'productos',    label: '📦 Productos' },
    { id: 'reparaciones', label: '🔧 Reparaciones' },
    { id: 'trabajos', label: '🧾 Servicio técnico' },
    { id: 'clientes', label: '👥 Clientes' },
    { id: 'ventas', label: '💰 Ventas' },
    { id: 'ganancias', label: '📈 Ganancias' },
  ]

  return (
    <div className="admin-wrap">
      {/* Topbar */}
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/logo.png"
            alt="Tech Repair"
            style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain', background: '#fff' }}
          />
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
            {tab === 'productos' && (
              <ProductosTab productos={productos} onRefresh={fetchAll} />
            )}
            {tab === 'reparaciones' && (
              <ReparacionesTab reparaciones={reparaciones} onRefresh={fetchAll} />
            )}
            {tab === 'trabajos' && <TrabajosTab trabajos={trabajos} clientes={clientes} onRefresh={fetchAll} />}
            {tab === 'clientes' && <ClientesTab clientes={clientes} onRefresh={fetchAll} />}
            {tab === 'ventas' && <VentasTab ventas={ventas} onRefresh={fetchAll} />}
            {tab === 'ganancias' && <GananciasTab trabajos={trabajos} ventas={ventas} />}
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
