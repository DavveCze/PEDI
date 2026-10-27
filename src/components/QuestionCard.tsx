import React, { useState } from 'react';
import {
  ExternalLink,
  ZoomIn,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Question } from '../types/quiz';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  userAnswer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isLast: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  userAnswer,
  onAnswerChange,
  onNext,
  onPrev,
  onSubmit,
  isLast,
}) => {
  const [activeImageZoom, setActiveImageZoom] = useState<string | null>(null);

  const isAnswered =
    userAnswer !== undefined &&
    userAnswer !== '' &&
    (!Array.isArray(userAnswer) || userAnswer.length > 0);

  const handleSingleSelect = (val: string) => {
    onAnswerChange(val);
  };

  const handleMultipleToggle = (val: string) => {
    const current = Array.isArray(userAnswer) ? [...userAnswer] : [];
    const index = current.indexOf(val);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(val);
    }
    onAnswerChange(current);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-20 sm:pb-8">
      {/* Lightbox pro detailní zvětšení obrázku */}
      {activeImageZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setActiveImageZoom(null)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] bg-white rounded-xl p-2 overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImageZoom(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Zavřít náhled"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImageZoom}
              alt="Zvětšený náhled diagnostického materiálu"
              className="max-h-[82vh] w-auto max-w-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Hlavní karta položky */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
        {/* Hlavička položky */}
        <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300">
              Položka {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="font-semibold text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded">
              {question.domain}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {question.prompt}
          </h2>

          {question.scenario && (
            <div className="mt-2.5 p-3 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Kontext úlohy: </strong>
              {question.scenario}
            </div>
          )}

          {question.externalUrl && (
            <div className="mt-2.5">
              <a
                href={question.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{question.externalUrlLabel || 'Otevřít odkaz'}</span>
              </a>
            </div>
          )}
        </div>

        {/* Obrázky / Schémata */}
        {question.images && question.images.length > 0 && (
          <div className="p-3 sm:p-5 bg-slate-100/60 border-b border-slate-200">
            <div className={`grid gap-3 ${question.images.length > 1 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
              {question.images.map((imgSrc, imgIdx) => (
                <div
                  key={imgIdx}
                  className="relative rounded-xl border border-slate-300 bg-white p-2 shadow-xs cursor-pointer hover:border-slate-500 transition-all flex flex-col items-center"
                  onClick={() => setActiveImageZoom(imgSrc)}
                  title="Kliknutím zvětšíte"
                >
                  <img
                    src={imgSrc}
                    alt={`Příloha k otázce ${question.id}`}
                    className="max-h-64 sm:max-h-72 w-auto max-w-full object-contain rounded-lg"
                    loading="lazy"
                  />
                  <div className="mt-2 text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zvětšit detail</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Možnosti odpovědí (Mobile-first dotyková tlačítka) */}
        <div className="p-4 sm:p-6 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            {question.type === 'multiple_choice' ? 'Vyberte všechny správné možnosti:' : 'Zvolte odpověď:'}
          </div>

          {/* 1. Pole 1-4 (Grid) */}
          {question.type === 'grid_choice' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {question.options.map((opt) => {
                const isSelected = userAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSingleSelect(opt)}
                    className={`min-h-[56px] p-3 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50 text-blue-950 font-bold'
                        : 'border-slate-300 hover:border-slate-400 bg-white text-slate-800'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Pole</span>
                    <span className="text-xl font-bold">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. PRAVDA / NEPRAVDA */}
          {question.type === 'true_false' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSingleSelect('PRAVDA')}
                className={`min-h-[52px] p-4 rounded-xl border-2 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
                  userAnswer === 'PRAVDA'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-300 hover:border-slate-400 bg-white text-slate-800'
                }`}
              >
                <span>✓ PRAVDA</span>
              </button>

              <button
                type="button"
                onClick={() => handleSingleSelect('NEPRAVDA')}
                className={`min-h-[52px] p-4 rounded-xl border-2 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
                  userAnswer === 'NEPRAVDA'
                    ? 'border-rose-700 bg-rose-50 text-rose-950 shadow-xs'
                    : 'border-slate-300 hover:border-slate-400 bg-white text-slate-800'
                }`}
              >
                <span>✕ NEPRAVDA</span>
              </button>
            </div>
          )}

          {/* 3. ZABEZPEČÍ / NEZABEZPEČÍ */}
          {question.type === 'secure_unsecure' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSingleSelect('ZABEZPEČÍ')}
                className={`min-h-[52px] p-4 rounded-xl border-2 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
                  userAnswer === 'ZABEZPEČÍ'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-300 hover:border-slate-400 bg-white text-slate-800'
                }`}
              >
                <span>ZABEZPEČÍ</span>
              </button>

              <button
                type="button"
                onClick={() => handleSingleSelect('NEZABEZPEČÍ')}
                className={`min-h-[52px] p-4 rounded-xl border-2 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
                  userAnswer === 'NEZABEZPEČÍ'
                    ? 'border-amber-700 bg-amber-50 text-amber-950 shadow-xs'
                    : 'border-slate-300 hover:border-slate-400 bg-white text-slate-800'
                }`}
              >
                <span>NEZABEZPEČÍ</span>
              </button>
            </div>
          )}

          {/* 4. Single choice (jeden výběr) */}
          {question.type === 'single_choice' && (
            <div className="space-y-2">
              {question.options.map((opt, optIdx) => {
                const isSelected = userAnswer === opt;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSingleSelect(opt)}
                    className={`w-full min-h-[48px] text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50/70 text-slate-900 font-medium'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-blue-700 bg-blue-700' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 5. Multiple choice (více možností) */}
          {question.type === 'multiple_choice' && (
            <div className="space-y-2">
              {question.options.map((opt, optIdx) => {
                const isChecked = Array.isArray(userAnswer) && userAnswer.includes(opt);
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleMultipleToggle(opt)}
                    className={`w-full min-h-[48px] text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'border-blue-700 bg-blue-50/70 text-slate-900 font-medium'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                        isChecked ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Plovoucí spodní navigační lišta pro mobil i desktop */}
      <div className="fixed sm:static bottom-0 inset-x-0 z-30 bg-white/95 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border-t sm:border-t-0 border-slate-200 p-3 sm:p-0 sm:mt-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`min-h-[48px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Předchozí</span>
          </button>

          <div className="text-xs text-slate-500 hidden sm:block">
            {isAnswered ? '✓ Zodpovězeno' : 'Čeká na volbu'}
          </div>

          {isLast ? (
            <button
              type="button"
              onClick={onSubmit}
              className="min-h-[48px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-all flex items-center gap-2"
            >
              <span>Dokončit test</span>
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="min-h-[48px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Další</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
