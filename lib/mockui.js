// Simplified, original illustrations of the Databricks workspace used by the
// "where do you click?" questions and the lab steps. They are not screenshots;
// labels stay in English, like the Databricks interface, and only follow UI
// paths described in the official documentation (see odd research notes).
// Region kinds: sidebar, menu, tree, toolbar, main, form and tabs.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});

  const sidebar = (active) => ({
    kind: 'sidebar',
    active,
    targets: [
      { id: 'new', label: '+ New' },
      { id: 'workspace', label: 'Workspace' },
      { id: 'catalog', label: 'Catalog' },
      { id: 'jobs', label: 'Jobs & Pipelines' },
      { id: 'compute', label: 'Compute' },
      { id: 'sqlEditor', label: 'SQL Editor' },
      { id: 'playground', label: 'Playground' },
    ],
  });

  const screens = {
    home: {
      title: { es: 'Página de inicio del workspace', en: 'Workspace home page' },
      regions: [
        sidebar(null),
        { kind: 'main', heading: 'Home', targets: [{ id: 'askGenie', label: 'Ask Genie' }] },
      ],
    },
    newMenu: {
      title: { es: 'Menú New abierto', en: 'New menu open' },
      regions: [
        sidebar('new'),
        {
          kind: 'menu',
          heading: 'New',
          targets: [
            { id: 'notebook', label: 'Notebook' },
            { id: 'query', label: 'Query' },
            { id: 'job', label: 'Job' },
            { id: 'uploadData', label: 'Add or upload data' },
          ],
        },
      ],
    },
    catalog: {
      title: { es: 'Catalog Explorer con el esquema default', en: 'Catalog Explorer on the default schema' },
      regions: [
        {
          kind: 'tree',
          heading: 'Catalog',
          targets: [
            { id: 'samples', label: 'samples' },
            { id: 'yourCatalog', label: { es: '<tu_catalogo>', en: '<your_catalog>' } },
            { id: 'defaultSchema', label: 'default' },
          ],
        },
        { kind: 'toolbar', heading: 'default', targets: [{ id: 'create', label: 'Create' }] },
        {
          kind: 'menu',
          heading: 'Create',
          targets: [
            { id: 'table', label: 'Table' },
            { id: 'volume', label: 'Volume' },
          ],
        },
      ],
    },
    notebook: {
      title: { es: 'Notebook nuevo', en: 'New notebook' },
      regions: [
        {
          kind: 'toolbar',
          heading: 'Untitled Notebook',
          targets: [
            { id: 'languageSelect', label: 'SQL ▾' },
            { id: 'computeSelect', label: 'Serverless ▾' },
            { id: 'runAll', label: 'Run all' },
          ],
        },
        { kind: 'main', heading: 'Cell 1', targets: [{ id: 'cell', label: 'SELECT current_catalog();' }] },
      ],
    },
  };

  function target(screenId, targetId) {
    const screen = screens[screenId];
    if (!screen) return null;
    for (const region of screen.regions) {
      const found = region.targets.find((item) => item.id === targetId);
      if (found) return found;
    }
    return null;
  }

  function labelOf(item, lang) {
    return typeof item.label === 'string' ? item.label : item.label[lang] || item.label.es;
  }

  // Session files (data/screens/sNN.js) add their own screens. Ids must start
  // with the session id so parallel authors never collide; duplicates fail loudly.
  function register(sessionId, newScreens) {
    for (const [id, screen] of Object.entries(newScreens)) {
      if (screens[id]) throw new Error(`duplicate screen ${id}`);
      if (!id.startsWith(`${sessionId}-`)) throw new Error(`screen ${id} must start with ${sessionId}-`);
      screens[id] = screen;
    }
  }

  DataLab.mockui = { screens, target, labelOf, register };
})(globalThis);
