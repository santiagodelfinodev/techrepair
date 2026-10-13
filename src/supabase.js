import { createClient } from '@supabase/supabase-js'

// ─── COMPLETÁ CON TUS DATOS DE SUPABASE ───────────────────────────────────────
// 1. Entrá a https://supabase.com → tu proyecto → Settings → API
// 2. Copiá "Project URL" y "anon public key" acá abajo
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
// ──────────────────────────────────────────────────────────────────────────────

// Capture the link type before the auth client consumes its URL fragment.
export const passwordSetupRequested = ['invite', 'recovery'].includes(new URLSearchParams(window.location.hash.slice(1)).get('type'))
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
