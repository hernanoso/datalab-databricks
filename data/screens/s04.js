// Original simplified UI illustrations, not screenshots. English labels follow the research handoff.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.mockui.register('s04', {
    's04-credentials': {
      title: { es: 'Catalog: credenciales y menú Add', en: 'Catalog: credentials and Add menu' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'catalog', label: 'Catalog' }] },
        { kind: 'tabs', heading: 'Connect', targets: [{ id: 'connect', label: 'Connect' }, { id: 'credentials', label: 'Credentials' }, { id: 'locations', label: 'External Locations' }] },
        { kind: 'main', heading: 'Credentials', targets: [{ id: 'purpose', label: 'Purpose' }, { id: 'storage', label: 'STORAGE' }, { id: 'service', label: 'SERVICE' }] },
        { kind: 'toolbar', targets: [{ id: 'add', label: 'Add (+)' }] },
        { kind: 'menu', heading: 'Add (+)', targets: [{ id: 'createCredential', label: 'Create a credential' }, { id: 'managedIdentity', label: 'Azure Managed Identity' }] },
      ],
    },
    's04-location': {
      title: { es: 'Crear una ubicación externa', en: 'Create an external location' },
      regions: [
        { kind: 'tabs', heading: 'Catalog', targets: [{ id: 'connect', label: 'Connect' }, { id: 'locations', label: 'External Locations' }] },
        { kind: 'toolbar', targets: [{ id: 'createLocation', label: 'Create an external location' }] },
        { kind: 'form', heading: 'Create an external location', targets: [{ id: 'name', label: 'External location name' }, { id: 'storageType', label: 'Storage type' }, { id: 'url', label: 'URL' }, { id: 'credential', label: 'Storage credential' }] },
      ],
    },
    's04-connection': {
      title: { es: 'Crear una conexión SQL Server', en: 'Create a SQL Server connection' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'catalog', label: 'Catalog' }] },
        { kind: 'menu', heading: 'Add (+)', targets: [{ id: 'add', label: 'Add (+)' }, { id: 'createConnection', label: 'Create a connection' }, { id: 'addCatalog', label: 'Add a catalog' }] },
        { kind: 'form', heading: 'Connection basics', targets: [{ id: 'basics', label: 'Connection basics' }, { id: 'name', label: 'Connection name' }, { id: 'type', label: 'Connection type' }, { id: 'sqlServer', label: 'SQL Server' }, { id: 'auth', label: 'Auth type' }, { id: 'create', label: 'Create connection' }] },
        { kind: 'main', heading: 'Catalog basics', targets: [{ id: 'catalogBasics', label: 'Catalog basics' }, { id: 'createCatalog', label: 'Create catalog' }] },
      ],
    },
    's04-secrets': {
      title: { es: 'Secret scope: #secrets/createScope', en: 'Secret scope: #secrets/createScope' },
      regions: [
        { kind: 'form', heading: '#secrets/createScope', targets: [{ id: 'principal', label: 'Manage Principal' }, { id: 'dns', label: 'DNS Name' }, { id: 'resource', label: 'Resource ID' }, { id: 'create', label: 'Create' }] },
      ],
    },
  });
})(globalThis);
