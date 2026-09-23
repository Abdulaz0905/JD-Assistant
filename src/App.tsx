import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SnapshotBar } from './components/SnapshotBar';
import { JDViewer } from './components/JDViewer';
import { QAPanel } from './components/QAPanel';
import { InterviewPrepPanel } from './components/InterviewPrepPanel';
import { PracticeModal } from './components/PracticeModal';
import { SAMPLE_JDS } from './data/sampleJDs';
import {
  JDSnapshot,
  QAMessage,
  InterviewPrepData,
  InterviewQuestion,
} from './types';
import { getStats } from './utils/textUtils';
import { HelpCircle, Target } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Ensure window always stays pinned to top when entering or refreshing the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // App opens directly in custom job description mode
  const [jdText, setJdText] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true);

  // Active right column tab: 'qa' | 'prep'
  const [activeTab, setActiveTab] = useState<'qa' | 'prep'>('qa');

  // Grounding state
  const [activeLineNumber, setActiveLineNumber] = useState<number | null>(null);
  const [snapshot, setSnapshot] = useState<JDSnapshot | null>(null);
  const [isAnalyzingJD, setIsAnalyzingJD] = useState<boolean>(false);

  // Q&A state
  const [qaMessages, setQaMessages] = useState<QAMessage[]>([]);
  const [isQaLoading, setIsQaLoading] = useState<boolean>(false);

  // Interview Prep state
  const [prepData, setPrepData] = useState<InterviewPrepData | null>(null);
  const [isPrepLoading, setIsPrepLoading] = useState<boolean>(false);
  const [practicingQuestion, setPracticingQuestion] = useState<InterviewQuestion | null>(null);

  // Main runner when a new JD is loaded
  const runFullAnalysis = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsAnalyzingJD(true);
    setIsPrepLoading(true);

    // 1. Fast JD Grounding & Snapshot extraction (resolves in ~1-2s)
    const analyzePromise = (async () => {
      try {
        const analysisRes = await fetch('/api/analyze-jd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jdText: text }),
        });
        if (analysisRes.ok) {
          const analysisData = await analysisRes.json();
          setSnapshot(analysisData);
        }
      } catch (err) {
        console.error('Error during JD attribute analysis:', err);
      } finally {
        setIsAnalyzingJD(false);
      }
    })();

    // 2. Concurrently generate Interview Prep in background
    const prepPromise = (async () => {
      try {
        const prepRes = await fetch('/api/interview-prep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jdText: text }),
        });
        if (prepRes.ok) {
          const prepDataRes = await prepRes.json();
          setPrepData(prepDataRes);
        }
      } catch (err) {
        console.error('Error during interview prep generation:', err);
      } finally {
        setIsPrepLoading(false);
      }
    })();

    await Promise.allSettled([analyzePromise, prepPromise]);
  }, []);

  // Update JD text handler
  const handleUpdateJDText = (newText: string) => {
    setJdText(newText);
    setIsEditorOpen(false);
    setActiveLineNumber(null);
    setQaMessages([]);
    runFullAnalysis(newText);
  };

  // Open direct custom job paste mode
  const handleOpenPasteModal = () => {
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset back to empty custom job input
  const handleResetToCustomInput = () => {
    setJdText('');
    setSnapshot(null);
    setPrepData(null);
    setQaMessages([]);
    setActiveLineNumber(null);
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick load of sample JD if tester wants a 1-click preview
  const handleLoadSampleJD = () => {
    const sample = SAMPLE_JDS[0];
    setJdText(sample.jdText);
    setIsEditorOpen(false);
    setActiveLineNumber(null);
    setQaMessages([]);
    runFullAnalysis(sample.jdText);
  };

  // Ask question handler
  const handleSendMessage = async (questionText: string) => {
    if (!questionText.trim() || isQaLoading) return;

    const userMessage: QAMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: questionText,
      timestamp: Date.now(),
    };

    setQaMessages((prev) => [...prev, userMessage]);
    setIsQaLoading(true);

    try {
      const res = await fetch('/api/grounded-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jdText,
          question: questionText,
          conversationHistory: qaMessages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get answer.');
      }

      const data = await res.json();

      const assistantMessage: QAMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        status: data.status,
        citations: data.citations || [],
        confidence: data.confidence,
        missing_aspects: data.missing_aspects,
        timestamp: Date.now(),
      };

      setQaMessages((prev) => [...prev, assistantMessage]);

      // If the answer cited lines, focus on the first citation automatically
      if (data.citations && data.citations.length > 0) {
        setActiveLineNumber(data.citations[0].line_number);
      }
    } catch (err: any) {
      const errorMessage: QAMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'An error occurred while answering your question. Please try again.',
        status: 'not_stated',
        timestamp: Date.now(),
      };
      setQaMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsQaLoading(false);
    }
  };

  const handleJumpToLine = (lineNum: number) => {
    setActiveLineNumber(lineNum);
  };

  const { words } = getStats(jdText);
  const hasJob = jdText.trim().length > 0;

  return (
    <div className="min-h-screen bg-neutral-100/70 dark:bg-neutral-950 flex flex-col font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        onOpenPasteModal={handleOpenPasteModal}
        hasJob={hasJob}
        wordCount={words}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      {/* Snapshot Bar */}
      <SnapshotBar
        snapshot={snapshot}
        loading={isAnalyzingJD}
        onJumpToLine={handleJumpToLine}
      />

      {/* Main Workspace Split Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
          {/* Left Column: Job Description Reader & Line Inspector (5 cols) */}
          <div className="lg:col-span-5 h-[520px] lg:h-[calc(100vh-180px)] flex flex-col">
            <JDViewer
              rawText={jdText}
              activeLineNumber={activeLineNumber}
              onClearActiveLine={() => setActiveLineNumber(null)}
              onUpdateText={handleUpdateJDText}
              isAnalyzing={isAnalyzingJD}
              onLoadSample={handleLoadSampleJD}
              isInitialEditing={isEditorOpen || !hasJob}
              onResetToCustomInput={hasJob ? handleResetToCustomInput : undefined}
            />
          </div>

          {/* Right Column: Grounded Tools (7 cols) */}
          <div className="lg:col-span-7 h-[620px] lg:h-[calc(100vh-180px)] flex flex-col">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1.5 mb-2.5 bg-white dark:bg-neutral-900 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs transition-colors shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'qa'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>1. Grounded Q&amp;A</span>
                {qaMessages.length > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md font-mono tabular-nums text-[10px] ${
                      activeTab === 'qa'
                        ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {qaMessages.filter((m) => m.role === 'user').length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('prep')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'prep'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>2. Interview Prep</span>
                {prepData?.questions && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md font-mono tabular-nums text-[10px] ${
                      activeTab === 'prep'
                        ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {prepData.questions.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Content Panels */}
            <div className="flex-1 min-h-0">
              {activeTab === 'qa' && (
                <QAPanel
                  messages={qaMessages}
                  onSendMessage={handleSendMessage}
                  isLoading={isQaLoading}
                  onJumpToLine={handleJumpToLine}
                  suggestedAnswered={snapshot?.answeredSuggestedQuestions || []}
                  suggestedTests={snapshot?.unansweredTestQuestions || []}
                  hasJob={hasJob}
                  onLoadSample={handleLoadSampleJD}
                />
              )}

              {activeTab === 'prep' && (
                <InterviewPrepPanel
                  prepData={prepData}
                  isLoading={isPrepLoading}
                  onRefresh={() => runFullAnalysis(jdText)}
                  onJumpToLine={handleJumpToLine}
                  onPracticeQuestion={(q) => setPracticingQuestion(q)}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Practice Modal */}
      {practicingQuestion && (
        <PracticeModal
          question={practicingQuestion}
          onClose={() => setPracticingQuestion(null)}
          jdText={jdText}
        />
      )}
    </div>
  );
}
