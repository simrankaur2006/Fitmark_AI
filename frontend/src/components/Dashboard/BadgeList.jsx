import React from 'react';

const VARIANTS = {
  positive: 'bg-moss/10 text-moss',
  negative: 'bg-coral/10 text-coral',
  neutral: 'bg-parchment text-ink',
};

export default function BadgeList({ items, variant = 'neutral', emptyText = 'None found.' }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-ink">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={`rounded-full px-3 py-1 text-xs font-medium ${VARIANTS[variant]}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
