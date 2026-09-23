import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  CornerDownRight,
  ClipboardList,
} from 'lucide-react';
import { QAMessage } from '../types';

interface QAPanelProps {
  messages: QAMessage[];
  onSendMessage: (question: string) => void;
  isLoading: boolean;
  onJumpToLine: (lineNum: number) => void;
  suggestedAnswered?: string[];
  suggestedTests?: string[];
  hasJob?: boolean;
  onLoadSample?: () => void;
}

export const QAPanel: React.FC<QAPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onJumpToLine,
  suggestedAnswered = [],
  suggestedTests = [],
  hasJob = true,
  onLoadSample,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only scroll internally within the Q&A chat list when messages exist, never scrolling the browser window
    if (messages.length > 0 && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isLoading) return;
    onSendMessage(inputQuestion.trim());
    setInputQuestion('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const cleanPrompt = (text: string) => {
    return text.replace(/\s*\(Line\s*\d+\)/gi, '').replace(/\s*\[Line\s*\d+\]/gi, '').trim();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-2 border-t-black dark:border-t-white rounded-xl shadow-xs overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-black dark:text-white tracking-tight">
              Grounded Q&amp;A
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {hasJob
                ? 'Answers strictly cited from posting, or explicitly flagged "Not stated".'
                : 'Paste a job description on the left to start asking grounded questions.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              hasJob
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasJob ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {hasJob ? 'Hallucination Guard Active' : 'Awaiting Job Input'}
          </span>
        </div>
      </div>

      {/* Suggested Quick Test Queries in monochrome */}
      {hasJob && (suggestedAnswered.length > 0 || suggestedTests.length > 0) && (
        <div className="bg-neutral-50/80 dark:bg-neutral-850/60 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 shrink-0">
          <div className="flex flex-col gap-2">
            {/* Answered Questions */}
            {suggestedAnswered.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-bold text-black dark:text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
                  Quick Ask:
                </span>
                {suggestedAnswered.map((q, idx) => {
                  const cleaned = cleanPrompt(q);
                  return (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(cleaned)}
                      disabled={isLoading}
                      className="px-2.5 py-1 text-[11px] bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors shadow-2xs font-medium cursor-pointer"
                    >
                      {cleaned}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Negative Grounding Test Questions */}
            {suggestedTests.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1.5 border-t border-neutral-200 dark:border-neutral-750">
                <span
                  className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1"
                  title="Test queries verifying strict negative grounding"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Test "Not Stated" Rule:
                </span>
                {suggestedTests.map((q, idx) => {
                  const cleaned = cleanPrompt(q);
                  return (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(cleaned)}
                      disabled={isLoading}
                      className="px-2.5 py-1 text-[11px] bg-amber-50/90 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors shadow-2xs font-semibold cursor-pointer"
                      title="Click to test that the system says 'Not stated' rather than inventing an answer"
                    >
                      "{cleaned}"
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Thread */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 dark:text-neutral-500">
            <div className="w-12 h-12 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-3 shadow-xs">
              {hasJob ? <HelpCircle className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {hasJob ? 'Ask anything about this Job Posting' : 'No Job Description Loaded Yet'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-1">
              {hasJob
                ? 'Ask about remote policy, compensation, tech stack, visa sponsorship, or seniority. Every factual claim cites the exact sentence in the JD.'
                : 'Paste any job description on the left pane and click "Analyze & Ground Job", or try a sample job to test immediate grounded Q&A.'}
            </p>

            {!hasJob && onLoadSample && (
              <button
                type="button"
                onClick={onLoadSample}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-500" />
                <span>Load Sample Job Description</span>
              </button>
            )}

            {hasJob && (
              <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl text-left text-xs max-w-md">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Grounding Guarantee</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                  If the posting doesn't mention something, the system will explicitly state
                  <strong className="text-amber-800 dark:text-amber-400 font-semibold"> "Not stated in this posting"</strong> rather than hallucinating.
                </p>
              </div>
            )}
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isNotStated = msg.status === 'not_stated';
            const isPartiallyStated = msg.status === 'partially_stated';

            if (isUser) {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[75%] bg-black text-white dark:bg-white dark:text-black rounded-xl rounded-tr-xs px-4 py-2.5 shadow-xs">
                    <p className="text-xs sm:text-sm font-medium">{msg.content}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex flex-col gap-2">
                <div
                  className={`rounded-xl rounded-tl-xs p-4 border transition-all ${
                    isNotStated
                      ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 border-l-4 border-l-amber-500 text-neutral-900 dark:text-neutral-100'
                      : 'bg-white dark:bg-neutral-850 border-neutral-200 dark:border-neutral-750 border-l-4 border-l-emerald-500 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                  }`}
                >
                  {/* Status & Actions Header */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-neutral-100 dark:border-neutral-750">
                    <div className="flex items-center gap-2">
                      {isNotStated ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                          <AlertTriangle className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                          Not Stated in Posting
                        </span>
                      ) : isPartiallyStated ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-600">
                          Partially Stated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                          <ShieldCheck className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                          Grounded &amp; Verified
                        </span>
                      )}

                      {msg.confidence && (
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 capitalize font-medium">
                          · {msg.confidence} confidence
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white rounded transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Answer Text */}
                  <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans prose dark:prose-invert prose-sm max-w-none">
                    {msg.content}
                  </div>

                  {/* Missing Aspects Explanation if Not Stated or Partial */}
                  {msg.missing_aspects && (
                    <div className="mt-2.5 p-2.5 bg-amber-100/60 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-normal">{msg.missing_aspects}</span>
                    </div>
                  )}

                  {/* Citations List in clean monochrome */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-750 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3 text-black dark:text-white" />
                        Evidence Citations ({msg.citations.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cite, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onJumpToLine(cite.line_number)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 transition-colors text-left group cursor-pointer shadow-2xs"
                            title={`Jump to source in JD: "${cite.quote}"`}
                          >
                            <span className="font-mono tabular-nums text-[10px] font-bold text-white bg-black dark:bg-white dark:text-black px-1.5 py-0.2 rounded flex items-center gap-0.5 shrink-0">
                              <ExternalLink className="w-2.5 h-2.5" />
                              L{cite.line_number}
                            </span>
                            <span className="truncate max-w-[200px] sm:max-w-[280px] text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white text-[11px]">
                              "{cite.quote}"
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-center gap-2.5 p-3.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white animate-pulse">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-ping"></span>
            <span className="font-semibold">Validating job posting against strict grounding rules...</span>
          </div>
        )}
      </div>

      {/* Input Form - Always visible and pinned to bottom */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shrink-0 z-10 shadow-xs"
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder={
              hasJob
                ? "Ask about this posting (e.g. 'Is visa sponsorship provided?', 'What is the salary?')..."
                : "Ask anything about job postings, or type your question here..."
            }
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:bg-white dark:focus:bg-neutral-950 transition-all shadow-2xs font-sans text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="px-4 py-2.5 bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            title="Submit question"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
