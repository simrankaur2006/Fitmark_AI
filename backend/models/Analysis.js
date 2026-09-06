const mongoose = require('mongoose');

/**
 * We deliberately keep this schema close to the AI's structured
 * JSON output so the frontend can consume it directly. Resume file
 * bytes are never stored — only extracted text (trimmed) and metadata,
 * per the "do not permanently store uploaded resumes" requirement.
 */
const AnalysisSchema = new mongoose.Schema(
  {
    // Optional: ties analyses to a browser/session when no auth exists yet.
    clientId: { type: String, index: true },

    resumeFileName: { type: String, required: true },
    jobTitle: { type: String, default: '' },
    jobDescriptionSnippet: { type: String, default: '' },

    overallScore: { type: Number, min: 0, max: 100, required: true },
    keywordScore: { type: Number, min: 0, max: 100, default: 0 },
    skillsScore: { type: Number, min: 0, max: 100, default: 0 },
    experienceScore: { type: Number, min: 0, max: 100, default: 0 },
    educationScore: { type: Number, min: 0, max: 100, default: 0 },

    matchingSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    matchingKeywords: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },

    relevantExperience: { type: [String], default: [] },
    irrelevantContent: { type: [String], default: [] },

    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    formattingIssues: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    recommendedKeywordsToAdd: { type: [String], default: [] },

    bulletPointImprovements: {
      type: [
        {
          original: String,
          improved: String,
          reason: String,
        },
      ],
      default: [],
    },

    interviewQuestions: {
      type: [
        {
          category: {
            type: String,
            enum: ['technical', 'hr', 'project', 'behavioral', 'general'],
            default: 'general',
          },
          question: String,
          talkingPoints: { type: [String], default: [] },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', AnalysisSchema);
