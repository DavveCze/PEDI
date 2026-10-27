import { Question, DiagnosticDomain } from '../types/quiz';

export const DOMAIN_QUOTAS: Record<DiagnosticDomain, number> = {
  'Mediální obsah': 5,
  'Ověřování informací': 4,
  'Bezpečnost a soukromí': 5,
  'Digitální nástroje': 3,
  'Kritické využití AI': 3,
};

export const DOMAIN_DESCRIPTIONS: Record<DiagnosticDomain, string> = {
  'Mediální obsah': 'Rozpoznání zavádějícího titulku, reklamy, manipulace obrazem a základních typů mediálního sdělení.',
  'Ověřování informací': 'Práce se zdrojem, kontrola důvěryhodnosti, hledání souvislostí a rozpoznání neověřeného tvrzení.',
  'Bezpečnost a soukromí': 'Bezpečné přihlašování, phishing, citlivé údaje, veřejné nabíjení a bezpečné sdílení souborů.',
  'Digitální nástroje': 'Volba vhodného nástroje, práce se souborem, sdílení a základní orientace v digitálním prostředí.',
  'Kritické využití AI': 'Ověření výstupu AI, rozpoznání chybné informace a uvědomění limitů automaticky vytvořeného obsahu.',
};

/**
 * Standardní reprezentativní výběr 20 diagnostických položek:
 * 5 položek: Mediální obsah
 * 4 položky: Ověřování informací
 * 5 položek: Bezpečnost a soukromí
 * 3 položky: Digitální nástroje
 * 3 položky: Kritické využití AI
 */
export const QUESTIONS_20: Question[] = [
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
    ],
    "domain": "Mediální obsah"
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
    ],
    "domain": "Mediální obsah"
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
    ],
    "domain": "Mediální obsah"
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
    ],
    "domain": "Mediální obsah"
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
    ],
    "domain": "Mediální obsah"
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
    ],
    "domain": "Ověřování informací"
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
    ],
    "domain": "Ověřování informací"
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
    ],
    "domain": "Ověřování informací"
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
    ],
    "domain": "Ověřování informací"
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
    "images": [],
    "domain": "Bezpečnost a soukromí"
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
    ],
    "domain": "Bezpečnost a soukromí"
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
    "images": [],
    "domain": "Bezpečnost a soukromí"
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
    "images": [],
    "domain": "Bezpečnost a soukromí"
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
    "images": [],
    "domain": "Bezpečnost a soukromí"
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
    "images": [],
    "domain": "Digitální nástroje"
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
    ],
    "domain": "Digitální nástroje"
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
    "images": [],
    "domain": "Digitální nástroje"
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
    ],
    "domain": "Kritické využití AI"
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
    ],
    "domain": "Kritické využití AI"
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
    ],
    "domain": "Kritické využití AI"
  }
];
