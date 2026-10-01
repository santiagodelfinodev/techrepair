import { useState } from 'react'

const SERVICIOS = [
  {
    icon: '📱',
    titulo: 'Cambio de pantallas',
    desc: 'Módulos originales y compatibles para todas las marcas',
    detalle: [
      { cal: 'Black "Original"', desc: 'Idéntica a la de fábrica. Colores reales, táctil perfecto y garantía extendida.' },
      { cal: 'Gold (oled)', desc: 'Para iPhones. Pantalla rígida con excelente color, intermedia entre original y económica.' },
      { cal: 'Silver (incell)', desc: 'Repuesto de terceros con buena calidad. Ideal para quienes buscan precio accesible.' },
    ],
  },
  {
    icon: '🔋',
    titulo: 'Cambio de batería',
    desc: 'Batería nueva con garantía incluida',
    detalle: [
      { cal: 'Iphone', desc: 'Excelente calidad de batería para iPhones. programadas al 100% sin mensajes de piezas desconocidas.' },
      { cal: 'Android', desc: 'Batería de alta calidad para dispositivos Android. ' },
    ],
  },
  {
    icon: '🔌',
    titulo: 'Pines de carga',
    desc: 'Placas de carga - USB-C, Lightning y Micro USB',
    detalle: [
      { cal: 'USB-C', desc: 'Android modernos e iPhone 15 en adelante.' },
      { cal: 'Lightning', desc: 'iPhone 14 y anteriores.' },
      { cal: 'Micro USB', desc: 'Equipos más antiguos.' },
    ],
  },
  {
    icon: '💧',
    titulo: 'Equipos mojados',
    desc: 'Diagnóstico y recuperación por daño de agua (sin garantía)',
    detalle: [
      { cal: 'Diagnóstico sin cargo', desc: 'Evaluamos el nivel de daño antes de presupuestar.' },
      { cal: 'Limpieza ultrasónica', desc: 'Proceso profesional para eliminar corrosión en placa.' },
    ],
  },
  {
    icon: '⚙️',
    titulo: 'Software',
    desc: 'Actualizaciones, reseteos y fallas de sistema',
    detalle: [
      { cal: 'Reseteo de fábrica', desc: 'Restauramos el equipo a su estado original.' },
      { cal: 'Actualización de sistema', desc: 'Mejora el rendimiento y la seguridad del dispositivo.' },
      { cal: 'Eliminación de virus', desc: 'Limpieza de malware y apps maliciosas.' },
    ],
  },
  {
    icon: '🛡️',
    titulo: 'Vidrios y accesorios',
    desc: 'Templados, fundas y más para tu equipo',
    detalle: [
      { cal: 'Vidrios templados', desc: 'Protección de pantalla con colocación incluida.' },
      { cal: 'Fundas', desc: 'Variedad de modelos y colores para tu modelo.' },
      { cal: 'Cargadores y cables', desc: 'Accesorios de carga de alta calidad para todos los dispositivos.' },
      { cal: 'Accesorios varios', desc: 'Cables, cargadores, auriculares y más.' },
    ],
  },
]

