import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload/ResumeUpload.jsx';
import JobDescriptionInput from '../components/JobDescription/JobDescriptionInput.jsx';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { submitAnalysis } from '../services/api.js';
import { saveToLocalHistory } from '../utils/storage.js';

export default function AnalyzePage() {
  const navigate = useNavigate();
  const {
    resumeFile,
    jobDescription,
    jobTitle,
    clientId,
    setCurrentAnalysis,
    pushToast,
  } = useAppContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const canSubmit = Boolean(resumeFile) && jobDescription.trim().length >= 30 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const analysis = await submitAnalysis({
        file: resumeFile,
        jobDescription,
        jobTitle,
        clientId,
      });
      setCurrentAnalysis(analysis);
      saveToLocalHistory(analysis);
      pushToast('Analysis complete.', 'success');
      navigate('/results', { state: { analysis } });
    } catch (err) {
      setSubmitError(err.message);
      pushToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <div className="mb-10">
        <p className="text-sm text-slate-ink">Step 1 of 1</p>
        <h1 className="mt-1 font-display text-3xl">Set up your analysis</h1>
        <p className="mt-2 text-sm text-slate-ink">
          Upload your resume and paste the job description you&apos;re targeting.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-ink">
            Resume
          </h2>
          <ResumeUpload />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-ink">
            Job description
          </h2>
          <JobDescriptionInput />
        </section>

        {submitError && (
          <div className="rounded-card border border-coral/30 bg-coral/5 px-4 py-3 text-sm text-coral">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-ink/8 pt-6">
          <p className="text-xs text-slate-ink">
            Your resume text is sent to the AI for analysis only — it isn&apos;t stored.
          </p>
          <button onClick={handleSubmit} disabled={!canSubmit} className="btn-primary px-6 py-3">
            Run analysis
          </button>
        </div>
      </div>
    </div>
  );
}
