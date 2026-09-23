import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  PenTool,
} from 'lucide-react';
import { InterviewQuestion } from '../types';

interface PracticeModalProps {
  question: InterviewQuestion | null;
  onClose: () => void;
  jdText: string;
}

interface EvaluationResult {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleRefinement: string;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  question,
  onClose,
  jdText,
}) => {
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!question) return null;

  const handleEvaluate = async () => {
    if (!candidateAnswer.trim() || isEvaluating) return;
    setIsEvaluating(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jdText,
          question: question.question,
          candidateAnswer,
          reason: question.reason,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to evaluate practice answer.');
      }

      const data = await res.json();
      setEvaluation(data);
    } catch (err: any) {
      setError(err.message || 'Error evaluating answer.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-neutral-200 dark:border-neutral-800 transition-colors">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <PenTool className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Interactive Practice Mode
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Draft your answer and get instant evaluation grounded in the JD requirements.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Question card */}
          <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-1">
              {question.category} Question · JD Grounded
            </span>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
              "{question.question}"
            </h4>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-2 italic bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-750">
              <strong>JD context:</strong> {question.reason}
            </p>
          </div>

          {/* Textarea */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Your Answer / Talking Points:
            </label>
            <textarea
              rows={4}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="e.g. In my previous role at X, we faced a similar high-throughput bottleneck. I designed a Kafka consumer group with manual offset commits..."
              className="w-full text-xs sm:text-sm p-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none font-sans leading-relaxed shadow-2xs"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 text-xs rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Feedback section if evaluated */}
          {evaluation && (
            <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Grounded Answer Evaluation
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Fit Score:</span>
                  <span className="text-sm font-bold font-mono tabular-nums px-2.5 py-0.5 rounded-md bg-black text-white dark:bg-white dark:text-black">
                    {evaluation.score} / 10
                  </span>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  What Hit the JD Target:
                </h5>
                <ul className="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-1 pl-1">
                  {evaluation.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <h5 className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  What Was Missed or Lacked Evidence:
                </h5>
                <ul className="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-1 pl-1">
                  {evaluation.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>

              {/* Refinement */}
              <div className="pt-2.5 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-xs font-bold text-neutral-900 dark:text-white block mb-1">
                  Polished Sample Phrasing:
                </span>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 italic leading-relaxed">
                  "{evaluation.sampleRefinement}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={!candidateAnswer.trim() || isEvaluating}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-40 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            {isEvaluating ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating against JD...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Evaluate My Answer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
