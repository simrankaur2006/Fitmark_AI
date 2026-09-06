const CLIENT_ID_KEY = 'fitmark_client_id';
const HISTORY_KEY = 'fitmark_history';

/**
 * Generates (once) and persists an anonymous client id so history can be
 * scoped per browser without requiring authentication.
 */
export function getClientId() {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id =
      'client_' +
      Date.now().toString(36) +
      '_' +
      Math.random().toString(36).slice(2, 10);
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

/**
 * Local mirror of analysis history. Acts as the source of truth if the
 * backend/MongoDB is unreachable, and as a fast cache otherwise.
 */
export function getLocalHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToLocalHistory(analysis) {
  const history = getLocalHistory();
  const withoutDupe = history.filter((a) => a._id !== analysis._id);
  const updated = [analysis, ...withoutDupe].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFromLocalHistory(id) {
  const updated = getLocalHistory().filter((a) => a._id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}
