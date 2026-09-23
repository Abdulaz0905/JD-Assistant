import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client according to the gemini-api skill instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-flash-latest';

// Robust Gemini invoker with exponential backoff and fallback model handling for transient 503/429 spikes
async function generateContentWithRetry(options: any): Promise<any> {
  const modelsToTry = [MODEL_NAME, 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...options,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || JSON.stringify(err);
        const isTransient =
          msg.includes('503') ||
          msg.includes('429') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand');

        if (isTransient && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          continue;
        }
        break; // switch to next model if persistent error
      }
    }
  }

  throw lastError;
}

// Helper to format numbered lines for strictly grounded prompting
function formatNumberedLines(text: string): { numberedText: string; lines: string[] } {
  const rawLines = text.split(/\r?\n/);
  const lines = rawLines.map((line) => line.trimEnd());
  const numberedText = lines
    .map((line, idx) => `[Line ${idx + 1}] ${line}`)
    .join('\n');
  return { numberedText, lines };
}

// 1. Analyze JD: Generates role snapshot, fast overview, and recommended test questions
app.post('/api/analyze-jd', async (req, res) => {
  try {
    const { jdText } = req.body;
    if (!jdText || typeof jdText !== 'string' || jdText.trim().length === 0) {
      return res.status(400).json({ error: 'Job description text is required.' });
    }

    const { numberedText } = formatNumberedLines(jdText);

    const prompt = `You are a precision Job Description Grounding Engine.
Analyze the following numbered job description and extract key attributes with strict grounding.

NUMBERED JOB DESCRIPTION:
${numberedText}

GROUNDING RULES:
1. For every field (roleTitle, company, seniority, workMode, location, compensation, visaSponsorship, experienceYears, techStack):
   - If stated in the JD, set status to "stated", provide the concise extracted value, and cite the exact line number(s) (1-based index) and quote.
   - If NOT stated or not mentioned in the JD, you MUST set status to "not_stated", set value to "Not stated in this posting", and set line_number to null, quote to null. NEVER guess or assume.
2. Formulate 3 questions that ARE answered in the posting, with their target line numbers.
3. Formulate 3 challenging test questions that are deliberately NOT addressed anywhere in this posting (e.g., asking for benefits, visa sponsorship, exact bonus formula, specific tools, or policies not in the text) so candidates and evaluators can verify the negative grounding capability.

Respond with strict JSON matching the schema.`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleTitle: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                value: { type: Type.STRING },
                line_number: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['status', 'value'],
            },
            company: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                value: { type: Type.STRING },
                line_number: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['status', 'value'],
            },
            seniority: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                value: { type: Type.STRING },
                line_number: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['status', 'value'],
            },
            workMode: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                value: { type: Type.STRING },
                line_number: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['status', 'value'],
            },
            location: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                value: { type: Type.STRING },
                line_number: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['status', 'value'],
            },
            compensation: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                value: { type: Type.STRING },
                line_number: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['status', 'value'],
            },
            visaSponsorship: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                value: { type: Type.STRING },
                line_number: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['status', 'value'],
            },
            experienceYears: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                value: { type: Type.STRING },
                line_number: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['status', 'value'],
            },
            techStack: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                value: { type: Type.STRING },
                line_number: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['status', 'value'],
            },
            answeredSuggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            unansweredTestQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            overviewSummary: { type: Type.STRING },
          },
          required: [
            'roleTitle',
            'seniority',
            'workMode',
            'compensation',
            'visaSponsorship',
            'techStack',
            'answeredSuggestedQuestions',
            'unansweredTestQuestions',
            'overviewSummary',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing JD:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze job description.' });
  }
});

