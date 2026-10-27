import React from 'react';
import { GraduationCap, Clock, Award, Database } from 'lucide-react';
import { DiagnosticDomain } from '../types/quiz';

interface QuizHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  activeDomain: 'All' | DiagnosticDomain;
  onSelectDomain: (domain: 'All' | DiagnosticDomain) => void;
  secondsElapsed: number;
  onOpenResearchHub: () => void;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  activeDomain,
  onSelectDomain,
  secondsElapsed,
  onOpenResearchHub,
}) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const domains: DiagnosticDomain[] = [
    'Mediální obsah',
    'Ověřování informací',
    'Bezpečnost a soukromí',
    'Digitální nástroje',
    'Kritické využití AI',
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        {/* Horní řádek */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  PEDI 2026
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md">
                  4. ročník ({totalQuestions} úloh)
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Diagnostika mediální a digitální gramotnosti
              </p>
            </div>
          </div>

          {/* Střed / Pravá strana: Časomíra & Analytický panel */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Položka {currentIndex + 1} / {totalQuestions} • {answeredCount} hotovo</span>
            </div>

            <button
              onClick={onOpenResearchHub}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-all"
              title="Otevřít výzkumný panel pro agregaci a analýzu kódů"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Výzkumný panel</span>
            </button>
          </div>
        </div>

        {/* Dolní lišta s 5 diagnostickými oblastmi & progress barem */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => onSelectDomain('All')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shrink-0 ${
                activeDomain === 'All'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Vše ({totalQuestions})
            </button>
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => onSelectDomain(dom)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shrink-0 ${
                  activeDomain === dom
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full sm:w-64 flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500 w-9 text-right">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
