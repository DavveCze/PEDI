import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Users,
  Award,
  Clock,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  BarChart3,
  LogOut,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { decodeQuizResult, exportResultsToCsv } from '../utils/crypto';
import { generateBatchMockSubmissions } from '../utils/seeder';
import { DiagnosticDomain } from '../types/quiz';

const TEACHER_ACCESS_CODE = '0AB3-C5HE';

interface TeacherPageProps {
  onBackToQuiz: () => void;
}

export const TeacherPage: React.FC<TeacherPageProps> = ({ onBackToQuiz }) => {
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('pedi_teacher_auth') === 'true';
  });
  const [authError, setAuthError] = useState(false);

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
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('pedi_aggregated_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = accessCodeInput.trim().toUpperCase();
    if (clean === TEACHER_ACCESS_CODE) {
      setIsAuthenticated(true);
      setAuthError(false);
      localStorage.setItem('pedi_teacher_auth', 'true');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pedi_teacher_auth');
    setAccessCodeInput('');
  };

  // Import vložených kódů od studentů
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

  // Generování dat seederem (8-20 minut a kompletní odpovědi)
  const handleGenerateData = async (count: number) => {
    setIsGenerating(true);
    try {
      const generated = await generateBatchMockSubmissions(count);
      setSubmissions((prev) => [...prev, ...generated]);
      setImportStatus(`Úspěšně vygenerováno ${count} realistických respondentů s odpověďmi a časy 8–20 min.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Opravdu chcete smazat všechny načtené výzkumné výsledky z tohoto zařízení?')) {
      setSubmissions([]);
      setImportStatus('Databáze výzkumných výsledků byla vymazána.');
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

  // --- STATISTICKÉ VÝPOČTY PRO GRAFY ---
  const totalN = submissions.length;
  const avgPct = totalN > 0 ? Math.round(submissions.reduce((acc, s) => acc + (s.pct || 0), 0) / totalN) : 0;
  const avgScore = totalN > 0 ? (submissions.reduce((acc, s) => acc + (s.sc || 0), 0) / totalN).toFixed(1) : '0';
  const avgSeconds = totalN > 0 ? Math.round(submissions.reduce((acc, s) => acc + (s.dur || 0), 0) / totalN) : 0;

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} min ${s} s`;
  };

  // 1. Rozdělení celkové úspěšnosti (Histogram distribuce skóre)
  const scoreDistribution = {
    expert: submissions.filter((s) => s.pct >= 85).length,
    advanced: submissions.filter((s) => s.pct >= 70 && s.pct < 85).length,
    standard: submissions.filter((s) => s.pct >= 50 && s.pct < 70).length,
    basic: submissions.filter((s) => s.pct < 50).length,
  };

  // 2. Úspěšnost v 5 jednotlivých kategoriích
  const domains: DiagnosticDomain[] = [
    'Mediální obsah',
    'Ověřování informací',
    'Bezpečnost a soukromí',
    'Digitální nástroje',
    'Kritické využití AI',
  ];

  const domainAverages = domains.map((domain) => {
    if (totalN === 0) return { domain, avgPct: 0, avgScore: 0, max: 0 };
    let sumPct = 0;
    let sumScore = 0;
    let maxItems = 0;

    submissions.forEach((s) => {
      const dom = s.doms?.[domain];
      if (dom) {
        sumPct += dom.percentage || 0;
        sumScore += dom.score || 0;
        maxItems = dom.max || maxItems;
      }
    });

    return {
      domain,
      avgPct: Math.round(sumPct / totalN),
      avgScore: (sumScore / totalN).toFixed(1),
      max: maxItems,
    };
  });

  // 3. Čas na kategorii (odhad poměru času podle položek)
  // Celkem 20 položek: Mediální (5/20 = 25%), Ověřování (4/20 = 20%), Bezpečnost (5/20 = 25%), Nástroje (3/20 = 15%), AI (3/20 = 15%)
  const domainTimeWeights: Record<DiagnosticDomain, number> = {
    'Mediální obsah': 5 / 20,
    'Ověřování informací': 4 / 20,
    'Bezpečnost a soukromí': 5 / 20,
    'Digitální nástroje': 3 / 20,
    'Kritické využití AI': 3 / 20,
  };

  const domainTimes = domains.map((domain) => {
    const weight = domainTimeWeights[domain];
    const estimatedSeconds = Math.round(avgSeconds * weight);
    return {
      domain,
      seconds: estimatedSeconds,
      formatted: formatMinSec(estimatedSeconds),
      weightPercent: Math.round(weight * 100),
    };
  });

  // --- 1. PŘIHLAŠOVACÍ OBRAZOVKA (KÓD 0AB3-C5HE) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-300 overflow-hidden">
          <div className="p-6 bg-slate-900 text-white text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold">Učitelský & Výzkumný panel</h1>
            <p className="text-xs text-slate-400 mt-1">
              Vstup je vyhrazen pro vyučující a autory seminární práce.
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Zadejte 8místný autorizační kód
              </label>
              <input
                type="text"
                value={accessCodeInput}
                onChange={(e) => {
                  setAccessCodeInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="0AB3-C5HE"
                className="w-full px-3.5 py-3 text-center tracking-widest font-mono font-bold text-base rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                maxLength={9}
                autoFocus
              />
              <div className="text-[11px] text-slate-500 mt-1 text-center">
                Výchozí kód pro přístup: <strong className="font-mono text-slate-700">0AB3-C5HE</strong>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs text-center font-medium">
                Neplatný autorizační kód. Zkontrolujte zadání.
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ověřit a vstoupit</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToQuiz}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Zpět na studentský test</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- 2. UČITELSKÝ PANEL PO PŘIHLÁŠENÍ ---
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 pb-16">
      {/* Záhlaví učitelského panelu */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToQuiz}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Zpět na studentský test"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base tracking-tight text-white">
                  Administrace a Výzkumný panel PEDI 2026
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                  Přihlášen
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Sběr dat a analýza výsledků 4. ročníku pro seminární práci
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={submissions.length === 0}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportovat</span> CSV
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Odhlásit se z panelu"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Odhlásit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 w-full space-y-6">
        {/* Metriky souhrnu */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-white border border-slate-300 rounded-2xl shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <Users className="w-4 h-4 text-blue-700" />
              <span>Celkem respondentů</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{totalN}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">studentů 4. ročníku</div>
          </div>

          <div className="p-4 bg-white border border-slate-300 rounded-2xl shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Průměrné skóre</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {avgScore} <span className="text-sm font-semibold text-slate-500">/ 20</span>
            </div>
            <div className="text-[11px] text-emerald-800 font-bold mt-0.5">{avgPct} % celkem</div>
          </div>

          <div className="p-4 bg-white border border-slate-300 rounded-2xl shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Průměrný čas testu</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {totalN > 0 ? formatMinSec(avgSeconds) : '0 min'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">rozsah 8–20 minut</div>
          </div>

          <div className="p-4 bg-white border border-slate-300 rounded-2xl shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <BarChart3 className="w-4 h-4 text-purple-700" />
              <span>Diagnostické oblasti</span>
            </div>
            <div className="text-2xl font-black text-slate-900">5</div>
            <div className="text-[11px] text-slate-500 mt-0.5">20 položek (5+4+5+3+3)</div>
          </div>
        </div>

        {/* --- 3 POŽADOVANÉ GRAFY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* GRAF 1: Celková úspěšnost (Distribuce úrovní) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  1. Celková úspěšnost studentů
                </h3>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Ø {avgPct} %
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">
                Rozdělení respondentů do 4 výkonnostních pásem dle celkového zisku bodů.
              </p>

              {totalN === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">Žádná data k zobrazení</div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span>Výborná (85–100 %)</span>
                      <strong className="text-slate-900">{scoreDistribution.expert} studentů</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full"
                        style={{ width: `${(scoreDistribution.expert / totalN) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span>Pokročilá (70–84 %)</span>
                      <strong className="text-slate-900">{scoreDistribution.advanced} studentů</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full"
                        style={{ width: `${(scoreDistribution.advanced / totalN) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span>Standardní (50–69 %)</span>
                      <strong className="text-slate-900">{scoreDistribution.standard} studentů</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full"
                        style={{ width: `${(scoreDistribution.standard / totalN) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span>Základní (pod 50 %)</span>
                      <strong className="text-slate-900">{scoreDistribution.basic} studentů</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-600 h-full"
                        style={{ width: `${(scoreDistribution.basic / totalN) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>Průměrný zisk bodů:</span>
              <strong className="text-slate-800">{avgScore} z 20 bodů</strong>
            </div>
          </div>

          {/* GRAF 2: Úspěšnost v jednotlivých kategoriích */}
          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  2. Úspěšnost podle kategorií
                </h3>
                <span className="text-xs text-slate-500 font-medium">5 oblastí</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">
                Průměrná procentuální úspěšnost ve všech 5 sledovaných oblastech.
              </p>

              {totalN === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">Žádná data k zobrazení</div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  {domainAverages.map((item) => (
                    <div key={item.domain}>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span className="font-medium truncate max-w-[170px]" title={item.domain}>
                          {item.domain}
                        </span>
                        <strong className="text-slate-900">{item.avgPct} %</strong>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-700 h-full rounded-full transition-all duration-300"
                          style={{ width: `${item.avgPct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>Nejúspěšnější kategorie:</span>
              <strong className="text-slate-800">
                {totalN > 0
                  ? [...domainAverages].sort((a, b) => b.avgPct - a.avgPct)[0]?.domain
                  : '–'}
              </strong>
            </div>
          </div>

          {/* GRAF 3: Čas na kategorii */}
          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  3. Odhadovaný čas na kategorii
                </h3>
                <span className="text-xs text-slate-500 font-medium font-mono">
                  {formatMinSec(avgSeconds)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">
                Průměrné trvání řešení úloh rozpočtené na jednotlivé tematické bloky.
              </p>

              {totalN === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">Žádná data k zobrazení</div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  {domainTimes.map((item) => (
                    <div key={item.domain}>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span className="font-medium truncate max-w-[170px]" title={item.domain}>
                          {item.domain}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{item.formatted}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${item.weightPercent * 2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>Celkový průměrný čas:</span>
              <strong className="text-slate-800">{totalN > 0 ? formatMinSec(avgSeconds) : '–'}</strong>
            </div>
          </div>
        </div>

        {/* --- NÁSTROJE PRO SBĚR A GENERÁTOR DAT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Generátor dat (Seeder 8-20 minut s odpověďmi) */}
          <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-700" />
                Generátor testovacích dat (Seeder)
              </h3>
              <span className="text-[11px] text-slate-500">Čas: 8–20 minut</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vygeneruje syntetické respondenty s reálnými odpověďmi na všech 20 otázek, rozpadem skóre po 5 kategoriích a délkou vyplňování v rozmezí 480–1200 sekund.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleGenerateData(5)}
                disabled={isGenerating}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-300"
              >
                + 5 respondentů
              </button>
              <button
                type="button"
                onClick={() => handleGenerateData(15)}
                disabled={isGenerating}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-300"
              >
                + 15 respondentů
              </button>
              <button
                type="button"
                onClick={() => handleGenerateData(30)}
                disabled={isGenerating}
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                + 30 respondentů (Třída)
              </button>
            </div>
          </div>

          {/* 2. Vložení šifrovaných kódů studentů */}
          <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-slate-700" />
              Vložit kódy od studentů (PEDI-RESULT-...)
            </h3>
            <textarea
              value={tokensInput}
              onChange={(e) => setTokensInput(e.target.value)}
              placeholder="Vložte kódy ze schránky (každý kód na nový řádek)..."
              rows={2}
              className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleImportTokens}
                disabled={!tokensInput.trim()}
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Dekódovat a přidat do databáze
              </button>
              {importStatus && (
                <span className="text-[11px] text-slate-600 font-medium truncate max-w-[200px]" title={importStatus}>
                  {importStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* --- TABULKA RESPONDENTŮ S EXPORTEM --- */}
        <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Databáze výsledků ({submissions.length} záznamů)
              </h3>
              <p className="text-[11px] text-slate-500">
                Data obsahují kompletní vektory odpovědí na 20 položek, skóre a časy.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={submissions.length === 0}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Stáhnout CSV pro Excel / SPSS
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={submissions.length === 0}
                className="px-3 py-2 text-rose-700 hover:bg-rose-50 disabled:opacity-40 font-semibold text-xs rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Smazat data
              </button>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              V databázi zatím nejsou žádné záznamy. Vložte kódy od studentů nebo použijte Generátor dat.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[10px] sticky top-0">
                  <tr>
                    <th className="px-3 py-2.5">ID Respondenta</th>
                    <th className="px-3 py-2.5">Třída</th>
                    <th className="px-3 py-2.5">Čas řešení</th>
                    <th className="px-3 py-2.5">Skóre</th>
                    <th className="px-3 py-2.5">Úspěšnost</th>
                    <th className="px-3 py-2.5">Mediální</th>
                    <th className="px-3 py-2.5">Ověřování</th>
                    <th className="px-3 py-2.5">Bezpečnost</th>
                    <th className="px-3 py-2.5">Nástroje</th>
                    <th className="px-3 py-2.5">AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {submissions.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 font-mono text-[11px]">
                      <td className="px-3 py-2 font-bold text-slate-900">{sub.rid}</td>
                      <td className="px-3 py-2 text-slate-700 font-sans">{sub.grp || sub.grd}</td>
                      <td className="px-3 py-2 text-slate-600">{formatMinSec(sub.dur || 0)}</td>
                      <td className="px-3 py-2 font-bold text-slate-900">{sub.sc} / 20</td>
                      <td className="px-3 py-2 font-bold text-blue-700">{sub.pct} %</td>
                      <td className="px-3 py-2 text-slate-600">{sub.doms?.['Mediální obsah']?.score ?? '-'}/5</td>
                      <td className="px-3 py-2 text-slate-600">{sub.doms?.['Ověřování informací']?.score ?? '-'}/4</td>
                      <td className="px-3 py-2 text-slate-600">{sub.doms?.['Bezpečnost a soukromí']?.score ?? '-'}/5</td>
                      <td className="px-3 py-2 text-slate-600">{sub.doms?.['Digitální nástroje']?.score ?? '-'}/3</td>
                      <td className="px-3 py-2 text-slate-600">{sub.doms?.['Kritické využití AI']?.score ?? '-'}/3</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
