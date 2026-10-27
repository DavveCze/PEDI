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
} from 'lucide-react';
import { decodeQuizResult, exportResultsToCsv } from '../utils/crypto';
import { Question } from '../types/quiz';

interface ResearchHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions?: Question[];
}

export const ResearchHubModal: React.FC<ResearchHubModalProps> = ({
  isOpen,
  onClose,
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

  useEffect(() => {
    localStorage.setItem('pedi_aggregated_submissions', JSON.stringify(submissions));
  }, [submissions]);

  if (!isOpen) return null;

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
      `Načteno: ${successCount} nových validních kódů. Chybných/duplicitních: ${errorCount}.`
    );
    setTokensInput('');
  };

  const handleClearAll = () => {
    if (window.confirm('Opravdu chcete smazat všechny načtené výzkumné výsledky z tohoto zařízení?')) {
      setSubmissions([]);
      setImportStatus('Databáze vymazána.');
    }
  };

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

  const handleLoadDemoData = () => {
    const demoSubmissions = [
      {
        rid: 'PEDI-4A-D821',
        grd: '4. ročník',
        grp: '4.A',
        gen: 'female',
        age: 19,
        qids: [1, 2, 4, 8, 15, 3, 7, 9, 10, 6, 19, 29, 31, 34, 35, 40, 44, 13, 20, 22],
        ts: new Date().toISOString(),
        dur: 620,
        sc: 18,
        max: 20,
        pct: 90,
        doms: {
          'Mediální obsah': { score: 5, max: 5, percentage: 100 },
          'Ověřování informací': { score: 4, max: 4, percentage: 100 },
          'Bezpečnost a soukromí': { score: 4, max: 5, percentage: 80 },
          'Digitální nástroje': { score: 2, max: 3, percentage: 67 },
          'Kritické využití AI': { score: 3, max: 3, percentage: 100 },
        },
        ans: {},
      },
      {
        rid: 'PEDI-4A-K943',
        grd: '4. ročník',
        grp: '4.A',
        gen: 'male',
        age: 19,
        qids: [1, 2, 4, 8, 15, 3, 7, 9, 10, 6, 19, 29, 31, 34, 35, 40, 44, 13, 20, 22],
        ts: new Date().toISOString(),
        dur: 710,
        sc: 15,
        max: 20,
        pct: 75,
        doms: {
          'Mediální obsah': { score: 4, max: 5, percentage: 80 },
          'Ověřování informací': { score: 3, max: 4, percentage: 75 },
          'Bezpečnost a soukromí': { score: 4, max: 5, percentage: 80 },
          'Digitální nástroje': { score: 2, max: 3, percentage: 67 },
          'Kritické využití AI': { score: 2, max: 3, percentage: 67 },
        },
        ans: {},
      },
      {
        rid: 'PEDI-4B-M112',
        grd: '4. ročník',
        grp: '4.B',
        gen: 'female',
        age: 19,
        qids: [1, 2, 4, 8, 15, 3, 7, 9, 10, 6, 19, 29, 31, 34, 35, 40, 44, 13, 20, 22],
        ts: new Date().toISOString(),
        dur: 590,
        sc: 16,
        max: 20,
        pct: 80,
        doms: {
          'Mediální obsah': { score: 4, max: 5, percentage: 80 },
          'Ověřování informací': { score: 3, max: 4, percentage: 75 },
          'Bezpečnost a soukromí': { score: 4, max: 5, percentage: 80 },
          'Digitální nástroje': { score: 2, max: 3, percentage: 67 },
          'Kritické využití AI': { score: 3, max: 3, percentage: 100 },
        },
        ans: {},
      },
    ];
    setSubmissions((prev) => [...prev, ...demoSubmissions]);
    setImportStatus('Vloženy 3 anonymní ukázkové záznamy pro otestování analytiky.');
  };

  const totalN = submissions.length;
  const avgPct = totalN > 0 ? (submissions.reduce((acc, s) => acc + (s.pct || 0), 0) / totalN).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Záhlaví panelu */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-slate-300" />
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Výzkumný analytický panel (Research Hub)
              </h2>
              <p className="text-[11px] text-slate-400">
                Agregace anonymních výsledků pro seminární práci z pedagogické diagnostiky
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hlavní obsah */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Metriky souhrnu */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-0.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Velikost vzorku (N)</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{totalN} studentů</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-0.5">
                <Award className="w-3.5 h-3.5 text-blue-700" />
                <span>Průměrná úspěšnost</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{avgPct} %</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
              <div className="text-[11px] font-semibold text-slate-600 mb-0.5">Diagnostické oblasti</div>
              <div className="text-xs font-bold text-slate-900 mt-1">5 oblastí (20 úloh)</div>
            </div>
          </div>

          {/* Vkládací pole pro kódy */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                Vložit kódy studentů
              </label>
              <button
                type="button"
                onClick={handleLoadDemoData}
                className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold"
              >
                Vložit testovací data (3 respondenti)
              </button>
            </div>

            <textarea
              value={tokensInput}
              onChange={(e) => setTokensInput(e.target.value)}
              placeholder="Vložte kódy PEDI-RESULT-... (každý na nový řádek)"
              rows={3}
              className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleImportTokens}
                disabled={!tokensInput.trim()}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Dekódovat a přidat
              </button>

              {importStatus && (
                <div className="text-[11px] text-slate-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
                  {importStatus}
                </div>
              )}
            </div>
          </div>

          {/* Tabulka */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs">
                Seznam načtených respondentů ({submissions.length})
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={submissions.length === 0}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold rounded-lg flex items-center gap-1.5"
                  title="Export do CSV (Excel)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Exportovat do CSV
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={submissions.length === 0}
                  className="px-2.5 py-1.5 text-rose-700 hover:bg-rose-50 disabled:opacity-40 font-semibold rounded-lg border border-rose-200 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Smazat
                </button>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                Zatím nebyly načteny žádné výsledky.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-3 py-2">ID Respondenta</th>
                      <th className="px-3 py-2">Třída</th>
                      <th className="px-3 py-2">Čas</th>
                      <th className="px-3 py-2">Skóre</th>
                      <th className="px-3 py-2">Úspěšnost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {submissions.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono font-bold text-slate-900">{sub.rid}</td>
                        <td className="px-3 py-2">{sub.grp || sub.grd}</td>
                        <td className="px-3 py-2">{Math.round((sub.dur || 0) / 60)} min</td>
                        <td className="px-3 py-2 font-bold text-slate-900">{sub.sc} / {sub.max || 20}</td>
                        <td className="px-3 py-2 font-semibold text-blue-700">{sub.pct} %</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Spodní lišta */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Metodika pedagogické diagnostiky 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            Zavřít
          </button>
        </div>
      </div>
    </div>
  );
};
