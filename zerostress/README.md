# 🎓 Zero Stress

App web per aiutare gli studenti della 5ª Meccatronica ad affrontare la maturità con meno stress.

---

## 📁 Cosa c'è in questo progetto

```
zerostress/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx          ← Pagina pubblica (presentazione)
│   │   ├── Auth.jsx              ← Login / Registrazione
│   │   └── app/                  ← Area personale (richiede login)
│   │       ├── AppShell.jsx      ← Layout con menu di navigazione
│   │       ├── Onboarding.jsx    ← "Come ti senti oggi?" all'accesso
│   │       ├── Dashboard.jsx     ← Home personalizzata in base all'umore
│   │       ├── Emozioni.jsx      ← Diario emotivo
│   │       ├── AntiAnsia.jsx     ← Respirazione, grounding, worry box
│   │       ├── Studio.jsx        ← Piano di studio
│   │       ├── Pomodoro.jsx      ← Timer Pomodoro
│   │       ├── Relax.jsx         ← Musica, mindfulness, stretching
│   │       └── Progressi.jsx     ← Statistiche, streak, badge
│   └── lib/
│       ├── supabase.js           ← Connessione al database
│       ├── AuthContext.jsx       ← Gestione login
│       ├── ToastContext.jsx      ← Notifiche
│       └── data.js               ← Funzioni per leggere/scrivere dati
└── supabase_schema.sql           ← Schema database da incollare in Supabase
```

---

## 🚀 GUIDA COMPLETA — Dalla A alla Z

Segui questi passaggi **nell'ordine**. In totale richiede circa 30-40 minuti la prima volta.

### ───────────────────────────────────────
### PARTE 1 — Configurare Supabase (database)
### ───────────────────────────────────────

