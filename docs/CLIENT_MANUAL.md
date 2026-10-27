# Uživatelský manuál: Diagnostický web PEDI 2026

Tento manuál slouží vyučujícím a autorům seminární práce z **Pedagogické diagnostiky** jako průvodce distribucí testu a zpracováním výsledků.

---

## 1. Jak poslat test studentům 4. ročníku

1. Pošlete studentům odkaz na váš GitHub Pages web (např. `https://david.github.io/PEDI/`).
2. Student otevře web ve svém prohlížeči (funguje na počítači, tabletu i mobilu).
3. V úvodním okně:
   - Zvolí svou třídu (např. **4.A**, **4.B**) a volitelně pohlaví.
   - Přečte si poučení o anonymitě a potvrdí informovaný souhlas.
   - Vygeneruje se mu náhodné anonymní ID (např. `PEDI-4A-3K8J`).
   - Klikne na **Zahájit diagnostický test**.

---

## 2. Průběh testování

- Test obsahuje **46 položek** rozdělených do dvou částí:
  1. *Mediální gramotnost* (otázky 1–19)
  2. *IT Fitness & Bezpečnost* (otázky 20–46)
- Každá otázka má přehledné možnosti. Na obrázky lze kliknout pro zvětšení do detailu.
- Student může libovolně přeskakovat pomocí spodní číselné navigace a vracet se k rozpracovaným otázkám.
- Odpovědi se automaticky ukládají do paměti prohlížeče; při nechtěném zavření záložky se nic neztratí.

---

## 3. Odevzdání výsledků studentem

Po kliknutí na **Dokončit a vyhodnotit test**:
1. Studentovi se zobrazí jeho celkové skóre a diagnostické slovní hodnocení.
2. V tmavě modrém boxu se vygeneruje **Šifrovaný kód výsledku** (začíná na `PEDI-RESULT-...`).
3. Student klikne na tlačítko:
   - **„Kopírovat kód do schránky“** a kód vám pošle (do chatu v Teams, Google Classroom, e-mailem nebo vloží do společného dotazníku).
   - Volitelně může kliknout na **„Stáhnout soubor (.json)“** pro zálohu.

---

## 4. Jak vyhodnotit a zpracovat data pro seminární práci

1. Otevřete web a v pravém horním rohu klikněte na tlačítko **Výzkumný panel** (nebo v patičce na *Učitelský & Výzkumný dashboard*).
2. Do textového pole vložte kódy, které vám studenti poslali (můžete vložit 20 i 50 kódů najednou pod sebe).
3. Klikněte na **„Dekódovat a přidat do databáze“**.
4. Systém:
   - Zkontroluje integritu každého kódu (ověří, že student kód neupravil).
   - Okamžitě spočítá: **velikost vzorku (N)**, **průměrné skóre**, **úspěšnost v %** a **rozpad na Mediální gramotnost vs IT Fitness**.
   - Zobrazí tabulku jednotlivých anonymních respondentů.
   - Vypočítá index obtížnosti jednotlivých položek (pro psychometrickou analýzu v práci).
5. Klikněte na zelené tlačítko **„Exportovat do CSV (Excel)“**:
   - Stáhne se soubor `PEDI_vyzkumna_data_....csv` s českým kódováním UTF-8 BOM, který můžete přímo otevřít v Excelu nebo statistickém programu pro tvorbu grafů do seminárky!
