// Session 3: original English content based on the supplied official-source research.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};

  const DOCS = 'https://docs.databricks.com/aws/en';
  const SPARK = 'https://spark.apache.org/docs';
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.en.s03 = {
    deepDive: [
      {
        title: 'Distributed execution: coordination is not processing every row',
        body: [
          'The driver coordinates distributed work, the cluster manager allocates resources, and executors run tasks over data partitions. An action can trigger jobs that are divided into stages and tasks. A partition is a unit of distributed work, not a promise that one file always corresponds to one task.',
          'Use this as a conceptual architecture in Free Edition, not as a cluster administration exercise. Its serverless service manages the resources for you. The Python notebook process using Spark Connect is a client; do not identify that process with the remote driver shown in the server layer of the diagram.',
        ],
        source: { label: 'Spark cluster architecture', url: `${SPARK}/latest/cluster-overview.html` },
      },
      {
        title: 'Lazy plans still require analysis and communication',
        body: [
          'Operations such as select, filter and limit build a DataFrame plan, while show and collect execute work to return results. Spark Connect sends unresolved plans from the client to a remote server, where analysis resolves columns and types before execution. Python code and distributed processing are therefore different layers.',
          'Lazy evaluation does not mean that no communication or analysis has happened. Requesting a schema or calling explain() can contact the server and analyze a plan without materializing the entire result. Distinguish building a plan, inspecting it and asking the engine to produce rows when explaining what a cell does.',
        ],
        source: { label: 'Spark Connect versus classic Spark', url: `${DOCS}/spark/connect-vs-classic` },
      },
      {
        title: 'Narrow operations, wide operations and shuffle cost',
        body: [
          'A projection or filter normally works within existing partitions without redistributing their records. Aggregation or repartitioning can require a shuffle: records move across partitions so related keys can be processed together. Serialization, network transfer and disk activity add costs, and the shuffle separates stages.',
          'Do not turn that distinction into a rule that every join shuffles. Broadcast strategies can avoid redistributing both inputs, and adaptive query execution can change a join strategy using runtime statistics. Read the chosen plan and performance evidence instead of diagnosing a query from its method names alone.',
        ],
        source: { label: 'Adaptive query execution and join strategies', url: `${DOCS}/optimizations/aqe` },
      },
      {
        title: 'Read Catalyst plans with the right explain mode',
        body: [
          'explain("extended") presents Parsed, Analyzed and Optimized Logical Plan sections followed by a Physical Plan. Compare the stages to understand how a declarative transformation becomes an executable strategy. The physical plan is the execution proposal, not a measurement of elapsed time.',
          'The simple mode shows the physical plan; formatted separates its outline and node details. The cost mode exposes available statistics, while codegen shows generated code when it exists. These inspection APIs support Spark Connect, so you can examine a serverless DataFrame without accessing low-level execution APIs.',
        ],
        source: { label: 'DataFrame.explain reference', url: `${SPARK}/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.explain.html` },
      },
      {
        title: 'AQE: execution can revise the initial plan',
        body: [
          'Adaptive query execution is enabled by default and uses runtime statistics to adjust execution choices. It can change join strategies, coalesce post-shuffle partitions and handle skew. The initial plan is therefore not necessarily the final plan used to complete a query.',
          'A large group of records sharing a key can make work uneven even when many partitions exist. Explain the intended grouping first, then inspect the completed query rather than assuming more partitions always solve the problem. AQE adapts execution; it does not change the business meaning of your aggregation.',
        ],
        source: { label: 'Adaptive query execution', url: `${DOCS}/optimizations/aqe` },
      },
      {
        title: 'Photon accelerates compatible operations, not arbitrary Python',
        body: [
          'Photon is enabled on serverless compute. Catalyst still plans the query, while Photon executes compatible operations in C++ over columnar batches. Treat optimization and execution as complementary roles rather than describing Photon as a replacement for the query planner.',
          'Photon does not execute Python UDFs. Incompatible operations fall back to the Spark runtime, so the presence of Photon does not imply that every part of a notebook uses the same execution engine. Prefer built-in expressions where they express the required logic; actual performance still depends on the workload.',
        ],
        source: { label: 'Photon execution engine', url: `${DOCS}/compute/photon` },
      },
      {
        title: 'Readers, writers and explicit destinations',
        body: [
          'The reader pattern is spark.read.format(...).option(...).schema(...).load(...). CSV options such as header and sep describe the input; JSON and Parquet have their own format behavior. An explicit schema makes your expected types clear rather than leaving that decision implicit.',
          'Writers use format, mode and save or saveAsTable. The modes error/errorifexists, append, overwrite and ignore express what to do when output exists; generic file-writing behavior is not a description of Delta transactions. The lab writes a Delta table in your own catalog, never into the samples source catalog.',
        ],
        source: { label: 'Spark data source loading and saving', url: `${SPARK}/3.5.6/sql-data-sources-load-save-functions.html` },
      },
      {
        title: 'Built-ins, scalar Python UDFs and pandas UDFs',
        body: [
          'Prefer native expressions such as when and round when they express the transformation: the optimizer can see their structure. Python UDF logic is opaque to that optimizer. A scalar Python UDF is not universally equivalent to row-by-row serialization; its implementation and applicable optimizations matter.',
          'pandas UDFs use Arrow and vectorized pandas processing, which does not make their Python logic visible to Catalyst or executable by Photon. Both UDF families are available on serverless subject to restrictions; neither is an automatic performance improvement over an equivalent built-in expression.',
        ],
        source: { label: 'Python UDFs', url: `${DOCS}/udf/python` },
      },
      {
        title: 'Windows: define the group, order and frame separately',
        body: [
          'A window keeps one output row for each input row and computes over related rows. Window.partitionBy defines logical groups, orderBy defines order, and the frame determines which rows participate for each current row. That logical partition is not physical file partitioning in storage.',
          'ROWS describes row positions; RANGE describes a range in the ordering values. Choose the frame deliberately for running totals, lag and ranking. In the lab, aggregate to one row per pickup zone and day before applying a ROWS running sum: this removes date ties within each zone and makes the intended daily grain explicit.',
        ],
        source: { label: 'Spark SQL window functions', url: `${SPARK}/3.5.6/sql-ref-syntax-qry-select-window.html` },
      },
      {
        title: 'Serverless boundaries and conditional DataFrame caching',
        body: [
          'Serverless uses Spark Connect: RDDs, SparkContext and Spark UI are not available. Use Unity Catalog tables or volumes rather than DBFS mounts, and inspect completed work through the query profile. Only supported configurations can be changed; the serverless configuration reference includes time zone and spark.sql.shuffle.partitions, whose default is auto.',
          'Do not assume all caching is unsupported. With the DataFrame cache preview enabled and environment version 5 or later, cache, persist and unpersist are available. Caching is eager and creates a private snapshot; persist ignores the storage level, and unpersist invalidates derived DataFrames. SQL CACHE TABLE and catalog cache APIs remain unsupported. This optional preview is not required by the lab.',
        ],
        source: { label: 'Serverless DataFrame cache preview', url: `${DOCS}/compute/serverless/dataframe-cache` },
      },
    ],
    diagram: {
      title: 'From a Connect client plan to managed execution',
      caption: 'Conceptual boundaries, not a cluster configuration guide: the Python notebook client sends plans to a remote service. Serverless manages the resources; the client process is not the driver.',
      layers: [
        { label: 'Client code', nodes: ['Python notebook process', 'DataFrame API and unresolved plans'] },
        { label: 'Remote server', nodes: ['Driver and Catalyst', 'AQE', 'Managed resource allocation'] },
        { label: 'Execution', nodes: ['Stages and tasks', 'Executors and partitions', 'Photon or Spark runtime fallback'] },
        { label: 'Storage', nodes: ['Unity Catalog source table', 'Target Delta table', 'CSV / JSON / Parquet in a volume'] },
      ],
    },
    comparison: {
      title: 'Choose an expression before choosing a UDF: speed depends on the workload',
      headers: ['Aspect', 'Built-in expression', 'Scalar Python UDF', 'pandas UDF'],
      rows: [
        ['Example', 'F.when, F.round', 'F.udf', 'F.pandas_udf'],
        ['Execution', 'Engine expression', 'Python function', 'pandas / Arrow batches'],
        ['Optimization', 'Expression visible to the optimizer', 'Opaque Python logic', 'Opaque Python logic'],
        ['Photon', 'Compatible operations', 'Not executed by Photon', 'Not executed by Photon'],
        ['Serverless', 'Supported', 'Supported with restrictions', 'Supported with restrictions'],
      ],
      sources: [
        { label: 'Python UDFs', url: `${DOCS}/udf/python` },
        { label: 'pandas UDFs', url: `${DOCS}/udf/pandas` },
        { label: 'Photon', url: `${DOCS}/compute/photon` },
        { label: 'Serverless limitations', url: `${DOCS}/compute/serverless/limitations` },
      ],
    },
    lab: {
      title: 'Daily taxi revenue and running totals in Free Edition',
      goal: 'Build and inspect a Spark Connect DataFrame pipeline, aggregate fares by pickup zone and day, compute a running total and save a Delta table in your own catalog.',
      minutes: 65,
      requirements: [
        'Databricks Free Edition with a Python notebook attached to Serverless and read access to samples.nyctaxi.trips.',
        'A catalog and default schema where you have permission to create a table; replace <your_catalog> only after inspecting current_catalog().',
        'The APIs and UI paths were verified in official documentation; this lab was not executed in a real workspace. Sample contents and plan details can vary.',
      ],
      steps: [
        {
          title: 'Select the language and find your catalog',
          body: 'In a notebook attached to Serverless, choose Python from the language control and execute with Shift+Enter. Inspect the current catalog before any write. If it is samples or you cannot write there, select a catalog of your own with write permission; do not assume a fixed catalog name.',
          code: { language: 'python', code: 'from pyspark.sql import functions as F, Window\nspark.sql("SELECT current_catalog(), current_schema()").show()' },
          check: 'You have recorded a writable catalog to substitute for <your_catalog>, and the notebook uses Python on Serverless.',
          screen: { id: 's03-cell', highlight: ['python'] },
        },
        {
          title: 'Read the source without modifying it',
          body: 'Read the sample table through the DataFrame API and inspect its schema and a small preview. Schema inspection can contact the remote server for analysis; it is not proof that the entire table was materialized. The source remains read-only throughout this exercise.',
          code: { language: 'python', code: 'trips = spark.read.table("samples.nyctaxi.trips")\ntrips.printSchema()\ndisplay(trips.select("pickup_zip", "tpep_pickup_datetime", "trip_distance", "fare_amount").limit(10))' },
          check: 'The preview contains the selected columns; you have not written anything to samples.',
          screen: { id: 's03-results', highlight: ['table'] },
        },
        {
          title: 'Express cleaning with native functions',
          body: 'Select the columns you need, keep positive fares and distances, and derive a date from the pickup timestamp. These transformations describe a plan; do not confuse that with a guarantee that no metadata or analysis requests occur.',
          code: { language: 'python', code: 'clean = (trips\n    .select("pickup_zip", "tpep_pickup_datetime", "trip_distance", "fare_amount")\n    .filter((F.col("fare_amount") > 0) & (F.col("trip_distance") > 0))\n    .withColumn("day", F.to_date("tpep_pickup_datetime")))' },
          check: 'You can explain why the filter and date expression do not require a custom Python UDF.',
        },
        {
          title: 'Aggregate at a clearly defined grain',
          body: 'Group by pickup zone and day, then compute trip counts and total fares. This is the daily grain used by the following window, not a total repeated on every original trip. The grouping can introduce redistribution across partitions.',
          code: { language: 'python', code: 'daily = (clean.groupBy("pickup_zip", "day")\n    .agg(F.count("*").alias("trips"),\n         F.sum("fare_amount").alias("revenue")))' },
          check: 'Each output group represents one pickup zone and day, with a trip count and total fare.',
        },
        {
          title: 'Add the running revenue window',
          body: 'Partition the window logically by pickup zone, order by day and use a frame from the first row through the current row. Pre-aggregation removes date ties within each zone. This window does not repartition files in storage.',
          code: { language: 'python', code: 'w = (Window.partitionBy("pickup_zip").orderBy("day")\n    .rowsBetween(Window.unboundedPreceding, Window.currentRow))\nresult = daily.withColumn("running_revenue", F.sum("revenue").over(w))' },
          check: 'The window adds a running value without collapsing the rows of daily.',
        },
        {
          title: 'Compare plan views before displaying the output',
          body: 'Request extended and formatted explanations. Find the logical and physical sections and inspect any redistribution in the plan. This triggers communication and analysis, not materialization of the complete result; AQE can still revise execution choices later.',
          code: { language: 'python', code: 'result.explain("extended")\nresult.explain("formatted")' },
          check: 'You can distinguish the analyzed logical plan from the physical plan and explain why the initial plan may change.',
        },
        {
          title: 'Display, validate and inspect performance',
          body: 'Display the ordered result and inspect dates, positive counts, unique zone/day groups and running totals. After execution, open See performance, select the Spark statement and choose See query profile. Wait for completion to inspect the full profile; this is the serverless route, not Spark UI.',
          code: { language: 'python', code: 'display(result.orderBy("pickup_zip", "day"))\ndisplay(result.filter(F.col("day").isNull() | (F.col("trips") <= 0)))\ndisplay(result.groupBy("pickup_zip", "day").count().filter(F.col("count") > 1))' },
          check: 'There are no duplicate zone/day groups or nonpositive counts. Investigate any null dates before saving, and compare running totals within a zone rather than expecting fixed sample totals.',
          screen: { id: 's03-performance', highlight: ['performance', 'queryProfile'] },
        },
        {
          title: 'Create a chart from a small daily aggregate',
          body: 'Display a small aggregate of revenue by day. In the result use + then Visualization. In the editor choose Visualization Type, map day and revenue to the chart and choose Save. You can use + then Data Profile separately to explore the result, without confusing profiling with a chart.',
          code: { language: 'python', code: 'chart_daily = (daily.groupBy("day").agg(F.sum("revenue").alias("revenue"))\n    .orderBy("day").limit(30))\ndisplay(chart_daily)' },
          check: 'Your saved chart uses a daily aggregate, not a plot of every original trip.',
          screen: { id: 's03-results', highlight: ['add', 'visualization', 'dataProfile'] },
        },
        {
          title: 'Confirm the visualization controls',
          body: 'Review the chart editor before leaving it: Visualization Type changes the chart type and Save keeps the visualization. The simplified illustration shows only documented controls, not every field or the exact current workspace layout.',
          check: 'You can locate the type selector and save control and describe which daily measure you plotted.',
          screen: { id: 's03-chart', highlight: ['chartType', 'save'] },
        },
        {
          title: 'Save only to your own catalog and read back',
          body: 'Replace <your_catalog> with the writable catalog recorded in step 1. This overwrites only your exercise destination table if it already exists: use a new destination name if you need to keep an earlier result. Read the saved Delta table back and inspect it without assuming a fixed sample row count.',
          code: { language: 'python', code: 'target = "<your_catalog>.default.s03_daily_trips"\n(result.write.format("delta").mode("overwrite").saveAsTable(target))\nsaved = spark.read.table(target)\ndisplay(saved.orderBy("pickup_zip", "day"))' },
          check: 'The destination is in your writable catalog, not samples, and the saved table has daily revenue and running_revenue.',
        },
      ],
      wrapUp: 'You separated client planning from remote execution, compared plan views, computed daily and running revenue, inspected the serverless profile and saved only to an owned destination. Keep the source unchanged and treat performance observations as workload-specific evidence.',
      sources: [
        { label: 'Connect versus classic', url: `${DOCS}/spark/connect-vs-classic` },
        { label: 'Window functions', url: `${SPARK}/3.5.6/sql-ref-syntax-qry-select-window.html` },
        { label: 'DataFrame.explain', url: `${SPARK}/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.explain.html` },
        { label: 'Exploratory analysis in notebooks', url: `${DOCS}/notebooks/eda-tutorial` },
        { label: 'Visualizations', url: `${DOCS}/visualizations` },
        { label: 'Serverless notebooks and query profile', url: `${DOCS}/compute/serverless/notebooks` },
        { label: 'Notebook code and language', url: `${DOCS}/notebooks/notebooks-code` },
        { label: 'Running notebook cells', url: `${DOCS}/notebooks/run-notebook` },
        { label: 'Load and save functions', url: `${SPARK}/3.5.6/sql-data-sources-load-save-functions.html` },
        { label: 'Serverless limitations', url: `${DOCS}/compute/serverless/limitations` },
        { label: 'Serverless configuration', url: `${DOCS}/spark/conf#serverless` },
      ],
    },
    certification: {
      intro: 'Original practice questions aligned with the official guides. They are not real exam questions.',
      exams: [
        { name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Transformation and Modeling', 'Databricks Intelligence Platform', 'Troubleshooting, Monitoring, and Optimization'] },
      ],
      questions: [
        {
          domain: 'Databricks Intelligence Platform',
          question: 'A Python notebook uses Spark Connect on serverless. Which description respects the client/server boundary?',
          options: ['The notebook Python process is always the remote driver', 'The client sends unresolved plans for server-side analysis', 'Every executor runs inside the browser', 'The client manually allocates executors in Free Edition'],
          answer: 1,
          explanation: 'Spark Connect separates the client from the server: remote analysis resolves plans, while managed execution processes the data.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'Which operation asks Spark to return result rows rather than only extending a DataFrame transformation plan?',
          options: ['select', 'filter', 'limit', 'show'],
          answer: 3,
          explanation: 'show is an action that executes work to return rows; select, filter and limit describe transformations.',
        },
        {
          domain: 'Troubleshooting, Monitoring, and Optimization',
          question: 'You need logical plan stages as well as the physical plan. Which call is the best fit?',
          options: ['df.explain("extended")', 'df.explain("simple")', 'df.select("day")', 'df.write.mode("append")'],
          answer: 0,
          explanation: 'The extended mode includes parsed, analyzed and optimized logical sections as well as the physical plan.',
        },
        {
          domain: 'Troubleshooting, Monitoring, and Optimization',
          question: 'Which statement about a join and shuffle is justified?',
          options: ['Every join must shuffle both inputs', 'A shuffle has no network cost', 'A broadcast strategy can avoid redistributing both inputs', 'AQE guarantees that all joins become broadcasts'],
          answer: 2,
          explanation: 'Join strategies differ, and broadcast is a counterexample to the claim that every join redistributes both inputs.',
        },
        {
          domain: 'Troubleshooting, Monitoring, and Optimization',
          question: 'An initial plan differs from the completed execution strategy. Which explanation is consistent with AQE?',
          options: ['The business aggregation must have changed', 'Runtime statistics allowed an adaptive strategy change', 'The Python client became an executor', 'A window silently removed all input rows'],
          answer: 1,
          explanation: 'AQE uses runtime statistics to adapt strategies, including joins and post-shuffle partition coalescing.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'A built-in expression and a Python UDF implement the same required transformation. Why prefer the built-in first?',
          options: ['It always avoids reading storage', 'It disables Catalyst', 'All Python UDFs are forbidden on serverless', 'Its expression is visible to the optimizer'],
          answer: 3,
          explanation: 'The optimizer can inspect native expression structure; arbitrary Python UDF logic remains opaque to it.',
        },
        {
          domain: 'Databricks Intelligence Platform',
          question: 'Which execution statement correctly describes Photon on serverless?',
          options: ['It executes compatible columnar operations and falls back for incompatible work', 'It executes every Python UDF in C++', 'It replaces Catalyst planning entirely', 'It requires manually managed classic compute in Free Edition'],
          answer: 0,
          explanation: 'Photon accelerates compatible operations, while Catalyst still plans and incompatible operations use the Spark runtime.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'Why aggregate taxi trips by zone and day before a ROWS running revenue window ordered by day?',
          options: ['To turn the window into physical file partitioning', 'To guarantee a fixed number of sample trips', 'To define one row per zone/day and remove date ties inside each zone', 'To prevent any possible shuffle'],
          answer: 2,
          explanation: 'Daily pre-aggregation establishes the intended grain and removes same-day ties before the running sum is computed.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'A lab must preserve samples.nyctaxi.trips and save an exercise result. Which destination policy is appropriate?',
          options: ['Overwrite the source table', 'Discover the current catalog and use an owned writable destination', 'Append computed rows into samples', 'Assume every workspace uses the same writable catalog name'],
          answer: 1,
          explanation: 'Inspect the catalog context and use a destination where you have write permission; the sample source remains unchanged.',
        },
        {
          domain: 'Troubleshooting, Monitoring, and Optimization',
          question: 'The guide mentions stage-level Spark UI metrics, but your practice environment is Free Edition serverless. What should you do?',
          options: ['Use sparkContext to open Spark UI', 'Treat explain output as elapsed-time measurements', 'Assume completed queries cannot be inspected', 'Learn Spark UI concepts and practice with the completed query profile'],
          answer: 3,
          explanation: 'The exam scope can exceed Free Edition: Spark UI is conceptual here, and the query profile is the serverless practice route.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's03-results', answer: 'visualization',
          question: 'You opened + in a displayed DataFrame result. Where do you click to create a chart?',
          explanation: 'Choose Visualization from the + menu; Data Profile is a separate exploratory analysis feature.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's03-results', answer: 'dataProfile',
          question: 'The + menu is open and you want a data profile rather than a chart. Which option do you choose?',
          explanation: 'Data Profile is the documented result-menu option for profiling; Visualization starts a chart instead.',
        },
        {
          type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's03-performance', answer: 'performance',
          question: 'A serverless cell finished running. Which control starts the documented path to performance details?',
          explanation: 'Start with See performance, then select the relevant Spark statement before opening its query profile.',
        },
        {
          type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's03-performance', answer: 'queryProfile',
          question: 'You already opened performance details and selected a completed Spark statement. Where do you go next?',
          explanation: 'See query profile opens the statement profile; the full profile is available after execution finishes.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's03-chart', answer: 'chartType',
          question: 'In the visualization editor, which control chooses the kind of chart?',
          explanation: 'Visualization Type selects the chart type; Save preserves the visualization after configuration.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's03-chart', answer: 'save',
          question: 'You finished configuring the chart. Which control keeps the visualization?',
          explanation: 'Save preserves the visualization; the type selector changes the chart rather than saving it.',
        },
      ],
    },
  };
})(globalThis);
