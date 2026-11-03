// Original simplified illustrations, not Databricks screenshots.
// UI paths: official Unity Catalog manage-privileges and data-lineage docs.
(function (root) {
  root.DataLab.mockui.register('s10', {
    's10-object': {
      title: { es: 'Catalog: objeto del laboratorio (vista simplificada)', en: 'Catalog: lab object (simplified view)' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 's10-workspace', label: 'Workspace' }, { id: 's10-catalog', label: 'Catalog' }] },
        { kind: 'tree', heading: 'catalog.s10_lab_SUFFIX', targets: [{ id: 's10-orders', label: 'orders' }, { id: 's10-totals', label: 'region_totals' }, { id: 's10-files', label: 'lab_files' }] },
        { kind: 'tabs', targets: [{ id: 's10-overview', label: 'Overview' }, { id: 's10-permissions', label: 'Permissions' }, { id: 's10-lineage', label: 'Lineage' }] },
      ],
    },
    's10-permissions': {
      title: { es: 'Permissions: inspeccionar, no modificar', en: 'Permissions: inspect, do not modify' },
      regions: [
        { kind: 'tabs', targets: [{ id: 's10-overview', label: 'Overview' }, { id: 's10-permissions', label: 'Permissions' }, { id: 's10-lineage', label: 'Lineage' }] },
        { kind: 'toolbar', heading: 'Permissions', targets: [{ id: 's10-grant', label: 'Grant' }] },
        { kind: 'main', targets: [{ id: 's10-owner', label: { es: 'Propietario del objeto', en: 'Object owner' } }, { id: 's10-privileges', label: { es: 'Privilegios del objeto', en: 'Object privileges' } }] },
      ],
    },
    's10-grant': {
      title: { es: 'Grant: ilustración conceptual; no confirmar en el laboratorio', en: 'Grant: conceptual illustration; do not confirm in the lab' },
      regions: [
        { kind: 'form', heading: 'Grant', targets: [{ id: 's10-principals', label: { es: 'Principal: grupo autorizado existente', en: 'Principal: existing authorized group' } }, { id: 's10-select', label: 'SELECT' }, { id: 's10-modify', label: 'MODIFY' }, { id: 's10-ok', label: 'OK' }] },
      ],
    },
    's10-lineage': {
      title: { es: 'Lineage: dependencia de region_totals', en: 'Lineage: region_totals dependency' },
      regions: [
        { kind: 'tabs', targets: [{ id: 's10-overview', label: 'Overview' }, { id: 's10-permissions', label: 'Permissions' }, { id: 's10-lineage', label: 'Lineage' }] },
        { kind: 'toolbar', targets: [{ id: 's10-graph', label: 'See Lineage Graph' }] },
        { kind: 'main', heading: { es: 'Relación esperada tras la captura', en: 'Expected relationship after capture' }, targets: [{ id: 's10-source', label: 'orders →' }, { id: 's10-output', label: 'region_totals' }] },
      ],
    },
  });
})(globalThis);