// 2. Grounded Q&A Endpoint
app.post('/api/qa', async (req, res) => {
  try {
    const { jdText, question, conversationHistory } = req.body;
    if (!jdText || !question) {
      return res.status(400).json({ error: 'Both jdText and question are required.' });
    }

    const { numberedText } = formatNumberedLines(jdText);

    const historyContext = Array.isArray(conversationHistory) && conversationHistory.length > 0
      ? `PREVIOUS CONVERSATION CONTEXT:\n${conversationHistory
          .slice(-4)
          .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
          .join('\n')}\n\n`
      : '';

    const prompt = `You are the Grounded Q&A Engine of JD Assistant.
Your core mission is to provide 100% faithful, line-cited answers to candidate questions based EXCLUSIVELY on the provided numbered job description.

NUMBERED JOB DESCRIPTION:
${numberedText}

${historyContext}CANDIDATE QUESTION: "${question}"

CRITICAL GROUNDING INSTRUCTIONS:
1. STRICT NEGATIVE GROUNDING:
   - If the job description does NOT explicitly address, mention, or answer the question (e.g., asking if visa sponsorship is offered when unmentioned, asking about remote policy when only an office address is listed, asking about salary/equity when omitted, asking about 401k match or health benefits when absent, asking about team size or specific technologies not listed):
   - You MUST set "status" to "not_stated".
   - You MUST start the "answer" clearly with: "Not stated in this posting." followed by a short, factual explanation of what the job description mentions or doesn't mention regarding this topic.
   - Set "citations" to an empty array [].
   - Do NOT extrapolate, guess, or hallucinate standard company practices.

2. IF ANSWERED IN THE POSTING:
   - Set "status" to "answered" (or "partially_stated" if only a fraction of the question is addressed).
   - In "answer", provide a clear, direct, and well-written answer in markdown.
   - In "citations", include EVERY line that directly supports the facts in your answer. Each citation must specify the line_number (integer, 1-based index matching [Line X]), the exact quote from that line, and a brief note on relevance.

3. ACCURACY: The line_number must correspond to the line in the numbered text provided above.`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: 'One of "answered", "not_stated", or "partially_stated"',
            },
            answer: {
              type: Type.STRING,
              description: 'The grounded answer. Starts with "Not stated in this posting." if status is not_stated.',
            },
            citations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  line_number: { type: Type.INTEGER },
                  quote: { type: Type.STRING },
                  relevance: { type: Type.STRING },
                },
                required: ['line_number', 'quote', 'relevance'],
              },
            },
            confidence: {
              type: Type.STRING,
              description: '"grounded" if found, "not_mentioned" if absent, "partial" if partial',
            },
            missing_aspects: {
              type: Type.STRING,
              description: 'Explanation of what is missing if partially stated or not stated',
            },
          },
          required: ['status', 'answer', 'citations', 'confidence'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error answering question:', error);
    return res.status(500).json({ error: error.message || 'Failed to process question.' });
  }
});

// 3. Interview Prep Generator
app.post('/api/interview-prep', async (req, res) => {
  try {
    const { jdText } = req.body;
    if (!jdText) {
      return res.status(400).json({ error: 'Job description text is required.' });
    }

    const { numberedText } = formatNumberedLines(jdText);

    const prompt = `You are an elite Engineering and Hiring Interview Architect.
Analyze the following numbered job description and generate a focused, high-yield set of interview questions that candidates are genuinely likely to face.

NUMBERED JOB DESCRIPTION:
${numberedText}

REQUIREMENTS:
1. Output Volume & Focus: Quality beats quantity. Generate a focused set of exactly 5 to 6 high-yield questions:
   - 2 Technical questions
   - 2 Behavioral questions
   - 1 to 2 Role-Specific / Domain-Specific questions
2. Grounding in the JD: Every question MUST have a specific one-line reason tied directly to something concrete in the JD (e.g. a specific system, metric, scale, stakeholder, or requirement mentioned in the text). NO GENERIC FILLER questions like "Tell me about a time you had a conflict".
3. Precise Citation: Include the exact line_number and quote from the JD that inspired this question.
4. Interviewer Intent: Describe what signal the interviewer is actually hunting for in 1-2 sentences.
5. Answer Strategy: A concise, actionable blueprint for how a candidate should structure their answer (e.g. STAR method point, system design tradeoff, or specific metrics to mention).

Return strict JSON matching the schema.`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleSummary: { type: Type.STRING },
            interviewFocusPillars: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 core themes the interview loop will emphasize based on the JD',
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: '"technical", "behavioral", or "role_specific"',
                  },
                  question: { type: Type.STRING },
                  reason: {
                    type: Type.STRING,
                    description: 'One-line reason tied directly to a specific detail in the JD — no generic filler.',
                  },
                  jd_citation: {
                    type: Type.OBJECT,
                    properties: {
                      line_number: { type: Type.INTEGER },
                      quote: { type: Type.STRING },
                    },
                    required: ['line_number', 'quote'],
                  },
                  interviewer_intent: { type: Type.STRING },
                  answer_strategy: { type: Type.STRING },
                  difficulty: {
                    type: Type.STRING,
                    description: '"Standard", "Probing", or "Deep Dive"',
                  },
                },
                required: [
                  'id',
                  'category',
                  'question',
                  'reason',
                  'jd_citation',
                  'interviewer_intent',
                  'answer_strategy',
                  'difficulty',
                ],
              },
            },
          },
          required: ['roleSummary', 'interviewFocusPillars', 'questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating interview prep:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate interview prep.' });
  }
});

