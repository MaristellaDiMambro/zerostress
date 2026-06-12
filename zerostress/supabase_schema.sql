-- ═══════════════════════════════════════════════════════
-- ZERO STRESS – Schema Supabase
-- Incolla questo codice nel SQL Editor di Supabase
-- (sezione: SQL Editor → New Query → Run)
-- ═══════════════════════════════════════════════════════

-- Profili utente (estende auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome text,
  classe text default '5ª Meccatronica',
  created_at timestamp with time zone default now()
);

-- Voci del diario emotivo
create table public.diario (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  emozione text not null,
  testo text,
  created_at timestamp with time zone default now()
);

-- Materie del piano studio
create table public.materie (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  nome text not null,
  priorita text default 'media',
  minuti integer default 30,
  completata boolean default false,
  colore text default '#06D6A0',
  created_at timestamp with time zone default now()
);

-- Sessioni Pomodoro completate
create table public.pomodori (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Streak giornaliero
create table public.streak (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  giorni integer default 0,
  ultimo_giorno date
);

-- Preoccupazioni (worry box)
create table public.preoccupazioni (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  testo text not null,
  created_at timestamp with time zone default now()
);

-- ── Row Level Security (ogni utente vede solo i propri dati) ──
alter table public.profiles enable row level security;
alter table public.diario enable row level security;
alter table public.materie enable row level security;
alter table public.pomodori enable row level security;
alter table public.streak enable row level security;
alter table public.preoccupazioni enable row level security;

-- Policy: ogni utente accede solo ai propri dati
create policy "Profilo personale" on public.profiles for all using (auth.uid() = id);
create policy "Diario personale" on public.diario for all using (auth.uid() = user_id);
create policy "Materie personali" on public.materie for all using (auth.uid() = user_id);
create policy "Pomodori personali" on public.pomodori for all using (auth.uid() = user_id);
create policy "Streak personale" on public.streak for all using (auth.uid() = user_id);
create policy "Preoccupazioni personali" on public.preoccupazioni for all using (auth.uid() = user_id);

-- Trigger: crea automaticamente il profilo alla registrazione
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, new.raw_user_meta_data->>'nome');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
