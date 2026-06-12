import { supabase } from './supabase'

// ───────────────────────────────────────────────
// DIARIO EMOTIVO
// ───────────────────────────────────────────────
export async function salvaEmozione(userId, emozione, testo = null) {
  return supabase.from('diario').insert({ user_id: userId, emozione, testo })
}

export async function getDiario(userId, limit = 20) {
  const { data } = await supabase
    .from('diario')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data || []
}

export async function getUltimaEmozione(userId) {
  const { data } = await supabase
    .from('diario')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

// ───────────────────────────────────────────────
// MATERIE / PIANO STUDIO
// ───────────────────────────────────────────────
export async function getMaterie(userId) {
  const { data } = await supabase
    .from('materie')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  return data || []
}

export async function addMateria(userId, materia) {
  return supabase.from('materie').insert({ user_id: userId, ...materia })
}

export async function toggleMateria(id, completata) {
  return supabase.from('materie').update({ completata }).eq('id', id)
}

export async function deleteMateria(id) {
  return supabase.from('materie').delete().eq('id', id)
}

// ───────────────────────────────────────────────
// POMODORI
// ───────────────────────────────────────────────
export async function registraPomodoro(userId) {
  return supabase.from('pomodori').insert({ user_id: userId })
}

export async function getPomodoriCount(userId) {
  const { count } = await supabase
    .from('pomodori')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  return count || 0
}

export async function getPomodoriOggi(userId) {
  const oggi = new Date()
  oggi.setHours(0, 0, 0, 0)
  const { count } = await supabase
    .from('pomodori')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oggi.toISOString())
  return count || 0
}

// ───────────────────────────────────────────────
// STREAK
// ───────────────────────────────────────────────
export async function getStreak(userId) {
  const { data } = await supabase
    .from('streak')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  return data || { giorni: 0, ultimo_giorno: null }
}

export async function aggiornaStreak(userId) {
  const oggi = new Date()
  const oggiStr = oggi.toISOString().split('T')[0]
  const ieri = new Date(oggi)
  ieri.setDate(ieri.getDate() - 1)
  const ieriStr = ieri.toISOString().split('T')[0]

  const corrente = await getStreak(userId)

  if (corrente.ultimo_giorno === oggiStr) {
    return { ...corrente, gia_fatto: true }
  }

  let nuoviGiorni = 1
  if (corrente.ultimo_giorno === ieriStr) {
    nuoviGiorni = (corrente.giorni || 0) + 1
  }

  await supabase.from('streak').upsert({
    user_id: userId,
    giorni: nuoviGiorni,
    ultimo_giorno: oggiStr,
  })

  return { giorni: nuoviGiorni, ultimo_giorno: oggiStr, gia_fatto: false }
}

// ───────────────────────────────────────────────
// PREOCCUPAZIONI (worry box)
// ───────────────────────────────────────────────
export async function getPreoccupazioni(userId) {
  const { data } = await supabase
    .from('preoccupazioni')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function addPreoccupazione(userId, testo) {
  return supabase.from('preoccupazioni').insert({ user_id: userId, testo })
}

export async function deletePreoccupazione(id) {
  return supabase.from('preoccupazioni').delete().eq('id', id)
}

// ───────────────────────────────────────────────
// BADGE — calcolati lato client in base ai dati sopra
// ───────────────────────────────────────────────
export function calcolaBadge({ pomodoriTotali, streakGiorni, materieCompletate, materieTotali }) {
  return [
    { icon: '⭐', name: 'Prima stella', earned: materieCompletate >= 1, desc: 'Completa la prima attività' },
    { icon: '🍅', name: '1° Pomodoro', earned: pomodoriTotali >= 1, desc: 'Completa il primo Pomodoro' },
    { icon: '🔥', name: '3 giorni', earned: streakGiorni >= 3, desc: 'Streak di 3 giorni' },
    { icon: '🧠', name: 'Zen master', earned: pomodoriTotali >= 5, desc: '5 Pomodori completati' },
    { icon: '💪', name: 'Ironman', earned: pomodoriTotali >= 10, desc: '10 Pomodori completati' },
    { icon: '🎓', name: 'Pronto!', earned: materieTotali > 0 && materieCompletate >= materieTotali, desc: 'Completa tutte le materie' },
  ]
}
