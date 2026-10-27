import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Newspaper,
  Search,
  ShieldCheck,
  Laptop,
  Cpu,
} from 'lucide-react';
import { Question, QuizSubmission, DiagnosticDomain } from '../types/quiz';
import { ResultTokenBox } from './ResultTokenBox';

interface ResultSummaryProps {
  submission: QuizSubmission;
  questions: Question[];
  onRestart: () => void;
  onOpenResearchHub: () => void;
}

const DOMAIN_ICONS: Record<DiagnosticDomain, React.ReactNode> = {
  'Mediální obsah': <Newspaper className="w-4 h-4 text-indigo-600" />,
  'Ověřování informací': <Search className="w-4 h-4 text-blue-600" />,
  'Bezpečnost a soukromí': <ShieldCheck className="w-4 h-4 text-emerald-600" />,
  'Digitální nástroje': <Laptop className="w-4 h-4 text-amber-600" />,
  'Kritické využití AI': <Cpu className="w-4 h-4 text-purple-600" />,
};

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  submission,
  questions,
  onRestart,
  onOpenResearchHub,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  const { score } = submission;

  const getDiagnosticVerdict = (pct: number) => {
    if (pct >= 85) {
      return {
        level: 'Vynikající úroveň (Expert)',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        desc: 'Prokazujete vysoce rozvinuté kritické myšlení, precizní detekci mediálních manipulací i pokročilé povědomí o kybernetické bezpečnosti a práci s AI.',
      };
    }
    if (pct >= 70) {
      return {
        level: 'Velmi dobrá úroveň (Pokročilý)',
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        desc: 'Úspěšně rozpoznáváte dezinformační formáty a bezpečnostní rizika. Pozornost doporučujeme věnovat detailnímu ověřování zdrojů a limitů AI modelů.',
      };
    }
    if (pct >= 50) {
      return {
        level: 'Standardní úroveň (Průměr)',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        desc: 'Základní principy mediální a digitální gramotnosti ovládáte. U komplikovanějších úloh (např. sanitizace dat, Passkeys, prostorové halucinace AI) se však objevily nepřesnosti.',
      };
    }
    return {
      level: 'Rozvíjející se úroveň (Vyžaduje posílení)',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
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
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16">
      {/* Hlavní skóre karta */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Diagnostické vyhodnocení dokončeno ({questions.length} položek)</span>
        </div>

        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 mb-4">
          <Trophy className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {score.totalScore} <span className="text-xl sm:text-2xl text-slate-400 font-semibold">/ {score.maxScore} bodů</span>
        </h1>
        <div className="text-lg font-bold text-indigo-600 mt-1">
          Úspěšnost: {score.percentage} %
        </div>

        {/* Diagnostický verdikt */}
        <div className={`mt-6 p-5 rounded-2xl border text-left max-w-2xl mx-auto ${verdict.color}`}>
          <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
            Diagnostická interpretace
          </div>
          <div className="text-base font-bold mb-1.5">{verdict.level}</div>
          <div className="text-xs sm:text-sm leading-relaxed">{verdict.desc}</div>
        </div>

        {/* 5 diagnostických oblastí */}
        <div className="mt-8 pt-6 border-t border-slate-100 max-w-2xl mx-auto text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Rozpad úspěšnosti podle 5 diagnostických oblastí
          </h3>
          <div className="space-y-3">
            {domains.map((dom) => {
              const domData = score.domainScores?.[dom] || { score: 0, max: 0, percentage: 0 };
              if (domData.max === 0) return null;
              return (
                <div key={dom} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-2">
                      {DOMAIN_ICONS[dom]}
                      {dom}
                    </span>
                    <span className="font-bold text-slate-900">
                      {domData.score} / {domData.max} b ({domData.percentage} %)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${domData.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Šifrovaný kód pro odevzdání */}
      <ResultTokenBox submission={submission} />

      {/* Podrobný rozbor položek */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-base group"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Podrobný rozbor vyřešených položek ({questions.length})</span>
          </div>
          <div className="p-1 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
            {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showDetails && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in duration-300">
            {questions.map((q, idx) => {
              const correct = isQuestionCorrect(q);
              const userAns = submission.answers[q.id];
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border text-sm transition-all ${
                    correct
                      ? 'bg-emerald-50/40 border-emerald-200/70'
                      : 'bg-rose-50/40 border-rose-200/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        Položka {idx + 1} (Q{q.id}): {q.theme}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {q.domain}
                      </span>
                    </div>
                    {correct ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Správně (+1 b)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-xs">
                        <XCircle className="w-4 h-4" /> Chybně (0 b)
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-slate-700 text-xs sm:text-sm font-medium">{q.prompt}</p>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80">
                      <span className="text-slate-400 block font-semibold mb-0.5">Vaše odpověď:</span>
                      <span className={correct ? 'text-emerald-800 font-bold' : 'text-rose-800 font-bold'}>
                        {Array.isArray(userAns) ? userAns.join('; ') : userAns ?? '(Nezodpovězeno)'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80">
                      <span className="text-slate-400 block font-semibold mb-0.5">Správné řešení:</span>
                      <span className="text-emerald-800 font-bold">
                        {Array.isArray(q.correctAnswer) ? q.correctAnswer.join('; ') : q.correctAnswer}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 text-xs text-slate-500 bg-white/50 p-2.5 rounded-xl border border-slate-200/50">
                    <strong className="text-indigo-900">Diagnostický cíl / Odůvodnění: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ovládací tlačítka */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={onRestart}
          className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Vyplnit test znovu (Nový respondent)</span>
        </button>

        <button
          type="button"
          onClick={onOpenResearchHub}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Trophy className="w-4 h-4" />
          <span>Otevřít Výzkumný analytický panel</span>
        </button>
      </div>
    </div>
  );
};
