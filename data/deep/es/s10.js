// Contenido original basado en fuentes oficiales aportadas por el investigador.
(function (root) {
  const D = root.DataLab = root.DataLab || {};
  D.deep = D.deep || {};
  D.deep.es = D.deep.es || {};
  const BASE = 'https://docs.databricks.com/aws/en/';
  const source = (label, path) => ({ label, url: BASE + path });
  const uc = 'data-governance/unity-catalog/';
  const sources = [
    source('Modelo de objetos de Unity Catalog', uc),
    source('Managed frente a external', uc + 'managed-versus-external'),
    source('Credenciales y ubicaciones externas', 'connect/unity-catalog/cloud-storage/'),
    source('Volúmenes', 'volumes/'),
    source('Privilegios de volúmenes', 'volumes/privileges'),
    source('Herencia de permisos', uc + 'access-control/permissions-concepts'),
    source('Referencia de privilegios', uc + 'access-control/privileges-reference'),
    source('Administrar privilegios en Catalog', uc + 'manage-privileges/'),
    source('Linaje de datos', uc + 'data-lineage/'),
    source('Límites de Free Edition', 'getting-started/free-edition-limitations'),
  ];
  D.deep.es.s10 = {
    deepDive: [
      { title: 'Los nombres ubican objetos; el metastore contiene catálogos', body: [
        'Unity Catalog organiza tablas, vistas, volúmenes y otros objetos de esquema bajo catalog.schema.object. El metastore contiene los catálogos; no es un cuarto componente del nombre de tabla. Los nombres completos hacen explícito el destino, sin depender del espacio de nombres actual del notebook.',
        'Las storage credentials y external locations se registran directamente bajo el metastore, no dentro de un esquema. Separa el espacio de nombres lógico del modelo de acceso al almacenamiento: un catálogo contiene esquemas, mientras que una credencial describe autenticación y no un conjunto de datos de negocio.',
      ], source: sources[0] },
      { title: 'Managed y external están gobernadas', body: [
        'En las tablas managed, Unity Catalog administra el almacenamiento y el ciclo de vida de los datos. En las external gobierna los accesos registrados y metadatos, pero el usuario controla los archivos y su ciclo de vida. External no significa sin gobierno, y managed no significa que los datos vivan en la memoria del notebook.',
        'Eliminar una tabla external no elimina sus archivos. La eliminación managed sigue el ciclo documentado de recuperación y borrado, sin garantizar una eliminación física inmediata. No uses DROP como procedimiento de borrado seguro ni supongas que toda tabla managed eliminada deja de ser recuperable al instante.',
      ], source: sources[1] },
      { title: 'Autenticación y ruta autorizada son objetos diferentes', body: [
        'Una storage credential representa la autenticación al almacenamiento de nube. Una external location asocia una ruta con esa credencial y define un límite de almacenamiento gobernado. Conocer una URI abfss o de otra nube no proporciona autorización de nube ni privilegios de Unity Catalog.',
        'Las external locations también pueden respaldar almacenamiento managed; su nombre no las restringe a tablas external. Mantén las identidades de nube fuera de los notebooks educativos. El laboratorio principal usa tablas y un volumen managed: no necesita credenciales, una cuenta de almacenamiento personal ni configuración de almacenamiento propia del workspace.',
      ], source: sources[2] },
      { title: 'Las tablas exponen filas; los volúmenes exponen archivos', body: [
        'Usa SELECT para leer tablas relacionales y READ VOLUME para leer archivos de un volumen. WRITE VOLUME autoriza escribir archivos; SELECT sobre una tabla no autoriza escribir un archivo de texto vecino. Ambas rutas requieren también los privilegios USE CATALOG y USE SCHEMA correspondientes.',
        'La ruta /Volumes/catalog/schema/volume identifica archivos gobernados, no una tabla SQL. Un volumen managed sirve para este pequeño ejercicio de texto. Crearlo requiere CREATE VOLUME sobre el esquema además de acceso a los contenedores padres; la propiedad o los privilegios heredados existentes pueden proporcionar acceso.',
      ], source: sources[4] },
      { title: 'Heredar privilegios no es heredar propiedad', body: [
        'Los privilegios elegibles otorgados sobre catálogos y esquemas se heredan a sus objetos hijos, incluidos los futuros. Esto hace potentes los permisos amplios sobre padres: SELECT sobre un esquema puede exponer más de una tabla. La propiedad no se hereda: ser propietario del catálogo no convierte al principal en propietario de cada tabla hija.',
        'El acceso efectivo puede proceder de permisos directos, herencia, membresía de grupos o capacidades del propietario. Revocar un SELECT directo no demuestra que el acceso desapareció. Por ello, que el creador se revoque un permiso no es una prueba válida de denegación, y este laboratorio no lo intenta.',
      ], source: sources[5] },
      { title: 'Construye la cadena mínima de lectura', body: [
        'Un lector ordinario que no es propietario necesita USE CATALOG sobre el catálogo, USE SCHEMA sobre el esquema y SELECT sobre la tabla. Los privilegios USE permiten utilizar la ruta de contenedores; por sí solos no dan acceso a los datos de la tabla. MODIFY corresponde a modificar datos y no a reportes de solo lectura.',
        'Prefiere un grupo de cuenta autorizado frente a permisos individuales improvisados. Diseña la cadena de tres privilegios antes de cambiar algo, revisa el acceso heredado y solicita su aplicación a un administrador autorizado cuando corresponda. El laboratorio solo inspecciona permisos: no inventa grupos, no otorga acceso a todos ni transfiere propiedad.',
      ], source: sources[6] },
      { title: 'La interfaz Permissions representa cambios reales de seguridad', body: [
        'La ruta documentada es Catalog, seleccionar un objeto, Permissions, Grant, elegir el principal y los privilegios y finalmente OK. La última acción aplica un cambio; no es una vista previa inocua. Las ilustraciones originales simplificadas separan localizar el control de otorgar acceso realmente.',
        'Inspecciona los objetos dedicados del laboratorio sin alterar permisos reales. Si tu rol no puede inspeccionar todas las entradas, registra ese límite de visibilidad en lugar de elevar privilegios. Un permiso ausente es un resultado de autorización para consultar al propietario, no un motivo para usar claves de nube ni ampliar permisos del catálogo.',
      ], source: sources[7] },
      { title: 'El linaje ayuda a analizar impacto; no prueba ausencia absoluta', body: [
        'Unity Catalog captura linaje para operaciones SQL y DataFrame compatibles. El CTAS del laboratorio expresa una dependencia explícita de orders a region_totals, de modo que un cambio aguas abajo puede rastrearse hasta su origen. El linaje describe dependencias; una consulta de agregación verifica los valores realmente producidos.',
        'Abre el objeto de salida, selecciona Lineage y See Lineage Graph. La captura puede tardar y el grafo se filtra por permisos; un nodo ausente no demuestra que no exista dependencia. Conserva el SQL del CTAS y los totales exactos como evidencia determinista aunque el grafo todavía no sea visible en tu workspace.',
      ], source: sources[8] },
      { title: 'Free Edition es un entorno de aprendizaje delimitado', body: [
        'Free Edition utiliza cómputo serverless y no ofrece consola de cuenta ni configuración personalizada de almacenamiento del workspace. Practica con los objetos de Unity Catalog disponibles dentro de tu catálogo escribible, sin convertir la administración de cuenta ni el aprovisionamiento de nube en requisitos de esta sesión.',
        'Estos límites no justifican afirmar que todas las external locations están universalmente prohibidas. El diseño Azure opcional requiere suscripción, Access Connector, roles de almacenamiento y privilegios de Unity Catalog en un workspace adecuado. Está separado del laboratorio ejecutable de Free Edition y no exige aprovisionar recursos reales aquí.',
      ], source: sources[9] },
    ],
    diagram: {
      title: 'Objetos lógicos y acceso al almacenamiento son ramas distintas',
      caption: 'Modelo conceptual, no una distribución física obligatoria. Los objetos de esquema tienen nombres de tres partes. Las credenciales y ubicaciones externas dependen directamente del metastore; una external location también puede respaldar almacenamiento managed.',
      layers: [
        { label: 'Metastore', nodes: ['Catálogos', 'Storage credentials', 'External locations'] },
        { label: 'Espacio lógico', nodes: ['Catálogo → esquema → orders', 'Catálogo → esquema → region_totals', 'Catálogo → esquema → volumen lab_files'] },
        { label: 'Decisiones de acceso', nodes: ['USE CATALOG + USE SCHEMA + SELECT', 'USE CATALOG + USE SCHEMA + READ/WRITE VOLUME'] },
        { label: 'Almacenamiento y evidencia', nodes: ['Ciclo managed o archivos external controlados por el usuario', 'Linaje orders → CTAS → region_totals', 'Credencial + ruta → external location'] },
      ],
    },
    comparison: {
      title: 'Elige el objeto según su responsabilidad',
      headers: ['Objeto', 'Responsabilidad', 'Distinción de acceso', 'Ciclo de vida / ámbito'],
      rows: [
        ['Tabla managed', 'Filas relacionales tipadas', 'SELECT / MODIFY más USE en padres', 'Unity Catalog administra el ciclo del almacenamiento'],
        ['Tabla external', 'Metadatos gobernados sobre archivos externos', 'SELECT / MODIFY más USE en padres', 'El usuario controla archivos; DROP los conserva'],
        ['Volumen managed', 'Acceso directo a archivos gobernados', 'READ VOLUME / WRITE VOLUME más USE en padres', 'Objeto de esquema; ciclo de archivos administrado'],
        ['Storage credential', 'Autenticación de nube', 'No es SELECT sobre una tabla', 'Objeto a nivel de metastore'],
        ['External location', 'Ruta de nube vinculada a una credencial', 'Privilegios de ruta; no sustituye SELECT sobre tablas', 'Nivel metastore; puede respaldar almacenamiento managed'],
      ],
      sources: sources.slice(0, 7),
    },
    lab: {
      title: 'Un pequeño conjunto gobernado en Free Edition',
      goal: 'Crear tablas managed y un volumen aislados, verificar agregados exactos, inspeccionar privilegios y localizar el linaje sin credenciales, cambios reales de permisos ni limpieza destructiva.',
      minutes: 65,
      requirements: [
        'Free Edition con notebook serverless y catálogo escribible. Privilegios de creación: USE CATALOG, USE SCHEMA y CREATE TABLE / CREATE VOLUME en el esquema del laboratorio; CREATE SCHEMA sobre el catálogo para crear ese esquema.',
        'Usa solo los valores sintéticos indicados. Sustituye <catalog> por el resultado escribible de current_catalog() y SUFFIX por un sufijo alfanumérico nuevo, por ejemplo una marca temporal. Mantén el mismo sufijo en todos los pasos.',
        'Ejecuta las celdas de creación una vez y en orden. CREATE omite intencionalmente IF NOT EXISTS y OR REPLACE: cualquier colisión detiene el ejercicio. Nunca continúes sobre un esquema existente; elige otro sufijo y reinicia.',
      ],
      steps: [
        { title: 'Descubre el contexto sin modificarlo', body: 'En un notebook serverless ejecuta la consulta de solo lectura. Anota el catálogo para sustituirlo e inspecciona tu identidad en privado; no publiques esa salida. Si el catálogo actual no es escribible, solicita uno autorizado para aprendizaje en lugar de cambiar permisos compartidos.', code: { language: 'sql', code: 'SELECT current_catalog() AS catalog, current_user() AS principal;' }, check: 'Conoces el catálogo autorizado y entiendes que la identidad actual creará y será propietaria de los nuevos objetos.' },
        { title: 'Reserva un esquema nuevo', body: 'Sustituye el catálogo y un SUFFIX nuevo antes de ejecutar. No reutilices un esquema de otra ejecución. Si CREATE falla, detente antes de cualquier escritura posterior; un error de permisos requiere un propietario autorizado y una colisión de nombres requiere otro sufijo.', code: { language: 'sql', code: 'CREATE SCHEMA <catalog>.s10_lab_SUFFIX;\nUSE CATALOG <catalog>;\nUSE SCHEMA s10_lab_SUFFIX;' }, check: 'Queda seleccionado un esquema dedicado recién creado; no se reemplazó ningún esquema ni tabla existente.' },
        { title: 'Crea tres filas sintéticas managed', body: 'Crea una tabla Delta managed sin LOCATION e inserta una sola vez las tres filas conocidas. La aritmética decimal evita ambigüedad de coma flotante. Si falla la creación, no ejecutes INSERT contra ningún objeto preexistente.', code: { language: 'sql', code: "CREATE TABLE orders (order_id INT, region STRING, amount DECIMAL(12,2)) USING DELTA;\nINSERT INTO orders VALUES (1, 'north', 10.00), (2, 'south', 20.00), (3, 'north', 5.50);\nSELECT count(*) AS orders, sum(amount) AS total FROM orders;" }, check: 'Exactamente 3 pedidos y total 35.50. No repitas INSERT: agregaría duplicados.' },
        { title: 'Materializa un agregado trazable', body: 'CTAS lee las tres filas de origen y crea una segunda tabla managed. Usa los nombres completos explícitos para que la dependencia sea inequívoca. No reemplaces un agregado anterior: detente si hay colisión.', code: { language: 'sql', code: 'CREATE TABLE <catalog>.s10_lab_SUFFIX.region_totals USING DELTA AS\nSELECT region, count(*) AS orders, sum(amount) AS total\nFROM <catalog>.s10_lab_SUFFIX.orders GROUP BY region;\nSELECT * FROM <catalog>.s10_lab_SUFFIX.region_totals ORDER BY region;' }, check: 'north tiene 2 pedidos y 15.50; south tiene 1 pedido y 20.00. Las dos filas de salida suman 35.50.' },
        { title: 'Inspecciona metadatos en SQL y Catalog', body: 'Inspecciona únicamente tus tablas nuevas. Abre Catalog y busca tu catálogo, el esquema nuevo y orders. DESCRIBE proporciona metadatos, no una razón para manipular directamente los archivos físicos.', code: { language: 'sql', code: 'DESCRIBE TABLE EXTENDED <catalog>.s10_lab_SUFFIX.orders;\nSHOW TABLES IN <catalog>.s10_lab_SUFFIX;' }, check: 'orders es managed y region_totals existe en el esquema dedicado.', screen: { id: 's10-object', highlight: ['s10-catalog', 's10-orders', 's10-overview'] } },
        { title: 'Inspecciona las fuentes de acceso efectivo', body: 'En orders abre Permissions. Lee el propietario y los permisos disponibles; distingue privilegios directos de acceso heredado. Estas sentencias de solo lectura inspeccionan también los padres. No revoques tus derechos para simular un lector: la propiedad y los grupos pueden conservar acceso.', code: { language: 'sql', code: 'SHOW GRANTS ON CATALOG <catalog>;\nSHOW GRANTS ON SCHEMA <catalog>.s10_lab_SUFFIX;\nSHOW GRANTS ON TABLE <catalog>.s10_lab_SUFFIX.orders;' }, check: 'Puedes explicar por qué SELECT solo no alcanza para un lector ordinario y por qué revocar un permiso directo no demuestra denegación.', screen: { id: 's10-permissions', highlight: ['s10-permissions', 's10-owner', 's10-privileges'] } },
        { title: 'Ensaya un permiso de lectura sin aplicarlo', body: 'Usa solo esta ilustración simplificada para localizar Grant, SELECT y OK. En un flujo real autorizado el grupo necesitaría USE CATALOG, USE SCHEMA y SELECT sobre orders; leer archivos requiere READ VOLUME. No selecciones un principal real, no confirmes OK, no transfieras propiedad ni ejecutes GRANT en este ejercicio.', check: 'Puedes describir Catalog → objeto → Permissions → Grant → OK, mientras todos los permisos reales permanecen intactos.', screen: { id: 's10-grant', highlight: ['s10-principals', 's10-select', 's10-ok'] } },
        { title: 'Inspecciona el linaje del CTAS', body: 'Selecciona region_totals en Catalog, abre Lineage y pulsa See Lineage Graph. Busca orders aguas arriba de region_totals. Si la captura tarda, vuelve más tarde; si los permisos ocultan detalles, registra la limitación sin ampliar acceso. Los totales SQL siguen siendo verificables por separado.', check: 'La arista esperada es orders → region_totals; un grafo demorado o filtrado por permisos se documenta y no se interpreta como datos ausentes.', screen: { id: 's10-lineage', highlight: ['s10-lineage', 's10-graph', 's10-source', 's10-output'] } },
        { title: 'Crea el contenedor de archivos managed', body: 'Vuelve al mismo notebook y crea un volumen managed sin ruta externa. Crearlo requiere CREATE VOLUME sobre el esquema; escribir su contenido usa WRITE VOLUME junto con USE en los padres. Detente ante cualquier error en lugar de tomar prestado un volumen compartido.', code: { language: 'sql', code: 'CREATE VOLUME <catalog>.s10_lab_SUFFIX.lab_files;' }, check: 'lab_files es nuevo y managed; su ruta gobernada es /Volumes/<catalog>/s10_lab_SUFFIX/lab_files.' },
        { title: 'Escribe y lee un archivo inocuo', body: 'Cambia esta celda a Python y sustituye el mismo catálogo y sufijo. overwrite=False rechaza reemplazar un archivo existente. El texto UTF-8 fijo es sintético, no contiene identidad ni credenciales y se relee exactamente. No reintentes con sobrescritura si hay colisión.', code: { language: 'python', code: 'path = "/Volumes/<catalog>/s10_lab_SUFFIX/lab_files/hello.txt"\ntext = "s10 synthetic governance lab"\ndbutils.fs.put(path, text, overwrite=False)\nassert dbutils.fs.head(path, 1024) == text\nprint("s10 file verified")' }, check: 'La celda imprime s10 file verified tras una comparación exacta. READ VOLUME y WRITE VOLUME son distintos de SELECT sobre tablas.' },
        { title: 'Concilia resultados y conserva el espacio dedicado', body: 'Ejecuta ahora solo verificaciones de lectura. Conservar estos objetos pequeños evita instrucciones de limpieza inseguras. No elimines un catálogo compartido, no cambies retención, no transfieras propiedad ni uses CASCADE. No necesitas aprovisionar Azure; opcionalmente dibuja credencial + ruta → external location, indicando suscripción, Access Connector y privilegios como requisitos.', code: { language: 'sql', code: 'SELECT count(*) AS regions, sum(orders) AS orders, sum(total) AS total\nFROM <catalog>.s10_lab_SUFFIX.region_totals;\nSELECT count(*) AS orders, sum(amount) AS total\nFROM <catalog>.s10_lab_SUFFIX.orders;' }, check: 'Agregado: 2 regiones, 3 pedidos, 35.50. Origen: 3 pedidos, 35.50. Solo se crearon un esquema nuevo, dos tablas, un volumen y un archivo de texto inocuo.' },
      ],
      wrapUp: 'Separaste espacio de nombres, autenticación al almacenamiento, acceso relacional y acceso a archivos. El laboratorio conserva 3 pedidos por 35.50 y un agregado de dos filas: north 15.50 y south 20.00. Los permisos se inspeccionaron, no se cambiaron; la visibilidad del linaje no se usa como oráculo aritmético. Conserva el nombre exacto del esquema dedicado para cualquier limpieza posterior autorizada por su propietario.',
      sources,
    },
    certification: {
      intro: 'Práctica original alineada con el temario vigente de Data Engineer Associate del 4 de mayo de 2026, específicamente Governance and Security. No son preguntas reales del examen. Las interfaces son ilustraciones originales simplificadas, no capturas.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf', domains: ['Governance and Security'] }],
      questions: [
        { domain: 'Governance and Security', question: '¿Cuál es un nombre completo de tabla?', options: ['metastore.catalog.schema.table', 'catalog.schema.table', '/Volumes/catalog/schema', 'workspace.notebook'], answer: 1, explanation: 'El nombre de tabla tiene tres componentes; el metastore contiene catálogos, pero no integra ese nombre.' },
        { domain: 'Governance and Security', question: '¿Dónde se registran storage credentials y external locations?', options: ['Dentro de cada tabla', 'Dentro de un notebook', 'Directamente bajo el metastore', 'Solo dentro de un volumen'], answer: 2, explanation: 'Estos objetos a nivel de metastore forman una rama de acceso al almacenamiento; no son hijos de un esquema.' },
        { domain: 'Governance and Security', question: 'Un lector ordinario no propietario tiene SELECT pero no puede usar los padres. ¿Qué falta?', options: ['USE CATALOG y USE SCHEMA', 'MODIFY sobre todas las tablas', 'Propiedad del metastore', 'WRITE VOLUME'], answer: 0, explanation: 'El lector ordinario necesita USE en los contenedores padres además del privilegio sobre los datos de la tabla.' },
        { domain: 'Governance and Security', question: 'Se elimina una tabla external. ¿Qué pasa con sus archivos?', options: ['Se borran inmediatamente', 'Se mueven a un notebook', 'Se convierten en managed automáticamente', 'Permanecen bajo control del usuario en almacenamiento'], answer: 3, explanation: 'Eliminar los metadatos externos no borra los archivos subyacentes; el usuario controla ese ciclo de vida.' },
        { domain: 'Governance and Security', question: '¿Qué afirmación sobre eliminar tablas managed es correcta?', options: ['Garantiza borrado seguro inmediato', 'Recuperación y eliminación siguen el ciclo documentado', 'Nunca afecta al ciclo de los datos', 'Transfiere la propiedad a todos los lectores'], answer: 1, explanation: 'El ciclo managed incluye recuperación y eliminación; DROP no garantiza un borrado seguro instantáneo.' },
        { domain: 'Governance and Security', question: 'Un lector debe abrir hello.txt en un volumen. ¿Qué privilegio de datos corresponde?', options: ['SELECT sobre una tabla sin relación', 'MODIFY sobre orders', 'READ VOLUME con USE en los padres', 'Solo CREATE SCHEMA'], answer: 2, explanation: 'El acceso a archivos usa privilegios de volumen; SELECT sobre una tabla no autoriza leer un archivo separado.' },
        { domain: 'Governance and Security', question: 'Un grupo recibe SELECT elegible sobre un esquema. ¿Qué debes considerar?', options: ['Las tablas hijas actuales y futuras pueden heredarlo', 'Solo el propietario del esquema puede leer', 'Todas las tablas cambian de propietario', 'Solo puede recibirlo una tabla existente'], answer: 0, explanation: 'Los privilegios elegibles de catálogo y esquema se heredan hacia abajo; la propiedad no se hereda.' },
        { domain: 'Governance and Security', question: 'El creador se revoca SELECT directo y todavía lee la tabla. ¿Por qué?', options: ['REVOKE siempre falla en silencio', 'SELECT no tiene relación con acceso', 'Los archivos son públicos por defecto', 'Puede conservar propiedad o acceso heredado o de grupos'], answer: 3, explanation: 'Un permiso directo es solo una fuente de acceso efectivo; autorrevocarlo no es una prueba fiable de denegación.' },
        { domain: 'Governance and Security', question: 'Falta un nodo de linaje justo después de CTAS. ¿Qué conclusión es adecuada?', options: ['CTAS no produjo filas', 'La captura o el filtrado por permisos pueden explicarlo', 'Hay que otorgar todos los privilegios ampliamente', 'Se eliminó la tabla de origen'], answer: 1, explanation: 'Captura y visibilidad tienen límites; inspecciona resultados por separado y vuelve a consultar el grafo.' },
        { domain: 'Governance and Security', question: '¿Una external location puede respaldar almacenamiento managed?', options: ['No, su nombre lo prohíbe', 'Solo si se otorga SELECT a todos', 'Sí; vincula una ruta gobernada con una credencial', 'No, es una tabla SQL'], answer: 2, explanation: 'Una external location puede respaldar almacenamiento managed además de datos externos; es un objeto de ruta.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's10-object', answer: 's10-permissions', question: 'En el objeto orders seleccionado, ¿dónde inspeccionas permisos?', explanation: 'Permissions es la pestaña documentada para inspeccionar y administrar privilegios; abrirla no cambia permisos.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's10-permissions', answer: 's10-grant', question: 'En un flujo autorizado, ¿qué control inicia la asignación de privilegios?', explanation: 'Grant abre el flujo de asignación; el laboratorio solo identifica ese control y no aplica cambios reales.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's10-grant', answer: 's10-select', question: 'En esta ilustración conceptual, ¿qué privilegio permite leer tablas?', explanation: 'SELECT permite leer datos de tabla, con USE CATALOG y USE SCHEMA también requeridos para el lector ordinario.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's10-lineage', answer: 's10-graph', question: 'La pestaña Lineage está abierta. ¿Dónde amplías el grafo de dependencias?', explanation: 'See Lineage Graph abre el grafo de linaje; los detalles visibles dependen de permisos y operaciones capturadas.' },
      ],
    },
  };
})(globalThis);
