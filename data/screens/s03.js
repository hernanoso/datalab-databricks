// Original, simplified UI illustrations, not screenshots. Only documented labels.
(function (root) {
  root.DataLab.mockui.register('s03', {
    's03-results': {
      title: { es: 'Resultado del notebook y menú de análisis', en: 'Notebook result and analysis menu' },
      regions: [
        { kind: 'tabs', targets: [{ id: 'table', label: 'Table' }, { id: 'add', label: '+' }] },
        { kind: 'menu', targets: [{ id: 'visualization', label: 'Visualization' }, { id: 'dataProfile', label: 'Data Profile' }] },
      ],
    },
    's03-performance': {
      title: { es: 'Ruta al perfil de consulta en serverless', en: 'Path to the serverless query profile' },
      regions: [
        { kind: 'toolbar', targets: [{ id: 'performance', label: 'See performance' }] },
        { kind: 'main', targets: [{ id: 'queryProfile', label: 'See query profile' }] },
      ],
    },
    's03-chart': {
      title: { es: 'Editor simplificado de visualización', en: 'Simplified visualization editor' },
      regions: [
        { kind: 'form', targets: [{ id: 'chartType', label: 'Visualization Type' }] },
        { kind: 'toolbar', targets: [{ id: 'save', label: 'Save' }] },
      ],
    },
    's03-cell': {
      title: { es: 'Lenguaje y ejecución de celdas', en: 'Cell language and execution' },
      regions: [
        { kind: 'toolbar', targets: [{ id: 'runAll', label: 'Run All' }] },
        { kind: 'menu', targets: [{ id: 'python', label: 'Python' }, { id: 'above', label: 'Run All Above' }, { id: 'below', label: 'Run All Below' }] },
      ],
    },
  });
})(globalThis);
