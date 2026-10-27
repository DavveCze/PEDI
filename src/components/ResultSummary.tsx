import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Database,
} from 'lucide-react';
import { Question, QuizSubmission, DiagnosticDomain } from '../types/quiz';
import { ResultTokenBox } from './ResultTokenBox';

interface ResultSummaryProps {
  submission: QuizSubmission;
  questions: Question[];
  onRestart: () => void;
  onOpenResearchHub: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  submission,
  questions,
  onRestart,
  onOpenResearchHub,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { score } = submission;

  const getDiagnosticVerdict = (pct: number) => {
    if (pct >= 85) {
      return {
        level: 'Výborná úroveň (Nadprůměr)',
        color: 'bg-emerald-50 text-emerald-900 border-emerald-300',
        desc: 'Prokazujete vysoce rozvinuté kritické myšlení, spolehlivou detekci manipulací a vysoké povědomí o kybernetické bezpečnosti a limitech AI.',
      };
    }
    if (pct >= 70) {
      return {
        level: 'Velmi dobrá úroveň (Pokročilý)',
        color: 'bg-blue-50 text-blue-900 border-blue-300',
        desc: 'Úspěšně rozpoznáváte většinu dezinformačních technik a bezpečnostních rizik. Pozornost doporučujeme věnovat detailnímu ověřování metadat a limitům AI modelů.',
      };
    }
    if (pct >= 50) {
      return {
        level: 'Standardní úroveň (Průměr)',
        color: 'bg-amber-50 text-amber-900 border-amber-300',
        desc: 'Základní principy mediální a digitální gramotnosti ovládáte. V náročnějších situacích (např. sanitizace dat, Passkeys, ověřování syntetických obrazů) se objevily nepřesnosti.',
      };
    }
    return {
      level: 'Základní úroveň (Vyžaduje posílení)',
      color: 'bg-rose-50 text-rose-900 border-rose-300',
      desc: 'Výsledky indikují prostor pro systematické posílení mediální gramotnosti a digitální bezpečnosti v rámci středoškolského vzdělávání.',
    };
  };

  const verdict = getDiagnosticVerdict(score.percentage);

  const isQuestionCorrect = (q: Question) => {
    const userAns = submission.answers[q.id];
    if (userAns === undefined) return false;

    if (Array.isArray(q.correctAnswer)) {
      if (!Array.isArray(userAns)) return false;
      if (q.correctAnswer.length !== userAns.length) return false;
      return q.correctAnswer.every((val) => userAns.includes(val));
    }
    return userAns === q.correctAnswer;
  };

  const domains: DiagnosticDomain[] = [
    'Mediální obsah',
    'Ověřování informací',
    'Bezpečnost a soukromí',
    'Digitální nástroje',
    'Kritické využití AI',
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 pb-16">
      {/* Hlavní skóre karta (střízlivý styl) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Výsledek diagnostického šetření
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Protokol hodnocení respondenta
            </h1>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {score.totalScore}
            </span>
            <span className="text-sm text-slate-500 font-semibold"> / {score.maxScore} b</span>
            <div className="text-xs font-bold text-blue-700">{score.percentage} %</div>
          </div>
        </div>

        {/* Diagnostický verdikt */}
        <div className={`mt-5 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${verdict.color}`}>
          <div className="font-bold text-sm mb-1">{verdict.level}</div>
          <p>{verdict.desc}</p>
        </div>

        {/* Rozpad podle 5 oblastí */}
        <div className="mt-5 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Výsledky podle diagnostických oblastí
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {domains.map((dom) => {
              const domData = score.domainScores?.[dom] || { score: 0, max: 0, percentage: 0 };
              if (domData.max === 0) return null;
              return (
                <div key={dom} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{dom}</div>
                    <div className="text-slate-500 text-[11px]">Úspěšnost: {domData.percentage} %</div>
                  </div>
                  <div className="text-right font-bold text-slate-900 text-sm">
                    {domData.score} / {domData.max} b
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Šifrovaný kód výsledku pro odevzdání */}
      <ResultTokenBox submission={submission} />

      {/* Detailní rozbor odpovědí */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-300 shadow-xs">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-700" />
            <span>Podrobný přehled odpovědí ({questions.length} položek)</span>
          </div>
          <div className="p-1 rounded bg-slate-100 text-slate-600">
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDetails && (
          <div className="mt-5 pt-5 border-t border-slate-200 space-y-3">
            {questions.map((q, idx) => {
              const correct = isQuestionCorrect(q);
              const userAns = submission.answers[q.id];
              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                    correct
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">
                      Položka {idx + 1}: {q.theme}
                    </span>
                    {correct ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Správně
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-800 font-bold text-xs">
                        <XCircle className="w-3.5 h-3.5" /> Chybně
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-slate-700 text-xs">{q.prompt}</p>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] font-semibold">Vaše volba:</span>
                      <span className={correct ? 'text-emerald-800 font-bold' : 'text-rose-800 font-bold'}>
                        {Array.isArray(userAns) ? userAns.join('; ') : userAns ?? '(Nevyplněno)'}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] font-semibold">Správné řešení:</span>
                      <span className="text-emerald-800 font-bold">
                        {Array.isArray(q.correctAnswer) ? q.correctAnswer.join('; ') : q.correctAnswer}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-600 bg-white/70 p-2 rounded border border-slate-200">
                    <strong>Odůvodnění: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Spodní akční tlačítka */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={onRestart}
          className="min-h-[48px] px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-300 shadow-xs flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Vyplnit znovu (Nový respondent)</span>
        </button>

        <button
          type="button"
          onClick={onOpenResearchHub}
          className="min-h-[48px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Database className="w-4 h-4" />
          <span>Výzkumný panel</span>
        </button>
      </div>
    </div>
  );
};
