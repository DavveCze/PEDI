import React, { useState, useRef } from 'react';
import { FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { RespondentInfo } from '../types/quiz';
import { generateAnonymousId } from '../utils/crypto';
import { DOMAIN_QUOTAS } from '../data/questionsData';
import { RESEARCH_CONDITIONS_TEXT } from './ResearchConditionsModal';

interface IntroModalProps {
  onStart: (info: RespondentInfo) => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ onStart }) => {
  const [grade, setGrade] = useState('4. ročník');
  const [group, setGroup] = useState('4.A');
  const [gender, setGender] = useState<RespondentInfo['gender']>('unspecified');
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [respondentId] = useState(() => generateAnonymousId('4A'));

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Detekce do-scrollování podmínek na konec
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 20;
    if (isAtBottom && !hasScrolledToEnd) {
      setHasScrolledToEnd(true);
    }
  };

  const handleMarkAsRead = () => {
    setHasScrolledToEnd(true);
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) return;

    onStart({
      respondentId,
      grade,
      group,
      gender,
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
      startTime: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Seriózní akademické záhlaví */}
        <div className="px-5 sm:px-6 py-5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              Pedagogická diagnostika • Školní šetření
            </span>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-800 text-slate-200 border border-slate-700 rounded-md">
              20 položek
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5">
            Diagnostický test digitální a mediální gramotnosti
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Standardizovaný diagnostický dotazník pro studenty 4. ročníku středních škol v rámci seminární práce.
          </p>
        </div>

        {/* Formulář s obsahem */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Přehled 5 oblastí (střízlivý seznam) */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              Struktura testu (Celkem 20 položek • ~10–12 minut)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {Object.entries(DOMAIN_QUOTAS).map(([domain, count]) => (
                <div key={domain} className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <div className="font-semibold text-slate-800 text-[11px] truncate" title={domain}>{domain}</div>
                  <div className="text-slate-600 font-bold text-xs mt-0.5">{count} {count === 1 ? 'otázka' : count < 5 ? 'otázky' : 'otázek'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Povinné seznámení se s podmínkami výzkumu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                Podmínky výzkumu a etická pravidla (Nutno přečíst)
              </span>
              {!hasScrolledToEnd ? (
                <button
                  type="button"
                  onClick={handleMarkAsRead}
                  className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold underline underline-offset-2"
                >
                  Přeskočit na konec podmínek
                </button>
              ) : (
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Podmínky přečteny
                </span>
              )}
            </div>

            {/* Scrollovatelný box s textem podmínek */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="h-36 sm:h-40 overflow-y-auto p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs text-slate-700 space-y-3 leading-relaxed focus:border-slate-400 focus:outline-none"
              tabIndex={0}
              aria-label="Podmínky výzkumu"
            >
              <div className="font-semibold text-slate-900 border-b border-slate-200 pb-1.5">
                {RESEARCH_CONDITIONS_TEXT.title}
              </div>

              {RESEARCH_CONDITIONS_TEXT.sections.map((sec, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-slate-800">{sec.heading}</div>
                  <p className="text-slate-600 text-[11px] sm:text-xs">{sec.content}</p>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-200 text-emerald-800 font-semibold text-[11px]">
                ✓ Dosáhli jste konce podmínek výzkumu. Níže můžete udělit informovaný souhlas.
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              {hasScrolledToEnd
                ? 'Podmínky byly zobrazeny. Nyní můžete zaškrtnout souhlas níže.'
                : 'Posuňte posuvník v rámečku dolů pro odemčení informovaného souhlasu.'}
            </div>
          </div>

          {/* Zaškrtávací pole informovaného souhlasu */}
          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              hasScrolledToEnd
                ? 'bg-blue-50/50 border-blue-200 text-slate-900'
                : 'bg-slate-100 border-slate-200 text-slate-400 opacity-70'
            }`}
          >
            <label className={`flex items-start gap-2.5 ${hasScrolledToEnd ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
              <input
                type="checkbox"
                disabled={!hasScrolledToEnd}
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-xs leading-snug select-none">
                <strong>Udělení informovaného souhlasu (Povinné):</strong> Potvrzuji, že jsem se seznámil/a s podmínkami výzkumu, rozumím plné anonymitě šetření a souhlasím se zpracováním anonymních výsledků pro účely seminární práce.
              </span>
            </label>
          </div>

          {/* Anonymní demografie */}
          <div className="space-y-2.5 pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Anonymní identifikační údaje
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ročník</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="4. ročník">4. ročník (Maturitní)</option>
                  <option value="3. ročník">3. ročník</option>
                  <option value="Jiné">Jiné zařazení</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Třída / Skupina</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="4.A">Třída 4.A</option>
                  <option value="4.B">Třída 4.B</option>
                  <option value="4.C">Třída 4.C</option>
                  <option value="4.D">Třída 4.D</option>
                  <option value="Skupina 1">Skupina 1</option>
                  <option value="Skupina 2">Skupina 2</option>
                  <option value="Ostatní">Ostatní</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pohlaví (volitelné)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="unspecified">Neuvádět</option>
                  <option value="female">Žena</option>
                  <option value="male">Muž</option>
                  <option value="other">Jiné</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span>Vygenerovaný anonymní kód respondenta:</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 border rounded">
                {respondentId}
              </span>
            </div>
          </div>

          {/* Tlačítko pro spuštění - striktně disabled bez souhlasu */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!consentGiven}
              className={`w-full min-h-[48px] py-3 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                consentGiven
                  ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80'
              }`}
            >
              <span>Zahájit diagnostický test (20 položek)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!consentGiven && (
              <p className="text-center text-[11px] text-amber-800 font-medium mt-1.5">
                Pro zahájení testu je nezbytné přečíst podmínky výzkumu a potvrdit informovaný souhlas.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
