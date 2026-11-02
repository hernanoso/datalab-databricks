// Session 6: original teaching content based on verified official documentation (November 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.en.s06 = {
    deepDive: [
      {
        title: 'Incremental means keeping state, not just filtering',
        body: [
          'An incremental load must remember what it already processed: a high-water mark (the last date or sequence), the list of loaded files, or a stream checkpoint. That state matters as much as the data. Lose it and the next run starts over; keep it while editing the target table by hand and state and data drift apart.',
          'A Structured Streaming checkpoint stores offsets, commits, state and query metadata. Each query needs its own checkpoint: never share one between streams. If you delete the checkpoint files or point the query at a new location, the next run begins fresh, and on an append-mode table that means duplicate rows.',
        ],
        source: source('Structured Streaming checkpoints', 'structured-streaming/checkpoints'),
      },
      {
        title: 'COPY INTO is idempotent per file',
        body: [
          'COPY INTO loads files from a path into a Delta table and skips, on later runs, the files it has already loaded, even if those files were modified after loading. That is why you can schedule it in a job without duplicating data. COPY_OPTIONS (\'force\' = \'true\') disables that idempotency and reloads everything: use it only for a deliberate reload.',
          'FILES (up to 1000 names) or PATTERN (a glob) narrows which files are loaded; the two cannot be combined. VALIDATE checks parsing, schema and constraints without writing to the table. A SELECT inside FROM lets you cast types while loading, which helps with CSV because the format carries no types of its own.',
        ],
        source: source('COPY INTO reference', 'sql/language-manual/delta-copy-into'),
      },
      {
        title: 'mergeSchema in COPY INTO and the schemaless table',
        body: [
          'In Databricks Runtime 11.3 LTS and above you can create an empty Delta table with no columns and let COPY INTO infer its schema with COPY_OPTIONS (\'mergeSchema\' = \'true\'). That placeholder table does not accept INSERT INTO or MERGE INTO until COPY INTO fills it for the first time. mergeSchema in COPY_OPTIONS lets the table schema evolve with incoming data.',
          'In FORMAT_OPTIONS, mergeSchema concerns the reader: it merges the schemas of several source files. These are two different levels. The current documentation says that SQL users who want more scalable and robust file ingestion should use streaming tables; COPY INTO remains available and behaves as described here.',
        ],
        source: source('Get started with COPY INTO', 'ingestion/cloud-object-storage/copy-into/'),
      },
      {
        title: 'How Auto Loader remembers files',
        body: [
          'Auto Loader is the cloudFiles Structured Streaming source. As it discovers files it stores their metadata in a RocksDB key-value store inside the checkpoint, which gives exactly-once processing and resumption after failures without any state you manage yourself. It can process billions of files in a backfill and millions of files per hour in near real-time ingestion.',
          'cloudFiles.includeExistingFiles defaults to true and is evaluated only on the first start of the stream: changing it later has no effect. cloudFiles.maxFilesPerTrigger caps the files per micro-batch (1000 by default). Auto Loader does not guarantee the order in which it discovers or processes files, so downstream logic must tolerate out-of-order arrivals.',
        ],
        source: source('What is Auto Loader?', 'ingestion/cloud-object-storage/auto-loader/'),
      },
      {
        title: 'Directory listing versus file notification',
        body: [
          'Directory listing is the default mode: it lists the input folder and needs only read access to storage. File notification uses cloud event and queue services; Databricks recommends it for most workloads when combined with file events on the external location, which use one queue per location and are enabled with cloudFiles.useManagedFileEvents.',
          'Classic notification mode creates an Azure Event Grid subscription and an Azure Queue Storage queue per stream, with elevated permissions. For Unity Catalog volumes, directory listing works from Databricks Runtime 13.3 LTS, classic notification is unsupported, and file events require Databricks Runtime 14.3 LTS. You can switch modes between restarts and keep exactly-once guarantees.',
        ],
        source: source('File detection modes', 'ingestion/cloud-object-storage/auto-loader/file-detection-modes'),
      },
      {
        title: 'Schema inference: schemaLocation, hints and types',
        body: [
          'Setting cloudFiles.schemaLocation enables schema inference and evolution; Auto Loader keeps the schema history in a _schemas directory under that path. It can be the same directory as checkpointLocation. To infer, it samples the first 50 GB or 1000 files it discovers, whichever limit is crossed first. In Lakeflow pipelines, Databricks manages the schema location and checkpoint for you.',
          'For JSON, CSV and XML, which do not encode types, Auto Loader infers every column as STRING to avoid type conflicts during evolution. cloudFiles.inferColumnTypes = true requests exact types, and cloudFiles.schemaHints pins types you already know, for example "order_id BIGINT, amount DECIMAL(10,2)". Hints apply only when you do not provide a full schema.',
        ],
        source: source('Schema inference and evolution in Auto Loader', 'ingestion/cloud-object-storage/auto-loader/schema'),
      },
      {
        title: 'The five schema evolution modes',
        body: [
          'With addNewColumns, the default when no schema is provided, the stream stops with UnknownFieldException after adding the new columns to the stored schema; restarting it resumes with the updated schema. That is why Databricks recommends running these streams in Lakeflow Jobs with automatic restarts. Existing columns do not change type.',
          'addNewColumnsWithTypeWidening (Public Preview, Databricks Runtime 16.4 and above) also widens supported types, such as int to long. rescue never evolves the schema and never fails: it sends new columns to the rescued data column. failOnNewColumns fails until you update the schema or remove the file. none ignores new columns and is the default when you provide a schema.',
        ],
        source: source('Schema evolution modes', 'ingestion/cloud-object-storage/auto-loader/schema'),
      },
      {
        title: '_rescued_data keeps what does not fit',
        body: [
          'When Auto Loader infers the schema it automatically adds the _rescued_data column. It stores there, as a JSON blob together with the source file path, the values it could not parse because of columns missing from the schema, type mismatches or case mismatches. An unexpected value is therefore not silently lost and you can investigate it later.',
          'With the rescued data column active, a type mismatch does not drop the record in DROPMALFORMED mode or throw in FAILFAST mode: only corrupt records, such as incomplete JSON, fail. badRecordsPath then receives only the malformed records. A row with a non-null _rescued_data is a natural quarantine candidate before it reaches silver.',
        ],
        source: source('Rescued data column', 'ingestion/cloud-object-storage/auto-loader/schema'),
      },
      {
        title: 'Serverless accepts only triggers that finish',
        body: [
          'On serverless compute for notebooks and jobs, Structured Streaming supports Trigger.AvailableNow, the recommended one, and Trigger.Once, which is deprecated and not recommended. ProcessingTime and Continuous are unsupported. Without an explicit trigger, Spark uses a zero-second ProcessingTime trigger and the query fails with INFINITE_STREAMING_TRIGGER_NOT_SUPPORTED: in Free Edition always write trigger(availableNow=True).',
          'availableNow processes everything pending, possibly in several micro-batches, and then stops; maxFilesPerTrigger or maxBytesPerTrigger bound each batch. These restrictions do not apply to Lakeflow pipelines processing modes: for continuous ingestion use a serverless pipeline in continuous mode, or availableNow inside a continuous job.',
        ],
        source: source('Serverless compute limitations', 'compute/serverless/limitations'),
      },
      {
        title: 'Incremental MERGE without ambiguity',
        body: [
          'MERGE fails with DELTA_MULTIPLE_SOURCE_ROW_MATCHING_TARGET_ROW_IN_MERGE when more than one source row matches the same target row. In incremental loads the same key often arrives several times, so keep a single version per key first, for example the one with the highest sequence. A WHEN MATCHED AND s.seq > t.seq condition stops a late old version from overwriting a newer one.',
          'Inside a stream you can apply MERGE per micro-batch with foreachBatch, but that MERGE must be idempotent because a restart can replay a batch. For plain writes in foreachBatch, the txnAppId and txnVersion options let Delta ignore duplicate batches; if you switch to a new checkpoint, use a new txnAppId.',
        ],
        source: source('Delta streaming reads and writes', 'structured-streaming/delta-lake'),
      },
      {
        title: 'Where Lakeflow fits',
        body: [
          'Databricks organizes ingestion in three layers: Structured Streaming, with maximum customization; Lakeflow pipelines, the Spark Declarative Pipelines implementation that manages orchestration, quality and errors; and the Lakeflow Connect managed connectors for sources such as Salesforce or SQL Server. The guidance is to start with the most managed layer that supports your source.',
          'For cloud storage, Auto Loader exists in all three forms: Python or Scala with Structured Streaming, Python or SQL in Lakeflow pipelines, and SQL with streaming tables over read_files. On Azure, Lakeflow pipelines require the Premium plan; Free Edition allows one active pipeline per type, so the lab uses notebooks with availableNow.',
        ],
        source: source('Ingest with SQL and Spark APIs', 'ingestion/'),
      },
    ],
    diagram: {
      title: 'A file’s path through Auto Loader',
      caption: 'Conceptual flow: files land in a volume or an external location, Auto Loader discovers them, applies the stored schema, rescues what does not fit and records progress in the checkpoint before writing to bronze.',
      layers: [
        { label: 'Source storage', nodes: ['Unity Catalog volume (/Volumes/...)', 'ADLS abfss:// in an external location', 'S3 or GCS'] },
        { label: 'File discovery', nodes: ['Directory listing (default)', 'File notification with file events (recommended)', 'Classic notification: Event Grid + Queue Storage'] },
        { label: 'cloudFiles read', nodes: ['schemaLocation/_schemas: inferred schema and its evolution', 'schemaHints or inferColumnTypes', '_rescued_data: values that do not fit'] },
        { label: 'State', nodes: ['Checkpoint: RocksDB with discovered files', 'Offsets and commits: exactly-once'] },
        { label: 'Target', nodes: ['Delta bronze table (append)', 'MERGE by key into silver'] },
      ],
    },
    comparison: {
      title: 'COPY INTO versus Auto Loader',
      headers: ['Criterion', 'COPY INTO', 'Auto Loader'],
      rows: [
        ['Interface', 'SQL statement in Databricks SQL and Databricks Runtime', 'cloudFiles Structured Streaming source in Python or Scala; SQL through read_files in streaming tables and Lakeflow pipelines'],
        ['File tracking and idempotency', 'Skips files already loaded, even if modified; force = true disables idempotency', 'File metadata in RocksDB inside the checkpoint; exactly-once; allowOverwrites is false by default'],
        ['Scale', 'Good for scheduled loads; for directories with very many files Databricks recommends Auto Loader', 'Billions of files in backfills and millions per hour in continuous ingestion'],
        ['Schema inference', 'Reader options (for example inferSchema) or a schemaless table with mergeSchema in COPY_OPTIONS', 'Sample of 50 GB or 1000 files; JSON and CSV as STRING unless inferColumnTypes or schemaHints'],
        ['Schema evolution', 'COPY_OPTIONS (\'mergeSchema\' = \'true\') evolves the target table', 'schemaEvolutionMode: addNewColumns (default), addNewColumnsWithTypeWidening, rescue, failOnNewColumns or none'],
        ['Data that does not fit', 'Reader parsing modes; VALIDATE checks without writing', '_rescued_data included by default, with the source file path'],
        ['Discovery and latency', 'Each run checks the given path; latency depends on the job schedule', 'Directory listing or file notification with file events; scheduled availableNow or continuous mode in pipelines'],
        ['Use in Lakeflow', 'For SQL, Databricks recommends streaming tables as the scalable alternative', 'Recommended in Lakeflow pipelines, which manage schema and checkpoint automatically'],
      ],
      sources: [
        source('COPY INTO reference', 'sql/language-manual/delta-copy-into'),
        source('What is Auto Loader?', 'ingestion/cloud-object-storage/auto-loader/'),
        source('Get started with COPY INTO', 'ingestion/cloud-object-storage/copy-into/'),
      ],
    },
    lab: {
      title: 'Incremental file ingestion in Free Edition',
      goal: 'Write small CSV and JSON batches to a volume, load them with COPY INTO and with Auto Loader using availableNow, prove idempotency on rerun, trigger a schema evolution and a rescued value, and apply the changes to silver with a repeatable MERGE.',
      minutes: 90,
      requirements: [
        'Databricks Free Edition with serverless compute and permission to create a schema, tables and managed volumes in your catalog; quotas and restricted outbound networking apply.',
        'A serverless notebook with SQL and Python cells; run the steps in order because the Python cells reuse variables and functions from earlier steps.',
        'Step 11 is optional: it requires an Azure Databricks workspace, your own external location and permissions on the storage account, not Free Edition.',
      ],
      steps: [
        {
          title: 'Prepare the schema and two volumes',
          body: 'Record the result of current_catalog() and replace <your_catalog> everywhere below with that writable catalog. landing receives the source files; ops holds the Auto Loader checkpoint and schema, separate from the data. You can also create the volumes in Catalog from the schema with Create → Volume.',
          code: { language: 'sql', code: 'SELECT current_catalog();\nCREATE SCHEMA IF NOT EXISTS <your_catalog>.s06_lab;\nCREATE VOLUME IF NOT EXISTS <your_catalog>.s06_lab.landing;\nCREATE VOLUME IF NOT EXISTS <your_catalog>.s06_lab.ops;' },
          check: 'The s06_lab schema contains the managed volumes landing and ops.',
          screen: { id: 'catalog', highlight: ['create', 'volume'] },
        },
        {
          title: 'Write the first CSV batch with code',
          body: 'In a Python cell, define the paths and write two small CSV files with dbutils.fs.put. This keeps the lab reproducible without downloads. Each file has a header and an updated_at date, which would be the high-water mark if you filtered by date. Check the csv folder of the volume in Catalog to see the files.',
          code: { language: 'python', code: 'catalog = "<your_catalog>"\nns = f"{catalog}.s06_lab"\nlanding = f"/Volumes/{catalog}/s06_lab/landing"\nops = f"/Volumes/{catalog}/s06_lab/ops"\nfrom pyspark.sql import functions as F\nfrom decimal import Decimal\n\nheader = "order_id,customer,amount,updated_at\\n"\ndbutils.fs.put(f"{landing}/csv/orders_001.csv",\n    header + "1,A,10.00,2026-10-01\\n2,B,20.00,2026-10-01\\n3,C,30.00,2026-10-01\\n", True)\ndbutils.fs.put(f"{landing}/csv/orders_002.csv",\n    header + "4,A,15.00,2026-10-02\\n5,B,5.00,2026-10-02\\n", True)\ndisplay(dbutils.fs.ls(f"{landing}/csv/"))' },
          check: 'The csv folder contains orders_001.csv (3 rows) and orders_002.csv (2 rows): 5 data rows in total.',
          screen: { id: 's06-volume', highlight: ['csvDir'] },
        },
        {
          title: 'Load the batch with COPY INTO',
          body: 'Create the target table with explicit types and cast the columns in the SELECT, because CSV carries no types. COPY INTO records which files it loaded. The result reports how many rows were inserted; then check the row count and total of the table.',
          code: { language: 'sql', code: 'CREATE TABLE IF NOT EXISTS <your_catalog>.s06_lab.orders_copy (\n  order_id INT, customer STRING, amount DECIMAL(10,2), updated_at DATE);\n\nCOPY INTO <your_catalog>.s06_lab.orders_copy\nFROM (\n  SELECT CAST(order_id AS INT) AS order_id, customer,\n         CAST(amount AS DECIMAL(10,2)) AS amount,\n         CAST(updated_at AS DATE) AS updated_at\n  FROM \'/Volumes/<your_catalog>/s06_lab/landing/csv/\')\nFILEFORMAT = CSV\nFORMAT_OPTIONS (\'header\' = \'true\');\n\nSELECT count(*) AS row_count, sum(amount) AS total FROM <your_catalog>.s06_lab.orders_copy;' },
          check: 'COPY INTO reports 5 inserted rows; the table has 5 rows and a total of 80.00 (10 + 20 + 30 + 15 + 5).',
        },
        {
          title: 'Rerun to prove idempotency, then add a file',
          body: 'Run the same COPY INTO with no new files: nothing should be inserted. Then add orders_003.csv and rerun: only the new file is loaded. Alternatively, upload the file with New → Add or upload data → Upload files to a volume and choose the csv folder as the destination. Do not use force = true: it would reload every file and duplicate rows.',
          code: { language: 'python', code: 'copy_sql = f"""\nCOPY INTO {ns}.orders_copy\nFROM (SELECT CAST(order_id AS INT) AS order_id, customer,\n             CAST(amount AS DECIMAL(10,2)) AS amount,\n             CAST(updated_at AS DATE) AS updated_at\n      FROM \'{landing}/csv/\')\nFILEFORMAT = CSV\nFORMAT_OPTIONS (\'header\' = \'true\')"""\n\ndisplay(spark.sql(copy_sql))   # no new files: 0 rows\nassert spark.table(f"{ns}.orders_copy").count() == 5\n\ndbutils.fs.put(f"{landing}/csv/orders_003.csv",\n    header + "6,C,12.00,2026-10-03\\n7,A,8.00,2026-10-03\\n", True)\ndisplay(spark.sql(copy_sql))   # only orders_003.csv: 2 rows\ncopy_table = spark.table(f"{ns}.orders_copy")\nassert copy_table.count() == 7\nassert copy_table.agg(F.sum("amount")).first()[0] == Decimal("100.00")' },
          check: 'The first rerun inserts 0 rows; the second inserts 2. The table ends with 7 rows and a total of 100.00.',
          screen: { id: 's06-upload', highlight: ['uploadFiles', 'destination'] },
        },
        {
          title: 'Ingest JSON with Auto Loader and availableNow',
          body: 'Write a first JSON file and define run_bronze(), which reads the json folder with cloudFiles, keeps the schema and checkpoint in the ops volume and writes to orders_bronze. The schemaHints pin the key, sequence and amount types; everything else is inferred as STRING. trigger(availableNow=True) is mandatory on serverless. Copy the folder path from Catalog if you want to confirm it.',
          code: { language: 'python', code: 'import json\n\ndef put_json(name, rows):\n    body = "\\n".join(json.dumps(r) for r in rows) + "\\n"\n    dbutils.fs.put(f"{landing}/json/{name}", body, True)\n\nput_json("orders_001.json", [\n    {"order_id": 101, "seq": 1, "customer": "A", "amount": 10.50, "status": "new"},\n    {"order_id": 102, "seq": 2, "customer": "B", "amount": 20.00, "status": "new"},\n    {"order_id": 103, "seq": 3, "customer": "C", "amount": 7.25, "status": "new"},\n])\n\nckpt = f"{ops}/orders_bronze"\n\ndef run_bronze():\n    q = (spark.readStream.format("cloudFiles")\n        .option("cloudFiles.format", "json")\n        .option("cloudFiles.schemaLocation", ckpt)\n        .option("cloudFiles.schemaHints", "order_id BIGINT, seq BIGINT, amount DECIMAL(10,2)")\n        .load(f"{landing}/json/")\n        .select("*", F.col("_metadata.file_name").alias("source_file"))\n        .writeStream\n        .option("checkpointLocation", ckpt)\n        .option("mergeSchema", "true")\n        .trigger(availableNow=True)\n        .toTable(f"{ns}.orders_bronze"))\n    q.awaitTermination()\n\nrun_bronze()\nbronze = spark.table(f"{ns}.orders_bronze")\nbronze.printSchema()\nassert bronze.count() == 3' },
          check: 'orders_bronze has 3 rows; the schema shows order_id and seq as bigint, amount as decimal(10,2), customer and status as string, plus _rescued_data and source_file.',
          screen: { id: 's06-volume', highlight: ['jsonDir', 'copyPath'] },
        },
        {
          title: 'Rerun with no new files, then with a new one',
          body: 'Run run_bronze() again: the checkpoint already knows orders_001.json and nothing is added. Then write orders_002.json and rerun: only its two records are read. The count by source_file shows which file contributed each row.',
          code: { language: 'python', code: 'run_bronze()\nassert spark.table(f"{ns}.orders_bronze").count() == 3\n\nput_json("orders_002.json", [\n    {"order_id": 104, "seq": 4, "customer": "A", "amount": 12.00, "status": "new"},\n    {"order_id": 105, "seq": 5, "customer": "B", "amount": 3.00, "status": "new"},\n])\nrun_bronze()\nbronze = spark.table(f"{ns}.orders_bronze")\nassert bronze.count() == 5\ndisplay(bronze.groupBy("source_file").count().orderBy("source_file"))' },
          check: 'The rerun without new files leaves 3 rows; after orders_002.json there are 5 rows: 3 from orders_001.json and 2 from orders_002.json.',
        },
        {
          title: 'Create silver and apply the first MERGE',
          body: 'upsert_silver() reads bronze, drops rows with rescued data or a null amount, keeps the highest-seq version per order_id and applies MERGE. The s.seq > t.seq condition prevents an old version from overwriting a newer one. If bronze does not have the channel column yet, the function adds it as null.',
          code: { language: 'python', code: 'from pyspark.sql.window import Window\n\nspark.sql(f"""CREATE TABLE IF NOT EXISTS {ns}.orders_silver (\n  order_id BIGINT, customer STRING, amount DECIMAL(10,2),\n  status STRING, channel STRING, seq BIGINT)""")\n\ndef upsert_silver():\n    src = spark.table(f"{ns}.orders_bronze")\n    if "channel" not in src.columns:\n        src = src.withColumn("channel", F.lit(None).cast("string"))\n    valid = src.filter("_rescued_data IS NULL AND order_id IS NOT NULL AND amount IS NOT NULL")\n    latest = (valid.withColumn("rn", F.row_number().over(\n            Window.partitionBy("order_id").orderBy(F.col("seq").desc())))\n        .filter("rn = 1")\n        .select("order_id", "customer", "amount", "status", "channel", "seq"))\n    latest.createOrReplaceTempView("s06_updates")\n    return spark.sql(f"""\n      MERGE INTO {ns}.orders_silver t USING s06_updates s ON t.order_id = s.order_id\n      WHEN MATCHED AND s.seq > t.seq THEN UPDATE SET\n        t.customer = s.customer, t.amount = s.amount, t.status = s.status,\n        t.channel = s.channel, t.seq = s.seq\n      WHEN NOT MATCHED THEN INSERT (order_id, customer, amount, status, channel, seq)\n        VALUES (s.order_id, s.customer, s.amount, s.status, s.channel, s.seq)""")\n\ndisplay(upsert_silver())\nsilver = spark.table(f"{ns}.orders_silver")\nassert silver.count() == 5\nassert silver.agg(F.sum("amount")).first()[0] == Decimal("52.75")' },
          check: 'The MERGE inserts 5 rows and updates none; silver sums to 52.75 (10.50 + 20.00 + 7.25 + 12.00 + 3.00).',
        },
        {
          title: 'Trigger a schema evolution with a new column',
          body: 'orders_003.json brings the channel column and a new version of order 102. With the default addNewColumns mode, the first run adds channel to the stored schema and stops with UnknownFieldException; the second run continues with the new schema. The loop retries once, as a job with automatic restarts would.',
          code: { language: 'python', code: 'put_json("orders_003.json", [\n    {"order_id": 106, "seq": 6, "customer": "A", "amount": 5.00, "status": "new", "channel": "web"},\n    {"order_id": 102, "seq": 7, "customer": "B", "amount": 22.00, "status": "shipped", "channel": "store"},\n])\n\nfor attempt in (1, 2):\n    try:\n        run_bronze()\n        break\n    except Exception as e:\n        if attempt == 2:\n            raise\n        print("First run stopped by the new schema:", str(e)[:300])\n\nbronze = spark.table(f"{ns}.orders_bronze")\nassert "channel" in bronze.columns and bronze.count() == 7\ndisplay(bronze.select("order_id", "seq", "status", "channel", "source_file").orderBy("seq"))' },
          check: 'You see the message from the stopped first run; bronze ends with 7 rows, channel is NULL in the first 5 and web or store in the new ones.',
        },
        {
          title: 'Observe a rescued value',
          body: 'orders_004.json sends amount as the text "abc", which does not fit the DECIMAL(10,2) hint. Auto Loader does not drop the row: it leaves amount NULL and stores the original value and the file path in _rescued_data. Open the file from Catalog with Open in Editor to compare what arrived with what was loaded.',
          code: { language: 'python', code: 'put_json("orders_004.json", [\n    {"order_id": 107, "seq": 8, "customer": "C", "amount": "abc", "status": "new", "channel": "web"},\n])\nrun_bronze()\nbronze = spark.table(f"{ns}.orders_bronze")\nassert bronze.count() == 8\nrescued = bronze.filter("_rescued_data IS NOT NULL")\ndisplay(rescued.select("order_id", "amount", "_rescued_data", "source_file"))\nassert rescued.count() == 1' },
          check: 'bronze has 8 rows; exactly one, order 107, has a NULL amount and a _rescued_data value containing "abc" and the orders_004.json path.',
          screen: { id: 's06-volume', highlight: ['file', 'openEditor'] },
        },
        {
          title: 'Apply the second MERGE and rerun it',
          body: 'The second MERGE updates order 102 with its seq 7 version and inserts 106; 107 stays out of silver because it has rescued data. Rerunning the MERGE changes nothing: no row has a higher sequence and there are no new keys. Check the updated and inserted row counts in the MERGE output.',
          code: { language: 'python', code: 'display(upsert_silver())   # 1 updated (102) and 1 inserted (106)\nsilver = spark.table(f"{ns}.orders_silver")\nassert silver.count() == 6\nassert silver.agg(F.sum("amount")).first()[0] == Decimal("59.75")\nassert silver.filter("order_id = 102").first()["status"] == "shipped"\n\ndisplay(upsert_silver())   # rerun: 0 updated and 0 inserted\nassert spark.table(f"{ns}.orders_silver").count() == 6\nquarantine = spark.table(f"{ns}.orders_bronze").filter("_rescued_data IS NOT NULL OR amount IS NULL")\nassert quarantine.count() == 1\nprint("bronze 8 = silver 6 + 1 superseded version (102, seq 2) + 1 rescued (107)")' },
          check: 'The first MERGE updates 1 row and inserts 1; the rerun changes nothing. silver has 6 rows summing to 59.75; order 102 is shipped. Accounting: 8 bronze rows = 6 silver + 1 superseded version + 1 quarantined.',
        },
        {
          title: 'Optional Azure: file events on an external location',
          body: 'Requires Azure and does not run in Free Edition. In Catalog → Connect → External Locations select the location, open the menu next to Test connection and choose Edit. In Advanced Options select Enable file events, choose File event type Automatic and click Update; then use Test connection. The credential needs roles such as Storage Blob Data Contributor, Storage Queue Data Contributor and, for automatic setup, Storage Account Contributor and EventGrid Data Contributor. Then add cloudFiles.useManagedFileEvents = true to the stream, on Databricks Runtime 14.3 LTS or above.',
          check: 'You can explain why file events replace folder listing and which permissions they need, or explicitly skip this Azure-only extension.',
          screen: { id: 's06-fileEvents', highlight: ['edit', 'advanced', 'enableFileEvents', 'automatic'] },
        },
      ],
      wrapUp: 'COPY INTO loaded 7 rows in two useful runs and one empty rerun, because it remembers files. Auto Loader brought 8 rows into bronze with availableNow, evolved the schema when channel appeared and rescued an invalid amount. The MERGE left 6 orders in silver and stayed stable on rerun. To restart the lab from scratch, delete the bronze table and the checkpoint directory in ops together: deleting only one of them puts state and data out of sync.',
      sources: [
        { label: 'Free Edition limitations', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Volume files and UI upload', 'volumes/volume-files'),
        source('Get started with COPY INTO', 'ingestion/cloud-object-storage/copy-into/'),
        source('COPY INTO reference', 'sql/language-manual/delta-copy-into'),
        source('Auto Loader schema and rescued data', 'ingestion/cloud-object-storage/auto-loader/schema'),
        source('Triggers supported on serverless', 'compute/serverless/limitations'),
        source('Structured Streaming checkpoints', 'structured-streaming/checkpoints'),
        source('File metadata column', 'ingestion/file-metadata-column'),
        source('MERGE INTO reference', 'sql/language-manual/delta-merge-into'),
        source('File events on external locations', 'connect/unity-catalog/cloud-storage/manage-external-locations'),
        source('Auto Loader file notification mode', 'ingestion/cloud-object-storage/auto-loader/file-notification-mode'),
      ],
    },
    certification: {
      intro: 'Original practice questions aligned with the official guides. They are not real exam questions.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Ingestion and Loading', 'Data Transformation and Modeling', 'Databricks Intelligence Platform', 'Troubleshooting, Monitoring, and Optimization'] }],
      questions: [
        { domain: 'Data Ingestion and Loading', question: 'You rerun COPY INTO over the same folder; one of the files already loaded has been modified since. What happens?', options: ['It reloads only the modified file', 'It duplicates every row', 'It skips the files already loaded, including the modified one', 'It fails with an idempotency error'], answer: 2, explanation: 'COPY INTO skips files already loaded even if they were modified afterwards; only force = true changes that behavior.' },
        { domain: 'Data Ingestion and Loading', question: 'Which COPY_OPTIONS option disables idempotency and reloads files that were already processed?', options: ['mergeSchema', 'force', 'header', 'inferSchema'], answer: 1, explanation: 'force = true loads files regardless of whether they were loaded before; mergeSchema only lets the schema evolve.' },
        { domain: 'Data Ingestion and Loading', question: 'Auto Loader infers the schema of JSON files without inferColumnTypes or schemaHints. Which types do the columns get?', options: ['STRING for every column, nested fields included', 'Exact numeric types based on the sample', 'BINARY to avoid conflicts', 'None: inference fails without a schema'], answer: 0, explanation: 'For JSON, CSV and XML Auto Loader infers STRING by default; inferColumnTypes or schemaHints change that result.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'An Auto Loader stream in the default mode stops with UnknownFieldException after a new column arrives. What do you do?', options: ['Delete the checkpoint and start over', 'Switch the trigger to ProcessingTime', 'Drop the _rescued_data column', 'Restart the stream, because the stored schema already includes the column'], answer: 3, explanation: 'addNewColumns adds the column to the schema in schemaLocation before failing; on restart the stream continues with the new schema.' },
        { domain: 'Data Ingestion and Loading', question: 'Which schemaEvolutionMode never evolves the schema, never stops the stream and stores new columns in the rescued data?', options: ['addNewColumns', 'rescue', 'failOnNewColumns', 'none'], answer: 1, explanation: 'rescue keeps the schema fixed and records new columns in the rescued column; none ignores them without rescuing them.' },
        { domain: 'Databricks Intelligence Platform', question: 'In a serverless notebook, a writeStream with no trigger fails with INFINITE_STREAMING_TRIGGER_NOT_SUPPORTED. Which trigger do you use?', options: ['processingTime="1 minute"', 'continuous="1 second"', 'availableNow=True', 'None: remove the checkpointLocation option'], answer: 2, explanation: 'Serverless supports AvailableNow, the recommended trigger, and the deprecated Once; ProcessingTime and Continuous are unsupported.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'You delete the checkpoint of an Auto Loader stream writing in append mode but keep the table. What happens on the next run?', options: ['It reprocesses the files from the start and duplicates rows in the table', 'It reads only the new files', 'It drops the target table', 'It uses the latest table value as a high-water mark'], answer: 0, explanation: 'Without a checkpoint the query begins fresh; in append mode that writes the already loaded rows again.' },
        { domain: 'Data Ingestion and Loading', question: 'Which file detection mode does Databricks recommend for most Auto Loader workloads?', options: ['Directory listing in every case', 'Copying files to DBFS before reading them', 'A separate classic notification per stream', 'File notification with file events on the external location'], answer: 3, explanation: 'File events use one queue per external location and are more efficient and scalable than listing directories; enable them with cloudFiles.useManagedFileEvents.' },
        { domain: 'Data Transformation and Modeling', question: 'A MERGE fails with DELTA_MULTIPLE_SOURCE_ROW_MATCHING_TARGET_ROW_IN_MERGE. What is the right fix?', options: ['Add force = true', 'Replace it with INSERT OVERWRITE', 'Keep a single source row per key, the most recent one, before the MERGE', 'Disable the stream checkpoint'], answer: 2, explanation: 'Several source rows for the same target row make the MERGE ambiguous; deduplicate the source by key before applying it.' },
        { domain: 'Data Ingestion and Loading', question: 'A SQL-only team wants the most scalable incremental file ingestion. What does Databricks recommend?', options: ['COPY INTO with force = true', 'Streaming tables that read with STREAM read_files', 'A daily INSERT OVERWRITE of the whole folder', 'A direct SELECT over the folder in every query'], answer: 1, explanation: 'Databricks recommends streaming tables, which use Auto Loader, as the scalable alternative to COPY INTO for SQL users.' },
        { domain: 'Data Ingestion and Loading', question: 'Two different source folders feed the same bronze table with Auto Loader. What do you need?', options: ['A separate checkpoint for each ingestion flow', 'A single checkpoint shared by both', 'No checkpoint, because availableNow does not use one', 'Disable cloudFiles.schemaLocation'], answer: 0, explanation: 'Each Auto Loader ingestion workload requires its own checkpoint; sharing one between queries breaks file tracking.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-upload', answer: 'destination', question: 'In Upload files to a volume, where do you choose the volume or folder that will receive the file?', explanation: 'Destination volume lets you select a volume or directory, or paste its path; Create volume appears only if you need a new one.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-volume', answer: 'copyPath', question: 'The menu for an item in the volume is open. Where do you get the /Volumes/... path you will pass to load()?', explanation: 'Copy path copies the path of the file or folder; it is the path that COPY INTO and Auto Loader use.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-volume', answer: 'createDirectory', question: 'You want to separate the CSV and JSON files into folders inside the volume. Where do you create an empty folder?', explanation: 'On the volume overview tab, Create directory creates an empty directory that you can then upload files into.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-fileEvents', answer: 'enableFileEvents', question: 'In the Edit dialog of an external location, with Advanced Options open, which option turns on file events for Auto Loader?', explanation: 'Enable file events turns on the location event service; the stream then uses cloudFiles.useManagedFileEvents.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-fileEvents', answer: 'automatic', question: 'You want Databricks to create and manage the event queue and subscription for you. Which File event type do you choose?', explanation: 'Automatic lets Databricks configure Event Grid and the storage queue; Provided requires you to manage the queue yourself.' },
      ],
    },
  };
})(globalThis);
