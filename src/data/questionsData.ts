import { Question } from '../types/quiz';

export const QUESTIONS_DATA: Question[] = [
  {
    "id": 1,
    "module": "Mediální gramotnost",
    "theme": "Fotka do časopisu (úprava)",
    "prompt": "Fotky do časopisů se často upravují, aby vypadaly co nejlépe. U této však po editaci zůstala chyba odporující logice. Označte číslo pole, v němž se nachází.",
    "scenario": "Vizuální kontrola retuše a digitální editace fotografie na obálce časopisu.",
    "type": "grid_choice",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correctAnswer": "3",
    "explanation": "Vnímání vizuální manipulace a nelogičností v komerční fotografii (chyba v anatomii / odrazu v poli 3).",
    "images": [
      "./images/img-000.png"
    ]
  },
  {
    "id": 2,
    "module": "Mediální gramotnost",
    "theme": "Typ mediálního sdělení",
    "prompt": "Určete typ tohoto mediálního sdělení na základě zobrazeného materiálu z Královéhradecka:",
    "scenario": "Prohlédněte si záhlaví a strukturu textu (Skupina ČEZ pro média, Fyzikální olympiáda).",
    "type": "single_choice",
    "options": [
      "zpráva na webu informujícím o dění na Královéhradecku",
      "tisková zpráva",
      "Reportáž"
    ],
    "correctAnswer": "tisková zpráva",
    "explanation": "Rozpoznání formátu PR a tiskových zpráv od nezávislé žurnalistiky.",
    "images": [
      "./images/img-002.png"
    ]
  },
  {
    "id": 3,
    "module": "Mediální gramotnost",
    "theme": "Falešný profil na sociálních sítích",
    "prompt": "Který z twitterových příspěvků níže nenapsal předseda hnutí ANO Andrej Babiš, ale někdo, kdo se za něj vydává?",
    "scenario": "Porovnejte vizuální styl, oficiální rukojeti (@handle) a obsah komunikace.",
    "type": "single_choice",
    "options": [
      "tweet 1",
      "tweet 2"
    ],
    "correctAnswer": "tweet 2",
    "explanation": "Ověřování rukojeti (@AndrejBabiis s dvěma i), data vytvoření a stylu komunikace.",
    "images": [
      "./images/img-003.png"
    ]
  },
  {
    "id": 4,
    "module": "Mediální gramotnost",
    "theme": "Zavádějící graf (ceny benzínu)",
    "prompt": "Následující zpráva informuje o vývoji ceny benzínu v červenci 2022. Proč je titulek či graf zavádějící?",
    "scenario": "Graf serveru Vseocenach.cz s titulkem o prudkém poklesu.",
    "type": "single_choice",
    "options": [
      "Vývoj cen by se měl sledovat po měsících.",
      "Cena benzínu souvisí s cenou nafty, která není uvedena.",
      "Měřítko na ose Y je příliš jemné, takže kolísání cen vypadá dramatičtěji než ve skutečnosti."
    ],
    "correctAnswer": "Měřítko na ose Y je příliš jemné, takže kolísání cen vypadá dramatičtěji než ve skutečnosti.",
    "explanation": "Kritická práce s grafickou vizualizací kvantitativních dat (oříznutá osa Y zveličující marginální rozdíly).",
    "images": [
      "./images/img-004.png"
    ]
  },
  {
    "id": 5,
    "module": "Mediální gramotnost",
    "theme": "Falešné citáty",
    "prompt": "Který z těchto dvou citátů Mahátma Gándhí určitě neřekl?",
    "scenario": "Posouzení historické věrohodnosti a anakronismů ve výrocích historických osobností.",
    "type": "single_choice",
    "options": [
      "citát 1",
      "citát 2"
    ],
    "correctAnswer": "citát 2",
    "explanation": "Ověřování historických zdrojů a atribuce výroků (citát 2 zmiňuje notebooky a moderní technologie).",
    "images": [
      "./images/img-005.png"
    ]
  },
  {
    "id": 6,
    "module": "Mediální gramotnost",
    "theme": "Zabezpečení online účtů",
    "prompt": "Která z následujících technik může pomoci zvýšit zabezpečení vašich online účtů?",
    "type": "single_choice",
    "options": [
      "použití stejného hesla pro různé účty, ale s různými čísly na konci",
      "použití dvou kroků při přihlašování, například heslo a kód zaslaný na mobilní telefon",
      "pravidelná změna hesla každých několik měsíců na lehce zapamatovatelné slovo",
      "použití krátkých hesel s kombinací písmen a čísel"
    ],
    "correctAnswer": "použití dvou kroků při přihlašování, například heslo a kód zaslaný na mobilní telefon",
    "explanation": "Znalost principu dvoufaktorové autentizace (2FA/MFA).",
    "images": []
  },
  {
    "id": 7,
    "module": "Mediální gramotnost",
    "theme": "Reverzní vyhledávání obrázků",
    "prompt": "Níže vidíte několik fotek se stejným mužem z různých zdrojů. Na které webové stránce se fotka objevila poprvé?",
    "scenario": "Ověřování původního zdroje fotobanky vs. sekundární použití v magazínech.",
    "type": "single_choice",
    "options": [
      "Shutterstock.com",
      "Flowee.cz",
      "Movember.com",
      "Instagram.com"
    ],
    "correctAnswer": "Shutterstock.com",
    "explanation": "Schopnost ověřit původ obrazového materiálu pomocí reverzního hledání a identifikace fotobankových snímků.",
    "images": [
      "./images/img-008.png",
      "./images/img-009.png",
      "./images/img-006.png"
    ]
  },
  {
    "id": 8,
    "module": "Mediální gramotnost",
    "theme": "Clickbait",
    "prompt": "Který z titulků níže bychom mohli označit pojmem clickbait?",
    "scenario": "Posuďte míru senzacechtivosti a informační mezery v titulcích.",
    "type": "single_choice",
    "options": [
      "1 (Prezident Pavel přijal na Hradě české olympioniky...)",
      "2 (Další tragédie v zámoří. Jágrova bývalého spoluhráče...)",
      "3 (V Česku se o víkendu ochladí, na horách může napadnout sníh)"
    ],
    "correctAnswer": "2 (Další tragédie v zámoří. Jágrova bývalého spoluhráče...)",
    "explanation": "Rozpoznání manipulativních titulků cílících na zvědavost a emoce se zamlčenou klíčovou informací.",
    "images": [
      "./images/img-014.png"
    ]
  },
  {
    "id": 9,
    "module": "Mediální gramotnost",
    "theme": "Nekorespondující popisky",
    "prompt": "Podívejte se na tyto fotky a jejich popisky. Ve dvou případech spolu nekorespondují. V jakých? (Vyberte 2 případy)",
    "type": "multiple_choice",
    "options": [
      "případ 1",
      "případ 2",
      "případ 3"
    ],
    "correctAnswer": [
      "případ 1",
      "případ 3"
    ],
    "explanation": "Rozpoznání vytržení snímku z původního kontextu (dekontextualizace).",
    "images": [
      "./images/img-015.png",
      "./images/img-016.png"
    ]
  },
  {
    "id": 10,
    "module": "Mediální gramotnost",
    "theme": "Fotomontáž zprávy",
    "prompt": "Co na zprávě níže (snímek ze serveru Novinky.cz o letišti) nesedí?",
    "type": "single_choice",
    "options": [
      "Zpráva by měla být v rubrice zahraničí.",
      "Autor uvedl chybně název letiště – Letiště Václava Havla v ČR neexistuje.",
      "Uvádí nás v omyl, že je možné jednou zvolený název letiště změnit.",
      "Tento web ani tato zpráva neexistují, je to fotomontáž."
    ],
    "correctAnswer": "Tento web ani tato zpráva neexistují, je to fotomontáž.",
    "explanation": "Ověření pravosti webového rozhraní a detekce grafického podvrhu.",
    "images": [
      "./images/img-017.png"
    ]
  },
  {
    "id": 11,
    "module": "Mediální gramotnost",
    "theme": "Konfirmační zkreslení",
    "prompt": "CONFIRMATION BIAS, česky KONFIRMAČNÍ ZKRESLENÍ, je tendence jedince:",
    "type": "single_choice",
    "options": [
      "Upřednostňovat informace, které podporují jeho vlastní názor.",
      "Měnit názory podle informace, kterou momentálně zachytil.",
      "Vyhledávat a přesvědčovat jedince s opačnými názory."
    ],
    "correctAnswer": "Upřednostňovat informace, které podporují jeho vlastní názor.",
    "explanation": "Znalost klíčového kognitivního zkreslení ovlivňujícího interpretaci zpráv.",
    "images": []
  },
  {
    "id": 12,
    "module": "Mediální gramotnost",
    "theme": "Koncesionářské poplatky",
    "prompt": "Česká televize a Český rozhlas získávají většinu příjmů z takzvaných koncesionářských poplatků. Co je to za poplatky?",
    "type": "single_choice",
    "options": [
      "Poplatky, které platí provozovatelé komerčních médií, aby podpořili veřejnoprávní média.",
      "Poplatky, které platí každý měsíc všichni občané ČR.",
      "Poplatky, které platí domácnosti a firmy, jež vlastní televizní nebo rozhlasové přijímače."
    ],
    "correctAnswer": "Poplatky, které platí domácnosti a firmy, jež vlastní televizní nebo rozhlasové přijímače.",
    "explanation": "Chápání principu financování a nezávislosti veřejnoprávních médií.",
    "images": []
  },
  {
    "id": 13,
    "module": "Mediální gramotnost",
    "theme": "Syntetický obraz (AI)",
    "prompt": "Kdy a kde byl pořízen tento obrázek zasněžené dálnice se stojícími auty?",
    "scenario": "Příspěvek na sociální síti tvrdící: \"Německo dnešních dnů a elektromobily...\".",
    "type": "single_choice",
    "options": [
      "v Německu v roce 2023, jak tvrdí autor příspěvku",
      "v USA při sněhové bouři v roce 2011",
      "nikde, obrázek je vygenerovaný umělou inteligencí",
      "nikde, obrázek pochází z filmu"
    ],
    "correctAnswer": "nikde, obrázek je vygenerovaný umělou inteligencí",
    "explanation": "Identifikace artefaktů generativních modelů (Midjourney/DALL-E) a ověření zprávy.",
    "images": [
      "./images/img-018.png"
    ]
  },
  {
    "id": 14,
    "module": "Mediální gramotnost",
    "theme": "Product placement",
    "prompt": "Co je to Product placement?",
    "type": "single_choice",
    "options": [
      "kampaň na uvedení nového produktu na trh",
      "samostatná inzertní stránka v novinách a časopisech",
      "Forma skryté reklamy, kdy je inzerovaný produkt umístěn do uměleckého díla.",
      "Rozhraní grafického programu pro tvorbu inzerátů"
    ],
    "correctAnswer": "Forma skryté reklamy, kdy je inzerovaný produkt umístěn do uměleckého díla.",
    "explanation": "Porozumění komerčním a marketingovým formátům v audiovizuální tvorbě.",
    "images": []
  },
  {
    "id": 15,
    "module": "Mediální gramotnost",
    "theme": "Neoznačená reklama",
    "prompt": "V čem je tento příspěvek na Instagramu problematický?",
    "type": "single_choice",
    "options": [
      "Reklama je na Instagramu zakázaná.",
      "Příspěvek je v pořádku.",
      "Propaguje zakázané látky.",
      "Jedná se o neoznačenou reklamu."
    ],
    "correctAnswer": "Jedná se o neoznačenou reklamu.",
    "explanation": "Povědomí o etických a zákonných povinnostech označovat sponzorovaný obsah influencery.",
    "images": [
      "./images/img-019.png"
    ]
  },
  {
    "id": 16,
    "module": "Mediální gramotnost",
    "theme": "Vlastnictví sociálních sítí",
    "prompt": "Kdo vlastní společnost Instagram?",
    "type": "single_choice",
    "options": [
      "Meta (dříve Facebook)",
      "Google",
      "TikTok",
      "Akcionářem je každý uživatel Instagramu."
    ],
    "correctAnswer": "Meta (dříve Facebook)",
    "explanation": "Znalost mediálního vlastnictví a technologických konglomerátů.",
    "images": []
  },
  {
    "id": 17,
    "module": "Mediální gramotnost",
    "theme": "Veřejnoprávní služba",
    "prompt": "V čem se liší veřejnoprávní Česká televize (ČT) od soukromých televizních stanic? (Vyberte všechny správné odpovědi)",
    "type": "multiple_choice",
    "options": [
      "ČT musí informovat pozitivně o krocích vlády.",
      "ČT musí zaměstnávat v redakci zástupce všech menšin žijících v ČR.",
      "ČT musí vytvářet vyváženou nabídku pořadů pro všechny skupiny obyvatel (zástupce menšin, různých náboženských vyznání apod.).",
      "ČT musí přispívat k právnímu povědomí obyvatel ČR a rozvíjet jejich kulturní identitu."
    ],
    "correctAnswer": [
      "ČT musí vytvářet vyváženou nabídku pořadů pro všechny skupiny obyvatel (zástupce menšin, různých náboženských vyznání apod.).",
      "ČT musí přispívat k právnímu povědomí obyvatel ČR a rozvíjet jejich kulturní identitu."
    ],
    "explanation": "Znalost zákona o ČT a role veřejnoprávního vysílání v demokratické společnosti.",
    "images": []
  },
  {
    "id": 18,
    "module": "Mediální gramotnost",
    "theme": "Deepfake",
    "prompt": "Co je to deepfake?",
    "type": "single_choice",
    "options": [
      "Jakákoliv poplašná zpráva, která může vyvolat paniku.",
      "Uživatelé sociálních sítí, kteří mají více než 10 falešných profilů.",
      "Produkce velmi věrohodně vypadajících videí, obrázků nebo zvukových souborů, které jsou vydávány za reálné."
    ],
    "correctAnswer": "Produkce velmi věrohodně vypadajících videí, obrázků nebo zvukových souborů, které jsou vydávány za reálné.",
    "explanation": "Povědomí o rizicích syntetických audiovizuálních médií.",
    "images": []
  },
  {
    "id": 19,
    "module": "Mediální gramotnost",
    "theme": "Klamavá nabídka / Phishing",
    "prompt": "Některým uživatelům aplikací WhatsApp a Messenger přišla zpráva o kupónech v Albertu. Jak byste sdělení na obrázku označili?",
    "type": "single_choice",
    "options": [
      "marketingová akce supermarketu",
      "clickbaitový titulek",
      "podvodná zpráva (tzv. phishing)",
      "klamavá reklama"
    ],
    "correctAnswer": "podvodná zpráva (tzv. phishing)",
    "explanation": "Ochrana před sociálním inženýrstvím a podvodnými zprávami šířenými přes messengery.",
    "images": [
      "./images/img-023.png"
    ]
  },
  {
    "id": 20,
    "module": "IT Fitness",
    "theme": "Trasa vlaku",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Na mapě č. 2 na zakreslené trase vlaku EC 130 Bathory jsou zobrazena i města, ve kterých vlak nezastavuje.\"",
    "scenario": "Monika nechala AI vygenerovat schématickou mapu tras vlaků IC 112 Silesia, RJ 272 Metropolitan, EC 102 Polonia a EC 130 Bathory.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "PRAVDA",
    "explanation": "Kritické posouzení AI generované schématické mapy vůči reálnému jízdnímu řádu.",
    "images": [
      "./images/img-024.png"
    ]
  },
  {
    "id": 21,
    "module": "IT Fitness",
    "theme": "Trasa vlaku",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Na mapě č. 2 lze vidět celou trasu vlaku EC 130 Bathory.\"",
    "scenario": "Prověřte počáteční a koncovou stanici vlaku EC 130 Bathory na schématu.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Ověření úplnosti dat (spoj vede až do Polska, zobrazen je jen fragment).",
    "images": [
      "./images/img-024.png"
    ]
  },
  {
    "id": 22,
    "module": "IT Fitness",
    "theme": "Trasa vlaku",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Mapa č. 2 neodpovídá skutečné geografické orientaci – například Budapešť se na skutečné mapě nachází spíše jihovýchodním směrem od Bratislavy.\"",
    "scenario": "Posouzení geografických relací a halucinací generativních modelů.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "PRAVDA",
    "explanation": "Detekce prostorových chyb a halucinací generativních modelů.",
    "images": [
      "./images/img-024.png"
    ]
  },
  {
    "id": 23,
    "module": "IT Fitness",
    "theme": "Dezinformace (EDMO)",
    "prompt": "Na snímku číslo 20 prezentace o dezinformacích jsou uvedeny národní zdroje pro ověřování faktů. Který zdroj je uveden pro Chorvatsko?",
    "scenario": "Prezentace \"How to spot and fight disinformation\" sítě EDMO.",
    "type": "single_choice",
    "options": [
      "ADMO",
      "CEDMO",
      "MEDDMO",
      "HDMO"
    ],
    "correctAnswer": "ADMO",
    "explanation": "Schopnost dohledat evropské fact-checkingové sítě (Adria Digital Media Observatory).",
    "images": [
      "./images/img-027.png"
    ]
  },
  {
    "id": 24,
    "module": "IT Fitness",
    "theme": "WiFi4EU",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Mobilní aplikace umožňuje přístup k 7 200 hotspotům.\"",
    "scenario": "Oficiální portál iniciativy Evropské unie WiFi4EU.",
    "externalUrl": "https://hadea.ec.europa.eu/programmes/connecting-europe-facility/wifi4eu_en",
    "externalUrlLabel": "Otevřít stránku WiFi4EU",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Rozlišení počtu zapojených obcí (7 200) od počtu hotspotů (>90 000).",
    "images": []
  },
  {
    "id": 25,
    "module": "IT Fitness",
    "theme": "WiFi4EU",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"PDF s nejčastějšími dotazy ve francouzštině má 36 stran.\"",
    "scenario": "Hledání a ověřování v sekci FAQ v různých jazykových mutacích.",
    "externalUrl": "https://hadea.ec.europa.eu/programmes/connecting-europe-facility/wifi4eu_en",
    "externalUrlLabel": "Otevřít stránku WiFi4EU",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "PRAVDA",
    "explanation": "Přesné vyhledávání v dokumentových metadatech na portálu EU.",
    "images": []
  },
  {
    "id": 26,
    "module": "IT Fitness",
    "theme": "WiFi4EU",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Iniciativa WiFi4EU poskytuje občanům bezplatný přístup k Wi-Fi na veřejných místech.\"",
    "scenario": "Čtení s porozuměním z oficiálního webu instituce.",
    "externalUrl": "https://hadea.ec.europa.eu/programmes/connecting-europe-facility/wifi4eu_en",
    "externalUrlLabel": "Otevřít stránku WiFi4EU",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "PRAVDA",
    "explanation": "Čtení s porozuměním z oficiálního webu instituce.",
    "images": []
  },
  {
    "id": 27,
    "module": "IT Fitness",
    "theme": "Citlivé údaje",
    "prompt": "Zabezpečí data? \"Ve sloupci s citlivými údaji v tabulkovém procesoru nastavíme bílou barvu výplně a bílou barvu písma. Tabulku uložíme a pošleme ubytovacímu zařízení e-mailem.\"",
    "scenario": "Odesílání citlivých osobních údajů třetím stranám.",
    "type": "secure_unsecure",
    "options": [
      "ZABEZPEČÍ",
      "NEZABEZPEČÍ"
    ],
    "correctAnswer": "NEZABEZPEČÍ",
    "explanation": "Rozlišení vizuálního maskování a skutečného odstranění dat (data v buňkách stále existují).",
    "images": []
  },
  {
    "id": 28,
    "module": "IT Fitness",
    "theme": "Citlivé údaje",
    "prompt": "Zabezpečí data? \"Ve sloupci s citlivými údaji v tabulkovém procesoru nastavíme černou barvu výplně a černou barvu písma. Tabulku uložíme do PDF a pošleme ubytovacímu zařízení e-mailem.\"",
    "scenario": "Export maskované tabulky do needitovatelného formátu PDF.",
    "type": "secure_unsecure",
    "options": [
      "ZABEZPEČÍ",
      "NEZABEZPEČÍ"
    ],
    "correctAnswer": "NEZABEZPEČÍ",
    "explanation": "Povědomí o zachování textové vrstvy v needitovatelných formátech (PDF text lze zkopírovat).",
    "images": []
  },
  {
    "id": 29,
    "module": "IT Fitness",
    "theme": "Citlivé údaje",
    "prompt": "Zabezpečí data? \"Ve sloupci s citlivými údaji hodnoty v tabulkovém procesoru vymažeme. Tabulku uložíme a pošleme ubytovacímu zařízení e-mailem jako soubor v příloze.\"",
    "scenario": "Fyzické vymazání obsahu buněk před exportem.",
    "type": "secure_unsecure",
    "options": [
      "ZABEZPEČÍ",
      "NEZABEZPEČÍ"
    ],
    "correctAnswer": "ZABEZPEČÍ",
    "explanation": "Korektní sanitizace a anonymizace dat před distribucí třetím stranám.",
    "images": []
  },
  {
    "id": 30,
    "module": "IT Fitness",
    "theme": "Nastavení prohlížeče",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Markovi se zobrazilo legitimní bezpečnostní upozornění o napadení počítače.\"",
    "scenario": "Marek narazil na podvodné hlášení v prohlížeči (scareware) a měnil nastavení certifikátů a HTTPS.",
    "externalUrl": "https://www.microsoft.com/cs-cz/edge/features/scareware-blocker?form=MT0160",
    "externalUrlLabel": "Otevřít článek o Scareware blocker",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Rozpoznání techniky scareware (falešné vyskakovací okno imitující systémový antivirus).",
    "images": [
      "./images/img-029.png"
    ]
  },
  {
    "id": 31,
    "module": "IT Fitness",
    "theme": "Přístupový klíč",
    "prompt": "Které tvrzení o přístupovém klíči (Passkey) je na základě článku pravdivé?",
    "scenario": "Bezheslové přihlašování a moderní FIDO standardy.",
    "externalUrl": "https://support.google.com/accounts/answer/13548313?hl=cs",
    "externalUrlLabel": "Nápověda Google k přístupovým klíčům",
    "type": "single_choice",
    "options": [
      "Biometrické údaje pro účely odemknutí otiskem prstu se sdílejí s Googlem.",
      "Přístupový klíč je odolnější vůči phishingu než heslo.",
      "Heslo je bezpečnější než přístupový klíč.",
      "Pro použití přístupového klíče se musí vypnout zámek obrazovky."
    ],
    "correctAnswer": "Přístupový klíč je odolnější vůči phishingu než heslo.",
    "explanation": "Znalost moderní bezheslové autentizace dle FIDO2/WebAuthn standardu.",
    "images": []
  },
  {
    "id": 32,
    "module": "IT Fitness",
    "theme": "USB nabíjení (Juice jacking)",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Chceme-li předejít riziku, stačí zůstat po celou dobu nabíjení u veřejné USB nabíječky.\"",
    "scenario": "Článek o rizicích veřejných USB dobíjecích terminálů a juice jackingu.",
    "externalUrl": "https://mobilmania.zive.cz/clanky/vypada-jako-pomocnik-ale-muze-to-byt-past-nepodcenujte-riziko-verejnych-usb-nabijecek/sc-3-a-1364216/default.aspx",
    "externalUrlLabel": "Přečíst článek o USB nabíječkách",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Pochopení mechaniky přenosu dat po USB pinech nezávisle na fyzické přítomnosti.",
    "images": []
  },
  {
    "id": 33,
    "module": "IT Fitness",
    "theme": "USB nabíjení (Juice jacking)",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Bezdrátové způsoby nabíjení na veřejných bezdrátových nabíječkách jsou vždy bezpečné a nemusíme se obávat žádného rizika.\"",
    "scenario": "Rizika bezdrátového nabíjení (indukční podložky, přehřátí, firmware).",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Kritický pohled na hardwarová a přepěťová rizika veřejné infrastruktury.",
    "images": []
  },
  {
    "id": 34,
    "module": "IT Fitness",
    "theme": "USB nabíjení (Juice jacking)",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Pomocí metody juice jacking může útočník do mobilního telefonu přenést také škodlivý software.\"",
    "scenario": "Princip zneužití datového kanálu USB rozhraní.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "PRAVDA",
    "explanation": "Znalost kyberbezpečnostních rizik veřejných dobíjecích terminálů.",
    "images": []
  },
  {
    "id": 35,
    "module": "IT Fitness",
    "theme": "Informační leták (Docx)",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Nadpis COMPARING je mimo tabulky a má nastavené kapitálky.\"",
    "scenario": "V textovém procesoru vznikl informační leták comparingAI_02.docx.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "PRAVDA",
    "explanation": "Typografická a strukturální analýza dokumentu v textovém editoru.",
    "images": []
  },
  {
    "id": 36,
    "module": "IT Fitness",
    "theme": "Informační leták (Docx)",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Ve třetím sloupci se nachází odrážkový seznam (vytvořený příslušným nástrojem).\"",
    "scenario": "Rozbor formátování seznamů vs. ručně psaných odrážek.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Rozlišení systémového seznamu od ručně vepsaných symbolů/znaků.",
    "images": []
  },
  {
    "id": 37,
    "module": "IT Fitness",
    "theme": "Informační leták (Docx)",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Nadpis „Summary“ je ve všech sloupcích zarovnaný doleva.\"",
    "scenario": "Zarovnání textových prvků ve sloupcové sazbě.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Ověření formátování odstavců v tabulce.",
    "images": []
  },
  {
    "id": 38,
    "module": "IT Fitness",
    "theme": "Práce s databází (Netflix I.)",
    "prompt": "Vytvořte žebříček pouze z titulů vydaných v roce 2020, seřaďte jej sestupně podle hodnocení na webu IMDb. Na kterém místě se v žebříčku umístil titul Lenox Hill?",
    "scenario": "Datový soubor Netflix.xlsx z Kaggle.com (filmy a pořady, release year, imdb_score).",
    "type": "single_choice",
    "options": [
      "na druhém",
      "na třetím",
      "na čtvrtém",
      "na pátém"
    ],
    "correctAnswer": "na třetím",
    "explanation": "Filtrování a víceúrovňové řazení v tabulkovém procesoru.",
    "images": []
  },
  {
    "id": 39,
    "module": "IT Fitness",
    "theme": "Práce s databází (Netflix II.)",
    "prompt": "Určete na základě dat z tabulky Netflix, kolik obsahuje titulů vydaných v roce 2005.",
    "scenario": "Agregace a podmíněné počítání záznamů splňujících rok 2005.",
    "type": "single_choice",
    "options": [
      "29",
      "31",
      "41",
      "44"
    ],
    "correctAnswer": "31",
    "explanation": "Agregace a počítání záznamů splňujících kritérium (funkce COUNTIF).",
    "images": []
  },
  {
    "id": 40,
    "module": "IT Fitness",
    "theme": "Sdílení v cloudu vs Příloha",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Pokud Lea pošle soubor jako sdílený odkaz s právem úpravy, příjemce může změnit obsah tabulky a tyto změny se projeví i u Ley.\"",
    "scenario": "Infografika porovnání odeslání souboru jako přílohy vs. sdíleného cloudového odkazu.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "PRAVDA",
    "explanation": "Porozumění kolaborativní editaci v reálném čase.",
    "images": [
      "./images/img-038.png"
    ]
  },
  {
    "id": 41,
    "module": "IT Fitness",
    "theme": "Sdílení v cloudu vs Příloha",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Pokud Lea pošle soubor jako sdílený odkaz a zruší k němu přístup pro příjemce, příjemce si ho může stále stáhnout.\"",
    "scenario": "Správa a odebrání přístupových práv v cloudovém úložišti.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Řízení přístupových práv v cloudových úložištích.",
    "images": [
      "./images/img-038.png"
    ]
  },
  {
    "id": 42,
    "module": "IT Fitness",
    "theme": "Sdílení v cloudu vs Příloha",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Pokud Lea pošle soubor jako přílohu, příjemce může vidět všechny předchozí verze souboru, pokud je Lea nevymazala.\"",
    "scenario": "Verzování a historie změn u e-mailové přílohy vs. cloudového dokumentu.",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Rozdíl mezi statickým exportem v příloze a cloudovým verzováním.",
    "images": [
      "./images/img-038.png"
    ]
  },
  {
    "id": 43,
    "module": "IT Fitness",
    "theme": "Sociální sítě",
    "prompt": "Jana si hledala na Instagramu profily zaměřené na vědecké informace. Který z profilů má nejvíce příspěvků?",
    "scenario": "Porovnání vědeckých profilů: sciencemuseum, asapscience, mythbusters, explorist.",
    "type": "single_choice",
    "options": [
      "sciencemuseum",
      "asapscience",
      "mythbusters",
      "explorist"
    ],
    "correctAnswer": "sciencemuseum",
    "explanation": "Vyhledání a porovnání metrik na veřejných sociálních profilech.",
    "images": []
  },
  {
    "id": 44,
    "module": "IT Fitness",
    "theme": "Sledování změn (Trip.docx)",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"V programu druhého dne, čas návštěvy «Louvre Museum» z «2 hours» na «3 hours» upravil Martin.\"",
    "scenario": "Jack, Jana a Martin spolupracují na přípravě výletu do Paříže v dokumentu Trip.docx s funkcí sledování změn.",
    "externalUrl": "https://docs.google.com/document/d/1FbcsMVMzeTEmj59Snmv_Ph9v10Z_pWHc/edit",
    "externalUrlLabel": "Otevřít dokument Trip.docx na Google Drive",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Identifikace autora úpravy ve sledování revizí.",
    "images": []
  },
  {
    "id": 45,
    "module": "IT Fitness",
    "theme": "Sledování změn (Trip.docx)",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"V programu třetího dne, k textu «Musée d’Orsay» všichni tři napsali komentář nebo odpověděli na komentář.\"",
    "scenario": "Revize komentářových vláken v dokumentu Trip.docx.",
    "externalUrl": "https://docs.google.com/document/d/1FbcsMVMzeTEmj59Snmv_Ph9v10Z_pWHc/edit",
    "externalUrlLabel": "Otevřít dokument Trip.docx na Google Drive",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "NEPRAVDA",
    "explanation": "Audit komentářových vláken v revizním nástroji.",
    "images": []
  },
  {
    "id": 46,
    "module": "IT Fitness",
    "theme": "Sledování změn (Trip.docx)",
    "prompt": "Rozhodněte o pravdivosti tvrzení: \"Na komentář k obědu v programu prvního dne odpověděl Jack až následující den.\"",
    "scenario": "Analýza časových razítek v komentářích v dokumentu Trip.docx.",
    "externalUrl": "https://docs.google.com/document/d/1FbcsMVMzeTEmj59Snmv_Ph9v10Z_pWHc/edit",
    "externalUrlLabel": "Otevřít dokument Trip.docx na Google Drive",
    "type": "true_false",
    "options": [
      "PRAVDA",
      "NEPRAVDA"
    ],
    "correctAnswer": "PRAVDA",
    "explanation": "Analýza časových razítek v revizích dokumentu.",
    "images": []
  }
];
