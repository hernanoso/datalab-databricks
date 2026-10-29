// Original deep content: Spark SQL. Mirrors data/deep/es/s02.js.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const DOCS = 'https://docs.databricks.com/aws/en';
  const VIEWS = `${DOCS}/views/`;
  const CTE = `${DOCS}/sql/language-manual/sql-ref-syntax-qry-select-cte`;
  const CTAS = `${DOCS}/sql/language-manual/sql-ref-syntax-ddl-create-table-using`;
  const READ = `${DOCS}/sql/language-manual/functions/read_files`;
  const CHART = `${DOCS}/notebooks/visualizations/`;
  const EXPORT = `${DOCS}/sql/language-manual/sql-ref-syntax-dml-insert-overwrite-directory`;

  DataLab.deep.en.s02 = {
    deepDive: [
      {
        title: 'Catalyst and Photon: planning is not execution',
        body: [
          'Catalyst still plans Spark SQL queries. Photon replaces supported execution operations with native C++ implementations that process columnar batches. It does not replace all of Spark: when an operation is unsupported, execution falls back to Spark.',
          'Photon is enabled by default on SQL warehouses. That does not mean every operation in every query runs in Photon; always distinguish the engine that builds the plan from the operations that can be accelerated during execution.',
        ],
        source: { label: 'Photon engine', url: `${DOCS}/compute/photon` },
      },
      {
        title: 'Managed and external tables: who controls the files',
        body: [
          'A managed table delegates the storage lifecycle and its optimization to Unity Catalog. An external table uses a registered external location: registering the object is not the same as handing the lifecycle of those files to Databricks.',
          'Dropping an external table removes its metadata, not its files. This distinction matters when designing data ownership: the SQL name and the physical files do not necessarily have the same lifecycle.',
        ],
        source: { label: 'Unity Catalog external tables', url: `${DOCS}/tables/external` },
      },
      {
        title: 'Views: reuse logic without storing its results',
        body: [
          'An ordinary view registers query text without writing its result rows. It offers a reusable definition within a catalog and schema, whereas a table created with CTAS stores the result of the query.',
          'The scope of a temporary view depends on the context. In notebooks and jobs it is limited to the notebook or script. In Databricks SQL it is limited to the same query, which can contain multiple statements; it is not shared across separate queries.',
        ],
        source: { label: 'Views and temporary view scope', url: VIEWS },
      },
      {
        title: 'CTEs: local names, not intermediate storage',
        body: [
          'A CTE uses WITH to define a named result within a single SQL statement. You can reference it multiple times in that statement, but it does not create a persistent table or guarantee storage of an intermediate result. Here its purpose is to separate filtering, classification and aggregation.',
          'Recursive CTEs are documented for Databricks SQL and Runtime 17.0 or later: they combine an anchor and a recursive step with UNION ALL. The default maximum depth is 100 and the result limit is 1,000,000 rows. They are unsupported in UPDATE, DELETE and MERGE. They are SQL enrichment, not an explicit objective in the exam guide used here.',
        ],
        source: { label: 'Common table expressions', url: CTE },
      },
      {
        title: 'CTAS, INSERT and replacement: three different intentions',
        body: [
          'CTAS creates and populates a table from a query. In contrast, CREATE TABLE with explicit columns establishes the structure first; INSERT INTO then appends rows. Repeating an insertion can duplicate data, because appending does not mean replacing.',
          'CREATE OR REPLACE TABLE produces the table content again and is not an incremental load. You can only expect the same result on repetition if the input is unchanged and the transformation is deterministic; do not attribute that stability to every query merely because it uses OR REPLACE.',
        ],
        source: { label: 'CREATE TABLE and CTAS', url: CTAS },
      },
      {
        title: 'read_files: schema contract and provenance',
        body: [
          'read_files lets you query CSV, JSON and Parquet files. You can supply a schema in DDL or allow inference from the files. inferColumnTypes defaults to true, unlike Auto Loader: do not transfer assumptions from one tool to the other.',
          'To trace provenance, explicitly select _metadata.file_path; do not expect it to appear through SELECT *. An explicit schema makes your reading contract visible, while inference helps explore what the files contain before fixing that contract.',
        ],
        source: { label: 'read_files function', url: READ },
      },
      {
        title: 'Parsing and rescue are not the same validation',
        body: [
          'For a CSV with headers, specify header => true. read_files supplies data rescue by default: a value incompatible with the expected type can be rescued without being treated as a malformed record. With rescue enabled, FAILFAST does not fail merely for a rescued type mismatch.',
          'That is why you should distinguish the structure of a record from the types of its values. A successful read does not prove that every value meets the schema: also inspect rescued data before publishing a clean table.',
        ],
        source: { label: 'CSV: parsing and rescued data', url: `${DOCS}/query/formats/csv` },
      },
      {
        title: 'JSON as text, typed structure or VARIANT',
        body: [
          'JSON strings support field access with the colon operator. from_json converts a string into typed structured values according to a schema, while VARIANT offers optimized storage for semi-structured data. These are different representations, not interchangeable names for the same type contract.',
          'When reading JSON files, the default format expects one complete object per line. A document spanning multiple lines requires multiLine => true. First decide how the file is organized and then how to represent its fields in SQL; in the lab you will use line-delimited JSON exported from a table.',
        ],
        source: { label: 'Semi-structured data', url: `${DOCS}/semi-structured/` },
      },
      {
        title: 'Arrays: transform elements without changing the goal',
        body: [
          'transform receives an array and a lambda function that calculates a new element for each input element. For example, transform(array(1,2,3), x -> x + 1) returns [2,3,4]. This transforms the array content; it is not a request for persistence.',
          'The lambda can receive a second parameter representing the element index. Distinguishing value from index lets you express rules about positions without confusing the entire array with each of its elements.',
        ],
        source: { label: 'transform function', url: `${DOCS}/sql/language-manual/functions/transform` },
      },
      {
        title: 'Visualization also changes what you are inspecting',
        body: [
          'Both notebooks and SQL Editor let you open +, choose Visualization, select Visualization Type and save with Save. A chart is a way to inspect a result; it does not replace a table definition or turn a CTE into a persistent object.',
          'Visualization filters also filter the result table, and table filters affect the visualization. When comparing what you see, check those filters: a filtered view of the results is not evidence that you modified the stored table.',
        ],
        source: { label: 'Result visualizations', url: CHART },
      },
    ],
    diagram: {
      title: 'From file to table and chart',
      caption: 'Conceptual flow: reading and transforming do not imply persistence. CTAS stores rows; an ordinary view stores the definition used to query them.',
      layers: [
        { label: 'Sources', nodes: ['CSV, JSON and Parquet in volumes', 'samples.nyctaxi.trips, read only'] },
        { label: 'Reading and transformation', nodes: ['read_files: schema and rescue', 'CTEs: conversion and filters', 'Aggregation by distance band'] },
        { label: 'Persistence and reuse', nodes: ['Managed Delta table with CTAS', 'Ordinary view with reusable logic'] },
        { label: 'Consumption', nodes: ['Notebook results and chart', 'SQL Editor results and chart'] },
      ],
    },
    comparison: {
      title: 'What each object stores and how long its scope lasts',
      headers: ['Construct', 'What it stores', 'Scope'],
      rows: [
        ['CTE', 'No persistent object', 'One SQL statement'],
        ['Ordinary view', 'Query definition, not result rows', 'Catalog and schema object'],
        ['Notebook temporary view', 'No persisted result table', 'Notebook or script'],
        ['Databricks SQL temporary view', 'No persisted result table', 'The same query, with multiple statements'],
        ['CTAS table', 'Rows calculated by the query', 'Persistent until changed or dropped'],
      ],
      sources: [
        { label: 'Views', url: VIEWS },
        { label: 'CTEs', url: CTE },
        { label: 'CREATE TABLE', url: CTAS },
      ],
    },
    lab: {
      title: 'Fares by distance: from CTEs to files and visualization',
      goal: 'Solve the distance-band fare exercise with explicit filters, store a Delta table in your catalog, export and read three formats and visualize the average without ever writing to samples.',
      minutes: 75,
      requirements: [
        'A Databricks Free Edition workspace: serverless only and one 2X-Small SQL warehouse. You do not need Azure.',
        'A SQL notebook and read access to samples.nyctaxi.trips; permission to create schemas, tables and volumes in your catalog.',
        'Replace <your_catalog> with a writable catalog obtained through current_catalog(); if it returns samples, choose your writable catalog and check again.',
        'SQL checked against documentation, not executed in Free Edition during this research. Sample totals are not fixed; use your query results as the reference.',
      ],
      steps: [
        {
          title: 'Find your catalog before writing',
          body: 'In a SQL notebook attached to serverless, run this query. Write down the current catalog and schema. If you are in samples, switch to your writable catalog before continuing; do not create objects in the sample catalog.',
          code: { language: 'sql', code: 'SELECT current_catalog(), current_schema();' },
          check: 'You have identified a writable catalog to replace <your_catalog> throughout the lab.',
          screen: { id: 'notebook', highlight: ['languageSelect', 'computeSelect'] },
        },
        {
          title: 'Isolate the work in your schema',
          body: 'Replace the placeholder and create a dedicated schema. Keep fully qualified names in subsequent writes: this avoids depending on the active schema in another tool. The name raw is reserved for the file volume in this practice.',
          code: { language: 'sql', code: 'CREATE SCHEMA IF NOT EXISTS <your_catalog>.s02_lab;\nUSE SCHEMA <your_catalog>.s02_lab;\nCREATE VOLUME IF NOT EXISTS <your_catalog>.s02_lab.raw;' },
          check: 'The s02_lab schema and its raw volume are in your catalog, not in samples.',
        },
        {
          title: 'Filter, classify and materialize',
          body: 'Discard nonpositive distances and fares. The first CTE defines valid trips and the second assigns the band: less than 2, from 2 through 10 inclusive, or more than 10. The final SELECT aggregates and CTAS stores the result. Replace only this practice table.',
          code: { language: 'sql', code: "CREATE OR REPLACE TABLE <your_catalog>.s02_lab.fares USING DELTA AS\nWITH valid AS (\n  SELECT trip_distance, fare_amount\n  FROM samples.nyctaxi.trips\n  WHERE trip_distance > 0 AND fare_amount > 0\n), bands AS (\n  SELECT fare_amount,\n    CASE WHEN trip_distance < 2 THEN 'short'\n         WHEN trip_distance <= 10 THEN 'medium'\n         ELSE 'long' END AS band\n  FROM valid\n)\nSELECT band, COUNT(*) AS trip_count,\n       ROUND(AVG(fare_amount), 2) AS average_fare\nFROM bands\nGROUP BY band;" },
          check: 'Your fares table was created. Nothing was inserted or replaced in samples.',
        },
        {
          title: 'Compare the table with its definition',
          body: 'Query the table and record the observed bands, counts and averages; this guide does not fix a sample count. In Catalog, open your table and inspect Columns and Sample Data to connect the SQL result with the persistent object.',
          code: { language: 'sql', code: 'SELECT * FROM <your_catalog>.s02_lab.fares ORDER BY band;' },
          check: 'The band, trip_count and average_fare columns match the CTAS SELECT and provide a reference for comparing reads.',
          screen: { id: 's02-table', highlight: ['columns', 'sampleData'] },
        },
        {
          title: 'Export CSV inside your volume',
          body: 'Write the result into a dedicated volume subdirectory. INSERT OVERWRITE DIRECTORY replaces the contents of that destination: use only the indicated practice path, not a folder containing unrelated files. You do not need to upload files from your computer.',
          code: { language: 'sql', code: "INSERT OVERWRITE DIRECTORY '/Volumes/<your_catalog>/s02_lab/raw/fares_csv'\nUSING CSV OPTIONS (header 'true')\nSELECT * FROM <your_catalog>.s02_lab.fares;" },
          check: 'The write completes in fares_csv inside your raw volume.',
        },
        {
          title: 'Export JSON and Parquet separately',
          body: 'Repeat the export with different directories to avoid mixing formats. JSON will be read as objects per line; Parquet will be read with its matching format. These writes replace only the practice subdirectories named here.',
          code: { language: 'sql', code: "INSERT OVERWRITE DIRECTORY '/Volumes/<your_catalog>/s02_lab/raw/fares_json'\nUSING JSON\nSELECT * FROM <your_catalog>.s02_lab.fares;\n\nINSERT OVERWRITE DIRECTORY '/Volumes/<your_catalog>/s02_lab/raw/fares_parquet'\nUSING PARQUET\nSELECT * FROM <your_catalog>.s02_lab.fares;" },
          check: 'Each format has its own directory inside the raw volume.',
        },
        {
          title: 'Read all three formats and trace the file',
          body: 'Execute each SELECT and compare its values with the table from step 4. CSV uses headers and an explicit schema; JSON and Parquet use inference. Select the path metadata explicitly. Compare values ordered by band, not the physical order of files or rows.',
          code: { language: 'sql', code: "SELECT band, trip_count, average_fare, _metadata.file_path AS source_file\nFROM read_files('/Volumes/<your_catalog>/s02_lab/raw/fares_csv',\n  format => 'csv', header => true,\n  schema => 'band STRING, trip_count BIGINT, average_fare DOUBLE')\nORDER BY band;\n\nSELECT * FROM read_files('/Volumes/<your_catalog>/s02_lab/raw/fares_json',\n  format => 'json') ORDER BY band;\n\nSELECT * FROM read_files('/Volumes/<your_catalog>/s02_lab/raw/fares_parquet',\n  format => 'parquet') ORDER BY band;" },
          check: 'You can compare bands, counts and averages across formats and identify the source file of each CSV row.',
        },
        {
          title: 'Expose the result through an ordinary view',
          body: 'Register a reusable view over the table. The view stores the query, not another copy of the results. The valid and bands CTEs from step 3 are no longer in scope; now query the table or view by its persistent name.',
          code: { language: 'sql', code: 'CREATE OR REPLACE VIEW <your_catalog>.s02_lab.fare_summary AS\nSELECT band, trip_count, average_fare\nFROM <your_catalog>.s02_lab.fares;\n\nSELECT * FROM <your_catalog>.s02_lab.fare_summary ORDER BY band;' },
          check: 'The view lets you query table values without reusing CTE names outside their statement.',
        },
        {
          title: 'Query from SQL Editor',
          body: 'Open SQL Editor, select the available SQL warehouse and run the query over your table with Run (1000). Use the fully qualified name because the editor context can differ from the notebook. The mock illustrates documented controls, not a real screenshot.',
          code: { language: 'sql', code: 'SELECT band, average_fare\nFROM <your_catalog>.s02_lab.fares\nORDER BY band;' },
          check: 'You see band and average_fare in the editor results and can compare them with the notebook.',
          screen: { id: 's02-sql', highlight: ['sqlEditor', 'run'] },
        },
        {
          title: 'Create the chart and inspect filters',
          body: 'Above the result, open + and choose Visualization. In Visualization Type select a bar chart; configure band as the category and average_fare as the value in Y columns. Review Use aggregation because the query is already aggregated and save with Save. This path also exists in notebook results; chart and table filters affect each other.',
          check: 'The saved chart represents the queried averages. You inspected filters before comparing it with the result table.',
          screen: { id: 's02-chart', highlight: ['type', 'yColumns', 'aggregation', 'save'] },
        },
      ],
      wrapUp: 'You separated reading, transformation, persistence and consumption: CTEs organized a statement, CTAS stored rows, the view registered reusable logic and the chart displayed the result. Repeating the practice replaces only its destinations; it is not an incremental load.',
      sources: [
        { label: 'Free Edition limitations', url: `${DOCS}/getting-started/free-edition-limitations` },
        { label: 'Current catalog', url: `${DOCS}/sql/language-manual/functions/current_catalog` },
        { label: 'CTAS', url: CTAS },
        { label: 'Export to a directory', url: EXPORT },
        { label: 'read_files', url: READ },
        { label: 'JSON and multiline documents', url: `${DOCS}/query/formats/json` },
        { label: 'Views', url: VIEWS },
        { label: 'Run queries in SQL Editor', url: `${DOCS}/sql/user/sql-editor/run-queries` },
        { label: 'Explore objects', url: `${DOCS}/discover/database-objects` },
        { label: 'Visualizations', url: CHART },
        { label: 'Managed tables', url: `${DOCS}/tables/managed` },
        { label: 'INSERT INTO', url: `${DOCS}/sql/language-manual/sql-ref-syntax-dml-insert-into` },
        { label: 'from_json', url: `${DOCS}/sql/language-manual/functions/from_json` },
      ],
    },
    certification: {
      intro: 'Original practice questions aligned with the official guides. They are not real exam questions.',
      exams: [
        {
          name: 'Databricks Certified Data Engineer Associate',
          url: 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf',
          domains: ['Data Transformation and Modeling', 'Data Ingestion and Loading', 'Governance and Security'],
        },
      ],
      questions: [
        {
          domain: 'Data Transformation and Modeling',
          question: 'You must store the clean results of a query as a new table. Which construct fits?',
          options: ['A CTE without a final SELECT', 'CREATE TABLE ... AS SELECT', 'A notebook temporary view', 'SELECT without a write destination'],
          answer: 1,
          explanation: 'CTAS creates and populates a table with the query result; a CTE or view does not store those rows as a new table.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'A query defines WITH clean AS (...). Where can you reference clean without creating another object?',
          options: ['In any workspace notebook', 'In any subsequent query', 'In the same SQL statement', 'Only in a different SQL warehouse'],
          answer: 2,
          explanation: 'A CTE has statement scope and can be referenced multiple times within that statement; it is not registered as a persistent object.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'A team wants to reuse a query without storing another copy of its rows. Which object fits?',
          options: ['An ordinary view', 'A CTAS table', 'An exported CSV directory', 'A table populated with INSERT'],
          answer: 0,
          explanation: 'An ordinary view stores the query definition, not the result rows, and allows that logic to be reused.',
        },
        {
          domain: 'Data Ingestion and Loading',
          question: 'A CSV includes column names in its first row. Which read_files option fits?',
          options: ["format => 'json'", 'multiLine => true', 'header => false', 'header => true'],
          answer: 3,
          explanation: 'header => true identifies CSV headers; multiLine applies to the multiline JSON document case described here.',
        },
        {
          domain: 'Data Ingestion and Loading',
          question: 'You need to record which file produced each row read with read_files. What do you explicitly select?',
          options: ['current_catalog()', '_metadata.file_path', 'The name of a CTE', 'Only SELECT * without metadata'],
          answer: 1,
          explanation: 'The _metadata.file_path field must be explicitly selected to retrieve the provenance path of the records.',
        },
        {
          domain: 'Governance and Security',
          question: 'An external Unity Catalog table is dropped. What happens to its files according to its lifecycle?',
          options: ['They are always deleted with the metadata', 'They become a view', 'They remain; the table metadata is removed', 'They move into the notebook'],
          answer: 2,
          explanation: 'Dropping the external table removes its metadata, not the files in the external location; do not confuse SQL registration with storage ownership.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'You repeat INSERT INTO with the same rows and no additional logic. What risk exists?',
          options: ['Appending duplicate rows', 'Automatically replacing the entire table', 'Creating only a view', 'Deleting the input files'],
          answer: 0,
          explanation: 'INSERT INTO appends rows. Repeating the same data can duplicate it; this does not replace the table or deduplicate rows.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'What does transform(array(1,2,3), x -> x + 1) return?',
          options: ['[1,2,3]', '[1,3,5]', '[3,4,5]', '[2,3,4]'],
          answer: 3,
          explanation: 'The lambda adds one to each element: 1 + 1 = 2, 2 + 1 = 3 and 3 + 1 = 4; the result is [2,3,4].',
        },
        {
          domain: 'Data Ingestion and Loading',
          question: 'A JSON file contains one document spread across multiple lines. Which option fits when reading it?',
          options: ['header => true', 'multiLine => true', "format => 'csv'", 'inferColumnTypes => false as a substitute for multiLine'],
          answer: 1,
          explanation: 'JSON defaults to one complete object per line; multiLine => true allows reading a document that spans multiple lines.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'You have a JSON string and need structured values with types defined by a schema. Which function do you choose?',
          options: ['current_schema', 'transform on a nonexistent array', 'from_json', 'current_catalog'],
          answer: 2,
          explanation: 'from_json interprets the JSON string using a schema to produce typed structured values instead of keeping only text.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-sql', answer: 'run',
          question: 'Supplementary interface practice: your fare query is ready in SQL Editor. Which documented control executes it?',
          explanation: 'Run (1000) is the execution control illustrated here. This navigation exercise supplements the lab; clicks are not explicit objectives in the exam guide.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-results', answer: 'visualization',
          question: 'Supplementary interface practice: you already opened + above the results. Which option starts a chart?',
          explanation: 'Visualization opens creation of a result visualization. This is lab navigation practice, not an explicit exam objective about clicks.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-chart', answer: 'type',
          question: 'Supplementary interface practice: where do you choose the chart type to compare distance bands?',
          explanation: 'Visualization Type lets you choose the visualization type. This navigation supports the lab and is not an explicit objective in the exam guide.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-chart', answer: 'save',
          question: 'Supplementary interface practice: you finished configuring the chart. Where do you save it?',
          explanation: 'Save stores the configured visualization; it does not materialize a new table. The click is supplementary practice, not an explicit objective in the exam guide.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-table', answer: 'columns',
          question: 'Supplementary interface practice: in Catalog, where do you inspect the columns of your CTAS table?',
          explanation: 'Columns lets you inspect the object columns in Catalog. Navigation supplements table practice, but these clicks are not explicit exam objectives.',
        },
      ],
    },
  };
})(globalThis);
