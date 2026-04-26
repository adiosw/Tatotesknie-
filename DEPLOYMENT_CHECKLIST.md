# 🚀 DEPLOYMENT CHECKLIST - OD ZERA DO LIVE

## Kompletna lista kroków od instalacji do go-live

---

## 📋 FAZA 1: LOKALNE SETUP (30 minut)

### ✅ 1. Rozpakuj projekt
```bash
unzip tatotesknie-v2-FINAL.zip
cd tatotesknie-updated
```

### ✅ 2. Zainstaluj dependencies
```bash
npm install
```

**Sprawdź:** Brak errorów, wszystko zainstalowane.

---

### ✅ 3. Utwórz .env.local
```bash
cp .env.example .env.local
```

Otwórz w edytorze i zostaw **PUSTE** (wypełnisz w następnych krokach).

---

## 📋 FAZA 2: SUPABASE SETUP (15 minut)

**📖 Szczegóły w:** `SUPABASE_SETUP_GUIDE.md`

### ✅ 1. Utwórz konto Supabase
- Idź na: https://supabase.com
- Sign up (GitHub lub Email)

### ✅ 2. Utwórz projekt
- Name: `tatotesknie`
- Password: **ZAPISZ!**
- Region: **Central EU (Frankfurt)**
- Plan: Free

### ✅ 3. Pobierz klucze API
Settings → API:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role → `SUPABASE_SERVICE_ROLE_KEY`

### ✅ 4. Dodaj do .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### ✅ 5. Uruchom migrację
1. SQL Editor → New query
2. Skopiuj CAŁĄ zawartość `migration.sql`
3. Wklej i kliknij Run
4. Sprawdź: "Success. No rows returned" ✅

### ✅ 6. Weryfikacja
Table Editor → powinieneś zobaczyć:
- `letters` (16 kolumn)
- `letter_feels` (4 kolumny)

**Test:**
```sql
SELECT * FROM stats_summary;
```
Powinno zwrócić: 0, 0, 0, 0 ✅

---

## 📋 FAZA 3: GROQ API (5 minut - OPCJONALNE)

**Potrzebne dla:** AI tagging w moderacji

### ✅ 1. Utwórz konto Groq
- Idź na: https://console.groq.com
- Sign up (Google/GitHub)

### ✅ 2. Wygeneruj API key
- Console → API Keys
- Create API Key
- Skopiuj klucz

### ✅ 3. Dodaj do .env.local
```env
GROQ_API_KEY=gsk_...
```

**Jeśli pominiesz:** AI tagging nie będzie działać (ale reszta tak).

---

## 📋 FAZA 4: MONETIZACJA (20 minut - OPCJONALNE)

**📖 Szczegóły w:** `PATRONITE_BUYMEACOFFEE_GUIDE.md`

### ✅ 1. Setup Patronite
1. Zarejestruj się: https://patronite.pl
2. Uzupełnij profil
3. Stwórz 3 tiery (9/19/29 zł)
4. Skopiuj link: `https://patronite.pl/twoj-username`

### ✅ 2. Setup BuyMeACoffee
1. Zarejestruj się: https://buymeacoffee.com
2. Wybierz username
3. Ustaw cenę (10 PLN)
4. Skopiuj link: `https://buymeacoffee.com/twoj-username`

### ✅ 3. Dodaj do .env.local
```env
NEXT_PUBLIC_PATRONITE_URL=https://patronite.pl/tatotesknie
NEXT_PUBLIC_BUYMEACOFFEE_URL=https://buymeacoffee.com/tatotesknie
```

**Jeśli pominiesz:** Przyciski wsparcia będą prowadzić do przykładowych linków.

---

## 📋 FAZA 5: SITE URL (1 minuta)

### ✅ Dodaj do .env.local
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Po deployment zmień na:** `https://tatotesknie.pl`

---

## 📋 FAZA 6: LOKALNY TEST (10 minut)

