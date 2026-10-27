import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Question, QuizSubmission } from '../types/quiz';
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

  useEffect(() => {
    // Spuštění oslavných konfet při zobrazení výsledků
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignorovat pokud canvas confetti selže
    }
  }, []);

  const { score } = submission;
  const mediaPct = Math.round((score.mediaGrammarScore / score.mediaGrammarMax) * 100);
  const itPct = Math.round((score.itFitnessScore / score.itFitnessMax) * 100);

  // Pedagogicko-diagnostická interpretace
  const getDiagnosticVerdict = (pct: number) => {
    if (pct >= 85) {
      return {
        level: 'Vynikající úroveň (Expert)',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        desc: 'Prokazujete vysoce rozvinuté kritické myšlení, precizní detekci mediálních manipulací i pokročilé povědomí o kybernetické bezpečnosti a práci s daty.',
      };
    }
    if (pct >= 70) {
      return {
        level: 'Velmi dobrá úroveň (Pokročilý)',
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        desc: 'Úspěšně rozpoznáváte většinu dezinformačních technik a bezpečnostních rizik. Pozornost doporučujeme věnovat detailnímu ověřování metadat a reverznímu hledání.',
      };
    }
    if (pct >= 50) {
      return {
        level: 'Standardní úroveň (Průměr)',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        desc: 'Základní principy mediálního a digitálního světa ovládáte. U komplikovanějších úloh (např. sanitizace dat, scareware, analýza revizí) se však objevily nepřesnosti.',
      };
    }
    return {
      level: 'Rozvíjející se úroveň (Vyžaduje posílení)',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      desc: 'Výsledky indikují prostor pro systematické posílení mediální gramotnosti a digitální bezpečnosti v rámci středoškolského vzdělávání.',
    };
  };

  const verdict = getDiagnosticVerdict(score.percentage);

  // Ověření správnosti jednotlivých otázek
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16">
      {/* Hlavní skóre karta */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Diagnostické vyhodnocení dokončeno</span>
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

        {/* Dva pilíře / moduly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">
          {/* 1. Mediální gramotnost */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                1. Mediální gramotnost
              </span>
              <span className="font-bold text-slate-900">
                {score.mediaGrammarScore} / {score.mediaGrammarMax} ({mediaPct} %)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${mediaPct}%` }}
              />
            </div>
          </div>

          {/* 2. IT Fitness */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                2. IT Fitness & Bezpečnost
              </span>
              <span className="font-bold text-slate-900">
                {score.itFitnessScore} / {score.itFitnessMax} ({itPct} %)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${itPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Šifrovaný kód pro odevzdání */}
      <ResultTokenBox submission={submission} />

      {/* Tlačítko pro detailní rozbor otázek */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-base group"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Podrobný rozbor položek a diagnostických cílů (1–46)</span>
          </div>
          <div className="p-1 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
            {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showDetails && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in duration-300">
            {questions.map((q) => {
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
                        Položka {q.id}: {q.theme}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {q.module}
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

      {/* Spodní ovládací tlačítka */}
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
          <BarChart3 className="w-4 h-4" />
          <span>Otevřít Výzkumný analytický panel</span>
        </button>
      </div>
    </div>
  );
};
