import React, { useState } from 'react';
import { Copy, Check, Download, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
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
      // Fallback
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
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              Šifrovaný kód výsledku pro odevzdání
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            HMAC Kontrolní podpis OK
          </span>
        </div>

        <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
          Tento kód obsahuje vaše anonymizované odpovědi, skóre a čas vyřešení, zabezpečené proti pozměnění. Zkopírujte ho a zašlete autorům výzkumu / vložte do školního systému.
        </p>

        {/* Textarea s tokenem */}
        <div className="relative">
          <textarea
            readOnly
            value={submission.encryptedToken}
            rows={3}
            className="w-full bg-slate-950/70 text-indigo-200 font-mono text-xs p-3.5 rounded-2xl border border-indigo-500/30 focus:outline-none select-all resize-none shadow-inner"
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />
        </div>

        {/* Tlačítka pro akci */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 min-w-[200px] py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              copied
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
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
            className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            title="Stáhnout zálohu výsledku ve formátu JSON"
          >
            <Download className="w-4 h-4" />
            <span>Stáhnout soubor (.json)</span>
          </button>
        </div>

        <div className="text-[11px] text-indigo-300/70 flex items-center gap-1.5 pt-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>ID respondenta: <strong>{submission.respondent.respondentId}</strong> • Třída: {submission.respondent.group}</span>
        </div>
      </div>
    </div>
  );
};
