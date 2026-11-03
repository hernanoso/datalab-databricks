// Original simplified illustrations, not screenshots; no external operation is performed.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.mockui.register('s13', {
    's13-new': {
      title: { es: 'Maqueta simplificada: crear dashboard (solo orientación)', en: 'Simplified mock: create dashboard (orientation only)' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'new', label: 'New' }] },
        { kind: 'menu', targets: [{ id: 'dashboard', label: 'Dashboard' }, { id: 'notebook', label: 'Notebook' }] },
      ],
    },
    's13-data': {
      title: { es: 'Maqueta simplificada: consulta de dataset (no ejecuta SQL)', en: 'Simplified mock: dataset query (does not execute SQL)' },
      regions: [
        { kind: 'tabs', targets: [{ id: 'data', label: 'Data' }] },
        { kind: 'toolbar', targets: [{ id: 'addSql', label: 'Add SQL dataset' }, { id: 'run', label: 'Run' }] },
        { kind: 'main', heading: { es: 'Datos sintéticos: order_id / region / amount', en: 'Synthetic data: order_id / region / amount' }, targets: [{ id: 'rows', label: '1 / North / 10; 2 / North / 20; 3 / South / 15; 4 / South / 5' }] },
      ],
    },
    's13-report': {
      title: { es: 'Maqueta de reporte propia: filtro ilustrativo, no consulta Databricks', en: 'Original report mock: illustrative filter, does not query Databricks' },
      regions: [
        { kind: 'main', heading: { es: 'Cuatro pedidos sintéticos, una fila por pedido', en: 'Four synthetic orders, one row per order' }, targets: [{ id: 'rows', label: '1 / North / 10; 2 / North / 20; 3 / South / 15; 4 / South / 5' }] },
        { kind: 'form', heading: { es: 'Comparar resultados precalculados; no cambia el reporte', en: 'Compare precomputed results; does not change the report' }, targets: [{ id: 'all', label: { es: 'Todas: ingresos 50.00; pedidos 4; promedio 12.50', en: 'All: revenue 50.00; orders 4; average 12.50' } }, { id: 'north', label: { es: 'North: ingresos 30.00; pedidos 2; promedio 15.00', en: 'North: revenue 30.00; orders 2; average 15.00' } }, { id: 'south', label: { es: 'South: ingresos 20.00; pedidos 2; promedio 10.00', en: 'South: revenue 20.00; orders 2; average 10.00' } }] },
      ],
    },
    's13-powerbi': {
      product: 'Power BI',
      title: { es: 'Maqueta empresarial ilustrativa de Desktop: conexión Free Edition NO VERIFICADA; no conecta', en: 'Illustrative enterprise Desktop mock: Free Edition connection UNVERIFIED; does not connect' },
      regions: [
        { kind: 'toolbar', targets: [{ id: 'getData', label: 'Get data' }] },
        { kind: 'menu', targets: [{ id: 'databricks', label: 'Databricks' }, { id: 'connect', label: 'Connect' }] },
        { kind: 'form', heading: { es: 'Sin datos reales ni credenciales', en: 'No real connection details or credentials' }, targets: [{ id: 'hostname', label: 'Server Hostname' }, { id: 'httpPath', label: 'HTTP Path' }, { id: 'import', label: 'Import' }, { id: 'directQuery', label: 'DirectQuery' }] },
      ],
    },
    's13-share': {
      title: { es: 'Maqueta simplificada empresarial: publicación (no publicar en el laboratorio)', en: 'Simplified enterprise mock: publishing (do not publish in the lab)' },
      regions: [
        { kind: 'toolbar', targets: [{ id: 'publish', label: 'Publish' }] },
        { kind: 'form', heading: { es: 'Decisión de permisos, no una acción del laboratorio', en: 'Permission decision, not a lab action' }, targets: [{ id: 'shareData', label: 'Share with data permissions' }] },
      ],
    },
  });
})(globalThis);
