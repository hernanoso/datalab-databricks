// Thematic tracks give each group of sessions its own color.
// Every color passes WCAG AA contrast with white text.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});

  DataLab.tracks = {
    fundamentos: { color: '#6d28d9', tint: '#ede9fe', label: { es: 'Fundamentos', en: 'Foundations' } },
    procesamiento: { color: '#1d4ed8', tint: '#dbeafe', label: { es: 'Procesamiento', en: 'Processing' } },
    delta: { color: '#0f766e', tint: '#ccfbf1', label: { es: 'Delta Lake', en: 'Delta Lake' } },
    orquestacion: { color: '#c2410c', tint: '#ffedd5', label: { es: 'Orquestación', en: 'Orchestration' } },
    gobernanza: { color: '#be185d', tint: '#fce7f3', label: { es: 'Gobernanza y seguridad', en: 'Governance and security' } },
    streaming: { color: '#0e7490', tint: '#cffafe', label: { es: 'Tiempo real', en: 'Real time' } },
    analitica: { color: '#15803d', tint: '#dcfce7', label: { es: 'Analítica', en: 'Analytics' } },
    devops: { color: '#4338ca', tint: '#e0e7ff', label: { es: 'DevOps', en: 'DevOps' } },
    ia: { color: '#a21caf', tint: '#fae8ff', label: { es: 'Inteligencia artificial', en: 'Artificial intelligence' } },
  };
})(globalThis);
