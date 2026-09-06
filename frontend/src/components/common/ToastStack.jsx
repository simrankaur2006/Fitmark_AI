import React from 'react';
import { useAppContext } from '../../context/AppContext.jsx';

const VARIANT_STYLES = {
  success: 'bg-ink text-paper',
  error: 'bg-coral text-white',
  info: 'bg-white text-ink border border-ink/15',
};

export default function ToastStack() {
  const { toasts, dismissToast } = useAppContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`animate-fade-in flex items-start justify-between gap-3 rounded-card px-4 py-3 text-sm shadow-card ${
            VARIANT_STYLES[toast.variant] || VARIANT_STYLES.success
          }`}
        >
          <span className="leading-snug">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
