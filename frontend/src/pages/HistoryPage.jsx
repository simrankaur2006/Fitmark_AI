import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import History from '../components/History/History.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { fetchHistory, deleteAnalysisById } from '../services/api.js';
import { getLocalHistory, removeFromLocalHistory } from '../utils/storage.js';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { clientId, setCurrentAnalysis, pushToast } = useAppContext();
  const [items, setItems] = useState(getLocalHistory());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory(clientId)
      .then((remote) => {
        if (remote && remote.length > 0) {
          setItems(mergeById(remote, getLocalHistory()));
        }
      })
      .catch(() => {
        /* fall back silently to local history when backend/db is unavailable */
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  const handleSelect = (item) => {
    setCurrentAnalysis(item);
    navigate(item._id ? `/results/${item._id}` : '/results', { state: { analysis: item } });
  };

  const handleDelete = async (item) => {
    setItems((prev) => prev.filter((a) => a._id !== item._id));
    removeFromLocalHistory(item._id);
    if (item._id) {
      try {
        await deleteAnalysisById(item._id);
      } catch (err) {
        pushToast('Removed locally, but could not delete from the server.', 'error');
        return;
      }
    }
    pushToast('Analysis deleted.', 'success');
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl">Analysis history</h1>
      <p className="mt-2 text-sm text-slate-ink">
        {loading ? 'Loading…' : `${items.length} saved ${items.length === 1 ? 'analysis' : 'analyses'}`}
      </p>
      <div className="mt-8">
        <History items={items} onDelete={handleDelete} onSelect={handleSelect} />
      </div>
    </div>
  );
}

function mergeById(remote, local) {
  const map = new Map();
  [...remote, ...local].forEach((item) => {
    const key = item._id || item.createdAt;
    if (!map.has(key)) map.set(key, item);
  });
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}
