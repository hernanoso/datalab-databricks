// Hash routes keep the site working from file:// and from any static host.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  const TOTAL_SESSIONS = 16;

  function parse(hash) {
    const path = String(hash || '').replace(/^#/, '');
    if (path === '' || path === '/') return { view: 'home' };
    const match = /^\/sesion\/(\d{1,2})$/.exec(path);
    if (match) {
      const number = Number(match[1]);
      if (number >= 1 && number <= TOTAL_SESSIONS) return { view: 'session', number };
    }
    return { view: 'notfound' };
  }

  function sessionHref(number) {
    return `#/sesion/${number}`;
  }

  DataLab.router = { parse, sessionHref };
})(globalThis);
