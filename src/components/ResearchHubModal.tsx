import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Plus,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Users,
  Award,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { decodeQuizResult, exportResultsToCsv } from '../utils/crypto';
import { Question } from '../types/quiz';

interface ResearchHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

export const ResearchHubModal: React.FC<ResearchHubModalProps> = ({
  isOpen,
  onClose,
  questions,
}) => {
  const [tokensInput, setTokensInput] = useState('');
  const [submissions, setSubmissions] = useState<any[]>(() => {
    const saved = localStorage.getItem('pedi_aggregated_submissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Uložení do LocalStorage
  useEffect(() => {
    localStorage.setItem('pedi_aggregated_submissions', JSON.stringify(submissions));
  }, [submissions]);

  if (!isOpen) return null;

  // Import vložených kódů
  const handleImportTokens = async () => {
    if (!tokensInput.trim()) return;

    const lines = tokensInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let successCount = 0;
    let errorCount = 0;
    const newItems: any[] = [];

    for (const line of lines) {
      const res = await decodeQuizResult(line);
      if (res.valid && res.data) {
        // Kontrola duplicity podle rid
        const exists = submissions.some((s) => s.rid === res.data.rid);
        if (!exists && !newItems.some((s) => s.rid === res.data.rid)) {
          newItems.push(res.data);
          successCount++;
        }
      } else {
        errorCount++;
      }
    }

    if (newItems.length > 0) {
      setSubmissions((prev) => [...prev, ...newItems]);
    }

    setImportStatus(
      `Načteno: ${successCount} nových validních výsledků. Chybných/duplicitních: ${errorCount}.`
    );
    setTokensInput('');
  };

  // Vymazání databáze
  const handleClearAll = () => {
    if (window.confirm('Opravdu si přejete smazat všechny načtené výzkumné výsledky z tohoto zařízení?')) {
      setSubmissions([]);
      setImportStatus('Databáze vymazána.');
    }
  };

  // Export do CSV pro Excel
  const handleExportCsv = () => {
    if (submissions.length === 0) {
      alert('V databázi zatím nejsou žádné výsledky k exportu.');
      return;
    }
    const csvContent = exportResultsToCsv(submissions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PEDI_vyzkumna_data_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Vložení ukázkových dat pro demonstraci
  const handleLoadDemoData = async () => {
    const demoSubmissions = [
      {
        rid: 'PEDI-4A-D821',
        grd: '4. ročník',
        grp: '4.A',
        gen: 'female',
        age: 19,
        ts: new Date().toISOString(),
        dur: 840,
        sc: 41,
        max: 46,
        pct: 89,
        mSc: 17,
        iSc: 24,
        ans: {},
      },
      {
        rid: 'PEDI-4A-K943',
        grd: '4. ročník',
        grp: '4.A',
        gen: 'male',
        age: 19,
        ts: new Date().toISOString(),
        dur: 920,
        sc: 36,
        max: 46,
        pct: 78,
        mSc: 15,
        iSc: 21,
        ans: {},
      },
      {
        rid: 'PEDI-4B-M112',
        grd: '4. ročník',
        grp: '4.B',
        gen: 'female',
        age: 19,
        ts: new Date().toISOString(),
        dur: 790,
        sc: 38,
        max: 46,
        pct: 83,
        mSc: 16,
        iSc: 22,
        ans: {},
      },
      {
        rid: 'PEDI-4B-P504',
        grd: '4. ročník',
        grp: '4.B',
        gen: 'male',
        age: 20,
        ts: new Date().toISOString(),
        dur: 1100,
        sc: 29,
        max: 46,
        pct: 63,
        mSc: 12,
        iSc: 17,
        ans: {},
      },
    ];
    setSubmissions((prev) => [...prev, ...demoSubmissions]);
    setImportStatus('Vloženy 4 anonymní ukázkové záznamy pro otestování analytiky.');
  };

  // Výpočet úspěšnosti položek pro pedagogickou diagnostiku
  const itemDifficulties = questions.slice(0, 10).map((q) => {
    if (submissions.length === 0) return { id: q.id, theme: q.theme, rate: 0 };
    const correctCount = submissions.filter((s) => {
      const uAns = s.ans?.[q.id];
      if (Array.isArray(q.correctAnswer)) {
        return Array.isArray(uAns) && q.correctAnswer.every((v) => uAns.includes(v));
      }
      return uAns === q.correctAnswer;
    }).length;
    return {
      id: q.id,
      theme: q.theme,
      rate: Math.round((correctCount / submissions.length) * 100),
    };
  });

  const totalN = submissions.length;
  const avgScore = totalN > 0 ? (submissions.reduce((acc, s) => acc + (s.sc || 0), 0) / totalN).toFixed(1) : '0';
  const avgPct = totalN > 0 ? (submissions.reduce((acc, s) => acc + (s.pct || 0), 0) / totalN).toFixed(1) : '0';
  const avgMedia = totalN > 0 ? (submissions.reduce((acc, s) => acc + (s.mSc || 0), 0) / totalN).toFixed(1) : '0';
  const avgIt = totalN > 0 ? (submissions.reduce((acc, s) => acc + (s.iSc || 0), 0) / totalN).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Záhlaví panelu */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Výzkumný analytický panel (Research Hub)
              </h2>
              <p className="text-xs text-slate-400">
                Agregace anonymizovaných kódů a statistika pro seminární práci z pedagogické diagnostiky
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hlavní scrollovatelný obsah */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Metriky souhrnu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
                <Users className="w-4 h-4" />
                <span>Velikost vzorku (N)</span>
              </div>
              <div className="text-2xl font-black text-indigo-950">{totalN} studentů</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                <Award className="w-4 h-4" />
                <span>Průměrné skóre</span>
              </div>
              <div className="text-2xl font-black text-emerald-950">
                {avgScore} / 46 <span className="text-xs font-medium text-emerald-700">({avgPct} %)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>Mediální gramotnost</span>
              </div>
              <div className="text-2xl font-black text-blue-950">{avgMedia} / 19 b</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>IT Fitness & Bezpečnost</span>
              </div>
              <div className="text-2xl font-black text-purple-950">{avgIt} / 27 b</div>
            </div>
          </div>

          {/* Vkládací formulář pro kódy */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                Vložit kódy výsledků od studentů
              </label>
              <button
                type="button"
                onClick={handleLoadDemoData}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Nahrát demo data (4 respondenti)
              </button>
            </div>

            <textarea
              value={tokensInput}
              onChange={(e) => setTokensInput(e.target.value)}
              placeholder="Sem vložte jeden nebo více kódů PEDI-RESULT-... (každý na nový řádek)"
              rows={3}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleImportTokens}
                disabled={!tokensInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Dekódovat a přidat do databáze
              </button>

              {importStatus && (
                <div className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
                  {importStatus}
                </div>
              )}
            </div>
          </div>

          {/* Seznam načtených respondentů */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Načtení respondenti</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                  {submissions.length}
                </span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={submissions.length === 0}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  title="Stáhnout kompletní dataset ve formátu CSV pro Excel / SPSS"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Exportovat do CSV (Excel)
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={submissions.length === 0}
                  className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-40 text-xs font-semibold rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Smazat vše
                </button>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                Zatím nebyly načteny žádné výsledky. Vložte kód od studenta výše nebo klikněte na „Nahrát demo data“.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-3.5 py-3">ID Respondenta</th>
                      <th className="px-3.5 py-3">Třída</th>
                      <th className="px-3.5 py-3">Pohlaví</th>
                      <th className="px-3.5 py-3">Čas</th>
                      <th className="px-3.5 py-3">Celkové Skóre</th>
                      <th className="px-3.5 py-3">Úspěšnost</th>
                      <th className="px-3.5 py-3">Mediální</th>
                      <th className="px-3.5 py-3">IT Fitness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {submissions.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">{sub.rid}</td>
                        <td className="px-3.5 py-2.5">{sub.grp || sub.grd}</td>
                        <td className="px-3.5 py-2.5">{sub.gen}</td>
                        <td className="px-3.5 py-2.5">{Math.round((sub.dur || 0) / 60)} min</td>
                        <td className="px-3.5 py-2.5 font-bold text-slate-900">{sub.sc} / 46</td>
                        <td className="px-3.5 py-2.5">
                          <span className="px-2 py-0.5 rounded-md font-semibold bg-indigo-50 text-indigo-700">
                            {sub.pct} %
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5">{sub.mSc} / 19</td>
                        <td className="px-3.5 py-2.5">{sub.iSc} / 27</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pedagogická analýza obtížnosti položek (Item Difficulty Index) */}
            {submissions.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Diagnostická obtížnost vybraných položek (Úspěšnost %):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {itemDifficulties.map((item) => (
                    <div key={item.id} className="p-2 bg-white rounded-xl border border-slate-200">
                      <div className="font-semibold text-slate-800">Q{item.id}: {item.theme}</div>
                      <div className="text-indigo-600 font-bold mt-0.5">{item.rate} % správně</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spodní lišta */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Standard pro pedagogickou diagnostiku 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition-colors"
          >
            Zavřít panel
          </button>
        </div>
      </div>
    </div>
  );
};
