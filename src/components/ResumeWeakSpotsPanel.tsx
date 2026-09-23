import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  ExternalLink,
  UploadCloud,
  FileCheck,
} from 'lucide-react';
import { ResumeGapAnalysis } from '../types';

interface ResumeWeakSpotsPanelProps {
  resumeText: string;
  onUpdateResumeText: (text: string) => void;
  gapAnalysis: ResumeGapAnalysis | null;
  isLoading: boolean;
  onRunAnalysis: () => void;
  onJumpToLine: (lineNum: number) => void;
  hasJob: boolean;
  onLoadSampleResume?: () => void;
}

export const ResumeWeakSpotsPanel: React.FC<ResumeWeakSpotsPanelProps> = ({
  resumeText,
  onUpdateResumeText,
  gapAnalysis,
  isLoading,
  onRunAnalysis,
  onJumpToLine,
  hasJob,
  onLoadSampleResume,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'input' | 'results'>(
    gapAnalysis ? 'results' : 'input'
  );

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-2 border-t-black dark:border-t-white rounded-xl shadow-xs overflow-hidden transition-colors">
      {/* Top Header */}
      <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-black dark:text-white tracking-tight">
                Resume &amp; Likely Weak Spots
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                Optional Stretch
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Cross-references resume qualifications directly against the JD to pinpoint vulnerabilities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveSubTab('input')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'input'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Resume Input
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('results')}
            disabled={!gapAnalysis}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'results'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <span>Weak Spots</span>
            {gapAnalysis && (
              <span className="text-[10px] font-mono tabular-nums bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black px-1.5 py-0.2 rounded-md">
                {gapAnalysis.weakSpots.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      {activeSubTab === 'input' ? (
        <div className="flex-1 p-4 flex flex-col bg-neutral-50/60 dark:bg-neutral-900/60">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-black dark:text-white" />
              <span>Paste Candidate Resume or Bio:</span>
            </label>

            <div className="flex items-center gap-3">
              {onLoadSampleResume && (
                <button
                  type="button"
                  onClick={onLoadSampleResume}
                  className="text-xs text-neutral-900 dark:text-white font-semibold underline hover:opacity-80 cursor-pointer"
                >
                  Load Sample Candidate Resume
                </button>
              )}
              <span className="text-[11px] font-mono tabular-nums text-neutral-500 dark:text-neutral-400 font-medium">
                {wordCount > 0 ? `${wordCount.toLocaleString()} words` : 'Empty'}
              </span>
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => onUpdateResumeText(e.target.value)}
            placeholder="Paste candidate resume, LinkedIn summary, or bio here...

e.g.
Alex Rivera — Senior Full-Stack Engineer
6 years building web applications with TypeScript, React, and Node.js.
Worked with PostgreSQL, Redis, Docker, and AWS.
Led frontend architecture for checkout flows..."
            className="w-full flex-1 p-3.5 text-xs sm:text-sm font-sans leading-relaxed bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none shadow-2xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {hasJob
                ? 'Compares your qualifications directly against every requirement in the loaded JD.'
                : 'Please make sure a job description is loaded on the left first.'}
            </span>

            <button
              type="button"
              onClick={() => {
                onRunAnalysis();
                setActiveSubTab('results');
              }}
              disabled={!resumeText.trim() || !hasJob || isLoading}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-40 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-500" />
              <span>{isLoading ? 'Analyzing Weak Spots...' : 'Analyze Likely Weak Spots'}</span>
            </button>
          </div>
        </div>
      ) : !gapAnalysis ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">No weak spot analysis available yet.</p>
          <button
            type="button"
            onClick={() => setActiveSubTab('input')}
            className="text-xs font-semibold text-black dark:text-white hover:underline cursor-pointer"
          >
            Go back to paste candidate resume
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Summary Card */}
          <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Candidate Fit Assessment
                </span>
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">{gapAnalysis.fitLevel}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black font-mono tabular-nums text-black dark:text-white leading-none">
                    {gapAnalysis.fitScore}%
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold">JD Alignment</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-black dark:text-white shadow-2xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
              {gapAnalysis.summary}
            </p>
          </div>

          {/* Likely Weak Spots */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Likely Weak Spots &amp; Interview Trap Questions ({gapAnalysis.weakSpots.length})
              </h4>
            </div>

            {gapAnalysis.weakSpots.map((spot, idx) => {
              const severityConfig = {
                critical: {
                  badge: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
                  border: 'border-l-4 border-l-rose-500',
                },
                moderate: {
                  badge: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                  border: 'border-l-4 border-l-amber-500',
                },
                minor: {
                  badge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700',
                  border: 'border-l-4 border-l-neutral-400',
                },
              }[spot.severity] || {
                badge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700',
                border: 'border-l-4 border-l-neutral-400',
              };

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all shadow-2xs space-y-2.5 ${severityConfig.border}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${severityConfig.badge}`}
                      >
                        {spot.severity} Gap
                      </span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {spot.requirement}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onJumpToLine(spot.jd_line_number)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors shadow-2xs"
                      title={`Jump to source quote in JD: "${spot.jd_quote}"`}
                    >
                      <span>L{spot.jd_line_number} in JD</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Gap detail */}
                  <div className="text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                    <span className="font-bold text-neutral-800 dark:text-neutral-100 block mb-0.5">
                      Identified Weakness:
                    </span>
                    {spot.gap_analysis}
                  </div>

                  {/* Interviewer Pressure / Trap Question */}
                  <div className="text-xs text-amber-950 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200/90 dark:border-amber-800/70">
                    <span className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1 mb-0.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      Interviewer Trap Question:
                    </span>
                    <p className="italic font-medium">"{spot.trap_question}"</p>
                  </div>

                  {/* Talking point */}
                  <div className="text-xs text-emerald-950 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200/90 dark:border-emerald-800/70">
                    <span className="font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-1 mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      Recommended Talking Point &amp; Defense:
                    </span>
                    <p className="leading-relaxed">{spot.talking_point}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matched Strengths */}
          <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Verified Resume Strengths ({gapAnalysis.strengths.length})
            </h4>

            <div className="space-y-2">
              {gapAnalysis.strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-800/70 border-l-4 border-l-emerald-500 text-xs text-neutral-800 dark:text-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">{str.requirement}</span>
                      <button
                        type="button"
                        onClick={() => onJumpToLine(str.jd_line_number)}
                        className="text-[10px] font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5 cursor-pointer shadow-2xs"
                        title="Jump to source in JD"
                      >
                        <span>L{str.jd_line_number} in JD</span>
                        <ExternalLink className="w-2 h-2" />
                      </button>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 text-[11px]">
                      <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">Resume Evidence:</strong>{' '}
                      {str.resume_evidence}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
