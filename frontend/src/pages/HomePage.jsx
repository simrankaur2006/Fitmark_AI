import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';

const STEPS = [
  {
    mark: '01',
    title: 'Upload your resume',
    body: 'Drop in a PDF or DOCX. We read the text straight from the file — nothing is stored longer than it takes to analyze it.',
  },
  {
    mark: '02',
    title: 'Paste the job description',
    body: 'The full listing works best. Fitmark reads it the way an ATS parser and a hiring manager both would.',
  },
  {
    mark: '03',
    title: 'Get a fit score, fast',
    body: 'A scored breakdown, missing keywords, rewritten bullet points, and likely interview questions — in under a minute.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { resetIntake } = useAppContext();

  const begin = () => {
    resetIntake();
    navigate('/analyze');
  };

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-4 text-sm text-slate-ink">For job seekers who'd rather know now</p>
            <h1 className="font-display text-[2.6rem] leading-[1.08] tracking-tight md:text-6xl">
              Know your resume&apos;s fit before a recruiter does.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-ink">
              Fitmark scores your resume against a specific job description the way an
              applicant tracking system does, then tells you exactly which lines to
              rewrite, which keywords to add, and what you&apos;ll get asked in the
              interview.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={begin} className="btn-primary px-6 py-3.5 text-base">
                Analyze my resume
              </button>
              <span className="text-sm text-slate-ink">No sign-up. Takes about a minute.</span>
            </div>
          </div>

          <HeroScoreCard />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-ink/8 bg-parchment/60">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-2xl md:text-3xl">Three steps, one honest score</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.mark} className="flex flex-col gap-3">
                <span className="font-display text-sm text-gold">{step.mark}</span>
                <h3 className="font-display text-lg">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-ink">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl md:text-3xl">What comes back</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Match scoring', 'Overall, keyword, skills, experience, and education scores out of 100.'],
            ['Keyword gaps', 'Exactly which terms from the listing are missing from your resume.'],
            ['Rewritten bullets', 'Weak bullet points rebuilt with the STAR method — same facts, sharper delivery.'],
            ['Interview prep', 'Technical, HR, and project questions tailored to this resume and role.'],
          ].map(([title, body]) => (
            <div key={title} className="card p-5">
              <h3 className="font-display text-base">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-ink">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/8">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl">Ready to see where you stand?</h2>
            <p className="mt-2 text-sm text-slate-ink">Your resume and results stay on your device unless you choose to keep history.</p>
          </div>
          <button onClick={begin} className="btn-primary px-6 py-3.5 text-base">
            Start free analysis
          </button>
        </div>
      </section>
    </div>
  );
}

function HeroScoreCard() {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const score = 82;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="card mx-auto flex w-full max-w-sm flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-slate-ink">Sample result</span>
        <span className="rounded-full bg-moss/10 px-2.5 py-1 text-xs font-medium text-moss">
          Strong fit
        </span>
      </div>

      <div className="flex items-center gap-5">
        <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#EDE7D8" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#C99A3D"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
          <text x="60" y="66" textAnchor="middle" fontSize="26" fontFamily="Fraunces, serif" fill="#131A2B">
            {score}
          </text>
        </svg>
        <div className="flex flex-1 flex-col gap-2 text-xs">
          {[
            ['Keywords', 76],
            ['Skills', 88],
            ['Experience', 81],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-slate-ink">
                <span>{label}</span>
                <span>{val}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-parchment">
                <div className="h-full rounded-full bg-ink" style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="border-t border-ink/8 pt-4 text-xs leading-relaxed text-slate-ink">
        &quot;Missing: Kubernetes, stakeholder management. Add a metric to your third
        bullet point.&quot;
      </p>
    </div>
  );
}
