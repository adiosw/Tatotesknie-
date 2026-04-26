# 🚀 QUICK START - tatotesknie.pl v2.0

## 3 KROKI DO URUCHOMIENIA

---

## ⚡ KROK 1: INSTALACJA (2 minuty)

```bash
# Rozpakuj ZIP
unzip tatotesknie-v2-complete.zip
cd tatotesknie-updated

# Zainstaluj dependencies
npm install
# lub
yarn install
```

---

## 🔑 KROK 2: KONFIGURACJA (5 minut)

### A) Utwórz plik .env.local

```bash
cp .env.example .env.local
```

### B) Wypełnij zmienne środowiskowe

Otwórz `.env.local` i uzupełnij:

```env
# Supabase (WYMAGANE)
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_anon_key
SUPABASE_SERVICE_ROLE_KEY=twoj_service_role_key

# Groq API (dla AI tags - OPCJONALNE)
GROQ_API_KEY=twoj_groq_key

# Monetizacja (OPCJONALNE)
NEXT_PUBLIC_PATRONITE_URL=https://patronite.pl/tatotesknie
NEXT_PUBLIC_BUYMEACOFFEE_URL=https://buymeacoffee.com/tatotesknie

# Site URL
NEXT_PUBLIC_SITE_URL=https://tatotesknie.pl
```

**Gdzie to znaleźć:**
- Supabase: https://app.supabase.com → Settings → API
- Groq: https://console.groq.com → API Keys (FREE!)

### C) Uruchom migrację w Supabase

1. Otwórz https://app.supabase.com
2. Wybierz swój projekt
3. Idź do **SQL Editor**
4. Skopiuj całą zawartość pliku `migration.sql`
5. Wklej i kliknij **RUN**
6. Poczekaj ~5 sekund
7. Sprawdź czy nie ma błędów ✅

---

## 🏃 KROK 3: URUCHOM (30 sekund)

```bash
npm run dev
```

Otwórz http://localhost:3000 🎉

---

## ✅ CHECKLIST WERYFIKACJI

Po uruchomieniu sprawdź czy działa:

- [ ] Strona się ładuje
- [ ] Hero teaser pokazuje losowy list
- [ ] Liczniki pokazują "0" (brak danych) lub liczby
- [ ] Formularz pisania listu działa
- [ ] Możesz wysłać testowy list
- [ ] Brak errorów w console

---

## 🐛 TROUBLESHOOTING

### Problem: "Module not found: Can't resolve 'groq-sdk'"
**Rozwiązanie:**
```bash
npm install groq-sdk
```

### Problem: "Supabase error: relation 'letters' does not exist"
**Rozwiązanie:**
- Nie uruchomiłeś migracji!
- Wróć do KROK 2C i uruchom `migration.sql`

### Problem: "Failed to fetch stats"
**Rozwiązanie:**
- Sprawdź czy NEXT_PUBLIC_SUPABASE_URL jest poprawne
- Sprawdź czy tabela `letters` istnieje
- Sprawdź czy view `stats_summary` istnieje

### Problem: Liczniki pokazują "0" mimo że są listy
**Rozwiązanie:**
- To normalne na początku!
- Wyślij kilka testowych listów
- Zatwierdź je w panelu admina (approved = true)

---

## 📝 NASTĘPNE KROKI

### LOKALNY DEVELOPMENT:

**1. Wyślij testowy list:**
- Scroll do "Napisz swój list"
- Wypełnij formularz
- Wyślij

**2. Zatwierdź list w Supabase:**
- Idź do Table Editor → letters
- Znajdź swój list
- Zmień `approved` na `true`
- Save

**3. Odśwież stronę:**
- Twój list powinien się pojawić!
- Liczniki powinny się zaktualizować

**4. Przetestuj funkcje:**
- [ ] Kliknij "Ja też tak czuję"
- [ ] Kliknij "Podziel się" (pobierze PNG)
- [ ] Kliknij "Odsłuchaj" (polski głos)

---

### PRODUCTION DEPLOYMENT:

**1. Push do GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - tatotesknie v2.0"
git remote add origin https://github.com/twoj-user/tatotesknie.git
git push -u origin main
```

**2. Deploy na Vercel:**
- Idź na https://vercel.com
- New Project → Import Git Repository
- Wybierz repo tatotesknie
- Environment Variables → dodaj wszystkie z .env.local
- Deploy!

**3. Setup Cron (automatyczne w Vercel):**
- Vercel automatycznie wykryje `vercel.json`
- Cron job będzie działał codziennie o północy
- Sprawdź w Vercel Dashboard → Cron Jobs

**4. Konfiguruj domenę:**
- Settings → Domains
- Dodaj tatotesknie.pl
- Zaktualizuj DNS u rejestratora

---

## 🎯 CHECKLIST PRZED GO-LIVE

- [ ] Migration uruchomiona w production Supabase
- [ ] Wszystkie env variables ustawione w Vercel
- [ ] Cron job działa (sprawdź logi)
- [ ] Testowy list został wysłany i zatwierdzony
- [ ] Wszystkie funkcje działają (feels, share, listen)
- [ ] AI tagging działa (jeśli GROQ_API_KEY ustawiony)
- [ ] Patronite/BuyMeACoffee linki działają
- [ ] Instagram @tato_tesknie aktywny
- [ ] Polityka prywatności i regulamin napisane
- [ ] Google Analytics (opcjonalnie) skonfigurowane

---

## 📊 MONITORING

**Po go-live obserwuj:**

- Vercel Analytics (built-in)
- Supabase Dashboard → Database → Performance
- Instagram engagement
- User feedback (DM, komentarze)

---

## 🆘 WSPARCIE

**Jeśli coś nie działa:**

1. Sprawdź console errors (F12 w przeglądarce)
2. Sprawdź Vercel logs (Deployments → Latest → Logs)
3. Sprawdź Supabase logs (Logs Explorer)
4. Sprawdź czy wszystkie env variables są ustawione

**Najczęstsze błędy:**
- Brak migracji → uruchom migration.sql
- Błędne env variables → sprawdź .env.local
- Brak approved letters → zatwierdź w Supabase

---

## 💡 PRO TIPS

**Development:**
- Używaj `npm run dev` do testowania
- Supabase ma auto-refresh - zmiany od razu widoczne
- Web Speech API działa tylko w Chrome/Edge

**Production:**
- Pierwszych kilka listów zatwierdź ręcznie
- Monitoruj spam (rate limiting jest włączony)
- Backup Supabase co tydzień (Settings → Database → Backups)

**Marketing:**
- Publikuj reelse regularnie (użyj generatora!)
- Odpowiadaj na DM na Instagramie
- Pin najlepszy komentarz na reelsach
- Share user stories (za zgodą!)

---

## 🎉 GOTOWE!

Powinieneś mieć teraz:
- ✅ Działającą lokalną wersję
- ✅ Wszystkie komponenty gotowe
- ✅ Bazę danych skonfigurowaną
- ✅ Gotowość do deployment

**Next:** Deploy na Vercel i go live! 🚀

---

## 📞 QUESTIONS?

Sprawdź:
- `README.md` - pełna dokumentacja
- `IMPLEMENTATION_GUIDE.md` - szczegóły techniczne
- `CHANGELOG.md` - co nowego w v2.0

---

**Made with ❤️ for tatotesknie.pl** 🕊️
