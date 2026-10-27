# PEDI 2026 – Diagnostický nástroj digitální a mediální gramotnosti

Webová aplikace pro empirický sběr anonymizovaných dat k seminární práci v předmětu **Pedagogická diagnostika**.

Aplikace je plně statická, optimalizovaná pro běh na **GitHub Pages**, respektuje standardy **GDPR** a etická pravidla pedagogického výzkumu.

---

## 🎯 Hlavní vlastnosti

1. **Kompletní baterie 46 diagnostických položek**:
   - Vychází z oficiálních úloh a dokumentu `Pedagogická diagnostika.pdf`.
   - Využívá klíč správných odpovědí z `klic_odpovedi_kompletni.csv`.
   - **Modul 1: Mediální gramotnost** (19 položek: manipulace, fotomontáže, clickbait, dezinformace, kognitivní zkreslení, veřejnoprávní média).
   - **Modul 2: IT Fitness & Bezpečnost** (27 položek: phishing, passkeys, juice jacking, sanitizace dat, scareware, cloudová spolupráce).

2. **Interaktivní testovací rozhraní pro studenty**:
   - Responzivní design (mobil, tablet, PC).
   - Interaktivní lightbox / zoom obrázků a screenshotů.
   - Výběr ze 4 polí pro fotku (mřížka), jednoduchý i vícenásobný výběr, binární volby PRAVDA / NEPRAVDA a ZABEZPEČÍ / NEZABEZPEČÍ.
   - Průběžné ukládání odpovědí do `localStorage` (ochrana před nechtěným obnovením stránky).
   - Stopky měřící celkovou dobu řešení pro telemetrii obtížnosti.

3. **Šifrované ukládání & integrita výsledků (Zero-Backend)**:
   - Po dokončení testu se vygeneruje zabezpečený **anonymizovaný token** (`PEDI-RESULT-...`) opatřený **HMAC podpisem (SHA-256)** proti falšování.
   - Student může výsledek:
     - Zkopírovat na jedno kliknutí do schránky (pro odeslání přes MS Teams / e-mail / formulář).
     - Stáhnout jako soubor `.json`.

4. **Výzkumný analytický dashboard (Research Hub)**:
   - Přístupný přímo v hlavičce i patičce aplikace.
   - Autoři seminární práce mohou vložit kódy studentů (jednotlivě i hromadně ze schránky).
   - Automatické dekódování, kontrola pravosti, výpočet průměrů, mediánu a obtížnosti položek (Item Difficulty Index).
   - **Jednoklikový export kompletního anonymního datasetu do CSV** pro Microsoft Excel / SPSS (s UTF-8 BOM).

5. **GDPR a etické standardy**:
   - Informovaný souhlas před spuštěním testu.
   - Žádná jména, žádné e-maily, žádné IP adresy (generování náhodného ID respondenta např. `PEDI-4A-8K3N`).
   - Cookie lišta z `dev-library` (`cookie-consent-cz-gdpr`).

---

## 🚀 Jak aplikaci spustit lokálně

```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev

# Sestavení produkčního buildu (pro dist)
npm run build
```

---

## 🌐 Nasazení na GitHub Pages

Projekt je předem nakonfigurován s relativní cestou `base: './'` ve `vite.config.ts` a obsahuje workflow `.github/workflows/deploy.yml`.

1. Nahrajte projekt do svého GitHub repozitáře:
   ```bash
   git init
   git add .
   git commit -m "feat: Pedagogicka diagnostika web v1.0"
   git remote add origin https://github.com/<vase-uzivatelske-jmeno>/<nazev-repozitare>.git
   git branch -M main
   git push -u origin main
   ```
2. Na GitHubu přejděte do: **Settings** ➔ **Pages**.
3. V sekci **Build and deployment** vyberte:
   - **Source**: `GitHub Actions`
4. Po automatickém proběhnutí akce bude web okamžitě dostupný na adrese:  
   `https://<vase-uzivatelske-jmeno>.github.io/<nazev-repozitare>/`
