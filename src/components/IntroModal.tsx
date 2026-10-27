import React, { useState } from 'react';
import {
  Sparkles,
  User,
  School,
  ArrowRight,
  Shuffle,
  ListOrdered,
  Layers,
} from 'lucide-react';
import { RespondentInfo, QuizMode } from '../types/quiz';
import { generateAnonymousId } from '../utils/crypto';
import { DOMAIN_QUOTAS, DOMAIN_DESCRIPTIONS } from '../data/questionsData';

interface IntroModalProps {
  onStart: (info: RespondentInfo) => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ onStart }) => {
  const [grade, setGrade] = useState('4. ročník');
  const [group, setGroup] = useState('4.A');
  const [gender, setGender] = useState<RespondentInfo['gender']>('unspecified');
  const [age] = useState<number>(19);
  const [quizMode, setQuizMode] = useState<QuizMode>('standard_20');
  const [consent, setConsent] = useState(true);
  const [respondentId] = useState(() => generateAnonymousId('4A'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Pro pokračování prosím potvrďte informovaný souhlas s anonymním zpracováním pro účely seminární práce.');
      return;
    }

    onStart({
      respondentId,
      grade,
      group,
      gender,
      age: Number(age) || 19,
      consentGiven: true,
      startTime: new Date().toISOString(),
      quizMode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Horní dekorativní pruh */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-6 sm:px-8 py-8 text-white relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-medium text-indigo-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Pedagogická diagnostika • Školní výzkumný nástroj</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Diagnostický test digitální a mediální gramotnosti
          </h1>
          <p className="mt-2 text-sm text-indigo-100/90 max-w-xl leading-relaxed">
            Standardizovaný výzkumný nástroj pro studenty 4. ročníku. Zkrácená verze pokrývá 5 klíčových oblastí dle metodiky seminární práce.
          </p>
        </div>

        {/* Obsah & Formulář */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Matice 5 diagnostických oblastí */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Skladba položek podle diagnostických oblastí (20 otázek)</span>
              <span className="text-indigo-600">Celkem: 20 položek</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(DOMAIN_QUOTAS).map(([domain, count]) => (
                <div key={domain} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">{domain}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{DOMAIN_DESCRIPTIONS[domain as keyof typeof DOMAIN_DESCRIPTIONS]}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md font-bold bg-indigo-50 text-indigo-700 shrink-0">
                    {count} {count === 1 ? 'položka' : count < 5 ? 'položky' : 'položek'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Volba režimu testu */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Volba testovací baterie
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setQuizMode('standard_20')}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  quizMode === 'standard_20'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-1">
                  <ListOrdered className="w-3.5 h-3.5" />
                  Standardní (20 položek)
                </div>
                <div className="text-[11px] text-slate-500">
                  Reprezentativní výběr 5+4+5+3+3 položek (Doporučeno, ~10 min).
                </div>
              </button>

              <button
                type="button"
                onClick={() => setQuizMode('random_20')}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  quizMode === 'random_20'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-1">
                  <Shuffle className="w-3.5 h-3.5" />
                  Randomizovaný (20 položek)
                </div>
                <div className="text-[11px] text-slate-500">
                  Náhodné losování z banky dle kvót. Zabraňuje opisování.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setQuizMode('full_46')}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  quizMode === 'full_46'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  Plná baterie (46 položek)
                </div>
                <div className="text-[11px] text-slate-500">
                  Kompletní archiv všech diagnostických otázek (~25 min).
                </div>
              </button>
            </div>
          </div>

          {/* Demografické parametry pro výzkum */}
          <div className="space-y-4 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Výzkumné zařazení respondenta (Anonymní)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  Ročník
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                >
                  <option value="4. ročník">4. ročník (Maturitní)</option>
                  <option value="3. ročník">3. ročník</option>
                  <option value="Jiné">Jiné zařazení</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Třída / Skupina
                </label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Pohlaví (volitelné)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                >
                  <option value="unspecified">Neuvádět</option>
                  <option value="female">Žena</option>
                  <option value="male">Muž</option>
                  <option value="other">Jiné</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">Váš anonymní výzkumný kód respondenta:</span>
              <span className="font-mono font-bold text-indigo-700 px-2.5 py-1 bg-white border border-indigo-100 rounded-lg">
                {respondentId}
              </span>
            </div>
          </div>

          {/* Informovaný souhlas */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-amber-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="leading-snug select-none">
                <strong>Informovaný souhlas:</strong> Souhlasím s anonymním zapojením do pedagogického diagnostického šetření v rámci seminární práce. Účast je dobrovolná a test mohu kdykoliv ukončit.
              </span>
            </label>
          </div>

          {/* Akční tlačítko */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Zahájit diagnostický test ({quizMode === 'full_46' ? '46 otázek' : '20 otázek'})</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Orientační doba: {quizMode === 'full_46' ? '25 minut' : '10–12 minut'}. Odpovědi se průběžně ukládají.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
