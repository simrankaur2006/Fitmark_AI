import React from 'react';
import ScoreCircle from './ScoreCircle.jsx';
import CategoryScore from './CategoryScore.jsx';
import BadgeList from './BadgeList.jsx';

export default function Dashboard({ analysis }) {
  if (!analysis) return null;

  const {
    overallScore,
    keywordScore,
    skillsScore,
    experienceScore,
    educationScore,
    matchingSkills,
    missingSkills,
    matchingKeywords,
    missingKeywords,
    strengths,
    weaknesses,
    formattingIssues,
    recommendations,
    recommendedKeywordsToAdd,
    relevantExperience,
    irrelevantContent,
  } = analysis;

  return (
    <div className="flex flex-col gap-8">
      {/* Score overview */}
      <div className="card grid gap-8 p-6 md:grid-cols-[auto_1fr] md:items-center">
        <ScoreCircle score={overallScore} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CategoryScore label="Keywords" score={keywordScore} />
          <CategoryScore label="Skills" score={skillsScore} />
          <CategoryScore label="Experience" score={experienceScore} />
          <CategoryScore label="Education" score={educationScore} />
        </div>
      </div>

      {/* Skills & keywords */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-display text-base">Matching skills</h3>
          <p className="mb-3 text-xs text-slate-ink">Already on your resume and relevant to this role.</p>
          <BadgeList items={matchingSkills} variant="positive" emptyText="No strong skill matches detected." />
        </div>
        <div className="card p-5">
          <h3 className="font-display text-base">Missing or weak skills</h3>
          <p className="mb-3 text-xs text-slate-ink">The job description asks for these; your resume doesn&apos;t show them clearly.</p>
          <BadgeList items={missingSkills} variant="negative" emptyText="No major skill gaps found." />
        </div>
        <div className="card p-5">
          <h3 className="font-display text-base">Matching keywords</h3>
          <BadgeList items={matchingKeywords} variant="positive" emptyText="No direct keyword overlaps found." />
        </div>
        <div className="card p-5">
          <h3 className="font-display text-base">Missing keywords</h3>
          <BadgeList items={missingKeywords} variant="negative" emptyText="Keyword coverage looks solid." />
        </div>
      </div>

      {/* Strengths / weaknesses */}
      <div className="grid gap-6 md:grid-cols-2">
        <ListCard title="Resume strengths" items={strengths} tone="positive" />
        <ListCard title="Resume weaknesses" items={weaknesses} tone="negative" />
      </div>

      {relevantExperience?.length > 0 || irrelevantContent?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          <ListCard title="Relevant experience" items={relevantExperience} tone="positive" />
          <ListCard title="Content that isn't pulling weight" items={irrelevantContent} tone="neutral" />
        </div>
      ) : null}

      {/* Formatting warnings */}
      {formattingIssues?.length > 0 && (
        <div className="card border-coral/20 bg-coral/5 p-5">
          <h3 className="font-display text-base text-coral">ATS formatting warnings</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            {formattingIssues.map((issue, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-coral">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="card p-5">
        <h3 className="font-display text-base">Recommendations</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {(recommendations || []).map((rec, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold">→</span>
              <span>{rec}</span>
            </li>
          ))}
          {(!recommendations || recommendations.length === 0) && (
            <p className="text-sm text-slate-ink">No specific recommendations returned.</p>
          )}
        </ul>
      </div>

      {recommendedKeywordsToAdd?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-display text-base">Keywords worth adding</h3>
          <div className="mt-3">
            <BadgeList items={recommendedKeywordsToAdd} variant="neutral" />
          </div>
        </div>
      )}
    </div>
  );
}

function ListCard({ title, items, tone }) {
  const dotColor = tone === 'positive' ? 'text-moss' : tone === 'negative' ? 'text-coral' : 'text-slate-ink';
  return (
    <div className="card p-5">
      <h3 className="font-display text-base">{title}</h3>
      {items && items.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className={dotColor}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-ink">Nothing notable here.</p>
      )}
    </div>
  );
}
