// Original learning content; sources and verified UI paths supplied by the parent.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const DOC = 'https://docs.databricks.com/aws/en/';
  const tutorial = { label: 'Create an AI/BI dashboard', url: DOC + 'dashboards/tutorials/create-dashboard' };
  const desktop = { label: 'Power BI Desktop connector', url: DOC + 'partners/bi/power-bi/desktop' };
  const service = { label: 'Power BI service integration requirements', url: DOC + 'partners/bi/power-bi/service' };
  const free = { label: 'Free Edition limitations', url: DOC + 'getting-started/free-edition-limitations' };
  const gold = { label: 'Medallion architecture: gold for analytics', url: DOC + 'lakehouse/medallion' };
  const sql = { label: 'Temporary views', url: DOC + 'sql/language-manual/sql-ref-syntax-ddl-create-view' };
  const pl300 = { label: 'Optional PL-300 study guide', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-300' };
  const guide = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';
  DataLab.deep.en.s13 = {
    deepDive: [
      { title: 'Gold is a contract for business meaning', body: ['Gold datasets serve business-facing analytics. Define the grain before the chart: one row per order is not one row per order line. Revenue is additive here, but a mean of regional averages is not generally the global average. Publish metric definitions alongside the data and validate totals before adding filters.'], source: gold },
      { title: 'Separate data, SQL compute and presentation', body: ['The conceptual path is a governed gold dataset → SQL warehouse → AI/BI dashboard, or a Power BI semantic model and report. The warehouse executes SQL; it is neither a stored semantic model nor a chart. A dataset query defines the rows and columns a visualization can use, so reducing the grain can remove dimensions needed for later filtering.'], source: tutorial },
      { title: 'AI/BI draft: query first, visualization second', body: ['The documented path is New → Dashboard, then Data → Add SQL dataset → Run. Validate the result before configuring a visualization and its filters. The optional draft exercise uses a self-contained VALUES query: a temporary view from a notebook is session-scoped and must not be assumed visible from the dashboard SQL session.'], source: tutorial },
      { title: 'Import and DirectQuery have different freshness boundaries', body: ['Import copies data into a Power BI model: the imported snapshot changes when it refreshes. DirectQuery issues source queries instead of importing the whole dataset, but caches, refresh behavior, permissions and source availability still affect what users see. It is not an unconditional always-current guarantee; consider warehouse latency, concurrency and query cost as well as model design.'], source: desktop },
      { title: 'Desktop connection is not service integration', body: ['The generic Desktop workflow is Get data → Databricks → Connect, with Server Hostname and HTTP Path, followed by the connection mode and supported authentication. Free Edition connectivity to Power BI is UNVERIFIED by the supplied sources: do not promise it or infer a blanket prohibition. This lab requests no installation, login, credentials or real connection.'], source: desktop },
      { title: 'Service requirements belong to that integration', body: ['The documented Databricks integration with the Power BI service has Unity Catalog, capacity and XMLA requirements. Evaluate those for that integration, not as universal prerequisites for every Desktop workflow. A working Desktop report does not by itself prove that service publishing, refresh or sharing has been configured.'], source: service },
      { title: 'Publishing changes the permission question', body: ['The Publish flow includes Share with data permissions. Sharing with the publisher\'s data permissions differs from requiring viewers to use their own underlying data permissions; review the audience and effective access before publishing. A visual filter is not a security boundary, and permission to view a dashboard is not a universal grant to all underlying tables.'], source: tutorial },
      { title: 'Free Edition is the SQL practice boundary', body: ['Free Edition has serverless quotas and warehouse restrictions; availability can limit when you run the exercise. Use four synthetic orders and temporary views in a fresh SQL session, without persistent tables, provisioned resources or publication. The original enterprise mocks only illustrate controls and precomputed values: they never execute SQL, connect to Power BI or enforce access.'], source: free },
    ],
    diagram: {
      title: 'One metric contract, two BI routes',
      caption: 'Conceptual architecture based on the gold, dashboard and Power BI sources. The lab uses synthetic temporary data; external connectivity and publication are not demonstrated.',
      layers: [
        { label: 'Gold contract', nodes: ['One row per order', 'Revenue and order-count definitions'] },
        { label: 'SQL warehouse', nodes: ['Dataset SQL and aggregation', 'Permissions, quotas and query cost'] },
        { label: 'Presentation route', nodes: ['AI/BI dataset → visualization → filter', 'Power BI semantic model → report; Import or DirectQuery'] },
        { label: 'Audience boundary', nodes: ['Publisher versus viewer data permissions', 'Freshness and filter context must be verified'] },
      ],
    },
    comparison: {
      title: 'Compare consumption choices without promising live data',
      headers: ['Choice', 'Data execution', 'Freshness boundary', 'Access and cost consideration'],
      rows: [
        ['AI/BI dashboard', 'Dataset SQL on a warehouse', 'Verify dataset and dashboard refresh behavior', 'Review publisher/viewer permissions and warehouse use'],
        ['Power BI Import', 'Load a snapshot into the model', 'Refresh updates the imported snapshot', 'Review refresh identity and model sharing; warehouse used at refresh'],
        ['Power BI DirectQuery', 'Model sends queries to the source', 'Source queries plus cache and refresh behavior', 'Review authentication, latency and source query cost'],
        ['Power BI service integration', 'Distinct integration with documented prerequisites', 'Verify its configured refresh lifecycle', 'Unity Catalog, capacity and XMLA requirements are integration-specific'],
      ],
      sources: [tutorial, desktop, service, free],
    },
    lab: {
      title: 'Validate a tiny BI contract safely in Free Edition',
      goal: 'Compute revenue, orders and average order value from four synthetic rows, reconcile a regional filter with an original report mock, and study connection and publishing decisions without performing them.',
      minutes: 45,
      requirements: [
        'A fresh SQL notebook/session on available Free Edition serverless compute. Use the same session for the s13_orders temporary view; quotas may require waiting.',
        'No Power BI installation, login, credentials, Azure subscription, provisioning or publication required. All mock clicks are illustrative, not external operations.',
        'Use only the synthetic rows below. Do not modify production data or permissions; no persistent object or destructive cleanup is needed.',
      ],
      steps: [
        { title: 'Identify the dashboard entry without creating one', body: 'Study New → Dashboard in the original mock. The required lab runs SQL in your existing notebook/session, not in a newly provisioned dashboard. The draft route is optional later.', check: 'You identify Dashboard and keep the required SQL exercise separate from optional UI work.', screen: { id: 's13-new', highlight: ['new', 'dashboard'] } },
        { title: 'Create four temporary synthetic orders', body: 'Run this only in a fresh session reserved for this exercise. Each row is exactly one order; amount is DECIMAL so the expected currency arithmetic is explicit. The temporary view does not persist a table.', code: { language: 'sql', code: `CREATE OR REPLACE TEMP VIEW s13_orders AS
SELECT order_id, region, CAST(amount AS DECIMAL(10,2)) AS amount
FROM VALUES (1, 'North', 10), (2, 'North', 20),
            (3, 'South', 15), (4, 'South', 5)
AS v(order_id, region, amount);
SELECT * FROM s13_orders ORDER BY order_id;` }, check: 'Exactly (1,North,10.00), (2,North,20.00), (3,South,15.00), (4,South,5.00). No real orders were read.' },
        { title: 'Reconcile the three KPIs', body: 'Count orders at the declared one-row-per-order grain. This COUNT(*) would not remain an order count after joining multiple lines per order. Cast the displayed average to two decimals without changing the underlying definition.', code: { language: 'sql', code: `SELECT SUM(amount) AS revenue, COUNT(*) AS orders,
       CAST(AVG(amount) AS DECIMAL(10,2)) AS avg_order_value
FROM s13_orders;` }, check: 'revenue = 50.00; orders = 4; avg_order_value = 12.50.' },
        { title: 'Compute regional bars and a North filter', body: 'Use the same order data for regional totals and for the North filter. Check both count and revenue: a correct-looking total alone would not catch every grain mistake. These queries are read-only over the temporary view.', code: { language: 'sql', code: `SELECT region, COUNT(*) AS orders, SUM(amount) AS revenue
FROM s13_orders GROUP BY region ORDER BY region;
SELECT COUNT(*) AS orders, SUM(amount) AS revenue,
       CAST(AVG(amount) AS DECIMAL(10,2)) AS avg_order_value
FROM s13_orders WHERE region = 'North';` }, check: 'North: 2 orders / 30.00; South: 2 / 20.00. North filter: orders 2, revenue 30.00, average 15.00; regional revenues sum to 50.00.' },
        { title: 'Compare the report mock with SQL', body: 'Inspect the exact same four rows in the report mock and compare All, North and South precomputed outputs with your SQL. Selecting a target does not apply a real filter or query a warehouse; it only identifies a labeled region of this original illustration.', check: 'All = 4 / 50.00 / 12.50; North = 2 / 30.00 / 15.00; South = 2 / 20.00 / 10.00. No dates or customer counts can be inferred from these rows.', screen: { id: 's13-report', highlight: ['rows', 'all', 'north', 'south'] } },
        { title: 'Optional: run a self-contained query in an existing draft', body: 'Only if you already have an authorized AI/BI dashboard draft and available warehouse, use Data → Add SQL dataset → Run with the query below. Do not rely on the notebook temporary view crossing sessions. Optionally configure a regional revenue bar visualization in that draft; skip if unavailable. No Publish is required.', code: { language: 'sql', code: `SELECT region, SUM(CAST(amount AS DECIMAL(10,2))) AS revenue,
       COUNT(*) AS orders
FROM VALUES (1, 'North', 10), (2, 'North', 20),
            (3, 'South', 15), (4, 'South', 5)
AS v(order_id, region, amount)
GROUP BY region ORDER BY region;` }, check: 'If run: North 30.00 / 2, South 20.00 / 2; use region as category and revenue as value. Otherwise record skipped. Do not publish or create persistent source data.', screen: { id: 's13-data', highlight: ['data', 'addSql', 'run'] } },
        { title: 'Study Desktop options without connecting', body: 'In the illustrative enterprise mock, trace Get data → Databricks → Connect and identify Server Hostname, HTTP Path, Import and DirectQuery. Do not enter real details or credentials. Free Edition connectivity remains UNVERIFIED; this step neither installs Power BI nor attempts authentication.', check: 'You explain Import snapshot refresh versus source queries with cache/freshness caveats in DirectQuery, without claiming a completed connection.', screen: { id: 's13-powerbi', highlight: ['getData', 'databricks', 'connect', 'hostname', 'httpPath', 'import', 'directQuery'] } },
        { title: 'Review permissions; do not publish', body: 'Inspect Publish → Share with data permissions only in the mock. Explain how using publisher data permissions differs from viewer-specific data access. A North visual filter is not an authorization policy. Leave every real sharing and permission setting unchanged.', check: 'No dashboard was published, no permission changed and no credential supplied. End the exercise; the temporary view is session-scoped, with no destructive cleanup required.', screen: { id: 's13-share', highlight: ['publish', 'shareData'] } },
      ],
      wrapUp: 'Four orders yield revenue 50.00 and average 12.50; North contributes 30.00 from two orders, South 20.00 from two. You reconciled a filter without inventing dates or customers, separated dataset grain from visualization, and distinguished illustrative connection/sharing controls from external operations.',
      sources: [gold, tutorial, desktop, service, free, sql],
    },
    certification: {
      intro: 'Original practice, not real exam items. Data Engineer Associate anchors gold-data delivery for BI. PL-300 is optional enrichment for semantic modeling and visualization, not a credential promised by the brochure. Use the sources above to review explanations.',
      exams: [
        { name: 'Databricks Certified Data Engineer Associate', url: guide, domains: ['Data Transformation and Modeling'] },
        { name: 'Optional enrichment: Microsoft PL-300', url: pl300.url, domains: ['Model the data', 'Visualize and analyze the data'] },
      ],
      questions: [
        { domain: 'Data Transformation and Modeling', question: 'Which grain makes COUNT(*) the order count in this lab?', options: ['One row per order line', 'One row per order', 'One row per region', 'One row per dashboard'], answer: 1, explanation: 'There are four unique order rows. A line-level dataset could multiply the rows and inflate COUNT(*).' },
        { domain: 'Data Transformation and Modeling', question: 'What are revenue, orders and average for the four rows?', options: ['50.00 / 2 / 25.00', '30.00 / 4 / 7.50', '50.00 / 4 / 12.50', '20.00 / 2 / 10.00'], answer: 2, explanation: '10 + 20 + 15 + 5 = 50.00; four orders give 50 / 4 = 12.50 average order value.' },
        { domain: 'Visualize and analyze the data', question: 'What should the North filter return?', options: ['2 orders and revenue 30.00', '4 orders and revenue 50.00', '2 orders and revenue 20.00', '1 order and revenue 10.00'], answer: 0, explanation: 'Only orders 1 and 2 are North: two rows, revenue 10 + 20 = 30.00 and average 15.00.' },
        { domain: 'Model the data', question: 'The source changes after an Import refresh. What does the imported model normally contain until another refresh?', options: ['Every source change automatically', 'No rows', 'Only rows for North', 'The imported snapshot'], answer: 3, explanation: 'Import stores a snapshot in the model. Its refresh lifecycle must be configured and checked separately.' },
        { domain: 'Model the data', question: 'Which is a careful statement about DirectQuery?', options: ['It always shows all latest changes instantly', 'It queries the source, but cache, permissions and latency still matter', 'It removes warehouse query cost', 'It grants SELECT automatically'], answer: 1, explanation: 'DirectQuery uses source queries, not an unconditional freshness guarantee; caching and access still affect results.' },
        { domain: 'Data Transformation and Modeling', question: 'What executes SQL for the dashboard dataset?', options: ['The chart color palette', 'An HTTP path alone', 'A SQL warehouse', 'A Power BI license alone'], answer: 2, explanation: 'The warehouse supplies SQL compute; a chart or a connection identifier is not an execution engine.' },
        { domain: 'Model the data', question: 'What can this lab assert about Power BI connectivity from Free Edition?', options: ['It is unverified by the supplied sources; no real connection is required', 'It is guaranteed for all accounts', 'It is categorically impossible in every workflow', 'Clicking the mock authenticates you'], answer: 0, explanation: 'Generic connector documentation does not verify this specific Free Edition workflow or justify a blanket ban.' },
        { domain: 'Model the data', question: 'How should Unity Catalog, capacity and XMLA requirements be interpreted here?', options: ['As requirements for running VALUES SQL', 'As universal prerequisites for every Desktop file', 'As permissions granted by a report filter', 'As requirements of the documented service integration'], answer: 3, explanation: 'Service integration has a distinct scope. Do not transfer its prerequisites to every Desktop workflow.' },
        { domain: 'Visualize and analyze the data', question: 'A published dashboard uses publisher data permissions. What must be reviewed?', options: ['Only the chart title', 'The audience and effective data access, not just viewer table grants', 'Only the filter color', 'Nothing: filters enforce security'], answer: 1, explanation: 'Sharing data permissions changes whose access is used. A visual filter does not substitute for authorization.' },
        { domain: 'Data Transformation and Modeling', question: 'Why does the optional dashboard query repeat VALUES?', options: ['To persist a second gold table', 'To bypass Unity Catalog', 'A notebook temporary view is not guaranteed visible in another SQL session', 'To provision Power BI capacity'], answer: 2, explanation: 'Temporary views are session-scoped. A self-contained synthetic dataset avoids cross-session assumptions.' },
        { type: 'hotspot', domain: 'Visualize and analyze the data', screen: 's13-new', answer: 'dashboard', question: 'In the simplified New menu, which item starts the documented dashboard path?', explanation: 'New → Dashboard is the documented entry. The mock identifies a path without creating any resource.' },
        { type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's13-data', answer: 'run', question: 'After Data → Add SQL dataset, which control executes dataset SQL in an authorized real draft?', explanation: 'Run executes the dataset query in the documented workflow. Here the mock does not execute SQL.' },
        { type: 'hotspot', domain: 'Model the data', screen: 's13-powerbi', answer: 'httpPath', question: 'Which field complements Server Hostname in this illustrative Desktop connection dialog?', explanation: 'HTTP Path complements Server Hostname. Do not enter real details: Free Edition connectivity is unverified here.' },
        { type: 'hotspot', domain: 'Visualize and analyze the data', screen: 's13-share', answer: 'shareData', question: 'Which publishing control requires evaluating publisher versus viewer data access?', explanation: 'Share with data permissions changes the data-access decision. Inspect the illustration only; publication is not required.' },
      ],
    },
  };
})(globalThis);
