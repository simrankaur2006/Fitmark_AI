import React from 'react';
import { useAppContext } from '../../context/AppContext.jsx';

const MIN_CHARS = 30;

export default function JobDescriptionInput() {
  const { jobDescription, setJobDescription, jobTitle, setJobTitle } = useAppContext();

  const remaining = MIN_CHARS - jobDescription.trim().length;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="jobTitle" className="mb-1.5 block text-sm font-medium">
          Job title <span className="font-normal text-slate-ink">(optional)</span>
        </label>
        <input
          id="jobTitle"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Senior Frontend Engineer"
          className="w-full rounded-card border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ink/40"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="jobDescription" className="text-sm font-medium">
            Job description
          </label>
          <span className="text-xs text-slate-ink">{jobDescription.length} characters</span>
        </div>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={12}
          placeholder="Paste the full job listing here — responsibilities, requirements, and preferred qualifications all help the analysis."
          className="w-full resize-y rounded-card border border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-ink/40"
        />
        {jobDescription.length > 0 && remaining > 0 && (
          <p className="mt-1.5 text-xs text-coral">
            Add {remaining} more character{remaining === 1 ? '' : 's'} for a meaningful analysis.
          </p>
        )}
      </div>
    </div>
  );
}