### ✅ 1. Sprawdź .env.local
Upewnij się że masz:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GROQ_API_KEY=... (opcjonalne)
NEXT_PUBLIC_PATRONITE_URL=...
NEXT_PUBLIC_BUYMEACOFFEE_URL=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### ✅ 2. Uruchom dev server
```bash
npm run dev
```

### ✅ 3. Otwórz http://localhost:3000

Sprawdź:
- [ ] Strona się ładuje
- [ ] Hero teaser pokazuje tekst (lub puste jeśli brak listów)
- [ ] Liczniki pokazują "0"
- [ ] Social proof działa
- [ ] Support Section ma przyciski Patronite/BMC
- [ ] Formularz pisania działa
- [ ] Brak errorów w console (F12)

---

### ✅ 4. Test: Wyślij list

1. Scroll do "Napisz swój list"
2. Wypełnij formularz:
   - Treść: "Test list"
   - Podpis: "Test"
3. Zaznacz zgodę
4. Kliknij "Wyślij w niebo"
5. Powinieneś zobaczyć: "Twój list został wysłany" ✅

---

### ✅ 5. Test: Zatwierdź list w Supabase

1. Idź do Supabase → Table Editor → letters
2. Znajdź swój list (content = "Test list")
3. Zmień `approved` na `true`
4. Kliknij Save

---

### ✅ 6. Test: Zobacz list na stronie

1. Odśwież stronę (F5)
2. Liczniki powinny pokazać: 1 list ✅
3. Jeśli masz LettersList - list powinien się pokazać

**Wszystko działa?** ✅ Gotowe do deployment!

---

## 📋 FAZA 7: GITHUB SETUP (10 minut)

### ✅ 1. Utwórz repo na GitHub

1. Idź na: https://github.com/new
2. Repository name: `tatotesknie`
3. Description: "Miejsce na niewypowiedziane słowa do Taty"
4. **Private** (lub Public - Twoja decyzja)
5. **NIE** zaznaczaj: README, .gitignore, license
6. Kliknij "Create repository"

---

### ✅ 2. Wygeneruj Personal Access Token

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Name: "tatotesknie-upload"
5. Expiration: 90 days
6. Scopes: zaznacz **`repo`** (pełny dostęp)
7. Generate token
8. **SKOPIUJ TOKEN!** (nie zobaczysz go ponownie)

---

### ✅ 3. Upload projektu przez GITHUB_UPLOADER.html

1. Otwórz plik `GITHUB_UPLOADER.html` w przeglądarce
2. Wypełnij:
   - Username: twój GitHub username
   - Repo: `tatotesknie`
   - Token: wklej token
3. **Wybierz folder:** kliknij i wybierz folder `tatotesknie-updated`
4. Poczekaj aż wybierze pliki (~30)
5. Kliknij **"Upload do GitHub"**
6. Poczekaj ~2-5 minut
7. Zobaczysz: "✅ Sukces! Upload X plików"

---

### ✅ 4. Sprawdź na GitHub

1. Odśwież repo: `https://github.com/twoj-user/tatotesknie`
2. Powinieneś zobaczyć wszystkie pliki ✅

---

## 📋 FAZA 8: VERCEL DEPLOYMENT (10 minut)

### ✅ 1. Utwórz konto Vercel

1. Idź na: https://vercel.com
2. **Sign up with GitHub** (zalecane)
3. Autoryzuj Vercel

---

### ✅ 2. Import projektu

1. W Vercel Dashboard kliknij **"Add New"** → **"Project"**
2. **Import Git Repository**
3. Znajdź repo `tatotesknie`
4. Kliknij **"Import"**

---

### ✅ 3. Konfiguracja

**Framework Preset:** Next.js (auto-detect)
**Root Directory:** `./` (default)
**Build Command:** `npm run build` (default)
**Output Directory:** `.next` (default)

**Environment Variables:** Kliknij **"Add"**

