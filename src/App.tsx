import React, { useState, useEffect, useMemo } from 'react';
import {
  QUESTIONS_DATA,
  getStandard20Questions,
  getRandomized20Questions,
} from './data/questionsData';
import {
  RespondentInfo,
  QuizSubmission,
  ScoreBreakdown,
  DiagnosticDomain,
  Question,
} from './types/quiz';
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

  // Otázky pro aktuální běh testu
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('pedi_active_questions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getStandard20Questions();
      }
    }
    return getStandard20Questions();
  });

  // Odpovědi
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

  // Filtr 5 diagnostických oblastí
  const [activeDomainFilter, setActiveDomainFilter] = useState<'All' | DiagnosticDomain>('All');

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
    localStorage.setItem('pedi_active_questions', JSON.stringify(activeQuestions));
  }, [activeQuestions]);

  useEffect(() => {
    localStorage.setItem('pedi_current_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('pedi_current_index', currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

  // Časomíra
  useEffect(() => {
    if (!respondent || submission) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [respondent, submission]);

  // Zahájení testu s výběrem otázek
  const handleStartQuiz = (info: RespondentInfo) => {
    let questionsList: Question[];
    if (info.quizMode === 'random_20') {
      questionsList = getRandomized20Questions();
    } else if (info.quizMode === 'full_46') {
      questionsList = QUESTIONS_DATA;
    } else {
      questionsList = getStandard20Questions();
    }

    setActiveQuestions(questionsList);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSecondsElapsed(0);
    setSubmission(null);
    setRespondent(info);
  };

  // Filtrované otázky podle zvolené diagnostické oblasti
  const filteredQuestions = useMemo(() => {
    if (activeDomainFilter === 'All') return activeQuestions;
    return activeQuestions.filter((q) => q.domain === activeDomainFilter);
  }, [activeDomainFilter, activeQuestions]);

  const safeIndex = Math.min(Math.max(0, currentQuestionIndex), filteredQuestions.length - 1);
  const currentQuestion = filteredQuestions[safeIndex] || activeQuestions[0];

  const answeredCount = useMemo(() => {
    return activeQuestions.filter((q) => {
      const a = answers[q.id];
      return a !== undefined && a !== '' && (!Array.isArray(a) || a.length > 0);
    }).length;
  }, [answers, activeQuestions]);

  const handleAnswerChange = (val: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

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
    const targetQ = activeQuestions[idx];
    if (activeDomainFilter !== 'All' && targetQ.domain !== activeDomainFilter) {
      setActiveDomainFilter('All');
    }
    const newIdx = (activeDomainFilter === 'All' ? activeQuestions : filteredQuestions).findIndex(
      (q) => q.id === targetQ.id
    );
    setCurrentQuestionIndex(newIdx >= 0 ? newIdx : idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vyhodnocení testu
  const handleSubmitQuiz = async () => {
    const unAnswered = activeQuestions.length - answeredCount;
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

    activeQuestions.forEach((q) => {
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
      maxScore: activeQuestions.length,
      percentage: Math.round((totalScore / activeQuestions.length) * 100),
      domainScores,
    };

    const resp = respondent || {
      respondentId: 'PEDI-4A-AUTO',
      grade: '4. ročník',
      group: '4.A',
      quizMode: 'standard_20',
      consentGiven: true,
      startTime: new Date().toISOString(),
    };

    const completedAt = new Date().toISOString();
    const questionIds = activeQuestions.map((q) => q.id);

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
    localStorage.removeItem('pedi_active_questions');
    localStorage.removeItem('pedi_current_answers');
    localStorage.removeItem('pedi_current_index');
    localStorage.removeItem('pedi_last_submission');
    setRespondent(null);
    setActiveQuestions(getStandard20Questions());
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSecondsElapsed(0);
    setSubmission(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {!respondent && <IntroModal onStart={handleStartQuiz} />}

      {submission ? (
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
          <ResultSummary
            submission={submission}
            questions={activeQuestions}
            onRestart={handleRestart}
            onOpenResearchHub={() => setIsResearchHubOpen(true)}
          />
        </main>
      ) : respondent ? (
        <>
          <QuizHeader
            currentIndex={safeIndex}
            totalQuestions={activeQuestions.length}
            answeredCount={answeredCount}
            activeDomain={activeDomainFilter}
            onSelectDomain={(dom) => {
              setActiveDomainFilter(dom);
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
              questions={activeQuestions}
              currentIndex={activeQuestions.findIndex((q) => q.id === currentQuestion.id)}
              answers={answers}
              onSelectQuestion={handleSelectQuestionByIdx}
            />
          </main>
        </>
      ) : null}

      <ResearchHubModal
        isOpen={isResearchHubOpen}
        onClose={() => setIsResearchHubOpen(false)}
      />

      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>PEDI 2026 • Školní diagnostický nástroj (5 oblastí • 20 úloh)</span>
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

      <CookieConsent />
    </div>
  );
};
