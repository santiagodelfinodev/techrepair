-- ══════════════════════════════════════════════════════════════
--  TECH REPAIR — Setup de base de datos en Supabase
--  Ejecutá esto en: Supabase → SQL Editor → New query → Run
-- ══════════════════════════════════════════════════════════════

-- Tabla de productos (celulares + accesorios)
CREATE TABLE IF NOT EXISTS productos (
  id          BIGSERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  categoria   TEXT NOT NULL CHECK (categoria IN ('celular', 'accesorio', 'repuesto')),
  precio      INTEGER NOT NULL DEFAULT 0,
  stock       INTEGER NOT NULL DEFAULT 0,
  min_stock   INTEGER NOT NULL DEFAULT 2,
  imagen_url  TEXT,
  activo      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de servicios de reparación
CREATE TABLE IF NOT EXISTS reparaciones (
  id          BIGSERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  precio      INTEGER NOT NULL DEFAULT 0,
  disponible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Datos de ejemplo ───────────────────────────────────────────
INSERT INTO productos (nombre, categoria, precio, stock, min_stock) VALUES
  ('iPhone 13 128GB',              'celular',   450000, 3, 2),
  ('Samsung Galaxy A54',           'celular',   320000, 5, 2),
  ('Auriculares Bluetooth JBL',    'accesorio',  45000, 8, 3),
  ('Funda iPhone 13 Silicone',     'accesorio',   8000,15, 5),
  ('Vidrio Templado Samsung A54',  'accesorio',   5000,20,10);

INSERT INTO reparaciones (nombre, precio) VALUES
  ('Cambio de módulo / pantalla',   35000),
  ('Cambio de batería',             15000),
  ('Pin de carga',                  12000),
  ('Equipo mojado',                 20000),
  ('Software y actualizaciones',     8000),
  ('Vidrio templado',                5000);

-- ── Seguridad (Row Level Security) ────────────────────────────
-- Lectura pública (cualquiera puede ver productos/servicios)
ALTER TABLE productos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reparaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lectura_publica_productos"
  ON productos FOR SELECT USING (true);

CREATE POLICY "lectura_publica_reparaciones"
  ON reparaciones FOR SELECT USING (true);

-- Escritura solo para usuarios autenticados (el admin)
CREATE POLICY "admin_insert_productos"
  ON productos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_update_productos"
  ON productos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete_productos"
  ON productos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "admin_insert_reparaciones"
  ON reparaciones FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_update_reparaciones"
  ON reparaciones FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete_reparaciones"
  ON reparaciones FOR DELETE USING (auth.role() = 'authenticated');
