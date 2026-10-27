import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

export const CookieConsent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pedi_cookie_consent');
    if (!saved) {
      setIsOpen(true);
    }
  }, []);

  const saveConsent = (preferences: CookiePreferences) => {
    localStorage.setItem('pedi_cookie_consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }));
    setIsOpen(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true });
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false });
  };

  const handleSaveCustom = () => {
    saveConsent({ necessary: true, analytics: analyticsAllowed });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 left-3 z-40 bg-white/90 hover:bg-white text-slate-600 hover:text-indigo-600 p-2 rounded-full border border-slate-200 shadow-sm text-xs flex items-center gap-1.5 transition-colors"
        title="Nastavení soukromí a cookies"
      >
        <Cookie className="w-4 h-4 text-indigo-500" />
        <span className="hidden sm:inline font-medium">Soukromí & GDPR</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm text-slate-600">
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                Informace o ochraně osobních údajů a lokálním úložišti
              </h3>
              <p className="leading-relaxed">
                Tento diagnostický nástroj slouží výhradně pro účely akademické seminární práce v předmětu <strong>Pedagogická diagnostika</strong>.
                Veškeré výsledky testů jsou plně <strong>anonymizované</strong>, neobsahují vaše jméno, e-mail ani IP adresu. Pro uchování rozpracovaného testu využíváme nezbytné lokální úložiště prohlížeče (LocalStorage).
              </p>
            </div>
          </div>

          {showSettings && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-medium text-slate-800 text-sm">Nezbytné úložiště (Funkčnost testu)</div>
                  <div className="text-xs text-slate-500">Uložení rozpracovaných odpovědí v prohlížeči, aby nedošlo ke ztrátě dat při obnovení stránky.</div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">Vždy aktivní</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-medium text-slate-800 text-sm">Anonymní statistická telemetrie</div>
                  <div className="text-xs text-slate-500">Měření doby řešení úloh pro pedagogicko-diagnostické vyhodnocení obtížnosti.</div>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              {showSettings ? 'Skrýt podrobnosti' : 'Nastavení předvoleb'}
            </button>
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Pouze nezbytné
            </button>
            {showSettings ? (
              <button
                onClick={handleSaveCustom}
                className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Uložit výběr
              </button>
            ) : (
              <button
                onClick={handleAcceptAll}
                className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Rozumím a přijmout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
