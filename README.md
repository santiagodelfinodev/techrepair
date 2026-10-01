# 🔧 Tech Repair — Web App

Página web + panel de administración para gestión de stock y servicios.
Stack: React + Vite · Supabase (base de datos) · Cloudflare Pages (hosting)

---

## PASO 1 — Crear base de datos en Supabase (gratis)

1. Entrá a https://supabase.com y creá una cuenta gratuita
2. Creá un nuevo proyecto (elegí cualquier nombre, por ej. "techrepair")
3. Esperá ~2 min a que el proyecto se inicie
4. Andá a **SQL Editor** (barra izquierda) → **New query**
5. Pegá todo el contenido del archivo `supabase_setup.sql` y hacé clic en **Run**
6. Andá a **Settings → API** y copiá:
   - **Project URL** (algo como https://xyzabc.supabase.co)
   - **anon public** key (token largo)

---

## PASO 2 — Crear usuario admin en Supabase

1. En tu proyecto Supabase → **Authentication → Users → Invite user**
2. Ingresá tu email y una contraseña segura
3. Ese email y contraseña son los que usás para entrar al panel admin

---

## PASO 3 — Subir el código a GitHub

1. Creá una cuenta en https://github.com (si no tenés)
2. Creá un repositorio nuevo (ej. "techrepair")
3. Subí todos estos archivos al repositorio

   Con Git instalado:
   ```bash
   git init
   git add .
   git commit -m "Tech Repair inicial"
   git remote add origin https://github.com/TUUSUARIO/techrepair.git
   git push -u origin main
   ```

---

## PASO 4 — Publicar en Cloudflare Pages (gratis)

1. Entrá a https://pages.cloudflare.com
2. Conectá tu cuenta de GitHub
3. Seleccioná el repositorio "techrepair"
4. Configuración del build:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. En **Environment variables** agregá:
   - `VITE_SUPABASE_URL` = (tu Project URL de Supabase)
   - `VITE_SUPABASE_ANON_KEY` = (tu anon key de Supabase)
6. Hacé clic en **Save and Deploy**

¡Listo! En ~2 minutos tenés la web online con una URL gratis como `techrepair.pages.dev`

---

## Desarrollo local (opcional)

```bash
npm install
cp .env.example .env.local      # Mac/Linux
copy .env.example .env.local    # Windows
# Completá .env.local con tus claves de Supabase
npm run dev
```

---

## Estructura del proyecto

```
techrepair/
├── index.html
├── vite.config.js
├── package.json
├── supabase_setup.sql     ← Ejecutar en Supabase SQL Editor
├── .env.example           ← Copiar como .env.local y completar
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── supabase.js
    └── components/
        ├── PublicPage.jsx
        ├── LoginModal.jsx
        ├── AdminPanel.jsx
        ├── ProductosTab.jsx
        ├── ReparacionesTab.jsx
        └── StockBajoTab.jsx
```

---

## Personalización rápida

- **Número de WhatsApp**: buscá `54TUNUMERO` en `PublicPage.jsx` y reemplazalo
- **Contraseña admin**: se maneja desde Supabase Authentication
- **Logo / colores**: modificar `index.css` (variable `--grad` para el gradiente)
