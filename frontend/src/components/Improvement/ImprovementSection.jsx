import React from 'react';
import EmptyState from '../common/EmptyState.jsx';

export default function ImprovementSection({ bulletPointImprovements }) {
  if (!bulletPointImprovements || bulletPointImprovements.length === 0) {
    return (
      <EmptyState
        icon="✎"
        title="No rewrites suggested"
        description="The AI didn't flag specific bullet points to rewrite this time."
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-slate-ink">
        Rewritten using the STAR method (Situation, Task, Action, Result) where the original
        content supports it. Facts aren&apos;t invented — only sharpened.
      </p>
      {bulletPointImprovements.map((item, i) => (
        <div key={i} className="card p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-ink">
                Original
              </p>
              <p className="text-sm leading-relaxed text-slate-ink">{item.original}</p>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-moss">
                Rewritten
              </p>
              <p className="text-sm leading-relaxed">{item.improved}</p>
            </div>
          </div>
          {item.reason && (
            <p className="mt-4 border-t border-ink/8 pt-3 text-xs text-slate-ink">
              Why: {item.reason}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
