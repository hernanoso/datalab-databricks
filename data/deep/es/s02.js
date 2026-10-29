// Profundización original: Spark SQL. Fuentes oficiales del handoff de investigación.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const DOCS = 'https://docs.databricks.com/aws/en';
  const VIEWS = `${DOCS}/views/`;
  const CTE = `${DOCS}/sql/language-manual/sql-ref-syntax-qry-select-cte`;
  const CTAS = `${DOCS}/sql/language-manual/sql-ref-syntax-ddl-create-table-using`;
  const READ = `${DOCS}/sql/language-manual/functions/read_files`;
  const CHART = `${DOCS}/notebooks/visualizations/`;
  const EXPORT = `${DOCS}/sql/language-manual/sql-ref-syntax-dml-insert-overwrite-directory`;

  DataLab.deep.es.s02 = {
    deepDive: [
      {
        title: 'Catalyst y Photon: planificar no es ejecutar',
        body: [
          'Catalyst sigue planificando las consultas de Spark SQL. Photon sustituye operaciones de ejecución compatibles por implementaciones nativas en C++ que procesan lotes columnares. No es un reemplazo de todo Spark: cuando una operación no es compatible, la ejecución recurre a Spark.',
          'Photon está habilitado por defecto en los SQL warehouses. Eso no significa que cada operación de cada consulta se ejecute en Photon; separa siempre el motor que construye el plan de las operaciones que pueden acelerarse durante la ejecución.',
        ],
        source: { label: 'Motor Photon', url: `${DOCS}/compute/photon` },
      },
      {
        title: 'Tablas administradas y externas: quién controla los archivos',
        body: [
          'Una tabla administrada delega el ciclo de vida del almacenamiento y su optimización a Unity Catalog. Una tabla externa utiliza una ubicación externa registrada: registrar el objeto no equivale a entregar a Databricks el ciclo de vida de esos archivos.',
          'Al eliminar una tabla externa se elimina su metadato, no sus archivos. Esta distinción importa al diseñar la propiedad de los datos: el nombre SQL y los archivos físicos no tienen necesariamente el mismo ciclo de vida.',
        ],
        source: { label: 'Tablas externas de Unity Catalog', url: `${DOCS}/tables/external` },
      },
      {
        title: 'Vistas: reutilizar lógica sin guardar sus resultados',
        body: [
          'Una vista ordinaria registra el texto de una consulta sin escribir las filas de su resultado. Permite ofrecer una definición reutilizable dentro de un catálogo y un esquema, mientras una tabla creada con CTAS guarda el resultado de la consulta.',
          'El alcance de una vista temporal depende del contexto. En notebooks y jobs está limitado al notebook o script. En Databricks SQL está limitado a la misma consulta, que puede contener varias sentencias; no se comparte entre consultas separadas.',
        ],
        source: { label: 'Vistas y alcance de vistas temporales', url: VIEWS },
      },
      {
        title: 'CTEs: nombres locales, no almacenamiento intermedio',
        body: [
          'Una CTE define con WITH un resultado con nombre dentro de una sola sentencia SQL. Puedes referenciarlo varias veces en esa sentencia, pero no crea una tabla persistente ni garantiza almacenar un resultado intermedio. Su utilidad aquí es separar filtro, clasificación y agregación.',
          'Las CTEs recursivas están documentadas para Databricks SQL y Runtime 17.0 o superior: combinan un ancla y un paso recursivo con UNION ALL. La profundidad máxima predeterminada es 100 y el límite de resultado es 1 000 000 de filas. No se admiten en UPDATE, DELETE ni MERGE. Son ampliación de SQL, no un objetivo explícito de la guía de examen utilizada.',
        ],
        source: { label: 'Expresiones de tabla comunes', url: CTE },
      },
      {
        title: 'CTAS, INSERT y reemplazo: tres intenciones distintas',
        body: [
          'CTAS crea y llena una tabla a partir de una consulta. En cambio, CREATE TABLE con columnas explícitas establece primero la estructura; después INSERT INTO agrega filas. Repetir una inserción puede duplicar datos, porque agregar no significa reemplazar.',
          'CREATE OR REPLACE TABLE vuelve a producir el contenido de la tabla y no es una carga incremental. Solo puedes esperar el mismo resultado al repetirlo si la entrada no cambia y la transformación es determinista; no atribuyas esa estabilidad a cualquier consulta por el mero uso de OR REPLACE.',
        ],
        source: { label: 'CREATE TABLE y CTAS', url: CTAS },
      },
      {
        title: 'read_files: contrato de esquema y procedencia',
        body: [
          'read_files permite consultar archivos CSV, JSON y Parquet. Puedes entregar un esquema en DDL o permitir la inferencia a partir de los archivos. inferColumnTypes es true por defecto, a diferencia de Auto Loader: no traslades supuestos de una herramienta a la otra.',
          'Para rastrear la procedencia selecciona explícitamente _metadata.file_path; no esperes que aparezca por usar SELECT *. Un esquema explícito hace visible tu contrato de lectura, mientras la inferencia sirve para explorar qué contienen los archivos antes de fijar ese contrato.',
        ],
        source: { label: 'Función read_files', url: READ },
      },
      {
        title: 'Parseo y rescate no son la misma validación',
        body: [
          'Para un CSV con encabezados indica header => true. read_files aporta rescate de datos por defecto: un valor incompatible con el tipo esperado puede rescatarse sin tratarse como un registro mal formado. Con rescate habilitado, FAILFAST no falla solo por una incompatibilidad de tipo rescatada.',
          'Por eso conviene distinguir la estructura de un registro de los tipos de sus valores. No interpretes que una lectura que termina correctamente demuestra que todos los valores cumplen el esquema: revisa también los datos rescatados antes de publicar una tabla limpia.',
        ],
        source: { label: 'CSV: parseo y datos rescatados', url: `${DOCS}/query/formats/csv` },
      },
      {
        title: 'JSON como texto, estructura tipada o VARIANT',
        body: [
          'Las cadenas JSON permiten acceso a campos con el operador dos puntos. from_json convierte una cadena en valores estructurados tipados según un esquema, mientras VARIANT ofrece almacenamiento optimizado para datos semiestructurados. Son representaciones distintas, no nombres intercambiables para el mismo contrato de tipos.',
          'Al leer archivos JSON, el formato predeterminado espera un objeto completo por línea. Un documento que ocupa varias líneas requiere multiLine => true. Decide primero cómo está organizado el archivo y luego cómo representar sus campos en SQL; en el laboratorio usarás JSON por líneas exportado desde una tabla.',
        ],
        source: { label: 'Datos semiestructurados', url: `${DOCS}/semi-structured/` },
      },
      {
        title: 'Arrays: transformar elementos sin cambiar el objetivo',
        body: [
          'transform recibe un array y una función lambda que calcula un nuevo elemento por cada elemento de entrada. Por ejemplo, transform(array(1,2,3), x -> x + 1) devuelve [2,3,4]. Es una transformación del contenido del array, no una petición de persistencia.',
          'La lambda puede recibir un segundo parámetro que representa el índice del elemento. Distinguir valor e índice te permite expresar reglas sobre posiciones sin confundir el array completo con cada uno de sus elementos.',
        ],
        source: { label: 'Función transform', url: `${DOCS}/sql/language-manual/functions/transform` },
      },
      {
        title: 'Visualizar también cambia lo que estás inspeccionando',
        body: [
          'Tanto el notebook como SQL Editor permiten abrir +, elegir Visualization, seleccionar Visualization Type y guardar con Save. El gráfico es una forma de inspeccionar un resultado; no sustituye la definición de una tabla ni convierte una CTE en un objeto persistente.',
          'Los filtros de una visualización también filtran la tabla de resultados, y los filtros de la tabla afectan a la visualización. Cuando compares lo que ves, revisa esos filtros: una vista filtrada de los resultados no es evidencia de que hayas modificado la tabla almacenada.',
        ],
        source: { label: 'Visualizaciones de resultados', url: CHART },
      },
    ],
    diagram: {
      title: 'Del archivo a la tabla y al gráfico',
      caption: 'Flujo conceptual: leer y transformar no implica persistir. CTAS guarda filas; una vista ordinaria guarda la definición que permite consultarlas.',
      layers: [
        { label: 'Fuentes', nodes: ['CSV, JSON y Parquet en volúmenes', 'samples.nyctaxi.trips, solo lectura'] },
        { label: 'Lectura y transformación', nodes: ['read_files: esquema y rescate', 'CTEs: conversión y filtros', 'Agregación por tramo'] },
        { label: 'Persistencia y reutilización', nodes: ['Tabla Delta administrada con CTAS', 'Vista ordinaria con lógica reutilizable'] },
        { label: 'Consumo', nodes: ['Resultados y gráfico en notebook', 'Resultados y gráfico en SQL Editor'] },
      ],
    },
    comparison: {
      title: 'Qué guarda cada objeto y cuánto dura su alcance',
      headers: ['Construcción', 'Qué guarda', 'Alcance'],
      rows: [
        ['CTE', 'Ningún objeto persistente', 'Una sentencia SQL'],
        ['Vista ordinaria', 'Definición de consulta, no filas del resultado', 'Objeto del catálogo y esquema'],
        ['Vista temporal en notebook', 'No persiste una tabla de resultados', 'Notebook o script'],
        ['Vista temporal en Databricks SQL', 'No persiste una tabla de resultados', 'La misma consulta, con varias sentencias'],
        ['Tabla CTAS', 'Filas calculadas por la consulta', 'Persistente hasta que se cambie o elimine'],
      ],
      sources: [
        { label: 'Vistas', url: VIEWS },
        { label: 'CTEs', url: CTE },
        { label: 'CREATE TABLE', url: CTAS },
      ],
    },
    lab: {
      title: 'Tarifas por distancia: de CTEs a archivos y visualización',
      goal: 'Resolver el ejercicio de tarifas por tramo con filtros explícitos, guardar una tabla Delta en tu catálogo, exportar y leer tres formatos y visualizar el promedio sin escribir nunca en samples.',
      minutes: 75,
      requirements: [
        'Un workspace Databricks Free Edition: solo serverless y un SQL warehouse 2X-Small. No necesitas Azure.',
        'Un notebook SQL y acceso de lectura a samples.nyctaxi.trips; permiso para crear esquemas, tablas y volúmenes en tu catálogo.',
        'Sustituye <tu_catalogo> por un catálogo escribible obtenido con current_catalog(); si devuelve samples, elige tu catálogo escribible y vuelve a comprobarlo.',
        'SQL contrastado con documentación, no ejecutado en Free Edition durante esta investigación. Los totales de samples no están fijados; usa los resultados de tu consulta como referencia.',
      ],
      steps: [
        {
          title: 'Ubica tu catálogo antes de escribir',
          body: 'En un notebook SQL conectado a serverless, ejecuta esta consulta. Anota el catálogo y el esquema actuales. Si estás en samples, cambia a tu catálogo escribible antes de continuar; no crees objetos en el catálogo de ejemplo.',
          code: { language: 'sql', code: 'SELECT current_catalog(), current_schema();' },
          check: 'Tienes identificado un catálogo escribible para sustituir <tu_catalogo> en todo el laboratorio.',
          screen: { id: 'notebook', highlight: ['languageSelect', 'computeSelect'] },
        },
        {
          title: 'Aísla el trabajo en tu esquema',
          body: 'Sustituye el marcador y crea un esquema dedicado. Mantén los nombres completos en las escrituras siguientes: así no dependes del esquema activo en otra herramienta. El nombre raw se reserva para el volumen de archivos de esta práctica.',
          code: { language: 'sql', code: 'CREATE SCHEMA IF NOT EXISTS <tu_catalogo>.s02_lab;\nUSE SCHEMA <tu_catalogo>.s02_lab;\nCREATE VOLUME IF NOT EXISTS <tu_catalogo>.s02_lab.raw;' },
          check: 'El esquema s02_lab y su volumen raw están en tu catálogo, no en samples.',
        },
        {
          title: 'Filtra, clasifica y materializa',
          body: 'Descarta distancias y tarifas no positivas. La primera CTE define los viajes válidos y la segunda asigna el tramo: menos de 2, de 2 a 10 inclusive o más de 10. El SELECT final agrega y CTAS guarda el resultado. Reemplaza solo esta tabla de práctica.',
          code: { language: 'sql', code: "CREATE OR REPLACE TABLE <tu_catalogo>.s02_lab.tarifas USING DELTA AS\nWITH validos AS (\n  SELECT trip_distance, fare_amount\n  FROM samples.nyctaxi.trips\n  WHERE trip_distance > 0 AND fare_amount > 0\n), tramos AS (\n  SELECT fare_amount,\n    CASE WHEN trip_distance < 2 THEN 'corto'\n         WHEN trip_distance <= 10 THEN 'medio'\n         ELSE 'largo' END AS tramo\n  FROM validos\n)\nSELECT tramo, COUNT(*) AS viajes,\n       ROUND(AVG(fare_amount), 2) AS tarifa_promedio\nFROM tramos\nGROUP BY tramo;" },
          check: 'Se creó tu tabla tarifas. No se insertó ni reemplazó nada en samples.',
        },
        {
          title: 'Contrasta la tabla con su definición',
          body: 'Consulta la tabla y anota los tramos, sus conteos y promedios observados; no hay un conteo fijo de samples en esta guía. En Catalog abre tu tabla y revisa Columns y Sample Data para relacionar el resultado SQL con el objeto persistente.',
          code: { language: 'sql', code: 'SELECT * FROM <tu_catalogo>.s02_lab.tarifas ORDER BY tramo;' },
          check: 'Las columnas tramo, viajes y tarifa_promedio corresponden al SELECT de CTAS y tienes una referencia para comparar las lecturas.',
          screen: { id: 's02-table', highlight: ['columns', 'sampleData'] },
        },
        {
          title: 'Exporta CSV dentro de tu volumen',
          body: 'Escribe el resultado en un subdirectorio dedicado del volumen. INSERT OVERWRITE DIRECTORY reemplaza el contenido de ese destino: utiliza exclusivamente la ruta de práctica indicada, no una carpeta que contenga archivos ajenos. No necesitas subir archivos desde tu computadora.',
          code: { language: 'sql', code: "INSERT OVERWRITE DIRECTORY '/Volumes/<tu_catalogo>/s02_lab/raw/tarifas_csv'\nUSING CSV OPTIONS (header 'true')\nSELECT * FROM <tu_catalogo>.s02_lab.tarifas;" },
          check: 'La escritura finaliza en tarifas_csv dentro de tu volumen raw.',
        },
        {
          title: 'Exporta JSON y Parquet por separado',
          body: 'Repite la exportación con directorios distintos para no mezclar formatos. JSON se leerá como objetos por línea; Parquet se leerá con su formato correspondiente. Estas escrituras solo reemplazan los subdirectorios de práctica nombrados aquí.',
          code: { language: 'sql', code: "INSERT OVERWRITE DIRECTORY '/Volumes/<tu_catalogo>/s02_lab/raw/tarifas_json'\nUSING JSON\nSELECT * FROM <tu_catalogo>.s02_lab.tarifas;\n\nINSERT OVERWRITE DIRECTORY '/Volumes/<tu_catalogo>/s02_lab/raw/tarifas_parquet'\nUSING PARQUET\nSELECT * FROM <tu_catalogo>.s02_lab.tarifas;" },
          check: 'Cada formato tiene su propio directorio dentro del volumen raw.',
        },
        {
          title: 'Lee los tres formatos y rastrea el archivo',
          body: 'Ejecuta cada SELECT y contrasta sus valores con la tabla del paso 4. CSV usa encabezados y un esquema explícito; JSON y Parquet usan inferencia. Selecciona el metadato de ruta de forma explícita. No compares el orden físico de archivos o filas, sino los valores ordenados por tramo.',
          code: { language: 'sql', code: "SELECT tramo, viajes, tarifa_promedio, _metadata.file_path AS archivo\nFROM read_files('/Volumes/<tu_catalogo>/s02_lab/raw/tarifas_csv',\n  format => 'csv', header => true,\n  schema => 'tramo STRING, viajes BIGINT, tarifa_promedio DOUBLE')\nORDER BY tramo;\n\nSELECT * FROM read_files('/Volumes/<tu_catalogo>/s02_lab/raw/tarifas_json',\n  format => 'json') ORDER BY tramo;\n\nSELECT * FROM read_files('/Volumes/<tu_catalogo>/s02_lab/raw/tarifas_parquet',\n  format => 'parquet') ORDER BY tramo;" },
          check: 'Puedes comparar tramos, conteos y promedios entre formatos y señalar el archivo de origen de cada fila del CSV.',
        },
        {
          title: 'Expón el resultado con una vista ordinaria',
          body: 'Registra una vista reutilizable sobre la tabla. La vista guarda la consulta, no otra copia de los resultados. Las CTEs validos y tramos del paso 3 ya no están en alcance; consulta ahora la tabla o la vista por su nombre persistente.',
          code: { language: 'sql', code: 'CREATE OR REPLACE VIEW <tu_catalogo>.s02_lab.resumen_tarifas AS\nSELECT tramo, viajes, tarifa_promedio\nFROM <tu_catalogo>.s02_lab.tarifas;\n\nSELECT * FROM <tu_catalogo>.s02_lab.resumen_tarifas ORDER BY tramo;' },
          check: 'La vista permite consultar los valores de la tabla sin reutilizar nombres de CTEs fuera de su sentencia.',
        },
        {
          title: 'Consulta desde SQL Editor',
          body: 'Abre SQL Editor, selecciona el SQL warehouse disponible y ejecuta la consulta sobre tu tabla con Run (1000). Usa el nombre completo porque el contexto del editor puede ser distinto del notebook. La maqueta ilustra controles documentados, no una captura real.',
          code: { language: 'sql', code: 'SELECT tramo, tarifa_promedio\nFROM <tu_catalogo>.s02_lab.tarifas\nORDER BY tramo;' },
          check: 'Ves tramo y tarifa_promedio en los resultados del editor y puedes compararlos con el notebook.',
          screen: { id: 's02-sql', highlight: ['sqlEditor', 'run'] },
        },
        {
          title: 'Crea el gráfico y revisa los filtros',
          body: 'Sobre el resultado, abre + y elige Visualization. En Visualization Type selecciona un gráfico de barras; configura tramo como categoría y tarifa_promedio como valor en Y columns. Revisa Use aggregation porque la consulta ya está agregada y guarda con Save. Esta ruta también existe en resultados de notebook; los filtros del gráfico y de la tabla se afectan mutuamente.',
          check: 'El gráfico guardado representa los promedios consultados. Revisaste los filtros antes de compararlo con la tabla de resultados.',
          screen: { id: 's02-chart', highlight: ['type', 'yColumns', 'aggregation', 'save'] },
        },
      ],
      wrapUp: 'Separaste lectura, transformación, persistencia y consumo: las CTEs organizaron una sentencia, CTAS guardó filas, la vista registró lógica reutilizable y el gráfico mostró el resultado. Repetir la práctica reemplaza solo sus destinos; no constituye una carga incremental.',
      sources: [
        { label: 'Límites de Free Edition', url: `${DOCS}/getting-started/free-edition-limitations` },
        { label: 'Catálogo actual', url: `${DOCS}/sql/language-manual/functions/current_catalog` },
        { label: 'CTAS', url: CTAS },
        { label: 'Exportar a un directorio', url: EXPORT },
        { label: 'read_files', url: READ },
        { label: 'JSON y documentos multilínea', url: `${DOCS}/query/formats/json` },
        { label: 'Vistas', url: VIEWS },
        { label: 'Ejecutar consultas en SQL Editor', url: `${DOCS}/sql/user/sql-editor/run-queries` },
        { label: 'Explorar objetos', url: `${DOCS}/discover/database-objects` },
        { label: 'Visualizaciones', url: CHART },
        { label: 'Tablas administradas', url: `${DOCS}/tables/managed` },
        { label: 'INSERT INTO', url: `${DOCS}/sql/language-manual/sql-ref-syntax-dml-insert-into` },
        { label: 'from_json', url: `${DOCS}/sql/language-manual/functions/from_json` },
      ],
    },
    certification: {
      intro: 'Preguntas de práctica originales, alineadas con las guías oficiales. No son preguntas reales del examen.',
      exams: [
        {
          name: 'Databricks Certified Data Engineer Associate',
          url: 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf',
          domains: ['Data Transformation and Modeling', 'Data Ingestion and Loading', 'Governance and Security'],
        },
      ],
      questions: [
        {
          domain: 'Data Transformation and Modeling',
          question: 'Debes guardar los resultados limpios de una consulta como una tabla nueva. ¿Qué construcción corresponde?',
          options: ['Una CTE sin SELECT final', 'CREATE TABLE ... AS SELECT', 'Una vista temporal del notebook', 'SELECT sin destino de escritura'],
          answer: 1,
          explanation: 'CTAS crea y llena una tabla con el resultado de la consulta; una CTE o una vista no guarda esas filas como una tabla nueva.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'Una consulta define WITH limpios AS (...). ¿Dónde puedes referenciar limpios sin crear otro objeto?',
          options: ['En cualquier notebook del workspace', 'En cualquier consulta posterior', 'En la misma sentencia SQL', 'Solo en un SQL warehouse distinto'],
          answer: 2,
          explanation: 'Una CTE tiene alcance de sentencia y puede referenciarse varias veces dentro de ella; no se registra como objeto persistente.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'Un equipo quiere reutilizar una consulta sin almacenar otra copia de sus filas. ¿Qué objeto encaja?',
          options: ['Una vista ordinaria', 'Una tabla CTAS', 'Un directorio CSV exportado', 'Una tabla llenada con INSERT'],
          answer: 0,
          explanation: 'Una vista ordinaria almacena la definición de la consulta, no las filas del resultado, y permite reutilizar esa lógica.',
        },
        {
          domain: 'Data Ingestion and Loading',
          question: 'Un CSV incluye nombres de columna en su primera fila. ¿Qué opción de read_files corresponde?',
          options: ["format => 'json'", 'multiLine => true', 'header => false', 'header => true'],
          answer: 3,
          explanation: 'header => true identifica los encabezados del CSV; multiLine corresponde al caso de documentos JSON de varias líneas descrito aquí.',
        },
        {
          domain: 'Data Ingestion and Loading',
          question: 'Necesitas registrar qué archivo originó cada fila leída con read_files. ¿Qué seleccionas explícitamente?',
          options: ['current_catalog()', '_metadata.file_path', 'El nombre de una CTE', 'Solo SELECT * sin metadatos'],
          answer: 1,
          explanation: 'El campo _metadata.file_path debe seleccionarse explícitamente para recuperar la ruta de procedencia de los registros.',
        },
        {
          domain: 'Governance and Security',
          question: 'Se elimina una tabla externa de Unity Catalog. ¿Qué ocurre con sus archivos según su ciclo de vida?',
          options: ['Se borran siempre con el metadato', 'Se convierten en una vista', 'Permanecen; se elimina el metadato de la tabla', 'Se trasladan al notebook'],
          answer: 2,
          explanation: 'Eliminar la tabla externa retira su metadato, no los archivos de la ubicación externa; no confundas registro SQL con propiedad del almacenamiento.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'Repites INSERT INTO con las mismas filas sin ninguna lógica adicional. ¿Qué riesgo existe?',
          options: ['Agregar filas duplicadas', 'Reemplazar automáticamente toda la tabla', 'Crear solo una vista', 'Eliminar los archivos de entrada'],
          answer: 0,
          explanation: 'INSERT INTO agrega filas. Repetir los mismos datos puede duplicarlos; no equivale a reemplazar la tabla ni a deduplicar.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: '¿Qué devuelve transform(array(1,2,3), x -> x + 1)?',
          options: ['[1,2,3]', '[1,3,5]', '[3,4,5]', '[2,3,4]'],
          answer: 3,
          explanation: 'La lambda suma uno a cada elemento: 1 + 1 = 2, 2 + 1 = 3 y 3 + 1 = 4; el resultado es [2,3,4].',
        },
        {
          domain: 'Data Ingestion and Loading',
          question: 'Un archivo JSON contiene un documento distribuido en varias líneas. ¿Qué opción corresponde al leerlo?',
          options: ['header => true', 'multiLine => true', "format => 'csv'", 'inferColumnTypes => false como sustituto de multiLine'],
          answer: 1,
          explanation: 'JSON espera por defecto un objeto completo por línea; multiLine => true permite leer un documento que ocupa varias líneas.',
        },
        {
          domain: 'Data Transformation and Modeling',
          question: 'Tienes una cadena JSON y necesitas valores estructurados con tipos definidos por un esquema. ¿Qué función eliges?',
          options: ['current_schema', 'transform sobre un array inexistente', 'from_json', 'current_catalog'],
          answer: 2,
          explanation: 'from_json interpreta la cadena JSON usando un esquema para producir valores estructurados tipados, en lugar de conservar solo texto.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-sql', answer: 'run',
          question: 'Práctica de interfaz complementaria: tienes lista tu consulta de tarifas en SQL Editor. ¿Qué control documentado la ejecuta?',
          explanation: 'Run (1000) es el control de ejecución representado. Este ejercicio de navegación complementa el laboratorio; los clics no son objetivos explícitos de la guía de examen.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-results', answer: 'visualization',
          question: 'Práctica de interfaz complementaria: ya abriste + sobre los resultados. ¿Qué opción inicia un gráfico?',
          explanation: 'Visualization abre la creación de una visualización del resultado. Es práctica de navegación del laboratorio, no un objetivo explícito de clics del examen.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-chart', answer: 'type',
          question: 'Práctica de interfaz complementaria: ¿dónde eliges el tipo de gráfico para comparar los tramos?',
          explanation: 'Visualization Type permite elegir el tipo de visualización. Esta navegación apoya el laboratorio y no es un objetivo explícito de la guía de examen.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-chart', answer: 'save',
          question: 'Práctica de interfaz complementaria: terminaste de configurar el gráfico. ¿Dónde lo guardas?',
          explanation: 'Save guarda la visualización configurada; no materializa una nueva tabla. El clic es práctica complementaria, no un objetivo explícito de la guía de examen.',
        },
        {
          type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's02-table', answer: 'columns',
          question: 'Práctica de interfaz complementaria: en Catalog, ¿dónde inspeccionas las columnas de tu tabla CTAS?',
          explanation: 'Columns permite inspeccionar las columnas del objeto en Catalog. La navegación complementa la práctica de tablas, pero estos clics no son objetivos explícitos del examen.',
        },
      ],
    },
  };
})(globalThis);
