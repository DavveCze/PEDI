import React, { useState, useEffect, useMemo } from 'react';
import { QUESTIONS_DATA } from './data/questionsData';
import { RespondentInfo, QuizSubmission, ScoreBreakdown } from './types/quiz';
import { encodeQuizResult } from './utils/crypto';
import { IntroModal } from './components/IntroModal';
import { QuizHeader } from './components/QuizHeader';
import { QuestionCard } from './components/QuestionCard';
import { QuestionGridNav } from './components/QuestionGridNav';
import { ResultSummary } from './components/ResultSummary';
import { ResearchHubModal } from './components/ResearchHubModal';
import { CookieConsent } from './components/CookieConsent';
import { Shield } from 'lucide-react';

export const App: React.FC = () => {
  // Stav respondenta (představení a informovaný souhlas)
  const [respondent, setRespondent] = useState<RespondentInfo | null>(() => {
    const saved = localStorage.getItem('pedi_current_respondent');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Uložené odpovědi
  const [answers, setAnswers] = useState<Record<number, string | string[]>>(() => {
    const saved = localStorage.getItem('pedi_current_answers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  // Index aktuální otázky
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const saved = localStorage.getItem('pedi_current_index');
    return saved ? Number(saved) || 0 : 0;
  });

  // Filtr modulů
  const [activeModuleFilter, setActiveModuleFilter] = useState<'All' | 'Mediální gramotnost' | 'IT Fitness'>('All');

  // Časomíra
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Dokončený test
  const [submission, setSubmission] = useState<QuizSubmission | null>(() => {
    const saved = localStorage.getItem('pedi_last_submission');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Výzkumný panel
  const [isResearchHubOpen, setIsResearchHubOpen] = useState(false);

  // Ukládání stavu do localStorage
  useEffect(() => {
    if (respondent) {
      localStorage.setItem('pedi_current_respondent', JSON.stringify(respondent));
    } else {
      localStorage.removeItem('pedi_current_respondent');
    }
  }, [respondent]);

  useEffect(() => {
    localStorage.setItem('pedi_current_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('pedi_current_index', currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

  // Časomíra běží pouze při probíhajícím testu
  useEffect(() => {
    if (!respondent || submission) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [respondent, submission]);

  // Filtrované otázky podle zvoleného modulu
  const filteredQuestions = useMemo(() => {
    if (activeModuleFilter === 'All') return QUESTIONS_DATA;
    return QUESTIONS_DATA.filter((q) => q.module === activeModuleFilter);
  }, [activeModuleFilter]);

  // Zajištění platného indexu v rámci zobrazení
  const safeIndex = Math.min(Math.max(0, currentQuestionIndex), filteredQuestions.length - 1);
  const currentQuestion = filteredQuestions[safeIndex] || QUESTIONS_DATA[0];

  // Počet zodpovězených otázek celkově
  const answeredCount = useMemo(() => {
    return QUESTIONS_DATA.filter((q) => {
      const a = answers[q.id];
      return a !== undefined && a !== '' && (!Array.isArray(a) || a.length > 0);
    }).length;
  }, [answers]);

  // Změna odpovědi
  const handleAnswerChange = (val: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  // Navigace
  const handleNext = () => {
    if (safeIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(safeIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentQuestionIndex(safeIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectQuestionByIdx = (idx: number) => {
    // Najdeme index v rámci aktuálního filtru
    const targetQ = QUESTIONS_DATA[idx];
    if (activeModuleFilter !== 'All' && targetQ.module !== activeModuleFilter) {
      setActiveModuleFilter('All');
    }
    const newIdx = (activeModuleFilter === 'All' ? QUESTIONS_DATA : filteredQuestions).findIndex(
      (q) => q.id === targetQ.id
    );
    setCurrentQuestionIndex(newIdx >= 0 ? newIdx : idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vyhodnocení testu
  const handleSubmitQuiz = async () => {
    const unAnswered = QUESTIONS_DATA.length - answeredCount;
    if (unAnswered > 0) {
      const proceed = window.confirm(
        `Pozor: Ještě zbývá ${unAnswered} nezodpovězených položek. Opravdu si přejete test ukončit a vyhodnotit?`
      );
      if (!proceed) return;
    }

    // Výpočet bodů
    let totalScore = 0;
    let mediaGrammarScore = 0;
    let itFitnessScore = 0;

    QUESTIONS_DATA.forEach((q) => {
      const userAns = answers[q.id];
      let isCorrect = false;

      if (userAns !== undefined) {
        if (Array.isArray(q.correctAnswer)) {
          if (Array.isArray(userAns) && q.correctAnswer.length === userAns.length) {
            isCorrect = q.correctAnswer.every((val) => userAns.includes(val));
          }
        } else {
          isCorrect = userAns === q.correctAnswer;
        }
      }

      if (isCorrect) {
        totalScore += 1;
        if (q.module === 'Mediální gramotnost') {
          mediaGrammarScore += 1;
        } else {
          itFitnessScore += 1;
        }
      }
    });

    const score: ScoreBreakdown = {
      totalScore,
      maxScore: QUESTIONS_DATA.length,
      percentage: Math.round((totalScore / QUESTIONS_DATA.length) * 100),
      mediaGrammarScore,
      mediaGrammarMax: 19,
      itFitnessScore,
      itFitnessMax: 27,
    };

    const resp = respondent || {
      respondentId: 'PEDI-4A-AUTO',
      grade: '4. ročník',
      group: '4.A',
      consentGiven: true,
      startTime: new Date().toISOString(),
    };

    const completedAt = new Date().toISOString();

    const encryptedToken = await encodeQuizResult({
      respondent: resp,
      answers,
      score,
      timeSpentSeconds: secondsElapsed,
      completedAt,
    });

    const sub: QuizSubmission = {
      respondent: resp,
      answers,
      score,
      timeSpentSeconds: secondsElapsed,
      completedAt,
      encryptedToken,
    };

    setSubmission(sub);
    localStorage.setItem('pedi_last_submission', JSON.stringify(sub));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restartování testu pro nového respondenta
  const handleRestart = () => {
    localStorage.removeItem('pedi_current_respondent');
    localStorage.removeItem('pedi_current_answers');
    localStorage.removeItem('pedi_current_index');
    localStorage.removeItem('pedi_last_submission');
    setRespondent(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSecondsElapsed(0);
    setSubmission(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Úvodní okno s informovaným souhlasem */}
      {!respondent && (
        <IntroModal
          onStart={(info) => {
            setRespondent(info);
            setSecondsElapsed(0);
          }}
        />
      )}

      {/* 2. Závěrečné vyhodnocení */}
      {submission ? (
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
          <ResultSummary
            submission={submission}
            questions={QUESTIONS_DATA}
            onRestart={handleRestart}
            onOpenResearchHub={() => setIsResearchHubOpen(true)}
          />
        </main>
      ) : respondent ? (
        /* 3. Průběh testu */
        <>
          <QuizHeader
            currentIndex={safeIndex}
            totalQuestions={QUESTIONS_DATA.length}
            answeredCount={answeredCount}
            activeModule={activeModuleFilter}
            onSelectModule={(mod) => {
              setActiveModuleFilter(mod);
              setCurrentQuestionIndex(0);
            }}
            secondsElapsed={secondsElapsed}
            onOpenResearchHub={() => setIsResearchHubOpen(true)}
          />

          <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col justify-start">
            <QuestionCard
              question={currentQuestion}
              currentIndex={safeIndex}
              totalQuestions={filteredQuestions.length}
              userAnswer={answers[currentQuestion.id]}
              onAnswerChange={handleAnswerChange}
              onNext={handleNext}
              onPrev={handlePrev}
              onSubmit={handleSubmitQuiz}
              isLast={safeIndex === filteredQuestions.length - 1}
            />

            <QuestionGridNav
              questions={QUESTIONS_DATA}
              currentIndex={QUESTIONS_DATA.findIndex((q) => q.id === currentQuestion.id)}
              answers={answers}
              onSelectQuestion={handleSelectQuestionByIdx}
            />
          </main>
        </>
      ) : null}

      {/* Výzkumný analytický panel pro autory práce */}
      <ResearchHubModal
        isOpen={isResearchHubOpen}
        onClose={() => setIsResearchHubOpen(false)}
        questions={QUESTIONS_DATA}
      />

      {/* Patička */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>PEDI 2026 • Školní diagnostický nástroj (Seminární práce)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Anonymizovaný sběr dat dle GDPR</span>
            <button
              onClick={() => setIsResearchHubOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Učitelský & Výzkumný dashboard
            </button>
          </div>
        </div>
      </footer>

      {/* GDPR Cookie Consent komponenta z dev-library */}
      <CookieConsent />
    </div>
  );
};
