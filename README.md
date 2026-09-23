# JD Assistant — Grounded Q&A & Interview Prep Engine

A zero-hallucination Job Description analysis workspace. It pairs an indexed JD document reader with strictly grounded Q&A, targeted interview preparation, and candidate weak-spot analysis—every factual claim is verified and cited against exact line numbers.

---

## 1. Assumptions

- **Strict Source-of-Truth Boundary**: The job description provided by the user is the sole authority for factual claims. If a detail (e.g., visa sponsorship, remote policy, exact compensation, 401(k), equity, or specific tooling) is omitted from the posting, the system assumes it is unknown. It must explicitly return `"Not stated in this posting"` rather than assuming industry defaults.
- **Line-Numbered Ingestion Model**: Unstructured JD text (from LinkedIn, Greenhouse, Lever, Ashby, or careers pages) is tokenized into 1-based numbered lines upon ingestion. This establishes a shared coordinate system between the LLM and the frontend document viewer.
- **Candidate Privacy & Ephemeral State**: Resumes and unpublished job descriptions are sensitive. Sessions operate in-memory on the client with zero database persistence, ensuring candidate data is never retained across reloads.
- **Candidate Input Variety**: Candidates may input anything from a full multi-page resume to a quick LinkedIn summary or bulleted experience list. The weak spots engine accommodates varying levels of detail without failing.

---

## 2. Tradeoffs Made

| Decision | Tradeoff Chosen | Alternative Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Response Format** | **Strict Structured JSON** (`responseSchema`) | Unstructured streaming text | Strict JSON guarantees parsed line numbers (`L14`), verification statuses (`stated` vs `not_stated`), and confidence flags that cleanly power interactive UI elements (jump-to-line buttons, badges) without fragile regex parsing. |
| **Citation Granularity** | **Line-Level Indexing (`L{num}`)** | Character offset spans / token indices | Line indexing is resilient to whitespace normalization, font rendering differences, and mobile reflow, while remaining immediately recognizable to human readers. |
| **Pipeline Concurrency** | **Parallel Execution (`Promise.allSettled`)** | Sequential waterfall calls | On JD submission, snapshot extraction (~1s) and interview question synthesis run in parallel. The snapshot bar renders almost instantly, keeping the app fast and responsive. |
| **State Management** | **React State + LocalStorage** | Remote database (Postgres / Firestore) | Maximizes candidate privacy, zero onboarding friction, instant local interactions, and zero infrastructure overhead for a client-side preparation tool. |
| **Color System** | **High-Contrast Monochrome / Obsidian** | Multi-colored accents (blue/purple) | Swapped all decorative blues/purples for a sleek, luxury black-and-white theme (`bg-black text-white dark:bg-white dark:text-black`), keeping colors strictly reserved for semantic indicators (emerald for verified citations, amber for missing facts). |

---

## 3. What I'd Improve With More Time

1. **Direct Document & URL Ingestion**:
   - Add native PDF / DOCX file upload with client-side text extraction (e.g., `pdfjs-dist`).
   - Add single-click URL fetching for Greenhouse, Lever, and LinkedIn job posting URLs via a server-side headless scraper.
2. **Audio / Voice Mock Interview Practice**:
   - Integrate the Gemini Live API / Web Audio API so candidates can verbally answer interview questions and receive feedback on delivery, structure (STAR method adherence), and time management.
3. **Company Context & SEC 10-K Grounding**:
   - Ground prep questions in real company context (recent earnings reports, product launches, engineering blog posts) alongside the JD text.
4. **Interactive Resume Tailoring Engine**:
   - An in-line bullet point editor that suggests quantified, achievement-oriented rewrites for candidate bullet points targeting cited JD lines while maintaining honesty.
5. **Exportable Interview Study Guide**:
   - 1-click export of grounded questions, trap questions, talking points, and source citations to PDF, Markdown, or Notion.

---

## 4. How AI Tools Were Used

- **Precision Grounding & Negative Constraint Enforcement**:
  - Implemented Gemini (`gemini-2.5-flash` with automatic fallback to `gemini-flash-latest` and `gemini-3.8-flash` via `@google/genai`) configured with strict JSON schemas.
  - Crafted system prompts that penalize hallucination and force the model to identify what is *missing* from a job posting (the `"not_stated"` contract).
- **Interactive Practice Evaluator**:
  - Engineered an evaluation loop where Gemini acts as an interview coach, scoring candidate answers on a 1–10 scale based purely on evidence from the JD.
- **Architectural Synthesis & Rapid Iteration**:
  - Leveraged AI Studio Build to rapidly construct full-stack TypeScript services, validate Tailwind CSS styling, ensure zero lint regressions, and verify build reproducibility.