// 4. Optional Stretch: Resume Gap Analysis
app.post('/api/resume-gaps', async (req, res) => {
  try {
    const { jdText, resumeText } = req.body;
    if (!jdText || !resumeText) {
      return res.status(400).json({ error: 'Both jdText and resumeText are required.' });
    }

    const { numberedText } = formatNumberedLines(jdText);

    const prompt = `You are a Senior Technical Recruiter and Career Coach.
Perform a strict gap analysis comparing the candidate's resume against the numbered job description.

NUMBERED JOB DESCRIPTION:
${numberedText}

CANDIDATE RESUME:
${resumeText}

ANALYSIS REQUIREMENTS:
1. Overall Fit: Rate fit ("Strong Match", "Moderate Match", or "Significant Stretch") and provide a balanced summary.
2. Strengths: 3-5 concrete requirements where the resume demonstrates proven evidence, citing the JD line.
3. Weak Spots / Gaps: 3-5 specific requirements in the JD that the resume is missing, vague on, or light on.
   - Cite the exact JD line_number and quote where the requirement is stated.
   - Categorize severity: "critical" (must-have core skill), "moderate" (preferred or domain skill), or "minor" (bonus skill).
   - Give the candidate a tactical talking point for how to navigate this gap in the interview honestly and convincingly without getting disqualified.
   - Provide a likely "Trap / Pressure Question" the interviewer will ask about this missing experience.

Return strict JSON matching the schema.`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fitScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
            fitLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  requirement: { type: Type.STRING },
                  jd_line_number: { type: Type.INTEGER },
                  jd_quote: { type: Type.STRING },
                  resume_evidence: { type: Type.STRING },
                },
                required: ['requirement', 'jd_line_number', 'jd_quote', 'resume_evidence'],
              },
            },
            weakSpots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  requirement: { type: Type.STRING },
                  jd_line_number: { type: Type.INTEGER },
                  jd_quote: { type: Type.STRING },
                  severity: { type: Type.STRING, description: '"critical", "moderate", or "minor"' },
                  gap_analysis: { type: Type.STRING },
                  talking_point: { type: Type.STRING },
                  trap_question: { type: Type.STRING },
                },
                required: [
                  'requirement',
                  'jd_line_number',
                  'jd_quote',
                  'severity',
                  'gap_analysis',
                  'talking_point',
                  'trap_question',
                ],
              },
            },
          },
          required: ['fitScore', 'fitLevel', 'summary', 'strengths', 'weakSpots'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing resume gaps:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze resume gaps.' });
  }
});

// 5. Practice Answer Evaluator
app.post('/api/evaluate-practice', async (req, res) => {
  try {
    const { jdText, question, candidateAnswer, reason } = req.body;
    if (!jdText || !question || !candidateAnswer) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const { numberedText } = formatNumberedLines(jdText);

    const prompt = `You are an Interview Practice Coach.
The candidate practiced answering an interview question derived from a Job Description.
Evaluate their answer based strictly on how well it satisfies the specific JD context.

NUMBERED JOB DESCRIPTION:
${numberedText}

QUESTION: "${question}"
JD CONTEXT / REASON: "${reason || ''}"
CANDIDATE'S ANSWER:
"${candidateAnswer}"

Provide structured constructive feedback:
- Overall Score (1 to 10)
- What worked well (mentioning relevant technologies, metrics, STAR structure)
- What was missed or could be improved relative to the JD requirements
- A polished 2-sentence alternative phrasing they can use

Return strict JSON matching the schema.`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            sampleRefinement: { type: Type.STRING },
          },
          required: ['score', 'strengths', 'improvements', 'sampleRefinement'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating practice answer:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate practice answer.' });
  }
});

// Middleware & Server startup
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JD Assistant] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