export default function PublicPage({ onLoginClick }) {
  const [abierto, setAbierto] = useState(null)

  return (
    <div className="public-page">

      {/* Nav */}
      <nav className="public-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="Tech Repair" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 10 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>
            Tech <span className="grad-text">Repair</span>
          </span>
        </div>
        <div className="nav-links">
          <a href="#servicios">Servicios</a>
          <a href="#contacto">Contacto</a>
          <button className="btn btn-ghost btn-sm" onClick={onLoginClick}>Admin</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <img src="/logo.png" alt="Tech Repair" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 24 }} />

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <span className="location-badge">📍 Río Cuarto, Córdoba</span>
          <span className="location-badge">📍 Alejandro Roca, Córdoba</span>
        </div>

        <h1>
          Servicio Técnico<br />
          <span className="grad-text">Especializado</span>
        </h1>
        <p>
          Reparación profesional de celulares, venta de accesorios y equipos.
          Diagnóstico sin cargo y garantía en todos los trabajos.
        </p>

        <div className="pills">
          <div className="pill">✅ Presupuesto sin cargo</div>
          <div className="pill">⚡ Atención rápida</div>
          <div className="pill">🏆 Repuestos de calidad</div>
          <div className="pill">🔒 Seguridad de tu equipo</div>
        </div>
      </div>

      {/* Servicios */}
      <section id="servicios" style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 className="section-title">¿Qué hacemos?</h2>
        <div className="accordion">
          {SERVICIOS.map((s, i) => (
            <div key={i} className={`acord-item${abierto === i ? ' open' : ''}`}>
              <button
                className="acord-header"
                onClick={() => setAbierto(abierto === i ? null : i)}
              >
                <span className="acord-icon">{s.icon}</span>
                <span className="acord-titulo">{s.titulo}</span>
                <span className="acord-desc-inline">{s.desc}</span>
                <span className="acord-chevron">{abierto === i ? '▲' : '▼'}</span>
              </button>
              {abierto === i && (
                <div className="acord-body">
                  {s.detalle.map((d, j) => (
                    <div key={j} className="acord-row">
                      <div className="acord-cal">{d.cal}</div>
                      <div className="acord-caldesc">{d.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 className="section-title">Trabajos reales</h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
          Cada reparación con el cuidado que tu equipo merece
        </p>
        <div className="gallery-grid">
          {[
            { src: '/foto1.jpg', alt: 'Reparación bajo microscopio' },
            { src: '/foto2.jpg', alt: 'Desmontaje y cambio de cámara' },
            { src: '/foto3.jpg', alt: 'Cambio de tapa trasera' },
            { src: '/foto4.jpg', alt: 'Cambio lente de cámara' },
            { src: '/foto5.jpg', alt: 'Módulo nuevo iPhone 17 Pro' },
            { src: '/foto6.jpg', alt: 'Resultado final, tapa trasera' },
          ].map((foto, i) => (
            <div key={i} className="gallery-item">
              <img src={foto.src} alt={foto.alt} loading="lazy" />
              <div className="gallery-overlay"><span>{foto.alt}</span></div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <a href="https://www.instagram.com/techrepair_dsan" className="contact-pill contact-pill-ig" target="_blank" rel="noopener" style={{ display: 'inline-flex' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Ver más en Instagram
          </a>
        </div>
      </section>

      {/* Contacto */}
      <section className="contact-section" id="contacto">
        <h2 className="section-title">Contacto</h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, marginBottom: 28 }}>
          Tecnología en buenas manos
        </p>
        <div className="contact-pills">
          <a href="https://wa.me/5493585743616" className="contact-pill" target="_blank" rel="noopener">
            💬 WhatsApp
          </a>
          <a href="https://www.instagram.com/techrepair_dsan" className="contact-pill contact-pill-ig" target="_blank" rel="noopener">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
          <span className="contact-pill" style={{ cursor: 'default' }}>📍 Río Cuarto, Córdoba</span>
          <span className="contact-pill" style={{ cursor: 'default' }}>📍 Alejandro Roca, Córdoba</span>
        </div>
      </section>

      {/* Mapa */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 className="section-title">¿Dónde estamos?</h2>
        <div className="map-wrap">
          <iframe
            title="Ubicación Río Cuarto"
            src="https://maps.google.com/maps?q=Rio+Cuarto,+Cordoba,+Argentina&output=embed&z=13"
            width="100%"
            height="280"
            style={{ border: 0, borderRadius: 16 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </section>

      {/* Botón flotante WhatsApp */}
      <a
        href="https://wa.me/5493585743616"
        className="wpp-fab"
        target="_blank"
        rel="noopener"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="footer-badges">
        {['Experiencia y confianza', 'Garantía en reparaciones', 'Todas las marcas', 'Tu equipo en buenas manos'].map((v, i) => (
          <div key={i} className="footer-badge">
            <span>✓</span> {v}
          </div>
        ))}
      </footer>

    </div>
  )
}
