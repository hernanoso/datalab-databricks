// Original simplified UI illustrations, not screenshots. Labels follow the official
// volume-files and manage-external-locations documentation (verified November 2026).
(function (root) {
  root.DataLab.mockui.register('s06', {
    's06-upload': {
      title: { es: 'Subir archivos a un volumen', en: 'Upload files to a volume' },
      regions: [
        { kind: 'sidebar', active: 'new', targets: [{ id: 'new', label: '+ New' }] },
        { kind: 'menu', heading: 'New', targets: [{ id: 'addData', label: 'Add or upload data' }] },
        { kind: 'main', targets: [{ id: 'uploadFiles', label: 'Upload files to a volume' }] },
        {
          kind: 'form',
          heading: 'Upload files to a volume',
          targets: [
            { id: 'browse', label: 'Files: browse' },
            { id: 'destination', label: 'Destination volume' },
            { id: 'createVolume', label: 'Create volume' },
          ],
        },
      ],
    },
    's06-volume': {
      title: { es: 'Catalog Explorer: archivos de un volumen', en: 'Catalog Explorer: files in a volume' },
      regions: [
        {
          kind: 'tree',
          heading: 'Catalog',
          targets: [
            { id: 'yourCatalog', label: { es: '<tu_catalogo>', en: '<your_catalog>' } },
            { id: 'schema', label: 's06_lab' },
            { id: 'volume', label: 'landing' },
          ],
        },
        { kind: 'toolbar', heading: 'landing', targets: [{ id: 'createDirectory', label: 'Create directory' }, { id: 'download', label: 'Download' }, { id: 'delete', label: 'Delete' }] },
        { kind: 'main', heading: 'Overview', targets: [{ id: 'csvDir', label: 'csv/' }, { id: 'jsonDir', label: 'json/' }, { id: 'file', label: 'json/orders_004.json' }] },
        {
          kind: 'menu',
          heading: '⋮',
          targets: [
            { id: 'openEditor', label: 'Open in Editor' },
            { id: 'copyPath', label: 'Copy path' },
            { id: 'downloadFile', label: 'Download file' },
            { id: 'deleteFile', label: 'Delete file' },
            { id: 'createTable', label: 'Create table' },
          ],
        },
      ],
    },
    's06-fileEvents': {
      title: { es: 'Ubicación externa: activar file events', en: 'External location: enable file events' },
      regions: [
        { kind: 'sidebar', active: 'catalog', targets: [{ id: 'catalog', label: 'Catalog' }] },
        { kind: 'tabs', heading: 'Connect', targets: [{ id: 'locations', label: 'External Locations' }] },
        { kind: 'toolbar', targets: [{ id: 'testConnection', label: 'Test connection' }, { id: 'edit', label: '⋮ → Edit' }] },
        {
          kind: 'form',
          heading: 'Edit',
          targets: [
            { id: 'advanced', label: 'Advanced Options' },
            { id: 'enableFileEvents', label: 'Enable file events' },
            { id: 'eventType', label: 'File event type' },
            { id: 'automatic', label: 'Automatic' },
            { id: 'provided', label: 'Provided' },
            { id: 'queueUrl', label: 'Queue URL' },
            { id: 'update', label: 'Update' },
          ],
        },
      ],
    },
  });
})(globalThis);
