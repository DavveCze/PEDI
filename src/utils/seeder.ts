import { QUESTIONS_20 } from '../data/questionsData';
import { DiagnosticDomain } from '../types/quiz';
import { encodeQuizResult, generateAnonymousId } from './crypto';

/**
 * Náhodné celé číslo v rozsahu [min, max]
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Vygeneruje realistickou simulaci odpovědí respondenta
 */
export async function generateMockSubmission(options?: {
  grade?: string;
  group?: string;
}): Promise<any> {
  const grade = options?.grade || '4. ročník';
  const groups = ['4.A', '4.B', '4.C', '4.D'];
  const group = options?.group || groups[randomInt(0, groups.length - 1)];
  const genders: ('female' | 'male' | 'unspecified')[] = ['female', 'male', 'unspecified'];
  const gender = genders[randomInt(0, genders.length - 1)];
  const respondentId = generateAnonymousId(group);

  // Čas v rozmezí 8 až 20 minut (480 až 1200 sekund)
  const timeSpentSeconds = randomInt(480, 1200);

  // Cílová pravděpodobnost správné odpovědi (mezi 50 % a 95 %)
  const targetAbility = Math.random() * 0.45 + 0.5;

  const answers: Record<number, string | string[]> = {};
  let totalScore = 0;

  const domainScores: Record<DiagnosticDomain, { score: number; max: number; percentage: number }> = {
    'Mediální obsah': { score: 0, max: 0, percentage: 0 },
    'Ověřování informací': { score: 0, max: 0, percentage: 0 },
    'Bezpečnost a soukromí': { score: 0, max: 0, percentage: 0 },
    'Digitální nástroje': { score: 0, max: 0, percentage: 0 },
    'Kritické využití AI': { score: 0, max: 0, percentage: 0 },
  };

  for (const q of QUESTIONS_20) {
    domainScores[q.domain].max += 1;
    const isCorrect = Math.random() < targetAbility;

    if (isCorrect) {
      answers[q.id] = q.correctAnswer;
      totalScore += 1;
      domainScores[q.domain].score += 1;
    } else {
      // Vygenerujeme chybnou odpověď
      if (q.type === 'true_false') {
        answers[q.id] = q.correctAnswer === 'PRAVDA' ? 'NEPRAVDA' : 'PRAVDA';
      } else if (q.type === 'secure_unsecure') {
        answers[q.id] = q.correctAnswer === 'ZABEZPEČÍ' ? 'NEZABEZPEČÍ' : 'ZABEZPEČÍ';
      } else if (q.type === 'grid_choice') {
        const wrongOpts = q.options.filter((o) => o !== q.correctAnswer);
        answers[q.id] = wrongOpts[randomInt(0, wrongOpts.length - 1)];
      } else if (q.type === 'multiple_choice') {
        // Zvolíme jinou kombinaci
        const opts = [...q.options];
        answers[q.id] = [opts[randomInt(0, opts.length - 1)]];
      } else {
        const wrongOpts = q.options.filter((o) => o !== q.correctAnswer);
        answers[q.id] = wrongOpts.length > 0 ? wrongOpts[randomInt(0, wrongOpts.length - 1)] : q.options[0];
      }
    }
  }

  // Výpočet procent pro domény
  for (const dom of Object.keys(domainScores) as DiagnosticDomain[]) {
    const ds = domainScores[dom];
    ds.percentage = ds.max > 0 ? Math.round((ds.score / ds.max) * 100) : 0;
  }

  const respondent = {
    respondentId,
    grade,
    group,
    gender,
    age: randomInt(18, 20),
    consentGiven: true,
    consentTimestamp: new Date().toISOString(),
    startTime: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
  };

  const completedAt = new Date().toISOString();
  const questionIds = QUESTIONS_20.map((q) => q.id);

  const score = {
    totalScore,
    maxScore: QUESTIONS_20.length,
    percentage: Math.round((totalScore / QUESTIONS_20.length) * 100),
    domainScores,
  };

  const encryptedToken = await encodeQuizResult({
    respondent,
    questionIds,
    answers,
    score,
    timeSpentSeconds,
    completedAt,
  });

  return {
    rid: respondentId,
    grd: grade,
    grp: group,
    gen: gender,
    age: respondent.age,
    mode: 'standard_20',
    qids: questionIds,
    ts: completedAt,
    dur: timeSpentSeconds,
    sc: totalScore,
    max: QUESTIONS_20.length,
    pct: score.percentage,
    doms: domainScores,
    ans: answers,
    encryptedToken,
  };
}

/**
 * Vygeneruje N vzorových respondentů s kompletními odpověďmi a časy 8-20 minut
 */
export async function generateBatchMockSubmissions(count: number = 10): Promise<any[]> {
  const result: any[] = [];
  for (let i = 0; i < count; i++) {
    const item = await generateMockSubmission();
    result.push(item);
  }
  return result;
}
