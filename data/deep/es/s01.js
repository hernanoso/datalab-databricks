// Deep content for session 1 (neutral Spanish). Researched from official sources on 2026-10-28.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};

  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const ARCH = `${MS}/getting-started/high-level-architecture`;
  const DOCS = 'https://docs.databricks.com/aws/en';

  DataLab.deep.es.s01 = {
    deepDive: [
      {
        title: 'Responsabilidad compartida: qué te toca en cada modelo',
        body: [
          'En IaaS el proveedor se encarga del hardware, la red física y la virtualización, pero tú administras el sistema operativo, las actualizaciones y las aplicaciones de cada máquina virtual. En PaaS el proveedor también gestiona el sistema operativo y la plataforma, y tú te concentras en tu código y tus datos. En SaaS consumes una aplicación terminada.',
          'Hay responsabilidades que nunca se delegan, sin importar el modelo: tus datos, tus identidades y cuentas, la configuración y quién tiene acceso a qué. Por eso, aunque Databricks administre Spark por ti, definir permisos y proteger datos sigue siendo trabajo del equipo de datos.',
        ],
        source: { label: 'Responsabilidad compartida en la nube (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility' },
      },
      {
        title: 'Tenant, suscripción y grupo de recursos',
        body: [
          'Un tenant de Microsoft Entra es el directorio de identidades de tu organización: usuarios, grupos y aplicaciones. Cada suscripción de Azure confía en un solo directorio, mientras que un mismo tenant puede tener muchas suscripciones. La suscripción es la unidad de facturación y de límites de servicio.',
          'Dentro de una suscripción, los grupos de recursos agrupan recursos que comparten ciclo de vida, por ejemplo todo lo de un proyecto. Un detalle que suele confundir: la región de un grupo de recursos indica dónde se guardan sus metadatos, y los recursos que contiene pueden estar en regiones distintas.',
        ],
        source: { label: 'Azure Resource Manager (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview' },
      },
      {
        title: 'ADLS Gen2 no es otro tipo de cuenta',
        body: [
          'Azure Data Lake Storage Gen2 es un conjunto de capacidades analíticas construidas sobre Azure Blob Storage. Se activa con el espacio de nombres jerárquico de una cuenta de almacenamiento, que agrega directorios reales y control de acceso más fino, en lugar de ser un servicio separado.',
          'El espacio de nombres jerárquico importa para analítica: renombrar o borrar un directorio es una operación sobre el directorio, no sobre millones de objetos sueltos. Por eso es el almacenamiento habitual de los lakehouses en Azure, accedido con rutas abfss://.',
        ],
        source: { label: 'Introducción a Data Lake Storage (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction' },
      },
      {
        title: 'Qué hace el control plane',
        body: [
          'El control plane incluye los servicios de backend que Databricks administra y la aplicación web que usas en el navegador. Vive en la cuenta de Databricks, no en tu suscripción de Azure. Desde allí se coordinan tareas como programar jobs, administrar la cuenta y lanzar el cómputo.',
          'Conviene no exagerar la regla de que «los datos nunca pasan por el control plane». La arquitectura distingue los datos de negocio, que se procesan en el compute plane, de los recursos del workspace y los datos del sistema, como resultados de celdas o registros, que se guardan en el almacenamiento del workspace.',
        ],
        source: { label: 'Arquitectura de Azure Databricks', url: ARCH },
      },
      {
        title: 'Dos compute planes: clásico y serverless',
        body: [
          'En el compute plane clásico, los recursos de cómputo corren en tu suscripción de Azure, dentro de la red virtual del workspace. Eso te da control sobre la red y la configuración, pero también te hace responsable de esas máquinas.',
          'En el compute plane serverless, el cómputo corre en la cuenta de Databricks, en la misma región que tu workspace, aislado por límites de red propios de cada workspace. Databricks lo aprovisiona y lo escala. Un workspace clásico también puede usar serverless: el tipo de workspace no decide por sí solo el tipo de cómputo.',
        ],
        source: { label: 'Arquitectura de Azure Databricks', url: ARCH },
      },
      {
        title: 'Dónde se guarda cada cosa: el almacenamiento del workspace',
        body: [
          'El almacenamiento del workspace contiene dos tipos de contenido. Los recursos del sistema de archivos del workspace son notebooks, consultas SQL y archivos de configuración. Los datos del sistema del workspace son, por ejemplo, resultados de celdas, revisiones y registros.',
          'En un workspace clásico, ese almacenamiento es una cuenta de Azure dentro de un grupo de recursos administrado que crea Azure Databricks; allí también puede vivir el DBFS heredado. El DBFS raíz y los montajes están obsoletos: hoy se usan Unity Catalog y sus volúmenes. En un workspace serverless, el almacenamiento por defecto lo administra Databricks y puede contener activos de Unity Catalog, aunque también puedes usar tu propio almacenamiento.',
        ],
        source: { label: 'Arquitectura de Azure Databricks, almacenamiento del workspace', url: ARCH },
      },
      {
        title: 'Unity Catalog de un vistazo',
        body: [
          'La cuenta de Databricks agrupa workspaces y metastores. Un metastore es regional y puede asignarse a varios workspaces de esa región, de modo que comparten el mismo catálogo de datos y los mismos permisos.',
          'Todo objeto de datos se nombra con tres niveles: catalogo.esquema.objeto. Ese objeto puede ser una tabla, una vista, un volumen, una función o un modelo. Escribir el nombre completo evita leer o escribir en el lugar equivocado, sobre todo cuando hay catálogos por entorno.',
        ],
        source: { label: 'Arquitectura de Azure Databricks, Unity Catalog', url: ARCH },
      },
      {
        title: 'Recorrido por la interfaz',
        body: [
          'La barra lateral organiza el trabajo: Workspace para notebooks y carpetas, Catalog para explorar datos y permisos, Jobs & Pipelines para orquestación, Compute para recursos de cómputo y SQL Editor para consultas sobre un SQL warehouse. En la sección de IA aparece Playground, para probar modelos.',
          'La página de inicio muestra accesos rápidos y Ask Genie, que permite hacer preguntas en lenguaje natural. El botón New es el punto de partida para crear notebooks, consultas, jobs o subir datos.',
        ],
        source: { label: 'Navegar por el workspace', url: `${DOCS}/workspace/navigate-workspace` },
      },
      {
        title: 'Free Edition: qué es y qué no es',
        body: [
          'Databricks Free Edition crea un workspace con cómputo serverless y almacenamiento por defecto, sin desplegar recursos en una suscripción de Azure. Incluye datos de ejemplo en el catálogo samples, un SQL warehouse de tamaño 2X-Small y cuotas diarias de uso.',
          'No tiene consola de cuenta ni cómputo clásico, así que no reemplaza un workspace de Azure para practicar redes, grupos de recursos administrados o integraciones con otros servicios de Azure. Para esas partes del curso necesitarás una suscripción de Azure.',
        ],
        source: { label: 'Databricks Free Edition', url: `${DOCS}/getting-started/free-edition` },
      },
    ],
    diagram: {
      title: 'Arquitectura de Azure Databricks',
      caption: 'Vista conceptual basada en la arquitectura oficial. Los datos de negocio se procesan en el compute plane; el control plane coordina, pero no es el camino normal de los datos.',
      layers: [
        { label: 'Usuario', nodes: ['Navegador', 'CLI y API'] },
        { label: 'Control plane', nodes: ['Aplicación web', 'Servicios administrados', 'Administración de la cuenta'] },
        { label: 'Compute plane', nodes: ['Clásico: tu suscripción de Azure y su red virtual', 'Serverless: cuenta de Databricks, misma región'] },
        { label: 'Almacenamiento', nodes: ['Almacenamiento del workspace', 'Tablas y volúmenes de Unity Catalog', 'Tu almacenamiento en la nube'] },
      ],
    },
    comparison: {
      title: 'Cómputo clásico frente a serverless',
      headers: ['Aspecto', 'Clásico', 'Serverless'],
      rows: [
        ['Dónde corre', 'En tu suscripción de Azure', 'En la cuenta de Databricks, en la región del workspace'],
        ['Límite de red', 'La red virtual del workspace', 'Aislamiento de red por workspace administrado por Databricks'],
        ['Quién aprovisiona las máquinas', 'Se crean en tu suscripción según la configuración o la policy', 'Databricks las aprovisiona y escala'],
        ['Relación con el almacenamiento', 'Cómputo y almacenamiento separados', 'Cómputo y almacenamiento separados'],
        ['En Free Edition', 'No disponible', 'Es el único tipo de cómputo'],
      ],
      sources: [
        { label: 'Arquitectura de Azure Databricks', url: ARCH },
        { label: 'Límites de Free Edition', url: `${DOCS}/getting-started/free-edition-limitations` },
      ],
    },
    lab: {
      title: 'Tu workspace en Databricks Free Edition',
      goal: 'Crear tu workspace gratuito, ubicar sus herramientas, consultar datos de ejemplo, subir un archivo propio a un volumen y convertirlo en una tabla gobernada por Unity Catalog.',
      minutes: 60,
      requirements: [
        'Un correo electrónico para registrarte; no necesitas tarjeta ni suscripción de Azure.',
        'Un navegador actualizado.',
        'El paso 10 es opcional y requiere acceso a una suscripción de Azure.',
      ],
      steps: [
        {
          title: 'Crea tu cuenta de Free Edition',
          body: 'Entra a la página de registro de Databricks y elige la opción Free Edition. Al terminar se crea un workspace con cómputo serverless y almacenamiento por defecto: no se despliega nada en Azure.',
          check: 'Ves la página de inicio del workspace con la barra lateral a la izquierda.',
        },
        {
          title: 'Recorre la barra lateral',
          body: 'Abre una por una las secciones Workspace, Catalog, Jobs & Pipelines, Compute, SQL Editor y Playground. En la página de inicio busca Ask Genie. No configures nada todavía: el objetivo es saber dónde está cada herramienta.',
          check: 'Puedes explicar con una frase para qué sirve cada sección.',
          screen: { id: 'home', highlight: ['workspace', 'catalog', 'jobs', 'compute', 'sqlEditor', 'playground'] },
        },
        {
          title: 'Crea un notebook y conéctalo a serverless',
          body: 'Haz clic en New y luego en Notebook. Cambia el lenguaje a SQL y, en el selector de cómputo, elige Serverless. Ejecuta la celda para saber en qué catálogo y esquema estás trabajando.',
          code: { language: 'sql', code: 'SELECT current_catalog() AS catalogo,\n       current_schema()  AS esquema,\n       current_user()    AS usuario;' },
          check: 'Anotaste el nombre de tu catálogo: lo usarás en lugar de <tu_catalogo> en los pasos siguientes.',
          screen: { id: 'notebook', highlight: ['languageSelect', 'computeSelect'] },
        },
        {
          title: 'Explora los datos de ejemplo',
          body: 'En Catalog abre samples, luego nyctaxi y la tabla trips. Revisa las columnas y la vista previa. Después vuelve al notebook y consulta la tabla con SQL.',
          code: { language: 'sql', code: 'SELECT COUNT(*) AS viajes,\n       ROUND(AVG(trip_distance), 2) AS distancia_promedio,\n       ROUND(AVG(fare_amount), 2)   AS tarifa_promedio\nFROM samples.nyctaxi.trips;' },
          check: 'La consulta devuelve una fila con el número de viajes y dos promedios.',
          screen: { id: 'catalog', highlight: ['samples'] },
        },
        {
          title: 'Crea un volumen para tus archivos',
          body: 'En Catalog entra a tu catálogo, abre el esquema default y usa Create y luego Volume. Elige un volumen administrado llamado raw. También puedes crearlo desde el notebook con SQL.',
          code: { language: 'sql', code: 'CREATE VOLUME IF NOT EXISTS <tu_catalogo>.default.raw\nCOMMENT \'Archivos crudos del curso\';' },
          check: 'El volumen raw aparece dentro del esquema default en Catalog.',
          screen: { id: 'catalog', highlight: ['create', 'volume'] },
        },
        {
          title: 'Sube un CSV propio',
          body: 'Crea en tu computadora un archivo ventas.csv con el contenido de abajo. En el workspace usa New, luego Add or upload data y Upload files to a volume. Elige el archivo y, como destino, el volumen raw.',
          code: { language: 'text', code: 'fecha,producto,cantidad,precio\n2026-01-05,Café,3,4.50\n2026-01-05,Té,1,3.20\n2026-01-06,Café,2,4.50\n2026-01-06,Pan,5,1.10\n2026-01-07,Té,4,3.20' },
          check: 'En Catalog, dentro del volumen raw, ves el archivo ventas.csv.',
          screen: { id: 'newMenu', highlight: ['uploadData'] },
        },
        {
          title: 'Lee el archivo con SQL',
          body: 'Vuelve al notebook y lee el CSV directamente desde el volumen con read_files. Observa que Spark infiere los tipos de las columnas a partir del contenido.',
          code: { language: 'sql', code: 'SELECT *\nFROM read_files(\n  \'/Volumes/<tu_catalogo>/default/raw/ventas.csv\',\n  format => \'csv\',\n  header => true\n);' },
          check: 'Ves las cinco filas con las columnas fecha, producto, cantidad y precio.',
        },
        {
          title: 'Convierte el archivo en una tabla',
          body: 'Crea una tabla Delta gobernada por Unity Catalog a partir del archivo y calcula el total de cada venta. Luego búscala en Catalog y revisa sus pestañas de detalles e historial.',
          code: { language: 'sql', code: 'CREATE OR REPLACE TABLE <tu_catalogo>.default.ventas AS\nSELECT CAST(fecha AS DATE) AS fecha,\n       producto,\n       CAST(cantidad AS INT) AS cantidad,\n       CAST(precio AS DECIMAL(10, 2)) AS precio,\n       CAST(cantidad AS INT) * CAST(precio AS DECIMAL(10, 2)) AS total\nFROM read_files(\'/Volumes/<tu_catalogo>/default/raw/ventas.csv\', format => \'csv\', header => true);' },
          check: 'La tabla ventas aparece en Catalog y su historial muestra la versión 0.',
        },
        {
          title: 'Consulta la tabla desde el SQL Editor',
          body: 'Abre SQL Editor, elige el SQL warehouse disponible y ejecuta una agregación sobre tu tabla. Es el mismo dato que usaste en el notebook, ahora desde la herramienta pensada para análisis.',
          code: { language: 'sql', code: 'SELECT producto, SUM(total) AS ingresos\nFROM <tu_catalogo>.default.ventas\nGROUP BY producto\nORDER BY ingresos DESC;' },
          check: 'Café aparece primero, con ingresos de 22.50.',
          screen: { id: 'home', highlight: ['sqlEditor'] },
        },
        {
          title: 'Opcional: navega por Azure',
          body: 'Si tienes acceso a una suscripción de Azure, entra al portal y ubica tu tenant de Microsoft Entra, la suscripción y un grupo de recursos. Si existe un workspace de Azure Databricks, busca también el grupo de recursos administrado que creó el servicio. Solo observa: no borres ni modifiques recursos.',
          check: 'Puedes señalar la suscripción, el grupo de recursos del workspace y su grupo de recursos administrado.',
        },
      ],
      wrapUp: 'Recorriste el camino completo de un dato: de un archivo en tu computadora a un volumen, de ahí a una tabla Delta gobernada y luego a una consulta en el SQL Editor. En las próximas sesiones transformarás estos datos con Spark SQL y PySpark.',
      sources: [
        { label: 'Databricks Free Edition', url: `${DOCS}/getting-started/free-edition` },
        { label: 'Crear y usar volúmenes', url: `${DOCS}/volumes/utility-commands` },
        { label: 'Subir archivos a un volumen', url: `${DOCS}/volumes/volume-files` },
        { label: 'SQL Editor', url: `${DOCS}/sql/user/sql-editor/` },
      ],
    },
    certification: {
      intro: 'Preguntas de práctica originales, alineadas con las guías oficiales. No son preguntas reales del examen.',
      exams: [
        { name: 'Databricks Fundamentals (acreditación)', url: 'https://www.databricks.com/training/catalog/databricks-fundamentals-2206', domains: ['Plataforma y lakehouse', 'Gobierno unificado', 'Recorrido por el workspace'] },
        { name: 'Databricks Certified Data Engineer Associate', url: 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf', domains: ['Databricks Intelligence Platform', 'Data Ingestion and Loading', 'Governance and Security'] },
        { name: 'Databricks Data + AI Platform Administrator Accreditation', url: 'https://www.databricks.com/learn/certification/platform-administrator-accreditation', domains: ['Recursos de cómputo', 'Gobierno y seguridad'] },
      ],
      questions: [
        { domain: 'Databricks Intelligence Platform', question: 'Un equipo usa cómputo clásico en Azure Databricks. ¿Dónde se ejecutan esas máquinas?', options: ['En la cuenta de Databricks', 'En la suscripción de Azure del cliente', 'En el control plane', 'En el navegador del usuario'], answer: 1, explanation: 'El compute plane clásico corre en la suscripción de Azure del cliente, dentro de la red virtual del workspace.' },
        { domain: 'Databricks Intelligence Platform', question: '¿Dónde se ejecuta el cómputo serverless de un workspace de Azure Databricks?', options: ['En la suscripción del cliente', 'En una región elegida al azar', 'En la cuenta de Databricks, en la misma región del workspace', 'En la máquina local del usuario'], answer: 2, explanation: 'El compute plane serverless vive en la cuenta de Databricks, alineado con la región del workspace y aislado por workspace.' },
        { domain: 'Databricks Fundamentals', question: '¿Cuál de estos elementos forma parte del control plane?', options: ['La aplicación web de Databricks', 'Las máquinas de un clúster clásico', 'La cuenta ADLS Gen2 del cliente', 'Los archivos Parquet de una tabla'], answer: 0, explanation: 'El control plane incluye la aplicación web y los servicios de backend que administra Databricks.' },
        { domain: 'Azure', question: '¿Qué afirmación sobre los grupos de recursos de Azure es correcta?', options: ['Todos sus recursos deben estar en la misma región', 'Solo pueden contener cuentas de almacenamiento', 'Su región indica dónde se guardan sus metadatos y sus recursos pueden estar en otras regiones', 'Equivalen a un tenant de Microsoft Entra'], answer: 2, explanation: 'La región del grupo de recursos guarda sus metadatos; los recursos que agrupa pueden estar en regiones distintas.' },
        { domain: 'Azure', question: '¿Qué es Azure Data Lake Storage Gen2?', options: ['Un servicio de bases de datos relacionales', 'Capacidades analíticas sobre Blob Storage activadas con el espacio de nombres jerárquico', 'Un tipo de máquina virtual', 'Un catálogo de Unity Catalog'], answer: 1, explanation: 'ADLS Gen2 no es un tipo de cuenta separado: es Blob Storage con espacio de nombres jerárquico.' },
        { domain: 'Databricks Intelligence Platform', question: 'Según la arquitectura, ¿qué contiene el almacenamiento del workspace?', options: ['Solo tablas Delta de negocio', 'Notebooks, consultas, archivos de configuración y datos del sistema como resultados y registros', 'Únicamente contraseñas de usuarios', 'Nada: todo se guarda en el navegador'], answer: 1, explanation: 'Distingue los recursos del sistema de archivos del workspace de los datos del sistema, como resultados, revisiones y registros.' },
        { domain: 'Governance and Security', question: '¿Cuál es el nombre correcto para referirse a una tabla en Unity Catalog?', options: ['esquema.tabla', 'workspace/tabla', 'catalogo.esquema.tabla', 'metastore.tabla'], answer: 2, explanation: 'Unity Catalog usa un espacio de nombres de tres niveles: catálogo, esquema y objeto.' },
        { domain: 'Governance and Security', question: 'Una empresa tiene tres workspaces en la misma región. ¿Pueden compartir un metastore de Unity Catalog?', options: ['No, cada workspace necesita su propio metastore', 'Solo si son workspaces serverless', 'Solo si usan la misma suscripción', 'Sí, un metastore regional puede asignarse a varios workspaces'], answer: 3, explanation: 'Un metastore es regional y puede asignarse a varios workspaces, que comparten datos y permisos.' },
        { domain: 'Recursos de cómputo', question: '¿Qué cómputo puedes usar en Databricks Free Edition?', options: ['Clústeres clásicos con cualquier tamaño', 'Solo cómputo serverless, con un SQL warehouse de tamaño 2X-Small', 'Ninguno: solo permite leer documentación', 'GPU para entrenar modelos'], answer: 1, explanation: 'Free Edition solo ofrece cómputo serverless y un SQL warehouse limitado a 2X-Small.' },
        { domain: 'Databricks Fundamentals', question: 'En un modelo PaaS como Databricks, ¿qué responsabilidad sigue siendo del cliente?', options: ['Actualizar el hardware del centro de datos', 'Parchear el sistema operativo de los servidores administrados', 'Proteger sus datos y decidir quién tiene acceso', 'Reemplazar los discos dañados'], answer: 2, explanation: 'Los datos, las identidades y los accesos son responsabilidad del cliente en cualquier modelo de nube.' },
        { domain: 'Databricks Intelligence Platform', question: '¿Qué se recomienda hoy en lugar del DBFS raíz y los montajes?', options: ['Guardar archivos en el control plane', 'Unity Catalog con tablas y volúmenes gobernados', 'Copiar los archivos a cada notebook', 'Usar solo archivos CSV locales'], answer: 1, explanation: 'El DBFS raíz y los montajes están obsoletos; los datos se gobiernan con Unity Catalog y sus volúmenes.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 'home', answer: 'catalog', question: 'Quieres explorar catálogos, esquemas y permisos de tus tablas. ¿Dónde haces clic?', explanation: 'Catalog abre Catalog Explorer, donde navegas catálogos, esquemas, tablas y volúmenes y revisas sus permisos.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 'newMenu', answer: 'uploadData', question: 'Necesitas subir ventas.csv a un volumen. ¿Qué opción del menú New eliges?', explanation: 'New, luego Add or upload data y Upload files to a volume es la ruta documentada para subir archivos a un volumen.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 'catalog', answer: 'volume', question: 'Estás en el esquema default y abriste el menú Create. ¿Dónde haces clic para crear el volumen raw?', explanation: 'Catalog, el esquema, Create y Volume crean el volumen; necesitas los permisos USE CATALOG, USE SCHEMA y CREATE VOLUME.' },
        { type: 'hotspot', domain: 'Recursos de cómputo', screen: 'notebook', answer: 'computeSelect', question: 'Tu notebook debe ejecutarse con cómputo serverless. ¿Dónde lo eliges?', explanation: 'El selector de cómputo del notebook permite elegir Serverless; en Free Edition es la única opción disponible.' },
        { type: 'hotspot', domain: 'Databricks Intelligence Platform', screen: 'home', answer: 'sqlEditor', question: 'Quieres consultar una tabla con un SQL warehouse, fuera de un notebook. ¿Dónde vas?', explanation: 'SQL Editor ejecuta consultas sobre un SQL warehouse; en Free Edition hay uno de tamaño 2X-Small.' },
      ],
    },
  };
})(globalThis);
