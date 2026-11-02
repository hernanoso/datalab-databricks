// Original simplified UI illustrations, not screenshots. Labels follow the official
// Catalog Explorer (Explore database objects, table History tab) and predictive
// optimization (account console Feature enablement) documentation.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.mockui.register('s05', {
    's05-table': {
      title: { es: 'Catalog Explorer: página de una tabla', en: 'Catalog Explorer: table page' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'catalog', label: 'Catalog' }] },
        {
          kind: 'tree',
          heading: 'Catalog',
          targets: [
            { id: 'yourCatalog', label: { es: '<tu_catalogo>', en: '<your_catalog>' } },
            { id: 'schema', label: 's05_lab' },
            { id: 'table', label: { es: 'clientes', en: 'customers' } },
          ],
        },
        {
          kind: 'tabs',
          heading: 's05_lab',
          targets: [
            { id: 'columns', label: 'Columns' },
            { id: 'sampleData', label: 'Sample Data' },
            { id: 'details', label: 'Details' },
            { id: 'history', label: 'History' },
            { id: 'insights', label: 'Insights' },
          ],
        },
      ],
    },
    's05-history': {
      title: { es: 'Pestaña History: tipo de ejecución', en: 'History tab: run type' },
      regions: [
        { kind: 'tabs', targets: [{ id: 'details', label: 'Details' }, { id: 'history', label: 'History' }] },
        { kind: 'toolbar', targets: [{ id: 'runFilter', label: 'All runs ▾' }] },
        {
          kind: 'menu',
          targets: [
            { id: 'allRuns', label: 'All runs' },
            { id: 'automaticRuns', label: 'Automatic runs' },
            { id: 'manualRuns', label: 'Manual runs' },
          ],
        },
        {
          kind: 'main',
          heading: 'History',
          targets: [
            { id: 'operation', label: 'Operation' },
            { id: 'autoRow', label: 'OPTIMIZE · Auto' },
            { id: 'notApplied', label: 'VACUUM · Not applied' },
          ],
        },
      ],
    },
    's05-account': {
      title: { es: 'Consola de cuenta: Feature enablement', en: 'Account console: Feature enablement' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'settings', label: 'Settings' }] },
        { kind: 'tabs', heading: 'Settings', targets: [{ id: 'featureEnablement', label: 'Feature enablement' }] },
        {
          kind: 'form',
          heading: 'Feature enablement',
          targets: [
            { id: 'predictiveOptimization', label: 'Predictive optimization' },
            { id: 'enabled', label: 'Enabled' },
          ],
        },
      ],
    },
  });
})(globalThis);
