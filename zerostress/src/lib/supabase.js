import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────
// ISTRUZIONI: sostituisci questi valori con quelli del tuo
// progetto Supabase (Project Settings → API)
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://TUO-PROGETTO.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TUA-ANON-KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
