// Sesión 6: contenido original basado en la documentación oficial verificada (noviembre de 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.es.s06 = {
    deepDive: [
      {
        title: 'Incremental significa guardar estado, no solo filtrar',
        body: [
          'Una carga incremental necesita recordar qué procesó: un high-water mark (la última fecha o secuencia), la lista de archivos ya cargados o el checkpoint de un stream. Ese estado es tan importante como los datos. Si lo pierdes, la siguiente ejecución vuelve a empezar desde cero; si lo conservas pero cambias la tabla destino a mano, estado y datos quedan desalineados.',
          'El checkpoint de Structured Streaming guarda offsets, commits, estado y metadatos de la consulta. Cada consulta necesita su propio checkpoint: nunca lo compartas entre streams. Si borras los archivos del checkpoint o apuntas a una ruta nueva, la próxima ejecución empieza de cero, y en una tabla en modo append eso significa filas duplicadas.',
        ],
        source: source('Checkpoints de Structured Streaming', 'structured-streaming/checkpoints'),
      },
      {
        title: 'COPY INTO es idempotente por archivo',
        body: [
          'COPY INTO carga archivos de una ruta en una tabla Delta y omite en ejecuciones posteriores los archivos que ya cargó, incluso si se modificaron después de cargarlos. Por eso puedes programarlo en un job sin duplicar datos. La opción COPY_OPTIONS (\'force\' = \'true\') desactiva esa idempotencia y vuelve a cargar todo: úsala solo cuando quieras recargar a propósito.',
          'FILES (hasta 1000 nombres) o PATTERN (un glob) acotan qué archivos entran; no se pueden combinar. VALIDATE revisa el análisis, el esquema y las restricciones sin escribir en la tabla. Una consulta SELECT dentro de FROM te permite convertir tipos mientras cargas, algo útil con CSV, que no trae tipos propios.',
        ],
        source: source('Referencia de COPY INTO', 'sql/language-manual/delta-copy-into'),
      },
      {
        title: 'mergeSchema en COPY INTO y la tabla sin esquema',
        body: [
          'Desde Databricks Runtime 11.3 LTS puedes crear una tabla Delta vacía sin columnas y dejar que COPY INTO infiera el esquema con COPY_OPTIONS (\'mergeSchema\' = \'true\'). Esa tabla de marcador no admite INSERT INTO ni MERGE INTO hasta que COPY INTO la llena por primera vez. mergeSchema en COPY_OPTIONS permite que el esquema de la tabla evolucione con los datos entrantes.',
          'En FORMAT_OPTIONS, mergeSchema se refiere al lector: combina los esquemas de varios archivos de origen. Son dos niveles distintos. Para documentación actual, Databricks indica que los usuarios de SQL que buscan una ingesta de archivos más escalable y robusta deberían usar tablas de streaming; COPY INTO sigue disponible y se comporta como se describe aquí.',
        ],
        source: source('Primeros pasos con COPY INTO', 'ingestion/cloud-object-storage/copy-into/'),
      },
      {
        title: 'Cómo Auto Loader recuerda los archivos',
        body: [
          'Auto Loader es la fuente de Structured Streaming cloudFiles. A medida que descubre archivos, guarda sus metadatos en un almacén clave-valor RocksDB dentro del checkpoint, lo que le da procesamiento exactly-once y reanudación tras fallos sin que tú administres ningún estado. Puede procesar miles de millones de archivos en una carga histórica y millones de archivos por hora en ingesta casi en tiempo real.',
          'cloudFiles.includeExistingFiles vale true por defecto y solo se evalúa en el primer arranque del stream: cambiarlo después no tiene efecto. cloudFiles.maxFilesPerTrigger limita los archivos por micro-batch (1000 por defecto). Auto Loader no garantiza el orden en que descubre o procesa los archivos, así que tu lógica posterior debe tolerar llegadas desordenadas.',
        ],
        source: source('¿Qué es Auto Loader?', 'ingestion/cloud-object-storage/auto-loader/'),
      },
      {
        title: 'Directory listing frente a file notification',
        body: [
          'Directory listing es el modo predeterminado: lista la carpeta de entrada y solo requiere acceso de lectura al almacenamiento. File notification usa servicios de eventos y colas de la nube; Databricks lo recomienda para la mayoría de las cargas cuando se combina con file events en la ubicación externa, que usan una sola cola por ubicación y se activan con cloudFiles.useManagedFileEvents.',
          'El modo clásico de notificación crea por cada stream una suscripción Azure Event Grid y una cola Azure Queue Storage, con permisos elevados. Para volúmenes de Unity Catalog, directory listing funciona desde Databricks Runtime 13.3 LTS, la notificación clásica no está admitida y file events requiere Databricks Runtime 14.3 LTS. Puedes cambiar de modo entre reinicios sin perder la garantía exactly-once.',
        ],
        source: source('Modos de detección de archivos', 'ingestion/cloud-object-storage/auto-loader/file-detection-modes'),
      },
      {
        title: 'Inferencia de esquema: schemaLocation, hints y tipos',
        body: [
          'Configurar cloudFiles.schemaLocation habilita la inferencia y la evolución del esquema; Auto Loader guarda el historial en un directorio _schemas dentro de esa ruta. Puede ser el mismo directorio que checkpointLocation. Para inferir, muestrea los primeros 50 GB o 1000 archivos que descubre, el límite que se alcance primero. En Lakeflow pipelines, Databricks administra el schema location y el checkpoint por ti.',
          'Para JSON, CSV y XML, que no codifican tipos, Auto Loader infiere todas las columnas como STRING para evitar conflictos de tipos al evolucionar. cloudFiles.inferColumnTypes = true pide tipos exactos, y cloudFiles.schemaHints fija los tipos que ya conoces, por ejemplo "order_id BIGINT, amount DECIMAL(10,2)". Los hints solo se aplican cuando no proporcionas un esquema completo.',
        ],
        source: source('Inferencia y evolución de esquema en Auto Loader', 'ingestion/cloud-object-storage/auto-loader/schema'),
      },
      {
        title: 'Los cinco modos de evolución del esquema',
        body: [
          'Con addNewColumns, el modo predeterminado cuando no das esquema, el stream se detiene con UnknownFieldException después de agregar las columnas nuevas al esquema guardado; al reiniciarlo continúa con el esquema actualizado. Por eso Databricks recomienda ejecutar estos streams en Lakeflow Jobs con reinicio automático. Las columnas existentes no cambian de tipo.',
          'addNewColumnsWithTypeWidening (Public Preview, Databricks Runtime 16.4 o superior) además amplía tipos admitidos, como int a long. rescue nunca evoluciona el esquema ni falla: envía las columnas nuevas a la columna de datos rescatados. failOnNewColumns falla hasta que actualices el esquema o retires el archivo. none ignora las columnas nuevas y es el predeterminado cuando proporcionas un esquema.',
        ],
        source: source('Modos de evolución de esquema', 'ingestion/cloud-object-storage/auto-loader/schema'),
      },
      {
        title: '_rescued_data conserva lo que no encaja',
        body: [
          'Cuando Auto Loader infiere el esquema agrega automáticamente la columna _rescued_data. Ahí guarda, como un blob JSON junto con la ruta del archivo de origen, los valores que no pudo interpretar por columnas ausentes del esquema, tipos incompatibles o diferencias de mayúsculas. Así un dato inesperado no se pierde en silencio y puedes investigarlo después.',
          'Con la columna rescatada activa, un tipo incompatible no descarta el registro en DROPMALFORMED ni lanza error en FAILFAST: solo los registros corruptos, como un JSON incompleto, fallan. badRecordsPath, en ese caso, recibe solo los registros mal formados. Una fila con _rescued_data no nula es una candidata natural a cuarentena antes de llegar a silver.',
        ],
        source: source('Columna de datos rescatados', 'ingestion/cloud-object-storage/auto-loader/schema'),
      },
      {
        title: 'Serverless solo acepta disparadores que terminan',
        body: [
          'En cómputo serverless para notebooks y jobs, Structured Streaming admite Trigger.AvailableNow, el recomendado, y Trigger.Once, obsoleto y no recomendado. ProcessingTime y Continuous no están admitidos. Si no indicas ningún disparador, Spark usa ProcessingTime de cero segundos y la consulta falla con INFINITE_STREAMING_TRIGGER_NOT_SUPPORTED: en Free Edition siempre debes escribir trigger(availableNow=True).',
          'availableNow procesa todo lo pendiente, quizá en varios micro-batches, y se detiene; con maxFilesPerTrigger o maxBytesPerTrigger acotas cada lote. Estas restricciones no aplican a los modos de procesamiento de Lakeflow pipelines: para ingesta continua usa un pipeline serverless en modo continuo o availableNow dentro de un job continuo.',
        ],
        source: source('Limitaciones del cómputo serverless', 'compute/serverless/limitations'),
      },
      {
        title: 'MERGE incremental sin ambigüedades',
        body: [
          'MERGE falla con DELTA_MULTIPLE_SOURCE_ROW_MATCHING_TARGET_ROW_IN_MERGE si más de una fila de origen coincide con la misma fila destino. En cargas incrementales el mismo identificador suele llegar varias veces, así que conserva primero una sola versión por clave, por ejemplo la de mayor secuencia. Una condición WHEN MATCHED AND s.seq > t.seq evita que una versión vieja que llega tarde sobrescriba una nueva.',
          'Dentro de un stream puedes aplicar MERGE por micro-batch con foreachBatch, pero ese MERGE debe ser idempotente porque un reinicio puede repetir un lote. Para escrituras simples en foreachBatch, las opciones txnAppId y txnVersion permiten a Delta ignorar lotes duplicados; si cambias de checkpoint, usa un txnAppId nuevo.',
        ],
        source: source('Lecturas y escrituras streaming con Delta', 'structured-streaming/delta-lake'),
      },
      {
        title: 'Dónde encaja Lakeflow',
        body: [
          'Databricks organiza la ingesta en tres capas: Structured Streaming, con máxima personalización; Lakeflow pipelines, la implementación de Spark Declarative Pipelines que administra orquestación, calidad y errores; y los conectores administrados de Lakeflow Connect para fuentes como Salesforce o SQL Server. La recomendación es empezar por la capa más administrada que cubra tu fuente.',
          'Para almacenamiento en la nube, Auto Loader existe en las tres formas: Python o Scala con Structured Streaming, Python o SQL en Lakeflow pipelines, y SQL con tablas de streaming sobre read_files. En Azure, Lakeflow pipelines requiere el plan Premium; Free Edition permite un pipeline activo por tipo, así que el laboratorio usa notebooks con availableNow.',
        ],
        source: source('Ingesta con SQL y APIs de Spark', 'ingestion/'),
      },
    ],
    diagram: {
      title: 'Recorrido de un archivo por Auto Loader',
      caption: 'Flujo conceptual: los archivos llegan a un volumen o a una ubicación externa, Auto Loader los descubre, aplica el esquema guardado, rescata lo que no encaja y registra su avance en el checkpoint antes de escribir en bronze.',
      layers: [
        { label: 'Almacenamiento de origen', nodes: ['Volumen Unity Catalog (/Volumes/...)', 'ADLS abfss:// en una ubicación externa', 'S3 o GCS'] },
        { label: 'Descubrimiento de archivos', nodes: ['Directory listing (predeterminado)', 'File notification con file events (recomendado)', 'Notificación clásica: Event Grid + Queue Storage'] },
        { label: 'Lectura cloudFiles', nodes: ['schemaLocation/_schemas: esquema inferido y su evolución', 'schemaHints o inferColumnTypes', '_rescued_data: valores que no encajan'] },
        { label: 'Estado', nodes: ['Checkpoint: RocksDB con archivos descubiertos', 'Offsets y commits: exactly-once'] },
        { label: 'Destino', nodes: ['Tabla Delta bronze (append)', 'MERGE por clave hacia silver'] },
      ],
    },
    comparison: {
      title: 'COPY INTO frente a Auto Loader',
      headers: ['Criterio', 'COPY INTO', 'Auto Loader'],
      rows: [
        ['Interfaz', 'Sentencia SQL en Databricks SQL y Databricks Runtime', 'Fuente cloudFiles de Structured Streaming en Python o Scala; SQL mediante read_files en tablas de streaming y Lakeflow pipelines'],
        ['Seguimiento de archivos e idempotencia', 'Omite archivos ya cargados, aunque se hayan modificado; force = true desactiva la idempotencia', 'Metadatos de archivos en RocksDB dentro del checkpoint; exactly-once; allowOverwrites es false por defecto'],
        ['Escala', 'Bueno para cargas programadas; con directorios de muchísimos archivos Databricks recomienda Auto Loader', 'Miles de millones de archivos en cargas históricas y millones por hora en ingesta continua'],
        ['Inferencia de esquema', 'Opciones del lector (por ejemplo inferSchema) o tabla sin esquema con mergeSchema en COPY_OPTIONS', 'Muestra de 50 GB o 1000 archivos; JSON y CSV como STRING salvo inferColumnTypes o schemaHints'],
        ['Evolución de esquema', 'COPY_OPTIONS (\'mergeSchema\' = \'true\') evoluciona la tabla destino', 'schemaEvolutionMode: addNewColumns (predeterminado), addNewColumnsWithTypeWidening, rescue, failOnNewColumns o none'],
        ['Datos que no encajan', 'Modos de análisis del lector; VALIDATE revisa sin escribir', '_rescued_data incluida por defecto, con la ruta del archivo de origen'],
        ['Descubrimiento y latencia', 'Cada ejecución revisa la ruta indicada; la latencia depende de la programación del job', 'Directory listing o file notification con file events; availableNow programado o modo continuo en pipelines'],
        ['Uso en Lakeflow', 'Para SQL, Databricks recomienda tablas de streaming como alternativa escalable', 'Recomendado en Lakeflow pipelines, que administran esquema y checkpoint automáticamente'],
      ],
      sources: [
        source('Referencia de COPY INTO', 'sql/language-manual/delta-copy-into'),
        source('¿Qué es Auto Loader?', 'ingestion/cloud-object-storage/auto-loader/'),
        source('Primeros pasos con COPY INTO', 'ingestion/cloud-object-storage/copy-into/'),
      ],
    },
    lab: {
      title: 'Ingesta incremental de archivos en Free Edition',
      goal: 'Escribir lotes pequeños de CSV y JSON en un volumen, cargarlos con COPY INTO y con Auto Loader usando availableNow, comprobar la idempotencia al repetir, provocar una evolución de esquema y un dato rescatado, y aplicar los cambios en silver con un MERGE repetible.',
      minutes: 90,
      requirements: [
        'Databricks Free Edition con cómputo serverless y permiso para crear un esquema, tablas y volúmenes administrados en tu catálogo; aplican cuotas y restricciones de red saliente.',
        'Un notebook serverless con celdas SQL y Python; ejecuta los pasos en orden porque las celdas Python reutilizan variables y funciones de pasos anteriores.',
        'El paso 11 es opcional: requiere un workspace Azure Databricks, una ubicación externa propia y permisos en la cuenta de almacenamiento, no Free Edition.',
      ],
      steps: [
        {
          title: 'Prepara el esquema y dos volúmenes',
          body: 'Anota el resultado de current_catalog() y sustituye <tu_catalogo> en todo el laboratorio por ese catálogo con permisos de escritura. landing recibe los archivos de origen; ops guarda el checkpoint y el esquema de Auto Loader, separados de los datos. También puedes crear los volúmenes en Catalog desde el esquema con Create → Volume.',
          code: { language: 'sql', code: 'SELECT current_catalog();\nCREATE SCHEMA IF NOT EXISTS <tu_catalogo>.s06_lab;\nCREATE VOLUME IF NOT EXISTS <tu_catalogo>.s06_lab.landing;\nCREATE VOLUME IF NOT EXISTS <tu_catalogo>.s06_lab.ops;' },
          check: 'El esquema s06_lab contiene los volúmenes administrados landing y ops.',
          screen: { id: 'catalog', highlight: ['create', 'volume'] },
        },
        {
          title: 'Escribe el primer lote CSV con código',
          body: 'En una celda Python define las rutas y escribe dos archivos CSV pequeños con dbutils.fs.put. Así el laboratorio es reproducible sin descargar nada. Cada archivo tiene encabezado y una fecha updated_at, que sería el high-water mark si filtraras por fecha. Revisa la carpeta csv del volumen en Catalog para ver los archivos.',
          code: { language: 'python', code: 'catalog = "<tu_catalogo>"\nns = f"{catalog}.s06_lab"\nlanding = f"/Volumes/{catalog}/s06_lab/landing"\nops = f"/Volumes/{catalog}/s06_lab/ops"\nfrom pyspark.sql import functions as F\nfrom decimal import Decimal\n\nheader = "order_id,customer,amount,updated_at\\n"\ndbutils.fs.put(f"{landing}/csv/orders_001.csv",\n    header + "1,A,10.00,2026-10-01\\n2,B,20.00,2026-10-01\\n3,C,30.00,2026-10-01\\n", True)\ndbutils.fs.put(f"{landing}/csv/orders_002.csv",\n    header + "4,A,15.00,2026-10-02\\n5,B,5.00,2026-10-02\\n", True)\ndisplay(dbutils.fs.ls(f"{landing}/csv/"))' },
          check: 'La carpeta csv contiene orders_001.csv (3 filas) y orders_002.csv (2 filas): 5 filas de datos en total.',
          screen: { id: 's06-volume', highlight: ['csvDir'] },
        },
        {
          title: 'Carga el lote con COPY INTO',
          body: 'Crea la tabla destino con tipos explícitos y convierte las columnas en el SELECT, porque CSV no trae tipos. COPY INTO registra qué archivos cargó. El resultado muestra cuántas filas se insertaron; luego comprueba el conteo y el total de la tabla.',
          code: { language: 'sql', code: 'CREATE TABLE IF NOT EXISTS <tu_catalogo>.s06_lab.orders_copy (\n  order_id INT, customer STRING, amount DECIMAL(10,2), updated_at DATE);\n\nCOPY INTO <tu_catalogo>.s06_lab.orders_copy\nFROM (\n  SELECT CAST(order_id AS INT) AS order_id, customer,\n         CAST(amount AS DECIMAL(10,2)) AS amount,\n         CAST(updated_at AS DATE) AS updated_at\n  FROM \'/Volumes/<tu_catalogo>/s06_lab/landing/csv/\')\nFILEFORMAT = CSV\nFORMAT_OPTIONS (\'header\' = \'true\');\n\nSELECT count(*) AS filas, sum(amount) AS total FROM <tu_catalogo>.s06_lab.orders_copy;' },
          check: 'COPY INTO informa 5 filas insertadas; la tabla tiene 5 filas y un total de 80.00 (10 + 20 + 30 + 15 + 5).',
        },
        {
          title: 'Repite para probar la idempotencia y agrega un archivo',
          body: 'Ejecuta el mismo COPY INTO sin archivos nuevos: no debe insertar nada. Luego agrega orders_003.csv y repite: solo entra el archivo nuevo. Como alternativa, puedes subir el archivo con New → Add or upload data → Upload files to a volume y elegir la carpeta csv como destino. No uses force = true: recargaría todos los archivos y duplicaría filas.',
          code: { language: 'python', code: 'copy_sql = f"""\nCOPY INTO {ns}.orders_copy\nFROM (SELECT CAST(order_id AS INT) AS order_id, customer,\n             CAST(amount AS DECIMAL(10,2)) AS amount,\n             CAST(updated_at AS DATE) AS updated_at\n      FROM \'{landing}/csv/\')\nFILEFORMAT = CSV\nFORMAT_OPTIONS (\'header\' = \'true\')"""\n\ndisplay(spark.sql(copy_sql))   # sin archivos nuevos: 0 filas\nassert spark.table(f"{ns}.orders_copy").count() == 5\n\ndbutils.fs.put(f"{landing}/csv/orders_003.csv",\n    header + "6,C,12.00,2026-10-03\\n7,A,8.00,2026-10-03\\n", True)\ndisplay(spark.sql(copy_sql))   # solo orders_003.csv: 2 filas\ncopy_table = spark.table(f"{ns}.orders_copy")\nassert copy_table.count() == 7\nassert copy_table.agg(F.sum("amount")).first()[0] == Decimal("100.00")' },
          check: 'La primera repetición inserta 0 filas; la segunda inserta 2. La tabla queda con 7 filas y un total de 100.00.',
          screen: { id: 's06-upload', highlight: ['uploadFiles', 'destination'] },
        },
        {
          title: 'Ingiere JSON con Auto Loader y availableNow',
          body: 'Escribe un primer archivo JSON y define run_bronze(), que lee la carpeta json con cloudFiles, guarda esquema y checkpoint en el volumen ops y escribe en orders_bronze. Los schemaHints fijan tipos de identificador, secuencia y monto; el resto se infiere como STRING. trigger(availableNow=True) es obligatorio en serverless. Copia la ruta de la carpeta desde Catalog si quieres confirmarla.',
          code: { language: 'python', code: 'import json\n\ndef put_json(name, rows):\n    body = "\\n".join(json.dumps(r) for r in rows) + "\\n"\n    dbutils.fs.put(f"{landing}/json/{name}", body, True)\n\nput_json("orders_001.json", [\n    {"order_id": 101, "seq": 1, "customer": "A", "amount": 10.50, "status": "new"},\n    {"order_id": 102, "seq": 2, "customer": "B", "amount": 20.00, "status": "new"},\n    {"order_id": 103, "seq": 3, "customer": "C", "amount": 7.25, "status": "new"},\n])\n\nckpt = f"{ops}/orders_bronze"\n\ndef run_bronze():\n    q = (spark.readStream.format("cloudFiles")\n        .option("cloudFiles.format", "json")\n        .option("cloudFiles.schemaLocation", ckpt)\n        .option("cloudFiles.schemaHints", "order_id BIGINT, seq BIGINT, amount DECIMAL(10,2)")\n        .load(f"{landing}/json/")\n        .select("*", F.col("_metadata.file_name").alias("source_file"))\n        .writeStream\n        .option("checkpointLocation", ckpt)\n        .option("mergeSchema", "true")\n        .trigger(availableNow=True)\n        .toTable(f"{ns}.orders_bronze"))\n    q.awaitTermination()\n\nrun_bronze()\nbronze = spark.table(f"{ns}.orders_bronze")\nbronze.printSchema()\nassert bronze.count() == 3' },
          check: 'orders_bronze tiene 3 filas; el esquema muestra order_id y seq como bigint, amount como decimal(10,2), customer y status como string, además de _rescued_data y source_file.',
          screen: { id: 's06-volume', highlight: ['jsonDir', 'copyPath'] },
        },
        {
          title: 'Repite sin archivos nuevos y luego con uno nuevo',
          body: 'Ejecuta run_bronze() otra vez: el checkpoint ya conoce orders_001.json y no se agrega nada. Después escribe orders_002.json y repite: solo se leen sus dos registros. El conteo por source_file demuestra qué archivo aportó cada fila.',
          code: { language: 'python', code: 'run_bronze()\nassert spark.table(f"{ns}.orders_bronze").count() == 3\n\nput_json("orders_002.json", [\n    {"order_id": 104, "seq": 4, "customer": "A", "amount": 12.00, "status": "new"},\n    {"order_id": 105, "seq": 5, "customer": "B", "amount": 3.00, "status": "new"},\n])\nrun_bronze()\nbronze = spark.table(f"{ns}.orders_bronze")\nassert bronze.count() == 5\ndisplay(bronze.groupBy("source_file").count().orderBy("source_file"))' },
          check: 'La repetición sin archivos nuevos deja 3 filas; tras orders_002.json hay 5 filas: 3 de orders_001.json y 2 de orders_002.json.',
        },
        {
          title: 'Crea silver y aplica el primer MERGE',
          body: 'upsert_silver() toma bronze, descarta filas con datos rescatados o monto nulo, conserva la versión de mayor seq por order_id y aplica MERGE. La condición s.seq > t.seq impide que una versión vieja sobrescriba una nueva. Si bronze todavía no tiene la columna channel, la función la agrega vacía.',
          code: { language: 'python', code: 'from pyspark.sql.window import Window\n\nspark.sql(f"""CREATE TABLE IF NOT EXISTS {ns}.orders_silver (\n  order_id BIGINT, customer STRING, amount DECIMAL(10,2),\n  status STRING, channel STRING, seq BIGINT)""")\n\ndef upsert_silver():\n    src = spark.table(f"{ns}.orders_bronze")\n    if "channel" not in src.columns:\n        src = src.withColumn("channel", F.lit(None).cast("string"))\n    valid = src.filter("_rescued_data IS NULL AND order_id IS NOT NULL AND amount IS NOT NULL")\n    latest = (valid.withColumn("rn", F.row_number().over(\n            Window.partitionBy("order_id").orderBy(F.col("seq").desc())))\n        .filter("rn = 1")\n        .select("order_id", "customer", "amount", "status", "channel", "seq"))\n    latest.createOrReplaceTempView("s06_updates")\n    return spark.sql(f"""\n      MERGE INTO {ns}.orders_silver t USING s06_updates s ON t.order_id = s.order_id\n      WHEN MATCHED AND s.seq > t.seq THEN UPDATE SET\n        t.customer = s.customer, t.amount = s.amount, t.status = s.status,\n        t.channel = s.channel, t.seq = s.seq\n      WHEN NOT MATCHED THEN INSERT (order_id, customer, amount, status, channel, seq)\n        VALUES (s.order_id, s.customer, s.amount, s.status, s.channel, s.seq)""")\n\ndisplay(upsert_silver())\nsilver = spark.table(f"{ns}.orders_silver")\nassert silver.count() == 5\nassert silver.agg(F.sum("amount")).first()[0] == Decimal("52.75")' },
          check: 'El MERGE inserta 5 filas y no actualiza ninguna; silver suma 52.75 (10.50 + 20.00 + 7.25 + 12.00 + 3.00).',
        },
        {
          title: 'Provoca una evolución de esquema con una columna nueva',
          body: 'orders_003.json trae la columna channel y una versión nueva del pedido 102. Con el modo predeterminado addNewColumns, la primera ejecución agrega channel al esquema guardado y se detiene con UnknownFieldException; la segunda continúa con el esquema nuevo. El bucle reintenta una sola vez, como haría un job con reinicio automático.',
          code: { language: 'python', code: 'put_json("orders_003.json", [\n    {"order_id": 106, "seq": 6, "customer": "A", "amount": 5.00, "status": "new", "channel": "web"},\n    {"order_id": 102, "seq": 7, "customer": "B", "amount": 22.00, "status": "shipped", "channel": "store"},\n])\n\nfor attempt in (1, 2):\n    try:\n        run_bronze()\n        break\n    except Exception as e:\n        if attempt == 2:\n            raise\n        print("Primera ejecución detenida por el esquema nuevo:", str(e)[:300])\n\nbronze = spark.table(f"{ns}.orders_bronze")\nassert "channel" in bronze.columns and bronze.count() == 7\ndisplay(bronze.select("order_id", "seq", "status", "channel", "source_file").orderBy("seq"))' },
          check: 'Ves el mensaje de la primera ejecución detenida; bronze queda con 7 filas, channel es NULL en las 5 primeras y vale web y store en las nuevas.',
        },
        {
          title: 'Observa un dato rescatado',
          body: 'orders_004.json envía amount como el texto "abc", que no encaja con el hint DECIMAL(10,2). Auto Loader no descarta la fila: deja amount en NULL y guarda el valor original y la ruta del archivo en _rescued_data. Abre el archivo desde Catalog con Open in Editor para comparar lo que llegó con lo que se cargó.',
          code: { language: 'python', code: 'put_json("orders_004.json", [\n    {"order_id": 107, "seq": 8, "customer": "C", "amount": "abc", "status": "new", "channel": "web"},\n])\nrun_bronze()\nbronze = spark.table(f"{ns}.orders_bronze")\nassert bronze.count() == 8\nrescued = bronze.filter("_rescued_data IS NOT NULL")\ndisplay(rescued.select("order_id", "amount", "_rescued_data", "source_file"))\nassert rescued.count() == 1' },
          check: 'bronze tiene 8 filas; exactamente una, el pedido 107, tiene amount NULL y un _rescued_data que contiene "abc" y la ruta de orders_004.json.',
          screen: { id: 's06-volume', highlight: ['file', 'openEditor'] },
        },
        {
          title: 'Aplica el segundo MERGE y repítelo',
          body: 'El segundo MERGE actualiza el pedido 102 con su versión seq 7 e inserta el 106; el 107 queda fuera de silver porque tiene datos rescatados. Repetir el MERGE no cambia nada: ninguna fila tiene una secuencia mayor y no hay claves nuevas. Revisa en la salida del MERGE las columnas de filas actualizadas e insertadas.',
          code: { language: 'python', code: 'display(upsert_silver())   # 1 actualizada (102) y 1 insertada (106)\nsilver = spark.table(f"{ns}.orders_silver")\nassert silver.count() == 6\nassert silver.agg(F.sum("amount")).first()[0] == Decimal("59.75")\nassert silver.filter("order_id = 102").first()["status"] == "shipped"\n\ndisplay(upsert_silver())   # repetición: 0 actualizadas y 0 insertadas\nassert spark.table(f"{ns}.orders_silver").count() == 6\nquarantine = spark.table(f"{ns}.orders_bronze").filter("_rescued_data IS NOT NULL OR amount IS NULL")\nassert quarantine.count() == 1\nprint("bronze 8 = silver 6 + 1 versión sustituida (102, seq 2) + 1 rescatada (107)")' },
          check: 'El primer MERGE actualiza 1 fila e inserta 1; la repetición no cambia nada. silver tiene 6 filas y suma 59.75; el 102 está en shipped. Balance: 8 filas bronze = 6 silver + 1 versión sustituida + 1 en cuarentena.',
        },
        {
          title: 'Azure opcional: file events en una ubicación externa',
          body: 'Requiere Azure y no se ejecuta en Free Edition. En Catalog → Connect → External Locations elige la ubicación, abre el menú junto a Test connection y selecciona Edit. En Advanced Options marca Enable file events, elige File event type Automatic y pulsa Update; después usa Test connection. La credencial necesita roles como Storage Blob Data Contributor, Storage Queue Data Contributor y, para la configuración automática, Storage Account Contributor y EventGrid Data Contributor. Luego agrega cloudFiles.useManagedFileEvents = true al stream, en Databricks Runtime 14.3 LTS o superior.',
          check: 'Explicas por qué file events reemplaza el listado de la carpeta y qué permisos necesita, o dejas constancia de que omitiste esta extensión exclusiva de Azure.',
          screen: { id: 's06-fileEvents', highlight: ['edit', 'advanced', 'enableFileEvents', 'automatic'] },
        },
      ],
      wrapUp: 'COPY INTO cargó 7 filas en dos ejecuciones útiles y una repetición vacía, porque recuerda los archivos. Auto Loader llevó 8 filas a bronze con availableNow, evolucionó el esquema al aparecer channel y rescató un monto inválido. El MERGE dejó 6 pedidos en silver y fue estable al repetirse. Para reiniciar el laboratorio desde cero, borra juntos la tabla bronze y el directorio de checkpoint en ops: borrar solo uno de los dos desalinea estado y datos.',
      sources: [
        { label: 'Límites de Free Edition', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Archivos en volúmenes y subida desde la interfaz', 'volumes/volume-files'),
        source('Primeros pasos con COPY INTO', 'ingestion/cloud-object-storage/copy-into/'),
        source('Referencia de COPY INTO', 'sql/language-manual/delta-copy-into'),
        source('Esquema y datos rescatados en Auto Loader', 'ingestion/cloud-object-storage/auto-loader/schema'),
        source('Disparadores admitidos en serverless', 'compute/serverless/limitations'),
        source('Checkpoints de Structured Streaming', 'structured-streaming/checkpoints'),
        source('Columna de metadatos de archivo', 'ingestion/file-metadata-column'),
        source('Referencia de MERGE INTO', 'sql/language-manual/delta-merge-into'),
        source('File events en ubicaciones externas', 'connect/unity-catalog/cloud-storage/manage-external-locations'),
        source('Modo file notification de Auto Loader', 'ingestion/cloud-object-storage/auto-loader/file-notification-mode'),
      ],
    },
    certification: {
      intro: 'Preguntas de práctica originales, alineadas con las guías oficiales. No son preguntas reales del examen.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Ingestion and Loading', 'Data Transformation and Modeling', 'Databricks Intelligence Platform', 'Troubleshooting, Monitoring, and Optimization'] }],
      questions: [
        { domain: 'Data Ingestion and Loading', question: 'Repites un COPY INTO sobre la misma carpeta; uno de los archivos ya cargados se modificó desde entonces. ¿Qué ocurre?', options: ['Recarga solo el archivo modificado', 'Duplica todas las filas', 'Omite los archivos ya cargados, incluido el modificado', 'Falla con un error de idempotencia'], answer: 2, explanation: 'COPY INTO omite los archivos ya cargados aunque se hayan modificado después; solo force = true cambia ese comportamiento.' },
        { domain: 'Data Ingestion and Loading', question: '¿Qué opción de COPY_OPTIONS desactiva la idempotencia y vuelve a cargar archivos ya procesados?', options: ['mergeSchema', 'force', 'header', 'inferSchema'], answer: 1, explanation: 'force = true carga los archivos sin importar si ya se cargaron; mergeSchema solo permite evolucionar el esquema.' },
        { domain: 'Data Ingestion and Loading', question: 'Auto Loader infiere el esquema de archivos JSON sin inferColumnTypes ni schemaHints. ¿Qué tipos obtienen las columnas?', options: ['STRING en todas las columnas, incluidas las anidadas', 'Tipos numéricos exactos según la muestra', 'BINARY para evitar conflictos', 'Ninguno: la inferencia falla sin esquema'], answer: 0, explanation: 'Para JSON, CSV y XML Auto Loader infiere STRING por defecto; inferColumnTypes o schemaHints cambian ese resultado.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'Un stream de Auto Loader en el modo predeterminado se detiene con UnknownFieldException tras llegar una columna nueva. ¿Qué haces?', options: ['Borrar el checkpoint y empezar de cero', 'Cambiar el disparador a ProcessingTime', 'Eliminar la columna _rescued_data', 'Reiniciar el stream, porque el esquema guardado ya incluye la columna'], answer: 3, explanation: 'addNewColumns agrega la columna al esquema en schemaLocation antes de fallar; al reiniciar, el stream continúa con el esquema nuevo.' },
        { domain: 'Data Ingestion and Loading', question: '¿Qué schemaEvolutionMode nunca evoluciona el esquema, no detiene el stream y guarda las columnas nuevas en los datos rescatados?', options: ['addNewColumns', 'rescue', 'failOnNewColumns', 'none'], answer: 1, explanation: 'rescue mantiene el esquema fijo y registra las columnas nuevas en la columna rescatada; none las ignora sin rescatarlas.' },
        { domain: 'Databricks Intelligence Platform', question: 'En un notebook serverless, un writeStream sin disparador falla con INFINITE_STREAMING_TRIGGER_NOT_SUPPORTED. ¿Qué disparador usas?', options: ['processingTime="1 minute"', 'continuous="1 second"', 'availableNow=True', 'Ninguno: se quita la opción checkpointLocation'], answer: 2, explanation: 'Serverless admite AvailableNow, el recomendado, y Once, obsoleto; ProcessingTime y Continuous no están admitidos.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'Borras el checkpoint de un stream de Auto Loader que escribe en modo append, pero conservas la tabla. ¿Qué ocurre en la siguiente ejecución?', options: ['Reprocesa los archivos desde el inicio y duplica filas en la tabla', 'Solo lee los archivos nuevos', 'Elimina la tabla destino', 'Usa el último valor de la tabla como high-water mark'], answer: 0, explanation: 'Sin checkpoint la consulta empieza de cero; en append eso vuelve a escribir las filas ya cargadas.' },
        { domain: 'Data Ingestion and Loading', question: '¿Qué modo de detección de archivos recomienda Databricks para la mayoría de las cargas de Auto Loader?', options: ['Directory listing en todos los casos', 'Copiar los archivos a DBFS antes de leerlos', 'Una notificación clásica independiente por stream', 'File notification con file events en la ubicación externa'], answer: 3, explanation: 'File events usa una cola por ubicación externa y es más eficiente y escalable que listar directorios; se activa con cloudFiles.useManagedFileEvents.' },
        { domain: 'Data Transformation and Modeling', question: 'Un MERGE falla con DELTA_MULTIPLE_SOURCE_ROW_MATCHING_TARGET_ROW_IN_MERGE. ¿Cuál es la corrección adecuada?', options: ['Agregar force = true', 'Reemplazarlo por INSERT OVERWRITE', 'Conservar una sola fila por clave en el origen, la más reciente, antes del MERGE', 'Desactivar el checkpoint del stream'], answer: 2, explanation: 'Varias filas de origen para la misma fila destino hacen ambiguo el MERGE; deduplica el origen por clave antes de aplicarlo.' },
        { domain: 'Data Ingestion and Loading', question: 'Un equipo que trabaja solo con SQL quiere la ingesta incremental de archivos más escalable. ¿Qué recomienda Databricks?', options: ['COPY INTO con force = true', 'Tablas de streaming que leen con STREAM read_files', 'INSERT OVERWRITE diario de toda la carpeta', 'Un SELECT directo sobre la carpeta en cada consulta'], answer: 1, explanation: 'Databricks recomienda tablas de streaming, que usan Auto Loader, como alternativa escalable a COPY INTO para usuarios de SQL.' },
        { domain: 'Data Ingestion and Loading', question: 'Dos carpetas de origen distintas alimentan la misma tabla bronze con Auto Loader. ¿Qué necesitas?', options: ['Un checkpoint distinto para cada flujo de ingesta', 'Un único checkpoint compartido por ambos', 'Ningún checkpoint, porque availableNow no lo usa', 'Desactivar cloudFiles.schemaLocation'], answer: 0, explanation: 'Cada carga de Auto Loader requiere su propio checkpoint; compartirlo entre consultas rompe el seguimiento de archivos.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-upload', answer: 'destination', question: 'En Upload files to a volume, ¿dónde eliges el volumen o la carpeta que recibirá el archivo?', explanation: 'Destination volume permite elegir un volumen o directorio, o pegar su ruta; Create volume solo aparece si necesitas uno nuevo.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-volume', answer: 'copyPath', question: 'El menú de un elemento del volumen está abierto. ¿Dónde obtienes la ruta /Volumes/... que pasarás a load()?', explanation: 'Copy path copia la ruta del archivo o carpeta; es la ruta que usan COPY INTO y Auto Loader.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-volume', answer: 'createDirectory', question: 'Quieres separar los archivos CSV y JSON en carpetas dentro del volumen. ¿Dónde creas una carpeta vacía?', explanation: 'En la pestaña de resumen del volumen, Create directory crea un directorio vacío en el que luego subes archivos.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-fileEvents', answer: 'enableFileEvents', question: 'En el diálogo Edit de una ubicación externa, con Advanced Options abierto, ¿qué opción activa los eventos de archivo para Auto Loader?', explanation: 'Enable file events activa el servicio de eventos de la ubicación; después el stream usa cloudFiles.useManagedFileEvents.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's06-fileEvents', answer: 'automatic', question: 'Quieres que Databricks cree y administre la cola y la suscripción de eventos por ti. ¿Qué File event type eliges?', explanation: 'Automatic deja que Databricks configure Event Grid y la cola de almacenamiento; Provided exige que tú administres la cola.' },
      ],
    },
  };
})(globalThis);
