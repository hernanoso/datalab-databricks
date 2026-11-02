// Session 9: original content based on the official Lakeflow pipelines documentation (reviewed November 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.en.s09 = {
    deepDive: [
      {
        title: 'Four names for the same product',
        body: [
          'Delta Live Tables (DLT) became Lakeflow Declarative Pipelines in June 2025, and on November 12, 2025 it was renamed Lakeflow Spark Declarative Pipelines. The documentation now says "Lakeflow pipelines" or "Spark Declarative Pipelines on Lakeflow": the Databricks product extends the open source Apache Spark Declarative Pipelines (SDP) project, included since Spark 4.1.',
          'No migration is required: DLT code keeps working. In Python, import dlt is replaced by from pyspark import pipelines as dp; @dp.table creates streaming tables, @dp.materialized_view creates materialized views and @dlt.view becomes @dp.temporary_view. Traces of the old name remain: classic SKUs start with DLT and event log schemas keep dlt. The exam may say LDP or SDP.',
        ],
        source: source('What happened to Delta Live Tables (DLT)?', 'ldp/concepts/where-is-dlt'),
      },
      {
        title: 'Three dataset types with different semantics',
        body: [
          'A streaming table processes each record exactly once, assuming an append-only source; it suits ingestion and data that only grows. A materialized view recomputes its result to reflect the current state of the source and fits joins, aggregations and sources that receive updates or deletes. A temporary view is evaluated on demand, is not persisted and exists only inside the pipeline.',
          'Streaming tables and materialized views are Unity Catalog managed tables, so other users and jobs can query them outside the pipeline. Sinks also exist: streaming targets such as Delta tables, Kafka or Event Hubs. A practical rule: if several downstream queries reuse a result or you want to inspect it during development, materialize it; if it is an intermediate step, use a view.',
        ],
        source: source('Pipeline concepts', 'ldp/concepts/'),
      },
      {
        title: 'Flows move the data, not the tables',
        body: [
          'A flow reads a source, applies your logic and writes to a target. Declaring CREATE OR REFRESH STREAMING TABLE ... AS SELECT creates a default flow with the same name as the table. You can also declare flows separately with CREATE FLOW name AS INSERT INTO target BY NAME SELECT ... or with @dp.append_flow, so that several sources append rows to a single streaming table.',
          'Append flows replace a UNION and let you add a new source without a full refresh; INSERT INTO ONCE runs a backfill a single time unless you run a full refresh. The flow name identifies its checkpoint: if you rename it, the pipeline treats it as a brand new flow. Expectations belong on the target table, not inside @dp.append_flow.',
        ],
        source: source('Use flows in Lakeflow pipelines', 'ldp/flow-examples'),
      },
      {
        title: 'AUTO CDC replaces APPLY CHANGES',
        body: [
          'To apply a change feed you first declare the target streaming table and then CREATE FLOW ... AS AUTO CDC INTO target FROM STREAM(source) KEYS (...) SEQUENCE BY column. The Python equivalent is dp.create_auto_cdc_flow. SEQUENCE BY orders the events, so a late update with a lower sequence does not overwrite a newer one. APPLY CHANGES remains available with the same syntax, but Databricks recommends AUTO CDC.',
          'STORED AS SCD TYPE 1 overwrites and keeps only the latest version of each key. STORED AS SCD TYPE 2 creates one row per version with __START_AT and __END_AT; the current version has a null __END_AT. APPLY AS DELETE WHEN marks deletions and APPLY AS TRUNCATE WHEN exists only in SCD 1. AUTO CDC is not part of Apache Spark and requires serverless or the Pro or Advanced editions.',
        ],
        source: source('AUTO CDC APIs', 'ldp/cdc'),
      },
      {
        title: 'Expectations: warn, drop or fail',
        body: [
          'An expectation has a name, a SQL boolean constraint and an action. CONSTRAINT name EXPECT (expr) without ON VIOLATION only warns: the row reaches the target and is counted. ON VIOLATION DROP ROW discards it before writing and records the count. ON VIOLATION FAIL UPDATE makes the update fail and rolls back the transaction. In Python they are dp.expect, dp.expect_or_drop and dp.expect_or_fail.',
          'Warn and drop metrics appear in the Data quality tab; fail records none because the update stops. In triggered mode, a failing flow does not stop parallel flows; in continuous mode it stops that flow and its dependents. The constraint cannot contain custom Python functions, external service calls or subqueries on other tables, and the name must be unique per dataset.',
        ],
        source: source('Quality expectations', 'ldp/expectations'),
      },
      {
        title: 'Triggered or continuous is independent of the table type',
        body: [
          'Triggered, the default mode, processes the data available when the update starts and then stops; it suits freshness of minutes or hours and saves compute. Continuous processes data as it arrives and keeps resources running, which helps for latencies from seconds to a few minutes. Both streaming tables and materialized views can be updated in either mode.',
          'For continuous production, Databricks recommends wrapping the pipeline in a continuous job instead of setting Pipeline mode to Continuous: the job decides the execution mode and takes precedence over the pipeline setting. pipelines.trigger.interval is used only with continuous execution. Standalone streaming tables and materialized views, created from Databricks SQL, always refresh in triggered mode.',
        ],
        source: source('Triggered vs. continuous pipeline mode', 'ldp/concepts/pipeline-mode'),
      },
      {
        title: 'Serverless and product editions',
        body: [
          'A new pipeline defaults to Unity Catalog, the Current channel and serverless compute. Serverless pipelines require Unity Catalog and the Advanced edition, which includes every feature. On classic compute you can choose Core for streaming ingestion, Pro to add CDC, or Advanced to add expectations; if the code uses a feature the edition lacks, the update fails with an explanatory error.',
          'Serverless adds incremental refresh of materialized views, stream pipelining and vertical autoscaling. For triggered pipelines, the Performance optimized checkbox speeds up startup; with it cleared, standard mode consumes fewer DBUs and typically starts within four to six minutes. On serverless you cannot add a clusters object to the JSON or restart the Python process.',
        ],
        source: source('Configure a serverless pipeline', 'ldp/serverless'),
      },
      {
        title: 'The Lakeflow Pipelines Editor works with files',
        body: [
          'You create a pipeline with New → ETL pipeline, or from Jobs & Pipelines and from Create in the workspace browser. The editor shows an asset browser with the root folder, transformations for source code, explorations for analysis notebooks and utilities for Python modules. Files in .sql and .py can be mixed and can reference tables defined in other files.',
          'Run pipeline runs every file; Run file or Run table updates only one part and can leave the graph incomplete. Dry run validates definitions without materializing data. The bottom panel holds Pipeline graph, Tables, Performance, Issues and the event log. Move or rename files from the pipeline asset browser, because doing it from the workspace breaks the source code configuration.',
        ],
        source: source('Lakeflow Pipelines Editor', 'ldp/multi-file-editor'),
      },
      {
        title: 'The event log is the source of truth for the pipeline',
        body: [
          'The event log stores audit records, progress, data quality and lineage. By default it is a hidden Delta table in the pipeline catalog and schema; you query it with event_log(<pipeline_id>) or event_log(TABLE(table)). Only the owner can call that function, unless you publish the event log to Unity Catalog from Advanced settings. Never delete the event log or its schema.',
          'Events of type flow_progress contain details:flow_progress.data_quality.expectations with passed_records and failed_records per expectation, and data_quality.dropped_records with the discarded rows. Databricks recommends the pipeline_events system table, in Beta, to observe every pipeline in a region. Updates stay in the UI for 60 days, but their events remain in the event log.',
        ],
        source: source('Pipeline event log', 'ldp/monitor-event-logs'),
      },
      {
        title: 'Refresh, full refresh and how each update runs',
        body: [
          'A normal refresh processes only new records in streaming tables and updates materialized views, incrementally when that is more efficient. A full refresh empties streaming tables, clears checkpoints and reprocesses the whole source: if the source no longer keeps the data, such as Kafka with short retention, those records are lost. You can block it with the table property pipelines.reset.allowed = false.',
          'The development setting states whether the pipeline runs in development or production mode and defaults to false. In addition, a non-continuous update started from the UI reuses resources and disables retries for fast debugging; updates started by jobs, the API or in continuous mode retry and restart on recoverable errors. Run now with different settings changes that behavior for one run.',
        ],
        source: source('Run a pipeline update', 'ldp/updates'),
      },
    ],
    diagram: {
      title: 'A declarative DAG from bronze to gold with its event log',
      caption: 'The pipeline infers the arrows from the queries: streaming tables read files with STREAM read_files, silver applies expectations, AUTO CDC keeps customers in SCD 1 and 2, gold is a materialized view and every update leaves metrics in the event log.',
      layers: [
        { label: 'Sources in a volume', nodes: ['raw/orders/*.json', 'raw/customers_cdc/*.json'] },
        { label: 'Bronze: streaming tables', nodes: ['orders_bronze (STREAM read_files)', 'customers_cdc_bronze (STREAM read_files)'] },
        { label: 'Silver: quality and CDC', nodes: ['orders_silver: expectations warn / drop / fail', 'customers_scd1: AUTO CDC SCD 1', 'customers_scd2: AUTO CDC SCD 2'] },
        { label: 'Gold: materialized view', nodes: ['sales_by_day', 'SQL and BI consumers'] },
        { label: 'Observability', nodes: ['Event log: flow_progress and data_quality', 'Graph and Data quality tab'] },
      ],
    },
    comparison: {
      title: 'Streaming table, materialized view and temporary view',
      headers: ['Aspect', 'Streaming table', 'Materialized view', 'Temporary view'],
      rows: [
        ['How it processes', 'Each record once, incrementally', 'Recomputes the result; incremental when possible', 'Evaluated on demand'],
        ['Persistence', 'Unity Catalog managed table', 'Unity Catalog managed table', 'Not persisted'],
        ['Ideal source', 'Append-only: files, Kafka, Event Hubs', 'Sources with updates or deletes, joins and aggregations', 'Intermediate steps and checks'],
        ['Flows', 'One or more: append and AUTO CDC', 'Only the implicit flow of its definition', 'Not a flow target'],
        ['Expectations', 'Yes', 'Yes', 'Yes; metrics only when evaluated'],
        ['Outside the pipeline', 'Queryable by other jobs and users', 'Queryable by other jobs and users', 'Only inside the same pipeline'],
        ['Full refresh', 'Empties data and checkpoints and reprocesses the source', 'Same result as a normal refresh', 'Not applicable'],
        ['Syntax', 'CREATE OR REFRESH STREAMING TABLE / @dp.table', 'CREATE OR REFRESH MATERIALIZED VIEW / @dp.materialized_view', 'CREATE TEMPORARY VIEW / @dp.temporary_view'],
      ],
      sources: [source('Pipeline concepts', 'ldp/concepts/'), source('Run a pipeline update', 'ldp/updates')],
    },
    lab: {
      title: 'A declarative pipeline with quality and CDC on Free Edition',
      goal: 'Create a serverless ETL pipeline with SQL files, load orders from a volume into bronze, filter them in silver with expectations, aggregate them in a gold materialized view, verify incremental loading and maintain a customer dimension with AUTO CDC in SCD 1 and SCD 2.',
      minutes: 90,
      requirements: [
        'Databricks Free Edition: only serverless compute is available and one active pipeline per type is allowed; stop other ETL pipelines before you start. Serverless pipelines use the Advanced edition, which includes expectations and AUTO CDC.',
        'Permission to create a schema and a volume in your catalog; replace <your_catalog> with the result of current_catalog() throughout the lab.',
        'A serverless notebook to prepare data and verify counts. Do not use that notebook as pipeline source code: the pipeline code lives in .sql files inside transformations.',
      ],
      steps: [
        {
          title: 'Prepare the schema and the volume',
          body: 'Open a new notebook with serverless compute and SQL as the language. Note the result of current_catalog() and use it instead of <your_catalog>. The s09_lab schema will be the default catalog and schema of the pipeline; the raw volume will hold the input JSON files.',
          code: { language: 'sql', code: `SELECT current_catalog();
CREATE SCHEMA IF NOT EXISTS <your_catalog>.s09_lab;
CREATE VOLUME IF NOT EXISTS <your_catalog>.s09_lab.raw;` },
          check: 'The s09_lab schema and the /Volumes/<your_catalog>/s09_lab/raw volume exist.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Write the first batch of sample data',
          body: 'In a Python cell of the same notebook, write two JSON Lines files. The orders deliberately include a negative amount, a null order_id and an order without a customer. The customer feed brings inserts, two C1 updates arriving out of order and a C3 delete; seq gives the real order of the changes.',
          code: { language: 'python', code: `catalog = "<your_catalog>"
base = f"/Volumes/{catalog}/s09_lab/raw"
dbutils.fs.mkdirs(f"{base}/orders")
dbutils.fs.mkdirs(f"{base}/customers_cdc")
orders_1 = """{"order_id": 1, "customer_id": "C1", "amount": 10.0, "order_date": "2026-01-05"}
{"order_id": 2, "customer_id": "C2", "amount": 20.0, "order_date": "2026-01-05"}
{"order_id": 3, "customer_id": "C1", "amount": -5.0, "order_date": "2026-01-06"}
{"order_id": null, "customer_id": "C3", "amount": 7.0, "order_date": "2026-01-06"}
{"order_id": 5, "customer_id": "C3", "amount": 30.0, "order_date": "2026-01-06"}
{"order_id": 6, "customer_id": null, "amount": 15.0, "order_date": "2026-01-07"}
"""
cdc_1 = """{"customer_id": "C1", "name": "Ana", "city": "Lima", "operation": "INSERT", "seq": 1}
{"customer_id": "C2", "name": "Luis", "city": "Quito", "operation": "INSERT", "seq": 1}
{"customer_id": "C3", "name": "Eva", "city": "Cali", "operation": "INSERT", "seq": 1}
{"customer_id": "C1", "name": "Ana", "city": "Cusco", "operation": "UPDATE", "seq": 3}
{"customer_id": "C1", "name": "Ana", "city": "Arequipa", "operation": "UPDATE", "seq": 2}
{"customer_id": "C3", "name": null, "city": null, "operation": "DELETE", "seq": 2}
"""
dbutils.fs.put(f"{base}/orders/orders_1.json", orders_1, True)
dbutils.fs.put(f"{base}/customers_cdc/cdc_1.json", cdc_1, True)
assert spark.read.json(f"{base}/orders").count() == 6
assert spark.read.json(f"{base}/customers_cdc").count() == 6` },
          check: 'Both assertions pass: orders_1.json and cdc_1.json hold six records each.',
        },
        {
          title: 'Create the ETL pipeline',
          body: 'In the sidebar, click New and choose ETL pipeline; you can also start from Jobs & Pipelines. Rename it to s09_pipeline and, next to the name, click the catalog and schema to choose <your_catalog> and s09_lab. Confirm that the pipeline keeps Unity Catalog, the Current channel and serverless compute, the defaults.',
          check: 'The Lakeflow Pipelines Editor shows s09_pipeline with <your_catalog>.s09_lab as the default target.',
          screen: { id: 's09-new', highlight: ['new', 'etlPipeline'] },
        },
        {
          title: 'Declare bronze in a SQL file',
          body: 'In the pipeline asset browser use + → Transformation, name the file orders_bronze, choose SQL and click Create; if the editor created an empty my_transformation file, switch it to SQL and use it or delete it from the same browser. read_files with STREAM uses Auto Loader; the explicit schema avoids inference surprises and _metadata.file_name keeps the origin.',
          code: { language: 'sql', code: `CREATE OR REFRESH STREAMING TABLE orders_bronze
AS SELECT order_id, customer_id, amount, order_date,
  _metadata.file_name AS source_file
FROM STREAM read_files(
  '/Volumes/<your_catalog>/s09_lab/raw/orders/',
  format => 'json',
  schema => 'order_id INT, customer_id STRING, amount DOUBLE, order_date DATE'
);` },
          check: 'transformations contains orders_bronze.sql and the editor flags no syntax errors.',
          screen: { id: 's09-editor', highlight: ['catalogSchema', 'add', 'transformation', 'language'] },
        },
        {
          title: 'Declare silver with three quality actions',
          body: 'Create another SQL transformation named orders_silver. valid_id and positive_amount drop rows; has_customer only warns and lets the row through; has_date would fail the update. Do not add null dates: the goal is to see metrics, not to stop the pipeline. You write no ordering at all: STREAM(orders_bronze) is enough for the pipeline to create the dependency.',
          code: { language: 'sql', code: `CREATE OR REFRESH STREAMING TABLE orders_silver (
  CONSTRAINT valid_id EXPECT (order_id IS NOT NULL) ON VIOLATION DROP ROW,
  CONSTRAINT positive_amount EXPECT (amount > 0) ON VIOLATION DROP ROW,
  CONSTRAINT has_customer EXPECT (customer_id IS NOT NULL),
  CONSTRAINT has_date EXPECT (order_date IS NOT NULL) ON VIOLATION FAIL UPDATE
)
AS SELECT order_id, customer_id, amount, order_date, source_file
FROM STREAM(orders_bronze);` },
          check: 'transformations contains orders_bronze.sql and orders_silver.sql; pipeline tables are named without a catalog because they use the default target.',
        },
        {
          title: 'Declare gold as a materialized view',
          body: 'Create a third SQL transformation named sales_by_day. It is an aggregation with batch semantics: it has no STREAM because the materialized view recomputes the full result, and on serverless it tries to do so incrementally. You can query it from outside the pipeline like any Unity Catalog table.',
          code: { language: 'sql', code: `CREATE OR REFRESH MATERIALIZED VIEW sales_by_day
AS SELECT order_date, COUNT(*) AS orders, SUM(amount) AS total
FROM orders_silver
GROUP BY order_date;` },
          check: 'transformations contains orders_bronze.sql, orders_silver.sql and sales_by_day.sql.',
        },
        {
          title: 'Validate with Dry run and run the pipeline',
          body: 'Click Dry run to resolve definitions without writing data and review Issues. Then click Run pipeline. Open Pipeline graph: you will see orders_bronze → orders_silver → sales_by_day. Verify the counts from your notebook. Bronze receives all six rows; silver drops orders 3 and 4 and keeps order 6 with a warning.',
          code: { language: 'sql', code: `SELECT 'bronze' AS layer, count(*) AS n FROM <your_catalog>.s09_lab.orders_bronze
UNION ALL SELECT 'silver', count(*) FROM <your_catalog>.s09_lab.orders_silver
UNION ALL SELECT 'gold', count(*) FROM <your_catalog>.s09_lab.sales_by_day;
SELECT * FROM <your_catalog>.s09_lab.sales_by_day ORDER BY order_date;` },
          check: 'bronze = 6, silver = 4 and gold = 3. sales_by_day: 2026-01-05 → 2 orders and 30.0; 2026-01-06 → 1 and 30.0; 2026-01-07 → 1 and 15.0.',
          screen: { id: 's09-run', highlight: ['dryRun', 'runPipeline', 'graphTab'] },
        },
        {
          title: 'Read the quality metrics in the UI and in the event log',
          body: 'Go to Jobs & Pipelines, open s09_pipeline, click the orders_silver node and choose the Data quality tab. Then query the event log from the notebook with event_log(TABLE(...)); as the pipeline owner you are allowed to call it. Do it before the next batch: the query adds up every recorded update.',
          code: { language: 'sql', code: `SELECT row_expectations.dataset AS dataset,
  row_expectations.name AS expectation,
  SUM(row_expectations.passed_records) AS passing_records,
  SUM(row_expectations.failed_records) AS failing_records
FROM (
  SELECT explode(from_json(details:flow_progress:data_quality:expectations,
    'array<struct<name: string, dataset: string, passed_records: int, failed_records: int>>')) row_expectations
  FROM event_log(TABLE(<your_catalog>.s09_lab.orders_silver))
  WHERE event_type = 'flow_progress'
)
GROUP BY ALL;` },
          check: 'valid_id, positive_amount and has_customer show 1 failed record each and has_date shows 0; 2 rows were dropped in total and the warned row is still in silver.',
          screen: { id: 's09-monitor', highlight: ['jobs', 'silverNode', 'dataQuality'] },
        },
        {
          title: 'Add a file and run incrementally',
          body: 'Write a second orders file and click Run pipeline again, without a full refresh. Auto Loader reads only the new file, so bronze processes three rows in this update; positive_amount drops order 8 with an amount of 0. The materialized view reflects the new state of silver.',
          code: { language: 'python', code: `orders_2 = """{"order_id": 7, "customer_id": "C2", "amount": 12.5, "order_date": "2026-01-07"}
{"order_id": 8, "customer_id": "C1", "amount": 0.0, "order_date": "2026-01-08"}
{"order_id": 9, "customer_id": "C4", "amount": 40.0, "order_date": "2026-01-08"}
"""
dbutils.fs.put(f"{base}/orders/orders_2.json", orders_2, True)
# After Run pipeline, repeat the count query from step 7.` },
          check: 'bronze = 9, silver = 6 and gold = 4. sales_by_day: 2026-01-05 → 2 and 30.0; 2026-01-06 → 1 and 30.0; 2026-01-07 → 2 and 27.5; 2026-01-08 → 1 and 40.0; grand total 127.5.',
        },
        {
          title: 'Maintain customers with AUTO CDC in SCD 1 and SCD 2',
          body: 'Create the SQL transformation customers_cdc and click Run pipeline. Each target streaming table is declared first, followed by its AUTO CDC flow with a unique name. SEQUENCE BY seq makes the Arequipa update, which arrives later but has seq 2, not overwrite Cusco with seq 3 in SCD 1, and keeps it as an intermediate version in SCD 2.',
          code: { language: 'sql', code: `CREATE OR REFRESH STREAMING TABLE customers_cdc_bronze
AS SELECT customer_id, name, city, operation, seq
FROM STREAM read_files(
  '/Volumes/<your_catalog>/s09_lab/raw/customers_cdc/',
  format => 'json',
  schema => 'customer_id STRING, name STRING, city STRING, operation STRING, seq INT'
);

CREATE OR REFRESH STREAMING TABLE customers_scd1;
CREATE FLOW customers_scd1_flow AS AUTO CDC INTO customers_scd1
FROM STREAM(customers_cdc_bronze)
KEYS (customer_id)
APPLY AS DELETE WHEN operation = 'DELETE'
SEQUENCE BY seq
COLUMNS * EXCEPT (operation, seq)
STORED AS SCD TYPE 1;

CREATE OR REFRESH STREAMING TABLE customers_scd2;
CREATE FLOW customers_scd2_flow AS AUTO CDC INTO customers_scd2
FROM STREAM(customers_cdc_bronze)
KEYS (customer_id)
APPLY AS DELETE WHEN operation = 'DELETE'
SEQUENCE BY seq
COLUMNS * EXCEPT (operation, seq)
STORED AS SCD TYPE 2;` },
          check: 'customers_scd1 has 2 rows: C1 in Cusco and C2 in Quito; C3 was deleted. customers_scd2 has 5 rows: C1 Lima (1→2), Arequipa (2→3) and Cusco (3→null), C2 Quito (1→null) and C3 Cali (1→2); 2 rows have a null __END_AT.',
        },
        {
          title: 'Compare with a full refresh',
          body: 'Click Run pipeline with full table refresh. Streaming tables are emptied, lose their checkpoints and reread every file in the volume; materialized views are recomputed. Because all three files are still in the volume, the result matches. Had you deleted a file, its rows would disappear from bronze, silver and gold.',
          code: { language: 'sql', code: `SELECT 'bronze' AS t, count(*) AS n FROM <your_catalog>.s09_lab.orders_bronze
UNION ALL SELECT 'silver', count(*) FROM <your_catalog>.s09_lab.orders_silver
UNION ALL SELECT 'gold', count(*) FROM <your_catalog>.s09_lab.sales_by_day
UNION ALL SELECT 'scd1', count(*) FROM <your_catalog>.s09_lab.customers_scd1
UNION ALL SELECT 'scd2', count(*) FROM <your_catalog>.s09_lab.customers_scd2;` },
          check: 'After the full refresh: bronze = 9, silver = 6, gold = 4, scd1 = 2 and scd2 = 5, as before, because the source keeps every file.',
          screen: { id: 's09-run', highlight: ['fullRefresh', 'tablesTab'] },
        },
      ],
      wrapUp: 'You declared five datasets in SQL files and the pipeline inferred the order. Nine orders entered bronze; three rules sorted them into six silver rows, three drops and one warning, and gold summarizes four dates. AUTO CDC resolved out-of-order events in SCD 1 and kept the history in SCD 2. When you finish, stop or delete the pipeline to free your single active Free Edition pipeline.',
      sources: [
        { label: 'Free Edition limitations', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Configure pipelines', 'ldp/configure-pipeline'),
        source('Lakeflow Pipelines Editor', 'ldp/multi-file-editor'),
        source('read_files and its use in streaming tables', 'sql/language-manual/functions/read_files'),
        source('CREATE STREAMING TABLE (pipelines)', 'ldp/developer/ldp-sql-ref-create-streaming-table'),
        source('CREATE MATERIALIZED VIEW (pipelines)', 'ldp/developer/ldp-sql-ref-create-materialized-view'),
        source('Expectations', 'ldp/expectations'),
        source('Query the event log', 'ldp/monitor-event-logs'),
        source('event_log function', 'sql/language-manual/functions/event_log'),
        source('AUTO CDC INTO (pipelines)', 'ldp/developer/ldp-sql-ref-apply-changes-into'),
        source('AUTO CDC SCD 1 and SCD 2 examples', 'ldp/cdc'),
        source('Refresh and full refresh', 'ldp/updates'),
        source('Full refresh for streaming tables', 'ldp/full-refresh-st'),
      ],
    },
    certification: {
      intro: 'Original practice questions aligned with the official exam guide. They are not real exam questions.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Ingestion and Loading', 'Data Transformation and Modeling', 'Working with Lakeflow Jobs', 'Troubleshooting, Monitoring, and Optimization', 'Databricks Intelligence Platform'] }],
      questions: [
        { domain: 'Data Ingestion and Loading', question: 'New JSON files land in a volume every hour and are never modified. Which pipeline dataset suits bronze?', options: ['A temporary view', 'A materialized view without STREAM', 'A streaming table with STREAM read_files', 'A Kafka sink'], answer: 2, explanation: 'A streaming table processes each record once over an append-only source, and STREAM read_files uses Auto Loader to read only new files.' },
        { domain: 'Data Transformation and Modeling', question: 'A gold result joins two tables whose records are updated and deleted. Which dataset type keeps the result consistent?', options: ['A materialized view', 'An append-only streaming table', 'An append flow with ONCE', 'A temporary view published to the catalog'], answer: 0, explanation: 'A materialized view reflects the current state of the source, including updates and deletes; a streaming table assumes a source that only grows.' },
        { domain: 'Data Transformation and Modeling', question: 'You want to keep invalid rows in the target but count how many fail. Which clause do you use?', options: ['EXPECT (...) ON VIOLATION DROP ROW', 'EXPECT (...) ON VIOLATION FAIL UPDATE', 'A WHERE filter in the query', 'CONSTRAINT name EXPECT (...) without ON VIOLATION'], answer: 3, explanation: 'Without ON VIOLATION the action is warn: the row is written to the target and the failed-record metric is recorded.' },
        { domain: 'Data Transformation and Modeling', question: 'In a triggered pipeline, an expectation with FAIL UPDATE meets an invalid row. What happens?', options: ['The row is corrected and written', 'That flow update fails and rolls back, without stopping parallel flows', 'The row is dropped and the update continues', 'The pipeline switches to continuous mode automatically'], answer: 1, explanation: 'FAIL UPDATE rolls back the transaction and needs intervention; in triggered mode one failing flow does not fail parallel flows.' },
        { domain: 'Data Ingestion and Loading', question: 'A streaming table already receives data from one region and you must add a new region without a full refresh. What do you do?', options: ['Rewrite the query with UNION and run a full refresh', 'Create a materialized view with both regions', 'Add an append flow with CREATE FLOW ... INSERT INTO the same table', 'Rename the default flow'], answer: 2, explanation: 'Append flows let several sources write to one streaming table and avoid the full refresh that changing a UNION would require.' },
        { domain: 'Data Transformation and Modeling', question: 'A CDC feed brings out-of-order events and the business needs the history of each customer. Which declaration fits?', options: ['AUTO CDC INTO ... SEQUENCE BY ... STORED AS SCD TYPE 2', 'AUTO CDC INTO ... STORED AS SCD TYPE 1 with APPLY AS TRUNCATE', 'A materialized view with MAX per customer', 'An append flow with INSERT INTO ONCE'], answer: 0, explanation: 'SEQUENCE BY orders out-of-order events and SCD TYPE 2 creates one version per change with __START_AT and __END_AT.' },
        { domain: 'Databricks Intelligence Platform', question: 'Which product edition does a serverless pipeline require?', options: ['Core', 'Pro', 'No edition at all', 'Advanced'], answer: 3, explanation: 'Serverless pipelines require the Advanced edition, which includes CDC and expectations; classic compute supports Core, Pro and Advanced.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'Where in the event log are the records that passed or failed each expectation?', options: ['In create_update events, message field', 'In flow_progress events, details:flow_progress.data_quality.expectations', 'In system.information_schema.tables', 'In the Delta history of the silver table'], answer: 1, explanation: 'flow_progress events contain passed_records and failed_records per expectation, and dropped_records in data_quality.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'A streaming table reads from Kafka with 24-hour retention. What risk does a full refresh carry one week later?', options: ['None: the full refresh recovers the history from the checkpoint', 'It only recomputes materialized views', 'Records no longer in Kafka are lost', 'It turns the table into a materialized view'], answer: 2, explanation: 'A full refresh empties the table, clears checkpoints and reprocesses only what the source still retains.' },
        { domain: 'Working with Lakeflow Jobs', question: 'You need a pipeline to run continuously in production. What does Databricks recommend?', options: ['Orchestrate it with a continuous job and leave Pipeline mode as triggered', 'Set Pipeline mode = Continuous and avoid jobs', 'Schedule Run file every minute', 'Run a full refresh on every update'], answer: 0, explanation: 'A continuous job manages the lifecycle, takes precedence over Pipeline mode and unlocks serverless modes such as Standard.' },
        { domain: 'Data Transformation and Modeling', question: 'Which import is recommended today to define pipeline datasets in Python?', options: ['import dlt, which no longer works', 'from delta import pipelines', 'from databricks import lakeflow as lf', 'from pyspark import pipelines as dp'], answer: 3, explanation: 'The current module is pyspark.pipelines, imported as dp; import dlt still works, but Databricks recommends the new names.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 's09-new', answer: 'etlPipeline', question: 'The New menu is open. Where do you click to create a declarative pipeline?', explanation: 'New → ETL pipeline creates the pipeline and opens the Lakeflow Pipelines Editor with Unity Catalog and serverless by default.' },
        { type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's09-editor', answer: 'transformation', question: 'You opened the + menu of the pipeline asset browser. Which option creates a file that is part of the source code?', explanation: 'Transformation creates a source code file; Exploration and Utility create files that are not evaluated during updates.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's09-run', answer: 'dryRun', question: 'Where do you validate table and column names without materializing or publishing data?', explanation: 'Dry run resolves dataset and flow definitions and reports errors without writing any table.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's09-run', answer: 'fullRefresh', question: 'You changed the bronze logic and must reprocess every file from scratch. Which action do you choose?', explanation: 'Run pipeline with full table refresh empties streaming tables, clears checkpoints and reprocesses the whole available source.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's09-monitor', answer: 'dataQuality', question: 'You already selected orders_silver on the monitoring page. Where do you see how many rows passed and failed its expectations?', explanation: 'The Data quality tab in the right pane shows the warn and drop metrics of the selected dataset.' },
      ],
    },
  };
})(globalThis);
