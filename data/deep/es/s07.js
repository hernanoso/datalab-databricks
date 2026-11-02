// Sesión 7: contenido original basado en la documentación oficial de Lakeflow Jobs (revisada en noviembre de 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.es.s07 = {
    deepDive: [
      {
        title: 'Job, tarea y run forman un DAG',
        body: [
          'Un job es el recurso que coordina, programa y ejecuta trabajo; puede tener desde una tarea hasta 1000. Las tareas y sus dependencias forman un grafo dirigido acíclico (DAG) que la interfaz muestra en la vista Graph, y Databricks ejecuta en paralelo todo lo que no depende entre sí. Cada disparo crea un run, y cada tarea de ese run tiene su propio task run con salida, duración y estado.',
          'Hay muchos tipos de tarea: Notebook, Python script, Python wheel, SQL, Pipeline para Lakeflow pipelines, dbt, JAR, Spark Submit, Dashboards, Power BI y Run Job, que lanza otro job del workspace. Las tareas de control de flujo son If/else condition y For each. Una tarea se puede deshabilitar para saltarla sin borrar su configuración ni su historial.',
        ],
        source: source('Configurar y editar tareas en Lakeflow Jobs', 'jobs/configure-task'),
      },
      {
        title: 'Serverless primero; all-purpose no es para producción',
        body: [
          'Serverless compute for jobs es el valor por defecto para las tareas que lo admiten y el recomendado para notebooks, scripts y wheels: Databricks gestiona el escalado, Photon viene activo y no hace falta permiso para crear clústeres. Las tareas SQL y dbt usan un SQL warehouse, las de pipeline usan el cómputo del pipeline, y JAR o Spark Submit requieren jobs compute clásico.',
          'Un job cluster clásico se crea para el run y termina al final; si lo compartes entre tareas evitas arranques repetidos, pero solo vive dentro de ese run. All-purpose compute funciona, aunque Databricks no lo recomienda para jobs de producción. En serverless, Performance optimized arranca más rápido; desactivado, el modo estándar consume menos DBU y tolera una latencia de arranque de 4 a 6 minutos.',
        ],
        source: source('Configurar cómputo para jobs', 'jobs/compute'),
      },
      {
        title: 'Horarios, continuous y la pausa de un disparador',
        body: [
          'Los disparadores se agregan en Job details → Schedules & Triggers → Add trigger: Scheduled, Table update, File arrival, Model update, Upstream job completion (Beta) o Continuous; sin disparador el job solo corre con Run now o desde otra herramienta. Scheduled ofrece Simple, un intervalo, o Advanced, con hora, zona horaria y la opción Show Cron Syntax en sintaxis Quartz, que incluye segundos: 0 0 6 * * ? es todos los días a las 6:00.',
          'Con una zona horaria con horario de verano, un job horario puede saltarse o retrasarse en el cambio; para horas absolutas elige UTC. El scheduler no es para baja latencia y puede retrasarse unos minutos. Continuous mantiene una sola instancia activa y relanza el run al terminar; no admite dependencias entre tareas ni políticas de reintento propias, y reintenta con backoff exponencial. Pause detiene nuevos runs sin cortar los activos.',
        ],
        source: source('Automatizar jobs con horarios y disparadores', 'jobs/triggers'),
      },
      {
        title: 'File arrival y table update: correr cuando hay datos',
        body: [
          'File arrival vigila la raíz o una subruta de un volumen o una external location de Unity Catalog, revisa de forma recursiva aproximadamente cada minuto y no cuesta más que el listado en la nube. Solo los archivos nuevos disparan un run: sobrescribir un archivo con el mismo nombre no lo hace. Sin file events, una ubicación admite hasta 10 000 archivos y como máximo 50 jobs con este disparador por workspace.',
          'Table update dispara cuando cambian tablas Delta o Iceberg de Unity Catalog, materialized views, streaming tables o views soportadas; con varias tablas eliges Any table is updated o All tables are updated, hasta 25 tablas. Ambos disparadores tienen Minimum time between triggers, un enfriamiento, y Wait after last change, que espera a que termine un lote. Table update exige SELECT para el usuario de Run as; file arrival, READ sobre la ubicación.',
        ],
        source: source('Disparar jobs cuando llegan archivos nuevos', 'jobs/file-arrival-triggers'),
      },
      {
        title: 'Parámetros de job frente a parámetros de tarea',
        body: [
          'Los parámetros de job son pares clave-valor definidos en Job details → Edit parameters; la clave solo admite letras, números, _ - y punto, y el valor es una cadena, JSON o una referencia dinámica. Se empujan automáticamente a las tareas que aceptan clave-valor, como los notebooks, que los leen con dbutils.widgets.get. Si un parámetro de job y uno de tarea comparten clave, gana el del job.',
          'Las tareas que reciben arrays JSON, como Python script, no reciben los parámetros de job solos: debes referenciarlos con {{job.parameters.<nombre>}}. En SQL se leen con marcadores con nombre como :fecha. Run now with different settings permite cambiar valores o elegir un subconjunto de tareas para un run, y el diálogo Repair job run también puede sobrescribirlos.',
        ],
        source: source('Configurar parámetros de job', 'jobs/job-parameters'),
      },
      {
        title: 'Referencias dinámicas con dobles llaves',
        body: [
          'Una referencia dinámica se escribe entre {{ }} en un parámetro o campo del job y se reemplaza por texto al correr. Ejemplos: {{job.id}}, {{job.run_id}}, {{job.trigger.type}}, {{job.parameters.fecha}}, {{task.name}}, {{tasks.ingest.result_state}} y {{tasks.ingest.values.row_count}}. {{job.start_time.iso_date}} devuelve la fecha ISO de inicio del run, siempre en UTC; también existen year, month, hour, is_weekday y timestamp_ms.',
          'Dentro de las llaves no hay expresiones ni funciones. Una referencia inexistente se trata en silencio como texto literal, salvo que pertenezca a un espacio de nombres conocido. El botón { } de la interfaz lista las referencias, aunque no autocompleta claves de task values. Variables antiguas como {{start_date}} o {{run_id}} están obsoletas: usa job.start_time y task.run_id.',
        ],
        source: source('Referencias de valores dinámicos', 'jobs/dynamic-value-references'),
      },
      {
        title: 'Task values: una tarea le habla a la siguiente',
        body: [
          'dbutils.jobs.taskValues.set(key="row_count", value=n) publica un valor desde un notebook Python; la clave es una cadena única y el valor debe ser JSON válido de hasta 48 KiB. Databricks recomienda leerlo con la referencia {{tasks.<tarea>.values.<clave>}} en parámetros, en la condición de un If/else o en las Inputs de un For each, porque funciona con cualquier tipo de tarea que acepte parámetros.',
          'dbutils.jobs.taskValues.get exige el nombre de la tarea origen; debugValue sirve al desarrollar fuera de un job y default no se recomienda porque oculta errores. Si la tarea que publica corre dentro de un For each, la referencia devuelve un array con el valor de cada iteración en orden; esa agregación está en Beta. El valor publicado aparece en el panel Output del task run.',
        ],
        source: source('Usar task values para pasar información entre tareas', 'jobs/task-values'),
      },
      {
        title: 'Run if y el estado final del run',
        body: [
          'Run if dependencies decide si una tarea corre según sus dependencias: All succeeded es el valor por defecto; At least one succeeded y None failed marcan Upstream failed si no se cumplen; All done corre siempre que las dependencias terminen; At least one failed y All failed sirven para manejar errores y dejan la tarea Excluded si no se cumplen. Una tarea Excluded cuenta como exitosa para las siguientes.',
          'El estado del run depende de las tareas hoja, las que no tienen descendientes: Succeeded si todo salió bien, Succeeded with failures si alguna tarea falló pero todas las hojas tuvieron éxito, y Failed si falló una hoja. Por eso una tarea de limpieza con All done puede ocultar un fallo intermedio: configura notificaciones o revisa la matriz de runs.',
        ],
        source: source('Configurar dependencias entre tareas', 'jobs/run-if'),
      },
      {
        title: 'If/else condition y For each',
        body: [
          'If/else condition compara dos operandos con un operador; los operandos pueden ser parámetros de job, de tarea o task values. == y != comparan como cadenas, así que 12.0 == 12 es falso; >, >=, < y <= comparan como números. Las tareas siguientes dependen de nombre (true) o nombre (false) en Depends on, y el detalle del run muestra cómo se evaluó la expresión.',
          'For each ejecuta una tarea anidada una vez por elemento de Inputs: un array JSON de hasta 5000 caracteres, un task value o un parámetro de job. Concurrency vale 1 por defecto; la tarea anidada lee cada elemento con {{input}} o {{input.campo}} y no puede ser otro For each. El historial se presenta como una tabla de iteraciones con el filtro Only failed iterations.',
        ],
        source: source('Usar For each para ejecutar una tarea en bucle', 'jobs/tasks/for-each'),
      },
      {
        title: 'Reintentos, timeouts y notificaciones',
        body: [
          'Retries → Add define cuántas veces y cada cuánto se reintenta una tarea; en la mayoría de configuraciones no hay reintentos por defecto, pero serverless reintenta automáticamente con auto-optimization, que puedes desmarcar para trabajos no idempotentes. Metric thresholds fija un Warning, la duración esperada, y un Timeout, que marca la tarea como Timed Out; con reintentos, el timeout se aplica a cada intento.',
          'Edit notifications → Add notification envía avisos a correo o a destinos de sistema como Slack, Microsoft Teams, PagerDuty o webhooks, en Start, Success, Failure, Duration warning o Streaming backlog, con un máximo de tres destinos de sistema por evento. Las notificaciones del job no se envían en cada reintento; para eso usa notificaciones de tarea. Un run Succeeded with failures cuenta como éxito para avisos.',
        ],
        source: source('Agregar notificaciones a un job', 'jobs/notifications'),
      },
      {
        title: 'Repair run, historial y concurrencia',
        body: [
          'La pestaña Runs muestra una matriz con cada tarea por run: verde éxito, rojo fallo, rosa omitido y amarillo esperando reintento; el historial se guarda 60 días. Repair run reejecuta solo las tareas no exitosas y sus dependientes, con la configuración actual del job, y no está disponible en jobs de una sola tarea. Cada tarea reparada corre desde el inicio: si escribía con append, puede duplicar datos.',
          'Por defecto un job admite un run activo a la vez (Maximum concurrent runs = 1); si llega otro, se omite como Skipped, salvo que actives Queue en Advanced settings, que espera hasta 48 horas y viene activa en jobs creados en la interfaz desde abril de 2024. Un workspace admite 2000 task runs simultáneos; en Free Edition el límite es de 5 tareas de job concurrentes por cuenta.',
        ],
        source: source('Solucionar y reparar fallos de jobs', 'jobs/repair-job-failures'),
      },
      {
        title: 'Permisos, Run as, Git y bundles',
        body: [
          'Los permisos de job son CAN VIEW, CAN MANAGE RUN para lanzar y cancelar runs, CAN MANAGE para editar y pausar horarios, e IS OWNER, uno por job. El job corre con los privilegios de Run as, que por defecto es su creador; Databricks recomienda un service principal en producción. Los tags sirven para filtrar jobs y se propagan a los job clusters para atribuir costos.',
          'Con Git provider, cada run toma una instantánea de una rama, tag o commit, y todas las tareas usan la misma versión; los Git folders quedan para desarrollo. Para infraestructura como código se usan Declarative Automation Bundles, antes Databricks Asset Bundles: YAML desplegado con la CLI. Un job desplegado por bundle es de solo lectura en la interfaz salvo que pulses Disconnect from source.',
        ],
        source: source('Identidades, permisos y privilegios de Lakeflow Jobs', 'jobs/privileges'),
      },
      {
        title: 'System tables para observar todos los jobs',
        body: [
          'El esquema system.lakeflow, antes system.workflow, guarda jobs, job_tasks, job_run_timeline y job_task_run_timeline, además de pipelines, con 365 días de retención y datos de todos los workspaces de la misma región de la cuenta. Necesitas USE y SELECT sobre el esquema o ser administrador; los registros suelen aparecer en menos de una hora.',
          'jobs y job_tasks son tablas SCD2: para el estado actual toma la fila con change_time más reciente y excluye las que tienen delete_time. Las tablas timeline dividen los runs largos en tramos por hora y solo el último tramo trae result_state y termination_code. Al unirlas con system.billing.usage puedes calcular el costo de cada job.',
        ],
        source: source('Referencia de las system tables de jobs', 'admin/system-tables/jobs'),
      },
    ],
    diagram: {
      title: 'El job del laboratorio: ingesta, decisión, bucle y gold',
      caption: 'ingest publica task values; has_rows decide con If/else; si es true, by_region recorre las regiones con For each y gold corre con Run if All succeeded; si es false, solo corre no_data. Un horario pausado y las notificaciones de Failure envuelven todo el job.',
      layers: [
        { label: 'Disparo', nodes: ['Scheduled 0 0 6 * * ? (pausado)', 'Run now with different settings'] },
        { label: 'Ingesta', nodes: ['ingest: notebook con widgets', 'Task values: row_count y regions'] },
        { label: 'Decisión If/else', nodes: ['has_rows: row_count > 0', 'true → by_region', 'false → no_data'] },
        { label: 'Bucle For each', nodes: ['by_region: Inputs = regions, Concurrency 2', 'region_total: region = {{input}}'] },
        { label: 'Gold y control', nodes: ['gold: Run if All succeeded', 'Notificación por correo en Failure', 'Repair run reejecuta solo lo fallido'] },
      ],
    },
    comparison: {
      title: 'Tipos de disparador de Lakeflow Jobs',
      headers: ['Disparador', 'Cuándo arranca un run', 'Requisitos y límites', 'Opciones clave', 'Encaja con'],
      rows: [
        ['None (manual)', 'Al pulsar Run now o por API u orquestador externo', 'Ninguno', 'Run now with different settings', 'Pruebas y orquestación externa'],
        ['Scheduled', 'En un horario Simple o Advanced', 'Intervalo mínimo de 10 s; puede retrasarse minutos', 'Quartz cron, zona horaria, UTC', 'Lotes diarios u horarios'],
        ['File arrival', 'Al llegar archivos nuevos a un volumen o external location', 'Unity Catalog; sin file events, 10 000 archivos y 50 jobs', 'Minimum time between triggers, Wait after last change', 'Datos que llegan sin horario fijo'],
        ['Table update', 'Cuando cambian una o todas las tablas vigiladas', 'Hasta 25 tablas; SELECT para Run as', 'Any o All tables, Wait after last change', 'Cadenas que dependen de tablas de otros equipos'],
        ['Continuous', 'Siempre: un run nuevo al terminar el anterior', 'Una instancia; sin dependencias ni retry policy', 'Task retry mode, backoff exponencial', 'Streaming siempre activo'],
        ['Upstream job completion / Model update', 'Al terminar otros jobs o cambiar un modelo de UC', 'Beta', 'Resultado esperado del job; versión o alias', 'Cadenas entre jobs y MLOps'],
      ],
      sources: [source('Disparadores', 'jobs/triggers'), source('Horarios', 'jobs/scheduled'), source('File arrival', 'jobs/file-arrival-triggers'), source('Table update', 'jobs/trigger-table-update'), source('Jobs continuos', 'jobs/continuous')],
    },
    lab: {
      title: 'Un job con If/else, For each y Repair run en Free Edition',
      goal: 'Crear tres notebooks parametrizados, orquestarlos en un job serverless con un parámetro de fecha, decidir con un If/else sobre un task value, recorrer regiones con un For each, forzar un fallo, recuperarlo con Repair run sin repetir trabajo y dejar un horario diario en pausa.',
      minutes: 90,
      requirements: [
        'Databricks Free Edition: solo cómputo serverless y como máximo 5 tareas de job concurrentes por cuenta; por eso el For each usa Concurrency 2.',
        'Permiso para crear un esquema en tu catálogo; sustituye <tu_catalogo> por el resultado de current_catalog() en el SQL y en el parámetro catalog del job.',
        'Una carpeta s07_lab en tu Workspace para los notebooks 01_ingest, 02_region, 03_gold y 04_no_data, todos en Python.',
      ],
      steps: [
        {
          title: 'Prepara el esquema y los datos de origen',
          body: 'Abre un notebook nuevo con cómputo serverless y lenguaje SQL. orders_raw tiene siete pedidos de dos fechas; las otras tres tablas quedan vacías y las llenará el job. Las tablas se crean antes para que los notebooks solo escriban y los tipos queden fijos.',
          code: { language: 'sql', code: `SELECT current_catalog();
CREATE SCHEMA IF NOT EXISTS <tu_catalogo>.s07_lab;
CREATE OR REPLACE TABLE <tu_catalogo>.s07_lab.orders_raw (order_id INT, order_date DATE, region STRING, amount DOUBLE);
INSERT INTO <tu_catalogo>.s07_lab.orders_raw VALUES
  (1, DATE'2026-01-05', 'north', 10.0),
  (2, DATE'2026-01-05', 'south', 20.0),
  (3, DATE'2026-01-05', 'north', 5.5),
  (4, DATE'2026-01-05', 'east', 12.0),
  (5, DATE'2026-01-05', 'south', 8.0),
  (6, DATE'2026-01-06', 'north', 7.0),
  (7, DATE'2026-01-06', 'west', 3.0);
CREATE OR REPLACE TABLE <tu_catalogo>.s07_lab.orders_bronze (order_id INT, order_date DATE, region STRING, amount DOUBLE);
CREATE OR REPLACE TABLE <tu_catalogo>.s07_lab.region_totals (process_date DATE, region STRING, orders BIGINT, total DOUBLE);
CREATE OR REPLACE TABLE <tu_catalogo>.s07_lab.daily_summary (process_date DATE, regions BIGINT, orders BIGINT, total DOUBLE);
SELECT order_date, count(*) FROM <tu_catalogo>.s07_lab.orders_raw GROUP BY ALL ORDER BY 1;` },
          check: 'La última consulta devuelve 2026-01-05 → 5 y 2026-01-06 → 2; orders_bronze, region_totals y daily_summary existen y están vacías.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Escribe el notebook de ingesta',
          body: 'Crea el notebook Python s07_lab/01_ingest. Lee los parámetros como widgets, copia a bronze solo la fecha pedida con replaceWhere, borra los totales previos de esa fecha para que el job sea idempotente y publica dos task values: row_count y la lista ordenada de regiones. No lo ejecutes a mano: el widget catalog vacío solo tiene valor dentro del job.',
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
          check: 'El notebook 01_ingest está guardado en s07_lab y usa dbutils.jobs.taskValues.set dos veces.',
        },
        {
          title: 'Escribe el notebook de cada región',
          body: 'Crea s07_lab/02_region. Será la tarea anidada del For each: recibe region en cada iteración, calcula pedidos y total de esa región para la fecha y los agrega a region_totals. Usa append porque las iteraciones corren en paralelo y las inserciones a ciegas no chocan entre sí; la limpieza ya la hizo ingest.',
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
          check: 'El notebook 02_region está guardado y lee tres widgets: catalog, process_date y region.',
        },
        {
          title: 'Escribe los notebooks gold y no_data',
          body: 'Crea s07_lab/03_gold con este código: si force_fail vale true lanza un error antes de escribir, y si no resume region_totals de la fecha en daily_summary con replaceWhere. Crea también s07_lab/04_no_data con dos líneas: dbutils.widgets.text("process_date", "") y print("Sin pedidos para", dbutils.widgets.get("process_date")).',
          code: { language: 'python', code: `from pyspark.sql import functions as F

dbutils.widgets.text("catalog", "")
dbutils.widgets.text("process_date", "2026-01-05")
dbutils.widgets.text("force_fail", "false")
catalog = dbutils.widgets.get("catalog")
d = dbutils.widgets.get("process_date")
if dbutils.widgets.get("force_fail") == "true":
    raise Exception(f"Fallo forzado para {d}")

schema = f"{catalog}.s07_lab"
summary = (spark.table(f"{schema}.region_totals")
    .filter(F.col("process_date") == d)
    .groupBy("process_date")
    .agg(F.count("*").alias("regions"), F.sum("orders").alias("orders"), F.round(F.sum("total"), 2).alias("total")))
(summary.write.mode("overwrite")
    .option("replaceWhere", f"process_date = '{d}'")
    .saveAsTable(f"{schema}.daily_summary"))
display(summary)` },
          check: 's07_lab contiene 01_ingest, 02_region, 03_gold y 04_no_data.',
        },
        {
          title: 'Crea el job con la tarea ingest',
          body: 'En la barra lateral haz clic en Jobs & Pipelines, luego en Create y en Job. Haz clic en el mosaico Notebook; si no aparece, usa Add another task type. Escribe ingest en Task name, elige s07_lab/01_ingest en Path, comprueba que Compute sea Serverless y pulsa Save task. Cambia el nombre del job, New Job con fecha y hora, por s07_job.',
          check: 'El job s07_job aparece en Jobs & Pipelines con una tarea ingest en la pestaña Tasks.',
          screen: { id: 's07-create', highlight: ['jobs', 'create', 'job'] },
        },
        {
          title: 'Agrega parámetros y una notificación al job',
          body: 'En Job details pulsa Edit parameters y crea tres pares Key / Value: catalog = <tu_catalogo>, process_date = 2026-01-05 y force_fail = false; pulsa Save. En producción process_date podría ser {{job.start_time.iso_date}}, en UTC. Luego, en Job notifications, pulsa Edit notifications, Add notification, elige Email address con tu correo, marca Failure y guarda.',
          check: 'Job details muestra los tres parámetros y una notificación de Failure por correo.',
          screen: { id: 's07-job', highlight: ['editParameters', 'editNotifications'] },
        },
        {
          title: 'Agrega el If/else has_rows',
          body: 'Con ingest seleccionada en el grafo pulsa + Add task, escribe has_rows y en Type elige If/else condition. En el primer cuadro Condition escribe {{tasks.ingest.values.row_count}}, elige el operador > y en el segundo escribe 0. Depends on queda en ingest. Pulsa Save task. > compara como número; == compararía como cadena.',
          check: 'El grafo muestra ingest → has_rows, y has_rows tiene dos salidas posibles: true y false.',
          screen: { id: 's07-task', highlight: ['type', 'ifElse', 'conditionLeft', 'operator', 'conditionRight', 'saveTask'] },
        },
        {
          title: 'Agrega el For each by_region',
          body: 'Selecciona has_rows, pulsa + Add task, nombra by_region y elige For each; Depends on debe ser has_rows (true). En Inputs escribe {{tasks.ingest.values.regions}} y en Concurrency 2. Pulsa Add a task to loop over: tarea Notebook region_total con Path s07_lab/02_region y Parameters region = {{input}}, process_date = {{job.parameters.process_date}} y catalog = {{job.parameters.catalog}}. Guarda ambas.',
          check: 'by_region aparece como un nodo con region_total dentro y depende de has_rows (true).',
          screen: { id: 's07-foreach', highlight: ['inputs', 'concurrency', 'addLoopTask', 'nestedParams'] },
        },
        {
          title: 'Agrega gold y la rama false',
          body: 'Agrega gold, Notebook s07_lab/03_gold, con Depends on = by_region y Run if dependencies = All succeeded. En Retries pulsa Add, desmarca Enable serverless auto-optimization (may include additional retries) y pulsa Confirm, para que el fallo forzado no se reintente. Agrega no_data, Notebook s07_lab/04_no_data, con Depends on = has_rows (false).',
          check: 'El grafo tiene cinco tareas: ingest → has_rows → by_region → gold y has_rows (false) → no_data.',
          screen: { id: 's07-task', highlight: ['dependsOn', 'runIf', 'allSucceeded', 'retries'] },
        },
        {
          title: 'Ejecuta el job y lee el grafo del run',
          body: 'Pulsa Run now. En la pestaña Runs haz clic en la hora de inicio del run para abrir Job run details. En Graph, has_rows muestra la evaluación true, by_region muestra tres iteraciones y no_data no se ejecuta. Abre ingest y mira el panel Output con los task values. Usa Timeline para ver el solapamiento de las iteraciones y luego verifica las tablas.',
          code: { language: 'sql', code: `SELECT * FROM <tu_catalogo>.s07_lab.region_totals ORDER BY process_date, region;
SELECT * FROM <tu_catalogo>.s07_lab.daily_summary ORDER BY process_date;` },
          check: 'row_count = 5 y regions = ["east", "north", "south"]. region_totals: east 1 y 12.0; north 2 y 15.5; south 2 y 28.0. daily_summary: 2026-01-05 con 3 regiones, 5 pedidos y 55.5.',
          screen: { id: 's07-run', highlight: ['graphTab', 'timelineTab', 'hasRowsNode', 'byRegionNode'] },
        },
        {
          title: 'Fuerza un fallo con otros parámetros',
          body: 'Junto a Run now abre ▾ y elige Run now with different settings. Cambia process_date a 2026-01-06 y force_fail a true, y pulsa Run. ingest, has_rows y by_region terminan bien; gold falla al instante porque desactivaste los reintentos automáticos, y como gold es una tarea hoja el run queda Failed. Deberías recibir el correo de Failure.',
          code: { language: 'sql', code: `SELECT process_date, count(*) AS n FROM <tu_catalogo>.s07_lab.region_totals GROUP BY ALL ORDER BY 1;
SELECT count(*) AS days FROM <tu_catalogo>.s07_lab.daily_summary;` },
          check: 'region_totals: 2026-01-05 → 3 y 2026-01-06 → 2 (north 7.0 y west 3.0). daily_summary sigue con 1 fila, porque gold falló antes de escribir.',
          screen: { id: 's07-job', highlight: ['runNowMenu', 'runNowDifferent'] },
        },
        {
          title: 'Repara el run sin repetir lo que ya funcionó',
          body: 'Abre el run fallido desde la matriz y pulsa Repair run. El diálogo Repair job run solo lista gold, porque no tiene dependientes. Agrega el parámetro force_fail = false, que sobrescribe el valor del run, y pulsa Repair run. Como ingest y by_region no se repiten, region_totals no duplica filas; la matriz suma una columna nueva para la reparación.',
          code: { language: 'sql', code: `SELECT * FROM <tu_catalogo>.s07_lab.daily_summary ORDER BY process_date;
SELECT count(*) AS bronze FROM <tu_catalogo>.s07_lab.orders_bronze;
SELECT count(*) AS totals FROM <tu_catalogo>.s07_lab.region_totals;` },
          check: 'daily_summary: 2026-01-05 → 3, 5 y 55.5; 2026-01-06 → 2, 2 y 10.0. orders_bronze = 7 y region_totals = 5. gold pasa de rojo a verde.',
          screen: { id: 's07-run', highlight: ['repairRun', 'repairTasks', 'repairParams', 'repairConfirm'] },
        },
        {
          title: 'Prueba la rama false del If/else',
          body: 'Lanza Run now with different settings con process_date = 2026-01-09 y force_fail = false. No hay pedidos: ingest publica row_count = 0, has_rows evalúa false, corre no_data y by_region y gold no se ejecutan. Abre el Output de no_data para ver el mensaje. Repite las consultas del paso anterior para confirmar que nada cambió.',
          check: 'no_data imprime Sin pedidos para 2026-01-09; orders_bronze = 7, region_totals = 5 y daily_summary = 2 filas, igual que antes.',
        },
        {
          title: 'Programa el job y déjalo en pausa',
          body: 'En Job details pulsa Add trigger, elige Scheduled y Schedule type Advanced: todos los días a las 6:00 en tu zona horaria. Marca Show Cron Syntax para ver la expresión Quartz y elige Paused en Trigger Status antes de guardar, o guarda y pulsa Pause. Como el job es idempotente, una ejecución programada con la fecha por defecto no duplicaría datos.',
          code: { language: 'text', code: `0 0 6 * * ?
# segundos minutos horas día-del-mes mes día-de-la-semana` },
          check: 'Schedules & Triggers muestra un horario Scheduled en estado Paused y no se crean runs nuevos.',
          screen: { id: 's07-trigger', highlight: ['addTrigger', 'scheduled', 'scheduleType', 'showCron', 'triggerStatus', 'saveTrigger'] },
        },
      ],
      wrapUp: 'Convertiste cuatro notebooks en un job de cinco tareas. Un task value alimentó al If/else y al For each, que procesó tres regiones en paralelo; gold resumió 55.5 para el 5 de enero. El fallo forzado del 6 de enero se reparó reejecutando solo gold, sin duplicar filas, y el 9 de enero tomó la rama false. Pausa o elimina el job al terminar para no consumir tu cuota de Free Edition.',
      sources: [
        { label: 'Límites de Free Edition', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Configurar y editar Lakeflow Jobs', 'jobs/configure-job'),
        source('Tarea Notebook', 'jobs/tasks/notebook'),
        source('Configurar parámetros de job', 'jobs/job-parameters'),
        source('Acceder a parámetros desde una tarea', 'jobs/parameter-use'),
        source('Task values', 'jobs/task-values'),
        source('Tarea If/else', 'jobs/tasks/if-else'),
        source('Tarea For each', 'jobs/tasks/for-each'),
        source('Run if dependencies', 'jobs/run-if'),
        source('Serverless compute for workflows y reintentos', 'jobs/run-serverless-jobs'),
        source('Ejecutar con otros parámetros', 'jobs/run-now'),
        source('Monitorear Lakeflow Jobs', 'jobs/monitor'),
        source('Repair run', 'jobs/repair-job-failures'),
        source('Notificaciones', 'jobs/notifications'),
        source('Horarios', 'jobs/scheduled'),
      ],
    },
    certification: {
      intro: 'Preguntas de práctica originales, alineadas con la guía oficial del examen. No son preguntas reales del examen.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Working with Lakeflow Jobs', 'Troubleshooting, Monitoring, and Optimization', 'Databricks Intelligence Platform', 'Governance and Security'] }],
      questions: [
        { domain: 'Working with Lakeflow Jobs', question: 'Un job tiene tres tareas encadenadas y un horario diario. ¿Qué crea Databricks cada vez que el horario se dispara?', options: ['Una copia nueva del job', 'Un run con un task run por cada tarea', 'Un clúster all-purpose permanente', 'Una tarea nueva al final del grafo'], answer: 1, explanation: 'Cada disparo crea un run del mismo job; dentro de él cada tarea tiene su task run con estado, salida y duración propios.' },
        { domain: 'Databricks Intelligence Platform', question: '¿Qué cómputo recomienda Databricks para una tarea de notebook en un job de producción?', options: ['Un clúster all-purpose compartido', 'Un SQL warehouse pro', 'Serverless compute for jobs', 'Un clúster clásico con Spark Submit'], answer: 2, explanation: 'Serverless es el valor por defecto y el recomendado para notebooks; all-purpose no se recomienda para producción.' },
        { domain: 'Working with Lakeflow Jobs', question: 'Una tarea cleanup debe correr cuando terminen A y B, sin importar si fallaron. ¿Qué Run if eliges?', options: ['All succeeded', 'None failed', 'At least one failed', 'All done'], answer: 3, explanation: 'All done corre después de que todas las dependencias terminan, cualquiera que sea su estado.' },
        { domain: 'Working with Lakeflow Jobs', question: 'Quieres que el parámetro run_date tome por defecto la fecha de inicio de cada run. ¿Qué valor configuras?', options: ['{{job.start_time.iso_date}}', '{{start_date}}, la variable recomendada', '{{job.run_id}}', '{{task.execution_count}}'], answer: 0, explanation: '{{job.start_time.iso_date}} devuelve la fecha ISO de inicio en UTC; {{start_date}} está obsoleta.' },
        { domain: 'Working with Lakeflow Jobs', question: 'Un If/else evalúa {{tasks.check.values.ratio}} == 12 y el task value vale 12.0. ¿Cuál es el resultado?', options: ['true, porque se comparan como números', 'false, porque == compara como cadenas', 'La tarea falla siempre', 'true, pero solo en serverless'], answer: 1, explanation: '== y != comparan cadenas, así que 12.0 == 12 es falso; los operadores >, >=, < y <= sí comparan números.' },
        { domain: 'Working with Lakeflow Jobs', question: 'Debes aplicar el mismo notebook a 20 tablas con hasta 4 en paralelo y sin duplicar configuración. ¿Qué usas?', options: ['20 tareas notebook iguales', 'Un job continuous con 20 reintentos', 'Un For each anidado dentro de otro For each', 'Un For each con Inputs como array JSON y Concurrency 4'], answer: 3, explanation: 'For each repite una tarea anidada por cada elemento de Inputs y Concurrency controla cuántas iteraciones corren a la vez; no admite otro For each anidado.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'gold falló por un bug que ya corregiste; bronze y silver terminaron bien. ¿Qué haces para recuperar el run con el menor costo?', options: ['Run now completo para que todo sea consistente', 'Clonar el job y ejecutar solo gold', 'Repair run, que reejecuta las tareas no exitosas y sus dependientes', 'Esperar al próximo horario'], answer: 2, explanation: 'Repair run reejecuta solo lo no exitoso y sus dependientes con la configuración actual del job, sin repetir tareas exitosas.' },
        { domain: 'Working with Lakeflow Jobs', question: 'Un job programado cada 5 minutos a veces tarda 7. Tiene Maximum concurrent runs = 1 y Queue desactivada. ¿Qué pasa con el run que llega mientras otro sigue activo?', options: ['Se omite y queda Skipped', 'Cancela el run activo', 'Corre en paralelo', 'Convierte el job en continuous'], answer: 0, explanation: 'Si el job ya alcanzó su máximo de runs activos, el nuevo run se omite; con Queue activada esperaría hasta 48 horas.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'Una tarea tiene tres reintentos y quieres un aviso por cada intento fallido. ¿Qué configuras?', options: ['Duration warning del job', 'Un tag en la tarea', 'Notificación Failure a nivel de job', 'Notificación Failure a nivel de tarea'], answer: 3, explanation: 'Las notificaciones del job no se envían en los reintentos de tareas; para avisar en cada fallo se usan notificaciones de tarea.' },
        { domain: 'Working with Lakeflow Jobs', question: 'Llegan archivos a un volumen de Unity Catalog a horas irregulares y en ráfagas. Quieres un run por ráfaga completa. ¿Qué disparador usas?', options: ['Scheduled cada minuto', 'Continuous', 'File arrival con Wait after last change', 'Table update sobre el volumen'], answer: 2, explanation: 'File arrival vigila el volumen y Wait after last change espera a que deje de llegar archivos antes de lanzar el run.' },
        { domain: 'Governance and Security', question: 'Un job de producción corre como su creador, que dejará la empresa. ¿Qué recomienda Databricks?', options: ['Dar IS OWNER a un grupo', 'Cambiar Run as a un service principal', 'Dar CAN MANAGE RUN a todos los usuarios', 'Eliminar los permisos del job'], answer: 1, explanation: 'Con un service principal en Run as, los privilegios del job no dependen de una persona; un grupo no puede ser IS OWNER.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'Necesitas analizar con SQL los runs fallidos del último año en todos los workspaces de la región. ¿Dónde consultas?', options: ['La pestaña Runs del job', 'El event log de un pipeline', 'system.lakeflow.job_run_timeline', 'Los tags del job'], answer: 2, explanation: 'Las system tables de system.lakeflow retienen 365 días y cubren la región; la pestaña Runs solo guarda 60 días por job.' },
        { domain: 'Working with Lakeflow Jobs', question: '¿Qué restricción tiene dbutils.jobs.taskValues.set?', options: ['El valor debe ser JSON válido de hasta 48 KiB y se publica desde Python', 'Solo acepta cadenas de hasta 1 KB', 'Funciona igual en notebooks SQL y Scala', 'El valor se guarda 365 días en una tabla de sistema'], answer: 0, explanation: 'taskValues es una utilidad de Python; el valor debe serializarse como JSON y su representación no puede superar 48 KiB.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-create', answer: 'job', question: 'Abriste el menú Create en Jobs & Pipelines. ¿Dónde haces clic para crear un job nuevo?', explanation: 'Create → Job abre el editor del job y te pide configurar la primera tarea, por ejemplo un notebook.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-task', answer: 'atLeastOneFailed', question: 'Una tarea alert debe correr solo si falla alguna de sus dependencias. ¿Qué opción de Run if dependencies eliges?', explanation: 'At least one failed corre si falla al menos una dependencia; si todo sale bien, la tarea queda Excluded.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-foreach', answer: 'concurrency', question: '¿Dónde indicas cuántas iteraciones del For each pueden correr a la vez?', explanation: 'Concurrency fija las iteraciones en paralelo; vale 1 por defecto y en Free Edition conviene un valor bajo.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's07-run', answer: 'repairRun', question: 'Estás en Job run details de un run fallido. ¿Dónde haces clic para reejecutar solo las tareas no exitosas?', explanation: 'Repair run abre el diálogo Repair job run con las tareas no exitosas y sus dependientes, y permite sobrescribir parámetros.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-trigger', answer: 'fileArrival', question: 'Quieres que el job corra cuando lleguen archivos nuevos a un volumen. ¿Qué tipo de disparador eliges?', explanation: 'File arrival vigila un volumen o una external location de Unity Catalog y lanza un run al detectar archivos nuevos.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's07-job', answer: 'runNowDifferent', question: 'Quieres lanzar una sola vez el job con otra fecha sin cambiar su configuración. ¿Qué opción usas?', explanation: 'Run now with different settings sobrescribe parámetros o elige tareas solo para ese run; la configuración del job no cambia.' },
      ],
    },
  };
})(globalThis);
