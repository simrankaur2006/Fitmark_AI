import React from 'react';

export default function CategoryScore({ label, score }) {
  const value = Math.max(0, Math.min(100, score || 0));
  const barColor = value >= 70 ? 'bg-moss' : value >= 45 ? 'bg-gold' : 'bg-coral';

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-slate-ink">{label}</span>
        <span className="font-display text-lg">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-parchment">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
