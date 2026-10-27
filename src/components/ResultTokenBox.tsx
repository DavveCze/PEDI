import React, { useState } from 'react';
import { Copy, Check, Download, ShieldCheck } from 'lucide-react';
import { QuizSubmission } from '../types/quiz';

interface ResultTokenBoxProps {
  submission: QuizSubmission;
}

export const ResultTokenBox: React.FC<ResultTokenBoxProps> = ({ submission }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(submission.encryptedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = submission.encryptedToken;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    const dataBlob = new Blob(
      [
        JSON.stringify(
          {
            project: 'PEDI 2026 – Pedagogická diagnostika',
            respondentId: submission.respondent.respondentId,
            grade: submission.respondent.grade,
            group: submission.respondent.group,
            score: submission.score,
            completedAt: submission.completedAt,
            encryptedToken: submission.encryptedToken,
          },
          null,
          2
        ),
      ],
      { type: 'application/json;charset=utf-8' }
    );
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PEDI_vysledek_${submission.respondent.respondentId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-slate-800">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm sm:text-base font-bold text-white">
            Šifrovaný kód výsledku pro odevzdání
          </h3>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            HMAC SHA-256
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Tento kód obsahuje vaše anonymizované odpovědi a celkové skóre. Zkopírujte ho a zašlete vyučujícímu nebo vložte do odevzdávárny.
        </p>

        <textarea
          readOnly
          value={submission.encryptedToken}
          rows={3}
          className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-3 rounded-xl border border-slate-700 select-all resize-none focus:outline-none"
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className={`min-h-[48px] flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Zkopírováno do schránky!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Kopírovat kód do schránky</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="min-h-[48px] py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Stáhnout (.json)</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          ID respondenta: <strong className="text-white font-mono">{submission.respondent.respondentId}</strong> • Třída: {submission.respondent.group}
        </div>
      </div>
    </div>
  );
};
