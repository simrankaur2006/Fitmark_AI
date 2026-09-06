const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume reviewer and technical recruiter with 15 years of experience across engineering, product, and business roles.

You will be given a candidate's resume text and a target job description. Analyze the resume strictly against that job description and return ONLY a single valid JSON object — no markdown fences, no preamble, no commentary.

The JSON object MUST match exactly this shape and these key names:

{
  "overallScore": number (0-100),
  "keywordScore": number (0-100),
  "skillsScore": number (0-100),
  "experienceScore": number (0-100),
  "educationScore": number (0-100),
  "matchingSkills": string[],
  "missingSkills": string[],
  "matchingKeywords": string[],
  "missingKeywords": string[],
  "relevantExperience": string[],
  "irrelevantContent": string[],
  "strengths": string[],
  "weaknesses": string[],
  "formattingIssues": string[],
  "recommendations": string[],
  "recommendedKeywordsToAdd": string[],
  "bulletPointImprovements": [
    { "original": string, "improved": string, "reason": string }
  ],
  "interviewQuestions": [
    { "category": "technical" | "hr" | "project" | "behavioral", "question": string, "talkingPoints": string[] }
  ]
}

Guidelines:
- Scores are integers from 0 to 100 reflecting genuine match quality, not flattery. Do not default to high scores.
- "bulletPointImprovements" should rewrite 3-6 of the resume's weaker bullet points using the STAR method (Situation, Task, Action, Result) where relevant, keeping them truthful to the original content — do not invent metrics that weren't implied.
- "interviewQuestions" should contain 5 to 10 questions total, spanning technical, hr, project-based, and behavioral categories, each with 2-4 concise talking points tailored to this resume and job description.
- "formattingIssues" should flag realistic ATS-parsing risks (tables, columns, graphics, unusual fonts, missing sections, no contact info, inconsistent dates) — infer conservatively from the text structure available.
- Keep every string concise and specific to the actual resume and job description content provided — never generic filler.
- Return ONLY the JSON object. No explanation, no markdown code fences.`;

/**
 * Calls the Gemini generateContent API and returns validated, safely-parsed
 * analysis JSON. Throws a descriptive error on failure so the route
 * handler can return a clean message to the client.
 */
async function analyzeResumeWithAI({ resumeText, jobDescription }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash-lite';

  if (!apiKey) {
    const err = new Error('AI service is not configured. Missing GEMINI_API_KEY.');
    err.status = 500;
    throw err;
  }

  const userPrompt = `RESUME TEXT:\n"""\n${truncate(resumeText, 12000)}\n"""\n\nJOB DESCRIPTION:\n"""\n${truncate(
    jobDescription,
    6000
  )}\n"""\n\nReturn the JSON object described in the system prompt now.`;

  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.4,
          response_mime_type: 'application/json',
        },
      }),
    });
  } catch (networkErr) {
    const err = new Error('Could not reach the AI service. Please try again.');
    err.status = 502;
    throw err;
  }

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody?.error?.message || '';
    } catch (_) {
      /* ignore parse failure */
    }
    const err = new Error(
      `AI service error (${response.status})${detail ? `: ${detail}` : ''}`
    );
    err.status = 502;
    throw err;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    // Gemini can return no candidates if the prompt tripped a safety filter.
    const blockReason = data?.promptFeedback?.blockReason;
    const err = new Error(
      blockReason
        ? `The AI declined to process this request (${blockReason}).`
        : 'The AI returned an empty response. Please try again.'
    );
    err.status = 502;
    throw err;
  }

  return parseAndValidateAnalysis(text);
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max)}\n[...truncated...]` : str;
}

/**
 * Strips markdown fences if present, parses JSON, and fills in any
 * missing fields with safe defaults so the frontend never crashes on
 * a malformed or partial AI response.
 */
function parseAndValidateAnalysis(rawText) {
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    // Attempt to recover by extracting the outermost JSON object.
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (e2) {
        const err = new Error('The AI response could not be parsed. Please try again.');
        err.status = 502;
        throw err;
      }
    } else {
      const err = new Error('The AI response could not be parsed. Please try again.');
      err.status = 502;
      throw err;
    }
  }

  const num = (v, fallback = 0) => {
    const n = Number(v);
    if (Number.isNaN(n)) return fallback;
    return Math.max(0, Math.min(100, Math.round(n)));
  };
  const arr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);

  const safe = {
    overallScore: num(parsed.overallScore),
    keywordScore: num(parsed.keywordScore),
    skillsScore: num(parsed.skillsScore),
    experienceScore: num(parsed.experienceScore),
    educationScore: num(parsed.educationScore),
    matchingSkills: arr(parsed.matchingSkills),
    missingSkills: arr(parsed.missingSkills),
    matchingKeywords: arr(parsed.matchingKeywords),
    missingKeywords: arr(parsed.missingKeywords),
    relevantExperience: arr(parsed.relevantExperience),
    irrelevantContent: arr(parsed.irrelevantContent),
    strengths: arr(parsed.strengths),
    weaknesses: arr(parsed.weaknesses),
    formattingIssues: arr(parsed.formattingIssues),
    recommendations: arr(parsed.recommendations),
    recommendedKeywordsToAdd: arr(parsed.recommendedKeywordsToAdd),
    bulletPointImprovements: Array.isArray(parsed.bulletPointImprovements)
      ? parsed.bulletPointImprovements
          .filter((b) => b && typeof b === 'object')
          .map((b) => ({
            original: String(b.original || ''),
            improved: String(b.improved || ''),
            reason: String(b.reason || ''),
          }))
      : [],
    interviewQuestions: Array.isArray(parsed.interviewQuestions)
      ? parsed.interviewQuestions
          .filter((q) => q && typeof q === 'object' && q.question)
          .map((q) => ({
            category: ['technical', 'hr', 'project', 'behavioral', 'general'].includes(
              q.category
            )
              ? q.category
              : 'general',
            question: String(q.question || ''),
            talkingPoints: arr(q.talkingPoints),
          }))
      : [],
  };

  return safe;
}

module.exports = { analyzeResumeWithAI, parseAndValidateAnalysis };
