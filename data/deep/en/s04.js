// Session 4: original teaching content based only on the supplied official research.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.en.s04 = {
    deepDive: [
      {
        title: 'Medallion is a division of responsibilities',
        body: [
          'Bronze preserves raw history and provenance so that you can revisit a transformation without asking the source to resend everything. Silver validates types, deduplicates and joins records. Gold expresses business aggregates. Medallion is a recommended design, not a mandatory sequence of three copies for every dataset.',
          'A changing source schema should not silently erase records at the bronze boundary. Preserve the received representation and its origin before applying business rules. The lab uses replaceable snapshots for learning; that deliberate simplification is not a production bronze history-retention strategy.',
        ],
        source: source('Medallion architecture', 'lakehouse/medallion'),
      },
      {
        title: 'Legacy authentication is not the modern credential model',
        body: [
          'Account keys, SAS tokens and service-principal OAuth remain documented as legacy storage configurations. A shared key exposes broad account access, a SAS restricts permissions and validity, and an application identity receives assigned permissions. They are not three equivalent modern Unity Catalog storage credential types.',
          'The legacy configuration article is retired and mounts are no longer recommended. Read older notebook examples as migration context rather than instructions for Free Edition. This does not mean that every spark.conf.set operation is deprecated: the warning concerns the legacy storage access design.',
        ],
        source: source('Legacy Azure storage configurations', 'connect/storage/azure-storage'),
      },
      {
        title: 'Separate the identity, the path and file access',
        body: [
          'A Unity Catalog storage credential holds the identity used to reach storage. An external location combines a storage path with that credential, while volumes govern direct file access. For current Azure storage designs, prefer a managed identity through an Azure Databricks Access Connector instead of embedding secrets in notebooks.',
          'The Access Connector supports system-assigned and user-assigned identities. Azure manages the identity, avoiding client-secret rotation, but you still assign the storage permissions it needs. The credential is not the folder and the external location is not a copy of the files.',
        ],
        source: source('Managed identities with Unity Catalog', 'connect/unity-catalog/cloud-storage/azure-managed-identities'),
      },
      {
        title: 'An ADLS URI identifies storage, not permission',
        body: [
          'The URI shape is abfss://<container>@<account>.dfs.core.windows.net/<path>. It identifies the container, account and path; knowing the URI does not grant access. ADLS accounts used for external locations require hierarchical namespace, so check the account configuration as well as the identity permissions.',
        ],
        source: source('ADLS external locations', 'connect/unity-catalog/cloud-storage/external-locations-adls'),
      },
      {
        title: 'Secret retrieval and redaction have different purposes',
        body: [
          'Databricks-backed scopes keep secrets in a Databricks-managed encrypted database. Azure Key Vault-backed scopes provide a read-only interface to secrets managed in Azure. Retrieve a value with dbutils.secrets.get(scope="...", key="...") instead of placing its literal value in a notebook.',
          'Output redaction is best-effort: it does not protect secrets from authorized readers or guarantee concealment after transforming a value. Key Vault-backed scopes require the Vault access policy permission model, not Azure RBAC. Never test redaction by printing a real secret.',
        ],
        source: source('Secrets', 'security/secrets/'),
      },
      {
        title: 'Federation queries; ingestion materializes',
        body: [
          'Lakehouse Federation reaches Azure SQL Database and Managed Instance through a connection and a foreign catalog. A query over that catalog does not itself persist a bronze snapshot. If the requirement is ingestion, add an explicit materialization step and record the source of that snapshot.',
          'Spark/JDBC also supports extraction and writes. Current JDBC Unity Catalog connections centralize credentials and can span serverless, standard and dedicated compute. Choose between remote querying and materialization intentionally rather than treating every successful SELECT as a completed ingestion.',
        ],
        source: source('SQL Server federation', 'query-federation/sql-server'),
      },
      {
        title: 'Cosmos DB has a compute compatibility boundary',
        body: [
          'Microsoft documents the Spark 3 OLTP connector with Maven group com.azure.cosmos.spark and format cosmos.oltp. Its tutorial example targets DBR 13.3 with Spark 3.4 and an artifact prefix azure-cosmos-spark_3-4. Match the documented runtime and connector instead of assuming any artifact works on any runtime.',
          'This connector route requires a custom third-party Spark JAR on dedicated classic compute, not Free Edition serverless or standard compute. The supplied research does not verify connector-wide Unity Catalog support, so no such compatibility is claimed here. This Azure extension is optional and is not executed in the core lab.',
        ],
        source: { label: 'Cosmos DB Spark connector tutorial', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/tutorial-spark-connector' },
      },
      {
        title: 'Parsing failures are not business quarantine',
        body: [
          'read_files provides rescued data by default for schema mismatches. CSV and JSON readers also expose parsing modes such as PERMISSIVE, DROPMALFORMED and FAILFAST. A syntactically readable record can still violate a business rule, for example a negative amount, so parsing success is not a quality certificate.',
          'badRecordsPath is nontransactional and is not a reliable business-quarantine table. Keep explicit invalid outputs, reasons and metrics in your processing design. A parsing diagnostic path cannot replace the exhaustive classification of records that were parsed successfully.',
        ],
        source: source('CSV and JSON parsing options', 'spark/api-options'),
      },
      {
        title: 'Make validity a total boolean',
        body: [
          'In SQL three-valued logic, a positive-amount comparison becomes NULL when the amount is NULL. Filtering by that predicate and then its negation loses the row from both branches. Use coalesce(id IS NOT NULL AND amount > 0, false) so every record has exactly one valid or invalid destination.',
          'Keep the original fields and an actionable reason alongside invalid rows. Check that valid plus quarantine equals bronze before deduplication. Duplicate removal is a separate accounting step: explain which version wins and count the superseded records rather than calling every reduction a quality failure.',
        ],
        source: source('Quarantine invalid records', 'ldp/expectation-patterns#quarantine-invalid-records'),
      },
      {
        title: 'Repeatability depends on input and transformation',
        body: [
          'MERGE supplies conditional inserts and updates, but source keys must be deduplicated first. replaceWhere atomically replaces predicate-matching data and validates incoming rows by default. Neither statement makes changing inputs or nondeterministic duplicate selection repeatable by itself.',
          'INSERT OVERWRITE without a partition specification replaces the whole table. Do not confuse it with legacy dynamic-partition overwrite, which is unsupported on serverless. This lab overwrites small complete snapshots with stable inputs. Separate destination writes are not one atomic multi-table transaction; validate all outputs after the run.',
        ],
        source: source('Repeatable writes with MERGE', 'delta/merge'),
      },
    ],
    diagram: {
      title: 'From optional Azure sources to governed outputs',
      caption: 'Conceptual flow: Azure integrations are optional; federation queries first and copies explicitly. The Free Edition lab substitutes small uploaded files and bounded snapshots.',
      layers: [
        { label: 'Sources — optional Azure integrations', nodes: ['ADLS', 'Blob', 'Azure SQL', 'Cosmos DB'] },
        { label: 'Ingestion', nodes: ['Governed files', 'Federation/JDBC: query first, copy explicitly', 'Cosmos OLTP connector: dedicated classic compute'] },
        { label: 'Processing', nodes: ['Bronze: provenance', 'Silver: types and deduplication', 'Gold: business aggregates', 'Quarantine: reasons and metrics'] },
        { label: 'Consumers', nodes: ['SQL/BI', 'Analytics', 'ML'] },
      ],
    },
    comparison: {
      title: 'Four ADLS authentication approaches: legacy context and current design',
      headers: ['Method', 'What it is', 'Access scope', 'Secret to manage', 'Recommended use'],
      rows: [
        ['Account key', 'Shared storage key', 'Broad/full account access', 'Account key', 'Avoid versus identity/SAS; legacy teaching'],
        ['SAS', 'Signed access token', 'Restricted permissions and validity', 'SAS token', 'Bounded temporary access; legacy configuration'],
        ['Service principal OAuth', 'Entra application identity', 'Assigned storage roles/permissions', 'Client secret in the documented flow', 'Identity-based alternative; prefer modern UC setup'],
        ['Managed identity + Access Connector', 'Azure-managed identity', 'Assigned account/container roles', 'No client-secret rotation', 'Preferred UC storage credential + external location'],
      ],
      sources: [source('Legacy storage configurations', 'connect/storage/azure-storage'), source('Managed identities', 'connect/unity-catalog/cloud-storage/azure-managed-identities')],
    },
    lab: {
      title: 'A repeatable snapshot ETL in Free Edition',
      goal: 'Upload small CSV and JSON files, preserve provenance, classify every row, choose duplicate winners deterministically and verify silver, quarantine and gold without custom JARs or Azure credentials.',
      minutes: 90,
      requirements: [
        'Databricks Free Edition with serverless compute and permission to create a schema, tables and a managed volume in your catalog; quotas and restricted outbound networking apply.',
        'A notebook with SQL and Python cells; save the two supplied files locally as UTF-8 text before uploading them.',
        'Steps 9 and 10 are optional: they require Azure resources, permissions, network access and an Azure Databricks workspace, not Free Edition.',
      ],
      steps: [
        {
          title: 'Discover your catalog and the sample metadata',
          body: 'Use a serverless notebook. Record current_catalog() and replace <your_catalog> everywhere below with that writable catalog. SHOW TABLES inspects metadata only. samples.tpch is about 1 TB: never clone it or run a full count, aggregation or scan over it.',
          code: { language: 'sql', code: 'SELECT current_catalog();\nSHOW TABLES IN samples.tpch;\nCREATE SCHEMA IF NOT EXISTS <your_catalog>.s04_lab;' },
          check: 'You know your writable catalog and can see the available sample table names without reading their contents.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Inspect a schema before a bounded relational extract',
          body: 'The code chooses a table from the discovered metadata, displays its schema, then takes at most 20 rows without assuming any column names. The persisted reference snapshot simulates a relational extraction; it is separate from the supplied sales data and does not participate in its totals. Keep this snapshot unchanged during the rerun check.',
          code: { language: 'python', code: 'catalog = "<your_catalog>"\nns = f"{catalog}.s04_lab"\nfrom pyspark.sql import functions as F\ntables = spark.sql("SHOW TABLES IN samples.tpch").collect()\nassert tables, "No sample tables available"\ntable = tables[0].tableName\nquoted = "`" + table.replace("`", "``") + "`"\nsource_table = "samples.tpch." + quoted\ndisplay(spark.sql("DESCRIBE TABLE " + source_table))\nreference = spark.table(source_table).limit(20)\nif not spark.catalog.tableExists(f"{ns}.reference_bronze"):\n    (reference.withColumn("s04_source", F.lit(source_table))\n        .write.mode("overwrite").saveAsTable(f"{ns}.reference_bronze"))\nassert spark.table(f"{ns}.reference_bronze").count() <= 20' },
          check: 'The schema was inspected and reference_bronze contains at most 20 rows, with a source marker.',
        },
        {
          title: 'Create a managed volume',
          body: 'Create the raw volume inside the dedicated lab schema. This is managed file access in Unity Catalog, not a mount or an exercise in Hadoop credential configuration. In Catalog, locate your catalog and the s04_lab schema to confirm the volume.',
          code: { language: 'sql', code: 'CREATE VOLUME IF NOT EXISTS <your_catalog>.s04_lab.raw;' },
          check: 'The raw managed volume exists at /Volumes/<your_catalog>/s04_lab/raw.',
          screen: { id: 'home', highlight: ['catalog'] },
        },
        {
          title: 'Upload the two supplied files',
          body: 'Save the CSV block as sales.csv and the JSON lines as adjustments.json, without the separator line. Use New → Add or upload data → Upload files to a volume and select the raw destination volume. Keep the files unchanged for the repeatability test. seq is the explicit version order for duplicate sale IDs.',
          code: { language: 'text', code: 'seq,id,customer,amount\n1,101,A,10.00\n2,102,B,20.00\n3,102,B,25.00\n4,103,A,\n5,104,C,-5.00\n6,wrong,C,7.00\n--- adjustments.json ---\n{"customer":"A","adjustment":"1.00"}\n{"customer":"B","adjustment":"2.00"}\n{"customer":"C","adjustment":"0.00"}' },
          check: 'The volume contains sales.csv with six records and adjustments.json with three JSON objects.',
          screen: { id: 'newMenu', highlight: ['uploadData'] },
        },
        {
          title: 'Persist raw strings and provenance',
          body: 'Run this Python cell after the setup cell from step 2. Use explicit string schemas so a malformed business value remains visible in bronze. Each input has one known source file. Snapshot overwrite is intentional here; a production bronze history requires a separate retention design.',
          code: { language: 'python', code: 'base = f"/Volumes/{catalog}/s04_lab/raw"\nraw = (spark.read.option("header", True)\n    .schema("seq STRING, id STRING, customer STRING, amount STRING")\n    .csv(base + "/sales.csv")\n    .withColumn("source_file", F.lit("sales.csv")))\nraw.write.mode("overwrite").saveAsTable(f"{ns}.sales_bronze")\nadjustments = (spark.read\n    .schema("customer STRING, adjustment STRING")\n    .json(base + "/adjustments.json")\n    .withColumn("source_file", F.lit("adjustments.json")))\nadjustments.write.mode("overwrite").saveAsTable(f"{ns}.adjustments_bronze")\nassert spark.table(f"{ns}.sales_bronze").count() == 6\nassert spark.table(f"{ns}.adjustments_bronze").count() == 3' },
          check: 'Both bronze snapshots retain the supplied fields and source_file; the counts are six and three.',
        },
        {
          title: 'Type and classify every sale',
          body: 'Preserve the raw fields while converting id, amount and seq. coalesce makes valid non-null even for the empty amount. A missing amount must reach quarantine, not disappear from both filters. The assertions check exhaustive classification before duplicate removal.',
          code: { language: 'python', code: 'typed = (spark.table(f"{ns}.sales_bronze")\n    .withColumn("sale_id", F.expr("try_cast(id AS BIGINT)"))\n    .withColumn("value", F.expr("try_cast(amount AS DECIMAL(12,2))"))\n    .withColumn("version", F.expr("try_cast(seq AS INT)")))\nclassified = (typed.withColumn("valid", F.coalesce(\n    F.col("sale_id").isNotNull() & (F.col("value") > 0), F.lit(False)))\n    .withColumn("reason", F.when(F.col("sale_id").isNull(), "invalid_id")\n        .when(F.col("value").isNull(), "missing_or_invalid_amount")\n        .when(F.col("value") <= 0, "nonpositive_amount")))\nassert classified.filter("valid IS NULL").count() == 0\nassert classified.filter("valid").count() == 3\nassert classified.filter("NOT valid").count() == 3\nassert classified.count() == 6' },
          check: 'Three rows are valid before deduplication; three are quarantined, including the row with an empty amount.',
        },
        {
          title: 'Define deterministic snapshot writes',
          body: 'The greatest seq wins for each valid sale ID; seq is unique in this supplied file. Check the adjustment join keys so the join cannot multiply sales. Gold adds the adjustment once per retained sale. Overwrite all three outputs; separate writes are not one atomic transaction.',
          code: { language: 'python', code: 'from pyspark.sql.window import Window\nfrom decimal import Decimal\n\ndef write_snapshot():\n    good = classified.filter("valid")\n    bad = classified.filter("NOT valid")\n    order = Window.partitionBy("sale_id").orderBy(F.col("version").desc())\n    winners = (good.withColumn("rn", F.row_number().over(order))\n        .filter("rn = 1").drop("rn"))\n    ref = (spark.table(f"{ns}.adjustments_bronze")\n        .select("customer", F.expr("try_cast(adjustment AS DECIMAL(12,2)) AS adjustment")))\n    assert ref.count() == ref.select("customer").distinct().count() == 3\n    assert ref.filter("customer IS NULL OR adjustment IS NULL").count() == 0\n    silver = winners.join(ref, "customer", "left")\n    assert silver.filter("adjustment IS NULL").count() == 0\n    silver.write.mode("overwrite").saveAsTable(f"{ns}.sales_silver")\n    bad.write.mode("overwrite").saveAsTable(f"{ns}.sales_quarantine")\n    gold = silver.agg(F.sum(F.col("value") + F.col("adjustment")).alias("total"))\n    gold.write.mode("overwrite").saveAsTable(f"{ns}.sales_gold")\n    assert good.count() - winners.count() == 1' },
          check: 'write_snapshot is defined; its rule retains sale 102 with amount 25.00 rather than 20.00.',
        },
        {
          title: 'Run twice and compare the stored results',
          body: 'Run the function twice with the same uploaded files and deterministic rules. Count only your tiny managed tables, never the complete sample source. Verify uniqueness and exact totals as well as unchanged row counts; a stable count alone would not detect a changed amount.',
          code: { language: 'python', code: 'def metrics():\n    silver = spark.table(f"{ns}.sales_silver")\n    quarantine = spark.table(f"{ns}.sales_quarantine")\n    gold = spark.table(f"{ns}.sales_gold")\n    return (silver.count(), quarantine.count(), gold.count(),\n        silver.select("sale_id").distinct().count(),\n        silver.agg(F.sum("value")).first()[0], gold.first()["total"])\n\nwrite_snapshot()\nfirst = metrics()\nwrite_snapshot()\nsecond = metrics()\nassert first == second == (2, 3, 1, 2, Decimal("35.00"), Decimal("38.00"))\nassert 6 == 2 + 3 + 1\ndisplay(spark.table(f"{ns}.sales_quarantine"))\nprint(second)' },
          check: 'Both runs produce two silver rows, three quarantine rows, one gold row, two unique sale keys, 35.00 before adjustments and 38.00 after them; one duplicate was superseded.',
        },
        {
          title: 'Optional Azure: governed ADLS or Blob files',
          body: 'Requires Azure. For real ADLS/Blob access, arrange resources, permissions and network connectivity in an Azure Databricks workspace. For the ADLS route, open Catalog → Connect → Credentials and inspect Purpose STORAGE; creation uses Add (+) → Create a credential → Azure Managed Identity with an Access Connector. Then use Catalog → Connect → External Locations → Create an external location: enter External location name, Storage type, URL and Storage credential. ADLS requires hierarchical namespace; use abfss://<container>@<account>.dfs.core.windows.net/<path>. Do not provision resources just to finish the core lab.',
          check: 'You can distinguish the identity credential from the storage path, or explicitly skip this Azure-only extension.',
          screen: { id: 's04-credentials', highlight: ['credentials', 'storage', 'createCredential', 'managedIdentity'] },
        },
        {
          title: 'Optional Azure: remote SQL, secrets and Cosmos DB',
          body: 'Requires Azure. For Azure SQL federation, use Catalog → Add (+) → Create a connection, complete Connection basics with Connection name, Connection type SQL Server and Auth type, then Create connection. Continue with Catalog basics → Create catalog; query first and materialize explicitly if bronze ingestion is intended. A Key Vault scope uses the case-sensitive #secrets/createScope page with Manage Principal, DNS Name, Resource ID and Create; it requires Vault access policy, not Azure RBAC. For Cosmos DB, consult the tutorial and use a matching custom OLTP JAR on dedicated classic compute only, never this serverless lab. These routes require separate Azure permissions and network access.',
          check: 'You can explain why a foreign catalog query is not a bronze copy and why the Cosmos JAR route cannot run in Free Edition; no secret was displayed.',
          screen: { id: 's04-connection', highlight: ['createConnection', 'type', 'auth', 'createCatalog'] },
        },
      ],
      wrapUp: 'The accounting is explicit: six incoming sales become two retained valid sales, three invalid rows and one superseded duplicate. Stable input plus deterministic rules and snapshot replacement gives the same checked results on rerun; the optional Azure routes remain separate.',
      sources: [
        { label: 'Free Edition limitations', url: `${DOCS}/getting-started/free-edition-limitations` },
        { label: 'Sample datasets and TPC-H size', url: `${DOCS}/discover/databricks-datasets` },
        source('Upload files to a volume', 'volumes/volume-files'),
        source('Quarantine pattern', 'ldp/expectation-patterns#quarantine-invalid-records'),
        source('Storage credential UI', 'connect/unity-catalog/cloud-storage/manage-storage-credentials'),
        source('External location UI', 'connect/unity-catalog/cloud-storage/manage-external-locations'),
        source('SQL Server federation and connection UI', 'query-federation/sql-server'),
        source('Secrets and scope UI', 'security/secrets/'),
        source('Data sources and custom JAR restrictions', 'connect/spark-data-sources'),
        { label: 'Cosmos connector tutorial', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/tutorial-spark-connector' },
        source('Rescued data with read_files', 'sql/language-manual/functions/read_files'),
        source('Selective overwrite', 'delta/selective-overwrite'),
        source('INSERT OVERWRITE semantics', 'sql/language-manual/sql-ref-syntax-dml-insert-into'),
      ],
    },
    certification: {
      intro: 'Original practice questions aligned with the official guides. They are not real exam questions.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Ingestion and Loading', 'Data Transformation and Modeling', 'Governance and Security'] }],
      questions: [
        { domain: 'Data Transformation and Modeling', question: 'A source changes a field unexpectedly. What is the bronze responsibility?', options: ['Silently discard the record', 'Preserve the raw record and provenance', 'Publish a business aggregate', 'Remove all source information'], answer: 1, explanation: 'Bronze preserves the received representation so later transformations can be investigated and replayed.' },
        { domain: 'Governance and Security', question: 'Which pair separates storage identity from storage path?', options: ['Gold and silver', 'Notebook and chart', 'Storage credential and external location', 'SAS and output table'], answer: 2, explanation: 'The storage credential holds the identity; the external location combines a path with that credential.' },
        { domain: 'Data Ingestion and Loading', question: 'A query reads an Azure SQL foreign catalog. What is needed for a bronze snapshot?', options: ['Explicit materialization of the result', 'Only another SELECT', 'A chart title', 'No action because querying always copies data'], answer: 0, explanation: 'Federation queries remote data; materialization is a separate decision when ingestion is required.' },
        { domain: 'Data Transformation and Modeling', question: 'The amount is NULL. How do you prevent a row from disappearing from both validity branches?', options: ['Filter twice with amount > 0', 'Append every row to gold', 'Remove the identifier', 'Coalesce the validity predicate to false'], answer: 3, explanation: 'A NULL predicate and its negation are both NULL; coalesce makes the valid/invalid classification exhaustive.' },
        { domain: 'Data Transformation and Modeling', question: 'What is the right role of badRecordsPath?', options: ['Transactional business quarantine', 'Parsing diagnostics, not a reliable business-quarantine table', 'Duplicate winner ordering', 'A Unity Catalog identity'], answer: 1, explanation: 'badRecordsPath is nontransactional and does not classify successfully parsed business-rule violations.' },
        { domain: 'Data Transformation and Modeling', question: 'Two valid versions have the same sale ID and distinct sequence numbers. Which rule is repeatable?', options: ['Keep whichever arrives first without ordering', 'Choose a random row', 'Keep the greatest sequence with an explicit ordering', 'Append both on each rerun'], answer: 2, explanation: 'An explicit winner order makes duplicate selection deterministic for the stable supplied version values.' },
        { domain: 'Data Transformation and Modeling', question: 'What should be checked before MERGE by source key?', options: ['Source keys are deduplicated', 'All secrets are printed', 'The source is renamed gold', 'Every row has a different file format'], answer: 0, explanation: 'MERGE supports conditional changes, but duplicate source keys must be resolved before applying them.' },
        { domain: 'Data Ingestion and Loading', question: 'How should you begin exploring the approximately 1 TB samples.tpch dataset?', options: ['Clone every table', 'Count all rows in every table', 'Aggregate every column', 'Discover tables, inspect schemas, then take bounded extracts'], answer: 3, explanation: 'Metadata discovery followed by small bounded extracts avoids treating the large sample as a tiny exercise.' },
        { domain: 'Data Transformation and Modeling', question: 'In the supplied snapshot, what accounts for six bronze sales after deduplication?', options: ['Six gold rows', 'Two silver, three quarantine and one superseded duplicate', 'Three silver and no quarantine', 'Five quarantine and two silver'], answer: 1, explanation: 'Three rows pass validation, one of those is superseded by its newer version, and three fail validation.' },
        { domain: 'Governance and Security', question: 'Does secret redaction guarantee that an authorized reader cannot reveal a transformed value?', options: ['Yes, all transformations remain hidden', 'Yes, scopes remove all reader permissions', 'No, redaction is best-effort rather than that security guarantee', 'Yes, printing a hash always proves secrecy'], answer: 2, explanation: 'Secret permissions and careful handling matter; best-effort output redaction is not an absolute security boundary.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's04-credentials', answer: 'credentials', question: 'Within Catalog → Connect, where do you inspect identities and their STORAGE purpose?', explanation: 'Credentials lists the credentials; Purpose distinguishes STORAGE from SERVICE entries.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's04-credentials', answer: 'createCredential', question: 'The Add (+) menu is open. Where do you begin creating the identity object for storage?', explanation: 'Create a credential starts credential creation; the Azure managed identity route uses an Access Connector.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's04-location', answer: 'credential', question: 'In the external location form, which field links the path to an existing storage identity?', explanation: 'Storage credential selects the identity object associated with the external storage path.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's04-connection', answer: 'type', question: 'In Connection basics, where do you select SQL Server as the remote system?', explanation: 'Connection type selects the remote system; choose SQL Server for the documented Azure SQL federation route.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's04-secrets', answer: 'principal', question: 'On #secrets/createScope, where do you choose who can manage the scope?', explanation: 'Manage Principal controls the principal choice during scope creation; it is not the vault DNS field.' },
      ],
    },
  };
})(globalThis);
