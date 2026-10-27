import { QuizSubmission, ScoreBreakdown } from '../types/quiz';

const PEDI_SALT = 'PEDI_DIAG_SECRET_SALT_2026_V1';

/**
 * Jednoduchý deterministický HMAC / Hash podpis pro integritu a prevenci falšování
 */
async function generateSignature(dataString: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(PEDI_SALT);
  const data = encoder.encode(dataString);

  try {
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, data);
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).slice(0, 12).join('');
  } catch {
    // Fallback jednoduchý hash pokud subtle crypto není dostupné
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      hash = ((hash << 5) - hash) + dataString.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

/**
 * Bezpečně zakóduje a zašifruje výsledek testu do přenosného řetězce (tokenu)
 */
export async function encodeQuizResult(submission: {
  respondent: QuizSubmission['respondent'];
  answers: QuizSubmission['answers'];
  score: ScoreBreakdown;
  timeSpentSeconds: number;
  completedAt: string;
}): Promise<string> {
  const payload = {
    v: 1,
    rid: submission.respondent.respondentId,
    grd: submission.respondent.grade,
    grp: submission.respondent.group || 'Standard',
    gen: submission.respondent.gender || 'unspecified',
    age: submission.respondent.age || 19,
    ts: submission.completedAt,
    dur: submission.timeSpentSeconds,
    sc: submission.score.totalScore,
    max: submission.score.maxScore,
    pct: submission.score.percentage,
    mSc: submission.score.mediaGrammarScore,
    iSc: submission.score.itFitnessScore,
    ans: submission.answers,
  };

  const jsonString = JSON.stringify(payload);
  const base64Data = btoa(encodeURIComponent(jsonString));
  const signature = await generateSignature(base64Data);

  return `PEDI-RESULT-${base64Data}.${signature}`;
}

/**
 * Ověří a dekóduje zašifrovaný kód výsledku
 */
export async function decodeQuizResult(token: string): Promise<{
  valid: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const cleanToken = token.trim();
    if (!cleanToken.startsWith('PEDI-RESULT-')) {
      return { valid: false, error: 'Neplatný formát kódu (musí začínat PEDI-RESULT-)' };
    }

    const tokenBody = cleanToken.replace('PEDI-RESULT-', '');
    const parts = tokenBody.split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'Poškozený kontrolní formát tokenu.' };
    }

    const [base64Data, signature] = parts;
    const expectedSignature = await generateSignature(base64Data);

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Kontrolní podpis nesouhlasí! Data byla pozměněna.' };
    }

    const jsonString = decodeURIComponent(atob(base64Data));
    const parsed = JSON.parse(jsonString);

    return { valid: true, data: parsed };
  } catch (err: any) {
    return { valid: false, error: `Chyba při dekódování: ${err?.message || 'Neznámá chyba'}` };
  }
}

/**
 * Generuje anonymní ID studenta (např. PEDI-4A-8K3N)
 */
export function generateAnonymousId(grade: string = '4'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const cleanGrade = grade.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3) || '4R';
  return `PEDI-${cleanGrade}-${rand}`;
}

/**
 * Exportuje dekódovaná data z pole výsledků do CSV formátu pro seminární práci
 */
export function exportResultsToCsv(submissions: any[]): string {
  if (!submissions || submissions.length === 0) return '';

  const headers = [
    'Respondent_ID',
    'Rocnik_Trida',
    'Skupina',
    'Pohlavi',
    'Vek',
    'Datum_Cas',
    'Cas_sekundy',
    'Celkove_Skore',
    'Max_Skore',
    'Uspesnost_Procent',
    'Medialni_Gramotnost',
    'IT_Fitness',
    ...Array.from({ length: 46 }, (_, i) => `Q${i + 1}`),
  ];

  const rows = submissions.map(sub => {
    const qAnswers = Array.from({ length: 46 }, (_, i) => {
      const ans = sub.ans?.[i + 1];
      if (Array.isArray(ans)) {
        return `"${ans.join('; ')}"`;
      }
      return `"${ans ?? ''}"`;
    });

    return [
      `"${sub.rid || ''}"`,
      `"${sub.grd || ''}"`,
      `"${sub.grp || ''}"`,
      `"${sub.gen || ''}"`,
      sub.age || '',
      `"${sub.ts || ''}"`,
      sub.dur || 0,
      sub.sc || 0,
      sub.max || 46,
      sub.pct || 0,
      sub.mSc || 0,
      sub.iSc || 0,
      ...qAnswers,
    ].join(',');
  });

  // UTF-8 BOM pro bezchybné otevření v českém Microsoft Excelu
  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}
