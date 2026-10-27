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
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-slate-300 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-3 text-xs">
        <span className="font-bold uppercase tracking-wider text-slate-700">
          Přehled položek (1–{questions.length})
        </span>
        <div className="flex items-center gap-3 text-[11px] text-slate-600">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-blue-100 border border-blue-400" />
            <span>Zodpovězeno</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300" />
            <span>Zbývá</span>
          </div>
        </div>
      </div>

      {/* Grid: na mobilu 10 sloupců (2 řádky), na větších 10/20 sloupců */}
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {questions.map((q, idx) => {
          const ans = answers[q.id];
          const isAnswered =
            ans !== undefined &&
            ans !== '' &&
            (!Array.isArray(ans) || ans.length > 0);
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              className={`h-9 sm:h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                isCurrent
                  ? 'bg-blue-700 text-white ring-2 ring-blue-700 ring-offset-1'
                  : isAnswered
                  ? 'bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
              title={`Položka ${idx + 1}: ${q.theme} [${q.domain}]`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
