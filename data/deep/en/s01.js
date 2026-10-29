// Deep content for session 1 (English). Mirrors data/deep/es/s01.js.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};

  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const ARCH = `${MS}/getting-started/high-level-architecture`;
  const DOCS = 'https://docs.databricks.com/aws/en';

  DataLab.deep.en.s01 = {
    deepDive: [
      {
        title: 'Shared responsibility: what you own in each model',
        body: [
          'In IaaS the provider takes care of the hardware, the physical network and virtualization, while you manage the operating system, updates and applications of each virtual machine. In PaaS the provider also manages the operating system and the platform, so you focus on your code and your data. In SaaS you consume a finished application.',
          'Some responsibilities are never delegated, whatever the model: your data, your identities and accounts, the configuration and who can access what. So even though Databricks manages Spark for you, defining permissions and protecting data is still the job of the data team.',
        ],
        source: { label: 'Shared responsibility in the cloud (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility' },
      },
      {
        title: 'Tenant, subscription and resource group',
        body: [
          'A Microsoft Entra tenant is the identity directory of your organization: users, groups and applications. Each Azure subscription trusts exactly one directory, while a single tenant can hold many subscriptions. The subscription is the unit of billing and of service limits.',
          'Inside a subscription, resource groups gather resources that share a lifecycle, such as everything that belongs to one project. A detail that often confuses people: the region of a resource group says where its metadata is stored, and the resources it contains can live in different regions.',
        ],
        source: { label: 'Azure Resource Manager (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview' },
      },
      {
        title: 'ADLS Gen2 is not another account type',
        body: [
          'Azure Data Lake Storage Gen2 is a set of analytics capabilities built on Azure Blob Storage. It is enabled through the hierarchical namespace of a storage account, which adds real directories and finer-grained access control, instead of being a separate service.',
          'The hierarchical namespace matters for analytics: renaming or deleting a directory is one operation on the directory, not on millions of individual objects. That is why it is the usual storage for lakehouses on Azure, accessed with abfss:// paths.',
        ],
        source: { label: 'Introduction to Data Lake Storage (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction' },
      },
      {
        title: 'What the control plane does',
        body: [
          'The control plane includes the backend services that Databricks manages and the web application you use in the browser. It lives in the Databricks account, not in your Azure subscription. From there, tasks such as scheduling jobs, managing the account and launching compute are coordinated.',
          'It is better not to overstate the rule that "data never goes through the control plane". The architecture separates business data, which is processed in the compute plane, from workspace assets and system data, such as cell results or logs, which are kept in workspace storage.',
        ],
        source: { label: 'Azure Databricks architecture', url: ARCH },
      },
      {
        title: 'Two compute planes: classic and serverless',
        body: [
          'In the classic compute plane, compute resources run in your Azure subscription, inside the virtual network of the workspace. That gives you control over the network and the configuration, but it also makes you responsible for those machines.',
          'In the serverless compute plane, compute runs in the Databricks account, in the same region as your workspace, isolated by network boundaries of its own for each workspace. Databricks provisions and scales it. A classic workspace can also use serverless: the workspace type alone does not decide the compute type.',
        ],
        source: { label: 'Azure Databricks architecture', url: ARCH },
      },
      {
        title: 'Where each thing is stored: workspace storage',
        body: [
          'Workspace storage holds two kinds of content. Workspace file system assets are notebooks, SQL queries and configuration files. Workspace system data includes, for example, cell results, revisions and logs.',
          'In a classic workspace, that storage is an Azure storage account inside a managed resource group created by Azure Databricks; legacy DBFS can also live there. The DBFS root and mounts are deprecated: today you use Unity Catalog and its volumes. In a serverless workspace, the default storage is managed by Databricks and can contain Unity Catalog assets, although you can also bring your own storage.',
        ],
        source: { label: 'Azure Databricks architecture, workspace storage', url: ARCH },
      },
      {
        title: 'Unity Catalog at a glance',
        body: [
          'The Databricks account groups workspaces and metastores. A metastore is regional and can be assigned to several workspaces in that region, so they share the same data catalog and the same permissions.',
          'Every data object is named with three levels: catalog.schema.object. That object can be a table, a view, a volume, a function or a model. Writing the full name avoids reading or writing in the wrong place, especially with one catalog per environment.',
        ],
        source: { label: 'Azure Databricks architecture, Unity Catalog', url: ARCH },
      },
      {
        title: 'A tour of the interface',
        body: [
          'The sidebar organizes the work: Workspace for notebooks and folders, Catalog to explore data and permissions, Jobs & Pipelines for orchestration, Compute for compute resources and SQL Editor for queries on a SQL warehouse. The AI section shows Playground, where you try models.',
          'The home page shows shortcuts and Ask Genie, which lets you ask questions in natural language. The New button is the starting point to create notebooks, queries and jobs, or to upload data.',
        ],
        source: { label: 'Navigate the workspace', url: `${DOCS}/workspace/navigate-workspace` },
      },
      {
        title: 'Free Edition: what it is and what it is not',
        body: [
          'Databricks Free Edition creates a workspace with serverless compute and default storage, without deploying resources into an Azure subscription. It includes sample data in the samples catalog, one SQL warehouse of size 2X-Small and daily usage quotas.',
          'It has no account console and no classic compute, so it does not replace an Azure workspace to practice networking, managed resource groups or integrations with other Azure services. For those parts of the course you will need an Azure subscription.',
        ],
        source: { label: 'Databricks Free Edition', url: `${DOCS}/getting-started/free-edition` },
      },
    ],
    diagram: {
      title: 'Azure Databricks architecture',
      caption: 'Conceptual view based on the official architecture. Business data is processed in the compute plane; the control plane coordinates, but it is not the normal path of the data.',
      layers: [
        { label: 'User', nodes: ['Browser', 'CLI and API'] },
        { label: 'Control plane', nodes: ['Web application', 'Managed services', 'Account management'] },
        { label: 'Compute plane', nodes: ['Classic: your Azure subscription and its virtual network', 'Serverless: Databricks account, same region'] },
        { label: 'Storage', nodes: ['Workspace storage', 'Unity Catalog tables and volumes', 'Your cloud storage'] },
      ],
    },
    comparison: {
      title: 'Classic compute versus serverless',
      headers: ['Aspect', 'Classic', 'Serverless'],
      rows: [
        ['Where it runs', 'In your Azure subscription', 'In the Databricks account, in the workspace region'],
        ['Network boundary', 'The virtual network of the workspace', 'Per-workspace network isolation managed by Databricks'],
        ['Who provisions the machines', 'Created in your subscription from the configuration or the policy', 'Databricks provisions and scales them'],
        ['Relationship to storage', 'Separate compute and storage', 'Separate compute and storage'],
        ['In Free Edition', 'Not available', 'The only compute type'],
      ],
      sources: [
        { label: 'Azure Databricks architecture', url: ARCH },
        { label: 'Free Edition limitations', url: `${DOCS}/getting-started/free-edition-limitations` },
      ],
    },
    lab: {
      title: 'Your workspace in Databricks Free Edition',
      goal: 'Create your free workspace, find its tools, query sample data, upload a file of your own to a volume and turn it into a table governed by Unity Catalog.',
      minutes: 60,
      requirements: [
        'An email address to sign up; no card or Azure subscription is needed.',
        'An up-to-date browser.',
        'Step 10 is optional and requires access to an Azure subscription.',
      ],
      steps: [
        {
          title: 'Create your Free Edition account',
          body: 'Open the Databricks sign-up page and choose the Free Edition option. When you finish, a workspace with serverless compute and default storage is created: nothing is deployed in Azure.',
          check: 'You see the workspace home page with the sidebar on the left.',
        },
        {
          title: 'Walk through the sidebar',
          body: 'Open the Workspace, Catalog, Jobs & Pipelines, Compute, SQL Editor and Playground sections one by one. On the home page, find Ask Genie. Do not configure anything yet: the goal is to know where each tool is.',
          check: 'You can explain in one sentence what each section is for.',
        },
        {
          title: 'Create a notebook and attach it to serverless',
          body: 'Click New and then Notebook. Change the language to SQL and, in the compute selector, choose Serverless. Run the cell to find out which catalog and schema you are working in.',
          code: { language: 'sql', code: 'SELECT current_catalog() AS catalog_name,\n       current_schema()  AS schema_name,\n       current_user()    AS user_name;' },
          check: 'You wrote down the name of your catalog: use it instead of <your_catalog> in the next steps.',
        },
        {
          title: 'Explore the sample data',
          body: 'In Catalog, open samples, then nyctaxi and the trips table. Review the columns and the preview. Then go back to the notebook and query the table with SQL.',
          code: { language: 'sql', code: 'SELECT COUNT(*) AS trips,\n       ROUND(AVG(trip_distance), 2) AS average_distance,\n       ROUND(AVG(fare_amount), 2)   AS average_fare\nFROM samples.nyctaxi.trips;' },
          check: 'The query returns one row with the number of trips and two averages.',
        },
        {
          title: 'Create a volume for your files',
          body: 'In Catalog, open your catalog, then the default schema, and use Create and then Volume. Choose a managed volume named raw. You can also create it from the notebook with SQL.',
          code: { language: 'sql', code: 'CREATE VOLUME IF NOT EXISTS <your_catalog>.default.raw\nCOMMENT \'Raw files for the course\';' },
          check: 'The raw volume appears inside the default schema in Catalog.',
        },
        {
          title: 'Upload a CSV of your own',
          body: 'On your computer, create a file named sales.csv with the content below. In the workspace use New, then Add or upload data and Upload files to a volume. Choose the file and, as the destination, the raw volume.',
          code: { language: 'text', code: 'date,product,quantity,price\n2026-01-05,Coffee,3,4.50\n2026-01-05,Tea,1,3.20\n2026-01-06,Coffee,2,4.50\n2026-01-06,Bread,5,1.10\n2026-01-07,Tea,4,3.20' },
          check: 'In Catalog, inside the raw volume, you see the file sales.csv.',
        },
        {
          title: 'Read the file with SQL',
          body: 'Go back to the notebook and read the CSV straight from the volume with read_files. Notice that Spark infers the column types from the content.',
          code: { language: 'sql', code: 'SELECT *\nFROM read_files(\n  \'/Volumes/<your_catalog>/default/raw/sales.csv\',\n  format => \'csv\',\n  header => true\n);' },
          check: 'You see five rows with the columns date, product, quantity and price.',
        },
        {
          title: 'Turn the file into a table',
          body: 'Create a Delta table governed by Unity Catalog from the file and compute the total of each sale. Then find it in Catalog and review its details and history tabs.',
          code: { language: 'sql', code: 'CREATE OR REPLACE TABLE <your_catalog>.default.sales AS\nSELECT CAST(date AS DATE) AS date,\n       product,\n       CAST(quantity AS INT) AS quantity,\n       CAST(price AS DECIMAL(10, 2)) AS price,\n       CAST(quantity AS INT) * CAST(price AS DECIMAL(10, 2)) AS total\nFROM read_files(\'/Volumes/<your_catalog>/default/raw/sales.csv\', format => \'csv\', header => true);' },
          check: 'The sales table appears in Catalog and its history shows version 0.',
        },
        {
          title: 'Query the table from the SQL Editor',
          body: 'Open SQL Editor, choose the available SQL warehouse and run an aggregation over your table. It is the same data you used in the notebook, now from the tool designed for analysis.',
          code: { language: 'sql', code: 'SELECT product, SUM(total) AS revenue\nFROM <your_catalog>.default.sales\nGROUP BY product\nORDER BY revenue DESC;' },
          check: 'Coffee comes first, with revenue of 22.50.',
        },
        {
          title: 'Optional: navigate Azure',
          body: 'If you have access to an Azure subscription, open the portal and find your Microsoft Entra tenant, the subscription and a resource group. If an Azure Databricks workspace exists, also find the managed resource group that the service created. Only look: do not delete or change resources.',
          check: 'You can point out the subscription, the resource group of the workspace and its managed resource group.',
        },
      ],
      wrapUp: 'You followed the full path of a piece of data: from a file on your computer to a volume, then to a governed Delta table and finally to a query in the SQL Editor. In the next sessions you will transform this data with Spark SQL and PySpark.',
      sources: [
        { label: 'Databricks Free Edition', url: `${DOCS}/getting-started/free-edition` },
        { label: 'Create and use volumes', url: `${DOCS}/volumes/utility-commands` },
        { label: 'Upload files to a volume', url: `${DOCS}/volumes/volume-files` },
        { label: 'SQL Editor', url: `${DOCS}/sql/user/sql-editor/` },
      ],
    },
    certification: {
      intro: 'Original practice questions aligned with the official guides. They are not real exam questions.',
      exams: [
        { name: 'Databricks Fundamentals (accreditation)', url: 'https://www.databricks.com/training/catalog/databricks-fundamentals-2206', domains: ['Platform and lakehouse', 'Unified governance', 'Workspace tour'] },
        { name: 'Databricks Certified Data Engineer Associate', url: 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf', domains: ['Databricks Intelligence Platform', 'Governance and Security'] },
        { name: 'Databricks Data + AI Platform Administrator Accreditation', url: 'https://www.databricks.com/learn/certification/platform-administrator-accreditation', domains: ['Compute resources', 'Governance and security'] },
      ],
      questions: [
        { domain: 'Databricks Intelligence Platform', question: 'A team uses classic compute in Azure Databricks. Where do those machines run?', options: ['In the Databricks account', 'In the customer Azure subscription', 'In the control plane', 'In the user browser'], answer: 1, explanation: 'The classic compute plane runs in the customer Azure subscription, inside the virtual network of the workspace.' },
        { domain: 'Databricks Intelligence Platform', question: 'Where does the serverless compute of an Azure Databricks workspace run?', options: ['In the customer subscription', 'In a randomly chosen region', 'In the Databricks account, in the same region as the workspace', 'On the user local machine'], answer: 2, explanation: 'The serverless compute plane lives in the Databricks account, aligned with the workspace region and isolated per workspace.' },
        { domain: 'Databricks Fundamentals', question: 'Which of these elements is part of the control plane?', options: ['The Databricks web application', 'The machines of a classic cluster', 'The customer ADLS Gen2 account', 'The Parquet files of a table'], answer: 0, explanation: 'The control plane includes the web application and the backend services that Databricks manages.' },
        { domain: 'Azure', question: 'Which statement about Azure resource groups is correct?', options: ['All of their resources must be in the same region', 'They can only contain storage accounts', 'Their region says where their metadata is stored and their resources can be in other regions', 'They are equivalent to a Microsoft Entra tenant'], answer: 2, explanation: 'The resource group region stores its metadata; the resources it groups can live in different regions.' },
        { domain: 'Azure', question: 'What is Azure Data Lake Storage Gen2?', options: ['A relational database service', 'Analytics capabilities on Blob Storage enabled by the hierarchical namespace', 'A type of virtual machine', 'A catalog in Unity Catalog'], answer: 1, explanation: 'ADLS Gen2 is not a separate account type: it is Blob Storage with the hierarchical namespace.' },
        { domain: 'Databricks Intelligence Platform', question: 'According to the architecture, what does workspace storage contain?', options: ['Only business Delta tables', 'Notebooks, queries, configuration files and system data such as results and logs', 'Only user passwords', 'Nothing: everything is stored in the browser'], answer: 1, explanation: 'It separates workspace file system assets from system data, such as results, revisions and logs.' },
        { domain: 'Governance and Security', question: 'What is the correct name to refer to a table in Unity Catalog?', options: ['schema.table', 'workspace/table', 'catalog.schema.table', 'metastore.table'], answer: 2, explanation: 'Unity Catalog uses a three-level namespace: catalog, schema and object.' },
        { domain: 'Governance and Security', question: 'A company has three workspaces in the same region. Can they share a Unity Catalog metastore?', options: ['No, each workspace needs its own metastore', 'Only if they are serverless workspaces', 'Only if they use the same subscription', 'Yes, a regional metastore can be assigned to several workspaces'], answer: 3, explanation: 'A metastore is regional and can be assigned to several workspaces, which share data and permissions.' },
        { domain: 'Compute resources', question: 'Which compute can you use in Databricks Free Edition?', options: ['Classic clusters of any size', 'Only serverless compute, with one SQL warehouse of size 2X-Small', 'None: it only lets you read documentation', 'GPUs to train models'], answer: 1, explanation: 'Free Edition only offers serverless compute and one SQL warehouse limited to 2X-Small.' },
        { domain: 'Databricks Fundamentals', question: 'In a PaaS model such as Databricks, which responsibility still belongs to the customer?', options: ['Upgrading the data center hardware', 'Patching the operating system of the managed servers', 'Protecting their data and deciding who has access', 'Replacing damaged disks'], answer: 2, explanation: 'Data, identities and access are the customer responsibility in every cloud model.' },
        { domain: 'Databricks Intelligence Platform', question: 'What is recommended today instead of the DBFS root and mounts?', options: ['Storing files in the control plane', 'Unity Catalog with governed tables and volumes', 'Copying the files into every notebook', 'Using only local CSV files'], answer: 1, explanation: 'The DBFS root and mounts are deprecated; data is governed with Unity Catalog and its volumes.' },
      ],
    },
  };
})(globalThis);