**1.1** Vai su **[supabase.com](https://supabase.com)** → "Start your project" → registrati con Google o email (gratis)

**1.2** Clicca **"New Project"**:
- Nome: `zerostress`
- Database Password: scegli una password sicura e **salvala da qualche parte** (non ti serve dopo, ma tienila)
- Region: `West EU (Ireland)` o `Central EU (Frankfurt)`
- Clicca "Create new project" e aspetta 1-2 minuti

**1.3** Una volta creato il progetto, vai nel menu a sinistra su **SQL Editor**

**1.4** Clicca **"New query"**, poi apri il file `supabase_schema.sql` che trovi in questo progetto, copia **tutto** il contenuto e incollalo nell'editor

**1.5** Clicca **"Run"** (in basso a destra). Dovresti vedere "Success. No rows returned" — significa che le tabelle sono state create correttamente

**1.6** Ora vai su **Project Settings** (icona ingranaggio in basso a sinistra) → **API**

**1.7** Tieni questa pagina aperta, ti servono due valori:
- **Project URL** (es. `https://abcdefgh.supabase.co`)
- **anon public** key (una stringa lunga che comincia con `eyJ...`)

**1.8 (Opzionale ma consigliato)** — Disattiva la confema email per semplificare la registrazione degli studenti:
- Vai su **Authentication** → **Providers** → **Email**
- Disattiva "Confirm email"
- Salva

Senza questo passaggio, ogni studente dovrà confermare l'email prima di poter accedere (controllando la posta).

---

### ───────────────────────────────────────
### PARTE 2 — Caricare il codice su GitHub
### ───────────────────────────────────────

**2.1** Vai su **[github.com](https://github.com)** → registrati (gratis)

**2.2** Clicca il **"+"** in alto a destra → **"New repository"**
- Nome: `zerostress`
- Lascia "Public" o scegli "Private" (entrambi funzionano)
- NON aggiungere README, .gitignore o licenza (li abbiamo già)
- Clicca **"Create repository"**

**2.3** GitHub ti mostrerà dei comandi. Sulla tua cartella del progetto (dove hai scaricato questi file), apri il terminale e scrivi:

```bash
cd percorso/della/cartella/zerostress
git init
git add .
git commit -m "Prima versione di Zero Stress"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/zerostress.git
git push -u origin main
```

> 💡 Se non hai mai usato git, scarica **[GitHub Desktop](https://desktop.github.com/)**: è un'app con interfaccia grafica, niente terminale. Apri la cartella del progetto, clicca "Publish repository".

---

### ───────────────────────────────────────
### PARTE 3 — Pubblicare su Vercel (hosting)
### ───────────────────────────────────────

**3.1** Vai su **[vercel.com](https://vercel.com)** → "Sign up" → scegli **"Continue with GitHub"** (così sono già collegati)

**3.2** Nella dashboard di Vercel, clicca **"Add New..."** → **"Project"**

**3.3** Troverai il repository `zerostress` nella lista → clicca **"Import"**

**3.4** Prima di cliccare "Deploy", apri la sezione **"Environment Variables"** e aggiungi queste due variabili (i valori sono quelli che hai copiato dal punto 1.7):

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | il tuo Project URL di Supabase |
| `VITE_SUPABASE_ANON_KEY` | la tua anon public key di Supabase |

**3.5** Clicca **"Deploy"**. Aspetta 1-2 minuti.

**3.6** 🎉 Fatto! Vercel ti darà un link tipo `zerostress-xyz.vercel.app` — questo è il sito pubblico che puoi condividere con la classe.

---

### ───────────────────────────────────────
### PARTE 4 — Test finale
### ───────────────────────────────────────

1. Apri il link del sito
2. Clicca "Registrati" e crea un account di prova
3. Dovresti entrare nell'area personale e vedere subito "Come ti senti oggi?"
4. Seleziona un'emozione → dovresti arrivare alla Dashboard con i suggerimenti
5. Prova ad aggiungere una materia, avviare il Pomodoro, scrivere nel diario
6. Esci e riaccedi: i dati devono essere ancora lì (sono salvati nel database, non nel browser)

Se tutto funziona, condividi il link con la classe! Ogni studente avrà il proprio account con i propri dati privati (nessuno vede i dati degli altri).

---

## 🛠️ Modifiche future

Per modificare qualcosa (testi, colori, citazioni, ecc.):
1. Modifica i file nella cartella `src/`
2. Fai commit e push su GitHub (`git add . && git commit -m "modifica" && git push`)
3. Vercel aggiornerà automaticamente il sito in 1-2 minuti

Per sviluppo locale (vedere le modifiche prima di pubblicarle):
```bash
npm install
npm run dev
```
Poi apri `http://localhost:5173`. Crea un file `.env.local` (copiando `.env.example`) con le tue chiavi Supabase.

---

## 💰 Costi

Tutto questo setup è **completamente gratuito** per una classe di 20-30 studenti:
- Supabase free tier: 500MB database, 50.000 utenti attivi/mese
- Vercel free tier: traffico illimitato per progetti personali/educativi
- GitHub: gratis per repository pubblici e privati

Se in futuro vuoi un dominio personalizzato (es. `zerostress.it` invece di `.vercel.app`), costa circa 10-15€/anno su Namecheap o simili, e si collega a Vercel in pochi click.

---

## ❓ Problemi comuni

**"Invalid API key" o schermata bianca dopo il deploy**
→ Controlla di aver inserito correttamente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nelle Environment Variables di Vercel, poi vai su Vercel → Deployments → clicca i tre puntini sull'ultimo deploy → "Redeploy"

**Gli studenti non riescono a registrarsi / non arriva l'email di conferma**
→ Vai su Supabase → Authentication → Providers → Email → disattiva "Confirm email" (vedi punto 1.8)

**Voglio vedere i dati di tutti gli studenti**
→ Su Supabase, vai su "Table Editor" nel menu a sinistra: puoi vedere tutte le tabelle (profiles, diario, materie, ecc.) con i dati di ogni utente
