import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

interface QuizHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  secondsElapsed: number;
  group?: string;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  secondsElapsed,
  group,
}) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Horní pruh */}
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
            PEDI 2026
          </span>
          {group && (
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300 rounded">
              {group}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-600 font-mono bg-slate-100 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
            <span>
              {answeredCount}/{totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Tenký progres bar */}
      <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
        <div
          className="bg-blue-700 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stavový proužek s číslem položky */}
      <div className="max-w-4xl mx-auto px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 border-t border-slate-100">
        <span>Položka <strong>{currentIndex + 1}</strong> z {totalQuestions}</span>
        <span>Dokončeno: <strong>{progressPercent} %</strong></span>
      </div>
    </header>
  );
};
