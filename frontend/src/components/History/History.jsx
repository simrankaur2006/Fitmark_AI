import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../common/EmptyState.jsx';

function scoreTone(score) {
  if (score >= 70) return 'text-moss';
  if (score >= 45) return 'text-gold';
  return 'text-coral';
}

export default function History({ items, onDelete, onSelect }) {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon="🕓"
        title="No analyses yet"
        description="Run your first resume analysis to see it appear here."
        action={
          <button onClick={() => navigate('/analyze')} className="btn-primary mt-2">
            Start an analysis
          </button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item._id || item.createdAt}
          className="card flex flex-wrap items-center justify-between gap-3 p-4"
        >
          <button
            className="flex min-w-0 flex-1 items-center gap-4 text-left"
            onClick={() => onSelect(item)}
          >
            <span className={`font-display text-2xl ${scoreTone(item.overallScore)}`}>
              {item.overallScore}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">
                {item.resumeFileName}
                {item.jobTitle ? ` · ${item.jobTitle}` : ''}
              </span>
              <span className="block text-xs text-slate-ink">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </span>
          </button>
          <button
            onClick={() => onDelete(item)}
            className="shrink-0 rounded-card border border-ink/15 px-3 py-2 text-xs text-slate-ink transition-colors hover:border-coral/40 hover:text-coral"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
