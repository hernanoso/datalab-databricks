// Original simplified UI illustrations, not screenshots. Labels follow the
// official Lakeflow Jobs documentation: Configure and edit Lakeflow Jobs,
// Configure and edit tasks, If/else, For each, Configure task dependencies,
// Automate jobs with schedules and triggers, Trigger a single job run,
// Troubleshoot and repair job failures and Monitor Lakeflow Jobs.
(function (root) {
  root.DataLab.mockui.register('s07', {
    's07-create': {
      title: { es: 'Jobs & Pipelines: crear un job', en: 'Jobs & Pipelines: create a job' },
      regions: [
        {
          kind: 'sidebar',
          active: 'jobs',
          targets: [
            { id: 'new', label: '+ New' },
            { id: 'workspace', label: 'Workspace' },
            { id: 'catalog', label: 'Catalog' },
            { id: 'jobs', label: 'Jobs & Pipelines' },
          ],
        },
        { kind: 'toolbar', heading: 'Jobs & Pipelines', targets: [{ id: 'create', label: 'Create' }] },
        { kind: 'tabs', targets: [{ id: 'jobsList', label: 'Jobs & pipelines' }, { id: 'runsList', label: 'Runs' }] },
        {
          kind: 'menu',
          heading: 'Create',
          targets: [
            { id: 'job', label: 'Job' },
            { id: 'etlPipeline', label: 'ETL pipeline' },
          ],
        },
      ],
    },
    's07-job': {
      title: { es: 'Job s07_job: tareas y panel Job details', en: 'Job s07_job: tasks and Job details pane' },
      regions: [
        {
          kind: 'toolbar',
          heading: 's07_job',
          targets: [
            { id: 'runNow', label: 'Run now' },
            { id: 'runNowMenu', label: '▾' },
          ],
        },
        { kind: 'menu', heading: 'Run now ▾', targets: [{ id: 'runNowDifferent', label: 'Run now with different settings' }] },
        { kind: 'tabs', targets: [{ id: 'runsTab', label: 'Runs' }, { id: 'tasksTab', label: 'Tasks' }] },
        {
          kind: 'main',
          heading: 'Tasks',
          targets: [
            { id: 'ingestNode', label: 'ingest' },
            { id: 'hasRowsNode', label: 'has_rows' },
            { id: 'byRegionNode', label: 'by_region' },
            { id: 'goldNode', label: 'gold' },
            { id: 'noDataNode', label: 'no_data' },
            { id: 'addTask', label: '+ Add task' },
          ],
        },
        {
          kind: 'form',
          heading: 'Job details',
          targets: [
            { id: 'editParameters', label: 'Edit parameters' },
            { id: 'addTrigger', label: 'Add trigger' },
            { id: 'editNotifications', label: 'Edit notifications' },
            { id: 'editPermissions', label: 'Edit permissions' },
            { id: 'addTag', label: '+ Tag' },
            { id: 'performanceOptimized', label: 'Performance optimized' },
            { id: 'advancedSettings', label: 'Advanced settings' },
          ],
        },
      ],
    },
    's07-task': {
      title: { es: 'Configuración de una tarea: tipo, condición y dependencias', en: 'Task configuration: type, condition and dependencies' },
      regions: [
        {
          kind: 'form',
          heading: 'Task',
          targets: [
            { id: 'taskName', label: 'Task name' },
            { id: 'type', label: 'Type ▾' },
            { id: 'conditionLeft', label: 'Condition: {{tasks.ingest.values.row_count}}' },
            { id: 'operator', label: '>' },
            { id: 'conditionRight', label: 'Condition: 0' },
            { id: 'dependsOn', label: 'Depends on' },
            { id: 'runIf', label: 'Run if dependencies ▾' },
            { id: 'retries', label: 'Retries: + Add' },
            { id: 'metricThresholds', label: 'Metric thresholds' },
            { id: 'saveTask', label: 'Save task' },
          ],
        },
        {
          kind: 'menu',
          heading: 'Type',
          targets: [
            { id: 'notebook', label: 'Notebook' },
            { id: 'ifElse', label: 'If/else condition' },
            { id: 'forEach', label: 'For each' },
            { id: 'runJob', label: 'Run Job' },
            { id: 'pipeline', label: 'Pipeline' },
          ],
        },
        {
          kind: 'menu',
          heading: 'Run if dependencies',
          targets: [
            { id: 'allSucceeded', label: 'All succeeded' },
            { id: 'atLeastOneSucceeded', label: 'At least one succeeded' },
            { id: 'noneFailed', label: 'None failed' },
            { id: 'allDone', label: 'All done' },
            { id: 'atLeastOneFailed', label: 'At least one failed' },
            { id: 'allFailed', label: 'All failed' },
          ],
        },
      ],
    },
    's07-foreach': {
      title: { es: 'Tarea For each y su tarea anidada', en: 'For each task and its nested task' },
      regions: [
        {
          kind: 'form',
          heading: 'For each: by_region',
          targets: [
            { id: 'inputs', label: 'Inputs: {{tasks.ingest.values.regions}}' },
            { id: 'concurrency', label: 'Concurrency: 2' },
            { id: 'addLoopTask', label: 'Add a task to loop over' },
          ],
        },
        {
          kind: 'form',
          heading: 'region_total',
          targets: [
            { id: 'nestedType', label: 'Type: Notebook' },
            { id: 'nestedPath', label: 'Path: s07_lab/02_region' },
            { id: 'nestedParams', label: 'Parameters: region = {{input}}' },
            { id: 'saveTask', label: 'Save task' },
          ],
        },
      ],
    },
    's07-run': {
      title: { es: 'Job run details: grafo del run y Repair run', en: 'Job run details: run graph and Repair run' },
      regions: [
        {
          kind: 'toolbar',
          heading: 's07_job run',
          targets: [
            { id: 'repairRun', label: 'Repair run' },
            { id: 'diagnoseError', label: 'Diagnose Error' },
          ],
        },
        { kind: 'tabs', targets: [{ id: 'graphTab', label: 'Graph' }, { id: 'timelineTab', label: 'Timeline' }, { id: 'listTab', label: 'List' }] },
        {
          kind: 'main',
          heading: 'Graph',
          targets: [
            { id: 'ingestNode', label: 'ingest' },
            { id: 'hasRowsNode', label: 'has_rows' },
            { id: 'byRegionNode', label: 'by_region' },
            { id: 'goldNode', label: 'gold' },
            { id: 'noDataNode', label: 'no_data' },
          ],
        },
        {
          kind: 'form',
          heading: 'Repair job run',
          targets: [
            { id: 'repairTasks', label: 'gold' },
            { id: 'repairParams', label: 'force_fail = false' },
            { id: 'repairConfirm', label: 'Repair run' },
          ],
        },
      ],
    },
    's07-trigger': {
      title: { es: 'Schedules & Triggers: agregar un disparador', en: 'Schedules & Triggers: add a trigger' },
      regions: [
        {
          kind: 'form',
          heading: 'Job details',
          targets: [
            { id: 'addTrigger', label: 'Add trigger' },
            { id: 'editTrigger', label: 'Edit trigger' },
            { id: 'pause', label: 'Pause' },
          ],
        },
        {
          kind: 'menu',
          heading: 'Trigger type',
          targets: [
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'tableUpdate', label: 'Table update' },
            { id: 'fileArrival', label: 'File arrival' },
            { id: 'modelUpdate', label: 'Model update' },
            { id: 'jobCompletion', label: 'Upstream job completion' },
            { id: 'continuous', label: 'Continuous' },
          ],
        },
        {
          kind: 'form',
          heading: 'Schedules & Triggers',
          targets: [
            { id: 'scheduleType', label: 'Schedule type: Advanced' },
            { id: 'showCron', label: 'Show Cron Syntax' },
            { id: 'triggerStatus', label: 'Trigger Status: Active / Paused' },
            { id: 'saveTrigger', label: 'Save' },
          ],
        },
      ],
    },
  });
})(globalThis);
