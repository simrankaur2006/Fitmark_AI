import React, { useCallback, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_MB = 5;

function validateFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type) && !/\.(pdf|docx)$/i.test(file.name)) {
    return 'Please upload a PDF or DOCX file.';
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File is larger than ${MAX_SIZE_MB}MB. Try a smaller file.`;
  }
  return null;
}

export default function ResumeUpload() {
  const { resumeFile, setResumeFile, resumeMeta, setResumeMeta, pushToast } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const acceptFile = useCallback(
    (file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        pushToast(validationError, 'error');
        return;
      }
      setError('');
      setResumeFile(file);
      setResumeMeta({
        name: file.name,
        sizeKb: Math.max(1, Math.round(file.size / 1024)),
        type: file.type.includes('pdf') ? 'PDF' : 'DOCX',
      });
    },
    [setResumeFile, setResumeMeta, pushToast]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) acceptFile(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
  };

  const removeFile = () => {
    setResumeFile(null);
    setResumeMeta(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  if (resumeFile && resumeMeta) {
    return (
      <div className="card flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-parchment text-sm font-medium text-ink">
            {resumeMeta.type}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{resumeMeta.name}</p>
            <p className="text-xs text-slate-ink">{resumeMeta.sizeKb} KB · Ready to analyze</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => inputRef.current?.click()} className="btn-secondary px-3 py-2 text-xs">
            Replace
          </button>
          <button onClick={removeFile} className="btn-secondary px-3 py-2 text-xs">
            Remove
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={onInputChange}
        />
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-card border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragging ? 'border-gold bg-gold/5' : 'border-ink/15 bg-white hover:border-ink/30'
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parchment text-xl">
          ↑
        </div>
        <div>
          <p className="text-sm font-medium">Drag and drop your resume here</p>
          <p className="mt-1 text-xs text-slate-ink">or click to browse · PDF or DOCX, up to {MAX_SIZE_MB}MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={onInputChange}
        />
      </label>
      {error && <p className="mt-2 text-sm text-coral">{error}</p>}
    </div>
  );
}
