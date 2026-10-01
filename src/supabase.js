import { createClient } from '@supabase/supabase-js'

// ─── COMPLETÁ CON TUS DATOS DE SUPABASE ───────────────────────────────────────
// 1. Entrá a https://supabase.com → tu proyecto → Settings → API
// 2. Copiá "Project URL" y "anon public key" acá abajo
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
// ──────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
