// Original simplified UI illustrations, not screenshots. Labels follow the
// official Lakeflow Pipelines Editor, Configure pipelines, Run a pipeline update,
// Expectations and Monitor pipelines in the UI documentation.
(function (root) {
  root.DataLab.mockui.register('s09', {
    's09-new': {
      title: { es: 'Menú New: crear un pipeline ETL', en: 'New menu: create an ETL pipeline' },
      regions: [
        {
          kind: 'sidebar',
          active: 'new',
          targets: [
            { id: 'new', label: '+ New' },
            { id: 'workspace', label: 'Workspace' },
            { id: 'catalog', label: 'Catalog' },
            { id: 'jobs', label: 'Jobs & Pipelines' },
          ],
        },
        {
          kind: 'menu',
          heading: 'New',
          targets: [
            { id: 'notebook', label: 'Notebook' },
            { id: 'query', label: 'Query' },
            { id: 'job', label: 'Job' },
            { id: 'etlPipeline', label: 'ETL pipeline' },
          ],
        },
      ],
    },
    's09-editor': {
      title: { es: 'Lakeflow Pipelines Editor: archivos del pipeline', en: 'Lakeflow Pipelines Editor: pipeline files' },
      regions: [
        {
          kind: 'toolbar',
          heading: 's09_pipeline',
          targets: [
            { id: 'catalogSchema', label: { es: '<tu_catalogo>.s09_lab', en: '<your_catalog>.s09_lab' } },
            { id: 'settings', label: 'Settings' },
            { id: 'schedule', label: 'Schedule' },
          ],
        },
        { kind: 'tabs', targets: [{ id: 'pipelineTab', label: 'Pipeline' }, { id: 'allFiles', label: 'All files' }] },
        {
          kind: 'tree',
          heading: 'Pipeline',
          targets: [
            { id: 'rootFolder', label: 's09_pipeline' },
            { id: 'add', label: '+' },
            { id: 'transformations', label: 'transformations' },
            { id: 'explorations', label: 'explorations' },
          ],
        },
        {
          kind: 'menu',
          heading: '+',
          targets: [
            { id: 'transformation', label: 'Transformation' },
            { id: 'exploration', label: 'Exploration' },
            { id: 'utility', label: 'Utility' },
          ],
        },
        {
          kind: 'form',
          heading: 'Transformation',
          targets: [
            { id: 'fileName', label: 'Name' },
            { id: 'language', label: 'Language: SQL' },
            { id: 'create', label: 'Create' },
          ],
        },
      ],
    },
    's09-run': {
      title: { es: 'Lakeflow Pipelines Editor: ejecutar y revisar', en: 'Lakeflow Pipelines Editor: run and review' },
      regions: [
        {
          kind: 'toolbar',
          targets: [
            { id: 'runPipeline', label: 'Run pipeline' },
            { id: 'fullRefresh', label: 'Run pipeline with full table refresh' },
            { id: 'dryRun', label: 'Dry run' },
            { id: 'runFile', label: 'Run file' },
          ],
        },
        {
          kind: 'main',
          heading: 'Pipeline graph',
          targets: [
            { id: 'bronzeNode', label: 'orders_bronze' },
            { id: 'silverNode', label: 'orders_silver' },
            { id: 'goldNode', label: 'sales_by_day' },
          ],
        },
        {
          kind: 'tabs',
          targets: [
            { id: 'graphTab', label: 'Pipeline graph' },
            { id: 'tablesTab', label: 'Tables' },
            { id: 'performanceTab', label: 'Performance' },
            { id: 'issuesTab', label: 'Issues' },
            { id: 'eventLogTab', label: 'Event log' },
          ],
        },
      ],
    },
    's09-monitor': {
      title: { es: 'Jobs & Pipelines: página de monitoreo del pipeline', en: 'Jobs & Pipelines: pipeline monitoring page' },
      regions: [
        {
          kind: 'sidebar',
          active: 'jobs',
          targets: [
            { id: 'catalog', label: 'Catalog' },
            { id: 'jobs', label: 'Jobs & Pipelines' },
          ],
        },
        {
          kind: 'toolbar',
          heading: 's09_pipeline',
          targets: [
            { id: 'editPipeline', label: 'Edit pipeline' },
            { id: 'settings', label: 'Settings' },
            { id: 'refreshFailed', label: 'Refresh failed tables' },
          ],
        },
        { kind: 'tabs', heading: 'Pipeline graph', targets: [{ id: 'graph', label: 'Graph' }, { id: 'list', label: 'List' }] },
        {
          kind: 'main',
          heading: 'Graph',
          targets: [
            { id: 'bronzeNode', label: 'orders_bronze' },
            { id: 'silverNode', label: 'orders_silver' },
            { id: 'goldNode', label: 'sales_by_day' },
          ],
        },
        { kind: 'tabs', heading: 'orders_silver', targets: [{ id: 'dataQuality', label: 'Data quality' }] },
        {
          kind: 'main',
          heading: 'Update details',
          targets: [
            { id: 'pipelineId', label: 'Pipeline ID' },
            { id: 'edition', label: 'Product edition: Advanced' },
            { id: 'viewEventLog', label: 'View event log' },
          ],
        },
      ],
    },
  });
})(globalThis);
