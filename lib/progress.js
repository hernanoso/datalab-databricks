// Progress lives only in this browser (localStorage); there are no accounts.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  const STORAGE_KEY = 'datalab.progress.v1';

  function empty() {
    return { version: 1, sessions: {} };
  }

  function isValid(value) {
    return Boolean(value) && value.version === 1 && typeof value.sessions === 'object' &&
      value.sessions !== null && !Array.isArray(value.sessions);
  }

  // Unreadable data is ignored but left in place, so nothing is silently erased.
  function load(storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return empty();
      const parsed = JSON.parse(raw);
      return isValid(parsed) ? parsed : empty();
    } catch {
      return empty();
    }
  }

  function save(storage, progress) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch {
      return false;
    }
  }

  function update(progress, id, change) {
    const current = progress.sessions[id] || {};
    return { ...progress, sessions: { ...progress.sessions, [id]: { ...current, ...change } } };
  }

  function setStudied(progress, id, studied) {
    return update(progress, id, { studied: Boolean(studied) });
  }

  function recordQuiz(progress, id, score, total) {
    const previous = (progress.sessions[id] || {}).quiz;
    const best = previous ? Math.max(previous.best, score) : score;
    const attempts = previous ? previous.attempts + 1 : 1;
    return update(progress, id, { quiz: { best, total, attempts } });
  }

  function summary(progress, sessionIds) {
    const studied = sessionIds.filter((id) => progress.sessions[id] && progress.sessions[id].studied).length;
    const total = sessionIds.length;
    return { studied, total, percent: total ? Math.round((studied / total) * 100) : 0 };
  }

  DataLab.progress = { STORAGE_KEY, load, save, setStudied, recordQuiz, summary };
})(globalThis);
