import React from 'react';

export default function EmptyState({ icon = '—', title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-ink/15 bg-white/60 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parchment text-xl">
        {icon}
      </div>
      <h3 className="font-display text-lg font-medium">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate-ink">{description}</p>}
      {action}
    </div>
  );
}
