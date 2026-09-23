export interface GroundedField {
  status: 'stated' | 'not_stated';
  value: string;
  line_number?: number | null;
  quote?: string | null;
}

export interface JDSnapshot {
  roleTitle: GroundedField;
  company: GroundedField;
  seniority: GroundedField;
  workMode: GroundedField;
  location: GroundedField;
  compensation: GroundedField;
  visaSponsorship: GroundedField;
  experienceYears: GroundedField;
  techStack: GroundedField;
  answeredSuggestedQuestions: string[];
  unansweredTestQuestions: string[];
  overviewSummary: string;
}

export interface Citation {
  line_number: number;
  quote: string;
  relevance: string;
}

export interface QAMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'answered' | 'not_stated' | 'partially_stated';
  citations?: Citation[];
  confidence?: string;
  missing_aspects?: string;
  timestamp: number;
  loading?: boolean;
}

export interface InterviewQuestion {
  id: string;
  category: 'technical' | 'behavioral' | 'role_specific';
  question: string;
  reason: string;
  jd_citation: {
    line_number: number;
    quote: string;
  };
  interviewer_intent: string;
  answer_strategy: string;
  difficulty: 'Standard' | 'Probing' | 'Deep Dive';
}

export interface InterviewPrepData {
  roleSummary: string;
  interviewFocusPillars: string[];
  questions: InterviewQuestion[];
}

export interface ResumeStrength {
  requirement: string;
  jd_line_number: number;
  jd_quote: string;
  resume_evidence: string;
}

export interface ResumeWeakSpot {
  requirement: string;
  jd_line_number: number;
  jd_quote: string;
  severity: 'critical' | 'moderate' | 'minor';
  gap_analysis: string;
  talking_point: string;
  trap_question: string;
}

export interface ResumeGapAnalysis {
  fitScore: number;
  fitLevel: string;
  summary: string;
  strengths: ResumeStrength[];
  weakSpots: ResumeWeakSpot[];
}

export interface SampleJD {
  id: string;
  title: string;
  company: string;
  badge: string;
  tagline: string;
  jdText: string;
  sampleResume?: string;
}
