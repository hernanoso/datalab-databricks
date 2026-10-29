// Original simplified illustrations, not screenshots. English labels follow
// the official SQL Editor, visualization and Catalog documentation in the handoff.
(function (root) {
  root.DataLab.mockui.register('s02', {
    's02-sql': {
      title: { es: 'SQL Editor: ejecución de consultas', en: 'SQL Editor: query execution' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'sqlEditor', label: 'SQL Editor' }] },
        {
          kind: 'toolbar',
          targets: [
            { id: 'run', label: 'Run (1000)' },
            { id: 'runAll', label: 'Run all statements' },
            { id: 'limit', label: 'Limit 1000' },
            { id: 'cancel', label: 'Cancel' },
          ],
        },
      ],
    },
    's02-results': {
      title: { es: 'Resultados: menú de visualización', en: 'Results: visualization menu' },
      regions: [
        { kind: 'toolbar', targets: [{ id: 'plus', label: '+' }] },
        { kind: 'menu', targets: [{ id: 'visualization', label: 'Visualization' }] },
      ],
    },
    's02-chart': {
      title: { es: 'Editor de visualizaciones', en: 'Visualization editor' },
      regions: [
        {
          kind: 'form',
          targets: [
            { id: 'type', label: 'Visualization Type' },
            { id: 'yColumns', label: 'Y columns' },
            { id: 'aggregation', label: 'Use aggregation' },
          ],
        },
        { kind: 'toolbar', targets: [{ id: 'save', label: 'Save' }] },
      ],
    },
    's02-table': {
      title: { es: 'Catalog: explorar una tabla', en: 'Catalog: explore a table' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'catalog', label: 'Catalog' }] },
        {
          kind: 'tabs',
          targets: [
            { id: 'sampleData', label: 'Sample Data' },
            { id: 'columns', label: 'Columns' },
          ],
        },
        { kind: 'main', targets: [{ id: 'relationships', label: 'View relationships' }] },
      ],
    },
  });
})(globalThis);