Dodaj WSZYSTKIE z .env.local:
```
NEXT_PUBLIC_SUPABASE_URL = https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
GROQ_API_KEY = gsk_...
NEXT_PUBLIC_PATRONITE_URL = https://patronite.pl/...
NEXT_PUBLIC_BUYMEACOFFEE_URL = https://buymeacoffee.com/...
NEXT_PUBLIC_SITE_URL = https://tatotesknie.vercel.app
```

**WAŻNE:** Zmień `NEXT_PUBLIC_SITE_URL` na Vercel URL (lub swoją domenę).

---

### ✅ 4. Deploy!

Kliknij **"Deploy"**

Poczekaj ~2-3 minuty.

Zobaczysz: **"🎉 Congratulations!"**

---

### ✅ 5. Sprawdź live site

Kliknij **"Visit"** lub otwórz: `https://tatotesknie.vercel.app`

Sprawdź:
- [ ] Strona się ładuje
- [ ] Wszystko działa jak lokalnie
- [ ] Formularz wysyła listy
- [ ] Patronite/BMC linki działają

**Działa?** ✅ LIVE! 🎉

---

## 📋 FAZA 9: DOMENA (OPCJONALNE - 15 minut)

### ✅ 1. Kup domenę tatotesknie.pl

**Gdzie kupić:**
- OVH.pl (~40 zł/rok)
- nazwa.pl (~50 zł/rok)
- home.pl (~60 zł/rok)

### ✅ 2. Dodaj domenę w Vercel

1. Vercel Dashboard → twój projekt
2. Settings → Domains
3. Kliknij **"Add"**
4. Wpisz: `tatotesknie.pl`
5. Kliknij **"Add"**

Vercel pokaże instrukcje DNS.

---

### ✅ 3. Skonfiguruj DNS

W panelu rejestratora (OVH/nazwa.pl):

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Zapisz i poczekaj 10-60 minut (propagacja DNS).

---

### ✅ 4. Sprawdź

Otwórz: `https://tatotesknie.pl`

Powinno przekierować na Vercel ✅

---

### ✅ 5. Zaktualizuj .env

Vercel → Settings → Environment Variables:
```
NEXT_PUBLIC_SITE_URL = https://tatotesknie.pl
```

Kliknij **"Save"**

Redeploy: Deployments → Latest → ... → Redeploy

---

## 📋 FAZA 10: CRON JOBS (5 minut)

### ✅ Opcja A: Vercel Cron (automatyczne)

Plik `vercel.json` już jest w projekcie.
Po deployment cron się automatycznie aktywuje.

**Sprawdź:**
Vercel → Settings → Cron Jobs
Powinieneś zobaczyć: `/api/cron/letter-of-day` (daily 00:00)

---

### ✅ Opcja B: Supabase Cron (ręczne)

1. Supabase → Database → Extensions
2. Enable `pg_cron`
3. SQL Editor:
```sql
SELECT cron.schedule(
  'daily-letter-of-day',
  '0 0 * * *',
  $$SELECT set_letter_of_day()$$
);
```

**Sprawdź:**
```sql
SELECT * FROM cron.job;
```

---

## 📋 FAZA 11: FINAL CHECKS (10 minut)

### ✅ 1. Funkcjonalność

Sprawdź na live site:
- [ ] Wysyłanie listów działa
- [ ] Zapalanie świeczek działa
- [ ] "Ja też tak czuję" działa (kliknij 2x - drugi raz powinno nie dodać)
- [ ] "Podziel się" generuje PNG
- [ ] "Odsłuchaj" odtwarza polski głos
- [ ] Letter of Day się pokazuje (jeśli masz zatwierdzony list)
- [ ] Patronite link otwiera profil
- [ ] BuyMeACoffee link otwiera profil

---

### ✅ 2. Mobile

Otwórz na telefonie:
- [ ] Responsywne (dobrze wygląda)
- [ ] FAB pokazuje się po scrollu
- [ ] Formularz działa
- [ ] Wszystkie przyciski klikalne

---

### ✅ 3. Performance

Sprawdź w Google PageSpeed Insights:
- https://pagespeed.web.dev/
- Wpisz: tatotesknie.pl
- Wynik > 80 = ✅ OK

---

