import React, { useEffect, useState } from 'react';

const STAGES = [
  'Reading your resume',
  'Parsing the job description',
  'Scoring keyword and skills match',
  'Drafting recommendations',
];

export default function LoadingScreen() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 px-5 py-24 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/30" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-ink font-display text-lg text-gold">
          F
        </span>
      </div>

      <div>
        <h2 className="font-display text-xl">Analyzing your fit</h2>
        <p className="mt-1 text-sm text-slate-ink">This usually takes 20–40 seconds.</p>
      </div>

      <ul className="w-full space-y-3 text-left">
        {STAGES.map((stage, i) => (
          <li key={stage} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                i < stageIndex
                  ? 'bg-moss text-white'
                  : i === stageIndex
                  ? 'bg-gold text-white'
                  : 'bg-parchment text-slate-ink'
              }`}
            >
              {i < stageIndex ? '✓' : i + 1}
            </span>
            <span className={i <= stageIndex ? 'text-ink' : 'text-slate-ink'}>{stage}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
