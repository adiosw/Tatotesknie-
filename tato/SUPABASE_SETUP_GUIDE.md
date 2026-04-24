# 🗄️ SUPABASE - PEŁNA INSTRUKCJA KROK PO KROKU

---

## 📋 SPIS TREŚCI

1. [Tworzenie konta Supabase](#krok-1-tworzenie-konta)
2. [Tworzenie projektu](#krok-2-tworzenie-projektu)
3. [Pobieranie kluczy API](#krok-3-pobieranie-kluczy-api)
4. [Uruchamianie migracji](#krok-4-uruchamianie-migracji)
5. [Weryfikacja bazy danych](#krok-5-weryfikacja)
6. [Konfiguracja Row Level Security](#krok-6-rls)
7. [Setup Cron Jobs](#krok-7-cron-jobs)
8. [Testing](#krok-8-testing)
9. [Troubleshooting](#troubleshooting)

---

# KROK 1: TWORZENIE KONTA

## A) Rejestracja

1. Idź na: https://supabase.com
2. Kliknij **"Start your project"**
3. Wybierz metodę rejestracji:
   - **GitHub** (zalecane - szybkie)
   - **Email** (tradycyjne)

### Jeśli wybierzesz GitHub:
1. Kliknij "Sign up with GitHub"
2. Zaloguj się do GitHub
3. Autoryzuj Supabase

### Jeśli wybierzesz Email:
1. Wpisz email (np. ripostapp@gmail.com)
2. Wpisz hasło (min. 8 znaków)
3. Kliknij "Sign up"
4. **Zweryfikuj email** (sprawdź skrzynkę)

---

## B) Weryfikacja email

1. Otwórz email od Supabase
2. Kliknij link weryfikacyjny
3. Zostaniesz przekierowany do dashboardu

---

# KROK 2: TWORZENIE PROJEKTU

## A) New Project

1. W dashboardzie kliknij **"New project"**
2. Wypełnij dane:

**Name:** `tatotesknie`
**Database Password:** `MOCNE_HASŁO` (zapisz je!)
**Region:** `Central EU (Frankfurt)` ← WAŻNE dla Polski!
**Pricing Plan:** `Free` ($0/month)

3. Kliknij **"Create new project"**

---

## B) Czekaj na setup (~2 minuty)

Zobaczysz:
- "Setting up project..."
- "Provisioning database..."
- "Ready!"

✅ **Gotowe!** Przejdź do następnego kroku.

---

# KROK 3: POBIERANIE KLUCZY API

## A) Znajdź klucze

1. W dashboardzie projektu (po lewej) kliknij **⚙️ Settings**
2. W menu wybierz **API**
3. Zobaczysz sekcję **"Project API keys"**

---

## B) Skopiuj klucze

### **Project URL:**
```
https://xyz.supabase.co
```
**Gdzie xyz to twój projekt ID**

**Skopiuj całość!** → użyjesz jako `NEXT_PUBLIC_SUPABASE_URL`

---

### **anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Długi string zaczynający się od eyJ...**

**Skopiuj!** → użyjesz jako `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### **service_role key:**
1. Kliknij "Reveal" przy `service_role`
2. **⚠️ UWAGA: To jest SECRET KEY!**
3. Skopiuj

**Użyjesz jako:** `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ NIE UDOSTĘPNIAJ TEGO KLUCZA NIKOMU!**

---

## C) Dodaj do .env.local

Otwórz plik `.env.local` w projekcie:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**WAŻNE:**
- Usuń stary tekst placeholder
- Wklej SWOJE klucze
- Zapisz plik (Ctrl+S)

---

# KROK 4: URUCHAMIANIE MIGRACJI

## A) Otwórz SQL Editor

1. W dashboardzie (po lewej) kliknij **🗄️ SQL Editor**
2. Kliknij **"New query"** (u góry)

---

## B) Skopiuj migration.sql

1. Otwórz plik `migration.sql` z projektu
2. Zaznacz **CAŁĄ** zawartość (Ctrl+A)
3. Skopiuj (Ctrl+C)

---

## C) Wklej i uruchom

1. W SQL Editor wklej (Ctrl+V)
2. Sprawdź czy wszystko się wkleiło (scroll w dół)
3. Kliknij **"Run"** (lub Ctrl+Enter)

---

## D) Sprawdź wynik

Jeśli wszystko OK, zobaczysz:
```
Success. No rows returned
```

**✅ SUKCES!** Migracja przeszła!

---

## E) Jeśli są błędy:

### Błąd: "relation already exists"
**Rozwiązanie:** Tabele już istnieją. Skip ten błąd (to OK).

### Błąd: "syntax error"
**Rozwiązanie:** Sprawdź czy skopiowałeś CAŁĄ migrację (bez obcięcia).

### Błąd: "permission denied"
**Rozwiązanie:** Upewnij się że jesteś owner projektu.

---

# KROK 5: WERYFIKACJA

## A) Sprawdź tabele

1. Kliknij **📊 Table Editor** (po lewej)
2. Powinieneś zobaczyć tabelę: **letters**
3. Kliknij na `letters`

---

## B) Sprawdź kolumny

Powinieneś zobaczyć kolumny:
- ✅ id (uuid)
- ✅ content (text)
- ✅ signature (varchar)
- ✅ years_passed (integer)
- ✅ candles (integer)
- ✅ views (integer)
- ✅ approved (boolean)
- ✅ created_at (timestamp)
- ✅ updated_at (timestamp)
- ✅ **tags (text[])** ← NOWA!
- ✅ **feels_count (integer)** ← NOWA!
- ✅ **is_letter_of_day (boolean)** ← NOWA!
- ✅ **letter_of_day_date (date)** ← NOWA!
- ✅ **premium_until (timestamp)** ← NOWA!
- ✅ **premium_tier (text)** ← NOWA!

**Wszystko jest?** ✅ Super!

---

## C) Sprawdź drugą tabelę

1. W Table Editor powinieneś też zobaczyć: **letter_feels**
2. Kliknij na nią
3. Kolumny:
   - ✅ id (uuid)
   - ✅ letter_id (uuid)
   - ✅ fingerprint (text)
   - ✅ created_at (timestamp)

---

## D) Sprawdź view

1. Kliknij **🗄️ SQL Editor**
2. Wpisz:
```sql
SELECT * FROM stats_summary;
```
3. Kliknij Run

**Powinieneś zobaczyć:**
```
total_letters | total_candles | total_feels | days_active
0             | 0             | 0           | 0
```

**✅ Działa!** View się utworzył.

---

## E) Sprawdź funkcje

1. W SQL Editor wpisz:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('set_letter_of_day', 'increment_feels');
```

2. Kliknij Run

**Powinieneś zobaczyć:**
```
set_letter_of_day
increment_feels
```

**✅ Funkcje utworzone!**

---

# KROK 6: ROW LEVEL SECURITY (RLS)

## Co to jest RLS?

Row Level Security = zabezpieczenie na poziomie wierszy.
Kontroluje **KTO** może **CO** robić z danymi.

---

## A) Sprawdź RLS dla letters

1. Idź do **📊 Table Editor**
2. Kliknij `letters`
3. U góry kliknij **"RLS disabled"** → zmień na **"RLS enabled"**

---

## B) Dodaj policies (zasady)

1. Kliknij **"Add policy"**
2. Wybierz **"Create a policy from scratch"**

### Policy 1: Public read (czytanie zatwierdzonych)
```
Policy name: Public read approved letters
Allowed operation: SELECT
Target roles: public
USING expression: approved = true
```

Kliknij **"Review"** → **"Save policy"**

---

### Policy 2: Public insert (tworzenie listów)
```
Policy name: Public insert letters
Allowed operation: INSERT
Target roles: public
WITH CHECK expression: true
```

Kliknij **"Review"** → **"Save policy"**

---

## C) Sprawdź RLS dla letter_feels

1. Kliknij na tabelę `letter_feels`
2. Enable RLS
3. Dodaj 2 policies:

### Policy 1: Anyone can add feel
```
Policy name: Anyone can add feel
Allowed operation: INSERT
Target roles: public
WITH CHECK expression: true
```

### Policy 2: Anyone can read feels
```
Policy name: Anyone can read feels
Allowed operation: SELECT
Target roles: public
USING expression: true
```

**✅ RLS skonfigurowany!**

---

# KROK 7: CRON JOBS (Opcjonalne - dla Letter of Day)

## Opcja A: Supabase Cron Extension (ZALECANE)

### 1. Włącz pg_cron

1. Idź do **🔌 Database → Extensions**
2. Znajdź `pg_cron`
3. Kliknij **"Enable"**

---

### 2. Dodaj cron job

1. Idź do **🗄️ SQL Editor**
2. Wpisz:

```sql
SELECT cron.schedule(
  'daily-letter-of-day',
  '0 0 * * *',
  $$SELECT set_letter_of_day()$$
);
```

3. Kliknij **Run**

**✅ Cron job utworzony!**

Będzie się wykonywał **codziennie o 00:00 UTC**

---

### 3. Sprawdź czy działa

```sql
SELECT * FROM cron.job;
```

Powinieneś zobaczyć:
```
jobname              | schedule    | command
daily-letter-of-day  | 0 0 * * *   | SELECT set_letter_of_day()
```

---

## Opcja B: Vercel Cron (Alternatywa)

Jeśli nie chcesz używać Supabase cron, użyj Vercel:

1. Plik `vercel.json` już jest gotowy w projekcie
2. Po deploy na Vercel cron się automatycznie aktywuje
3. Sprawdzisz w: Vercel Dashboard → Cron Jobs

---

# KROK 8: TESTING

## A) Test ręczny - dodaj testowy list

1. Idź do **📊 Table Editor → letters**
2. Kliknij **"Insert row"**
3. Wypełnij:
   - **content:** "Test list do Taty"
   - **signature:** "Testowy Syn"
   - **approved:** `true` ← WAŻNE!
   - **candles:** 5
   - (reszta default)
4. Kliknij **"Save"**

---

## B) Test w aplikacji

1. Uruchom dev server:
```bash
npm run dev
```

2. Otwórz: http://localhost:3000

3. Sprawdź:
   - ✅ Liczniki pokazują "1" (jeden list)
   - ✅ Social proof działa
   - ✅ Widzisz swój testowy list (jeśli jest lista)

---

## C) Test API - "Ja też tak czuję"

1. Znajdź ID swojego testowego listu:
   - Table Editor → letters → kliknij wiersz → skopiuj `id`

2. W konsoli przeglądarki (F12) wpisz:
```javascript
fetch('/api/feels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ letterId: 'TWOJ_ID_LISTU' })
})
.then(r => r.json())
.then(console.log)
```

3. Sprawdź odpowiedź:
```json
{ "success": true }
```

4. Sprawdź w bazie:
   - Table Editor → letters → odśwież
   - `feels_count` powinno być `1` ✅

---

## D) Test Letter of Day

1. W SQL Editor:
```sql
SELECT set_letter_of_day();
```

2. Sprawdź:
```sql
SELECT * FROM letters WHERE is_letter_of_day = true;
```

Powinieneś zobaczyć 1 wiersz z `is_letter_of_day = true` ✅

---

# TROUBLESHOOTING

## Problem 1: "Failed to fetch stats"

**Przyczyna:** Błędne klucze API w .env.local

**Rozwiązanie:**
1. Sprawdź czy w `.env.local` są TWOJE klucze
2. Sprawdź czy `NEXT_PUBLIC_SUPABASE_URL` zaczyna się od `https://`
3. Zrestartuj dev server: `npm run dev`

---

## Problem 2: "relation 'letters' does not exist"

**Przyczyna:** Migracja nie przeszła lub przeszła w innym schema

**Rozwiązanie:**
1. Idź do Table Editor → sprawdź czy tabela `letters` istnieje
2. Jeśli nie: uruchom `migration.sql` ponownie
3. Jeśli jest ale w innym schema: uruchom w SQL Editor:
```sql
ALTER TABLE letters SET SCHEMA public;
```

---

## Problem 3: "permission denied for table letters"

**Przyczyna:** RLS blokuje dostęp

**Rozwiązanie:**
1. Sprawdź czy RLS policies są poprawne (KROK 6)
2. Sprawdź czy list ma `approved = true`
3. Tymczasowo wyłącz RLS (tylko na czas testów!):
```sql
ALTER TABLE letters DISABLE ROW LEVEL SECURITY;
```

---

## Problem 4: "increment_feels returned null"

**Przyczyna:** Już "czułeś" ten list z tego urządzenia

**Rozwiązanie:**
- To OK! Function działa dobrze
- Fingerprint zapobiega duplikatom
- Wyczyść `letter_feels`:
```sql
DELETE FROM letter_feels WHERE letter_id = 'TWOJ_ID';
```

---

## Problem 5: Brak danych w stats_summary

**Przyczyna:** Brak zatwierdzonych listów

**Rozwiązanie:**
1. Dodaj testowy list z `approved = true`
2. Sprawdź:
```sql
SELECT * FROM stats_summary;
```

---

## Problem 6: Cron job się nie wykonuje

**Przyczyna:** pg_cron nie włączony lub błąd w SQL

**Rozwiązanie:**
1. Sprawdź czy extension włączony: Database → Extensions
2. Sprawdź logi:
```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

---

# CHECKLIST KOŃCOWY

## Setup:
- [ ] Konto Supabase utworzone
- [ ] Projekt `tatotesknie` utworzony
- [ ] Region: Central EU (Frankfurt)
- [ ] Pricing: Free

## Klucze:
- [ ] NEXT_PUBLIC_SUPABASE_URL skopiowany
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY skopiowany
- [ ] SUPABASE_SERVICE_ROLE_KEY skopiowany
- [ ] Wszystkie w .env.local

## Migracja:
- [ ] migration.sql wykonany w SQL Editor
- [ ] Tabela `letters` istnieje
- [ ] Tabela `letter_feels` istnieje
- [ ] View `stats_summary` działa
- [ ] Funkcje `set_letter_of_day`, `increment_feels` istnieją

## RLS:
- [ ] RLS enabled dla `letters`
- [ ] RLS enabled dla `letter_feels`
- [ ] Policies dodane (2 dla letters, 2 dla feels)

## Cron (opcjonalne):
- [ ] pg_cron extension włączony
- [ ] Cron job utworzony (daily 00:00)
- [ ] Testowany ręcznie (`SELECT set_letter_of_day()`)

## Testing:
- [ ] Testowy list dodany
- [ ] Aplikacja pokazuje dane z bazy
- [ ] API `/api/feels` działa
- [ ] Letter of Day się ustawia

---

# 🎯 GOTOWE!

Teraz masz:
✅ Supabase skonfigurowany
✅ Baza danych gotowa
✅ Wszystkie tabele i funkcje działają
✅ RLS zabezpiecza dane
✅ Cron job ustawiony
✅ Aplikacja połączona z bazą

**Następny krok:** Deploy na Vercel!

---

# DODATKOWE NOTATKI

## Limity Free Plan:

- 500 MB storage (wystarczy na ~100k listów!)
- 2 GB transfer/miesiąc (wystarczy na ~10k użytkowników/miesiąc)
- 50 MB bazy danych (wystarczy!)
- Unlimited API requests

**Spokojnie wystarczy na początek!**

Gdy przekroczysz limity → upgrade do Pro ($25/msc)

---

## Backup bazy:

1. Idź do **Settings → Database**
2. Scroll do **"Database backups"**
3. Free plan: daily backup (ostatnie 7 dni)
4. Możesz ręcznie: **"Download backup"**

**Rób backup raz w tygodniu!**

---

## Monitoring:

1. **Database → Reports** - zobacz usage
2. **Logs Explorer** - sprawdź błędy
3. **API Logs** - zobacz requesty

---

**Made with ❤️ for tatotesknie.pl**
