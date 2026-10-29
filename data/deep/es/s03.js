// Sesión 3: contenido original en español neutro basado en la investigación oficial suministrada.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};

  const DOCS = 'https://docs.databricks.com/aws/en';
  const SPARK = 'https://spark.apache.org/docs';
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.es.s03 = {
    deepDive: [
      {
        title: 'Ejecución distribuida: coordinar no es procesar cada fila',
        body: [
          'El driver coordina el trabajo distribuido, el gestor del clúster asigna recursos y los executors ejecutan tareas sobre particiones de datos. Una acción puede disparar jobs divididos en stages y tareas. Una partición es una unidad de trabajo distribuido, no una garantía de que cada archivo corresponda siempre a una tarea.',
          'En Free Edition usa esta arquitectura como modelo conceptual, no como ejercicio de administración de clústeres. El servicio serverless gestiona los recursos por ti. El proceso Python del notebook que usa Spark Connect es un cliente: no lo identifiques con el driver remoto que aparece en la capa de servidor del diagrama.',
        ],
        source: { label: 'Arquitectura de clústeres de Spark', url: `${SPARK}/latest/cluster-overview.html` },
      },
      {
        title: 'Los planes perezosos también requieren análisis y comunicación',
        body: [
          'Operaciones como select, filter y limit construyen el plan de un DataFrame, mientras que show y collect ejecutan trabajo para devolver resultados. Spark Connect envía planes sin resolver desde el cliente a un servidor remoto, donde el análisis resuelve columnas y tipos antes de ejecutar. El código Python y el procesamiento distribuido son capas distintas.',
          'La evaluación perezosa no significa que no haya ocurrido comunicación ni análisis. Consultar el esquema o llamar a explain() puede contactar al servidor y analizar un plan sin materializar todo el resultado. Distingue construir el plan, inspeccionarlo y pedir al motor que produzca filas cuando expliques qué hace una celda.',
        ],
        source: { label: 'Spark Connect frente a Spark clásico', url: `${DOCS}/spark/connect-vs-classic` },
      },
      {
        title: 'Operaciones estrechas, amplias y costo del shuffle',
        body: [
          'Una proyección o un filtro normalmente trabaja dentro de las particiones existentes sin redistribuir sus registros. Una agregación o una repartición puede requerir un shuffle: los registros se mueven entre particiones para procesar juntas las claves relacionadas. La serialización, la transferencia por red y la actividad de disco añaden costos, y el shuffle separa stages.',
          'No conviertas esta distinción en la regla de que todo join hace shuffle. Las estrategias broadcast pueden evitar redistribuir ambas entradas y la ejecución adaptativa puede cambiar una estrategia de join con estadísticas de ejecución. Lee el plan elegido y la evidencia de rendimiento en lugar de diagnosticar una consulta solo por los nombres de sus métodos.',
        ],
        source: { label: 'Ejecución adaptativa y estrategias de join', url: `${DOCS}/optimizations/aqe` },
      },
      {
        title: 'Lee los planes de Catalyst con el modo adecuado de explain',
        body: [
          'explain("extended") presenta las secciones Parsed, Analyzed y Optimized Logical Plan, seguidas del Physical Plan. Compara las etapas para entender cómo una transformación declarativa se convierte en una estrategia ejecutable. El plan físico es una propuesta de ejecución, no una medición del tiempo transcurrido.',
          'El modo simple muestra el plan físico; formatted separa su estructura y los detalles de los nodos. El modo cost expone las estadísticas disponibles y codegen muestra el código generado cuando existe. Estas API de inspección admiten Spark Connect, así que puedes examinar un DataFrame serverless sin acceder a API de ejecución de bajo nivel.',
        ],
        source: { label: 'Referencia de DataFrame.explain', url: `${SPARK}/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.explain.html` },
      },
      {
        title: 'AQE: la ejecución puede revisar el plan inicial',
        body: [
          'La ejecución adaptativa de consultas está activada por defecto y usa estadísticas de ejecución para ajustar decisiones. Puede cambiar estrategias de join, combinar particiones posteriores al shuffle y tratar el sesgo de datos. Por eso el plan inicial no es necesariamente el plan final que completa una consulta.',
          'Un grupo grande de registros con la misma clave puede repartir mal el trabajo aunque existan muchas particiones. Explica primero la agrupación deseada y luego inspecciona la consulta terminada, sin asumir que aumentar particiones siempre resuelve el problema. AQE adapta la ejecución; no cambia el significado de negocio de tu agregación.',
        ],
        source: { label: 'Ejecución adaptativa de consultas', url: `${DOCS}/optimizations/aqe` },
      },
      {
        title: 'Photon acelera operaciones compatibles, no Python arbitrario',
        body: [
          'Photon está activado en el cómputo serverless. Catalyst sigue planificando la consulta, mientras Photon ejecuta operaciones compatibles en C++ sobre lotes columnares. Entiende la optimización y la ejecución como funciones complementarias, en lugar de presentar Photon como sustituto del planificador de consultas.',
          'Photon no ejecuta UDF de Python. Las operaciones incompatibles recurren al motor de Spark, de modo que tener Photon no implica que cada parte de un notebook use el mismo motor de ejecución. Prefiere expresiones nativas cuando representen la lógica necesaria; el rendimiento real sigue dependiendo de la carga de trabajo.',
        ],
        source: { label: 'Motor de ejecución Photon', url: `${DOCS}/compute/photon` },
      },
      {
        title: 'Lectores, escritores y destinos explícitos',
        body: [
          'El patrón de lectura es spark.read.format(...).option(...).schema(...).load(...). Las opciones de CSV, como header y sep, describen la entrada; JSON y Parquet tienen su propio comportamiento de formato. Un esquema explícito deja claros los tipos esperados en lugar de mantener implícita esa decisión.',
          'Los escritores usan format, mode y save o saveAsTable. Los modos error/errorifexists, append, overwrite e ignore expresan qué hacer si la salida existe; el comportamiento genérico de escritura de archivos no describe las transacciones de Delta. El laboratorio escribe una tabla Delta en tu propio catálogo, nunca en el catálogo samples de origen.',
        ],
        source: { label: 'Carga y escritura con fuentes de datos de Spark', url: `${SPARK}/3.5.6/sql-data-sources-load-save-functions.html` },
      },
      {
        title: 'Funciones nativas, UDF escalares de Python y pandas UDF',
        body: [
          'Prefiere expresiones nativas como when y round cuando representen la transformación: el optimizador puede ver su estructura. La lógica de una UDF de Python es opaca para ese optimizador. Una UDF escalar de Python no equivale universalmente a serializar fila por fila; importan su implementación y las optimizaciones aplicables.',
          'Las pandas UDF usan Arrow y procesamiento vectorizado con pandas, pero eso no vuelve su lógica Python visible para Catalyst ni ejecutable por Photon. Ambas familias de UDF están disponibles en serverless con restricciones; ninguna garantiza una mejora de rendimiento frente a una expresión nativa equivalente.',
        ],
        source: { label: 'UDF de Python', url: `${DOCS}/udf/python` },
      },
      {
        title: 'Ventanas: define grupo, orden y marco por separado',
        body: [
          'Una ventana conserva una fila de salida por cada fila de entrada y calcula sobre filas relacionadas. Window.partitionBy define grupos lógicos, orderBy define el orden y el marco determina qué filas participan para cada fila actual. Esa partición lógica no es el particionado físico de archivos en el almacenamiento.',
          'ROWS describe posiciones de filas; RANGE describe un rango en los valores de ordenación. Elige el marco con intención para acumulados, lag y rankings. En el laboratorio, agrega a una fila por zona de origen y día antes de aplicar una suma acumulada con ROWS: así eliminas empates de fecha dentro de cada zona y haces explícita la granularidad diaria.',
        ],
        source: { label: 'Funciones de ventana de Spark SQL', url: `${SPARK}/3.5.6/sql-ref-syntax-qry-select-window.html` },
      },
      {
        title: 'Límites de serverless y caché condicional de DataFrames',
        body: [
          'Serverless usa Spark Connect: no están disponibles RDD, SparkContext ni Spark UI. Usa tablas o volúmenes de Unity Catalog en lugar de montajes DBFS e inspecciona el trabajo terminado con el perfil de consulta. Solo puedes cambiar configuraciones admitidas; la referencia de serverless incluye la zona horaria y spark.sql.shuffle.partitions, cuyo valor predeterminado es auto.',
          'No supongas que toda caché está prohibida. Con la versión preliminar de caché de DataFrames activada y la versión de entorno 5 o posterior, están disponibles cache, persist y unpersist. La caché es inmediata y crea una instantánea privada; persist ignora el nivel de almacenamiento y unpersist invalida DataFrames derivados. SQL CACHE TABLE y las API de caché del catálogo siguen sin admitirse. El laboratorio no requiere esta función preliminar opcional.',
        ],
        source: { label: 'Versión preliminar de caché de DataFrames en serverless', url: `${DOCS}/compute/serverless/dataframe-cache` },
      },
    ],
    diagram: {
      title: 'Del plan del cliente Connect a la ejecución administrada',
      caption: 'Límites conceptuales, no una guía para configurar clústeres: el cliente Python del notebook envía planes a un servicio remoto. Serverless administra los recursos; el proceso cliente no es el driver.',
      layers: [
        { label: 'Código cliente', nodes: ['Proceso Python del notebook', 'API de DataFrames y planes sin resolver'] },
        { label: 'Servidor remoto', nodes: ['Driver y Catalyst', 'AQE', 'Asignación administrada de recursos'] },
        { label: 'Ejecución', nodes: ['Stages y tareas', 'Executors y particiones', 'Photon o ejecución alternativa en Spark'] },
        { label: 'Almacenamiento', nodes: ['Tabla de origen en Unity Catalog', 'Tabla Delta de destino', 'CSV / JSON / Parquet en un volumen'] },
      ],
    },
    comparison: {
      title: 'Elige una expresión antes que una UDF: la velocidad depende de la carga',
      headers: ['Aspecto', 'Expresión nativa', 'UDF escalar de Python', 'pandas UDF'],
      rows: [
        ['Ejemplo', 'F.when, F.round', 'F.udf', 'F.pandas_udf'],
        ['Ejecución', 'Expresión del motor', 'Función Python', 'Lotes de pandas / Arrow'],
        ['Optimización', 'Expresión visible para el optimizador', 'Lógica Python opaca', 'Lógica Python opaca'],
        ['Photon', 'Operaciones compatibles', 'Photon no la ejecuta', 'Photon no la ejecuta'],
        ['Serverless', 'Admitida', 'Admitida con restricciones', 'Admitida con restricciones'],
      ],
      sources: [
        { label: 'UDF de Python', url: `${DOCS}/udf/python` },
        { label: 'pandas UDF', url: `${DOCS}/udf/pandas` },
        { label: 'Photon', url: `${DOCS}/compute/photon` },
        { label: 'Limitaciones de serverless', url: `${DOCS}/compute/serverless/limitations` },
      ],
    },
    lab: {
      title: 'Ingresos diarios de taxis y acumulados en Free Edition',
      goal: 'Construir e inspeccionar una transformación de DataFrames con Spark Connect, agregar tarifas por zona de origen y día, calcular un acumulado y guardar una tabla Delta en tu propio catálogo.',
      minutes: 65,
      requirements: [
        'Databricks Free Edition con un notebook Python conectado a Serverless y acceso de lectura a samples.nyctaxi.trips.',
        'Un catálogo y un esquema default donde tengas permiso para crear una tabla; sustituye <tu_catalogo> solo después de inspeccionar current_catalog().',
        'Las API y rutas de interfaz se verificaron en documentación oficial; este laboratorio no se ejecutó en un workspace real. El contenido de la muestra y los detalles del plan pueden variar.',
      ],
      steps: [
        {
          title: 'Selecciona el lenguaje y descubre tu catálogo',
          body: 'En un notebook conectado a Serverless, elige Python en el control de lenguaje y ejecuta con Shift+Enter. Inspecciona el catálogo actual antes de escribir. Si es samples o no puedes escribir allí, selecciona un catálogo propio con permiso de escritura; no supongas un nombre fijo de catálogo.',
          code: { language: 'python', code: 'from pyspark.sql import functions as F, Window\nspark.sql("SELECT current_catalog(), current_schema()").show()' },
          check: 'Anotaste un catálogo con permiso de escritura para sustituir <tu_catalogo> y el notebook usa Python sobre Serverless.',
          screen: { id: 's03-cell', highlight: ['python'] },
        },
        {
          title: 'Lee el origen sin modificarlo',
          body: 'Lee la tabla de ejemplo con la API de DataFrames e inspecciona su esquema y una vista previa pequeña. Inspeccionar el esquema puede contactar al servidor remoto para analizarlo; no demuestra que se haya materializado toda la tabla. El origen se mantiene de solo lectura durante todo el ejercicio.',
          code: { language: 'python', code: 'trips = spark.read.table("samples.nyctaxi.trips")\ntrips.printSchema()\ndisplay(trips.select("pickup_zip", "tpep_pickup_datetime", "trip_distance", "fare_amount").limit(10))' },
          check: 'La vista previa contiene las columnas seleccionadas; no escribiste nada en samples.',
          screen: { id: 's03-results', highlight: ['table'] },
        },
        {
          title: 'Expresa la limpieza con funciones nativas',
          body: 'Selecciona las columnas necesarias, conserva tarifas y distancias positivas y deriva una fecha del instante de recogida. Estas transformaciones describen un plan; no confundas eso con la garantía de que no haya solicitudes de metadatos o análisis.',
          code: { language: 'python', code: 'clean = (trips\n    .select("pickup_zip", "tpep_pickup_datetime", "trip_distance", "fare_amount")\n    .filter((F.col("fare_amount") > 0) & (F.col("trip_distance") > 0))\n    .withColumn("day", F.to_date("tpep_pickup_datetime")))' },
          check: 'Puedes explicar por qué el filtro y la expresión de fecha no requieren una UDF propia de Python.',
        },
        {
          title: 'Agrega con una granularidad bien definida',
          body: 'Agrupa por zona de origen y día, y calcula la cantidad de viajes y la suma de tarifas. Esta es la granularidad diaria de la siguiente ventana, no un total repetido en cada viaje original. La agrupación puede introducir redistribución entre particiones.',
          code: { language: 'python', code: 'daily = (clean.groupBy("pickup_zip", "day")\n    .agg(F.count("*").alias("trips"),\n         F.sum("fare_amount").alias("revenue")))' },
          check: 'Cada grupo de salida representa una zona de origen y un día, con cantidad de viajes y tarifa total.',
        },
        {
          title: 'Añade la ventana de ingresos acumulados',
          body: 'Particiona la ventana lógicamente por zona de origen, ordena por día y usa un marco desde la primera fila hasta la actual. La agregación previa elimina empates de fecha dentro de cada zona. Esta ventana no reparticiona archivos en el almacenamiento.',
          code: { language: 'python', code: 'w = (Window.partitionBy("pickup_zip").orderBy("day")\n    .rowsBetween(Window.unboundedPreceding, Window.currentRow))\nresult = daily.withColumn("running_revenue", F.sum("revenue").over(w))' },
          check: 'La ventana añade un acumulado sin colapsar las filas de daily.',
        },
        {
          title: 'Compara vistas del plan antes de mostrar la salida',
          body: 'Solicita las explicaciones extended y formatted. Localiza las secciones lógicas y físicas e inspecciona cualquier redistribución del plan. Esto provoca comunicación y análisis, no la materialización del resultado completo; AQE todavía puede revisar las decisiones durante la ejecución.',
          code: { language: 'python', code: 'result.explain("extended")\nresult.explain("formatted")' },
          check: 'Distingues el plan lógico analizado del plan físico y puedes explicar por qué el plan inicial puede cambiar.',
        },
        {
          title: 'Muestra, valida e inspecciona el rendimiento',
          body: 'Muestra el resultado ordenado e inspecciona fechas, cantidades positivas, grupos únicos por zona y día y acumulados. Tras ejecutar, abre See performance, selecciona la sentencia Spark y elige See query profile. Espera a que termine para inspeccionar el perfil completo; esta es la ruta de serverless, no Spark UI.',
          code: { language: 'python', code: 'display(result.orderBy("pickup_zip", "day"))\ndisplay(result.filter(F.col("day").isNull() | (F.col("trips") <= 0)))\ndisplay(result.groupBy("pickup_zip", "day").count().filter(F.col("count") > 1))' },
          check: 'No hay grupos duplicados por zona y día ni cantidades no positivas. Investiga cualquier fecha nula antes de guardar y compara los acumulados dentro de una zona sin esperar totales fijos para la muestra.',
          screen: { id: 's03-performance', highlight: ['performance', 'queryProfile'] },
        },
        {
          title: 'Crea un gráfico con una agregación diaria pequeña',
          body: 'Muestra una agregación pequeña de ingresos por día. En el resultado usa + y luego Visualization. En el editor elige Visualization Type, asigna day y revenue al gráfico y elige Save. Por separado puedes usar + y luego Data Profile para explorar el resultado, sin confundir el perfilado con un gráfico.',
          code: { language: 'python', code: 'chart_daily = (daily.groupBy("day").agg(F.sum("revenue").alias("revenue"))\n    .orderBy("day").limit(30))\ndisplay(chart_daily)' },
          check: 'Tu gráfico guardado usa una agregación diaria, no una representación de cada viaje original.',
          screen: { id: 's03-results', highlight: ['add', 'visualization', 'dataProfile'] },
        },
        {
          title: 'Confirma los controles de visualización',
          body: 'Revisa el editor antes de salir: Visualization Type cambia el tipo de gráfico y Save conserva la visualización. La ilustración simplificada muestra solo controles documentados, no todos los campos ni la distribución exacta del workspace actual.',
          check: 'Puedes ubicar el selector de tipo y el control para guardar, y describir qué medida diaria representaste.',
          screen: { id: 's03-chart', highlight: ['chartType', 'save'] },
        },
        {
          title: 'Guarda solo en tu catálogo y vuelve a leer',
          body: 'Sustituye <tu_catalogo> por el catálogo con permiso de escritura anotado en el paso 1. Esto sobrescribe únicamente tu tabla de destino del ejercicio si ya existe: usa otro nombre si necesitas conservar un resultado anterior. Vuelve a leer la tabla Delta guardada e inspecciónala sin asumir una cantidad fija de filas en la muestra.',
          code: { language: 'python', code: 'target = "<tu_catalogo>.default.s03_daily_trips"\n(result.write.format("delta").mode("overwrite").saveAsTable(target))\nsaved = spark.read.table(target)\ndisplay(saved.orderBy("pickup_zip", "day"))' },
          check: 'El destino está en tu catálogo con permiso de escritura, no en samples, y la tabla guardada tiene ingresos diarios y running_revenue.',
        },
      ],
      wrapUp: 'Separaste la planificación del cliente de la ejecución remota, comparaste vistas del plan, calculaste ingresos diarios y acumulados, inspeccionaste el perfil serverless y guardaste solo en un destino propio. Conserva el origen intacto y trata las observaciones de rendimiento como evidencia específica de esa carga.',
      sources: [
        { label: 'Connect frente a Spark clásico', url: `${DOCS}/spark/connect-vs-classic` },
        { label: 'Funciones de ventana', url: `${SPARK}/3.5.6/sql-ref-syntax-qry-select-window.html` },
        { label: 'DataFrame.explain', url: `${SPARK}/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.explain.html` },
        { label: 'Análisis exploratorio en notebooks', url: `${DOCS}/notebooks/eda-tutorial` },
        { label: 'Visualizaciones', url: `${DOCS}/visualizations` },
        { label: 'Notebooks serverless y perfil de consulta', url: `${DOCS}/compute/serverless/notebooks` },
        { label: 'Código y lenguaje del notebook', url: `${DOCS}/notebooks/notebooks-code` },
        { label: 'Ejecutar celdas del notebook', url: `${DOCS}/notebooks/run-notebook` },
        { label: 'Funciones de carga y escritura', url: `${SPARK}/3.5.6/sql-data-sources-load-save-functions.html` },
        { label: 'Limitaciones de serverless', url: `${DOCS}/compute/serverless/limitations` },
        { label: 'Configuración de serverless', url: `${DOCS}/spark/conf#serverless` },
      ],
    },
    certification: {
      intro: 'Preguntas de práctica originales, alineadas con las guías oficiales. No son preguntas reales del examen.',
      exams: [
        { name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Transformation and Modeling', 'Databricks Intelligence Platform', 'Troubleshooting, Monitoring, and Optimization'] },
      ],
      questions: [
        {
          domain: 'Databricks Intelligence Platform',
          question: 'Un notebook Python usa Spark Connect sobre serverless. ¿Qué descripción respeta el límite entre cliente y servidor?',
          options: ['El proceso Python del notebook siempre es el driver remoto', 'El cliente envía planes sin resolver para analizarlos en el servidor', 'Cada executor se ejecuta dentro del navegador', 'El cliente asigna executors manualmente en Free Edition'],
          answer: 1,
          explanation: 'Spark Connect separa cliente y servidor: el análisis remoto resuelve los planes y la ejecución administrada procesa los datos.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: '¿Qué operación pide a Spark devolver filas de resultado en lugar de solo ampliar el plan de transformación de un DataFrame?',
          options: ['select', 'filter', 'limit', 'show'],
          answer: 3,
          explanation: 'show es una acción que ejecuta trabajo para devolver filas; select, filter y limit describen transformaciones.',
        },
        {
          domain: 'Troubleshooting, Monitoring, and Optimization',
          question: 'Necesitas las etapas del plan lógico además del plan físico. ¿Qué llamada es la más adecuada?',
          options: ['df.explain("extended")', 'df.explain("simple")', 'df.select("day")', 'df.write.mode("append")'],
          answer: 0,
          explanation: 'El modo extended incluye las secciones lógicas sin resolver, analizada y optimizada, además del plan físico.',
        },
        {
          domain: 'Troubleshooting, Monitoring, and Optimization',
          question: '¿Qué afirmación sobre un join y el shuffle está justificada?',
          options: ['Todo join debe redistribuir ambas entradas', 'Un shuffle no tiene costo de red', 'Una estrategia broadcast puede evitar redistribuir ambas entradas', 'AQE garantiza que todos los joins se conviertan en broadcast'],
          answer: 2,
          explanation: 'Las estrategias de join varían y broadcast contradice la idea de que todo join redistribuye ambas entradas.',
        },
        {
          domain: 'Troubleshooting, Monitoring, and Optimization',
          question: 'Un plan inicial difiere de la estrategia de ejecución final. ¿Qué explicación es coherente con AQE?',
          options: ['La agregación de negocio tuvo que cambiar', 'Las estadísticas de ejecución permitieron adaptar la estrategia', 'El cliente Python se convirtió en executor', 'Una ventana eliminó silenciosamente todas las filas de entrada'],
          answer: 1,
          explanation: 'AQE usa estadísticas de ejecución para adaptar estrategias, incluidos joins y la combinación de particiones tras el shuffle.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'Una expresión nativa y una UDF Python implementan la misma transformación necesaria. ¿Por qué prefieres primero la nativa?',
          options: ['Siempre evita leer almacenamiento', 'Desactiva Catalyst', 'Todas las UDF Python están prohibidas en serverless', 'Su expresión es visible para el optimizador'],
          answer: 3,
          explanation: 'El optimizador puede inspeccionar la estructura de una expresión nativa; la lógica Python arbitraria de una UDF le resulta opaca.',
        },
        {
          domain: 'Databricks Intelligence Platform',
          question: '¿Qué afirmación describe correctamente la ejecución de Photon en serverless?',
          options: ['Ejecuta operaciones columnares compatibles y recurre a Spark para trabajo incompatible', 'Ejecuta toda UDF Python en C++', 'Sustituye por completo la planificación de Catalyst', 'Requiere cómputo clásico administrado manualmente en Free Edition'],
          answer: 0,
          explanation: 'Photon acelera operaciones compatibles, mientras Catalyst sigue planificando y las operaciones incompatibles usan el motor de Spark.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: '¿Por qué agregas los viajes por zona y día antes de una ventana ROWS de ingresos acumulados ordenada por día?',
          options: ['Para convertir la ventana en particionado físico de archivos', 'Para garantizar una cantidad fija de viajes de muestra', 'Para definir una fila por zona y día y eliminar empates de fecha dentro de cada zona', 'Para impedir cualquier posible shuffle'],
          answer: 2,
          explanation: 'La agregación diaria previa establece la granularidad deseada y elimina empates del mismo día antes de calcular la suma acumulada.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'Un laboratorio debe conservar samples.nyctaxi.trips y guardar un resultado del ejercicio. ¿Qué política de destino corresponde?',
          options: ['Sobrescribir la tabla de origen', 'Descubrir el catálogo actual y usar un destino propio con permiso de escritura', 'Añadir las filas calculadas a samples', 'Suponer que cada workspace tiene el mismo nombre de catálogo con escritura'],
          answer: 1,
          explanation: 'Inspecciona el contexto del catálogo y usa un destino donde tengas permiso de escritura; el origen de ejemplo se mantiene intacto.',
        },
        {
          domain: 'Troubleshooting, Monitoring, and Optimization',
          question: 'La guía menciona métricas por stage de Spark UI, pero practicas en Free Edition serverless. ¿Qué debes hacer?',
          options: ['Usar sparkContext para abrir Spark UI', 'Tratar explain como una medición del tiempo transcurrido', 'Suponer que no se pueden inspeccionar consultas terminadas', 'Aprender los conceptos de Spark UI y practicar con el perfil de consulta terminado'],
          answer: 3,
          explanation: 'El alcance del examen puede superar Free Edition: Spark UI es conceptual aquí y el perfil de consulta es la ruta de práctica en serverless.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's03-results', answer: 'visualization',
          question: 'Abriste + en el resultado mostrado de un DataFrame. ¿Dónde haces clic para crear un gráfico?',
          explanation: 'Elige Visualization en el menú +; Data Profile es una función distinta de análisis exploratorio.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's03-results', answer: 'dataProfile',
          question: 'El menú + está abierto y quieres un perfil de datos en lugar de un gráfico. ¿Qué opción eliges?',
          explanation: 'Data Profile es la opción documentada del menú para perfilar datos; Visualization inicia un gráfico.',
        },
        {
          type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's03-performance', answer: 'performance',
          question: 'Terminó la ejecución de una celda serverless. ¿Qué control inicia la ruta documentada a los detalles de rendimiento?',
          explanation: 'Empieza en See performance y luego selecciona la sentencia Spark pertinente antes de abrir su perfil de consulta.',
        },
        {
          type: 'hotspot', domain: 'Troubleshooting, Monitoring, and Optimization', screen: 's03-performance', answer: 'queryProfile',
          question: 'Ya abriste los detalles de rendimiento y seleccionaste una sentencia Spark terminada. ¿Adónde vas ahora?',
          explanation: 'See query profile abre el perfil de la sentencia; el perfil completo está disponible una vez que termina la ejecución.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's03-chart', answer: 'chartType',
          question: 'En el editor de visualizaciones, ¿qué control permite elegir el tipo de gráfico?',
          explanation: 'Visualization Type selecciona el tipo de gráfico; Save conserva la visualización tras configurarla.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's03-chart', answer: 'save',
          question: 'Terminaste de configurar el gráfico. ¿Qué control conserva la visualización?',
          explanation: 'Save conserva la visualización; el selector de tipo cambia el gráfico en lugar de guardarlo.',
        },
      ],
    },
  };
})(globalThis);
