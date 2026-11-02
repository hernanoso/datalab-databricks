// Session 8: original content based on the official Azure Data Factory and Azure Databricks documentation (reviewed November 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const ADF = 'https://learn.microsoft.com/en-us/azure/data-factory';
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const adf = (label, path) => ({ label, url: `${ADF}/${path}` });
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';
  const DP700 = 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700';

  DataLab.deep.en.s08 = {
    deepDive: [
      {
        title: 'Six components and three kinds of activity',
        body: [
          'Microsoft describes Data Factory with six components: pipelines, activities, datasets, linked services, data flows and integration runtimes. Activities fall into three families: data movement (Copy), transformation (Data Flow, Databricks Notebook, Stored Procedure and others) and control (If Condition, ForEach, Until, Wait, Lookup, Execute Pipeline). A linked service has two roles: it represents a data store or a compute service, such as an Azure Databricks workspace.',
          'The pipeline is the unit you deploy and schedule: you never schedule single activities. It has a soft limit of 120 activities, counting the inner ones of containers like ForEach, and a concurrency property that queues extra runs. Each execution is a pipeline run with its own run ID; parameters are read-only within the run, and variables hold temporary values you change with Set Variable.',
        ],
        source: adf('Pipelines and activities', 'concepts-pipelines-activities'),
      },
      {
        title: 'Integration runtime: Azure, self-hosted and Azure-SSIS',
        body: [
          'The integration runtime (IR) is the compute infrastructure that bridges activities and linked services. It provides four capabilities: running data flows, moving data, dispatching transformation activities to other services and running SSIS packages. The Azure IR is serverless and managed; by default it resolves automatically (AutoResolve) and, for Copy, tries to use the region of the sink.',
          'The self-hosted IR is installed on Windows inside your network, only opens outbound HTTP connections and is how you copy from private sources or from behind a firewall; it does not run data flows. The Azure-SSIS IR is a cluster of VMs dedicated to SSIS packages. With Databricks activities the IR only dispatches the work: the heavy compute happens on the Databricks cluster.',
        ],
        source: adf('Integration runtime', 'concepts-integration-runtime'),
      },
      {
        title: 'The Azure Databricks linked service: authentication and compute',
        body: [
          'The linked service supports Access Token, the factory managed identity (system-assigned) and a user-assigned managed identity registered as a credential. With managed identity no token is needed: the official tutorial asks you to grant that identity the Contributor role in Access control (IAM) of the Azure Databricks resource. If you use a token, store it in Azure Key Vault and reference it from the linked service instead of pasting it into the JSON.',
          'Under Select cluster you choose a new job cluster per run (newClusterVersion, newClusterNodeType and newClusterNumOfWorker, for example "1:10" to autoscale), an existing interactive cluster (existingClusterId) or an existing instance pool (instancePoolId). The documentation notes that Databricks suggests new clusters for greater reliability. For the Job activity, which always runs on serverless, you choose the Serverless option in the linked service.',
        ],
        source: adf('Azure Databricks linked service', 'compute-linked-services'),
      },
      {
        title: 'Four Databricks activities: Notebook, Python, Jar and Job',
        body: [
          'Notebook (type DatabricksNotebook) runs a notebook whose absolute path must start with a slash, with optional baseParameters and libraries (jar, egg, whl, maven, pypi or cran). Python and Jar run a .py file or a class from a JAR. All three run on the compute defined in the linked service, so with a new job cluster the cluster is created on every run: the tutorial estimates 5 to 8 minutes of startup.',
          'The Job activity (type DatabricksJob, Azure Data Factory only) runs an existing Lakeflow job by jobId and passes jobParameters to it; it runs on serverless automatically, so the linked service needs no cluster. It fits when the job already exists in Databricks with several tasks and ADF only has to start it inside a larger process. Job parameters require self-hosted IR 5.52.0.0 or later if you use that IR.',
        ],
        source: adf('Databricks Job activity', 'transform-data-databricks-job'),
      },
      {
        title: 'Values both ways: baseParameters, widgets and runOutput',
        body: [
          'Each baseParameters key fills the widget with the same name; if the notebook defines a widget you do not receive, it uses its default value. That is why it pays to declare widgets with valid defaults, so you can test the notebook by hand. Parameters and the return value are strings, so you convert types inside the notebook and validate formats, such as a date, before using them in SQL.',
          'dbutils.notebook.exit("value") returns the result to Data Factory, which exposes it in @activity(\'Name\').output.runOutput, with a 2 MB limit. If you return JSON built with json.dumps, you read each field by appending its name: @activity(\'Notebook_Ventas\').output.runOutput.filas.',
        ],
        source: adf('Passing parameters between notebooks and pipelines', 'transform-data-databricks-notebook'),
      },
      {
        title: 'Control flow: If Condition, ForEach, Until and Execute Pipeline',
        body: [
          'If Condition evaluates a boolean expression and runs ifTrueActivities or ifFalseActivities, for example @greater(activity(\'Notebook_Ventas\').output.runOutput.filas, 0). Lookup reads a value or a table for later decisions, Get Metadata inspects files, Wait pauses and Until repeats activities until a condition holds, with a configurable timeout. Fail ends the pipeline with a custom message.',
          'ForEach iterates over an array with @item(): it is parallel by default (isSequential = false), with a batchCount of 20 and a maximum of 50, and up to 100,000 items. It does not allow a ForEach inside another ForEach or inside an Until, and Set Variable is unsafe inside a parallel ForEach because variables are global. The fix is Execute Pipeline: the outer loop calls a child pipeline that holds the inner one.',
        ],
        source: adf('ForEach activity', 'control-flow-for-each-activity'),
      },
      {
        title: 'Dependency conditions and activity policies',
        body: [
          'Arrows between activities carry one of four conditions: Succeeded, Failed, Completed (success or failure) and Skipped. Skipped shows up in chains: if X fails in X → Y → Z with Succeeded, both Y and Z are skipped. An activity can depend on several earlier ones with different conditions, for example an alert Web activity wired with Failed to the notebook activity.',
          'Execution activities have a policy with timeout (12 hours by default), retry (0 by default), retryIntervalInSeconds (30 by default) and secureOutput, which keeps the output out of monitoring logs. If the Databricks job already retries on its own, also limit retries in ADF: the two multiply and stretch out the recovery from a real error.',
        ],
        source: adf('Dependencies and activity policy', 'concepts-pipelines-activities'),
      },
      {
        title: 'Triggers: schedule, tumbling window, storage event and custom event',
        body: [
          'A schedule trigger fires on a wall-clock calendar, has a many-to-many relationship with pipelines and is "fire and forget": it is marked successful as soon as the run starts. A tumbling window trigger splits time into fixed, contiguous, non-overlapping windows, supports backfill of past windows, retries, concurrency from 1 to 50 and windowStartTime/windowEndTime, but points to a single pipeline.',
          'There are two event triggers: storage event, for files arriving in or deleted from a storage account, and custom event, for custom Event Grid events. No trigger fires until you publish the changes with Publish all. Stopping and restarting an event trigger resumes its old pattern; if you do not want that, delete it and create it again.',
        ],
        source: adf('Pipeline execution and triggers', 'concepts-pipeline-execution-triggers'),
      },
      {
        title: 'Debug, Publish all and monitoring with reruns',
        body: [
          'Debug runs the draft pipeline without publishing it, but it is a real run: a Copy really copies data, so use test folders. With Debug Until you set a breakpoint on an activity and the test stops there. Debug history is kept for 15 days. Publish all sends pipelines, linked services and triggers to the service; only published items can run from triggers.',
          'The Monitor hub lists pipeline runs with Triggered and Debug tabs, and it does not refresh by itself: select Refresh. You can choose Rerun from the start, Rerun from activity or Rerun from failed activity; rerunning with New parameters counts as a new run. Data Factory keeps run data for only 45 days; for longer, configure diagnostic settings to Log Analytics.',
        ],
        source: adf('Visually monitor Data Factory', 'monitor-visually'),
      },
      {
        title: 'Copy into ADLS Gen2 and into Delta tables',
        body: [
          'The simplest pattern is that Copy lands raw files in ADLS Gen2 and Databricks ingests them with Auto Loader. The Azure Databricks Delta Lake connector can also write or read Delta tables directly, but it uses your Databricks cluster to move the data: Copy invokes the cluster, which reads from the source or from a staging area in Blob or ADLS Gen2.',
          'Direct copy only works if the source is Blob or ADLS Gen2 in Parquet, delimited text or Avro, pointing to a folder and without type conversion; otherwise you enable staged copy with an interim account. If the cluster is stopped, Copy starts it, but data preview while authoring needs a running cluster. With this connector, Lookup returns at most 1000 rows.',
        ],
        source: adf('Azure Databricks Delta Lake connector', 'connector-azure-databricks-delta-lake'),
      },
      {
        title: 'Mapping Data Flows and their Spark compute',
        body: [
          'A mapping data flow is a visual, code-free transformation that runs as a Data Flow activity inside a pipeline, on Spark clusters managed by ADF that spin up and down as needed. You only pick the Azure IR and the parameters; its data flow properties define the compute. The Optimize, Inspect and Data preview tabs help you tune partitions and review the schema.',
          'Debug mode opens a session with a live Spark cluster to see data at each step; a TTL on the Azure IR keeps it available between runs. For small tests reuse the debug session; for large or parallel jobs choose Use Activity Runtime. If the logic already lives in Databricks notebooks, calling them from ADF avoids duplicating it in a data flow.',
        ],
        source: adf('Mapping data flows', 'concepts-data-flow-overview'),
      },
      {
        title: 'Data Factory in Microsoft Fabric and the choice against Lakeflow Jobs',
        body: [
          'Microsoft presents Data Factory in Fabric as the next generation of ADF. There, linked services become connections and datasets disappear; there is no publish step (Save and Run); you do not manage integration runtimes, and the self-hosted IR is replaced by the on-premises data gateway. Execute Pipeline is called Invoke pipeline, and Databricks is used through the Azure Databricks activity.',
          'Databricks recommends Lakeflow Jobs to orchestrate notebooks and documents ADF as an external orchestrator that can run a job, notebooks, Python scripts or JARs. A practical rule: if the whole process lives in Databricks, use Lakeflow Jobs; if ADF already coordinates copies from on-premises, SaaS or SSIS sources, let ADF start Databricks, preferably with the Job activity.',
        ],
        source: { label: 'Differences between Data Factory in Fabric and Azure', url: 'https://learn.microsoft.com/en-us/fabric/data-factory/compare-fabric-data-factory-and-azure-data-factory' },
      },
    ],
    diagram: {
      title: 'An ADF pipeline that copies, transforms in Databricks and decides',
      caption: 'A schedule trigger starts pl_ventas with the fecha parameter; Copy moves the file to ADLS Gen2 through the Azure IR; the Notebook activity uses the Azure Databricks linked service with managed identity; If Condition reads runOutput.filas and, if there is no data, a Web activity alerts the team. Key Vault holds secrets and Monitor records every run.',
      layers: [
        { label: 'Start', nodes: ['Daily schedule trigger', 'fecha parameter = formatted @trigger().scheduledTime'] },
        { label: 'Movement', nodes: ['Copy: Blob → ADLS Gen2 raw/ventas/', 'Azure integration runtime (AutoResolve)'] },
        { label: 'Transformation in Databricks', nodes: ['Notebook_Ventas with baseParameters', 'Azure Databricks linked service (managed identity)', 'Job cluster runs s08_ventas_dia and calls dbutils.notebook.exit'] },
        { label: 'Decision', nodes: ['If Condition: runOutput.filas > 0', 'True: continue', 'False: Web activity alerts the team'] },
        { label: 'Security and observability', nodes: ['Azure Key Vault: linked service secrets', 'Monitor: pipeline runs and activity runs (45 days)'] },
      ],
    },
    comparison: {
      title: 'Azure Data Factory versus Lakeflow Jobs',
      headers: ['Aspect', 'Azure Data Factory', 'Lakeflow Jobs'],
      rows: [
        ['Where it lives', 'Azure PaaS service, authored in ADF Studio', 'Inside the Databricks workspace'],
        ['Unit of work', 'Pipeline with activities; soft limit of 120', 'Job with tasks in a DAG; up to 1000 tasks'],
        ['Strong at', 'Copy with many connectors, self-hosted IR for private networks and SSIS', 'Notebooks, Lakeflow pipelines, SQL and scripts in Databricks'],
        ['How it runs Databricks', 'Notebook, Python, Jar and Job activities through a linked service', 'Natively, on serverless or classic compute'],
        ['Triggers', 'Schedule, tumbling window, storage event and custom event', 'Time-based schedules or events, such as file arrival'],
        ['Control flow', 'If Condition, Switch, ForEach, Until, Wait, Execute Pipeline', 'If / else and for each tasks'],
        ['Passing values', 'Expressions such as @activity(\'x\').output.runOutput', 'Job parameters and dynamic values between tasks'],
        ['Monitoring', 'Monitor hub, runs kept 45 days, Azure Monitor', 'Runs in Jobs & Pipelines and system tables'],
      ],
      sources: [adf('Pipelines and activities', 'concepts-pipelines-activities'), source('Lakeflow Jobs', 'jobs/')],
    },
    lab: {
      title: 'A parameterized notebook and its orchestration with Data Factory',
      goal: 'Write a notebook in Free Edition that receives a date through a widget, counts that day\'s sales and returns JSON with dbutils.notebook.exit; test it from another notebook with dbutils.notebook.run, emulate the condition and the failure path; and, with an Azure subscription, run it from a Data Factory pipeline with base parameters, If Condition, Debug, a schedule trigger and the Monitor hub.',
      minutes: 120,
      requirements: [
        'Steps 1 to 6: Databricks Free Edition with serverless compute. Free Edition allows at most 5 concurrent job tasks per account; each dbutils.notebook.run starts an ephemeral job, so run them one at a time. Replace <your_catalog> with the result of current_catalog().',
        'Steps 7 to 13 (optional): an Azure subscription, for example a free account or one with credits, with an Azure Databricks workspace. Data Factory connects to Azure Databricks workspaces, not to Free Edition. Job clusters and the data factory cost money: give the trigger an end date and delete the resource group when you finish.',
        'To authenticate with managed identity you must be able to grant the data factory the Contributor role in Access control (IAM) of the Azure Databricks resource; if you cannot, use an Access Token stored in Azure Key Vault.',
      ],
      steps: [
        {
          title: 'Prepare the schema and the sales table (Free Edition)',
          body: 'Open a new notebook with serverless compute and SQL as the language. Write down the value of current_catalog() and use it instead of <your_catalog>. The table holds four sales on two dates; January 7 deliberately has no sales so you can test the False branch later.',
          code: { language: 'sql', code: `SELECT current_catalog();
CREATE SCHEMA IF NOT EXISTS <your_catalog>.s08_lab;
CREATE OR REPLACE TABLE <your_catalog>.s08_lab.ventas (venta_id INT, fecha DATE, monto DOUBLE);
INSERT INTO <your_catalog>.s08_lab.ventas VALUES
  (1, DATE'2026-01-05', 10.0),
  (2, DATE'2026-01-05', 20.0),
  (3, DATE'2026-01-05', 5.5),
  (4, DATE'2026-01-06', 40.0);
SELECT fecha, count(*) AS filas, sum(monto) AS total
FROM <your_catalog>.s08_lab.ventas GROUP BY fecha ORDER BY fecha;` },
          check: 'The last query returns 2 rows: 2026-01-05 → 3 sales and 35.5 (10 + 20 + 5.5); 2026-01-06 → 1 sale and 40.0. 2026-01-07 does not appear.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Write the parameterized notebook s08_ventas_dia',
          body: 'In your user folder create the folder s08_lab and, inside it, a Python notebook named s08_ventas_dia. The fecha and catalogo widgets are the base parameters Data Factory will send. The date is validated before use and the query uses parameter markers instead of concatenating text. The notebook ends with dbutils.notebook.exit and a JSON string.',
          code: { language: 'python', code: `import json
from datetime import date

dbutils.widgets.text("fecha", "2026-01-05", "Date (YYYY-MM-DD)")
dbutils.widgets.text("catalogo", "<your_catalog>", "Catalog")
fecha = dbutils.widgets.get("fecha")
catalogo = dbutils.widgets.get("catalogo")

date.fromisoformat(fecha)  # ValueError if the date does not exist: the activity fails

fila = spark.sql(
    "SELECT count(*) AS filas, coalesce(sum(monto), 0.0) AS total "
    "FROM IDENTIFIER(:tabla) WHERE fecha = CAST(:fecha AS DATE)",
    args={"tabla": f"{catalogo}.s08_lab.ventas", "fecha": fecha},
).first()

resultado = {
    "fecha": fecha,
    "filas": fila["filas"],
    "total": float(fila["total"]),
    "estado": "OK" if fila["filas"] > 0 else "SIN_DATOS",
}
dbutils.notebook.exit(json.dumps(resultado))` },
          check: 'The notebook shows the fecha and catalogo widgets at the top; change the catalogo default to your real catalog.',
        },
        {
          title: 'Simulate the parameters by hand',
          body: 'Select Run all with fecha = 2026-01-05: the cell ends with the exit value of dbutils.notebook.exit. Then type 2026-01-07 in the fecha widget and run again. This simulates what Data Factory will do when it fills the widgets with base parameters, without needing Azure yet.',
          check: 'With 2026-01-05 the output is {"fecha": "2026-01-05", "filas": 3, "total": 35.5, "estado": "OK"}; with 2026-01-07 it is {"fecha": "2026-01-07", "filas": 0, "total": 0.0, "estado": "SIN_DATOS"}, because coalesce turns the null sum into 0.0.',
          screen: { id: 'notebook', highlight: ['runAll'] },
        },
        {
          title: 'Call the notebook from an orchestrator with dbutils.notebook.run',
          body: 'In the same folder create the Python notebook s08_orquestador. dbutils.notebook.run starts an ephemeral job per call, fills the widgets with the arguments dictionary and returns the exit value as a string. If your environment does not resolve the relative path, use the absolute path of the notebook. If dbutils.notebook.run were unavailable, create a job with a notebook task and the fecha parameter (session 7).',
          code: { language: 'python', code: `import json

catalogo = "<your_catalog>"
resultados = []
for fecha in ["2026-01-05", "2026-01-06", "2026-01-07"]:
    salida = dbutils.notebook.run("./s08_ventas_dia", 600, {"fecha": fecha, "catalogo": catalogo})
    resultados.append(json.loads(salida))

for r in resultados:
    print(r)
print("total:", sum(r["total"] for r in resultados))` },
          check: 'Three dictionaries are printed: 2026-01-05 → filas 3, total 35.5, OK; 2026-01-06 → filas 1, total 40.0, OK; 2026-01-07 → filas 0, total 0.0, SIN_DATOS. The last line is total: 75.5 (35.5 + 40.0 + 0.0).',
        },
        {
          title: 'Emulate the If Condition decision',
          body: 'In ADF, the branch will be decided by an expression over runOutput. Here you reproduce it in Python with the same results, to check the logic before paying for a job cluster. If filas is greater than zero the pipeline continues; otherwise it alerts.',
          code: { language: 'python', code: `# ADF: @greater(activity('Notebook_Ventas').output.runOutput.filas, 0)
for r in resultados:
    hay_ventas = r["filas"] > 0
    print(r["fecha"], "->", "True: continue" if hay_ventas else "False: alert")` },
          check: 'Output: 2026-01-05 -> True: continue; 2026-01-06 -> True: continue; 2026-01-07 -> False: alert. Two dates take the True branch and one takes the False branch.',
        },
        {
          title: 'Force a failure to understand the Failed condition',
          body: 'Call the notebook with a date that does not exist. date.fromisoformat raises ValueError, the child notebook fails and the call raises an exception in the orchestrator. In ADF that same error would mark the activity as Failed: the Succeeded arrow to the If Condition would not be followed, and an activity wired with Failed would run.',
          code: { language: 'python', code: `try:
    dbutils.notebook.run("./s08_ventas_dia", 600, {"fecha": "2026-02-30", "catalogo": catalogo})
    print("Succeeded")
except Exception as e:
    print("Failed:", str(e)[:120])` },
          check: 'A line starting with Failed: is printed and never Succeeded, because February 2026 has no day 30.',
        },
        {
          title: 'Create the data factory (requires Azure)',
          body: 'From here on you need an Azure subscription. In the Azure portal choose Create a resource → Analytics → Data Factory. In Basics select the Subscription, create a new Resource group (for example rg-s08-lab), choose the Region and a globally unique Name. Select Review + create and then Create. In Azure Databricks repeat steps 1 and 2 in your workspace.',
          check: 'When it finishes, Go to resource opens the data factory page and Launch Studio opens Azure Data Factory Studio in another tab. The Azure Databricks workspace contains /Users/<your_user>/s08_lab/s08_ventas_dia.',
          screen: { id: 's08-portal', highlight: ['dataFactory', 'resourceGroup', 'name', 'reviewCreate', 'launchStudio'] },
        },
        {
          title: 'Create the Azure Databricks linked service',
          body: 'In ADF Studio go to Manage → Linked services → + New → Compute → Azure Databricks → Continue. Name it ls_databricks, pick your Databricks workspace, Select cluster = New job cluster and Authentication type = Managed service identity, with the Contributor role granted beforehand on the Databricks resource. Choose a version, a small node type and 1 worker, then select Create.',
          code: { language: 'json', code: `{
  "name": "ls_databricks",
  "properties": {
    "type": "AzureDatabricks",
    "typeProperties": {
      "domain": "https://adb-<id>.<n>.azuredatabricks.net",
      "authentication": "MSI",
      "workspaceResourceId": "<Azure Databricks resource ID>",
      "newClusterVersion": "<Databricks Runtime version>",
      "newClusterNodeType": "<node type>",
      "newClusterNumOfWorker": "1"
    }
  }
}` },
          check: 'ls_databricks appears in Manage → Linked services with type Azure Databricks. The JSON is a reference: compare it with the code the editor shows and never paste a token into it.',
          screen: { id: 's08-manage', highlight: ['manage', 'linkedServices', 'newLinked', 'azureDatabricks', 'selectCluster', 'authType'] },
        },
        {
          title: 'Build the pipeline with the Notebook activity',
          body: 'Go to Author, select + → Pipeline → Pipeline and name it pl_ventas. Under Parameters create fecha (String, default 2026-01-05). In Activities expand Databricks and drag Notebook onto the canvas; name it Notebook_Ventas. On Azure Databricks pick ls_databricks; on Settings set the Notebook path and two Base parameters.',
          code: { language: 'json', code: `{
  "name": "Notebook_Ventas",
  "type": "DatabricksNotebook",
  "linkedServiceName": { "referenceName": "ls_databricks", "type": "LinkedServiceReference" },
  "typeProperties": {
    "notebookPath": "/Users/<your_user>/s08_lab/s08_ventas_dia",
    "baseParameters": {
      "fecha": "@pipeline().parameters.fecha",
      "catalogo": "<your_catalog>"
    }
  }
}` },
          check: 'Validate shows no errors. In the pipeline code, notebookPath starts with / and baseParameters has the keys fecha and catalogo, matching the widget names.',
          screen: { id: 's08-author', highlight: ['author', 'parametersTab', 'databricks', 'notebook', 'databricksTab', 'settingsTab', 'baseParameters'] },
        },
        {
          title: 'Add the If Condition over runOutput',
          body: 'Search for If in the Activities pane and drag If Condition; name it If_HayVentas and connect the Success output of Notebook_Ventas. On its Activities tab type the expression. In True add a 1-second Wait activity; in False add a Fail activity with a message. In production, False usually holds a Web activity calling the team webhook.',
          code: { language: 'json', code: `{
  "name": "If_HayVentas",
  "type": "IfCondition",
  "dependsOn": [{ "activity": "Notebook_Ventas", "dependencyConditions": ["Succeeded"] }],
  "typeProperties": {
    "expression": {
      "value": "@greater(activity('Notebook_Ventas').output.runOutput.filas, 0)",
      "type": "Expression"
    },
    "ifTrueActivities": [{ "name": "Wait_OK", "type": "Wait", "typeProperties": { "waitTimeInSeconds": 1 } }],
    "ifFalseActivities": [{ "name": "Fail_SinVentas", "type": "Fail",
      "typeProperties": { "message": "No sales for @{pipeline().parameters.fecha}", "errorCode": "SIN_DATOS" } }]
  }
}` },
          check: 'The canvas shows Notebook_Ventas → (Success) → If_HayVentas, with Wait_OK under True and Fail_SinVentas under False. Validate finishes without errors.',
          screen: { id: 's08-author', highlight: ['search', 'ifCondition', 'successPath', 'ifActivity'] },
        },
        {
          title: 'Test with Debug without publishing',
          body: 'Select Debug and keep fecha = 2026-01-05. The first run waits for the job cluster to be created, 5 to 8 minutes according to the tutorial. On the Output tab open the output of Notebook_Ventas. Repeat Debug with fecha = 2026-01-07. Debug really runs the notebook, even though nothing is published yet.',
          check: 'With 2026-01-05: Notebook_Ventas Succeeded, runOutput = {"fecha": "2026-01-05", "filas": 3, "total": 35.5, "estado": "OK"}, If_HayVentas takes True and the run ends Succeeded. With 2026-01-07: runOutput.filas = 0, Fail_SinVentas runs and the run ends Failed with the message No sales for 2026-01-07.',
          screen: { id: 's08-author', highlight: ['debug', 'outputTab', 'notebookActivity'] },
        },
        {
          title: 'Add a schedule trigger and publish',
          body: 'Select Add trigger → New/Edit → Choose trigger → + New. Keep Type = Schedule and set Start date about 15 minutes in the future: if the start time has already passed, the first run is computed for the next recurrence. Set Recurrence to 1 day, tick Specify an end date one hour after the start and keep Activated at Yes. Select OK, enter 2026-01-06 as the fecha value and select Publish all before the start time.',
          check: 'Until you select Publish all the trigger fires nothing. Afterwards, Manage → Triggers shows it started and, with a daily recurrence and an end one hour later, it fires exactly 1 run at the start time: fecha = 2026-01-06, filas 1, total 40.0, True branch and status Succeeded.',
          screen: { id: 's08-trigger', highlight: ['newEdit', 'schedule', 'recurrence', 'endDate', 'activated', 'publishAll'] },
        },
        {
          title: 'Monitor, rerun and clean up',
          body: 'Open Monitor → Pipeline runs and select Refresh. Triggered shows the trigger run; Debug shows the two tests. Open a run to see its activity runs and the Output icon. On the trigger run choose Rerun. When you finish, deactivate the trigger, publish and delete the resource group.',
          check: 'Triggered: 1 Succeeded run with the trigger name under Triggered By. Debug: 2 runs, 2026-01-05 Succeeded and 2026-01-07 Failed. The rerun is grouped with the original: the Run column shows Original and Rerun (Latest), and it ends Succeeded.',
          screen: { id: 's08-monitor', highlight: ['monitor', 'pipelineRuns', 'triggeredTab', 'debugTab', 'refresh', 'outputIcon'] },
        },
      ],
      wrapUp: 'You wrote a notebook that receives parameters through widgets and returns JSON: three dates produced 3, 1 and 0 sales, 75.5 in total, and an invalid date demonstrated the Failed condition. In Azure, the same widget and runOutput contract let Data Factory pass the date, branch with If Condition, test with Debug and schedule with a schedule trigger. Delete the resource group so you stop paying.',
      sources: [
        { label: 'Free Edition limitations', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Orchestrate notebooks and dbutils.notebook.run', 'notebooks/notebook-workflows'),
        source('Databricks widgets', 'notebooks/widgets'),
        adf('Tutorial: run a notebook with the Notebook activity', 'transform-data-using-databricks-notebook'),
        adf('Databricks Notebook activity', 'transform-data-databricks-notebook'),
        adf('Azure Databricks linked service', 'compute-linked-services'),
        adf('If Condition activity', 'control-flow-if-condition-activity'),
        adf('Iterative development and debugging', 'iterative-development-debugging'),
        adf('Create schedule triggers', 'how-to-create-schedule-trigger'),
        adf('Visually monitor Data Factory', 'monitor-visually'),
        adf('Store credentials in Azure Key Vault', 'store-credentials-in-key-vault'),
      ],
    },
    certification: {
      intro: 'Original practice questions; they are not real questions from any exam. Data Factory is not a Databricks exam topic: questions about the integration align with Databricks Certified Data Engineer Associate domains, and pure orchestration questions with DP-700, whose skills cover Data Factory pipelines in Microsoft Fabric. DP-203 (Azure Data Engineer Associate) was retired on March 31, 2025.',
      exams: [
        { name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Working with Lakeflow Jobs', 'Databricks Intelligence Platform', 'Data Ingestion and Loading'] },
        { name: 'Microsoft DP-700: Implementing Data Engineering Solutions Using Microsoft Fabric', url: DP700, domains: ['Implement and manage an analytics solution', 'Ingest and transform data', 'Monitor and optimize an analytics solution'] },
      ],
      questions: [
        { domain: 'Implement and manage an analytics solution', question: 'Which Data Factory component stores the Azure Databricks workspace URL and its authentication method?', options: ['A dataset', 'An integration runtime', 'A linked service', 'A trigger'], answer: 2, explanation: 'The linked service defines the connection to a data store or a compute service; the dataset describes data and the IR provides integration compute.' },
        { domain: 'Ingest and transform data', question: 'You must copy tables from an on-premises SQL Server behind a corporate firewall. Which integration runtime does the Copy activity use?', options: ['The Azure IR with AutoResolve', 'A self-hosted IR installed in the private network', 'An Azure-SSIS IR', 'The Databricks cluster of the linked service'], answer: 1, explanation: 'The self-hosted IR is installed inside the network, only opens outbound connections and moves data between private networks and the cloud.' },
        { domain: 'Implement and manage an analytics solution', question: 'A notebook reads dbutils.widgets.get("fecha"). How do you send that value from the ADF Notebook activity?', options: ['With a fecha key in baseParameters', 'With a pypi library in libraries', 'With newClusterSparkConf in the linked service', 'With a global temp view created beforehand'], answer: 0, explanation: 'Each baseParameters key fills the widget with the same name; if it is missing, the notebook uses the widget default.' },
        { domain: 'Implement and manage an analytics solution', question: 'The notebook ends with dbutils.notebook.exit(json.dumps({"filas": 0})). Which expression does the If Condition use to know whether there were rows?', options: ['@greater(pipeline().parameters.filas, 0)', '@greater(activity(\'Notebook_Ventas\').output.runOutput.filas, 0)', '@greater(item().filas, 0)', '@greater(trigger().outputs.filas, 0)'], answer: 1, explanation: 'The exit value is exposed in the activity output.runOutput, and with JSON you read each field by appending its name.' },
        { domain: 'Monitor and optimize an analytics solution', question: 'An alert Web activity must run only if the notebook activity fails. Which dependency condition do you use?', options: ['Succeeded', 'Completed', 'Skipped', 'Failed'], answer: 3, explanation: 'Failed runs the next activity only when the previous one ends in failure; Completed would also run it after a success.' },
        { domain: 'Implement and manage an analytics solution', question: 'You need to process hourly windows since January 1, with retries and at most 4 windows at a time. Which trigger do you choose?', options: ['Schedule trigger', 'Storage event trigger', 'Tumbling window trigger', 'Custom event trigger'], answer: 2, explanation: 'The tumbling window trigger supports backfill of past windows, retries, configurable concurrency and the window start and end variables.' },
        { domain: 'Databricks Intelligence Platform', question: 'A Lakeflow job with several tasks already exists and must run on serverless after ADF finishes a copy. Which activity do you use?', options: ['Notebook with an existing interactive cluster', 'Azure Databricks Job, with the Serverless option', 'Python with an instance pool', 'A mapping data flow'], answer: 1, explanation: 'The Job activity runs an existing job by jobId and runs on serverless automatically, with no cluster defined in the linked service.' },
        { domain: 'Monitor and optimize an analytics solution', question: 'You created a schedule trigger, saved it and no run appears. What is the most likely cause?', options: ['You did not select Publish all', 'The pipeline is still in Debug mode', 'The Azure IR is stopped', 'Schedule triggers require a window'], answer: 0, explanation: 'The trigger takes effect only after you publish the solution, not when you save it in the UI.' },
        { domain: 'Monitor and optimize an analytics solution', question: 'A five-activity pipeline failed on the fourth and the first three are expensive. How do you resume without repeating them?', options: ['Rerun from the start', 'Debug with the same parameters', 'Rerun from failed activity', 'Rerun with New parameters'], answer: 2, explanation: 'Rerun from failed activity restarts from the activity that failed, was canceled or timed out; New parameters creates a new run.' },
        { domain: 'Ingest and transform data', question: 'For each region you must loop over a list of tables. How do you implement that loop inside another loop?', options: ['A ForEach inside another ForEach', 'Raise batchCount to 100', 'An Until that contains a ForEach', 'A ForEach that calls a child pipeline holding the inner loop with Execute Pipeline'], answer: 3, explanation: 'ForEach does not allow another ForEach inside it or inside Until, and batchCount has a maximum of 50; the pattern is a two-level pipeline.' },
        { domain: 'Working with Lakeflow Jobs', question: 'The whole process lives in Databricks and there are no copies from other systems. What does Databricks recommend to orchestrate the notebooks?', options: ['Lakeflow Jobs', 'An ADF pipeline with a job cluster per notebook', 'dbutils.notebook.run in a loop', 'Chaining notebooks with %run'], answer: 0, explanation: 'Databricks recommends Lakeflow Jobs to orchestrate notebooks; dbutils.notebook.run is for cases Jobs cannot cover, and ADF adds another tool.' },
        { domain: 'Implement and manage an analytics solution', question: 'You select Debug on a pipeline whose Copy points to the production folder. What happens?', options: ['Only the JSON is validated', 'The pipeline really runs without being published, so it copies data into production', 'ADF publishes first and then runs', 'The copy is simulated without moving data'], answer: 1, explanation: 'Debug runs the real pipeline with the current draft; that is why the documentation recommends test folders while debugging.' },
        { type: 'hotspot', domain: 'Implement and manage an analytics solution', screen: 's08-manage', answer: 'azureDatabricks', question: 'You opened New linked service on the Compute tab. Where do you click to connect a Databricks workspace?', explanation: 'In Manage → Linked services → + New you choose Compute → Azure Databricks and then Continue to configure the workspace and the cluster.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's08-author', answer: 'notebook', question: 'You expanded Databricks in the Activities pane. What do you drag onto the canvas to run a notebook with base parameters?', explanation: 'The Notebook activity in the Databricks group runs a workspace notebook and accepts baseParameters on its Settings tab.' },
        { type: 'hotspot', domain: 'Implement and manage an analytics solution', screen: 's08-author', answer: 'debug', question: 'Where do you test the pipeline with your changes before publishing them?', explanation: 'Debug runs the draft pipeline without publishing it and shows the result of each activity on the Output tab.' },
        { type: 'hotspot', domain: 'Implement and manage an analytics solution', screen: 's08-trigger', answer: 'tumbling', question: 'You must reprocess past time windows without gaps. Which trigger type do you choose?', explanation: 'Tumbling window supports backfill of past windows, retries and concurrency; Schedule only runs from now on.' },
        { type: 'hotspot', domain: 'Monitor and optimize an analytics solution', screen: 's08-monitor', answer: 'rerunFailed', question: 'A run failed on its last activity. Where do you resume it from that point?', explanation: 'Rerun from failed activity runs again from the activity that failed, without repeating the ones that succeeded.' },
      ],
    },
  };
})(globalThis);
