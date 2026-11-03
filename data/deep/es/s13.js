// Contenido original; fuentes y rutas verificadas proporcionadas por el padre.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const DOC = 'https://docs.databricks.com/aws/en/';
  const tutorial = { label: 'Crear un dashboard AI/BI', url: DOC + 'dashboards/tutorials/create-dashboard' };
  const desktop = { label: 'Conector de Power BI Desktop', url: DOC + 'partners/bi/power-bi/desktop' };
  const service = { label: 'Requisitos de integración con Power BI service', url: DOC + 'partners/bi/power-bi/service' };
  const free = { label: 'Límites de Free Edition', url: DOC + 'getting-started/free-edition-limitations' };
  const gold = { label: 'Arquitectura medallion: gold para analítica', url: DOC + 'lakehouse/medallion' };
  const sql = { label: 'Vistas temporales', url: DOC + 'sql/language-manual/sql-ref-syntax-ddl-create-view' };
  const pl300 = { label: 'Guía opcional de PL-300', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-300' };
  const guide = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';
  DataLab.deep.es.s13 = {
    deepDive: [
      { title: 'Gold es un contrato de significado de negocio', body: ['Los datasets gold sirven a la analítica de negocio. Define el grano antes del gráfico: una fila por pedido no equivale a una fila por línea de pedido. Los ingresos son aditivos aquí, pero el promedio de promedios regionales no es, en general, el promedio global. Documenta las definiciones de métricas y valida los totales antes de agregar filtros.'], source: gold },
      { title: 'Separa datos, cómputo SQL y presentación', body: ['La ruta conceptual es dataset gold gobernado → SQL warehouse → dashboard AI/BI, o modelo semántico y reporte de Power BI. El warehouse ejecuta SQL; no es un modelo semántico almacenado ni un gráfico. La consulta del dataset define las filas y columnas disponibles para visualizar: reducir el grano puede eliminar dimensiones necesarias para filtrar después.'], source: tutorial },
      { title: 'Borrador AI/BI: primero consulta, después visualización', body: ['La ruta documentada es New → Dashboard y luego Data → Add SQL dataset → Run. Valida el resultado antes de configurar una visualización y sus filtros. El ejercicio opcional de borrador usa una consulta VALUES autocontenida: una vista temporal del notebook tiene alcance de sesión y no debes suponer que otra sesión SQL del dashboard pueda verla.'], source: tutorial },
      { title: 'Import y DirectQuery tienen límites de actualización distintos', body: ['Import copia datos a un modelo de Power BI: la instantánea importada cambia cuando se actualiza. DirectQuery emite consultas al origen en lugar de importar todo el dataset, pero la caché, las actualizaciones, los permisos y la disponibilidad del origen siguen afectando lo que ve cada usuario. No garantiza datos siempre actuales: considera latencia, concurrencia y costo del warehouse, además del diseño del modelo.'], source: desktop },
      { title: 'Conectar Desktop no equivale a integrar el servicio', body: ['El flujo genérico de Desktop es Get data → Databricks → Connect, con Server Hostname y HTTP Path, seguido del modo de conexión y autenticación admitida. La conectividad de Free Edition con Power BI está NO VERIFICADA por las fuentes proporcionadas: no la prometas ni deduzcas una prohibición absoluta. Este laboratorio no solicita instalación, inicio de sesión, credenciales ni una conexión real.'], source: desktop },
      { title: 'Los requisitos del servicio pertenecen a esa integración', body: ['La integración documentada de Databricks con Power BI service tiene requisitos de Unity Catalog, capacidad y XMLA. Evalúalos para esa integración, no como prerrequisitos universales de cualquier flujo de Desktop. Un reporte que funciona en Desktop no demuestra por sí solo que estén configuradas la publicación, la actualización o la distribución en el servicio.'], source: service },
      { title: 'Publicar cambia la pregunta sobre permisos', body: ['El flujo Publish incluye Share with data permissions. Compartir con los permisos de datos de quien publica difiere de exigir que cada lector use sus propios permisos sobre los datos: revisa la audiencia y el acceso efectivo antes de publicar. Un filtro visual no es una frontera de seguridad y poder ver un dashboard no concede acceso universal a todas las tablas subyacentes.'], source: tutorial },
      { title: 'Free Edition delimita la práctica SQL', body: ['Free Edition tiene cuotas serverless y restricciones de warehouse; la disponibilidad puede limitar cuándo ejecutas el ejercicio. Usa cuatro pedidos sintéticos y vistas temporales en una sesión SQL nueva, sin tablas persistentes, recursos aprovisionados ni publicación. Las maquetas empresariales propias solo ilustran controles y valores precalculados: nunca ejecutan SQL, conectan Power BI ni aplican permisos.'], source: free },
    ],
    diagram: {
      title: 'Un contrato de métricas, dos rutas de BI',
      caption: 'Arquitectura conceptual basada en las fuentes de gold, dashboards y Power BI. El laboratorio usa datos temporales sintéticos; no demuestra conectividad externa ni publicación.',
      layers: [
        { label: 'Contrato gold', nodes: ['Una fila por pedido', 'Definiciones de ingresos y cantidad de pedidos'] },
        { label: 'SQL warehouse', nodes: ['SQL del dataset y agregaciones', 'Permisos, cuotas y costo de consultas'] },
        { label: 'Ruta de presentación', nodes: ['Dataset AI/BI → visualización → filtro', 'Modelo semántico Power BI → reporte; Import o DirectQuery'] },
        { label: 'Frontera de audiencia', nodes: ['Permisos de datos del publicador frente al lector', 'Verificar actualización y contexto de filtro'] },
      ],
    },
    comparison: {
      title: 'Comparar alternativas sin prometer datos en vivo',
      headers: ['Alternativa', 'Ejecución sobre datos', 'Límite de actualización', 'Consideración de acceso y costo'],
      rows: [
        ['Dashboard AI/BI', 'SQL del dataset en un warehouse', 'Verificar actualización de dataset y dashboard', 'Revisar permisos de publicador/lector y uso del warehouse'],
        ['Power BI Import', 'Cargar una instantánea en el modelo', 'La actualización renueva la instantánea importada', 'Revisar identidad de actualización y distribución del modelo; warehouse al actualizar'],
        ['Power BI DirectQuery', 'El modelo envía consultas al origen', 'Consultas al origen más caché y comportamiento de actualización', 'Revisar autenticación, latencia y costo de consultas al origen'],
        ['Integración con Power BI service', 'Integración distinta con prerrequisitos documentados', 'Verificar su ciclo de actualización configurado', 'Unity Catalog, capacidad y XMLA son requisitos específicos de la integración'],
      ],
      sources: [tutorial, desktop, service, free],
    },
    lab: {
      title: 'Validar un pequeño contrato BI con seguridad en Free Edition',
      goal: 'Calcular ingresos, pedidos y valor promedio desde cuatro filas sintéticas, reconciliar un filtro regional con una maqueta de reporte propia y estudiar conexión y publicación sin realizarlas.',
      minutes: 45,
      requirements: [
        'Un notebook/sesión SQL nuevo con cómputo serverless disponible en Free Edition. Mantén la misma sesión para la vista temporal s13_orders; las cuotas pueden exigir esperar.',
        'No requiere instalar Power BI, iniciar sesión, credenciales, suscripción Azure, aprovisionamiento ni publicación. Los clics de las maquetas son ilustrativos, no operaciones externas.',
        'Usa solo las filas sintéticas indicadas. No modifiques datos de producción ni permisos; no necesitas objetos persistentes ni limpieza destructiva.',
      ],
      steps: [
        { title: 'Identificar la entrada al dashboard sin crear uno', body: 'Estudia New → Dashboard en la maqueta propia. El laboratorio obligatorio ejecuta SQL en tu notebook/sesión existente, no en un dashboard recién aprovisionado. La ruta de borrador es opcional más adelante.', check: 'Identificas Dashboard y separas el ejercicio SQL obligatorio del trabajo opcional de interfaz.', screen: { id: 's13-new', highlight: ['new', 'dashboard'] } },
        { title: 'Crear cuatro pedidos sintéticos temporales', body: 'Ejecuta esto solo en una sesión nueva reservada para el ejercicio. Cada fila es exactamente un pedido; amount es DECIMAL para explicitar la aritmética monetaria esperada. La vista temporal no persiste una tabla.', code: { language: 'sql', code: `CREATE OR REPLACE TEMP VIEW s13_orders AS
SELECT order_id, region, CAST(amount AS DECIMAL(10,2)) AS amount
FROM VALUES (1, 'North', 10), (2, 'North', 20),
            (3, 'South', 15), (4, 'South', 5)
AS v(order_id, region, amount);
SELECT * FROM s13_orders ORDER BY order_id;` }, check: 'Exactamente (1,North,10.00), (2,North,20.00), (3,South,15.00), (4,South,5.00). No se leyeron pedidos reales.' },
        { title: 'Reconciliar los tres KPI', body: 'Cuenta pedidos al grano declarado de una fila por pedido. Este COUNT(*) dejaría de ser un conteo de pedidos tras unir varias líneas por pedido. Convierte el promedio mostrado a dos decimales sin cambiar la definición subyacente.', code: { language: 'sql', code: `SELECT SUM(amount) AS revenue, COUNT(*) AS orders,
       CAST(AVG(amount) AS DECIMAL(10,2)) AS avg_order_value
FROM s13_orders;` }, check: 'revenue = 50.00; orders = 4; avg_order_value = 12.50.' },
        { title: 'Calcular barras regionales y filtro North', body: 'Usa los mismos pedidos para los totales regionales y el filtro North. Verifica tanto cantidad como ingresos: un total aparentemente correcto no detectaría todos los errores de grano. Estas consultas solo leen la vista temporal.', code: { language: 'sql', code: `SELECT region, COUNT(*) AS orders, SUM(amount) AS revenue
FROM s13_orders GROUP BY region ORDER BY region;
SELECT COUNT(*) AS orders, SUM(amount) AS revenue,
       CAST(AVG(amount) AS DECIMAL(10,2)) AS avg_order_value
FROM s13_orders WHERE region = 'North';` }, check: 'North: 2 pedidos / 30.00; South: 2 / 20.00. Filtro North: orders 2, revenue 30.00, promedio 15.00; los ingresos regionales suman 50.00.' },
        { title: 'Comparar la maqueta de reporte con SQL', body: 'Inspecciona exactamente las mismas cuatro filas en la maqueta y compara los resultados precalculados de Todas, North y South con tu SQL. Seleccionar una zona no aplica un filtro real ni consulta un warehouse: solo identifica una región etiquetada de esta ilustración propia.', check: 'Todas = 4 / 50.00 / 12.50; North = 2 / 30.00 / 15.00; South = 2 / 20.00 / 10.00. No se pueden deducir fechas ni cantidades de clientes de estas filas.', screen: { id: 's13-report', highlight: ['rows', 'all', 'north', 'south'] } },
        { title: 'Opcional: ejecutar una consulta autocontenida en un borrador existente', body: 'Solo si ya tienes un borrador de dashboard AI/BI autorizado y un warehouse disponible, usa Data → Add SQL dataset → Run con esta consulta. No supongas que la vista temporal del notebook cruza sesiones. Opcionalmente configura barras de ingresos por región en ese borrador; omite el paso si no está disponible. No necesitas Publish.', code: { language: 'sql', code: `SELECT region, SUM(CAST(amount AS DECIMAL(10,2))) AS revenue,
       COUNT(*) AS orders
FROM VALUES (1, 'North', 10), (2, 'North', 20),
            (3, 'South', 15), (4, 'South', 5)
AS v(order_id, region, amount)
GROUP BY region ORDER BY region;` }, check: 'Si ejecutas: North 30.00 / 2, South 20.00 / 2; usa region como categoría y revenue como valor. Si no, registra omitido. No publiques ni crees datos fuente persistentes.', screen: { id: 's13-data', highlight: ['data', 'addSql', 'run'] } },
        { title: 'Estudiar opciones de Desktop sin conectar', body: 'En la maqueta empresarial ilustrativa, sigue Get data → Databricks → Connect e identifica Server Hostname, HTTP Path, Import y DirectQuery. No introduzcas datos reales ni credenciales. La conectividad con Free Edition sigue NO VERIFICADA; este paso no instala Power BI ni intenta autenticar.', check: 'Explicas actualización de instantánea en Import frente a consultas al origen con matices de caché/actualidad en DirectQuery, sin afirmar que completaste una conexión.', screen: { id: 's13-powerbi', highlight: ['getData', 'databricks', 'connect', 'hostname', 'httpPath', 'import', 'directQuery'] } },
        { title: 'Revisar permisos; no publicar', body: 'Inspecciona Publish → Share with data permissions solo en la maqueta. Explica la diferencia entre usar permisos de datos del publicador y acceso propio del lector. Un filtro visual North no es una política de autorización. Conserva intacta toda configuración real de permisos y distribución.', check: 'No se publicó ningún dashboard, no se cambiaron permisos ni se proporcionaron credenciales. Finaliza el ejercicio; la vista temporal pertenece a la sesión, sin limpieza destructiva necesaria.', screen: { id: 's13-share', highlight: ['publish', 'shareData'] } },
      ],
      wrapUp: 'Cuatro pedidos producen ingresos 50.00 y promedio 12.50; North aporta 30.00 desde dos pedidos y South 20.00 desde dos. Reconciliaste un filtro sin inventar fechas ni clientes, separaste el grano del dataset de la visualización y distinguiste controles ilustrativos de conexión/distribución de operaciones externas.',
      sources: [gold, tutorial, desktop, service, free, sql],
    },
    certification: {
      intro: 'Práctica original, no preguntas reales de examen. Data Engineer Associate fundamenta la entrega de datos gold para BI. PL-300 es enriquecimiento opcional de modelado semántico y visualización, no una credencial prometida por el brochure. Revisa las explicaciones con las fuentes anteriores.',
      exams: [
        { name: 'Databricks Certified Data Engineer Associate', url: guide, domains: ['Data Transformation and Modeling'] },
        { name: 'Enriquecimiento opcional: Microsoft PL-300', url: pl300.url, domains: ['Model the data', 'Visualize and analyze the data'] },
      ],
      questions: [
        { domain: 'Data Transformation and Modeling', question: '¿Qué grano permite que COUNT(*) cuente pedidos en este laboratorio?', options: ['Una fila por línea de pedido', 'Una fila por pedido', 'Una fila por región', 'Una fila por dashboard'], answer: 1, explanation: 'Hay cuatro filas de pedidos únicos. Un dataset de líneas podría multiplicar filas e inflar COUNT(*).' },
        { domain: 'Data Transformation and Modeling', question: '¿Cuáles son ingresos, pedidos y promedio de las cuatro filas?', options: ['50.00 / 2 / 25.00', '30.00 / 4 / 7.50', '50.00 / 4 / 12.50', '20.00 / 2 / 10.00'], answer: 2, explanation: '10 + 20 + 15 + 5 = 50.00; cuatro pedidos dan un valor promedio de pedido de 50 / 4 = 12.50.' },
        { domain: 'Visualize and analyze the data', question: '¿Qué debe devolver el filtro North?', options: ['2 pedidos e ingresos 30.00', '4 pedidos e ingresos 50.00', '2 pedidos e ingresos 20.00', '1 pedido e ingresos 10.00'], answer: 0, explanation: 'Solo los pedidos 1 y 2 son North: dos filas, ingresos 10 + 20 = 30.00 y promedio 15.00.' },
        { domain: 'Model the data', question: 'El origen cambia tras actualizar Import. ¿Qué contiene normalmente el modelo importado hasta otra actualización?', options: ['Cada cambio del origen automáticamente', 'Ninguna fila', 'Solo filas North', 'La instantánea importada'], answer: 3, explanation: 'Import almacena una instantánea en el modelo. Su ciclo de actualización se configura y verifica por separado.' },
        { domain: 'Model the data', question: '¿Cuál es una afirmación prudente sobre DirectQuery?', options: ['Siempre muestra cada cambio al instante', 'Consulta el origen, pero importan caché, permisos y latencia', 'Elimina el costo de consultas del warehouse', 'Concede SELECT automáticamente'], answer: 1, explanation: 'DirectQuery consulta el origen, no garantiza actualidad incondicional; caché y acceso afectan los resultados.' },
        { domain: 'Data Transformation and Modeling', question: '¿Qué ejecuta SQL para el dataset del dashboard?', options: ['La paleta de colores', 'Un HTTP path por sí solo', 'Un SQL warehouse', 'Una licencia Power BI por sí sola'], answer: 2, explanation: 'El warehouse aporta cómputo SQL; un gráfico o identificador de conexión no es un motor de ejecución.' },
        { domain: 'Model the data', question: '¿Qué puede afirmar este laboratorio sobre conectar Power BI desde Free Edition?', options: ['No está verificado por las fuentes proporcionadas; no se requiere una conexión real', 'Está garantizado para todas las cuentas', 'Es imposible en absolutamente cualquier flujo', 'Hacer clic en la maqueta te autentica'], answer: 0, explanation: 'La documentación genérica del conector no verifica este flujo concreto de Free Edition ni justifica una prohibición absoluta.' },
        { domain: 'Model the data', question: '¿Cómo debes interpretar aquí los requisitos de Unity Catalog, capacidad y XMLA?', options: ['Como requisitos para ejecutar VALUES SQL', 'Como prerrequisitos universales de todo archivo Desktop', 'Como permisos concedidos por un filtro', 'Como requisitos de la integración documentada con el servicio'], answer: 3, explanation: 'La integración con el servicio tiene alcance propio. No transfieras sus prerrequisitos a todos los flujos de Desktop.' },
        { domain: 'Visualize and analyze the data', question: 'Un dashboard publicado usa permisos de datos del publicador. ¿Qué debes revisar?', options: ['Solo el título del gráfico', 'La audiencia y el acceso efectivo, no solo los permisos de tablas del lector', 'Solo el color del filtro', 'Nada: los filtros aplican seguridad'], answer: 1, explanation: 'Compartir permisos de datos cambia qué acceso se usa. Un filtro visual no sustituye la autorización.' },
        { domain: 'Data Transformation and Modeling', question: '¿Por qué la consulta opcional del dashboard repite VALUES?', options: ['Para persistir otra tabla gold', 'Para eludir Unity Catalog', 'No se garantiza que otra sesión SQL vea la vista temporal del notebook', 'Para aprovisionar capacidad Power BI'], answer: 2, explanation: 'Las vistas temporales tienen alcance de sesión. Un dataset sintético autocontenido evita suponer acceso entre sesiones.' },
        { type: 'hotspot', domain: 'Visualize and analyze the data', screen: 's13-new', answer: 'dashboard', question: 'En el menú New simplificado, ¿qué opción inicia la ruta documentada del dashboard?', explanation: 'New → Dashboard es la entrada documentada. La maqueta identifica una ruta sin crear ningún recurso.' },
        { type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's13-data', answer: 'run', question: 'Después de Data → Add SQL dataset, ¿qué control ejecuta SQL en un borrador real autorizado?', explanation: 'Run ejecuta la consulta del dataset en el flujo documentado. Aquí la maqueta no ejecuta SQL.' },
        { type: 'hotspot', domain: 'Model the data', screen: 's13-powerbi', answer: 'httpPath', question: '¿Qué campo complementa Server Hostname en este diálogo ilustrativo de Desktop?', explanation: 'HTTP Path complementa Server Hostname. No introduzcas datos reales: aquí la conectividad Free Edition no está verificada.' },
        { type: 'hotspot', domain: 'Visualize and analyze the data', screen: 's13-share', answer: 'shareData', question: '¿Qué control de publicación exige evaluar acceso del publicador frente al lector?', explanation: 'Share with data permissions cambia la decisión de acceso. Inspecciona solo la ilustración; no se requiere publicar.' },
      ],
    },
  };
})(globalThis);
