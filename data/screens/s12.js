// Original simplified illustrations, not screenshots. Notebook labels reuse the
// verified shared notebook screen. Batch/offset controls are educational only.
(function (root) {
  root.DataLab.mockui.register('s12', {
    's12-notebook': {
      title: { es: 'Maqueta simplificada: notebook de simulación, no stream activo', en: 'Simplified mock: simulation notebook, not a live stream' },
      regions: [
        { kind: 'toolbar', heading: 's12_simulation', targets: [{ id: 'language', label: 'Python ▾' }, { id: 'compute', label: 'Serverless ▾' }, { id: 'runAll', label: 'Run all' }] },
        { kind: 'main', heading: { es: 'Celda Python: solo biblioteca estándar', en: 'Python cell: standard library only' }, targets: [{ id: 'code', label: 'process(batch1)' }] },
      ],
    },
    's12-batches': {
      title: { es: 'Ilustración educativa: lotes y offsets (no controles de Databricks)', en: 'Educational illustration: batches and offsets (not Databricks controls)' },
      regions: [
        { kind: 'main', heading: { es: 'SIMULACIÓN DE PROCESAMIENTO DE FLUJOS · una partición', en: 'STREAM-PROCESSING SIMULATION · one partition' }, targets: [
          { id: 'batch1', label: 'batch1: offsets [0, 1]' },
          { id: 'batch2', label: 'batch2: offsets [1, 2]' },
          { id: 'lastOffset', label: { es: 'Inspeccionar last_offset = 2 (solo memoria)', en: 'Inspect last_offset = 2 (memory only)' } },
          { id: 'replay', label: { es: 'Repetir batch2: accepted = 0', en: 'Replay batch2: accepted = 0' } },
        ] },
      ],
    },
    's12-windows': {
      title: { es: 'Ilustración educativa: ventanas por event_time (no interfaz de Spark)', en: 'Educational illustration: event_time windows (not the Spark UI)' },
      regions: [
        { kind: 'main', heading: { es: 'Ventanas semiabiertas UTC de cinco minutos', en: 'Five-minute half-open UTC windows' }, targets: [
          { id: 'first', label: '[10:00, 10:05): count=2 total=30' },
          { id: 'second', label: '[10:05, 10:10): count=1 total=5' },
          { id: 'businessTime', label: { es: 'event_time: hora del negocio, no timestamp del broker', en: 'event_time: business time, not broker timestamp' } },
          { id: 'watermark', label: { es: 'Concepto: watermark según progreso de event_time; no implementado', en: 'Concept: watermark follows event_time progress; not implemented' } },
        ] },
      ],
    },
  });
})(globalThis);
