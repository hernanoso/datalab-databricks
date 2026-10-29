// Sesión 4: contenido original basado únicamente en la investigación oficial suministrada.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.es.s04 = {
    deepDive: [
      {
        title: 'Medallion divide responsabilidades',
        body: [
          'Bronze conserva el historial crudo y la procedencia para que tú puedas revisar una transformación sin pedir a la fuente que reenvíe todo. Silver valida tipos, deduplica y une registros. Gold expresa agregados de negocio. Medallion es un diseño recomendado, no una secuencia obligatoria de tres copias para cada conjunto de datos.',
          'Un cambio de esquema de la fuente no debería borrar registros silenciosamente en la frontera de bronze. Conserva la representación recibida y su origen antes de aplicar reglas de negocio. El laboratorio usa instantáneas reemplazables para aprender; esa simplificación deliberada no es una estrategia de conservación del historial bronze en producción.',
        ],
        source: source('Arquitectura medallion', 'lakehouse/medallion'),
      },
      {
        title: 'La autenticación heredada no es el modelo actual de credenciales',
        body: [
          'Account key, SAS y OAuth con service principal siguen documentados como configuraciones heredadas de almacenamiento. Una clave compartida expone acceso amplio a la cuenta; SAS restringe permisos y vigencia; una identidad de aplicación recibe permisos asignados. No son tres tipos equivalentes de storage credential moderna de Unity Catalog.',
          'El artículo de configuración heredada está retirado y los montajes ya no se recomiendan. Lee los notebooks antiguos como contexto de migración, no como instrucciones para Free Edition. Eso no significa que toda operación spark.conf.set esté obsoleta: la advertencia corresponde al diseño heredado de acceso al almacenamiento.',
        ],
        source: source('Configuraciones heredadas de Azure Storage', 'connect/storage/azure-storage'),
      },
      {
        title: 'Separa identidad, ruta y acceso a archivos',
        body: [
          'Una storage credential de Unity Catalog contiene la identidad usada para llegar al almacenamiento. Una external location combina una ruta con esa credencial, mientras que los volúmenes gobiernan el acceso directo a archivos. Para diseños actuales de almacenamiento Azure, prefiere una managed identity mediante un Azure Databricks Access Connector en lugar de incrustar secretos en notebooks.',
          'El Access Connector admite identidades asignadas por el sistema y por el usuario. Azure administra la identidad y evita rotar client secrets, pero tú sigues asignando los permisos de almacenamiento que necesita. La credencial no es la carpeta y la ubicación externa no es una copia de los archivos.',
        ],
        source: source('Identidades administradas con Unity Catalog', 'connect/unity-catalog/cloud-storage/azure-managed-identities'),
      },
      {
        title: 'Una URI de ADLS identifica almacenamiento, no permisos',
        body: [
          'La forma de la URI es abfss://<container>@<account>.dfs.core.windows.net/<path>. Identifica contenedor, cuenta y ruta; conocerla no concede acceso. Las cuentas ADLS usadas para ubicaciones externas requieren espacio de nombres jerárquico: revisa tanto la configuración de la cuenta como los permisos de la identidad.',
        ],
        source: source('Ubicaciones externas ADLS', 'connect/unity-catalog/cloud-storage/external-locations-adls'),
      },
      {
        title: 'Recuperar secretos y ocultarlos en pantalla son tareas distintas',
        body: [
          'Los scopes respaldados por Databricks guardan secretos en una base de datos cifrada administrada por Databricks. Los respaldados por Azure Key Vault ofrecen una interfaz de solo lectura a secretos administrados en Azure. Recupera un valor con dbutils.secrets.get(scope="...", key="...") en lugar de colocar su valor literal en una celda.',
          'La ocultación de valores en la salida es de mejor esfuerzo: no protege contra lectores autorizados ni garantiza ocultar un valor transformado. Los scopes respaldados por Key Vault requieren el modelo Vault access policy, no Azure RBAC. Nunca pruebes la ocultación imprimiendo un secreto real.',
        ],
        source: source('Secretos', 'security/secrets/'),
      },
      {
        title: 'La federación consulta; la ingesta materializa',
        body: [
          'Lakehouse Federation accede a Azure SQL Database y Managed Instance mediante una conexión y un catálogo externo federado. Consultar ese catálogo no persiste por sí mismo una instantánea bronze. Si el requisito es ingesta, agrega una materialización explícita y registra de dónde procede esa instantánea.',
          'Spark/JDBC también permite extraer y escribir. Las conexiones JDBC actuales de Unity Catalog centralizan credenciales y pueden abarcar cómputo serverless, standard y dedicated. Decide intencionalmente entre consulta remota y materialización, en lugar de tratar todo SELECT exitoso como una ingesta terminada.',
        ],
        source: source('Federación SQL Server', 'query-federation/sql-server'),
      },
      {
        title: 'Cosmos DB tiene una frontera de compatibilidad de cómputo',
        body: [
          'Microsoft documenta el conector Spark 3 OLTP con el grupo Maven com.azure.cosmos.spark y el formato cosmos.oltp. El ejemplo del tutorial apunta a DBR 13.3 con Spark 3.4 y un prefijo de artefacto azure-cosmos-spark_3-4. Alinea runtime y conector documentados en lugar de asumir que cualquier artefacto sirve con cualquier runtime.',
          'Esta ruta del conector requiere un JAR personalizado de terceros en cómputo clásico dedicated, no en serverless de Free Edition ni en standard. La investigación suministrada no verifica compatibilidad general del conector con Unity Catalog, por lo que aquí no se afirma tal compatibilidad. Esta extensión Azure es opcional y no se ejecuta en el laboratorio principal.',
        ],
        source: { label: 'Tutorial del conector Spark de Cosmos DB', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/tutorial-spark-connector' },
      },
      {
        title: 'Los errores de lectura no son una cuarentena de negocio',
        body: [
          'read_files proporciona datos rescatados por defecto ante diferencias de esquema. Los lectores CSV y JSON también ofrecen modos de análisis como PERMISSIVE, DROPMALFORMED y FAILFAST. Un registro sintácticamente legible todavía puede infringir una regla de negocio, por ejemplo un monto negativo: leerlo correctamente no certifica su calidad.',
          'badRecordsPath no es transaccional ni una tabla confiable de cuarentena de negocio. Conserva salidas inválidas explícitas, motivos y métricas dentro del procesamiento. Una ruta de diagnóstico de lectura no reemplaza la clasificación exhaustiva de los registros que sí se pudieron interpretar.',
        ],
        source: source('Opciones de lectura CSV y JSON', 'spark/api-options'),
      },
      {
        title: 'Convierte la validez en un booleano total',
        body: [
          'En la lógica SQL de tres valores, comparar un monto nulo con cero produce NULL. Filtrar por ese predicado y luego por su negación pierde la fila en ambas ramas. Usa coalesce(id IS NOT NULL AND amount > 0, false) para que cada registro tenga exactamente un destino válido o inválido.',
          'Conserva los campos originales y un motivo accionable junto a las filas inválidas. Comprueba que válidas más cuarentena equivale a bronze antes de deduplicar. La eliminación de duplicados es otra parte del balance: explica qué versión gana y cuenta los registros sustituidos, en lugar de llamar fallo de calidad a toda reducción.',
        ],
        source: source('Cuarentena de registros inválidos', 'ldp/expectation-patterns#quarantine-invalid-records'),
      },
      {
        title: 'La repetibilidad depende de la entrada y la transformación',
        body: [
          'MERGE permite inserciones y actualizaciones condicionales, pero primero debes deduplicar las claves de la fuente. replaceWhere reemplaza atómicamente los datos que coinciden con un predicado y valida las filas entrantes por defecto. Ninguna sentencia hace repetibles unas entradas cambiantes o una selección no determinista de duplicados por sí sola.',
          'INSERT OVERWRITE sin especificación de partición reemplaza la tabla completa. No lo confundas con la sobrescritura dinámica heredada de particiones, no admitida en serverless. Este laboratorio sobrescribe pequeñas instantáneas completas con entradas estables. Las escrituras a destinos separados no son una única transacción atómica multitabla: valida todas las salidas al finalizar.',
        ],
        source: source('Escrituras repetibles con MERGE', 'delta/merge'),
      },
    ],
    diagram: {
      title: 'De fuentes Azure opcionales a salidas gobernadas',
      caption: 'Flujo conceptual: las integraciones Azure son opcionales; la federación primero consulta y copia explícitamente. El laboratorio Free Edition las sustituye por archivos pequeños e instantáneas acotadas.',
      layers: [
        { label: 'Fuentes — integraciones Azure opcionales', nodes: ['ADLS', 'Blob', 'Azure SQL', 'Cosmos DB'] },
        { label: 'Ingesta', nodes: ['Archivos gobernados', 'Federation/JDBC: primero consulta, copia explícitamente', 'Conector Cosmos OLTP: cómputo clásico dedicated'] },
        { label: 'Procesamiento', nodes: ['Bronze: procedencia', 'Silver: tipos y deduplicación', 'Gold: agregados de negocio', 'Cuarentena: motivos y métricas'] },
        { label: 'Consumidores', nodes: ['SQL/BI', 'Analítica', 'ML'] },
      ],
    },
    comparison: {
      title: 'Cuatro métodos de autenticación ADLS: contexto heredado y diseño actual',
      headers: ['Método', 'Qué es', 'Alcance del acceso', 'Secreto que administrar', 'Uso recomendado'],
      rows: [
        ['Account key', 'Clave compartida de almacenamiento', 'Acceso amplio/completo a la cuenta', 'Clave de cuenta', 'Evitar frente a identidad/SAS; enseñanza de configuración heredada'],
        ['SAS', 'Token de acceso firmado', 'Permisos y vigencia restringidos', 'Token SAS', 'Acceso temporal acotado; configuración heredada'],
        ['Service principal OAuth', 'Identidad de aplicación Entra', 'Roles/permisos de almacenamiento asignados', 'Client secret en el flujo documentado', 'Alternativa basada en identidad; preferir configuración moderna UC'],
        ['Managed identity + Access Connector', 'Identidad administrada por Azure', 'Roles asignados a cuenta/contenedor', 'Sin rotación de client secret', 'Storage credential + external location de UC preferidas'],
      ],
      sources: [source('Configuraciones heredadas de almacenamiento', 'connect/storage/azure-storage'), source('Identidades administradas', 'connect/unity-catalog/cloud-storage/azure-managed-identities')],
    },
    lab: {
      title: 'Un ETL de instantáneas repetible en Free Edition',
      goal: 'Subir archivos pequeños CSV y JSON, conservar su procedencia, clasificar todas las filas, elegir duplicados de forma determinista y verificar silver, cuarentena y gold sin JAR personalizados ni credenciales Azure.',
      minutes: 90,
      requirements: [
        'Databricks Free Edition con cómputo serverless y permiso para crear un esquema, tablas y un volumen administrado en tu catálogo; aplican cuotas y restricciones de red saliente.',
        'Un notebook con celdas SQL y Python; guarda localmente los dos archivos proporcionados como texto UTF-8 antes de subirlos.',
        'Los pasos 9 y 10 son opcionales: requieren recursos Azure, permisos, acceso de red y un workspace Azure Databricks, no Free Edition.',
      ],
      steps: [
        {
          title: 'Descubre tu catálogo y los metadatos de ejemplo',
          body: 'Usa un notebook serverless. Anota current_catalog() y sustituye <tu_catalogo> en todo el laboratorio por ese catálogo con permisos de escritura. SHOW TABLES solo inspecciona metadatos. samples.tpch tiene aproximadamente 1 TB: nunca lo clones ni ejecutes conteos, agregaciones o lecturas completas sobre él.',
          code: { language: 'sql', code: 'SELECT current_catalog();\nSHOW TABLES IN samples.tpch;\nCREATE SCHEMA IF NOT EXISTS <tu_catalogo>.s04_lab;' },
          check: 'Conoces tu catálogo de escritura y ves los nombres de las tablas de ejemplo sin leer su contenido.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Inspecciona un esquema antes de extraer una muestra relacional',
          body: 'El código elige una tabla de los metadatos descubiertos, muestra su esquema y toma como máximo 20 filas sin asumir nombres de columnas. La instantánea persistida de referencia simula una extracción relacional; está separada de las ventas suministradas y no participa en sus totales. Conserva esta instantánea sin cambios durante la prueba de reejecución.',
          code: { language: 'python', code: 'catalog = "<tu_catalogo>"\nns = f"{catalog}.s04_lab"\nfrom pyspark.sql import functions as F\ntables = spark.sql("SHOW TABLES IN samples.tpch").collect()\nassert tables, "No sample tables available"\ntable = tables[0].tableName\nquoted = "`" + table.replace("`", "``") + "`"\nsource_table = "samples.tpch." + quoted\ndisplay(spark.sql("DESCRIBE TABLE " + source_table))\nreference = spark.table(source_table).limit(20)\nif not spark.catalog.tableExists(f"{ns}.reference_bronze"):\n    (reference.withColumn("s04_source", F.lit(source_table))\n        .write.mode("overwrite").saveAsTable(f"{ns}.reference_bronze"))\nassert spark.table(f"{ns}.reference_bronze").count() <= 20' },
          check: 'Inspeccionaste el esquema y reference_bronze contiene como máximo 20 filas con una marca de origen.',
        },
        {
          title: 'Crea un volumen administrado',
          body: 'Crea el volumen raw dentro del esquema dedicado al laboratorio. Es acceso a archivos administrado por Unity Catalog, no un montaje ni un ejercicio de configuración de credenciales Hadoop. En Catalog, localiza tu catálogo y el esquema s04_lab para confirmar el volumen.',
          code: { language: 'sql', code: 'CREATE VOLUME IF NOT EXISTS <tu_catalogo>.s04_lab.raw;' },
          check: 'El volumen administrado raw existe en /Volumes/<tu_catalogo>/s04_lab/raw.',
          screen: { id: 'home', highlight: ['catalog'] },
        },
        {
          title: 'Sube los dos archivos suministrados',
          body: 'Guarda el bloque CSV como sales.csv y las líneas JSON como adjustments.json, sin la línea separadora. Usa New → Add or upload data → Upload files to a volume y elige el volumen raw como destino. Conserva los archivos sin cambios para la prueba de repetibilidad. seq establece el orden explícito de versiones para identificadores de venta duplicados.',
          code: { language: 'text', code: 'seq,id,customer,amount\n1,101,A,10.00\n2,102,B,20.00\n3,102,B,25.00\n4,103,A,\n5,104,C,-5.00\n6,wrong,C,7.00\n--- adjustments.json ---\n{"customer":"A","adjustment":"1.00"}\n{"customer":"B","adjustment":"2.00"}\n{"customer":"C","adjustment":"0.00"}' },
          check: 'El volumen contiene sales.csv con seis registros y adjustments.json con tres objetos JSON.',
          screen: { id: 'newMenu', highlight: ['uploadData'] },
        },
        {
          title: 'Persiste cadenas crudas y procedencia',
          body: 'Ejecuta esta celda Python después de la celda de preparación del paso 2. Usa esquemas explícitos de cadenas para que un valor de negocio mal formado siga visible en bronze. Cada entrada tiene un archivo de origen conocido. La sobrescritura de instantáneas es intencional aquí; un historial bronze de producción necesita otro diseño de conservación.',
          code: { language: 'python', code: 'base = f"/Volumes/{catalog}/s04_lab/raw"\nraw = (spark.read.option("header", True)\n    .schema("seq STRING, id STRING, customer STRING, amount STRING")\n    .csv(base + "/sales.csv")\n    .withColumn("source_file", F.lit("sales.csv")))\nraw.write.mode("overwrite").saveAsTable(f"{ns}.sales_bronze")\nadjustments = (spark.read\n    .schema("customer STRING, adjustment STRING")\n    .json(base + "/adjustments.json")\n    .withColumn("source_file", F.lit("adjustments.json")))\nadjustments.write.mode("overwrite").saveAsTable(f"{ns}.adjustments_bronze")\nassert spark.table(f"{ns}.sales_bronze").count() == 6\nassert spark.table(f"{ns}.adjustments_bronze").count() == 3' },
          check: 'Ambas instantáneas bronze conservan los campos suministrados y source_file; sus conteos son seis y tres.',
        },
        {
          title: 'Asigna tipos y clasifica cada venta',
          body: 'Conserva los campos crudos mientras conviertes id, amount y seq. coalesce hace que valid no sea nulo incluso con el monto vacío. Un monto ausente debe llegar a cuarentena, no desaparecer de ambos filtros. Las aserciones verifican una clasificación exhaustiva antes de eliminar duplicados.',
          code: { language: 'python', code: 'typed = (spark.table(f"{ns}.sales_bronze")\n    .withColumn("sale_id", F.expr("try_cast(id AS BIGINT)"))\n    .withColumn("value", F.expr("try_cast(amount AS DECIMAL(12,2))"))\n    .withColumn("version", F.expr("try_cast(seq AS INT)")))\nclassified = (typed.withColumn("valid", F.coalesce(\n    F.col("sale_id").isNotNull() & (F.col("value") > 0), F.lit(False)))\n    .withColumn("reason", F.when(F.col("sale_id").isNull(), "invalid_id")\n        .when(F.col("value").isNull(), "missing_or_invalid_amount")\n        .when(F.col("value") <= 0, "nonpositive_amount")))\nassert classified.filter("valid IS NULL").count() == 0\nassert classified.filter("valid").count() == 3\nassert classified.filter("NOT valid").count() == 3\nassert classified.count() == 6' },
          check: 'Tres filas son válidas antes de deduplicar; tres van a cuarentena, incluida la fila con monto vacío.',
        },
        {
          title: 'Define escrituras deterministas de instantáneas',
          body: 'El mayor seq gana para cada identificador de venta válido; seq es único en este archivo suministrado. Verifica las claves del ajuste para que el join no multiplique ventas. Gold suma el ajuste una vez por venta conservada. Sobrescribe las tres salidas; las escrituras separadas no son una única transacción atómica.',
          code: { language: 'python', code: 'from pyspark.sql.window import Window\nfrom decimal import Decimal\n\ndef write_snapshot():\n    good = classified.filter("valid")\n    bad = classified.filter("NOT valid")\n    order = Window.partitionBy("sale_id").orderBy(F.col("version").desc())\n    winners = (good.withColumn("rn", F.row_number().over(order))\n        .filter("rn = 1").drop("rn"))\n    ref = (spark.table(f"{ns}.adjustments_bronze")\n        .select("customer", F.expr("try_cast(adjustment AS DECIMAL(12,2)) AS adjustment")))\n    assert ref.count() == ref.select("customer").distinct().count() == 3\n    assert ref.filter("customer IS NULL OR adjustment IS NULL").count() == 0\n    silver = winners.join(ref, "customer", "left")\n    assert silver.filter("adjustment IS NULL").count() == 0\n    silver.write.mode("overwrite").saveAsTable(f"{ns}.sales_silver")\n    bad.write.mode("overwrite").saveAsTable(f"{ns}.sales_quarantine")\n    gold = silver.agg(F.sum(F.col("value") + F.col("adjustment")).alias("total"))\n    gold.write.mode("overwrite").saveAsTable(f"{ns}.sales_gold")\n    assert good.count() - winners.count() == 1' },
          check: 'write_snapshot está definida; su regla conserva la venta 102 con monto 25.00 en vez de 20.00.',
        },
        {
          title: 'Ejecuta dos veces y compara los resultados almacenados',
          body: 'Ejecuta la función dos veces con los mismos archivos y reglas deterministas. Cuenta solo tus pequeñas tablas administradas, nunca la fuente de ejemplo completa. Verifica unicidad y totales exactos además de conteos sin cambios; un conteo estable no detectaría por sí solo un monto modificado.',
          code: { language: 'python', code: 'def metrics():\n    silver = spark.table(f"{ns}.sales_silver")\n    quarantine = spark.table(f"{ns}.sales_quarantine")\n    gold = spark.table(f"{ns}.sales_gold")\n    return (silver.count(), quarantine.count(), gold.count(),\n        silver.select("sale_id").distinct().count(),\n        silver.agg(F.sum("value")).first()[0], gold.first()["total"])\n\nwrite_snapshot()\nfirst = metrics()\nwrite_snapshot()\nsecond = metrics()\nassert first == second == (2, 3, 1, 2, Decimal("35.00"), Decimal("38.00"))\nassert 6 == 2 + 3 + 1\ndisplay(spark.table(f"{ns}.sales_quarantine"))\nprint(second)' },
          check: 'Ambas ejecuciones producen dos filas silver, tres en cuarentena, una gold, dos claves únicas, 35.00 antes de ajustes y 38.00 después; un duplicado fue sustituido.',
        },
        {
          title: 'Azure opcional: archivos gobernados en ADLS o Blob',
          body: 'Requiere Azure. Para acceder a ADLS/Blob reales, prepara recursos, permisos y conectividad de red en un workspace Azure Databricks. Para la ruta ADLS, abre Catalog → Connect → Credentials e inspecciona Purpose STORAGE; la creación usa Add (+) → Create a credential → Azure Managed Identity con un Access Connector. Luego usa Catalog → Connect → External Locations → Create an external location: completa External location name, Storage type, URL y Storage credential. ADLS requiere espacio de nombres jerárquico; usa abfss://<container>@<account>.dfs.core.windows.net/<path>. No aprovisiones recursos solo para terminar el laboratorio principal.',
          check: 'Distingues la credencial de identidad de la ruta de almacenamiento, o dejas constancia de que omitiste esta extensión exclusiva de Azure.',
          screen: { id: 's04-credentials', highlight: ['credentials', 'storage', 'createCredential', 'managedIdentity'] },
        },
        {
          title: 'Azure opcional: SQL remoto, secretos y Cosmos DB',
          body: 'Requiere Azure. Para federación con Azure SQL, usa Catalog → Add (+) → Create a connection, completa Connection basics con Connection name, Connection type SQL Server y Auth type, y luego Create connection. Continúa con Catalog basics → Create catalog; primero consulta y materializa explícitamente si necesitas ingesta bronze. Un scope Key Vault usa la página sensible a mayúsculas #secrets/createScope con Manage Principal, DNS Name, Resource ID y Create; requiere Vault access policy, no Azure RBAC. Para Cosmos DB, consulta el tutorial y usa un JAR OLTP personalizado compatible solo en cómputo clásico dedicated, nunca en este laboratorio serverless. Estas rutas necesitan permisos Azure y acceso de red propios.',
          check: 'Explicas por qué consultar un catálogo federado no es una copia bronze y por qué la ruta JAR de Cosmos no funciona en Free Edition; no mostraste ningún secreto.',
          screen: { id: 's04-connection', highlight: ['createConnection', 'type', 'auth', 'createCatalog'] },
        },
      ],
      wrapUp: 'El balance es explícito: seis ventas entrantes se convierten en dos ventas válidas conservadas, tres filas inválidas y un duplicado sustituido. Entradas estables, reglas deterministas y reemplazo de instantáneas dan los mismos resultados comprobados al repetir; las rutas Azure opcionales permanecen separadas.',
      sources: [
        { label: 'Límites de Free Edition', url: `${DOCS}/getting-started/free-edition-limitations` },
        { label: 'Datos de ejemplo y tamaño de TPC-H', url: `${DOCS}/discover/databricks-datasets` },
        source('Subir archivos a un volumen', 'volumes/volume-files'),
        source('Patrón de cuarentena', 'ldp/expectation-patterns#quarantine-invalid-records'),
        source('Interfaz de credenciales de almacenamiento', 'connect/unity-catalog/cloud-storage/manage-storage-credentials'),
        source('Interfaz de ubicaciones externas', 'connect/unity-catalog/cloud-storage/manage-external-locations'),
        source('Federación SQL Server e interfaz de conexión', 'query-federation/sql-server'),
        source('Secretos e interfaz de scopes', 'security/secrets/'),
        source('Fuentes de datos y restricciones de JAR personalizados', 'connect/spark-data-sources'),
        { label: 'Tutorial del conector Cosmos', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/tutorial-spark-connector' },
        source('Datos rescatados con read_files', 'sql/language-manual/functions/read_files'),
        source('Sobrescritura selectiva', 'delta/selective-overwrite'),
        source('Semántica de INSERT OVERWRITE', 'sql/language-manual/sql-ref-syntax-dml-insert-into'),
      ],
    },
    certification: {
      intro: 'Preguntas de práctica originales, alineadas con las guías oficiales. No son preguntas reales del examen.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Ingestion and Loading', 'Data Transformation and Modeling', 'Governance and Security'] }],
      questions: [
        { domain: 'Data Transformation and Modeling', question: 'Una fuente cambia un campo inesperadamente. ¿Cuál es la responsabilidad de bronze?', options: ['Descartar el registro silenciosamente', 'Conservar el registro crudo y su procedencia', 'Publicar un agregado de negocio', 'Eliminar toda información de origen'], answer: 1, explanation: 'Bronze conserva la representación recibida para investigar y repetir las transformaciones posteriores.' },
        { domain: 'Governance and Security', question: '¿Qué pareja separa identidad de almacenamiento y ruta de almacenamiento?', options: ['Gold y silver', 'Notebook y gráfico', 'Storage credential y external location', 'SAS y tabla de salida'], answer: 2, explanation: 'La storage credential contiene la identidad; la external location combina una ruta con esa credencial.' },
        { domain: 'Data Ingestion and Loading', question: 'Una consulta lee un catálogo federado de Azure SQL. ¿Qué necesitas para una instantánea bronze?', options: ['Materialización explícita del resultado', 'Solo otro SELECT', 'Un título de gráfico', 'Nada porque consultar siempre copia los datos'], answer: 0, explanation: 'La federación consulta datos remotos; materializar es una decisión separada cuando se requiere ingesta.' },
        { domain: 'Data Transformation and Modeling', question: 'El monto es NULL. ¿Cómo evitas que una fila desaparezca de ambas ramas de validez?', options: ['Filtrar dos veces con amount > 0', 'Agregar todas las filas a gold', 'Eliminar el identificador', 'Aplicar coalesce al predicado de validez con false'], answer: 3, explanation: 'Un predicado NULL y su negación son NULL; coalesce hace exhaustiva la clasificación válida/inválida.' },
        { domain: 'Data Transformation and Modeling', question: '¿Cuál es la función adecuada de badRecordsPath?', options: ['Cuarentena transaccional de negocio', 'Diagnóstico de lectura, no una tabla confiable de cuarentena de negocio', 'Orden de selección de duplicados', 'Una identidad de Unity Catalog'], answer: 1, explanation: 'badRecordsPath no es transaccional ni clasifica las infracciones de negocio de registros leídos correctamente.' },
        { domain: 'Data Transformation and Modeling', question: 'Dos versiones válidas tienen el mismo identificador y secuencias distintas. ¿Qué regla es repetible?', options: ['Conservar la que llegue primero sin ordenar', 'Elegir una fila al azar', 'Conservar la mayor secuencia con un orden explícito', 'Agregar ambas en cada reejecución'], answer: 2, explanation: 'Un orden explícito de prioridad hace determinista la selección para las versiones estables suministradas.' },
        { domain: 'Data Transformation and Modeling', question: '¿Qué debes comprobar antes de MERGE por clave de origen?', options: ['Las claves de origen están deduplicadas', 'Todos los secretos están impresos', 'La fuente se renombró gold', 'Cada fila tiene un formato de archivo diferente'], answer: 0, explanation: 'MERGE permite cambios condicionales, pero debes resolver las claves duplicadas de origen antes de aplicarlos.' },
        { domain: 'Data Ingestion and Loading', question: '¿Cómo empiezas a explorar samples.tpch, de aproximadamente 1 TB?', options: ['Clonar todas las tablas', 'Contar todas las filas de cada tabla', 'Agregar todas las columnas', 'Descubrir tablas, inspeccionar esquemas y tomar extractos acotados'], answer: 3, explanation: 'Descubrir metadatos y luego extraer muestras pequeñas evita tratar una fuente enorme como un ejercicio diminuto.' },
        { domain: 'Data Transformation and Modeling', question: 'En la instantánea suministrada, ¿qué balance explica seis ventas bronze después de deduplicar?', options: ['Seis filas gold', 'Dos silver, tres en cuarentena y un duplicado sustituido', 'Tres silver y ninguna en cuarentena', 'Cinco en cuarentena y dos silver'], answer: 1, explanation: 'Tres filas pasan la validación, una de ellas es sustituida por su versión más reciente y tres fallan las reglas.' },
        { domain: 'Governance and Security', question: '¿La ocultación de secretos garantiza que un lector autorizado no revele un valor transformado?', options: ['Sí, todas las transformaciones permanecen ocultas', 'Sí, los scopes eliminan todos los permisos de lectura', 'No, es de mejor esfuerzo y no ofrece esa garantía de seguridad', 'Sí, imprimir un hash siempre demuestra confidencialidad'], answer: 2, explanation: 'Importan los permisos y el manejo cuidadoso: la ocultación de salida no es una frontera absoluta de seguridad.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's04-credentials', answer: 'credentials', question: 'Dentro de Catalog → Connect, ¿dónde inspeccionas las identidades y su propósito STORAGE?', explanation: 'Credentials lista las credenciales; Purpose distingue las entradas STORAGE de las entradas SERVICE.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's04-credentials', answer: 'createCredential', question: 'El menú Add (+) está abierto. ¿Dónde comienzas a crear el objeto de identidad para almacenamiento?', explanation: 'Create a credential inicia la creación; la ruta de identidad administrada Azure usa un Access Connector.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's04-location', answer: 'credential', question: 'En el formulario de ubicación externa, ¿qué campo enlaza la ruta con una identidad de almacenamiento existente?', explanation: 'Storage credential selecciona el objeto de identidad asociado a la ruta externa de almacenamiento.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's04-connection', answer: 'type', question: 'En Connection basics, ¿dónde eliges SQL Server como sistema remoto?', explanation: 'Connection type selecciona el sistema remoto; elige SQL Server para la ruta documentada de federación Azure SQL.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's04-secrets', answer: 'principal', question: 'En #secrets/createScope, ¿dónde eliges quién puede administrar el scope?', explanation: 'Manage Principal controla la elección del principal durante la creación del scope; no es el campo DNS del vault.' },
      ],
    },
  };
})(globalThis);
