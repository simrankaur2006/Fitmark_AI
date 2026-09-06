import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard.jsx';
import ImprovementSection from '../components/Improvement/ImprovementSection.jsx';
import InterviewPrep from '../components/Interview/InterviewPrep.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { fetchAnalysisById } from '../services/api.js';
import { getLocalHistory } from '../utils/storage.js';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'improve', label: 'Improve my resume' },
  { id: 'interview', label: 'Interview prep' },
];

export default function ResultsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentAnalysis, setCurrentAnalysis, pushToast } = useAppContext();

  const [analysis, setAnalysis] = useState(location.state?.analysis || currentAnalysis || null);
  const [loading, setLoading] = useState(!analysis && Boolean(id));
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (analysis || !id) return;

    const local = getLocalHistory().find((a) => a._id === id);
    if (local) {
      setAnalysis(local);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchAnalysisById(id)
      .then((data) => {
        setAnalysis(data);
        setCurrentAnalysis(data);
      })
      .catch((err) => pushToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [id, analysis, pushToast, setCurrentAnalysis]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center text-sm text-slate-ink">
        Loading analysis…
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <EmptyState
          icon="⚠"
          title="No analysis to show"
          description="Run a new analysis or pick one from your history."
          action={
            <button onClick={() => navigate('/analyze')} className="btn-primary mt-2">
              Start an analysis
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-ink">
            {analysis.resumeFileName}
            {analysis.jobTitle ? ` · ${analysis.jobTitle}` : ''}
          </p>
          <h1 className="mt-1 font-display text-3xl">Your fit analysis</h1>
        </div>
        <button onClick={() => navigate('/analyze')} className="btn-secondary">
          Run another analysis
        </button>
      </div>

      <div className="mb-8 flex gap-1 border-b border-ink/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-3 text-sm transition-colors ${
              activeTab === tab.id ? 'text-ink' : 'text-slate-ink hover:text-ink'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gold" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <Dashboard analysis={analysis} />}
      {activeTab === 'improve' && (
        <ImprovementSection bulletPointImprovements={analysis.bulletPointImprovements} />
      )}
      {activeTab === 'interview' && (
        <InterviewPrep interviewQuestions={analysis.interviewQuestions} />
      )}
    </div>
  );
}
