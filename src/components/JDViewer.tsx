import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Edit3,
  ArrowUpCircle,
  Sparkles,
  ClipboardList,
  PlusCircle,
  Trash2,
  Loader2,
  X,
} from 'lucide-react';
import { parseJDLines } from '../utils/textUtils';

interface JDViewerProps {
  rawText: string;
  activeLineNumber: number | null;
  onClearActiveLine: () => void;
  onUpdateText: (newText: string) => void;
  isAnalyzing: boolean;
  onLoadSample?: () => void;
  isInitialEditing?: boolean;
  onResetToCustomInput?: () => void;
}

export const JDViewer: React.FC<JDViewerProps> = ({
  rawText,
  activeLineNumber,
  onClearActiveLine,
  onUpdateText,
  isAnalyzing,
  onLoadSample,
  isInitialEditing = false,
  onResetToCustomInput,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(isInitialEditing || !rawText.trim());
  const [draftText, setDraftText] = useState(rawText);

  // Sync draft when rawText changes externally
  useEffect(() => {
    setDraftText(rawText);
    if (!rawText.trim()) {
      setIsEditing(true);
    }
  }, [rawText]);

  // Sync isInitialEditing
  useEffect(() => {
    if (isInitialEditing) {
      setIsEditing(true);
    }
  }, [isInitialEditing]);

  const lineRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parsedLines = parseJDLines(rawText);

  // Auto-focus the JD textarea on initial entry or edit mode without scrolling the window
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus({ preventScroll: true });
    }
  }, [isEditing]);

  // Auto-scroll to active cited line within the viewer container only, never jumping the window
  useEffect(() => {
    if (activeLineNumber && lineRefs.current[activeLineNumber] && containerRef.current && !isEditing) {
      const lineEl = lineRefs.current[activeLineNumber];
      const container = containerRef.current;
      if (lineEl) {
        const targetScroll =
          lineEl.offsetTop - container.offsetTop - container.clientHeight / 2 + lineEl.clientHeight / 2;
        container.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth',
        });
      }
    }
  }, [activeLineNumber, isEditing]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyEdit = () => {
    if (draftText.trim() && !isAnalyzing) {
      onUpdateText(draftText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleApplyEdit();
    }
  };

  const handleClearDraft = () => {
    setDraftText('');
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const matchCount = searchTerm.trim()
    ? parsedLines.filter((l) => l.text.toLowerCase().includes(searchTerm.toLowerCase())).length
    : 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-2 border-t-black dark:border-t-white rounded-xl shadow-xs overflow-hidden transition-colors">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-black dark:text-white tracking-tight truncate">
            {isEditing ? 'Job Description Input' : 'Job Description Document'}
          </h2>
          {!isEditing && rawText.trim() && (
            <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-0.5 rounded-full hidden sm:inline">
              Indexed &amp; Grounded
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {!isEditing && rawText.trim() ? (
            <>
              {/* Search input with match count */}
              <div className="relative w-32 sm:w-44">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search in JD..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-8 pr-7 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {searchTerm.trim() && (
                <span className="hidden md:inline text-[11px] font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
                  {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                </span>
              )}

              <button
                type="button"
                onClick={handleCopyAll}
                className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                title="Copy entire JD"
                aria-label="Copy entire job description"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {onResetToCustomInput && (
                <button
                  type="button"
                  onClick={onResetToCustomInput}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
                  title="Clear loaded job and enter custom job input"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-black dark:text-white" />
                  <span className="hidden sm:inline">New Custom Job</span>
                  <span className="sm:hidden">New</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                title="Edit JD text"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {rawText.trim() && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={handleApplyEdit}
                disabled={!draftText.trim() || isAnalyzing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all cursor-pointer shadow-xs"
                title="Click to analyze and ground this job description"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-500" />
                    <span>Analyze Job</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Citation Alert Banner */}
      {activeLineNumber && !isEditing && (
        <div className="bg-amber-50 dark:bg-amber-950/70 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-amber-800 dark:text-amber-300 shrink-0">
              Source Quote (Line {activeLineNumber}):
            </span>
            <span className="text-amber-950 dark:text-amber-100 truncate italic">
              "{parsedLines[activeLineNumber - 1]?.text || ''}"
            </span>
          </div>
          <button
            type="button"
            onClick={onClearActiveLine}
            className="text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 underline shrink-0 ml-3 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Body: Editor or Natural Document Reader */}
      <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
        {isEditing ? (
          <div className="flex-1 min-h-0 flex flex-col bg-neutral-50/60 dark:bg-neutral-900/60">
            {/* Top Toolbar inside editor */}
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>Paste or Type Job Description</span>
              </label>

              <div className="flex items-center gap-3">
                {draftText.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium cursor-pointer"
                    title="Clear text field"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}

                {onLoadSample && (
                  <button
                    type="button"
                    onClick={onLoadSample}
                    className="text-xs text-neutral-900 dark:text-white hover:underline font-semibold cursor-pointer"
                  >
                    Load sample job for quick testing
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Textarea */}
            <div className="flex-1 min-h-0 p-3 sm:p-4 flex flex-col">
              <textarea
                ref={textareaRef}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste any job description here (e.g. from LinkedIn, Greenhouse, Lever, Ashby, or company careers page)...

Include the role title, requirements, tech stack, location/remote policy, and any mentioned benefits. The system will index every part and ground all Q&A and interview prep directly against it."
                className="w-full flex-1 min-h-0 p-4 text-xs sm:text-sm font-sans leading-relaxed bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/70 dark:focus:ring-white/70 resize-none shadow-2xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              />
            </div>

            {/* Pinned Bottom Action Bar - ALWAYS VISIBLE */}
            <div className="shrink-0 p-3 sm:px-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-neutral-900 dark:text-white font-mono tabular-nums">
                  {draftText.trim()
                    ? `${draftText.trim().split(/\s+/).length.toLocaleString()} words · ${draftText.length.toLocaleString()} chars`
                    : 'Paste a job description to begin'}
                </span>
                {draftText.trim() && (
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500 hidden sm:inline">
                    (or press Ctrl + Enter)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {rawText.trim() && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-700"
                  >
                    Back to Reader
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleApplyEdit}
                  disabled={!draftText.trim() || isAnalyzing}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                  title="Click to analyze and ground this job description"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
                      <span>Analyzing &amp; Grounding Job...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300 dark:text-amber-500" />
                      <span>Analyze &amp; Ground Job</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : !rawText.trim() ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white flex items-center justify-center mb-3">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">No Job Description Loaded</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-1 mb-4">
              Paste a custom job description to start grounded Q&amp;A and interview prep.
            </p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-lg shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Paste Job Description</span>
            </button>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 text-xs sm:text-sm space-y-1.5 bg-white dark:bg-neutral-900 scroll-smooth"
          >
            {parsedLines.map((line) => {
              const isActive = activeLineNumber === line.lineNumber;
              const matchesSearch =
                searchTerm.trim() !== '' &&
                line.text.toLowerCase().includes(searchTerm.toLowerCase());

              // Check if line looks like a header or section separator
              const isHeading =
                line.text.trim().endsWith(':') ||
                line.text.startsWith('#') ||
                (line.text.toUpperCase() === line.text &&
                  line.text.trim().length > 3 &&
                  !line.text.includes('- '));

              if (line.text.trim() === '') {
                return <div key={line.lineNumber} className="h-2" />;
              }

              return (
                <div
                  key={line.lineNumber}
                  ref={(el) => {
                    lineRefs.current[line.lineNumber] = el;
                  }}
                  className={`group relative flex items-start py-1 px-3 rounded-md transition-all ${
                    isActive
                      ? 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400 dark:ring-amber-500 font-medium shadow-xs border-l-4 border-l-amber-500'
                      : matchesSearch
                      ? 'bg-yellow-50 dark:bg-yellow-950/50 text-neutral-900 dark:text-neutral-100 ring-1 ring-yellow-300 dark:ring-yellow-600'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {/* Line Text Content */}
                  <div className="flex-1 leading-relaxed break-words">
                    {matchesSearch ? (
                      highlightMatches(line.text, searchTerm)
                    ) : isHeading ? (
                      <span className="font-extrabold text-black dark:text-white block mt-3 mb-1 text-xs sm:text-sm tracking-tight">
                        {line.text}
                      </span>
                    ) : (
                      <span>{line.text}</span>
                    )}
                  </div>

                  {/* Quick Copy Action */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(line.text);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white px-1.5 py-0.5 rounded transition-opacity cursor-pointer shrink-0 ml-2"
                    title="Copy text snippet"
                  >
                    copy
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Scroll to Top */}
        {!isEditing && rawText.trim() && (
          <button
            type="button"
            onClick={scrollToTop}
            className="absolute bottom-3 right-3 p-2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-black dark:text-white rounded-full shadow-md border border-neutral-200 dark:border-neutral-700 transition-all opacity-80 hover:opacity-100 cursor-pointer"
            title="Scroll to top of JD"
            aria-label="Scroll to top of job description"
          >
            <ArrowUpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

function highlightMatches(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/80 text-yellow-900 dark:text-yellow-100 rounded-xs px-1 py-0.5 font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
