import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface ResearchConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RESEARCH_CONDITIONS_TEXT = {
  title: 'Podmínky výzkumu a informovaný souhlas respondenta',
  institution: 'Pedagogická diagnostika • Školní empirické šetření (4. ročník)',
  sections: [
    {
      heading: '1. Účel a povaha výzkumného šetření',
      content:
        'Tento diagnostický nástroj slouží výhradně pro sběr výzkumných dat v rámci studentské seminární práce z předmětu Pedagogická diagnostika. Cílem je empiricky ověřit úroveň vybraných aspektů mediální gramotnosti, práce s informacemi, kybernetické bezpečnosti a kritického využívání výstupů umělé inteligence u studentů 4. ročníků středních škol.',
    },
    {
      heading: '2. Anonymita dat a ochrana soukromí (GDPR)',
      content:
        'Veškeré shromažďované údaje jsou plně anonymizované. V dotazníku se nezaznamenává vaše jméno, příjmení, e-mailová adresa, telefonní číslo ani IP adresa zařízení. Pro identifikaci vyplnění slouží náhodně generovaný alfanumerický kód (např. PEDI-4A-XXXX), který neumožňuje zpětnou identifikaci vaší osoby. Výsledky budou prezentovány pouze v souhrnné, agregované statistické podobě.',
    },
    {
      heading: '3. Dobrovolnost účasti a právo na odstoupení',
      content:
        'Vaše účast ve výzkumném šetření je zcela dobrovolná. Test můžete kdykoliv v jeho průběhu bez udání důvodu přerušit nebo ukončit zavřením okna prohlížeče, aniž by to pro vás mělo jakékoliv negativní důsledky.',
    },
    {
      heading: '4. Průběh a časová náročnost',
      content:
        'Diagnostický test obsahuje 20 věcných položek rozdělených do 5 oblastí: Mediální obsah (5), Ověřování informací (4), Bezpečnost a soukromí (5), Digitální nástroje (3) a Kritické využití AI (3). Orientační doba řešení činí 10 až 15 minut. Po dokončení obdržíte své skóre a šifrovaný kód výsledku pro předání výzkumnému týmu.',
    },
    {
      heading: '5. Zpracování a ukládání odpovědí',
      content:
        'Pro zajištění chodu testu a ochranu před nechtěnou ztrátou dat při obnovení stránky využívá aplikace technické lokální úložiště vašeho prohlížeče (LocalStorage). Nejsou využívány žádné sledovací cookies třetích stran ani reklamní nástroje.',
    },
  ],
};

export const ResearchConditionsModal: React.FC<ResearchConditionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-sm sm:text-base">
              Podmínky výzkumu a informovaný souhlas
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            aria-label="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <strong>Předmět: </strong> Pedagogická diagnostika • Školní rok 2026<br />
            <strong>Cílová skupina: </strong> Studenti 4. ročníku středních škol
          </div>

          {RESEARCH_CONDITIONS_TEXT.sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="font-bold text-slate-900">{sec.heading}</h4>
              <p className="text-slate-600">{sec.content}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Standardy etiky pedagogického výzkumu</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Rozumím a zavřít
          </button>
        </div>
      </div>
    </div>
  );
};
