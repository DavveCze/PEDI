import React from 'react';
import { Question } from '../types/quiz';

interface QuestionGridNavProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string | string[]>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionGridNav: React.FC<QuestionGridNavProps> = ({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Rychlá navigace v testu (Položky 1–{questions.length})
        </h3>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Zodpovězeno</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span>Zbývá</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full ring-2 ring-indigo-600 bg-white" />
            <span>Aktuální</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-23 gap-1.5 sm:gap-2">
        {questions.map((q, idx) => {
          const ans = answers[q.id];
          const isAnswered = ans !== undefined && ans !== '' && (!Array.isArray(ans) || ans.length > 0);
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              className={`h-8 rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${
                isCurrent
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2 scale-105 shadow-sm'
                  : isAnswered
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={`Položka ${idx + 1} (Otázka Q${q.id}): ${q.theme} [${q.domain}] (${isAnswered ? 'Zodpovězeno' : 'Nezodpovězeno'})`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
