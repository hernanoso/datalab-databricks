// Original simplified illustrations, not screenshots. Enterprise-only concepts; unavailable in Free Edition.
// Verified labels come from the parent research handoff. No mock saves or changes real settings.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.mockui.register('s11', {
    's11-groups': {
      title: { es: 'Maqueta simplificada empresarial: grupos (no disponible en Free Edition)', en: 'Simplified enterprise mock: groups (unavailable in Free Edition)' },
      regions: [
        { kind: 'menu', heading: 'Settings', targets: [{ id: 'settings', label: 'Settings' }] },
        { kind: 'tabs', heading: 'Settings', targets: [{ id: 'identity', label: 'Identity and access' }] },
        { kind: 'main', heading: 'Groups', targets: [{ id: 'groups', label: 'Groups' }, { id: 'manage', label: 'Manage' }] },
      ],
    },
    's11-account': {
      title: { es: 'Maqueta simplificada empresarial: consola de cuenta (no disponible en Free Edition)', en: 'Simplified enterprise mock: account console (unavailable in Free Edition)' },
      regions: [
        { kind: 'menu', heading: { es: 'Selector de workspace', en: 'Workspace selector' }, targets: [{ id: 'manageAccount', label: 'Manage account' }] },
        { kind: 'sidebar', targets: [{ id: 'userManagement', label: 'User management' }] },
        { kind: 'tabs', heading: 'User management', targets: [{ id: 'groups', label: 'Groups' }] },
      ],
    },
    's11-policies': {
      title: { es: 'Maqueta simplificada empresarial: políticas clásicas (no disponible en Free Edition)', en: 'Simplified enterprise mock: classic policies (unavailable in Free Edition)' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'compute', label: 'Compute' }] },
        { kind: 'tabs', heading: 'Compute', targets: [{ id: 'policies', label: 'Policies' }] },
        { kind: 'toolbar', targets: [{ id: 'createPolicy', label: 'Create policy' }, { id: 'permissions', label: 'See all permissions' }] },
        { kind: 'form', heading: 'Definitions', targets: [{ id: 'definitions', label: 'Definitions' }, { id: 'editJson', label: 'Edit definition as JSON' }] },
      ],
    },
    's11-audit': {
      title: { es: 'Maqueta simplificada empresarial: auditoría (solo con acceso previo; no garantizado en Free Edition)', en: 'Simplified enterprise mock: auditing (existing access only; not guaranteed in Free Edition)' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'catalog', label: 'Catalog' }] },
        { kind: 'tree', heading: { es: 'Solo si está habilitado y autorizado', en: 'Only if enabled and authorized' }, targets: [{ id: 'system', label: 'system' }, { id: 'access', label: 'access' }, { id: 'audit', label: 'audit' }] },
      ],
    },
  });
})(globalThis);
