-- ══════════════════════════════════════════════════════════════
--  TECH REPAIR — Setup de base de datos en Supabase
--  Ejecutá esto en: Supabase → SQL Editor → New query → Run
-- ══════════════════════════════════════════════════════════════

-- Tabla de productos (celulares + accesorios)
CREATE TABLE IF NOT EXISTS productos (
  id          BIGSERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  categoria   TEXT NOT NULL CHECK (categoria IN ('celular', 'accesorio', 'repuesto')),
  subcategoria TEXT,
  precio      INTEGER NOT NULL DEFAULT 0,
  moneda      TEXT NOT NULL DEFAULT 'ARS' CHECK (moneda IN ('ARS', 'USD')),
  costo       INTEGER NOT NULL DEFAULT 0,
  costo_moneda TEXT NOT NULL DEFAULT 'ARS' CHECK (costo_moneda IN ('ARS', 'USD')),
  stock       INTEGER NOT NULL DEFAULT 0,
  min_stock   INTEGER NOT NULL DEFAULT 2,
  imagen_url  TEXT,
  activo      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Migración para instalaciones existentes
ALTER TABLE productos ADD COLUMN IF NOT EXISTS moneda TEXT NOT NULL DEFAULT 'ARS';
ALTER TABLE productos ADD COLUMN IF NOT EXISTS costo INTEGER NOT NULL DEFAULT 0;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS costo_moneda TEXT NOT NULL DEFAULT 'ARS';

-- Bucket público para fotos cargadas desde el panel admin
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "fotos_productos_publicas" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "admin_subir_fotos_productos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "admin_actualizar_fotos_productos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

-- Tabla de servicios de reparación
CREATE TABLE IF NOT EXISTS reparaciones (
  id          BIGSERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  categoria   TEXT NOT NULL DEFAULT 'modulos',
  precio      INTEGER NOT NULL DEFAULT 0,
  moneda      TEXT NOT NULL DEFAULT 'ARS',
  modelo      TEXT,
  calidad     TEXT,
  disponible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reparaciones ADD COLUMN IF NOT EXISTS moneda TEXT NOT NULL DEFAULT 'ARS';
ALTER TABLE reparaciones ADD COLUMN IF NOT EXISTS modelo TEXT;
ALTER TABLE reparaciones ADD COLUMN IF NOT EXISTS calidad TEXT;

CREATE TABLE IF NOT EXISTS trabajos (
  id BIGSERIAL PRIMARY KEY,
  cliente TEXT NOT NULL,
  equipo TEXT,
  reparacion TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  repuesto TEXT,
  precio_cobrado INTEGER NOT NULL DEFAULT 0,
  costo_repuesto INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientes (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT,
  localidad TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ventas (
  id BIGSERIAL PRIMARY KEY,
  categoria TEXT NOT NULL CHECK (categoria IN ('celular', 'accesorio')),
  producto TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  precio_venta INTEGER NOT NULL DEFAULT 0,
  costo_compra INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
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

-- Lista de módulos/pantallas (precios en USD)
INSERT INTO reparaciones (nombre, categoria, modelo, calidad, precio, moneda) VALUES
  ('Módulo / pantalla', 'modulos', 'iPhone SE', 'Black', 48, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 6', 'Original', 35, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 6S Plus', 'Original', 40, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 7', 'Original Gold', 40, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 7 Plus', 'Gold', 45, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 8', 'Black', 48, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 8 Plus', 'Gold', 50, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone X', 'Gold', 55, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone X', 'Black', 75, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone XR', 'Black', 75, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone XS', 'Silver', 60, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone XS', 'Gold', 78, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone XS Max', 'Silver', 60, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone XS Max', 'Gold', 110, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 11', 'Gold', 75, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 11', 'Black', 95, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 11 Pro', 'Silver', 85, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 11 Pro', 'Gold', 110, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 11 Pro Max', 'Silver', 90, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 11 Pro Max', 'Gold', 130, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 12 mini', 'Silver', 130, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 12', 'Silver', 90, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 12', 'Gold', 130, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 12 Pro', 'Silver', 90, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 12 Pro', 'Gold', 130, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 12 Pro Max', 'Silver', 130, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 12 Pro Max', 'Gold', 172, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 13 mini', 'Silver', 0, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 13', 'Silver', 90, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 13', 'Gold', 125, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 13 Pro', 'Silver', 125, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 13 Pro', 'Gold', 165, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 13 Pro Max', 'Silver', 145, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 13 Pro Max', 'Gold', 200, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 14', 'Silver', 105, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 14', 'Gold', 155, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 14 Plus', 'Silver', 120, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 14 Plus', 'Black', 260, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 14 Pro', 'Silver', 155, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 14 Pro', 'Gold', 310, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 14 Pro Max', 'Silver', 135, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 14 Pro Max', 'Gold', 340, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 15', 'Silver', 130, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 15', 'Black', 340, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 15 Plus', 'Silver', 135, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 15 Plus', 'Black', 330, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 15 Pro', 'Silver', 160, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 15 Pro', 'Gold', 370, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 15 Pro Max', 'Silver', 175, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 15 Pro Max', 'Gold', 380, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 16', 'Gold', 320, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 16', 'Black', 480, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 16E', 'Gold', 0, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 16 Pro', 'Gold', 445, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 16 Pro', 'Black', 595, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 16 Pro (copia)', 'Gold', 445, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 16 Pro Max', 'Gold', 510, 'USD'),
  ('Módulo / pantalla', 'modulos', 'iPhone 16 Pro Max', 'Black', 770, 'USD');

-- Lista de baterías (precios en USD)
INSERT INTO reparaciones (nombre, categoria, modelo, calidad, precio, moneda) VALUES
  ('Batería', 'baterias', 'iPhone SE 2020', 'Batería', 50, 'USD'),
  ('Batería', 'baterias', 'iPhone 7 Plus', 'Batería', 40, 'USD'),
  ('Batería', 'baterias', 'iPhone 8', 'Batería', 40, 'USD'),
  ('Batería', 'baterias', 'iPhone 8 Plus', 'Batería', 45, 'USD'),
  ('Batería', 'baterias', 'iPhone X', 'Batería', 55, 'USD'),
  ('Batería', 'baterias', 'iPhone XR', 'Batería', 60, 'USD'),
  ('Batería', 'baterias', 'iPhone XS', 'Batería', 55, 'USD'),
  ('Batería', 'baterias', 'iPhone XS Max', 'Batería', 55, 'USD'),
  ('Batería', 'baterias', 'IPHONE 11', '—', 70, 'USD'),
  ('Batería', 'baterias', 'iPhone 11', 'Batería', 70, 'USD'),
  ('Batería', 'baterias', 'iPhone 11 Pro', 'Batería', 75, 'USD'),
  ('Batería', 'baterias', 'iPhone 11 Pro Max', 'Batería', 75, 'USD'),
  ('Batería', 'baterias', 'iPhone 12 mini', 'Batería', 75, 'USD'),
  ('Batería', 'baterias', 'iPhone 12', 'Batería', 75, 'USD'),
  ('Batería', 'baterias', 'iPhone 12 Pro', 'Batería', 80, 'USD'),
  ('Batería', 'baterias', 'iPhone 12 Pro Max', 'Batería', 85, 'USD'),
  ('Batería', 'baterias', 'iPhone 13', 'Batería', 75, 'USD'),
  ('Batería', 'baterias', 'iPhone 13 Pro', 'Batería', 80, 'USD'),
  ('Batería', 'baterias', 'iPhone 13 Pro Max', 'Batería', 85, 'USD'),
  ('Batería', 'baterias', 'iPhone 14', 'Batería', 85, 'USD'),
  ('Batería', 'baterias', 'iPhone 14 Pro', 'Batería', 85, 'USD'),
  ('Batería', 'baterias', 'iPhone 14 Pro Max', 'Batería', 85, 'USD'),
  ('Batería', 'baterias', 'iPhone 15', 'Batería', 90, 'USD'),
  ('Batería', 'baterias', 'iPhone 15 Pro', 'Batería', 95, 'USD'),
  ('Batería', 'baterias', 'iPhone 15 Pro Max', 'Batería', 95, 'USD');

-- Lista de tapas traseras (precios en USD)
INSERT INTO reparaciones (nombre, categoria, modelo, calidad, precio, moneda) VALUES
  ('Tapa trasera', 'tapas', 'iPhone SE', 'Tapa trasera', 60, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 8', 'Tapa trasera', 60, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone X', 'Tapa trasera', 75, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone XR', 'Tapa trasera', 82, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone XS', 'Tapa trasera', 75, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 11', 'Tapa trasera', 88, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 11 Pro', 'Tapa trasera', 90, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 11 Pro Max', 'Tapa trasera', 90, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 12', 'Tapa trasera', 88, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 12 Pro', 'Tapa trasera', 95, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 12 Pro Max', 'Tapa trasera', 95, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 13 mini', 'Tapa trasera', 90, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 13', 'Tapa trasera', 90, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 13 Pro', 'Tapa trasera', 95, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 13 Pro Max', 'Tapa trasera', 95, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 14', 'Tapa trasera', 110, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 14 Pro', 'Tapa trasera', 110, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 14 Pro Max', 'Tapa trasera', 110, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 15', 'Tapa trasera', 115, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 15 Pro', 'Tapa trasera', 115, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 15 Pro Max', 'Tapa trasera', 115, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 16', 'Tapa trasera', 135, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 16 Pro', 'Tapa trasera', 135, 'USD'),
  ('Tapa trasera', 'tapas', 'iPhone 16 Pro Max', 'Tapa trasera', 135, 'USD');

-- Lista de vidrios de cámara (precios en USD)
INSERT INTO reparaciones (nombre, categoria, modelo, calidad, precio, moneda) VALUES
  ('Vidrio de cámara', 'vidrio_camara', 'iPhone 13 o menor', 'Roto', 30, 'USD'),
  ('Vidrio de cámara', 'vidrio_camara', 'iPhone 13 o menor', 'Sano', 50, 'USD'),
  ('Vidrio de cámara', 'vidrio_camara', 'iPhone 14 o mayor', 'Roto', 45, 'USD'),
  ('Vidrio de cámara', 'vidrio_camara', 'iPhone 14 o mayor', 'Sano', 70, 'USD');

-- ── Seguridad (Row Level Security) ────────────────────────────
-- Lectura pública (cualquiera puede ver productos/servicios)
ALTER TABLE productos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reparaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE trabajos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lectura_publica_productos"
  ON productos FOR SELECT USING (true);

CREATE POLICY "lectura_publica_reparaciones"
  ON reparaciones FOR SELECT USING (true);

CREATE POLICY "admin_select_trabajos" ON trabajos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_insert_trabajos" ON trabajos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_update_trabajos" ON trabajos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete_trabajos" ON trabajos FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_select_clientes" ON clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_clientes" ON clientes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_clientes" ON clientes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_clientes" ON clientes FOR DELETE TO authenticated USING (true);
CREATE POLICY "admin_select_ventas" ON ventas FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_ventas" ON ventas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_ventas" ON ventas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_ventas" ON ventas FOR DELETE TO authenticated USING (true);

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
