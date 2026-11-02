// Sesión 5: contenido original verificado contra la documentación oficial (noviembre de 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.es.s05 = {
    deepDive: [
      {
        title: 'El registro de transacciones es la tabla',
        body: [
          'Cada operación que modifica una tabla Delta escribe un commit JSON numerado en _delta_log y crea una versión nueva. Databricks agrega periódicamente esos commits en checkpoints Parquet para que un lector no tenga que recorrer todo el historial JSON; tú no interactúas con los checkpoints y su frecuencia puede cambiar sin aviso.',
          'Los lectores usan aislamiento de instantánea: leen la última versión confirmada y no ven escrituras a medias. Un archivo Parquet presente en la carpeta no forma parte de la tabla si ningún commit lo agrega; por eso nunca borras ni copias archivos de una tabla Delta a mano, sino que usas comandos que escriben en el registro.',
        ],
        source: source('Historial de tablas y checkpoints', 'tables/history'),
      },
      {
        title: 'Historial y time travel tienen retenciones distintas',
        body: [
          'DESCRIBE HISTORY se conserva según delta.logRetentionDuration, 30 días por defecto. El time travel necesita además los archivos de datos de esa versión, y VACUUM los elimina según delta.deletedFileRetentionDuration, 7 días por defecto. Ver una versión en el historial no garantiza poder consultarla.',
          'En Databricks Runtime 18.0 y posteriores, y en tablas administradas de Unity Catalog desde 12.2, el time travel se bloquea para versiones más antiguas que deletedFileRetentionDuration, y logRetentionDuration debe ser mayor o igual que esa propiedad. La documentación advierte que el historial no es un sistema de copias de seguridad a largo plazo.',
        ],
        source: source('Retención para time travel', 'tables/history'),
      },
      {
        title: 'RESTORE agrega una versión, no borra el pasado',
        body: [
          'RESTORE TABLE ... TO VERSION AS OF crea un commit nuevo cuya operación es RESTORE; la versión equivocada sigue visible en DESCRIBE HISTORY. Necesitas el permiso MODIFY y devuelve métricas como num_removed_files y num_restored_files. Si VACUUM ya eliminó los archivos de la versión objetivo, la restauración no es posible.',
          'Las entradas que agrega RESTORE tienen dataChange = true. Un stream que lee esa tabla puede tratar como nuevos los archivos restaurados y procesar filas duplicadas aguas abajo, así que revisa tus consumidores incrementales después de restaurar.',
        ],
        source: source('Restaurar una tabla', 'tables/history'),
      },
      {
        title: 'Evoluciona el esquema escritura por escritura',
        body: [
          'Schema enforcement rechaza escrituras con columnas que la tabla no tiene. Para un cambio intencional, Databricks recomienda habilitar la evolución en esa operación: .option("mergeSchema", "true") en escrituras DataFrame, MERGE WITH SCHEMA EVOLUTION (Runtime 15.4 LTS+) o INSERT WITH SCHEMA EVOLUTION (Runtime 18.1+). Las columnas nuevas se agregan al final y las filas existentes reciben NULL.',
          'La configuración de sesión spark.databricks.delta.schema.autoMerge.enabled se documenta como heredada y no recomendada para producción; además serverless solo permite fijar una lista corta de propiedades Spark. Para cambiar el tipo o renombrar una columna reescribiendo la tabla se usa overwriteSchema, que es otra herramienta con otro riesgo.',
        ],
        source: source('Evolución de esquema', 'tables/update-schema'),
      },
      {
        title: 'MERGE exige una fila de origen por fila destino',
        body: [
          'Solo una fila de origen puede coincidir con una fila destino; si varias coinciden y MERGE intenta actualizarla, la operación falla por ambigüedad. Deduplica la fuente por la clave antes de ejecutarlo. Desde Runtime 16.0 MERGE considera también las condiciones de WHEN MATCHED para detectar coincidencias duplicadas.',
          'Las cláusulas WHEN MATCHED se evalúan en orden y todas, salvo la última, necesitan condición. WHEN NOT MATCHED solo inserta y WHEN NOT MATCHED BY SOURCE puede actualizar o borrar filas destino sin pareja; agrégale una condición para no reescribir toda la tabla. Las métricas numTargetRowsInserted, numTargetRowsUpdated y numTargetRowsDeleted quedan en el historial.',
        ],
        source: source('Upsert con MERGE', 'delta/merge'),
      },
      {
        title: 'OPTIMIZE reescribe sin cambiar los datos',
        body: [
          'OPTIMIZE compacta archivos pequeños; la compactación bin-packing es idempotente y una lectura antes y después devuelve los mismos resultados porque no hay cambio de datos. Los archivos sustituidos dejan de estar en la versión actual, pero siguen en disco para las versiones anteriores hasta que VACUUM los elimina tras la retención.',
          'ZORDER BY solo aplica a tablas Delta sin liquid clustering; Databricks recomienda liquid clustering en lugar de particiones o ZORDER. Cuando predictive optimization ejecuta OPTIMIZE no aplica ZORDER e ignora los archivos ordenados con Z-order. En el historial, auto compaction, clustering y Z-order aparecen como OPTIMIZE y se distinguen por operationParameters.',
        ],
        source: source('Optimizar el diseño de archivos', 'tables/operations/optimize'),
      },
      {
        title: 'Liquid clustering cambia de claves sin reescribir',
        body: [
          'CLUSTER BY admite hasta cuatro claves y no es compatible con particiones ni con ZORDER. Puedes crear la tabla con SQL o con df.write.clusterBy(...).saveAsTable(...); la API DataFrame solo fija claves al crear o en modo overwrite. ALTER TABLE ... CLUSTER BY cambia las claves después y CLUSTER BY NONE las desactiva, sin reescribir los datos ya escritos.',
          'El clustering es incremental: OPTIMIZE solo reescribe lo que lo necesita y OPTIMIZE ... FULL reagrupa los datos existentes después de cambiar las claves. CLUSTER BY AUTO deja que Databricks elija claves según las consultas, pero requiere una tabla administrada de Unity Catalog con predictive optimization. Las tablas sin particiones con deletion vectors obtienen además concurrencia a nivel de fila.',
        ],
        source: source('Liquid clustering', 'tables/clustering'),
      },
      {
        title: 'VACUUM elimina archivos y limita el pasado',
        body: [
          'VACUUM borra los archivos que la tabla ya no referencia y que superan el umbral de retención, 7 días por defecto. VACUUM ... DRY RUN lista lo que borraría sin borrarlo. Los archivos de log no dependen de VACUUM: se limpian automáticamente después de los checkpoints. FULL es el modo por defecto; LITE usa el registro en lugar de listar el directorio.',
          'Existe un control de seguridad, retentionDurationCheck, que impide umbrales peligrosamente cortos; Databricks recomienda al menos 7 días porque un job largo puede tener archivos aún sin confirmar. Con deletion vectors, un borrado es lógico: para eliminar físicamente los datos ejecutas REORG TABLE ... APPLY (PURGE) y después VACUUM cuando esos archivos hayan vencido.',
        ],
        source: source('VACUUM', 'tables/operations/vacuum'),
      },
      {
        title: 'Predictive optimization automatiza el mantenimiento',
        body: [
          'Predictive optimization ejecuta OPTIMIZE, VACUUM y ANALYZE sobre tablas administradas de Unity Catalog cuando lo considera rentable, con cómputo serverless de jobs que se factura. No se aplica a tablas externas. Está habilitado por defecto en cuentas creadas desde el 11 de noviembre de 2024, y Databricks esperaba terminar de activarlo en cuentas existentes hacia agosto de 2026.',
          'Se habilita o hereda por cuenta, catálogo, esquema o tabla con ALTER ... ENABLE | DISABLE | INHERIT PREDICTIVE OPTIMIZATION y se audita en system.storage.predictive_optimization_operations_history. Si bajas deletedFileRetentionDuration de 7 días, su VACUUM sigue reteniendo al menos 7 días. Con él activo, Databricks recomienda retirar los jobs programados de OPTIMIZE.',
        ],
        source: source('Predictive optimization', 'optimizations/predictive-optimization'),
      },
      {
        title: 'Change Data Feed: cambios por fila con fecha de caducidad',
        body: [
          'El CDF devuelve las columnas de la tabla más _change_type (insert, update_preimage, update_postimage, delete), _commit_version y _commit_timestamp. Lo lees con table_changes(tabla, inicio, fin) o con spark.read.option("readChangeFeed", "true"); los límites son inclusivos y pedir una versión anterior a la activación produce un error.',
          'La documentación actual llama legacy al CDF que activas con delta.enableChangeDataFeed = true y describe un CDF automático basado en row tracking que requiere Runtime 19 o superior; no se combinan ambos. En cualquier caso no es un archivo permanente: los cambios caducan con la retención de la tabla y VACUUM elimina el directorio _change_data.',
        ],
        source: source('Change data feed', 'tables/features/change-data-feed'),
      },
    ],
    diagram: {
      title: 'Una tabla Delta: registro, archivos y mantenimiento',
      caption: 'Los commits JSON numerados definen qué archivos Parquet forman cada versión; OPTIMIZE agrega archivos nuevos y retira los viejos sin borrarlos, y solo VACUUM los elimina cuando superan la retención.',
      layers: [
        { label: 'Tabla en Unity Catalog', nodes: ['<tu_catalogo>.s05_lab.clientes', 'Propiedades: CDF, clustering, retención'] },
        { label: '_delta_log', nodes: ['…000.json → versión 0', '…001.json → versión 1', '…002.json → versión 2', 'Checkpoint Parquet'] },
        { label: 'Archivos de datos', nodes: ['Parquet activos', 'Parquet retirados: aún sirven al time travel', 'Deletion vectors', '_change_data del CDF'] },
        { label: 'Mantenimiento', nodes: ['OPTIMIZE: reescribe sin cambiar datos', 'VACUUM: borra retirados > 7 días', 'Predictive optimization'] },
      ],
    },
    comparison: {
      title: 'Particiones, Z-order y liquid clustering',
      headers: ['Técnica', 'Cómo se define', 'Cambiar columnas', 'Mantenimiento', 'Recomendación'],
      rows: [
        ['Particiones (PARTITIONED BY)', 'Directorios por valor de columna al crear la tabla', 'Reescribir la tabla o convertir con REPLACE PARTITIONED BY WITH CLUSTER BY (Runtime 18.1+)', 'OPTIMIZE compacta dentro de cada partición', 'Evitar en tablas nuevas; impide la concurrencia a nivel de fila'],
        ['Z-order (OPTIMIZE ... ZORDER BY)', 'Columnas indicadas en cada OPTIMIZE', 'Otro ZORDER BY reescribe datos; incompatible con clustering', 'Predictive optimization no ejecuta ZORDER', 'Heredado: migra usando esas columnas como claves de clustering'],
        ['Liquid clustering (CLUSTER BY)', 'Hasta 4 claves al crear o con ALTER TABLE', 'ALTER TABLE ... CLUSTER BY sin reescribir; OPTIMIZE FULL reagrupa', 'OPTIMIZE incremental y clustering al escribir sobre umbrales', 'Recomendado para todas las tablas nuevas'],
        ['Clustering automático (CLUSTER BY AUTO)', 'Databricks elige claves según las consultas', 'Automático cuando el ahorro supera el costo', 'Requiere tabla administrada UC y predictive optimization', 'Útil si los patrones de consulta cambian'],
      ],
      sources: [source('Liquid clustering', 'tables/clustering'), source('OPTIMIZE y ZORDER', 'tables/operations/optimize')],
    },
    lab: {
      title: 'Versiones, MERGE, CDF y mantenimiento en Free Edition',
      goal: 'Crear una tabla Delta pequeña con datos en línea, provocar schema enforcement, evolucionar el esquema, hacer un upsert con MERGE, viajar en el tiempo, leer el Change Data Feed, recuperarte de un DELETE con RESTORE y aplicar liquid clustering, OPTIMIZE y VACUUM DRY RUN, verificando cada total a mano.',
      minutes: 75,
      requirements: [
        'Databricks Free Edition con cómputo serverless y permiso para crear un esquema y tablas en tu catálogo; aplican cuotas de uso.',
        'Un notebook Python; el SQL se ejecuta con spark.sql o en una celda SQL. Los datos van dentro del código: no hay que subir archivos.',
        'Serverless solo permite fijar unas pocas propiedades Spark: el laboratorio usa opciones por escritura y nunca intenta desactivar controles de retención.',
        'El paso 12 es opcional: requiere un workspace Azure Databricks Premium y ser administrador de cuenta; Free Edition no tiene consola de cuenta.',
      ],
      steps: [
        {
          title: 'Descubre tu catálogo y crea el esquema',
          body: 'Abre un notebook serverless. Anota el resultado de current_catalog() y sustituye <tu_catalogo> en todo el laboratorio por ese catálogo con permisos de escritura. Todo lo que crees quedará dentro de s05_lab para poder borrarlo al final.',
          code: { language: 'sql', code: 'SELECT current_catalog();\nCREATE SCHEMA IF NOT EXISTS <tu_catalogo>.s05_lab;' },
          check: 'Conoces tu catálogo de escritura y el esquema s05_lab existe.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Crea la versión 0 con CDF activado',
          body: 'DROP TABLE hace el laboratorio repetible: la tabla nueva empieza su historial en la versión 0. La propiedad delta.enableChangeDataFeed se fija al crearla para registrar cambios desde el principio. Las funciones auxiliares leen la última versión del historial y calculan conteo y suma de puntos.',
          code: { language: 'python', code: `catalog = "<tu_catalogo>"
t = f"{catalog}.s05_lab.clientes"
from pyspark.sql import functions as F

spark.sql(f"DROP TABLE IF EXISTS {t}")
spark.sql(f"""
CREATE TABLE {t}
TBLPROPERTIES (delta.enableChangeDataFeed = true)
AS SELECT * FROM VALUES
  (1, 'Ana', 'Lima', 100),
  (2, 'Bruno', 'Quito', 200),
  (3, 'Carla', 'Bogota', 300),
  (4, 'Diego', 'Lima', 400)
AS v(id, name, city, points)
""")

def last_commit():
    return spark.sql(f"DESCRIBE HISTORY {t} LIMIT 1").first()

def totals(df):
    r = df.agg(F.count("*").alias("n"), F.sum("points").alias("s")).first()
    return (r["n"], r["s"])

first = spark.sql(f"DESCRIBE HISTORY {t}").orderBy("version").first()
assert first["version"] == 0 and first["operation"].startswith("CREATE")
assert totals(spark.table(t)) == (4, 1000)` },
          check: 'La versión 0 existe y la tabla tiene 4 filas con 100 + 200 + 300 + 400 = 1000 puntos.',
        },
        {
          title: 'Inspecciona historial y detalle',
          body: 'DESCRIBE HISTORY lista los commits del más reciente al más antiguo y DESCRIBE DETAIL devuelve una sola fila con formato, número de archivos, propiedades, table features y columnas de clustering. Después abre Catalog → <tu_catalogo> → s05_lab → clientes y compara las pestañas History y Details con lo que imprimió el código.',
          code: { language: 'python', code: `display(spark.sql(f"DESCRIBE HISTORY {t}"))
detail = spark.sql(f"DESCRIBE DETAIL {t}").first()
assert detail["format"] == "delta"
assert detail["properties"].get("delta.enableChangeDataFeed") == "true"
print(detail["numFiles"], detail["clusteringColumns"], detail["tableFeatures"])` },
          check: 'El historial tiene una fila (versión 0), el formato es delta, la propiedad del CDF vale true y clusteringColumns está vacío; la interfaz muestra lo mismo.',
          screen: { id: 's05-table', highlight: ['catalog', 'table', 'details', 'history'] },
        },
        {
          title: 'Comprueba schema enforcement y evoluciona el esquema',
          body: 'El DataFrame trae una columna email que la tabla no tiene. El esquema explícito evita que Python convierta los enteros en BIGINT. La primera escritura debe fallar sin crear versión; la segunda habilita mergeSchema solo para esa operación y agrega email al final del esquema.',
          code: { language: 'python', code: `ddl = "id INT, name STRING, city STRING, points INT, email STRING"
nuevo = spark.createDataFrame([(5, "Elena", "Cali", 500, "elena@example.com")], ddl)

rejected = False
try:
    nuevo.write.mode("append").saveAsTable(t)
except Exception as e:
    rejected = True
    print("Rechazada:", type(e).__name__)
assert rejected, "schema enforcement debía rechazar la columna extra"
assert totals(spark.table(t)) == (4, 1000)

nuevo.write.mode("append").option("mergeSchema", "true").saveAsTable(t)
v_append = last_commit()["version"]
assert totals(spark.table(t)) == (5, 1500)
assert spark.table(t).filter("email IS NULL").count() == 4` },
          check: 'La escritura sin mergeSchema se rechazó; con mergeSchema hay 5 filas, 1000 + 500 = 1500 puntos y 4 filas antiguas con email NULL.',
        },
        {
          title: 'Haz un upsert con MERGE',
          body: 'La fuente trae una actualización (2), un borrado (3) y una inserción (6); primero confirmas que cada id aparece una sola vez. La primera cláusula WHEN MATCHED lleva condición porque no es la última. Las métricas se leen del historial, donde los valores del mapa son cadenas.',
          code: { language: 'python', code: `cambios = spark.createDataFrame([
    (2, "Bruno", "Quito", 250, "U"),
    (3, "Carla", "Bogota", 300, "D"),
    (6, "Fabio", "Lima", 600, "I"),
], "id INT, name STRING, city STRING, points INT, op STRING")
assert cambios.count() == cambios.select("id").distinct().count()
cambios.createOrReplaceTempView("cambios")

spark.sql(f"""
MERGE INTO {t} AS d
USING cambios AS s
ON d.id = s.id
WHEN MATCHED AND s.op = 'D' THEN DELETE
WHEN MATCHED THEN UPDATE SET d.points = s.points, d.city = s.city
WHEN NOT MATCHED AND s.op <> 'D' THEN
  INSERT (id, name, city, points) VALUES (s.id, s.name, s.city, s.points)
""")
h = last_commit()
assert h["operation"] == "MERGE"
v_merge = h["version"]
m = h["operationMetrics"]
assert (m["numTargetRowsUpdated"], m["numTargetRowsDeleted"], m["numTargetRowsInserted"]) == ("1", "1", "1")
assert totals(spark.table(t)) == (5, 1850)` },
          check: 'Una fila actualizada, una borrada y una insertada; quedan 5 filas y 100 + 250 + 400 + 500 + 600 = 1850 puntos.',
        },
        {
          title: 'Viaja en el tiempo con PySpark y SQL',
          body: 'Lees tres versiones de la misma tabla: con la opción versionAsOf, con la sintaxis @v y con VERSION AS OF. La versión 0 conserva su esquema original, sin email. Las versiones se guardaron en variables para no depender de números fijos si aparece algún commit automático.',
          code: { language: 'python', code: `v0 = spark.read.option("versionAsOf", 0).table(t)
assert totals(v0) == (4, 1000)
assert "email" not in v0.columns
assert totals(spark.read.option("versionAsOf", v_append).table(t)) == (5, 1500)
assert totals(spark.table(f"{t}@v{v_merge}")) == (5, 1850)
display(spark.sql(f"SELECT * FROM {t} VERSION AS OF {v_append} ORDER BY id"))` },
          check: 'Las versiones devuelven (4, 1000), (5, 1500) y (5, 1850) y la versión 0 no tiene la columna email.',
        },
        {
          title: 'Lee el Change Data Feed del MERGE',
          body: 'table_changes con inicio y fin iguales devuelve solo los cambios del commit del MERGE; los límites son inclusivos. Una actualización produce dos filas, la imagen anterior y la posterior. La lectura PySpark con readChangeFeed debe devolver el mismo número de filas.',
          code: { language: 'python', code: `cdf = spark.sql(f"SELECT * FROM table_changes('{t}', {v_merge}, {v_merge})")
resumen = {r["_change_type"]: r["n"] for r in
    cdf.groupBy("_change_type").agg(F.count("*").alias("n")).collect()}
assert resumen == {"update_preimage": 1, "update_postimage": 1, "delete": 1, "insert": 1}
pre = cdf.filter("_change_type = 'update_preimage'").first()["points"]
post = cdf.filter("_change_type = 'update_postimage'").first()["points"]
assert (pre, post) == (200, 250)
py = (spark.read.option("readChangeFeed", "true")
    .option("startingVersion", v_merge).option("endingVersion", v_merge).table(t))
assert py.count() == 4
display(cdf.orderBy("id", "_change_type"))` },
          check: 'Hay 4 filas de cambio: insert (6), delete (3) y update_preimage/update_postimage de Bruno con 200 → 250.',
        },
        {
          title: 'Simula un error y recupérate con RESTORE',
          body: 'El DELETE borra por error a todos los clientes de Lima. RESTORE vuelve al contenido de la versión del MERGE creando un commit nuevo; el DELETE sigue en el historial como evidencia. Esto solo funciona mientras VACUUM no haya eliminado los archivos de la versión objetivo.',
          code: { language: 'python', code: `spark.sql(f"DELETE FROM {t} WHERE city = 'Lima'")
assert totals(spark.table(t)) == (2, 750)
spark.sql(f"RESTORE TABLE {t} TO VERSION AS OF {v_merge}")
ops = [r["operation"] for r in spark.sql(f"DESCRIBE HISTORY {t} LIMIT 2").collect()]
assert ops == ["RESTORE", "DELETE"]
assert totals(spark.table(t)) == (5, 1850)` },
          check: 'Tras el DELETE quedan Bruno y Elena (250 + 500 = 750); tras RESTORE vuelven 5 filas y 1850 puntos, y el historial muestra RESTORE sobre DELETE.',
        },
        {
          title: 'Aplica liquid clustering y OPTIMIZE',
          body: 'ALTER TABLE ... CLUSTER BY fija city como clave sin reescribir datos; OPTIMIZE agrupa de forma incremental. La segunda tabla muestra la API PySpark clusterBy, válida al crear o en modo overwrite. OPTIMIZE no cambia los datos, así que los totales no se mueven. No compares numFiles con un valor fijo: depende de cómo se escribieron los archivos.',
          code: { language: 'python', code: `spark.sql(f"ALTER TABLE {t} CLUSTER BY (city)")
spark.sql(f"OPTIMIZE {t}")
d = spark.sql(f"DESCRIBE DETAIL {t}").first()
assert list(d["clusteringColumns"]) == ["city"]
assert totals(spark.table(t)) == (5, 1850)

t2 = f"{catalog}.s05_lab.clientes_cluster"
spark.table(t).write.mode("overwrite").clusterBy("city").saveAsTable(t2)
assert list(spark.sql(f"DESCRIBE DETAIL {t2}").first()["clusteringColumns"]) == ["city"]
display(spark.sql(f"DESCRIBE HISTORY {t} LIMIT 3"))` },
          check: 'Ambas tablas tienen clusteringColumns = [city] y la tabla principal mantiene 5 filas y 1850 puntos después de OPTIMIZE.',
        },
        {
          title: 'Previsualiza VACUUM sin perder el pasado',
          body: 'DRY RUN lista los archivos que VACUUM borraría con la retención por defecto de 7 días. Los archivos retirados por MERGE, DELETE, RESTORE y OPTIMIZE tienen minutos, así que siguen protegidos. No intentes VACUUM ... RETAIN 0 HOURS: el control de retención lo impide y serverless no permite cambiar esa propiedad. En Catalog Explorer, la pestaña Details muestra las mismas propiedades que SHOW TBLPROPERTIES.',
          code: { language: 'python', code: `display(spark.sql(f"SHOW TBLPROPERTIES {t}"))
preview = spark.sql(f"VACUUM {t} DRY RUN")
print("Archivos que se borrarían:", preview.count())
assert totals(spark.read.option("versionAsOf", 0).table(t)) == (4, 1000)` },
          check: 'DRY RUN no lista archivos (0) en una tabla recién creada y la versión 0 sigue devolviendo 4 filas y 1000 puntos.',
          screen: { id: 's05-table', highlight: ['details'] },
        },
        {
          title: 'Busca ejecuciones automáticas en History',
          body: 'En la pestaña History usa el desplegable All runs y elige Automatic runs para ver solo operaciones automáticas como predictive optimization; Not applied indica una operación omitida y al hacer clic ves el motivo. Los resultados pueden tardar hasta 24 horas, así que una tabla recién creada puede no mostrar nada todavía. DESCRIBE TABLE EXTENDED muestra el campo Predictive Optimization si está disponible.',
          code: { language: 'sql', code: 'DESCRIBE TABLE EXTENDED <tu_catalogo>.s05_lab.clientes;' },
          check: 'Encontraste el filtro de tipo de ejecución y sabes interpretar Auto y Not applied, aunque la lista esté vacía en una tabla nueva.',
          screen: { id: 's05-history', highlight: ['history', 'runFilter', 'automaticRuns', 'notApplied'] },
        },
        {
          title: 'Azure opcional: predictive optimization en la cuenta',
          body: 'Requiere Azure Databricks Premium en una región soportada y ser administrador de cuenta. En la consola de cuenta ve a Settings → Feature enablement y elige Enabled junto a Predictive optimization. Un propietario o quien tenga MANAGE puede sobrescribirlo con ALTER SCHEMA ... ENABLE PREDICTIVE OPTIMIZATION. Las operaciones se auditan en system.storage.predictive_optimization_operations_history y se facturan como serverless de jobs.',
          code: { language: 'sql', code: 'ALTER SCHEMA <tu_catalogo>.s05_lab INHERIT PREDICTIVE OPTIMIZATION;\nSELECT * FROM system.storage.predictive_optimization_operations_history LIMIT 10;' },
          check: 'Distingues los niveles de cuenta, catálogo, esquema y tabla, o dejas constancia de que omitiste este paso exclusivo de Azure.',
          screen: { id: 's05-account', highlight: ['settings', 'featureEnablement', 'predictiveOptimization'] },
        },
      ],
      wrapUp: 'Las cuentas cuadran a mano: 4 filas y 1000 puntos en la versión 0, 5 y 1500 tras evolucionar el esquema, 5 y 1850 tras el MERGE, 2 y 750 tras el DELETE y otra vez 5 y 1850 tras RESTORE. El CDF del MERGE tiene 4 filas, y OPTIMIZE y DRY RUN no cambian ningún total. Al terminar puedes borrar el esquema con DROP SCHEMA <tu_catalogo>.s05_lab CASCADE.',
      sources: [
        { label: 'Límites de Free Edition', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Limitaciones de serverless', 'compute/serverless/limitations'),
        source('Propiedades Spark en serverless', 'spark/conf'),
        source('Historial, time travel y RESTORE', 'tables/history'),
        source('Esquema y métricas de DESCRIBE HISTORY', 'tables/history-schema'),
        source('DESCRIBE DETAIL', 'tables/operations/table-details'),
        source('Evolución de esquema', 'tables/update-schema'),
        source('MERGE', 'delta/merge'),
        source('Change data feed', 'tables/features/change-data-feed'),
        source('Liquid clustering', 'tables/clustering'),
        source('OPTIMIZE', 'tables/operations/optimize'),
        source('VACUUM', 'tables/operations/vacuum'),
        source('Pestañas de Catalog Explorer', 'discover/database-objects'),
        source('Predictive optimization', 'optimizations/predictive-optimization'),
      ],
    },
    certification: {
      intro: 'Preguntas de práctica originales, alineadas con las guías oficiales. No son preguntas reales del examen.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Transformation and Modeling', 'Troubleshooting, Monitoring, and Optimization', 'Databricks Intelligence Platform'] }],
      questions: [
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'Ejecutaste VACUUM con la retención por defecto. Una consulta VERSION AS OF de hace diez días falla. ¿Por qué?', options: ['El Change Data Feed estaba desactivado', 'VACUUM eliminó los archivos de datos de esa versión porque superaban el umbral de 7 días', 'El registro de transacciones se borra siempre después de un día', 'OPTIMIZE borró el directorio _delta_log'], answer: 1, explanation: 'El time travel necesita el log y los archivos de datos; VACUUM borra los archivos no referenciados con más de 7 días.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: '¿Qué propiedad controla cuánto tiempo conserva VACUUM los archivos de datos que ya no se referencian?', options: ['delta.logRetentionDuration', 'delta.enableChangeDataFeed', 'delta.deletedFileRetentionDuration', 'spark.sql.shuffle.partitions'], answer: 2, explanation: 'deletedFileRetentionDuration (7 días por defecto) fija el umbral de VACUUM; logRetentionDuration controla el historial (30 días).' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'OPTIMIZE compactó 50 archivos pequeños en 2, pero el almacenamiento no bajó. ¿Qué explica esto?', options: ['Los archivos antiguos siguen guardados para versiones anteriores hasta que VACUUM los elimina tras la retención', 'OPTIMIZE falló sin mostrar error', 'Faltó agregar ZORDER BY', 'OPTIMIZE solo modifica metadatos y nunca escribe archivos'], answer: 0, explanation: 'OPTIMIZE retira los archivos de la versión actual sin borrarlos; VACUUM los elimina cuando vencen.' },
        { domain: 'Data Transformation and Modeling', question: 'Cambiaste las claves de una tabla con ALTER TABLE ... CLUSTER BY. ¿Qué ejecutas para reagrupar también los datos ya escritos?', options: ['VACUUM', 'RESTORE TABLE', 'DESCRIBE DETAIL', 'OPTIMIZE ... FULL'], answer: 3, explanation: 'Cambiar claves no reescribe datos existentes; OPTIMIZE FULL reagrupa los archivos que no están agrupados con las claves actuales.' },
        { domain: 'Data Transformation and Modeling', question: 'Un append trae una columna nueva intencional y Delta lo rechaza. ¿Cuál es la solución recomendada y acotada?', options: ['Borrar y recrear la tabla', 'Usar overwriteSchema en cada append', 'Agregar .option("mergeSchema", "true") a esa escritura', 'Activar autoMerge para toda la sesión'], answer: 2, explanation: 'Databricks recomienda habilitar la evolución por operación; la configuración de sesión es heredada y afecta todas las escrituras.' },
        { domain: 'Data Transformation and Modeling', question: 'Un MERGE falla porque varias filas de origen coinciden con la misma fila destino. ¿Qué corriges?', options: ['Agregar WHEN NOT MATCHED BY SOURCE', 'Deduplicar la fuente por la clave antes del MERGE', 'Ejecutar OPTIMIZE antes', 'Activar el Change Data Feed'], answer: 1, explanation: 'Solo una fila de origen puede coincidir con cada fila destino; la actualización sería ambigua.' },
        { domain: 'Data Transformation and Modeling', question: 'Con el CDF activo, un UPDATE modifica una fila. ¿Qué filas devuelve table_changes para ese commit?', options: ['Una sola fila insert', 'Una fila delete y otra insert', 'Una fila update', 'Una fila update_preimage y otra update_postimage'], answer: 3, explanation: 'Una actualización se registra como imagen anterior y posterior de la fila.' },
        { domain: 'Data Transformation and Modeling', question: 'La tabla está en la versión 3 y ejecutas RESTORE TABLE ... TO VERSION AS OF 2. ¿Qué pasa con el historial?', options: ['Se crea una versión 4 con operación RESTORE y la versión 3 sigue en el historial', 'La versión 3 se borra', 'El historial se trunca en la versión 2', 'La tabla recibe un identificador nuevo'], answer: 0, explanation: 'RESTORE es un commit nuevo; no reescribe el pasado y por eso puedes auditarlo.' },
        { domain: 'Databricks Intelligence Platform', question: '¿Qué afirmación sobre predictive optimization es correcta?', options: ['Se ejecuta también sobre tablas externas', 'Aplica ZORDER automáticamente', 'Necesita un job programado por ti', 'Ejecuta OPTIMIZE, VACUUM y ANALYZE en tablas administradas de Unity Catalog con cómputo serverless'], answer: 3, explanation: 'Solo cubre tablas administradas de UC, no ejecuta ZORDER y se factura como serverless de jobs.' },
        { domain: 'Troubleshooting, Monitoring, and Optimization', question: 'En Free Edition quieres VACUUM ... RETAIN 0 HOURS para un ejercicio. ¿Qué es lo correcto?', options: ['Desactivar retentionDurationCheck con SET en serverless', 'Borrar a mano los Parquet de la tabla', 'Mantener la retención por defecto y usar VACUUM ... DRY RUN para observar', 'Ejecutar RESTORE antes del VACUUM'], answer: 2, explanation: 'El control de retención protege archivos en uso y serverless no permite fijar esa propiedad; DRY RUN muestra el efecto sin riesgo.' },
        { domain: 'Data Transformation and Modeling', question: 'Con deletion vectors activos, un requisito legal pide eliminar físicamente filas borradas. ¿Qué secuencia sirve?', options: ['Solo VACUUM, de inmediato', 'RESTORE a la versión anterior', 'DESCRIBE HISTORY y luego OPTIMIZE ZORDER', 'REORG TABLE ... APPLY (PURGE) y luego VACUUM cuando los archivos venzan'], answer: 3, explanation: 'Los deletion vectors marcan filas sin reescribir; PURGE reescribe los archivos y VACUUM borra los anteriores tras la retención.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 's05-table', answer: 'history', question: 'En la página de la tabla en Catalog Explorer, ¿dónde ves visualmente el equivalente de DESCRIBE HISTORY?', explanation: 'La pestaña History muestra el historial de la tabla Delta; la versión SQL es DESCRIBE HISTORY.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 's05-table', answer: 'details', question: '¿Dónde compruebas en Catalog Explorer si la tabla tiene la propiedad delta.enableChangeDataFeed?', explanation: 'La pestaña Details muestra los detalles de la tabla, incluidas sus propiedades, como SHOW TBLPROPERTIES.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's05-history', answer: 'automaticRuns', question: 'El desplegable de tipo de ejecución está abierto. ¿Qué eliges para ver solo operaciones de predictive optimization?', explanation: 'Automatic runs muestra solo operaciones automáticas; Manual runs las que alguien lanzó a mano.' },
        { type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's05-history', answer: 'notApplied', question: '¿Dónde haces clic para saber por qué predictive optimization omitió una operación?', explanation: 'Una fila con la etiqueta Not applied en la columna Operation indica una omisión; al hacer clic aparece el motivo.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 's05-account', answer: 'featureEnablement', question: 'En la consola de cuenta, dentro de Settings, ¿dónde activa un administrador predictive optimization para toda la cuenta?', explanation: 'Settings → Feature enablement contiene la opción Predictive optimization con valores como Enabled.' },
      ],
    },
  };
})(globalThis);