### ✅ 4. Security

Sprawdź:
- [ ] Site ma SSL (🔒 w pasku adresu)
- [ ] .env.local NIE jest w repo GitHub (gitignore)
- [ ] Service role key NIE jest w kodzie frontend

---

## 📋 FAZA 12: MONITORING (5 minut)

### ✅ 1. Vercel Analytics

Automatycznie włączone (Free plan).

Sprawdź: Vercel Dashboard → Analytics

---

### ✅ 2. Supabase Dashboard

Monitoruj:
- Database → Reports (usage)
- Logs Explorer (błędy)

---

### ✅ 3. Alerts (opcjonalne)

Ustaw powiadomienia email:
- Vercel → Settings → Notifications
- Supabase → Settings → Alerts

---

## 📋 FAZA 13: MARKETING PREP (10 minut)

### ✅ 1. Instagram

- [ ] Bio zaktualizowane z linkiem
- [ ] Pierwszy post (launch announcement)
- [ ] Stories z linkiem
- [ ] Highlight "O projekcie"

---

### ✅ 2. Content plan

**Tydzień 1:**
- Pon: Reel 5 (licznik) - VIRAL!
- Śr: Reel 1 (list ciemny)
- Pt: Reel 3 (przejścia z CTA)
- Ndz: Stories z supportem

**Używaj:** `KOMPLETNY-PAKIET-WSZYSTKO` (reelse gotowe!)

---

### ✅ 3. Backup content

Przygotuj:
- [ ] 10 cytatów (generator AI)
- [ ] 5 faktów o żałobie
- [ ] 3 testimoniale (jak będą)

---

## 🎯 FINAL CHECKLIST - GO LIVE

### Development:
- [x] Projekt lokalnie działa
- [x] Wszystkie env variables ustawione
- [x] Brak errorów w console

### Supabase:
- [x] Projekt utworzony
- [x] Migracja wykonana
- [x] Tabele istnieją
- [x] RLS skonfigurowany
- [x] Test list wysłany i zatwierdzony

### Deployment:
- [x] Repo na GitHub
- [x] Vercel deployment live
- [x] Wszystkie env vars w Vercel
- [x] Domena skonfigurowana (opcjonalnie)
- [x] SSL działa

### Features:
- [x] Wysyłanie listów działa
- [x] Świeczki działają
- [x] "Feels" działa
- [x] Share to Stories działa
- [x] Listen działa
- [x] Letter of Day ustawia się

### Monetization:
- [x] Patronite skonfigurowany
- [x] BuyMeACoffee skonfigurowany
- [x] Linki działają
- [x] Teksty gotowe

### Marketing:
- [x] Instagram gotowy
- [x] Reelse przygotowane
- [x] Content plan na tydzień

---

## 🚀 LAUNCH DAY!

### Godzina X (np. 19:00 - prime time):

**1. Ostatni check (18:45):**
- Sprawdź czy site działa
- Sprawdź czy baza działa
- Sprawdź linki

**2. Post launch (19:00):**
- Instagram: Post + Reel + Stories
- Facebook: Post z linkiem
- Reddit: r/polska (ostrożnie z self-promo)
- Wykop (jeśli masz konto)

**3. Monitor (19:00-21:00):**
- Odpowiadaj na komentarze
- Sprawdzaj logi (błędy?)
- Obserwuj statystyki

**4. Follow-up (następny dzień):**
- Podsumowanie: ile osób, ile listów
- Dziękuję za wsparcie
- Plan na przyszłość

---

## 💪 JESTEŚ GOTOWY!

Masz teraz:
✅ Wszystkie instrukcje krok po kroku
✅ Supabase setup guide
✅ Patronite/BMC guide
✅ GitHub uploader
✅ Deployment checklist
✅ Marketing plan

**Czas:** ~2-3 godziny total (spokojnie, krok po kroku)

**Efekt:** Działająca strona na production! 🎉

---

**POWODZENIA!** 🚀🕊️💜

**Made with ❤️ for tatotesknie.pl**
