import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Database, 
  Server, 
  Moon, 
  Sun, 
  Code2
} from 'lucide-react';
import taskApi from '../services/api';

export default function SettingsModal({
  isOpen,
  onClose,
  isDarkMode,
  toggleDarkMode,
}) {
  const [healthStatus, setHealthStatus] = useState('checking');

  useEffect(() => {
    if (!isOpen) return;
    taskApi.checkHealth()
      .then(() => setHealthStatus('online'))
      .catch(() => setHealthStatus('offline'));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                TaskFlow Settings & Info
              </h2>
              <p className="text-xs text-slate-400">
                Application status and presentation controls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              System Health
            </h4>
            
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Server className="w-4 h-4 text-brand-500" />
                  Express REST API
                </span>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${
                  healthStatus === 'online' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                }`}>
                  {healthStatus === 'online' ? 'Active' : 'Offline'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-500" />
                  Database
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  MongoDB / Mongoose
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  Frontend Engine
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  React 18 + Vite + Tailwind CSS
                </span>
              </div>
            </div>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Appearance Theme
              </div>
              <div className="text-[11px] text-slate-400">
                Persisted in browser localStorage
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              {isDarkMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isDarkMode ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
