// Session 7: original content based on the official Lakeflow Jobs documentation (reviewed November 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.en.s07 = {
    deepDive: [
      {
        title: 'Jobs, tasks and runs form a DAG',
        body: [
          'A job is the resource that coordinates, schedules and runs work; it can hold anything from one task to 1000. Tasks and their dependencies form a directed acyclic graph (DAG) that the UI shows in the Graph view, and Databricks runs in parallel everything that does not depend on something else. Each trigger creates a run, and each task in that run has its own task run with output, duration and status.',
          'There are many task types: Notebook, Python script, Python wheel, SQL, Pipeline for Lakeflow pipelines, dbt, JAR, Spark Submit, Dashboards, Power BI and Run Job, which starts another job in the workspace. The control flow tasks are If/else condition and For each. A task can be disabled to skip it without deleting its configuration or its history.',
        ],
        source: source('Configure and edit tasks in Lakeflow Jobs', 'jobs/configure-task'),
      },
      {
        title: 'Serverless first; all-purpose is not for production',
        body: [
          'Serverless compute for jobs is the default for every task that supports it and the recommendation for notebooks, scripts and wheels: Databricks manages scaling, Photon is on and no cluster creation permission is needed. SQL and dbt tasks use a SQL warehouse, pipeline tasks use the pipeline compute, and JAR or Spark Submit tasks need classic jobs compute.',
          'A classic job cluster is created for the run and terminates at the end; sharing it across tasks avoids repeated startups, but it lives only inside that run. All-purpose compute works, although Databricks does not recommend it for production jobs. On serverless, Performance optimized starts faster; with it off, standard mode uses fewer DBUs and tolerates a startup latency of 4 to 6 minutes.',
        ],
        source: source('Configure compute for jobs', 'jobs/compute'),
      },
      {
        title: 'Schedules, continuous jobs and pausing a trigger',
        body: [
          'Triggers are added in Job details → Schedules & Triggers → Add trigger: Scheduled, Table update, File arrival, Model update, Upstream job completion (Beta) or Continuous; without a trigger the job runs only with Run now or from another tool. Scheduled offers Simple, an interval, or Advanced, with time, time zone and the Show Cron Syntax option in Quartz syntax, which includes seconds: 0 0 6 * * ? means every day at 6:00.',
          'With a time zone that observes daylight saving time, an hourly job can be skipped or delayed at the switch; choose UTC for absolute hours. The scheduler is not built for low latency and can be a few minutes late. Continuous keeps a single active instance and starts a new run when one ends; it does not support task dependencies or its own retry policies, and it retries with exponential backoff. Pause stops new runs without stopping active ones.',
        ],
        source: source('Automate jobs with schedules and triggers', 'jobs/triggers'),
      },
      {
        title: 'File arrival and table update: run when there is data',
        body: [
          'File arrival watches the root or a subpath of a Unity Catalog volume or external location, checks recursively about every minute and costs nothing beyond cloud listing. Only new files start a run: overwriting a file with the same name does not. Without file events, a location supports up to 10,000 files and at most 50 jobs per workspace can use this trigger.',
          'Table update fires when Unity Catalog Delta or Iceberg tables, materialized views, streaming tables or supported views change; with several tables you choose Any table is updated or All tables are updated, up to 25 tables. Both triggers offer Minimum time between triggers, a cooldown, and Wait after last change, which waits for a batch to finish. Table update needs SELECT for the Run as user; file arrival needs READ on the location.',
        ],
        source: source('Trigger jobs when new files arrive', 'jobs/file-arrival-triggers'),
      },
      {
        title: 'Job parameters versus task parameters',
        body: [
          'Job parameters are key-value pairs defined in Job details → Edit parameters; the key accepts only letters, digits, _ - and dot, and the value is a string, JSON or a dynamic value reference. They are pushed down automatically to tasks that accept key-value pairs, such as notebooks, which read them with dbutils.widgets.get. If a job parameter and a task parameter share a key, the job parameter wins.',
          'Tasks that take JSON arrays, such as Python script, do not receive job parameters on their own: reference them with {{job.parameters.<name>}}. In SQL they are read with named markers such as :run_date. Run now with different settings changes values or picks a subset of tasks for one run, and the Repair job run dialog can override them too.',
        ],
        source: source('Configure job parameters', 'jobs/job-parameters'),
      },
      {
        title: 'Dynamic value references with double braces',
        body: [
          'A dynamic value reference is written between {{ }} in a job parameter or field and is replaced by text at run time. Examples: {{job.id}}, {{job.run_id}}, {{job.trigger.type}}, {{job.parameters.run_date}}, {{task.name}}, {{tasks.ingest.result_state}} and {{tasks.ingest.values.row_count}}. {{job.start_time.iso_date}} returns the ISO start date of the run, always in UTC; year, month, hour, is_weekday and timestamp_ms also exist.',
          'There are no expressions or functions inside the braces. A reference that does not exist is silently treated as literal text, unless it belongs to a known namespace. The { } button in the UI lists the references, although it does not autocomplete task value keys. Old variables such as {{start_date}} or {{run_id}} are deprecated: use job.start_time and task.run_id.',
        ],
        source: source('Dynamic value references', 'jobs/dynamic-value-references'),
      },
      {
        title: 'Task values: one task talks to the next',
        body: [
          'dbutils.jobs.taskValues.set(key="row_count", value=n) publishes a value from a Python notebook; the key is a unique string and the value must be valid JSON of up to 48 KiB. Databricks recommends reading it with the reference {{tasks.<task>.values.<key>}} in parameters, in an If/else condition or in the Inputs of a For each, because that works with any task type that accepts parameters.',
          'dbutils.jobs.taskValues.get requires the name of the source task; debugValue helps while developing outside a job, and default is not recommended because it hides mistakes. If the publishing task runs inside a For each, the reference returns an array with the value of each iteration in order; that aggregation is in Beta. The published value appears in the Output pane of the task run.',
        ],
        source: source('Use task values to pass information between tasks', 'jobs/task-values'),
      },
      {
        title: 'Run if and the final status of a run',
        body: [
          'Run if dependencies decides whether a task runs based on its dependencies: All succeeded is the default; At least one succeeded and None failed mark Upstream failed when unmet; All done runs whenever the dependencies finish; At least one failed and All failed handle errors and leave the task Excluded when unmet. An Excluded task counts as successful for the tasks after it.',
          'The run status depends on the leaf tasks, the ones with no downstream tasks: Succeeded if everything worked, Succeeded with failures if some task failed but every leaf succeeded, and Failed if a leaf failed. That is why a cleanup task with All done can hide a failure in the middle: configure notifications or check the runs matrix.',
        ],
        source: source('Configure task dependencies', 'jobs/run-if'),
      },
      {
        title: 'If/else condition and For each',
        body: [
          'If/else condition compares two operands with an operator; operands can be job parameters, task parameters or task values. == and != compare as strings, so 12.0 == 12 is false; >, >=, < and <= compare as numbers. Downstream tasks depend on name (true) or name (false) in Depends on, and the run details show how the expression was evaluated.',
          'For each runs a nested task once per element of Inputs: a JSON array of up to 5000 characters, a task value or a job parameter. Concurrency defaults to 1; the nested task reads each element with {{input}} or {{input.field}} and cannot be another For each. The history is shown as a table of iterations with the Only failed iterations filter.',
        ],
        source: source('Use a For each task to run another task in a loop', 'jobs/tasks/for-each'),
      },
      {
        title: 'Retries, timeouts and notifications',
        body: [
          'Retries → Add sets how many times and how often a task is retried; most configurations have no retries by default, but serverless retries automatically through auto-optimization, which you can uncheck for workloads that are not idempotent. Metric thresholds sets a Warning, the expected duration, and a Timeout, which marks the task Timed Out; with retries, the timeout applies to each attempt.',
          'Edit notifications → Add notification sends alerts to email or to system destinations such as Slack, Microsoft Teams, PagerDuty or webhooks, on Start, Success, Failure, Duration warning or Streaming backlog, with at most three system destinations per event. Job notifications are not sent on every retry; use task notifications for that. A Succeeded with failures run counts as a success for alerts.',
        ],
        source: source('Add notifications on a job', 'jobs/notifications'),
      },
      {
        title: 'Repair run, history and concurrency',
        body: [
          'The Runs tab shows a matrix with each task per run: green success, red failure, pink skipped and yellow waiting for retry; history is kept for 60 days. Repair run reruns only the unsuccessful tasks and their dependents, with the current job settings, and is not available for single-task jobs. Each repaired task starts from the beginning: if it wrote with append, it can duplicate data.',
          'By default a job allows one active run at a time (Maximum concurrent runs = 1); another run is skipped as Skipped, unless you turn on Queue in Advanced settings, which waits up to 48 hours and is on for jobs created in the UI since April 2024. A workspace supports 2000 concurrent task runs; in Free Edition the limit is 5 concurrent job tasks per account.',
        ],
        source: source('Troubleshoot and repair job failures', 'jobs/repair-job-failures'),
      },
      {
        title: 'Permissions, Run as, Git and bundles',
        body: [
          'Job permissions are CAN VIEW, CAN MANAGE RUN to start and cancel runs, CAN MANAGE to edit and pause schedules, and IS OWNER, one per job. The job runs with the privileges of Run as, which defaults to its creator; Databricks recommends a service principal in production. Tags help filter jobs and propagate to job clusters to attribute costs.',
          'With Git provider, each run takes a snapshot of a branch, tag or commit, and every task uses the same version; Git folders are for development. For infrastructure as code you use Declarative Automation Bundles, formerly Databricks Asset Bundles: YAML deployed with the CLI. A job deployed by a bundle is read-only in the UI unless you click Disconnect from source.',
        ],
        source: source('Manage identities, permissions, and privileges for Lakeflow Jobs', 'jobs/privileges'),
      },
      {
        title: 'System tables to observe every job',
        body: [
          'The system.lakeflow schema, formerly system.workflow, stores jobs, job_tasks, job_run_timeline and job_task_run_timeline, plus pipelines, with 365 days of retention and data from every workspace of the account in the same region. You need USE and SELECT on the schema or admin rights; records usually show up within an hour.',
          'jobs and job_tasks are SCD2 tables: for the current state take the row with the latest change_time and exclude rows with delete_time. The timeline tables split long runs into hourly slices and only the last slice carries result_state and termination_code. Joining them with system.billing.usage gives you the cost of each job.',
        ],
        source: source('Jobs system table reference', 'admin/system-tables/jobs'),
      },
    ],
    diagram: {
      title: 'The lab job: ingestion, decision, loop and gold',
      caption: 'ingest publishes task values; has_rows decides with If/else; when true, by_region loops over the regions with For each and gold runs with Run if All succeeded; when false, only no_data runs. A paused schedule and Failure notifications wrap the whole job.',
      layers: [
        { label: 'Trigger', nodes: ['Scheduled 0 0 6 * * ? (paused)', 'Run now with different settings'] },
        { label: 'Ingestion', nodes: ['ingest: notebook with widgets', 'Task values: row_count and regions'] },
        { label: 'If/else decision', nodes: ['has_rows: row_count > 0', 'true → by_region', 'false → no_data'] },
        { label: 'For each loop', nodes: ['by_region: Inputs = regions, Concurrency 2', 'region_total: region = {{input}}'] },
        { label: 'Gold and control', nodes: ['gold: Run if All succeeded', 'Email notification on Failure', 'Repair run reruns only what failed'] },
      ],
    },
    comparison: {
      title: 'Lakeflow Jobs trigger types',
      headers: ['Trigger', 'When a run starts', 'Requirements and limits', 'Key options', 'Good fit for'],
      rows: [
        ['None (manual)', 'When you click Run now, or from the API or an external orchestrator', 'None', 'Run now with different settings', 'Tests and external orchestration'],
        ['Scheduled', 'On a Simple or Advanced schedule', 'Minimum interval of 10 s; can be minutes late', 'Quartz cron, time zone, UTC', 'Daily or hourly batches'],
        ['File arrival', 'When new files land in a volume or external location', 'Unity Catalog; without file events, 10,000 files and 50 jobs', 'Minimum time between triggers, Wait after last change', 'Data that arrives with no fixed schedule'],
        ['Table update', 'When one or all monitored tables change', 'Up to 25 tables; SELECT for Run as', 'Any or All tables, Wait after last change', 'Chains that depend on tables owned by other teams'],
        ['Continuous', 'Always: a new run when the previous one ends', 'One instance; no dependencies or retry policy', 'Task retry mode, exponential backoff', 'Always-on streaming'],
        ['Upstream job completion / Model update', 'When other jobs finish or a UC model changes', 'Beta', 'Expected job result; version or alias', 'Job chains and MLOps'],
      ],
      sources: [source('Triggers', 'jobs/triggers'), source('Schedules', 'jobs/scheduled'), source('File arrival', 'jobs/file-arrival-triggers'), source('Table update', 'jobs/trigger-table-update'), source('Continuous jobs', 'jobs/continuous')],
    },
    lab: {
      title: 'A job with If/else, For each and Repair run in Free Edition',
      goal: 'Create three parameterized notebooks, orchestrate them in a serverless job with a date parameter, branch with an If/else on a task value, loop over regions with a For each, force a failure, recover it with Repair run without repeating work, and leave a daily schedule paused.',
      minutes: 90,
      requirements: [
        'Databricks Free Edition: serverless compute only and at most 5 concurrent job tasks per account; that is why the For each uses Concurrency 2.',
        'Permission to create a schema in your catalog; replace <your_catalog> with the result of current_catalog() in the SQL and in the catalog job parameter.',
        'A s07_lab folder in your Workspace for the notebooks 01_ingest, 02_region, 03_gold and 04_no_data, all in Python.',
      ],
      steps: [
        {
          title: 'Prepare the schema and the source data',
          body: 'Open a new notebook with serverless compute and SQL as the language. orders_raw holds seven orders over two dates; the other three tables start empty and the job fills them. Creating the tables first means the notebooks only write and the types stay fixed.',
          code: { language: 'sql', code: `SELECT current_catalog();
CREATE SCHEMA IF NOT EXISTS <your_catalog>.s07_lab;
CREATE OR REPLACE TABLE <your_catalog>.s07_lab.orders_raw (order_id INT, order_date DATE, region STRING, amount DOUBLE);
INSERT INTO <your_catalog>.s07_lab.orders_raw VALUES
  (1, DATE'2026-01-05', 'north', 10.0),
  (2, DATE'2026-01-05', 'south', 20.0),
  (3, DATE'2026-01-05', 'north', 5.5),
  (4, DATE'2026-01-05', 'east', 12.0),
  (5, DATE'2026-01-05', 'south', 8.0),
  (6, DATE'2026-01-06', 'north', 7.0),
  (7, DATE'2026-01-06', 'west', 3.0);
CREATE OR REPLACE TABLE <your_catalog>.s07_lab.orders_bronze (order_id INT, order_date DATE, region STRING, amount DOUBLE);
CREATE OR REPLACE TABLE <your_catalog>.s07_lab.region_totals (process_date DATE, region STRING, orders BIGINT, total DOUBLE);
CREATE OR REPLACE TABLE <your_catalog>.s07_lab.daily_summary (process_date DATE, regions BIGINT, orders BIGINT, total DOUBLE);
SELECT order_date, count(*) FROM <your_catalog>.s07_lab.orders_raw GROUP BY ALL ORDER BY 1;` },
          check: 'The last query returns 2026-01-05 → 5 and 2026-01-06 → 2; orders_bronze, region_totals and daily_summary exist and are empty.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Write the ingestion notebook',
          body: 'Create the Python notebook s07_lab/01_ingest. It reads the parameters as widgets, copies only the requested date to bronze with replaceWhere, deletes earlier totals for that date so the job stays idempotent, and publishes two task values: row_count and the sorted list of regions. Do not run it by hand: the empty catalog widget only gets a value inside the job.',
          code: { language: 'python', code: `from pyspark.sql import functions as F

dbutils.widgets.text("catalog", "")
dbutils.widgets.text("process_date", "2026-01-05")
catalog = dbutils.widgets.get("catalog")
d = dbutils.widgets.get("process_date")
schema = f"{catalog}.s07_lab"

rows = spark.table(f"{schema}.orders_raw").filter(F.col("order_date") == d)
(rows.write.mode("overwrite")
    .option("replaceWhere", f"order_date = '{d}'")
    .saveAsTable(f"{schema}.orders_bronze"))
spark.sql(f"DELETE FROM {schema}.region_totals WHERE process_date = '{d}'")

n = rows.count()
regions = sorted(r["region"] for r in rows.select("region").distinct().collect())
dbutils.jobs.taskValues.set(key="row_count", value=n)
dbutils.jobs.taskValues.set(key="regions", value=regions)
print(d, n, regions)` },
          check: 'The 01_ingest notebook is saved in s07_lab and calls dbutils.jobs.taskValues.set twice.',
        },
        {
          title: 'Write the per-region notebook',
          body: 'Create s07_lab/02_region. It becomes the nested task of the For each: it receives region in each iteration, computes orders and total for that region and date, and appends them to region_totals. It uses append because iterations run in parallel and blind inserts do not conflict with each other; ingest already did the cleanup.',
          code: { language: 'python', code: `from pyspark.sql import functions as F

dbutils.widgets.text("catalog", "")
dbutils.widgets.text("process_date", "2026-01-05")
dbutils.widgets.text("region", "north")
catalog = dbutils.widgets.get("catalog")
d = dbutils.widgets.get("process_date")
region = dbutils.widgets.get("region")
schema = f"{catalog}.s07_lab"

result = (spark.table(f"{schema}.orders_bronze")
    .filter((F.col("order_date") == d) & (F.col("region") == region))
    .agg(F.count("*").alias("orders"), F.round(F.sum("amount"), 2).alias("total"))
    .select(F.to_date(F.lit(d)).alias("process_date"), F.lit(region).alias("region"), "orders", "total"))
result.write.mode("append").saveAsTable(f"{schema}.region_totals")

total = result.first()["total"]
dbutils.jobs.taskValues.set(key="total", value=total)
print(region, total)` },
          check: 'The 02_region notebook is saved and reads three widgets: catalog, process_date and region.',
        },
        {
          title: 'Write the gold and no_data notebooks',
          body: 'Create s07_lab/03_gold with this code: when force_fail is true it raises an error before writing; otherwise it summarizes region_totals for the date into daily_summary with replaceWhere. Also create s07_lab/04_no_data with two lines: dbutils.widgets.text("process_date", "") and print("No orders for", dbutils.widgets.get("process_date")).',
          code: { language: 'python', code: `from pyspark.sql import functions as F

dbutils.widgets.text("catalog", "")
dbutils.widgets.text("process_date", "2026-01-05")
dbutils.widgets.text("force_fail", "false")
catalog = dbutils.widgets.get("catalog")
d = dbutils.widgets.get("process_date")
if dbutils.widgets.get("force_fail") == "true":
    raise Exception(f"Forced failure for {d}")

schema = f"{catalog}.s07_lab"
summary = (spark.table(f"{schema}.region_totals")
    .filter(F.col("process_date") == d)
    .groupBy("process_date")
    .agg(F.count("*").alias("regions"), F.sum("orders").alias("orders"), F.round(F.sum("total"), 2).alias("total")))
(summary.write.mode("overwrite")
    .option("replaceWhere", f"process_date = '{d}'")
    .saveAsTable(f"{schema}.daily_summary"))
display(summary)` },
          check: 's07_lab contains 01_ingest, 02_region, 03_gold and 04_no_data.',
        },
        {
          title: 'Create the job with the ingest task',
          body: 'In the sidebar click Jobs & Pipelines, then Create and Job. Click the Notebook tile; if it is missing, use Add another task type. Type ingest in Task name, pick s07_lab/01_ingest in Path, check that Compute is Serverless and click Save task. Rename the job, New Job with a date and time, to s07_job.',
          check: 'The s07_job job appears in Jobs & Pipelines with one ingest task on the Tasks tab.',
          screen: { id: 's07-create', highlight: ['jobs', 'create', 'job'] },
        },
        {
          title: 'Add parameters and a notification to the job',
          body: 'In Job details click Edit parameters and create three Key / Value pairs: catalog = <your_catalog>, process_date = 2026-01-05 and force_fail = false; click Save. In production process_date could be {{job.start_time.iso_date}}, in UTC. Then, under Job notifications, click Edit notifications, Add notification, choose Email address with your email, check Failure and save.',
          check: 'Job details shows the three parameters and one Failure email notification.',
          screen: { id: 's07-job', highlight: ['editParameters', 'editNotifications'] },
        },
        {
          title: 'Add the has_rows If/else',
          body: 'With ingest selected in the graph click + Add task, type has_rows and choose If/else condition in Type. In the first Condition box type {{tasks.ingest.values.row_count}}, choose the > operator and type 0 in the second box. Depends on stays as ingest. Click Save task. > compares as numbers; == would compare as strings.',
          check: 'The graph shows ingest → has_rows, and has_rows has two possible outcomes: true and false.',
          screen: { id: 's07-task', highlight: ['type', 'ifElse', 'conditionLeft', 'operator', 'conditionRight', 'saveTask'] },
        },
        {
          title: 'Add the by_region For each',
          body: 'Select has_rows, click + Add task, name it by_region and choose For each; Depends on must be has_rows (true). In Inputs type {{tasks.ingest.values.regions}} and set Concurrency to 2. Click Add a task to loop over: a Notebook task region_total with Path s07_lab/02_region and Parameters region = {{input}}, process_date = {{job.parameters.process_date}} and catalog = {{job.parameters.catalog}}. Save both.',
          check: 'by_region appears as a node with region_total inside and depends on has_rows (true).',
          screen: { id: 's07-foreach', highlight: ['inputs', 'concurrency', 'addLoopTask', 'nestedParams'] },
        },
        {
          title: 'Add gold and the false branch',
          body: 'Add gold, Notebook s07_lab/03_gold, with Depends on = by_region and Run if dependencies = All succeeded. Next to Retries click Add, uncheck Enable serverless auto-optimization (may include additional retries) and click Confirm, so the forced failure is not retried. Add no_data, Notebook s07_lab/04_no_data, with Depends on = has_rows (false).',
          check: 'The graph has five tasks: ingest → has_rows → by_region → gold and has_rows (false) → no_data.',
          screen: { id: 's07-task', highlight: ['dependsOn', 'runIf', 'allSucceeded', 'retries'] },
        },
        {
          title: 'Run the job and read the run graph',
          body: 'Click Run now. On the Runs tab click the start time of the run to open Job run details. In Graph, has_rows shows the true evaluation, by_region shows three iterations and no_data does not run. Open ingest and look at the Output pane with the task values. Use Timeline to see the iterations overlap, then check the tables.',
          code: { language: 'sql', code: `SELECT * FROM <your_catalog>.s07_lab.region_totals ORDER BY process_date, region;
SELECT * FROM <your_catalog>.s07_lab.daily_summary ORDER BY process_date;` },
          check: 'row_count = 5 and regions = ["east", "north", "south"]. region_totals: east 1 and 12.0; north 2 and 15.5; south 2 and 28.0. daily_summary: 2026-01-05 with 3 regions, 5 orders and 55.5.',
          screen: { id: 's07-run', highlight: ['graphTab', 'timelineTab', 'hasRowsNode', 'byRegionNode'] },
        },
        {
          title: 'Force a failure with other parameters',
          body: 'Next to Run now open ▾ and choose Run now with different settings. Change process_date to 2026-01-06 and force_fail to true, and click Run. ingest, has_rows and by_region succeed; gold fails at once because you turned off automatic retries, and since gold is a leaf task the run ends Failed. You should receive the Failure email.',
          code: { language: 'sql', code: `SELECT process_date, count(*) AS n FROM <your_catalog>.s07_lab.region_totals GROUP BY ALL ORDER BY 1;
SELECT count(*) AS days FROM <your_catalog>.s07_lab.daily_summary;` },
          check: 'region_totals: 2026-01-05 → 3 and 2026-01-06 → 2 (north 7.0 and west 3.0). daily_summary still has 1 row, because gold failed before writing.',
          screen: { id: 's07-job', highlight: ['runNowMenu', 'runNowDifferent'] },
        },
        {
          title: 'Repair the run without repeating what worked',
          body: 'Open the failed run from the matrix and click Repair run. The Repair job run dialog lists only gold, because it has no dependents. Add the parameter force_fail = false, which overrides the run value, and click Repair run. Since ingest and by_region do not run again, region_totals gets no duplicate rows; the matrix adds a new column for the repair.',
          code: { language: 'sql', code: `SELECT * FROM <your_catalog>.s07_lab.daily_summary ORDER BY process_date;
SELECT count(*) AS bronze FROM <your_catalog>.s07_lab.orders_bronze;
SELECT count(*) AS totals FROM <your_catalog>.s07_lab.region_totals;` },
          check: 'daily_summary: 2026-01-05 → 3, 5 and 55.5; 2026-01-06 → 2, 2 and 10.0. orders_bronze = 7 and region_totals = 5. gold turns from red to green.',
          screen: { id: 's07-run', highlight: ['repairRun', 'repairTasks', 'repairParams', 'repairConfirm'] },
        },
        {
          title: 'Test the false branch of the If/else',
          body: 'Start Run now with different settings with process_date = 2026-01-09 and force_fail = false. There are no orders: ingest publishes row_count = 0, has_rows evaluates false, no_data runs, and by_region and gold do not run. Open the Output of no_data to see the message. Repeat the queries from the previous step to confirm nothing changed.',
          check: 'no_data prints No orders for 2026-01-09; orders_bronze = 7, region_totals = 5 and daily_summary = 2 rows, same as before.',
        },
        {
          title: 'Schedule the job and leave it paused',
          body: 'In Job details click Add trigger, choose Scheduled and Schedule type Advanced: every day at 6:00 in your time zone. Check Show Cron Syntax to see the Quartz expression and choose Paused in Trigger Status before saving, or save and click Pause. Because the job is idempotent, a scheduled run with the default date would not duplicate data.',
          code: { language: 'text', code: `0 0 6 * * ?
# seconds minutes hours day-of-month month day-of-week` },
          check: 'Schedules & Triggers shows a Scheduled trigger in the Paused state and no new runs are created.',
          screen: { id: 's07-trigger', highlight: ['addTrigger', 'scheduled', 'scheduleType', 'showCron', 'triggerStatus', 'saveTrigger'] },
        },
      ],
      wrapUp: 'You turned four notebooks into a five-task job. A task value fed the If/else and the For each, which processed three regions in parallel; gold summarized 55.5 for January 5. The forced failure for January 6 was repaired by rerunning only gold, with no duplicate rows, and January 9 took the false branch. Pause or delete the job at the end so it does not use your Free Edition quota.',
      sources: [
        { label: 'Free Edition limitations', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Configure and edit Lakeflow Jobs', 'jobs/configure-job'),
        source('Notebook task', 'jobs/tasks/notebook'),
        source('Configure job parameters', 'jobs/job-parameters'),
        source('Access parameter values from a task', 'jobs/parameter-use'),
        source('Task values', 'jobs/task-values'),
        source('If/else task', 'jobs/tasks/if-else'),
        source('For each task', 'jobs/tasks/for-each'),
        source('Run if dependencies', 'jobs/run-if'),
        source('Serverless compute for workflows and retries', 'jobs/run-serverless-jobs'),
        source('Run with different settings', 'jobs/run-now'),
        source('Monitor Lakeflow Jobs', 'jobs/monitor'),
        source('Repair run', 'jobs/repair-job-failures'),
        source('Notifications', 'jobs/notifications'),
        source('Schedules', 'jobs/scheduled'),
      ],
    },
    certification: {
      intro: 'Original practice questions aligned with the official exam guide. They are not real exam questions.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Working with Lakeflow Jobs', 'Troubleshooting, Monitoring, and Optimization', 'Databricks Intelligence Platform', 'Governance and Security'] }],
      questions: [
        { domain: 'Working with Lakeflow Jobs', question: 'A job has three chained tasks and a daily schedule. What does Databricks create each time the schedule fires?', options: ['A new copy of the job', 'A run with one task run per task', 'A permanent all-purpose cluster', 'A new task at the end of the graph'], answer: 1, explanation: 'Each trigger creates a run of the same job; inside it, every task has its own task run with status, output and duration.' },
        { domain: 'Databricks Intelligence Platform', question: 'Which compute does Databricks recommend for a notebook task in a production job?', options: ['A shared all-purpose cluster', 'A pro SQL warehouse', 'Serverless compute for jobs', 'A classic cluster with Spark Submit'], answer: 2, explanation: 'Serverless is the default and the recommendation for notebooks; all-purpose compute is not recommended for production.' },
        { domain: 'Working with Lakeflow Jobs', question: 'A cleanup task must run after A and B finish, whether or not they failed. Which Run if do you choose?', options: ['All succeeded', 'None failed', 'At least one failed', 'All done'], answer: 3, explanation: 'All done runs after every dependency finishes, whatever its status.' },
        { domain: 'Working with Lakeflow Jobs', question: 'You want the run_date parameter to default to the start date of each run. Which value do you configure?', options: ['{{job.start_time.iso_date}}', '{{start_date}}, the recommended variable', '{{job.run_id}}', '{{task.execution_count}}'], answer: 0, explanation: '{{job.start_time.iso_date}} returns the ISO start date in UTC; {{start_date}} is deprecated.' },
        { domain: 'Working with Lakeflow Jobs', question: 'An If/else evaluates {{tasks.check.values.ratio}} == 12 and the task value is 12.0. What is the result?', options: ['true, because they are compared as numbers', 'false, because == compares strings', 'The task always fails', 'true, but only on serverless'], answer: 1, explanation: '== and != compare strings, so 12.0 == 12 is false; the >, >=, < and <= operators do compare numbers.' },
        { domain: 'Working with Lakeflow Jobs', question: 'You must apply the same notebook to 20 tables, up to 4 in parallel, without duplicating configuration. What do you use?', options: ['20 identical notebook tasks', 'A continuous job with 20 retries', 'A For each nested inside another For each', 'A For each with Inputs as a JSON array and Concurrency 4'], answer: 3, explanation: 'For each repeats a nested task for each element of Inputs and Concurrency controls how many iterations run at once; it cannot nest another For each.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'gold failed because of a bug you already fixed; bronze and silver succeeded. How do you recover the run at the lowest cost?', options: ['A full Run now so everything is consistent', 'Clone the job and run only gold', 'Repair run, which reruns the unsuccessful tasks and their dependents', 'Wait for the next schedule'], answer: 2, explanation: 'Repair run reruns only what was unsuccessful and its dependents, with the current job settings, without repeating successful tasks.' },
        { domain: 'Working with Lakeflow Jobs', question: 'A job scheduled every 5 minutes sometimes takes 7. It has Maximum concurrent runs = 1 and Queue turned off. What happens to the run that arrives while another one is active?', options: ['It is skipped and ends Skipped', 'It cancels the active run', 'It runs in parallel', 'It turns the job into a continuous job'], answer: 0, explanation: 'If the job already reached its maximum active runs, the new run is skipped; with Queue on, it would wait up to 48 hours.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'A task has three retries and you want an alert for every failed attempt. What do you configure?', options: ['A job Duration warning', 'A tag on the task', 'A job-level Failure notification', 'A task-level Failure notification'], answer: 3, explanation: 'Job notifications are not sent on task retries; to alert on every failure, use task notifications.' },
        { domain: 'Working with Lakeflow Jobs', question: 'Files land in a Unity Catalog volume at irregular times and in bursts. You want one run per complete burst. Which trigger do you use?', options: ['Scheduled every minute', 'Continuous', 'File arrival with Wait after last change', 'Table update on the volume'], answer: 2, explanation: 'File arrival watches the volume and Wait after last change waits until files stop arriving before starting the run.' },
        { domain: 'Governance and Security', question: 'A production job runs as its creator, who is about to leave the company. What does Databricks recommend?', options: ['Give IS OWNER to a group', 'Change Run as to a service principal', 'Give CAN MANAGE RUN to every user', 'Remove the job permissions'], answer: 1, explanation: 'With a service principal in Run as, the job privileges do not depend on a person; a group cannot be IS OWNER.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'You need to analyze with SQL the failed runs of the last year across every workspace in the region. Where do you query?', options: ['The Runs tab of the job', 'The event log of a pipeline', 'system.lakeflow.job_run_timeline', 'The job tags'], answer: 2, explanation: 'The system.lakeflow system tables keep 365 days and cover the region; the Runs tab keeps only 60 days per job.' },
        { domain: 'Working with Lakeflow Jobs', question: 'What constraint applies to dbutils.jobs.taskValues.set?', options: ['The value must be valid JSON of up to 48 KiB and is published from Python', 'It only accepts strings of up to 1 KB', 'It works the same in SQL and Scala notebooks', 'The value is kept for 365 days in a system table'], answer: 0, explanation: 'taskValues is a Python utility; the value must serialize as JSON and its representation cannot exceed 48 KiB.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-create', answer: 'job', question: 'You opened the Create menu in Jobs & Pipelines. Where do you click to create a new job?', explanation: 'Create → Job opens the job editor and asks you to configure the first task, for example a notebook.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-task', answer: 'atLeastOneFailed', question: 'An alert task must run only if one of its dependencies fails. Which Run if dependencies option do you choose?', explanation: 'At least one failed runs when at least one dependency fails; if everything succeeds, the task ends Excluded.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-foreach', answer: 'concurrency', question: 'Where do you set how many For each iterations can run at the same time?', explanation: 'Concurrency sets the parallel iterations; it defaults to 1 and a low value is wise in Free Edition.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's07-run', answer: 'repairRun', question: 'You are on Job run details for a failed run. Where do you click to rerun only the unsuccessful tasks?', explanation: 'Repair run opens the Repair job run dialog with the unsuccessful tasks and their dependents, and lets you override parameters.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-trigger', answer: 'fileArrival', question: 'You want the job to run when new files land in a volume. Which trigger type do you choose?', explanation: 'File arrival watches a Unity Catalog volume or external location and starts a run when it detects new files.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-job', answer: 'runNowDifferent', question: 'You want to run the job once with another date without changing its configuration. Which option do you use?', explanation: 'Run now with different settings overrides parameters or picks tasks for that run only; the job configuration does not change.' },
      ],
    },
  };
})(globalThis);
