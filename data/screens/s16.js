// Original simplified UI illustrations, not screenshots. Navigation identification only.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.mockui.register('s16', {
    's16-playground': {
      title: { es: 'Maqueta simplificada: orientación en Playground; no envía prompts', en: 'Simplified mock: Playground orientation; sends no prompts' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'playground', label: 'Playground' }] },
        { kind: 'main', heading: { es: 'Solo orientación: sin inferencia real', en: 'Orientation only: no real inference' }, targets: [{ id: 'fixture', label: 'C-42: 10 + 25 = 35.0; orders = 2' }] },
      ],
    },
    's16-tools': {
      title: { es: 'Maqueta simplificada: Tools → + Add tool; no crea herramientas', en: 'Simplified mock: Tools → + Add tool; creates no tools' },
      regions: [
        { kind: 'tabs', targets: [{ id: 'tools', label: 'Tools' }] },
        { kind: 'toolbar', targets: [{ id: 'addTool', label: '+ Add tool' }] },
        { kind: 'main', heading: { es: 'Contrato didáctico, no ejecutable desde la maqueta', en: 'Teaching contract, not executable from the mock' }, targets: [{ id: 'schema', label: 'sales_total(customer_id: string) → orders, total' }] },
      ],
    },
    's16-enabled': {
      title: { es: 'Maqueta simplificada: Tools enabled no concede autorización', en: 'Simplified mock: Tools enabled does not grant authorization' },
      regions: [
        { kind: 'toolbar', targets: [{ id: 'enabled', label: 'Tools enabled' }] },
        { kind: 'main', heading: { es: 'No cambia opciones ni ejecuta herramientas', en: 'Does not change settings or execute tools' }, targets: [{ id: 'boundary', label: { es: 'La aplicación valida nombre, argumentos y autorización antes del despacho real', en: 'Application validates name, arguments and authorization before real dispatch' } }] },
      ],
    },
    's16-code': {
      title: { es: 'Maqueta simplificada: ruta actual de código; no exportar ni desplegar', en: 'Simplified mock: current code route; do not export or deploy' },
      regions: [
        { kind: 'toolbar', targets: [{ id: 'getCode', label: 'Get code' }] },
        { kind: 'menu', targets: [{ id: 'exportApps', label: 'Export to Databricks Apps' }] },
        { kind: 'main', heading: { es: 'Solo identificación; ninguna acción externa', en: 'Identification only; no external action' }, targets: [{ id: 'legacy', label: { es: 'Exportar a notebook: ruta heredada, no la recomendación actual', en: 'Notebook export: legacy route, not the current recommendation' } }] },
      ],
    },
  });
})(globalThis);
