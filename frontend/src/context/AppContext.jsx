import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getClientId } from '../utils/storage.js';

const AppContext = createContext(null);

let toastCounter = 0;

export function AppProvider({ children }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeMeta, setResumeMeta] = useState(null); // { name, sizeKb, pages? }
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [toasts, setToasts] = useState([]);

  const clientId = useMemo(() => getClientId(), []);

  const pushToast = useCallback((message, variant = 'success') => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetIntake = useCallback(() => {
    setResumeFile(null);
    setResumeMeta(null);
    setJobDescription('');
    setJobTitle('');
    setCurrentAnalysis(null);
  }, []);

  const value = {
    clientId,
    resumeFile,
    setResumeFile,
    resumeMeta,
    setResumeMeta,
    jobDescription,
    setJobDescription,
    jobTitle,
    setJobTitle,
    currentAnalysis,
    setCurrentAnalysis,
    resetIntake,
    toasts,
    pushToast,
    dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
