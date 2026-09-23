import React from 'react';
import { FileText, Edit3, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenPasteModal: () => void;
  hasJob: boolean;
  wordCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPasteModal,
  hasJob,
  wordCount,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-black dark:text-white tracking-tight">
                  JD Assistant
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Grounded Verification Engine
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate hidden sm:block">
                Strict zero-hallucination <span className="opacity-40">·</span> Line-cited Q&amp;A <span className="opacity-40">·</span> Targeted interview prep
              </p>
            </div>
          </div>

          {/* Action Zone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {hasJob && (
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold">Indexed</span>
                <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">{wordCount.toLocaleString()} words</span>
              </div>
            )}

            {hasJob && (
              <button
                type="button"
                onClick={onOpenPasteModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-150 transition-colors cursor-pointer shadow-xs"
                title="Edit current job description text"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit JD</span>
              </button>
            )}

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-neutral-800" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
