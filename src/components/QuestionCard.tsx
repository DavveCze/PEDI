import React, { useState } from 'react';
import {
  ExternalLink,
  ZoomIn,
  X,
  CheckCircle,
  HelpCircle,
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

  const isAnswered = userAnswer !== undefined && userAnswer !== '' && (!Array.isArray(userAnswer) || userAnswer.length > 0);

  // Zpracování výběru jedné možnosti
  const handleSingleSelect = (val: string) => {
    onAnswerChange(val);
  };

  // Zpracování výběru více možností
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Lightbox pro detailní prohlížení obrázků */}
      {activeImageZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImageZoom(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setActiveImageZoom(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImageZoom}
              alt="Zvětšený náhled diagnostického materiálu"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
        {/* Karta - Záhlaví otázky */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-indigo-600 text-white rounded-lg shadow-xs">
                Položka {currentIndex + 1} z {totalQuestions}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg">
                {question.domain}
              </span>
            </div>
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Téma: {question.theme}</span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {question.prompt}
          </h2>

          {question.scenario && (
            <div className="mt-2.5 text-sm text-slate-600 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/50">
              <span className="font-medium text-indigo-900">Kontext úlohy: </span>
              {question.scenario}
            </div>
          )}

          {question.externalUrl && (
            <div className="mt-3">
              <a
                href={question.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{question.externalUrlLabel || 'Otevřít zkoumaný zdroj'}</span>
              </a>
            </div>
          )}
        </div>

        {/* Karta - Grafické přílohy / Obrázky */}
        {question.images && question.images.length > 0 && (
          <div className="px-6 sm:px-8 py-5 bg-slate-50/50 border-b border-slate-100">
            <div className={`grid gap-4 ${question.images.length > 1 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
              {question.images.map((imgSrc, imgIdx) => (
                <div
                  key={imgIdx}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-2 shadow-xs overflow-hidden cursor-pointer hover:border-indigo-400 transition-all flex flex-col items-center"
                  onClick={() => setActiveImageZoom(imgSrc)}
                  title="Kliknutím zvětšíte obrázek"
                >
                  <img
                    src={imgSrc}
                    alt={`Příloha k položce ${question.id}`}
                    className="max-h-80 w-auto object-contain rounded-xl transition-transform group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl pointer-events-none">
                    <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-indigo-600" />
                      Zvětšit detail
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 text-center mt-2">
              💡 Tip: Kliknutím na obrázek otevřete zvětšený detail v plném rozlišení.
            </div>
          </div>
        )}

        {/* Karta - Odpovědní formulář */}
        <div className="p-6 sm:p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            {question.type === 'multiple_choice' ? 'Vyberte všechny vyhovující možnosti:' : 'Zvolte odpověď:'}
          </div>

          {/* 1. Mřížka / Grid Choice (např. Otázka 1 - pole 1-4) */}
          {question.type === 'grid_choice' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {question.options.map((opt) => {
                const isSelected = userAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSingleSelect(opt)}
                    className={`py-4 px-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs text-slate-500 uppercase font-semibold">Pole</span>
                    <span className="text-2xl font-black">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. PRAVDA / NEPRAVDA */}
          {question.type === 'true_false' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSingleSelect('PRAVDA')}
                className={`p-4 sm:p-5 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2.5 ${
                  userAnswer === 'PRAVDA'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-md shadow-emerald-100'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 text-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  userAnswer === 'PRAVDA' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-transparent'
                }`}>
                  ✓
                </div>
                <span>PRAVDA</span>
              </button>

              <button
                type="button"
                onClick={() => handleSingleSelect('NEPRAVDA')}
                className={`p-4 sm:p-5 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2.5 ${
                  userAnswer === 'NEPRAVDA'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-md shadow-rose-100'
                    : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 text-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  userAnswer === 'NEPRAVDA' ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300 text-transparent'
                }`}>
                  ✕
                </div>
                <span>NEPRAVDA</span>
              </button>
            </div>
          )}

          {/* 3. ZABEZPEČÍ / NEZABEZPEČÍ */}
          {question.type === 'secure_unsecure' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSingleSelect('ZABEZPEČÍ')}
                className={`p-4 sm:p-5 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2.5 ${
                  userAnswer === 'ZABEZPEČÍ'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-md shadow-emerald-100'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 text-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  userAnswer === 'ZABEZPEČÍ' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-transparent'
                }`}>
                  🛡️
                </div>
                <span>ZABEZPEČÍ</span>
              </button>

              <button
                type="button"
                onClick={() => handleSingleSelect('NEZABEZPEČÍ')}
                className={`p-4 sm:p-5 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2.5 ${
                  userAnswer === 'NEZABEZPEČÍ'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-md shadow-amber-100'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 text-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  userAnswer === 'NEZABEZPEČÍ' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 text-transparent'
                }`}>
                  ⚠️
                </div>
                <span>NEZABEZPEČÍ</span>
              </button>
            </div>
          )}

          {/* 4. Single Choice (Výběr z možností) */}
          {question.type === 'single_choice' && (
            <div className="space-y-3">
              {question.options.map((opt, optIdx) => {
                const isSelected = userAnswer === opt;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSingleSelect(opt)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium shadow-xs'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 text-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 5. Multiple Choice (Více správných odpovědí) */}
          {question.type === 'multiple_choice' && (
            <div className="space-y-3">
              {question.options.map((opt, optIdx) => {
                const isChecked = Array.isArray(userAnswer) && userAnswer.includes(opt);
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleMultipleToggle(opt)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium shadow-xs'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 text-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                      isChecked ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Karta - Spodní navigační panel */}
        <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-200/50'
                : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Předchozí</span>
          </button>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            {isAnswered ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Odpověď uložena
              </span>
            ) : (
              <span className="text-slate-400">Položka čeká na vaši volbu</span>
            )}
          </div>

          {isLast ? (
            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <span>Dokončit a vyhodnotit test</span>
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
            >
              <span>Další položka</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
