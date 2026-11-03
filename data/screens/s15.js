// Original simplified illustrations, not screenshots. No prompt is submitted.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.mockui.register('s15', {
    's15-entry': {
      title: { es: 'Maqueta simplificada: AI/ML → Playground (sin inferencia)', en: 'Simplified mock: AI/ML → Playground (no inference)' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'aiml', label: 'AI/ML' }] },
        { kind: 'menu', targets: [{ id: 'playground', label: 'Playground' }] },
        { kind: 'main', targets: [{ id: 'notice', label: { es: 'Solo orientación: no envía prompts ni conecta con modelos', en: 'Orientation only: does not submit prompts or connect to models' } }] },
      ],
    },
    's15-model': {
      title: { es: 'Maqueta simplificada: selector de modelo (sin conexión)', en: 'Simplified mock: model dropdown (no connection)' },
      regions: [
        { kind: 'toolbar', targets: [{ id: 'model', label: { es: 'Selector de modelo', en: 'Model dropdown' } }, { id: 'add', label: '+' }, { id: 'sync', label: 'Sync' }] },
        { kind: 'main', heading: { es: 'Comparación conceptual; no hay respuestas reales', en: 'Conceptual comparison; no real responses' }, targets: [{ id: 'panel', label: { es: 'Panel de modelo ilustrativo, sin endpoint', en: 'Illustrative model panel, no endpoint' } }] },
      ],
    },
  });
})(globalThis);
