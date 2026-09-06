import React from 'react';

const TIER_COPY = [
  { min: 85, label: 'Excellent fit', color: '#3F7A5B' },
  { min: 70, label: 'Strong fit', color: '#C99A3D' },
  { min: 50, label: 'Moderate fit', color: '#C99A3D' },
  { min: 0, label: 'Needs work', color: '#D65F4C' },
];

export default function ScoreCircle({ score = 0, size = 156 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;
  const tier = TIER_COPY.find((t) => clamped >= t.min) || TIER_COPY[TIER_COPY.length - 1];

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ '--ring-full': circumference, '--ring-offset': offset }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EDE7D8"
          strokeWidth="12"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tier.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="animate-ring-fill"
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          fontSize={size * 0.26}
          fontFamily="Fraunces, serif"
          fill="#131A2B"
        >
          {clamped}
        </text>
        <text x="50%" y="65%" textAnchor="middle" fontSize="11" fill="#5B6472">
          out of 100
        </text>
      </svg>
      <span
        className="rounded-full px-3 py-1 text-xs font-medium"
        style={{ color: tier.color, backgroundColor: `${tier.color}1A` }}
      >
        {tier.label}
      </span>
    </div>
  );
}
