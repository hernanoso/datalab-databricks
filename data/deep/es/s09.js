// Sesión 9: contenido original basado en la documentación oficial de Lakeflow pipelines (revisada en noviembre de 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.es.s09 = {
    deepDive: [
      {
        title: 'Cuatro nombres para el mismo producto',
        body: [
          'Delta Live Tables (DLT) se anunció en junio de 2025 como Lakeflow Declarative Pipelines; el 12 de noviembre de 2025 pasó a llamarse Lakeflow Spark Declarative Pipelines. Hoy la documentación usa "Lakeflow pipelines" o "Spark Declarative Pipelines on Lakeflow": el producto de Databricks extiende el proyecto abierto Apache Spark Declarative Pipelines (SDP), incluido desde Spark 4.1.',
          'No hace falta migrar: el código DLT sigue funcionando. En Python, import dlt se sustituye por from pyspark import pipelines as dp; @dp.table crea streaming tables, @dp.materialized_view crea materialized views y @dlt.view pasa a @dp.temporary_view. Quedan restos del nombre antiguo: los SKU clásicos empiezan por DLT y los esquemas del event log conservan dlt. El examen puede decir LDP o SDP.',
        ],
        source: source('¿Qué pasó con Delta Live Tables (DLT)?', 'ldp/concepts/where-is-dlt'),
      },
      {
        title: 'Tres tipos de dataset con semánticas distintas',
        body: [
          'Una streaming table procesa cada registro exactamente una vez, suponiendo una fuente de solo inserción; sirve para ingesta y para datos que solo crecen. Una materialized view recalcula su resultado para reflejar el estado actual de la fuente y encaja con joins, agregaciones y fuentes que reciben updates o deletes. Una view temporal se evalúa a demanda, no se persiste y solo existe dentro del pipeline.',
          'Las streaming tables y las materialized views son tablas administradas de Unity Catalog y se pueden consultar fuera del pipeline. Además existen los sinks, destinos de streaming como tablas Delta, Kafka o Event Hubs. Una regla práctica: si varias consultas posteriores reutilizan un resultado o quieres inspeccionarlo durante el desarrollo, materialízalo; si es un paso intermedio, usa una view.',
        ],
        source: source('Conceptos de pipelines', 'ldp/concepts/'),
      },
      {
        title: 'Los flows mueven los datos, no las tablas',
        body: [
          'Un flow lee una fuente, aplica tu lógica y escribe en un destino. Al declarar CREATE OR REFRESH STREAMING TABLE ... AS SELECT se crea un flow por defecto con el mismo nombre que la tabla. También puedes declarar flows aparte con CREATE FLOW nombre AS INSERT INTO destino BY NAME SELECT ... o con @dp.append_flow, de modo que varias fuentes agreguen filas a una sola streaming table.',
          'Los append flows sustituyen a un UNION y permiten sumar una fuente nueva sin full refresh; INSERT INTO ONCE ejecuta un backfill una sola vez salvo que hagas full refresh. El nombre del flow identifica su checkpoint: si lo renombras, el pipeline lo trata como un flow nuevo. Las expectations se definen en la tabla destino, no dentro de @dp.append_flow.',
        ],
        source: source('Usar flows en Lakeflow pipelines', 'ldp/flow-examples'),
      },
      {
        title: 'AUTO CDC reemplaza a APPLY CHANGES',
        body: [
          'Para aplicar un feed de cambios declaras primero la streaming table destino y luego CREATE FLOW ... AS AUTO CDC INTO destino FROM STREAM(fuente) KEYS (...) SEQUENCE BY columna. En Python el equivalente es dp.create_auto_cdc_flow. SEQUENCE BY ordena los eventos, por lo que un update tardío con secuencia menor no pisa a uno más reciente. APPLY CHANGES sigue disponible con la misma sintaxis, pero Databricks recomienda AUTO CDC.',
          'STORED AS SCD TYPE 1 sobrescribe y conserva solo la última versión de cada clave. STORED AS SCD TYPE 2 crea una fila por versión con __START_AT y __END_AT; la versión vigente tiene __END_AT nulo. APPLY AS DELETE WHEN marca eliminaciones y APPLY AS TRUNCATE WHEN solo existe en SCD 1. AUTO CDC no está en Apache Spark y requiere serverless o las ediciones Pro o Advanced.',
        ],
        source: source('APIs AUTO CDC', 'ldp/cdc'),
      },
      {
        title: 'Expectations: avisar, descartar o fallar',
        body: [
          'Una expectation tiene nombre, una restricción booleana SQL y una acción. CONSTRAINT nombre EXPECT (expr) sin ON VIOLATION solo avisa: la fila llega al destino y se cuenta. ON VIOLATION DROP ROW la descarta antes de escribir y registra el conteo. ON VIOLATION FAIL UPDATE hace fallar la actualización y revierte la transacción. En Python son dp.expect, dp.expect_or_drop y dp.expect_or_fail.',
          'Las métricas de warn y drop aparecen en la pestaña Data quality; con fail no se registran porque la actualización se detiene. En modo triggered, el fallo de un flow no detiene los flows paralelos; en continuous detiene ese flow y sus dependientes. La restricción no admite funciones Python personalizadas, llamadas externas ni subconsultas a otras tablas, y el nombre debe ser único por dataset.',
        ],
        source: source('Expectations de calidad', 'ldp/expectations'),
      },
      {
        title: 'Triggered o continuous es independiente del tipo de tabla',
        body: [
          'Triggered, el modo por defecto, procesa lo disponible al iniciar la actualización y se detiene; conviene para frescura de minutos u horas y ahorra cómputo. Continuous procesa los datos según llegan y mantiene los recursos activos, útil para latencias de segundos a pocos minutos. Tanto las streaming tables como las materialized views se actualizan en cualquiera de los dos modos.',
          'Para producción continua, Databricks recomienda envolver el pipeline en un job continuo en lugar de activar Pipeline mode = Continuous: el job decide el modo de ejecución y tiene prioridad sobre la configuración del pipeline. pipelines.trigger.interval solo se usa en ejecución continua. Las streaming tables y materialized views independientes, creadas desde Databricks SQL, siempre se refrescan en modo triggered.',
        ],
        source: source('Modo triggered frente a continuous', 'ldp/concepts/pipeline-mode'),
      },
      {
        title: 'Serverless y ediciones del producto',
        body: [
          'Un pipeline nuevo usa por defecto Unity Catalog, el canal Current y cómputo serverless. Los pipelines serverless requieren Unity Catalog y la edición Advanced, que incluye todas las funciones. En cómputo clásico puedes elegir Core para ingesta de streaming, Pro para agregar CDC o Advanced para agregar expectations; si el código usa una función que la edición no admite, la actualización falla con un error explicativo.',
          'Serverless aporta refresh incremental de materialized views, stream pipelining y autoescalado vertical. Para pipelines triggered, la casilla Performance optimized acelera el arranque; desactivada, el modo estándar consume menos DBU y suele arrancar en cuatro a seis minutos. En serverless no puedes agregar un objeto clusters en el JSON ni reiniciar el proceso Python.',
        ],
        source: source('Configurar un pipeline serverless', 'ldp/serverless'),
      },
      {
        title: 'El Lakeflow Pipelines Editor trabaja con archivos',
        body: [
          'Creas un pipeline con New → ETL pipeline, o desde Jobs & Pipelines y desde Create en el explorador del workspace. El editor muestra un explorador de recursos con la carpeta raíz, transformations para el código fuente, explorations para notebooks de análisis y utilities para módulos Python. Los archivos .sql y .py pueden mezclarse y referenciar tablas definidas en otros archivos.',
          'Run pipeline ejecuta todos los archivos; Run file o Run table actualizan solo una parte y pueden dejar el grafo incompleto. Dry run valida definiciones sin materializar datos. Abajo están Pipeline graph, Tables, Performance, Issues y el event log. Mueve o renombra archivos desde el explorador del pipeline, porque hacerlo desde el workspace rompe la configuración del código fuente.',
        ],
        source: source('Lakeflow Pipelines Editor', 'ldp/multi-file-editor'),
      },
      {
        title: 'El event log es la fuente de verdad del pipeline',
        body: [
          'El event log guarda auditoría, progreso, calidad de datos y linaje. Por defecto es una tabla Delta oculta en el catálogo y esquema del pipeline; la consultas con event_log(<pipeline_id>) o event_log(TABLE(tabla)). Solo el propietario puede llamar a esa función, salvo que publiques el event log en Unity Catalog desde Advanced settings. No borres el event log ni su esquema.',
          'Los eventos de tipo flow_progress contienen details:flow_progress.data_quality.expectations con passed_records y failed_records por expectation, y data_quality.dropped_records con las filas descartadas. Databricks recomienda la tabla de sistema pipeline_events, en Beta, para observar todos los pipelines de una región. Las actualizaciones se conservan 60 días en la interfaz, pero sus eventos permanecen en el event log.',
        ],
        source: source('Event log del pipeline', 'ldp/monitor-event-logs'),
      },
      {
        title: 'Refresh, full refresh y cómo corre cada actualización',
        body: [
          'Un refresh normal procesa solo los registros nuevos en streaming tables y actualiza las materialized views, incrementalmente si es más eficiente. Un full refresh vacía las streaming tables, borra checkpoints y reprocesa toda la fuente: si la fuente ya no conserva datos, por ejemplo Kafka con retención corta, esos registros se pierden. Puedes impedirlo con la propiedad pipelines.reset.allowed = false.',
          'La configuración development indica si el pipeline corre en modo desarrollo o producción y es false por defecto. Además, una actualización no continua iniciada desde la interfaz reutiliza recursos y desactiva reintentos para depurar rápido; las lanzadas por jobs, la API o en modo continuous reintentan y reinician ante errores recuperables. Run now with different settings cambia ese comportamiento para una ejecución.',
        ],
        source: source('Ejecutar una actualización del pipeline', 'ldp/updates'),
      },
    ],
    diagram: {
      title: 'Un DAG declarativo de bronze a gold con su event log',
      caption: 'El pipeline deduce las flechas a partir de las consultas: las streaming tables leen archivos con STREAM read_files, silver aplica expectations, AUTO CDC mantiene clientes en SCD 1 y 2, gold es una materialized view y cada actualización deja métricas en el event log.',
      layers: [
        { label: 'Fuentes en un volumen', nodes: ['raw/orders/*.json', 'raw/customers_cdc/*.json'] },
        { label: 'Bronze: streaming tables', nodes: ['orders_bronze (STREAM read_files)', 'customers_cdc_bronze (STREAM read_files)'] },
        { label: 'Silver: calidad y CDC', nodes: ['orders_silver: expectations warn / drop / fail', 'customers_scd1: AUTO CDC SCD 1', 'customers_scd2: AUTO CDC SCD 2'] },
        { label: 'Gold: materialized view', nodes: ['sales_by_day', 'Consumidores SQL y BI'] },
        { label: 'Observabilidad', nodes: ['Event log: flow_progress y data_quality', 'Grafo y pestaña Data quality'] },
      ],
    },
    comparison: {
      title: 'Streaming table, materialized view y view temporal',
      headers: ['Aspecto', 'Streaming table', 'Materialized view', 'View temporal'],
      rows: [
        ['Cómo procesa', 'Cada registro una vez, de forma incremental', 'Recalcula el resultado; incremental cuando puede', 'Se evalúa a demanda'],
        ['Persistencia', 'Tabla administrada de Unity Catalog', 'Tabla administrada de Unity Catalog', 'No se persiste'],
        ['Fuente ideal', 'Solo inserciones: archivos, Kafka, Event Hubs', 'Fuentes con updates o deletes, joins y agregaciones', 'Pasos intermedios y validaciones'],
        ['Flows', 'Uno o varios: append y AUTO CDC', 'Solo el flow implícito de su definición', 'No es destino de flows'],
        ['Expectations', 'Sí', 'Sí', 'Sí; métricas solo si se evalúa'],
        ['Fuera del pipeline', 'Consultable por otros jobs y usuarios', 'Consultable por otros jobs y usuarios', 'Solo dentro del mismo pipeline'],
        ['Full refresh', 'Vacía datos y checkpoints y reprocesa la fuente', 'Mismo resultado que un refresh normal', 'No aplica'],
        ['Sintaxis', 'CREATE OR REFRESH STREAMING TABLE / @dp.table', 'CREATE OR REFRESH MATERIALIZED VIEW / @dp.materialized_view', 'CREATE TEMPORARY VIEW / @dp.temporary_view'],
      ],
      sources: [source('Conceptos de pipelines', 'ldp/concepts/'), source('Ejecutar una actualización', 'ldp/updates')],
    },
    lab: {
      title: 'Un pipeline declarativo con calidad y CDC en Free Edition',
      goal: 'Crear un pipeline ETL serverless con archivos SQL, cargar pedidos desde un volumen a bronze, filtrarlos en silver con expectations, agregarlos en una materialized view gold, comprobar la carga incremental y mantener una dimensión de clientes con AUTO CDC en SCD 1 y SCD 2.',
      minutes: 90,
      requirements: [
        'Databricks Free Edition: solo hay cómputo serverless y se permite un pipeline activo por tipo; detén otros pipelines ETL antes de empezar. Los pipelines serverless usan la edición Advanced, que incluye expectations y AUTO CDC.',
        'Permiso para crear un esquema y un volumen en tu catálogo; sustituye <tu_catalogo> por el resultado de current_catalog() en todo el laboratorio.',
        'Un notebook serverless para preparar datos y verificar conteos. No uses ese notebook como código fuente del pipeline: el código del pipeline vive en archivos .sql dentro de transformations.',
      ],
      steps: [
        {
          title: 'Prepara el esquema y el volumen',
          body: 'Abre un notebook nuevo con cómputo serverless y lenguaje SQL. Anota el resultado de current_catalog() y úsalo en lugar de <tu_catalogo>. El esquema s09_lab será el catálogo y esquema por defecto del pipeline; el volumen raw guardará los archivos JSON de entrada.',
          code: { language: 'sql', code: `SELECT current_catalog();
CREATE SCHEMA IF NOT EXISTS <tu_catalogo>.s09_lab;
CREATE VOLUME IF NOT EXISTS <tu_catalogo>.s09_lab.raw;` },
          check: 'Existen el esquema s09_lab y el volumen /Volumes/<tu_catalogo>/s09_lab/raw.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Escribe el primer lote de datos de ejemplo',
          body: 'En una celda Python del mismo notebook escribe dos archivos JSON Lines. Los pedidos incluyen a propósito un monto negativo, un order_id nulo y un pedido sin cliente. El feed de clientes trae inserciones, dos updates de C1 que llegan desordenados y un delete de C3; seq indica el orden real de los cambios.',
          code: { language: 'python', code: `catalog = "<tu_catalogo>"
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
          check: 'Las dos aserciones pasan: orders_1.json y cdc_1.json tienen seis registros cada uno.',
        },
        {
          title: 'Crea el pipeline ETL',
          body: 'En la barra lateral haz clic en New y elige ETL pipeline; también puedes entrar por Jobs & Pipelines. Cambia el nombre por s09_pipeline y, junto al nombre, haz clic en el catálogo y el esquema para elegir <tu_catalogo> y s09_lab. Comprueba que el pipeline queda con Unity Catalog, canal Current y cómputo serverless, los valores por defecto.',
          check: 'El Lakeflow Pipelines Editor muestra s09_pipeline con <tu_catalogo>.s09_lab como destino por defecto.',
          screen: { id: 's09-new', highlight: ['new', 'etlPipeline'] },
        },
        {
          title: 'Declara bronze en un archivo SQL',
          body: 'En el explorador del pipeline usa + → Transformation, nombra el archivo orders_bronze, elige SQL y pulsa Create; si el editor creó un archivo vacío my_transformation, cámbialo a SQL y úsalo o elimínalo desde el mismo explorador. read_files con STREAM usa Auto Loader; el esquema explícito evita sorpresas de inferencia y _metadata.file_name conserva el origen.',
          code: { language: 'sql', code: `CREATE OR REFRESH STREAMING TABLE orders_bronze
AS SELECT order_id, customer_id, amount, order_date,
  _metadata.file_name AS source_file
FROM STREAM read_files(
  '/Volumes/<tu_catalogo>/s09_lab/raw/orders/',
  format => 'json',
  schema => 'order_id INT, customer_id STRING, amount DOUBLE, order_date DATE'
);` },
          check: 'transformations contiene orders_bronze.sql y el editor no marca errores de sintaxis.',
          screen: { id: 's09-editor', highlight: ['catalogSchema', 'add', 'transformation', 'language'] },
        },
        {
          title: 'Declara silver con tres acciones de calidad',
          body: 'Crea otra transformación SQL llamada orders_silver. valid_id y positive_amount descartan filas; has_customer solo avisa y deja pasar la fila; has_date haría fallar la actualización. No agregues fechas nulas: el objetivo es ver métricas, no detener el pipeline. No escribes ningún orden: STREAM(orders_bronze) basta para que el pipeline cree la dependencia.',
          code: { language: 'sql', code: `CREATE OR REFRESH STREAMING TABLE orders_silver (
  CONSTRAINT valid_id EXPECT (order_id IS NOT NULL) ON VIOLATION DROP ROW,
  CONSTRAINT positive_amount EXPECT (amount > 0) ON VIOLATION DROP ROW,
  CONSTRAINT has_customer EXPECT (customer_id IS NOT NULL),
  CONSTRAINT has_date EXPECT (order_date IS NOT NULL) ON VIOLATION FAIL UPDATE
)
AS SELECT order_id, customer_id, amount, order_date, source_file
FROM STREAM(orders_bronze);` },
          check: 'transformations contiene orders_bronze.sql y orders_silver.sql; las tablas del pipeline se nombran sin catálogo porque usan el destino por defecto.',
        },
        {
          title: 'Declara gold como materialized view',
          body: 'Crea una tercera transformación SQL llamada sales_by_day. Es una agregación con semántica batch: no lleva STREAM porque la materialized view recalcula el resultado completo, y en serverless intenta hacerlo de forma incremental. Puedes consultarla desde fuera del pipeline como cualquier tabla de Unity Catalog.',
          code: { language: 'sql', code: `CREATE OR REFRESH MATERIALIZED VIEW sales_by_day
AS SELECT order_date, COUNT(*) AS orders, SUM(amount) AS total
FROM orders_silver
GROUP BY order_date;` },
          check: 'transformations contiene orders_bronze.sql, orders_silver.sql y sales_by_day.sql.',
        },
        {
          title: 'Valida con Dry run y ejecuta el pipeline',
          body: 'Pulsa Dry run para resolver definiciones sin escribir datos y revisa Issues. Luego pulsa Run pipeline. Abre Pipeline graph: verás orders_bronze → orders_silver → sales_by_day. Verifica los conteos desde tu notebook. Bronze recibe las seis filas; silver descarta los pedidos 3 y 4 y conserva el 6 con aviso.',
          code: { language: 'sql', code: `SELECT 'bronze' AS layer, count(*) AS n FROM <tu_catalogo>.s09_lab.orders_bronze
UNION ALL SELECT 'silver', count(*) FROM <tu_catalogo>.s09_lab.orders_silver
UNION ALL SELECT 'gold', count(*) FROM <tu_catalogo>.s09_lab.sales_by_day;
SELECT * FROM <tu_catalogo>.s09_lab.sales_by_day ORDER BY order_date;` },
          check: 'bronze = 6, silver = 4 y gold = 3. sales_by_day: 2026-01-05 → 2 pedidos y 30.0; 2026-01-06 → 1 y 30.0; 2026-01-07 → 1 y 15.0.',
          screen: { id: 's09-run', highlight: ['dryRun', 'runPipeline', 'graphTab'] },
        },
        {
          title: 'Lee las métricas de calidad en la interfaz y en el event log',
          body: 'Ve a Jobs & Pipelines, abre s09_pipeline, haz clic en el nodo orders_silver y elige la pestaña Data quality. Después consulta el event log desde el notebook con event_log(TABLE(...)); como propietario del pipeline puedes llamarlo. Hazlo antes del siguiente lote: la consulta suma todas las actualizaciones registradas.',
          code: { language: 'sql', code: `SELECT row_expectations.dataset AS dataset,
  row_expectations.name AS expectation,
  SUM(row_expectations.passed_records) AS passing_records,
  SUM(row_expectations.failed_records) AS failing_records
FROM (
  SELECT explode(from_json(details:flow_progress:data_quality:expectations,
    'array<struct<name: string, dataset: string, passed_records: int, failed_records: int>>')) row_expectations
  FROM event_log(TABLE(<tu_catalogo>.s09_lab.orders_silver))
  WHERE event_type = 'flow_progress'
)
GROUP BY ALL;` },
          check: 'valid_id, positive_amount y has_customer muestran 1 registro fallido cada una y has_date 0; en total se descartaron 2 filas y la fila con aviso sigue en silver.',
          screen: { id: 's09-monitor', highlight: ['jobs', 'silverNode', 'dataQuality'] },
        },
        {
          title: 'Agrega un archivo y ejecuta de forma incremental',
          body: 'Escribe un segundo archivo de pedidos y vuelve a pulsar Run pipeline, sin full refresh. Auto Loader solo lee el archivo nuevo, de modo que bronze procesa tres filas en esta actualización; positive_amount descarta el pedido 8 con monto 0. La materialized view refleja el nuevo estado de silver.',
          code: { language: 'python', code: `orders_2 = """{"order_id": 7, "customer_id": "C2", "amount": 12.5, "order_date": "2026-01-07"}
{"order_id": 8, "customer_id": "C1", "amount": 0.0, "order_date": "2026-01-08"}
{"order_id": 9, "customer_id": "C4", "amount": 40.0, "order_date": "2026-01-08"}
"""
dbutils.fs.put(f"{base}/orders/orders_2.json", orders_2, True)
# Después de Run pipeline, repite la consulta de conteos del paso 7.` },
          check: 'bronze = 9, silver = 6 y gold = 4. sales_by_day: 2026-01-05 → 2 y 30.0; 2026-01-06 → 1 y 30.0; 2026-01-07 → 2 y 27.5; 2026-01-08 → 1 y 40.0; suma total 127.5.',
        },
        {
          title: 'Mantén clientes con AUTO CDC en SCD 1 y SCD 2',
          body: 'Crea la transformación SQL customers_cdc y ejecuta Run pipeline. Primero se declara cada streaming table destino y luego su flow AUTO CDC con nombre único. SEQUENCE BY seq hace que el update Arequipa, que llega después pero con seq 2, no pise a Cusco con seq 3 en SCD 1, y que en SCD 2 quede como versión intermedia.',
          code: { language: 'sql', code: `CREATE OR REFRESH STREAMING TABLE customers_cdc_bronze
AS SELECT customer_id, name, city, operation, seq
FROM STREAM read_files(
  '/Volumes/<tu_catalogo>/s09_lab/raw/customers_cdc/',
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
          check: 'customers_scd1 tiene 2 filas: C1 en Cusco y C2 en Quito; C3 fue eliminado. customers_scd2 tiene 5 filas: C1 Lima (1→2), Arequipa (2→3) y Cusco (3→nulo), C2 Quito (1→nulo) y C3 Cali (1→2); 2 filas tienen __END_AT nulo.',
        },
        {
          title: 'Compara con un full refresh',
          body: 'Pulsa Run pipeline with full table refresh. Las streaming tables se vacían, pierden sus checkpoints y releen todos los archivos del volumen; las materialized views se recalculan. Como los tres archivos siguen en el volumen, el resultado coincide. Si hubieras borrado un archivo, sus filas desaparecerían de bronze, silver y gold.',
          code: { language: 'sql', code: `SELECT 'bronze' AS t, count(*) AS n FROM <tu_catalogo>.s09_lab.orders_bronze
UNION ALL SELECT 'silver', count(*) FROM <tu_catalogo>.s09_lab.orders_silver
UNION ALL SELECT 'gold', count(*) FROM <tu_catalogo>.s09_lab.sales_by_day
UNION ALL SELECT 'scd1', count(*) FROM <tu_catalogo>.s09_lab.customers_scd1
UNION ALL SELECT 'scd2', count(*) FROM <tu_catalogo>.s09_lab.customers_scd2;` },
          check: 'Después del full refresh: bronze = 9, silver = 6, gold = 4, scd1 = 2 y scd2 = 5, igual que antes, porque la fuente conserva todos los archivos.',
          screen: { id: 's09-run', highlight: ['fullRefresh', 'tablesTab'] },
        },
      ],
      wrapUp: 'Declaraste cinco datasets en archivos SQL y el pipeline dedujo el orden. Nueve pedidos entraron a bronze; tres reglas los clasificaron en seis filas de silver, tres descartes y un aviso, y gold resume cuatro fechas. AUTO CDC resolvió eventos desordenados en SCD 1 y conservó la historia en SCD 2. Al terminar, detén o elimina el pipeline para liberar tu único pipeline activo de Free Edition.',
      sources: [
        { label: 'Límites de Free Edition', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Configurar pipelines', 'ldp/configure-pipeline'),
        source('Lakeflow Pipelines Editor', 'ldp/multi-file-editor'),
        source('read_files y su uso en streaming tables', 'sql/language-manual/functions/read_files'),
        source('CREATE STREAMING TABLE (pipelines)', 'ldp/developer/ldp-sql-ref-create-streaming-table'),
        source('CREATE MATERIALIZED VIEW (pipelines)', 'ldp/developer/ldp-sql-ref-create-materialized-view'),
        source('Expectations', 'ldp/expectations'),
        source('Consultar el event log', 'ldp/monitor-event-logs'),
        source('Función event_log', 'sql/language-manual/functions/event_log'),
        source('AUTO CDC INTO (pipelines)', 'ldp/developer/ldp-sql-ref-apply-changes-into'),
        source('Ejemplos AUTO CDC SCD 1 y SCD 2', 'ldp/cdc'),
        source('Refresh y full refresh', 'ldp/updates'),
        source('Full refresh de streaming tables', 'ldp/full-refresh-st'),
      ],
    },
    certification: {
      intro: 'Preguntas de práctica originales, alineadas con la guía oficial del examen. No son preguntas reales del examen.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Ingestion and Loading', 'Data Transformation and Modeling', 'Working with Lakeflow Jobs', 'Troubleshooting, Monitoring, and Optimization', 'Databricks Intelligence Platform'] }],
      questions: [
        { domain: 'Data Ingestion and Loading', question: 'Llegan archivos JSON nuevos cada hora a un volumen y nunca se modifican. ¿Qué dataset de pipeline conviene para bronze?', options: ['Una view temporal', 'Una materialized view sin STREAM', 'Una streaming table con STREAM read_files', 'Un sink de Kafka'], answer: 2, explanation: 'La streaming table procesa cada registro una vez sobre una fuente de solo inserción, y STREAM read_files usa Auto Loader para leer solo lo nuevo.' },
        { domain: 'Data Transformation and Modeling', question: 'Un resultado gold une dos tablas cuyos registros se actualizan y eliminan. ¿Qué tipo de dataset mantiene el resultado coherente?', options: ['Una materialized view', 'Una streaming table de solo inserción', 'Un append flow con ONCE', 'Una view temporal publicada en el catálogo'], answer: 0, explanation: 'La materialized view refleja el estado actual de la fuente, incluidos updates y deletes; la streaming table supone una fuente que solo crece.' },
        { domain: 'Data Transformation and Modeling', question: 'Quieres conservar las filas inválidas en el destino pero contar cuántas fallan. ¿Qué cláusula usas?', options: ['EXPECT (...) ON VIOLATION DROP ROW', 'EXPECT (...) ON VIOLATION FAIL UPDATE', 'Un filtro WHERE en la consulta', 'CONSTRAINT nombre EXPECT (...) sin ON VIOLATION'], answer: 3, explanation: 'Sin ON VIOLATION, la acción es warn: la fila se escribe en el destino y la métrica de registros fallidos queda registrada.' },
        { domain: 'Data Transformation and Modeling', question: 'En un pipeline triggered, una expectation con FAIL UPDATE encuentra una fila inválida. ¿Qué ocurre?', options: ['La fila se corrige y se escribe', 'La actualización de ese flow falla y se revierte, sin detener flows paralelos', 'La fila se descarta y la actualización continúa', 'El pipeline pasa automáticamente a modo continuous'], answer: 1, explanation: 'FAIL UPDATE revierte la transacción y requiere intervención; en modo triggered el fallo de un flow no hace fallar a los flows paralelos.' },
        { domain: 'Data Ingestion and Loading', question: 'Una streaming table ya recibe datos de una región y debes sumar una región nueva sin full refresh. ¿Qué haces?', options: ['Reescribir la consulta con UNION y hacer full refresh', 'Crear una materialized view con ambas regiones', 'Agregar un append flow con CREATE FLOW ... INSERT INTO hacia la misma tabla', 'Renombrar el flow por defecto'], answer: 2, explanation: 'Los append flows permiten que varias fuentes escriban en una streaming table y evitan el full refresh que exigiría cambiar un UNION.' },
        { domain: 'Data Transformation and Modeling', question: 'Un feed CDC trae eventos desordenados y negocio necesita la historia de cada cliente. ¿Qué declaración encaja?', options: ['AUTO CDC INTO ... SEQUENCE BY ... STORED AS SCD TYPE 2', 'AUTO CDC INTO ... STORED AS SCD TYPE 1 con APPLY AS TRUNCATE', 'Una materialized view con MAX por cliente', 'Un append flow con INSERT INTO ONCE'], answer: 0, explanation: 'SEQUENCE BY ordena los eventos fuera de orden y SCD TYPE 2 crea una versión por cambio con __START_AT y __END_AT.' },
        { domain: 'Databricks Intelligence Platform', question: '¿Qué edición del producto requiere un pipeline serverless?', options: ['Core', 'Pro', 'Ninguna edición', 'Advanced'], answer: 3, explanation: 'Los pipelines serverless requieren la edición Advanced, que incluye CDC y expectations; el cómputo clásico admite Core, Pro y Advanced.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: '¿En qué parte del event log están los registros que pasaron o fallaron cada expectation?', options: ['En los eventos create_update, campo message', 'En los eventos flow_progress, details:flow_progress.data_quality.expectations', 'En system.information_schema.tables', 'En el historial Delta de la tabla silver'], answer: 1, explanation: 'Los eventos flow_progress contienen passed_records y failed_records por expectation, y dropped_records en data_quality.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'Una streaming table lee de Kafka con retención de 24 horas. ¿Qué riesgo tiene un full refresh una semana después?', options: ['Ninguno: el full refresh recupera la historia desde el checkpoint', 'Solo recalcula las materialized views', 'Se pierden los registros que ya no están en Kafka', 'Convierte la tabla en materialized view'], answer: 2, explanation: 'El full refresh vacía la tabla, borra checkpoints y reprocesa solo lo que la fuente todavía conserva.' },
        { domain: 'Working with Lakeflow Jobs', question: 'Necesitas que un pipeline corra de forma continua en producción. ¿Qué recomienda Databricks?', options: ['Orquestarlo con un job continuo y dejar Pipeline mode en triggered', 'Activar Pipeline mode = Continuous y no usar jobs', 'Programar Run file cada minuto', 'Ejecutar full refresh en cada actualización'], answer: 0, explanation: 'Un job continuo gestiona el ciclo de vida, tiene prioridad sobre Pipeline mode y habilita modos serverless como Standard.' },
        { domain: 'Data Transformation and Modeling', question: '¿Cuál es la importación recomendada hoy para definir datasets de pipeline en Python?', options: ['import dlt, que ya no funciona', 'from delta import pipelines', 'from databricks import lakeflow as lf', 'from pyspark import pipelines as dp'], answer: 3, explanation: 'El módulo actual es pyspark.pipelines, importado como dp; import dlt sigue funcionando, pero Databricks recomienda los nombres nuevos.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 's09-new', answer: 'etlPipeline', question: 'El menú New está abierto. ¿Dónde haces clic para crear un pipeline declarativo?', explanation: 'New → ETL pipeline crea el pipeline y abre el Lakeflow Pipelines Editor con Unity Catalog y serverless por defecto.' },
        { type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's09-editor', answer: 'transformation', question: 'Abriste el menú + del explorador del pipeline. ¿Qué opción crea un archivo que forma parte del código fuente?', explanation: 'Transformation crea un archivo de código fuente; Exploration y Utility crean archivos que no se evalúan al actualizar.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's09-run', answer: 'dryRun', question: '¿Dónde validas nombres de tablas y columnas sin materializar ni publicar datos?', explanation: 'Dry run resuelve las definiciones de datasets y flows y muestra los errores sin escribir ninguna tabla.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's09-run', answer: 'fullRefresh', question: 'Cambiaste la lógica de bronze y necesitas reprocesar todos los archivos desde cero. ¿Qué acción eliges?', explanation: 'Run pipeline with full table refresh vacía las streaming tables, borra checkpoints y reprocesa toda la fuente disponible.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's09-monitor', answer: 'dataQuality', question: 'Ya seleccionaste orders_silver en la página de monitoreo. ¿Dónde ves cuántas filas pasaron y fallaron sus expectations?', explanation: 'La pestaña Data quality del panel derecho muestra las métricas de warn y drop del dataset seleccionado.' },
      ],
    },
  };
})(globalThis);
