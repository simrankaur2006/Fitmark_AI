import React from 'react';
import EmptyState from '../common/EmptyState.jsx';

const CATEGORY_LABELS = {
  technical: 'Technical',
  hr: 'HR',
  project: 'Project-based',
  behavioral: 'Behavioral',
  general: 'General',
};

const CATEGORY_COLORS = {
  technical: 'bg-ink text-paper',
  hr: 'bg-moss/10 text-moss',
  project: 'bg-gold/15 text-gold',
  behavioral: 'bg-coral/10 text-coral',
  general: 'bg-parchment text-ink',
};

export default function InterviewPrep({ interviewQuestions }) {
  if (!interviewQuestions || interviewQuestions.length === 0) {
    return (
      <EmptyState
        icon="?"
        title="No interview questions yet"
        description="Run an analysis to generate tailored interview questions."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {interviewQuestions.map((q, i) => (
        <div key={i} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-base leading-snug">{q.question}</p>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                CATEGORY_COLORS[q.category] || CATEGORY_COLORS.general
              }`}
            >
              {CATEGORY_LABELS[q.category] || 'General'}
            </span>
          </div>
          {q.talkingPoints?.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-sm text-slate-ink">
              {q.talkingPoints.map((point, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-gold">·</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
