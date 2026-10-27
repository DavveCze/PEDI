import React, { useState, useEffect } from 'react';
import { QUESTIONS_20 } from './data/questionsData';
import {
  RespondentInfo,
  QuizSubmission,
  ScoreBreakdown,
  DiagnosticDomain,
} from './types/quiz';
import { encodeQuizResult } from './utils/crypto';
import { IntroModal } from './components/IntroModal';
import { QuizHeader } from './components/QuizHeader';
import { QuestionCard } from './components/QuestionCard';
import { QuestionGridNav } from './components/QuestionGridNav';
import { ResultSummary } from './components/ResultSummary';
import { ResearchConditionsModal } from './components/ResearchConditionsModal';
import { TeacherPage } from './pages/TeacherPage';
import { Shield, FileText, Lock } from 'lucide-react';

const isTeacherPath = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hash = (window.location.hash || '').toLowerCase();
  const path = (window.location.pathname || '').toLowerCase();
  return hash.includes('ucitel') || path.endsWith('/ucitel') || path.endsWith('/ucitel/');
};

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<'quiz' | 'teacher'>(() => {
    return isTeacherPath() ? 'teacher' : 'quiz';
  });

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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const saved = localStorage.getItem('pedi_current_index');
    return saved ? Number(saved) || 0 : 0;
  });

  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

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

  const [isConditionsOpen, setIsConditionsOpen] = useState(false);

  // Synchronizace routování s hash a historií prohlížeče (kompatibilní s GitHub Pages)
  useEffect(() => {
    const handleLocationChange = () => {
      if (isTeacherPath()) {
        setCurrentRoute('teacher');
      } else {
        setCurrentRoute('quiz');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: 'quiz' | 'teacher') => {
    setCurrentRoute(route);
    if (route === 'teacher') {
      window.location.hash = '/ucitel';
    } else {
      window.location.hash = '/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ukládání stavu testu do localStorage
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

  // Časomíra
  useEffect(() => {
    if (!respondent || submission || currentRoute !== 'quiz') return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [respondent, submission, currentRoute]);

  const safeIndex = Math.min(Math.max(0, currentQuestionIndex), QUESTIONS_20.length - 1);
  const currentQuestion = QUESTIONS_20[safeIndex] || QUESTIONS_20[0];

  const answeredCount = QUESTIONS_20.filter((q) => {
    const a = answers[q.id];
    return a !== undefined && a !== '' && (!Array.isArray(a) || a.length > 0);
  }).length;

  const handleAnswerChange = (val: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const handleNext = () => {
    if (safeIndex < QUESTIONS_20.length - 1) {
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
    setCurrentQuestionIndex(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitQuiz = async () => {
    const unAnswered = QUESTIONS_20.length - answeredCount;
    if (unAnswered > 0) {
      const proceed = window.confirm(
        `Pozor: Ještě zbývá ${unAnswered} nezodpovězených položek. Opravdu si přejete test ukončit a vyhodnotit?`
      );
      if (!proceed) return;
    }

    let totalScore = 0;
    const domainCounters: Record<DiagnosticDomain, { score: number; max: number }> = {
      'Mediální obsah': { score: 0, max: 0 },
      'Ověřování informací': { score: 0, max: 0 },
      'Bezpečnost a soukromí': { score: 0, max: 0 },
      'Digitální nástroje': { score: 0, max: 0 },
      'Kritické využití AI': { score: 0, max: 0 },
    };

    QUESTIONS_20.forEach((q) => {
      domainCounters[q.domain].max += 1;
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
        domainCounters[q.domain].score += 1;
      }
    });

    const domainScores: any = {};
    for (const [dom, cnt] of Object.entries(domainCounters)) {
      domainScores[dom] = {
        score: cnt.score,
        max: cnt.max,
        percentage: cnt.max > 0 ? Math.round((cnt.score / cnt.max) * 100) : 0,
      };
    }

    const score: ScoreBreakdown = {
      totalScore,
      maxScore: QUESTIONS_20.length,
      percentage: Math.round((totalScore / QUESTIONS_20.length) * 100),
      domainScores,
    };

    const resp = respondent || {
      respondentId: 'PEDI-4A-AUTO',
      grade: '4. ročník',
      group: '4.A',
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
      startTime: new Date().toISOString(),
    };

    const completedAt = new Date().toISOString();
    const questionIds = QUESTIONS_20.map((q) => q.id);

    const encryptedToken = await encodeQuizResult({
      respondent: resp,
      questionIds,
      answers,
      score,
      timeSpentSeconds: secondsElapsed,
      completedAt,
    });

    const sub: QuizSubmission = {
      respondent: resp,
      questionIds,
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

  // Pokud je aktivní stránka pro učitele
  if (currentRoute === 'teacher') {
    return (
      <TeacherPage
        onBackToQuiz={() => navigateTo('quiz')}
      />
    );
  }

  // Běžné zobrazení testu pro studenty
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
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
        <main className="flex-1 max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10 w-full">
          <ResultSummary
            submission={submission}
            questions={QUESTIONS_20}
            onRestart={handleRestart}
            onOpenTeacherPortal={() => navigateTo('teacher')}
          />
        </main>
      ) : respondent ? (
        /* 3. Průběh testu (20 položek) */
        <>
          <QuizHeader
            currentIndex={safeIndex}
            totalQuestions={QUESTIONS_20.length}
            answeredCount={answeredCount}
            secondsElapsed={secondsElapsed}
            group={respondent.group}
          />

          <main className="flex-1 max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full flex flex-col justify-start">
            <QuestionCard
              question={currentQuestion}
              currentIndex={safeIndex}
              totalQuestions={QUESTIONS_20.length}
              userAnswer={answers[currentQuestion.id]}
              onAnswerChange={handleAnswerChange}
              onNext={handleNext}
              onPrev={handlePrev}
              onSubmit={handleSubmitQuiz}
              isLast={safeIndex === QUESTIONS_20.length - 1}
            />

            <QuestionGridNav
              questions={QUESTIONS_20}
              currentIndex={safeIndex}
              answers={answers}
              onSelectQuestion={handleSelectQuestionByIdx}
            />
          </main>
        </>
      ) : null}

      {/* Podmínky výzkumu (zobrazitelné kdykoliv z patičky) */}
      <ResearchConditionsModal
        isOpen={isConditionsOpen}
        onClose={() => setIsConditionsOpen(false)}
      />

      {/* Patička */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-xs text-slate-600">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>PEDI 2026 • Školní pedagogická diagnostika (4. ročník)</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsConditionsOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline underline-offset-2 flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Podmínky a metodika výzkumu</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('teacher')}
              className="text-slate-700 hover:text-blue-700 font-semibold flex items-center gap-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-md transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Správa pro učitele (/ucitel)</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
