import React, { useState } from 'react';
import {
  Target,
  Code2,
  Users,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PenTool,
  RefreshCw,
  Award,
} from 'lucide-react';
import { InterviewPrepData, InterviewQuestion } from '../types';

interface InterviewPrepPanelProps {
  prepData: InterviewPrepData | null;
  isLoading: boolean;
  onRefresh: () => void;
  onJumpToLine: (lineNum: number) => void;
  onPracticeQuestion: (question: InterviewQuestion) => void;
}

export const InterviewPrepPanel: React.FC<InterviewPrepPanelProps> = ({
  prepData,
  isLoading,
  onRefresh,
  onJumpToLine,
  onPracticeQuestion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-2 border-t-black dark:border-t-white rounded-xl shadow-xs p-8 flex flex-col items-center justify-center text-center transition-colors">
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-black dark:text-white animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          Generating Grounded Interview Prep...
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-1">
          Synthesizing key requirements, drafting technical probes, behavioral questions, and role-specific scenarios tied directly to this posting.
        </p>
      </div>
    );
  }

  if (!prepData || !prepData.questions || prepData.questions.length === 0) {
    return (
      <div className="h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-2 border-t-black dark:border-t-white rounded-xl shadow-xs p-8 flex flex-col items-center justify-center text-center text-neutral-400 dark:text-neutral-500 transition-colors">
        <Target className="w-10 h-10 mb-2 text-neutral-300 dark:text-neutral-600" />
        <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">No Interview Questions Generated</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-1 mb-4">
          Analyze a job description on the left to extract custom interview questions.
        </p>
        <button
          type="button"
          onClick={onRefresh}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all shadow-xs cursor-pointer"
        >
          Generate Questions
        </button>
      </div>
    );
  }

  const filteredQuestions =
    selectedCategory === 'all'
      ? prepData.questions
      : prepData.questions.filter((q) => q.category === selectedCategory);

  const categoryCounts = {
    all: prepData.questions.length,
    technical: prepData.questions.filter((q) => q.category === 'technical').length,
    behavioral: prepData.questions.filter((q) => q.category === 'behavioral').length,
    role_specific: prepData.questions.filter((q) => q.category === 'role_specific').length,
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-2 border-t-black dark:border-t-white rounded-xl shadow-xs overflow-hidden transition-colors">
      {/* Top Header */}
      <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-black dark:text-white tracking-tight">
              Grounded Interview Prep
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Targeted questions tied to specific requirements in the JD — no generic filler.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          title="Regenerate questions"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Focus Pillars Banner in crisp monochrome */}
      {prepData.interviewFocusPillars && prepData.interviewFocusPillars.length > 0 && (
        <div className="px-4 py-2 bg-neutral-100/80 dark:bg-neutral-850/80 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2 text-xs shrink-0">
          <span className="text-[11px] font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-black dark:text-white" />
            Evaluation Pillars:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {prepData.interviewFocusPillars.map((pillar, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-[11px] font-semibold shadow-2xs"
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs in sleek black / monochrome */}
      <div className="px-4 py-2 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <span>All Questions</span>
          <span className="text-[10px] font-mono tabular-nums opacity-80">({categoryCounts.all})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('technical')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'technical'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Technical</span>
          <span className="text-[10px] font-mono tabular-nums opacity-80">({categoryCounts.technical})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('behavioral')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'behavioral'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Behavioral</span>
          <span className="text-[10px] font-mono tabular-nums opacity-80">({categoryCounts.behavioral})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('role_specific')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'role_specific'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Role-Specific</span>
          <span className="text-[10px] font-mono tabular-nums opacity-80">({categoryCounts.role_specific})</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;

          const categoryConfig = {
            technical: {
              label: 'Technical',
              icon: Code2,
            },
            behavioral: {
              label: 'Behavioral',
              icon: Users,
            },
            role_specific: {
              label: 'Role-Specific',
              icon: Compass,
            },
          }[q.category] || {
            label: q.category,
            icon: Target,
          };

          const Icon = categoryConfig.icon;

          return (
            <div
              key={q.id}
              className={`rounded-xl border border-neutral-200 dark:border-neutral-750 transition-all border-l-4 border-l-black dark:border-l-white ${
                isExpanded
                  ? 'bg-white dark:bg-neutral-850 ring-2 ring-neutral-400/20 shadow-sm'
                  : 'bg-white dark:bg-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-600 shadow-2xs'
              }`}
            >
              <div className="p-4">
                {/* Meta row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700">
                      <Icon className="w-3 h-3" />
                      {categoryConfig.label}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Direct JD Source Citation Badge */}
                  <button
                    type="button"
                    onClick={() => onJumpToLine(q.jd_citation.line_number)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer shadow-2xs"
                    title={`Jump to source quote in JD: "${q.jd_citation.quote}"`}
                  >
                    <span>L{q.jd_citation.line_number} in JD</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Question */}
                <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug mb-2.5">
                  "{q.question}"
                </h3>

                {/* Grounded Reason */}
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 mr-1.5">
                    Why this is asked:
                  </span>
                  <span className="italic">{q.reason}</span>
                </div>

                {/* Bottom Actions */}
                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => onPracticeQuestion(q)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-3 py-1 rounded-md transition-colors cursor-pointer shadow-2xs"
                  >
                    <PenTool className="w-3 h-3" />
                    <span>Practice Answering</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleExpand(q.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Strategy' : 'Interviewer Intent & Strategy'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Strategy Drawer */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white block mb-1">
                      Interviewer Intent (What they are evaluating):
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{q.interviewer_intent}</p>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white block mb-1">
                      Recommended Answer Blueprint:
                    </span>
                    <p className="text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 leading-relaxed font-sans">
                      {q.answer_strategy}
                    </p>
                  </div>

                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-start gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Grounded citation from JD:{' '}
                      <em>"{q.jd_citation.quote}"</em>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
