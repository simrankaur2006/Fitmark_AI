import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

/**
 * Extracts a friendly error message from an axios error, falling back
 * to a generic message so the UI never shows "undefined".
 */
function friendlyError(err) {
  const message =
    err?.response?.data?.message ||
    (err?.code === 'ECONNABORTED'
      ? 'The analysis is taking longer than expected. Please try again.'
      : null) ||
    'Something went wrong. Please try again.';
  const wrapped = new Error(message);
  wrapped.status = err?.response?.status;
  return wrapped;
}

export async function submitAnalysis({ file, jobDescription, jobTitle, clientId, onUploadProgress }) {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);
  formData.append('jobTitle', jobTitle || '');
  formData.append('clientId', clientId || '');

  try {
    const { data } = await api.post('/analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return data.data;
  } catch (err) {
    throw friendlyError(err);
  }
}

export async function fetchHistory(clientId) {
  try {
    const { data } = await api.get('/analysis', { params: { clientId } });
    return data.data;
  } catch (err) {
    throw friendlyError(err);
  }
}

export async function fetchAnalysisById(id) {
  try {
    const { data } = await api.get(`/analysis/${id}`);
    return data.data;
  } catch (err) {
    throw friendlyError(err);
  }
}

export async function deleteAnalysisById(id) {
  try {
    await api.delete(`/analysis/${id}`);
  } catch (err) {
    throw friendlyError(err);
  }
}

export default api;
