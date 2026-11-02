// Original simplified UI illustrations, not screenshots. Labels follow the
// official Azure Data Factory documentation: Create a data factory (portal),
// Run a Databricks notebook with the Notebook activity (tutorial), Management hub,
// Pipelines and activities, If Condition activity, Iterative development and
// debugging, Pipeline execution and triggers, Create schedule triggers and
// Visually monitor Azure Data Factory.
(function (root) {
  const hubs = (active) => ({
    kind: 'sidebar',
    active,
    targets: [
      { id: 'home', label: 'Home' },
      { id: 'author', label: 'Author' },
      { id: 'monitor', label: 'Monitor' },
      { id: 'manage', label: 'Manage' },
    ],
  });

  root.DataLab.mockui.register('s08', {
    's08-portal': {
      product: 'Azure portal',
      title: { es: 'Azure portal: crear un data factory', en: 'Azure portal: create a data factory' },
      regions: [
        {
          kind: 'menu',
          heading: 'Create a resource',
          targets: [
            { id: 'analytics', label: 'Analytics' },
            { id: 'dataFactory', label: 'Data Factory' },
          ],
        },
        {
          kind: 'form',
          heading: 'Create Data Factory · Basics',
          targets: [
            { id: 'subscription', label: 'Subscription' },
            { id: 'resourceGroup', label: 'Resource group' },
            { id: 'region', label: 'Region' },
            { id: 'name', label: 'Name' },
            { id: 'reviewCreate', label: 'Review + create' },
          ],
        },
        {
          kind: 'toolbar',
          heading: 'ADFTutorialDataFactory',
          targets: [
            { id: 'goToResource', label: 'Go to resource' },
            { id: 'launchStudio', label: 'Launch Studio' },
          ],
        },
      ],
    },
    's08-manage': {
      product: 'Azure Data Factory',
      title: { es: 'ADF Studio: hub Manage y linked services', en: 'ADF Studio: Manage hub and linked services' },
      regions: [
        hubs('manage'),
        {
          kind: 'tree',
          heading: 'Manage',
          targets: [
            { id: 'linkedServices', label: 'Linked services' },
            { id: 'integrationRuntimes', label: 'Integration runtimes' },
            { id: 'gitConfiguration', label: 'Git configuration' },
            { id: 'triggers', label: 'Triggers' },
            { id: 'globalParameters', label: 'Global parameters' },
          ],
        },
        { kind: 'toolbar', heading: 'Linked services', targets: [{ id: 'newLinked', label: '+ New' }] },
        {
          kind: 'menu',
          heading: 'New linked service',
          targets: [
            { id: 'dataStoreTab', label: 'Data store' },
            { id: 'computeTab', label: 'Compute' },
            { id: 'azureDatabricks', label: 'Azure Databricks' },
            { id: 'continue', label: 'Continue' },
          ],
        },
        {
          kind: 'form',
          heading: 'New linked service (Azure Databricks)',
          targets: [
            { id: 'lsName', label: 'Name' },
            { id: 'workspace', label: 'Databricks workspace' },
            { id: 'selectCluster', label: 'Select cluster: New job cluster' },
            { id: 'authType', label: 'Authentication type: Managed service identity' },
            { id: 'create', label: 'Create' },
          ],
        },
      ],
    },
    's08-author': {
      product: 'Azure Data Factory',
      title: { es: 'ADF Studio: editor del pipeline pl_ventas', en: 'ADF Studio: pl_ventas pipeline editor' },
      regions: [
        hubs('author'),
        {
          kind: 'toolbar',
          heading: 'pl_ventas',
          targets: [
            { id: 'validate', label: 'Validate' },
            { id: 'debug', label: 'Debug' },
            { id: 'addTrigger', label: 'Add trigger' },
            { id: 'publishAll', label: 'Publish all' },
          ],
        },
        {
          kind: 'tree',
          heading: 'Activities',
          targets: [
            { id: 'search', label: { es: 'Buscar: If', en: 'Search: If' } },
            { id: 'databricks', label: 'Databricks' },
            { id: 'notebook', label: 'Notebook' },
            { id: 'ifCondition', label: 'If Condition' },
          ],
        },
        {
          kind: 'main',
          heading: 'pipeline canvas',
          targets: [
            { id: 'notebookActivity', label: 'Notebook_Ventas' },
            { id: 'successPath', label: 'Success →' },
            { id: 'ifActivity', label: 'If_HayVentas' },
          ],
        },
        {
          kind: 'tabs',
          heading: 'Notebook_Ventas',
          targets: [
            { id: 'generalTab', label: 'General' },
            { id: 'databricksTab', label: 'Azure Databricks' },
            { id: 'settingsTab', label: 'Settings' },
          ],
        },
        {
          kind: 'form',
          heading: 'Settings',
          targets: [
            { id: 'notebookPath', label: 'Notebook path' },
            { id: 'baseParameters', label: 'Base parameters' },
            { id: 'libraries', label: 'Libraries' },
          ],
        },
        {
          kind: 'tabs',
          heading: 'pl_ventas',
          targets: [
            { id: 'parametersTab', label: 'Parameters' },
            { id: 'variablesTab', label: 'Variables' },
            { id: 'outputTab', label: 'Output' },
          ],
        },
      ],
    },
    's08-trigger': {
      product: 'Azure Data Factory',
      title: { es: 'ADF Studio: agregar un trigger', en: 'ADF Studio: add a trigger' },
      regions: [
        hubs('author'),
        {
          kind: 'menu',
          heading: 'Add trigger',
          targets: [
            { id: 'triggerNow', label: 'Trigger now' },
            { id: 'newEdit', label: 'New/Edit' },
          ],
        },
        {
          kind: 'menu',
          heading: 'Type',
          targets: [
            { id: 'schedule', label: 'Schedule' },
            { id: 'tumbling', label: 'Tumbling window' },
            { id: 'storageEvent', label: 'Storage event' },
            { id: 'customEvent', label: 'Custom event' },
          ],
        },
        {
          kind: 'form',
          heading: 'New trigger',
          targets: [
            { id: 'startDate', label: 'Start date' },
            { id: 'timeZone', label: 'Time zone' },
            { id: 'recurrence', label: 'Recurrence' },
            { id: 'endDate', label: 'Specify an end date' },
            { id: 'activated', label: 'Activated: Yes' },
            { id: 'ok', label: 'OK' },
          ],
        },
        { kind: 'toolbar', targets: [{ id: 'publishAll', label: 'Publish all' }] },
      ],
    },
    's08-monitor': {
      product: 'Azure Data Factory',
      title: { es: 'ADF Studio: hub Monitor', en: 'ADF Studio: Monitor hub' },
      regions: [
        hubs('monitor'),
        {
          kind: 'tree',
          heading: 'Monitor',
          targets: [
            { id: 'pipelineRuns', label: 'Pipeline runs' },
            { id: 'triggerRuns', label: 'Trigger runs' },
            { id: 'alertsMetrics', label: 'Alerts & metrics' },
          ],
        },
        {
          kind: 'tabs',
          heading: 'Pipeline runs',
          targets: [
            { id: 'triggeredTab', label: 'Triggered' },
            { id: 'debugTab', label: 'Debug' },
          ],
        },
        {
          kind: 'toolbar',
          heading: 'pl_ventas',
          targets: [
            { id: 'refresh', label: 'Refresh' },
            { id: 'rerun', label: 'Rerun' },
            { id: 'rerunFromActivity', label: 'Rerun from activity' },
            { id: 'rerunFailed', label: 'Rerun from failed activity' },
          ],
        },
        {
          kind: 'main',
          heading: 'Activity runs',
          targets: [
            { id: 'notebookRun', label: 'Notebook_Ventas · Succeeded' },
            { id: 'outputIcon', label: 'Output' },
            { id: 'triggeredBy', label: 'Triggered By' },
          ],
        },
      ],
    },
  });
})(globalThis);
