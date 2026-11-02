// Session 5: original teaching content verified against the official documentation (November 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.en.s05 = {
    deepDive: [
      {
        title: 'The transaction log is the table',
        body: [
          'Every operation that modifies a Delta table writes a numbered JSON commit to _delta_log and creates a new version. Databricks periodically aggregates those commits into Parquet checkpoints so a reader does not have to replay the whole JSON history; you never interact with checkpoints directly, and their frequency can change without notice.',
          'Readers use snapshot isolation: they read the latest committed version and never see half-finished writes. A Parquet file sitting in the folder is not part of the table unless a commit adds it, which is why you never delete or copy Delta files by hand and always use commands that write to the log.',
        ],
        source: source('Table history and checkpoints', 'tables/history'),
      },
      {
        title: 'History and time travel have different retention',
        body: [
          'DESCRIBE HISTORY is kept according to delta.logRetentionDuration, 30 days by default. Time travel also needs the data files of that version, and VACUUM removes them according to delta.deletedFileRetentionDuration, 7 days by default. Seeing a version in the history does not guarantee that you can still query it.',
          'In Databricks Runtime 18.0 and above, and for Unity Catalog managed tables from 12.2, time travel is blocked for versions older than deletedFileRetentionDuration, and logRetentionDuration must be greater than or equal to that property. The documentation warns that table history is not a long-term backup solution.',
        ],
        source: source('Retention for time travel', 'tables/history'),
      },
      {
        title: 'RESTORE adds a version; it does not erase the past',
        body: [
          'RESTORE TABLE ... TO VERSION AS OF creates a new commit whose operation is RESTORE; the mistaken version stays visible in DESCRIBE HISTORY. It requires the MODIFY permission and reports metrics such as num_removed_files and num_restored_files. If VACUUM already deleted the files of the target version, the restore is not possible.',
          'The log entries that RESTORE adds carry dataChange = true. A stream reading that table can treat the restored files as new data and process duplicate rows downstream, so review your incremental consumers after a restore.',
        ],
        source: source('Restore a table', 'tables/history'),
      },
      {
        title: 'Evolve the schema one write at a time',
        body: [
          'Schema enforcement rejects writes with columns the table does not have. For an intentional change, Databricks recommends enabling evolution on that operation: .option("mergeSchema", "true") on DataFrame writes, MERGE WITH SCHEMA EVOLUTION (Runtime 15.4 LTS+) or INSERT WITH SCHEMA EVOLUTION (Runtime 18.1+). New columns are appended at the end and existing rows receive NULL.',
          'The session setting spark.databricks.delta.schema.autoMerge.enabled is documented as legacy and not recommended for production; serverless also allows only a short list of Spark properties. Changing a column type or renaming a column by rewriting the table uses overwriteSchema, which is a different tool with a different risk.',
        ],
        source: source('Schema evolution', 'tables/update-schema'),
      },
      {
        title: 'MERGE requires one source row per target row',
        body: [
          'Only one source row can match a given target row; if several match and MERGE tries to update it, the operation fails as ambiguous. Deduplicate the source by key before running it. Since Runtime 16.0, MERGE also evaluates WHEN MATCHED conditions to detect duplicate matches.',
          'WHEN MATCHED clauses are evaluated in order and every one except the last needs a condition. WHEN NOT MATCHED only inserts, and WHEN NOT MATCHED BY SOURCE can update or delete target rows without a partner; give it a condition to avoid rewriting the whole table. The numTargetRowsInserted, numTargetRowsUpdated and numTargetRowsDeleted metrics land in the history.',
        ],
        source: source('Upsert with MERGE', 'delta/merge'),
      },
      {
        title: 'OPTIMIZE rewrites without changing data',
        body: [
          'OPTIMIZE compacts small files; bin-packing compaction is idempotent, and a read before and after returns the same results because no data changes. The replaced files leave the current version but stay on storage for earlier versions until VACUUM removes them after the retention period.',
          'ZORDER BY applies only to Delta tables without liquid clustering, and Databricks recommends liquid clustering over partitions or ZORDER. When predictive optimization runs OPTIMIZE it does not apply ZORDER and ignores Z-ordered files. In the history, auto compaction, clustering and Z-ordering all appear as OPTIMIZE and are told apart by operationParameters.',
        ],
        source: source('Optimize data file layout', 'tables/operations/optimize'),
      },
      {
        title: 'Liquid clustering changes keys without a rewrite',
        body: [
          'CLUSTER BY accepts up to four keys and is not compatible with partitioning or ZORDER. You can create the table with SQL or with df.write.clusterBy(...).saveAsTable(...); the DataFrame API only sets keys at creation or in overwrite mode. ALTER TABLE ... CLUSTER BY changes the keys later and CLUSTER BY NONE turns them off, without rewriting data already written.',
          'Clustering is incremental: OPTIMIZE rewrites only what needs it, and OPTIMIZE ... FULL reclusters existing data after you change keys. CLUSTER BY AUTO lets Databricks pick keys from the query workload, but it requires a Unity Catalog managed table with predictive optimization. Unpartitioned tables with deletion vectors also gain row-level concurrency.',
        ],
        source: source('Liquid clustering', 'tables/clustering'),
      },
      {
        title: 'VACUUM deletes files and limits the past',
        body: [
          'VACUUM deletes files that the table no longer references and that are older than the retention threshold, 7 days by default. VACUUM ... DRY RUN lists what it would delete without deleting it. Log files are not governed by VACUUM: they are cleaned up automatically after checkpoints. FULL is the default mode; LITE uses the log instead of listing the directory.',
          'A safety check, retentionDurationCheck, blocks dangerously short thresholds; Databricks recommends at least 7 days because a long-running job may still have uncommitted files. With deletion vectors a delete is logical, so to purge data physically you run REORG TABLE ... APPLY (PURGE) and then VACUUM once those files have expired.',
        ],
        source: source('VACUUM', 'tables/operations/vacuum'),
      },
      {
        title: 'Predictive optimization automates maintenance',
        body: [
          'Predictive optimization runs OPTIMIZE, VACUUM and ANALYZE on Unity Catalog managed tables whenever it is cost effective, using billed serverless jobs compute. It does not run on external tables. It is enabled by default for accounts created on or after November 11, 2024, and Databricks expected the rollout to existing accounts to complete by August 2026.',
          'It is enabled or inherited per account, catalog, schema or table with ALTER ... ENABLE | DISABLE | INHERIT PREDICTIVE OPTIMIZATION and audited in system.storage.predictive_optimization_operations_history. If you lower deletedFileRetentionDuration below 7 days, its VACUUM still keeps at least 7 days. With it enabled, Databricks recommends retiring scheduled OPTIMIZE jobs.',
        ],
        source: source('Predictive optimization', 'optimizations/predictive-optimization'),
      },
      {
        title: 'Change data feed: row changes with an expiry date',
        body: [
          'CDF returns the table columns plus _change_type (insert, update_preimage, update_postimage, delete), _commit_version and _commit_timestamp. You read it with table_changes(table, start, end) or spark.read.option("readChangeFeed", "true"); the bounds are inclusive, and asking for a version before the feed was enabled raises an error.',
          'The current documentation calls the feed enabled with delta.enableChangeDataFeed = true legacy and describes an automatic feed based on row tracking that requires Runtime 19 or above; the two cannot be combined. Either way it is not a permanent archive: changes expire with the table retention and VACUUM removes the _change_data directory.',
        ],
        source: source('Change data feed', 'tables/features/change-data-feed'),
      },
    ],
    diagram: {
      title: 'One Delta table: log, files and maintenance',
      caption: 'Numbered JSON commits define which Parquet files make up each version; OPTIMIZE adds new files and retires old ones without deleting them, and only VACUUM removes them after the retention period.',
      layers: [
        { label: 'Table in Unity Catalog', nodes: ['<your_catalog>.s05_lab.customers', 'Properties: CDF, clustering, retention'] },
        { label: '_delta_log', nodes: ['…000.json → version 0', '…001.json → version 1', '…002.json → version 2', 'Parquet checkpoint'] },
        { label: 'Data files', nodes: ['Active Parquet', 'Retired Parquet: still serves time travel', 'Deletion vectors', 'CDF _change_data'] },
        { label: 'Maintenance', nodes: ['OPTIMIZE: rewrites without changing data', 'VACUUM: deletes retired files > 7 days', 'Predictive optimization'] },
      ],
    },
    comparison: {
      title: 'Partitioning, Z-order and liquid clustering',
      headers: ['Technique', 'How it is defined', 'Changing columns', 'Maintenance', 'Recommendation'],
      rows: [
        ['Partitioning (PARTITIONED BY)', 'Directories per column value at table creation', 'Rewrite the table or convert with REPLACE PARTITIONED BY WITH CLUSTER BY (Runtime 18.1+)', 'OPTIMIZE compacts within each partition', 'Avoid for new tables; prevents row-level concurrency'],
        ['Z-order (OPTIMIZE ... ZORDER BY)', 'Columns given on every OPTIMIZE', 'Another ZORDER BY rewrites data; incompatible with clustering', 'Predictive optimization does not run ZORDER', 'Legacy: migrate using those columns as clustering keys'],
        ['Liquid clustering (CLUSTER BY)', 'Up to 4 keys at creation or with ALTER TABLE', 'ALTER TABLE ... CLUSTER BY without a rewrite; OPTIMIZE FULL reclusters', 'Incremental OPTIMIZE and clustering on write above thresholds', 'Recommended for all new tables'],
        ['Automatic clustering (CLUSTER BY AUTO)', 'Databricks picks keys from the query workload', 'Automatic when savings outweigh the cost', 'Requires a UC managed table and predictive optimization', 'Useful when query patterns change'],
      ],
      sources: [source('Liquid clustering', 'tables/clustering'), source('OPTIMIZE and ZORDER', 'tables/operations/optimize')],
    },
    lab: {
      title: 'Versions, MERGE, CDF and maintenance in Free Edition',
      goal: 'Create a small Delta table from inline data, trigger schema enforcement, evolve the schema, upsert with MERGE, time travel, read the change data feed, recover from a DELETE with RESTORE and apply liquid clustering, OPTIMIZE and VACUUM DRY RUN, checking every total by hand.',
      minutes: 75,
      requirements: [
        'Databricks Free Edition with serverless compute and permission to create a schema and tables in your catalog; usage quotas apply.',
        'A Python notebook; SQL runs through spark.sql or in a SQL cell. The data lives inside the code, so there is nothing to upload.',
        'Serverless allows only a few Spark properties to be set: the lab uses per-write options and never tries to disable retention checks.',
        'Step 12 is optional: it requires an Azure Databricks Premium workspace and account admin rights; Free Edition has no account console.',
      ],
      steps: [
        {
          title: 'Discover your catalog and create the schema',
          body: 'Open a serverless notebook. Record the result of current_catalog() and replace <your_catalog> everywhere below with that writable catalog. Everything you create lives inside s05_lab so you can drop it at the end.',
          code: { language: 'sql', code: 'SELECT current_catalog();\nCREATE SCHEMA IF NOT EXISTS <your_catalog>.s05_lab;' },
          check: 'You know your writable catalog and the s05_lab schema exists.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Create version 0 with CDF enabled',
          body: 'DROP TABLE makes the lab repeatable: the new table starts its history at version 0. The delta.enableChangeDataFeed property is set at creation so changes are recorded from the start. The helper functions read the latest history entry and compute the row count and the sum of points.',
          code: { language: 'python', code: `catalog = "<your_catalog>"
t = f"{catalog}.s05_lab.customers"
from pyspark.sql import functions as F

spark.sql(f"DROP TABLE IF EXISTS {t}")
spark.sql(f"""
CREATE TABLE {t}
TBLPROPERTIES (delta.enableChangeDataFeed = true)
AS SELECT * FROM VALUES
  (1, 'Ana', 'Lima', 100),
  (2, 'Bruno', 'Quito', 200),
  (3, 'Carla', 'Bogota', 300),
  (4, 'Diego', 'Lima', 400)
AS v(id, name, city, points)
""")

def last_commit():
    return spark.sql(f"DESCRIBE HISTORY {t} LIMIT 1").first()

def totals(df):
    r = df.agg(F.count("*").alias("n"), F.sum("points").alias("s")).first()
    return (r["n"], r["s"])

first = spark.sql(f"DESCRIBE HISTORY {t}").orderBy("version").first()
assert first["version"] == 0 and first["operation"].startswith("CREATE")
assert totals(spark.table(t)) == (4, 1000)` },
          check: 'Version 0 exists and the table has 4 rows with 100 + 200 + 300 + 400 = 1000 points.',
        },
        {
          title: 'Inspect history and detail',
          body: 'DESCRIBE HISTORY lists commits from newest to oldest, and DESCRIBE DETAIL returns a single row with the format, file count, properties, table features and clustering columns. Then open Catalog → <your_catalog> → s05_lab → customers and compare the History and Details tabs with what the code printed.',
          code: { language: 'python', code: `display(spark.sql(f"DESCRIBE HISTORY {t}"))
detail = spark.sql(f"DESCRIBE DETAIL {t}").first()
assert detail["format"] == "delta"
assert detail["properties"].get("delta.enableChangeDataFeed") == "true"
print(detail["numFiles"], detail["clusteringColumns"], detail["tableFeatures"])` },
          check: 'The history has one row (version 0), the format is delta, the CDF property is true and clusteringColumns is empty; the UI shows the same.',
          screen: { id: 's05-table', highlight: ['catalog', 'table', 'details', 'history'] },
        },
        {
          title: 'Check schema enforcement, then evolve the schema',
          body: 'The DataFrame carries an email column that the table lacks. The explicit schema stops Python integers from becoming BIGINT. The first write must fail without creating a version; the second enables mergeSchema for that operation only and appends email at the end of the schema.',
          code: { language: 'python', code: `ddl = "id INT, name STRING, city STRING, points INT, email STRING"
new_rows = spark.createDataFrame([(5, "Elena", "Cali", 500, "elena@example.com")], ddl)

rejected = False
try:
    new_rows.write.mode("append").saveAsTable(t)
except Exception as e:
    rejected = True
    print("Rejected:", type(e).__name__)
assert rejected, "schema enforcement should reject the extra column"
assert totals(spark.table(t)) == (4, 1000)

new_rows.write.mode("append").option("mergeSchema", "true").saveAsTable(t)
v_append = last_commit()["version"]
assert totals(spark.table(t)) == (5, 1500)
assert spark.table(t).filter("email IS NULL").count() == 4` },
          check: 'The write without mergeSchema was rejected; with mergeSchema there are 5 rows, 1000 + 500 = 1500 points and 4 older rows with a NULL email.',
        },
        {
          title: 'Upsert with MERGE',
          body: 'The source carries an update (2), a delete (3) and an insert (6); first you confirm that each id appears only once. The first WHEN MATCHED clause has a condition because it is not the last one. The metrics come from the history, where the map values are strings.',
          code: { language: 'python', code: `changes = spark.createDataFrame([
    (2, "Bruno", "Quito", 250, "U"),
    (3, "Carla", "Bogota", 300, "D"),
    (6, "Fabio", "Lima", 600, "I"),
], "id INT, name STRING, city STRING, points INT, op STRING")
assert changes.count() == changes.select("id").distinct().count()
changes.createOrReplaceTempView("changes")

spark.sql(f"""
MERGE INTO {t} AS d
USING changes AS s
ON d.id = s.id
WHEN MATCHED AND s.op = 'D' THEN DELETE
WHEN MATCHED THEN UPDATE SET d.points = s.points, d.city = s.city
WHEN NOT MATCHED AND s.op <> 'D' THEN
  INSERT (id, name, city, points) VALUES (s.id, s.name, s.city, s.points)
""")
h = last_commit()
assert h["operation"] == "MERGE"
v_merge = h["version"]
m = h["operationMetrics"]
assert (m["numTargetRowsUpdated"], m["numTargetRowsDeleted"], m["numTargetRowsInserted"]) == ("1", "1", "1")
assert totals(spark.table(t)) == (5, 1850)` },
          check: 'One row updated, one deleted and one inserted; 5 rows remain with 100 + 250 + 400 + 500 + 600 = 1850 points.',
        },
        {
          title: 'Time travel with PySpark and SQL',
          body: 'You read three versions of the same table: with the versionAsOf option, with the @v syntax and with VERSION AS OF. Version 0 keeps its original schema, without email. The versions were stored in variables so nothing depends on fixed numbers if an automatic commit appears.',
          code: { language: 'python', code: `v0 = spark.read.option("versionAsOf", 0).table(t)
assert totals(v0) == (4, 1000)
assert "email" not in v0.columns
assert totals(spark.read.option("versionAsOf", v_append).table(t)) == (5, 1500)
assert totals(spark.table(f"{t}@v{v_merge}")) == (5, 1850)
display(spark.sql(f"SELECT * FROM {t} VERSION AS OF {v_append} ORDER BY id"))` },
          check: 'The versions return (4, 1000), (5, 1500) and (5, 1850), and version 0 has no email column.',
        },
        {
          title: 'Read the change data feed of the MERGE',
          body: 'table_changes with equal start and end returns only the changes of the MERGE commit; the bounds are inclusive. An update produces two rows, the before image and the after image. The PySpark read with readChangeFeed must return the same number of rows.',
          code: { language: 'python', code: `cdf = spark.sql(f"SELECT * FROM table_changes('{t}', {v_merge}, {v_merge})")
summary = {r["_change_type"]: r["n"] for r in
    cdf.groupBy("_change_type").agg(F.count("*").alias("n")).collect()}
assert summary == {"update_preimage": 1, "update_postimage": 1, "delete": 1, "insert": 1}
pre = cdf.filter("_change_type = 'update_preimage'").first()["points"]
post = cdf.filter("_change_type = 'update_postimage'").first()["points"]
assert (pre, post) == (200, 250)
py = (spark.read.option("readChangeFeed", "true")
    .option("startingVersion", v_merge).option("endingVersion", v_merge).table(t))
assert py.count() == 4
display(cdf.orderBy("id", "_change_type"))` },
          check: 'There are 4 change rows: insert (6), delete (3) and the update_preimage/update_postimage pair for Bruno with 200 → 250.',
        },
        {
          title: 'Simulate a mistake and recover with RESTORE',
          body: 'The DELETE mistakenly removes every customer in Lima. RESTORE returns to the content of the MERGE version by creating a new commit; the DELETE remains in the history as evidence. This only works while VACUUM has not removed the files of the target version.',
          code: { language: 'python', code: `spark.sql(f"DELETE FROM {t} WHERE city = 'Lima'")
assert totals(spark.table(t)) == (2, 750)
spark.sql(f"RESTORE TABLE {t} TO VERSION AS OF {v_merge}")
ops = [r["operation"] for r in spark.sql(f"DESCRIBE HISTORY {t} LIMIT 2").collect()]
assert ops == ["RESTORE", "DELETE"]
assert totals(spark.table(t)) == (5, 1850)` },
          check: 'After the DELETE only Bruno and Elena remain (250 + 500 = 750); after RESTORE there are 5 rows and 1850 points again, and the history shows RESTORE above DELETE.',
        },
        {
          title: 'Apply liquid clustering and OPTIMIZE',
          body: 'ALTER TABLE ... CLUSTER BY sets city as the key without rewriting data; OPTIMIZE clusters incrementally. The second table shows the PySpark clusterBy API, valid at creation or in overwrite mode. OPTIMIZE does not change data, so the totals do not move. Do not compare numFiles with a fixed value: it depends on how the files were written.',
          code: { language: 'python', code: `spark.sql(f"ALTER TABLE {t} CLUSTER BY (city)")
spark.sql(f"OPTIMIZE {t}")
d = spark.sql(f"DESCRIBE DETAIL {t}").first()
assert list(d["clusteringColumns"]) == ["city"]
assert totals(spark.table(t)) == (5, 1850)

t2 = f"{catalog}.s05_lab.customers_cluster"
spark.table(t).write.mode("overwrite").clusterBy("city").saveAsTable(t2)
assert list(spark.sql(f"DESCRIBE DETAIL {t2}").first()["clusteringColumns"]) == ["city"]
display(spark.sql(f"DESCRIBE HISTORY {t} LIMIT 3"))` },
          check: 'Both tables have clusteringColumns = [city], and the main table keeps 5 rows and 1850 points after OPTIMIZE.',
        },
        {
          title: 'Preview VACUUM without losing the past',
          body: 'DRY RUN lists the files that VACUUM would delete with the default 7-day retention. The files retired by MERGE, DELETE, RESTORE and OPTIMIZE are minutes old, so they remain protected. Do not try VACUUM ... RETAIN 0 HOURS: the retention check blocks it and serverless does not let you change that property. In Catalog Explorer, the Details tab shows the same properties as SHOW TBLPROPERTIES.',
          code: { language: 'python', code: `display(spark.sql(f"SHOW TBLPROPERTIES {t}"))
preview = spark.sql(f"VACUUM {t} DRY RUN")
print("Files that would be deleted:", preview.count())
assert totals(spark.read.option("versionAsOf", 0).table(t)) == (4, 1000)` },
          check: 'DRY RUN lists no files (0) on a freshly created table, and version 0 still returns 4 rows and 1000 points.',
          screen: { id: 's05-table', highlight: ['details'] },
        },
        {
          title: 'Look for automatic runs in History',
          body: 'In the History tab, use the All runs dropdown and choose Automatic runs to show only automatic operations such as predictive optimization; Not applied marks a skipped operation, and clicking it shows the reason. Results can take up to 24 hours, so a fresh table may show nothing yet. DESCRIBE TABLE EXTENDED shows the Predictive Optimization field when it is available.',
          code: { language: 'sql', code: 'DESCRIBE TABLE EXTENDED <your_catalog>.s05_lab.customers;' },
          check: 'You found the run-type filter and can interpret Auto and Not applied, even if the list is empty on a new table.',
          screen: { id: 's05-history', highlight: ['history', 'runFilter', 'automaticRuns', 'notApplied'] },
        },
        {
          title: 'Optional Azure: predictive optimization for the account',
          body: 'Requires Azure Databricks Premium in a supported region and account admin rights. In the account console go to Settings → Feature enablement and choose Enabled next to Predictive optimization. An owner or a user with MANAGE can override it with ALTER SCHEMA ... ENABLE PREDICTIVE OPTIMIZATION. Operations are audited in system.storage.predictive_optimization_operations_history and billed as serverless jobs.',
          code: { language: 'sql', code: 'ALTER SCHEMA <your_catalog>.s05_lab INHERIT PREDICTIVE OPTIMIZATION;\nSELECT * FROM system.storage.predictive_optimization_operations_history LIMIT 10;' },
          check: 'You can distinguish the account, catalog, schema and table levels, or you explicitly skipped this Azure-only step.',
          screen: { id: 's05-account', highlight: ['settings', 'featureEnablement', 'predictiveOptimization'] },
        },
      ],
      wrapUp: 'The accounting works by hand: 4 rows and 1000 points at version 0, 5 and 1500 after schema evolution, 5 and 1850 after the MERGE, 2 and 750 after the DELETE and again 5 and 1850 after RESTORE. The MERGE change feed holds 4 rows, and neither OPTIMIZE nor DRY RUN changes any total. When you finish, drop the schema with DROP SCHEMA <your_catalog>.s05_lab CASCADE.',
      sources: [
        { label: 'Free Edition limitations', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Serverless limitations', 'compute/serverless/limitations'),
        source('Spark properties on serverless', 'spark/conf'),
        source('History, time travel and RESTORE', 'tables/history'),
        source('DESCRIBE HISTORY schema and metrics', 'tables/history-schema'),
        source('DESCRIBE DETAIL', 'tables/operations/table-details'),
        source('Schema evolution', 'tables/update-schema'),
        source('MERGE', 'delta/merge'),
        source('Change data feed', 'tables/features/change-data-feed'),
        source('Liquid clustering', 'tables/clustering'),
        source('OPTIMIZE', 'tables/operations/optimize'),
        source('VACUUM', 'tables/operations/vacuum'),
        source('Catalog Explorer tabs', 'discover/database-objects'),
        source('Predictive optimization', 'optimizations/predictive-optimization'),
      ],
    },
    certification: {
      intro: 'Original practice questions aligned with the official guides. They are not real exam questions.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Transformation and Modeling', 'Troubleshooting, Monitoring, and Optimization', 'Databricks Intelligence Platform'] }],
      questions: [
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'You ran VACUUM with the default retention. A VERSION AS OF query from ten days ago now fails. Why?', options: ['The change data feed was disabled', 'VACUUM removed the data files of that version because they were older than the 7-day threshold', 'The transaction log is always deleted after one day', 'OPTIMIZE deleted the _delta_log directory'], answer: 1, explanation: 'Time travel needs both the log and the data files; VACUUM deletes unreferenced files older than 7 days.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'Which property controls how long VACUUM keeps data files that are no longer referenced?', options: ['delta.logRetentionDuration', 'delta.enableChangeDataFeed', 'delta.deletedFileRetentionDuration', 'spark.sql.shuffle.partitions'], answer: 2, explanation: 'deletedFileRetentionDuration (7 days by default) sets the VACUUM threshold; logRetentionDuration controls history (30 days).' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'OPTIMIZE compacted 50 small files into 2, yet storage did not shrink. What explains this?', options: ['The old files stay stored for earlier versions until VACUUM removes them after retention', 'OPTIMIZE failed without an error', 'ZORDER BY was missing', 'OPTIMIZE only changes metadata and never writes files'], answer: 0, explanation: 'OPTIMIZE retires files from the current version without deleting them; VACUUM removes them once they expire.' },
        { domain: 'Data Transformation and Modeling', question: 'You changed a table keys with ALTER TABLE ... CLUSTER BY. What do you run to recluster the data already written?', options: ['VACUUM', 'RESTORE TABLE', 'DESCRIBE DETAIL', 'OPTIMIZE ... FULL'], answer: 3, explanation: 'Changing keys does not rewrite existing data; OPTIMIZE FULL reclusters files not clustered with the current keys.' },
        { domain: 'Data Transformation and Modeling', question: 'An append carries an intentional new column and Delta rejects it. What is the recommended, scoped fix?', options: ['Drop and recreate the table', 'Use overwriteSchema on every append', 'Add .option("mergeSchema", "true") to that write', 'Enable autoMerge for the whole session'], answer: 2, explanation: 'Databricks recommends enabling evolution per operation; the session setting is legacy and affects every write.' },
        { domain: 'Data Transformation and Modeling', question: 'A MERGE fails because several source rows match the same target row. What do you fix?', options: ['Add WHEN NOT MATCHED BY SOURCE', 'Deduplicate the source by key before the MERGE', 'Run OPTIMIZE first', 'Enable the change data feed'], answer: 1, explanation: 'Only one source row can match each target row; otherwise the update is ambiguous.' },
        { domain: 'Data Transformation and Modeling', question: 'With CDF enabled, an UPDATE modifies one row. Which rows does table_changes return for that commit?', options: ['A single insert row', 'A delete row and an insert row', 'A single update row', 'An update_preimage row and an update_postimage row'], answer: 3, explanation: 'An update is recorded as the before image and the after image of the row.' },
        { domain: 'Data Transformation and Modeling', question: 'The table is at version 3 and you run RESTORE TABLE ... TO VERSION AS OF 2. What happens to the history?', options: ['A version 4 with operation RESTORE is created and version 3 stays in the history', 'Version 3 is deleted', 'The history is truncated at version 2', 'The table receives a new identifier'], answer: 0, explanation: 'RESTORE is a new commit; it does not rewrite the past, which is why you can audit it.' },
        { domain: 'Databricks Intelligence Platform', question: 'Which statement about predictive optimization is correct?', options: ['It also runs on external tables', 'It applies ZORDER automatically', 'It needs a job that you schedule', 'It runs OPTIMIZE, VACUUM and ANALYZE on Unity Catalog managed tables with serverless compute'], answer: 3, explanation: 'It only covers UC managed tables, does not run ZORDER and is billed as serverless jobs compute.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'In Free Edition you want VACUUM ... RETAIN 0 HOURS for an exercise. What is the right approach?', options: ['Disable retentionDurationCheck with SET on serverless', 'Delete the table Parquet files by hand', 'Keep the default retention and use VACUUM ... DRY RUN to observe', 'Run RESTORE before the VACUUM'], answer: 2, explanation: 'The retention check protects files in use and serverless does not allow setting that property; DRY RUN shows the effect safely.' },
        { domain: 'Data Transformation and Modeling', question: 'With deletion vectors enabled, a legal requirement asks you to physically remove deleted rows. Which sequence works?', options: ['VACUUM alone, immediately', 'RESTORE to the previous version', 'DESCRIBE HISTORY and then OPTIMIZE ZORDER', 'REORG TABLE ... APPLY (PURGE), then VACUUM once the files expire'], answer: 3, explanation: 'Deletion vectors mark rows without rewriting; PURGE rewrites the files and VACUUM deletes the old ones after retention.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 's05-table', answer: 'history', question: 'On the table page in Catalog Explorer, where do you see the visual equivalent of DESCRIBE HISTORY?', explanation: 'The History tab shows the Delta table history; the SQL equivalent is DESCRIBE HISTORY.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 's05-table', answer: 'details', question: 'Where do you check in Catalog Explorer whether the table has the delta.enableChangeDataFeed property?', explanation: 'The Details tab shows table details, including table properties, like SHOW TBLPROPERTIES.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's05-history', answer: 'automaticRuns', question: 'The run-type dropdown is open. What do you choose to show only predictive optimization operations?', explanation: 'Automatic runs shows only automatic operations; Manual runs shows the ones someone triggered by hand.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's05-history', answer: 'notApplied', question: 'Where do you click to learn why predictive optimization skipped an operation?', explanation: 'A row labeled Not applied in the Operation column marks a skipped operation; clicking it shows the reason.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 's05-account', answer: 'featureEnablement', question: 'In the account console, under Settings, where does an admin enable predictive optimization for the whole account?', explanation: 'Settings → Feature enablement holds the Predictive optimization option with values such as Enabled.' },
      ],
    },
  };
})(globalThis);
