// Sesión 8: contenido original basado en la documentación oficial de Azure Data Factory y Azure Databricks (revisada en noviembre de 2026).
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const ADF = 'https://learn.microsoft.com/en-us/azure/data-factory';
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const DOCS = 'https://docs.databricks.com/aws/en';
  const adf = (label, path) => ({ label, url: `${ADF}/${path}` });
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';
  const DP700 = 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700';

  DataLab.deep.es.s08 = {
    deepDive: [
      {
        title: 'Seis componentes y tres tipos de actividad',
        body: [
          'Microsoft describe Data Factory con seis componentes: pipelines, activities, datasets, linked services, data flows e integration runtimes. Las actividades se agrupan en tres familias: movimiento de datos (Copy), transformación (Data Flow, Databricks Notebook, Stored Procedure, entre otras) y control (If Condition, ForEach, Until, Wait, Lookup, Execute Pipeline). Un linked service sirve para dos cosas: representar un almacén de datos o un servicio de cómputo, como un workspace de Azure Databricks.',
          'El pipeline es la unidad que despliegas y programas: no programas actividades sueltas. Tiene un límite suave de 120 actividades, contando las internas de contenedores como ForEach, y una propiedad concurrency que encola las ejecuciones extra. Cada ejecución es un pipeline run con un run ID propio; los parámetros son de solo lectura dentro del run y las variables guardan valores temporales que puedes cambiar con Set Variable.',
        ],
        source: adf('Pipelines y actividades', 'concepts-pipelines-activities'),
      },
      {
        title: 'Integration runtime: Azure, self-hosted y Azure-SSIS',
        body: [
          'El integration runtime (IR) es la infraestructura de cómputo que une actividades y linked services. Aporta cuatro capacidades: ejecutar data flows, mover datos, despachar actividades de transformación hacia otros servicios y ejecutar paquetes SSIS. El Azure IR es serverless y administrado; por defecto se resuelve automáticamente (AutoResolve) y, en Copy, intenta usar la región del destino.',
          'El self-hosted IR se instala en Windows dentro de tu red, solo abre conexiones HTTP salientes y sirve para copiar desde fuentes privadas o detrás de un firewall; no ejecuta data flows. El Azure-SSIS IR es un clúster de VMs dedicado a paquetes SSIS. Para las actividades de Databricks, el IR solo despacha el trabajo: el cómputo pesado ocurre en el clúster de Databricks.',
        ],
        source: adf('Integration runtime', 'concepts-integration-runtime'),
      },
      {
        title: 'El linked service de Azure Databricks: autenticación y cómputo',
        body: [
          'El linked service admite Access Token, la managed identity del factory (system-assigned) y una user-assigned managed identity registrada como credential. Con managed identity no necesitas token: el tutorial oficial pide asignar el rol Contributor a esa identidad en Access control (IAM) del recurso de Azure Databricks. Si usas token, guárdalo en Azure Key Vault y referéncialo desde el linked service en lugar de pegarlo en el JSON.',
          'En Select cluster eliges un job cluster nuevo por ejecución (newClusterVersion, newClusterNodeType y newClusterNumOfWorker, por ejemplo "1:10" para autoescalar), un clúster interactivo existente (existingClusterId) o un instance pool existente (instancePoolId). La documentación advierte que Databricks sugiere clústeres nuevos para mayor confiabilidad. Para la actividad Job, que siempre corre en serverless, eliges la opción Serverless en el linked service.',
        ],
        source: adf('Linked service de Azure Databricks', 'compute-linked-services'),
      },
      {
        title: 'Cuatro actividades de Databricks: Notebook, Python, Jar y Job',
        body: [
          'Notebook (tipo DatabricksNotebook) ejecuta un notebook cuya ruta absoluta debe empezar con barra, con baseParameters y libraries opcionales (jar, egg, whl, maven, pypi o cran). Python y Jar ejecutan un archivo .py o una clase de un JAR. Las tres corren sobre el cómputo definido en el linked service, de modo que, con un job cluster nuevo, el clúster se crea en cada ejecución: el tutorial estima de 5 a 8 minutos de arranque.',
          'La actividad Job (tipo DatabricksJob, solo en Azure Data Factory) ejecuta un job de Lakeflow existente por jobId y le pasa jobParameters; corre automáticamente en serverless, así que el linked service no necesita clúster. Encaja cuando el job ya existe en Databricks con varias tareas y ADF solo debe dispararlo dentro de un proceso mayor. Los job parameters requieren self-hosted IR 5.52.0.0 o superior si usas ese IR.',
        ],
        source: adf('Actividad Databricks Job', 'transform-data-databricks-job'),
      },
      {
        title: 'Ida y vuelta de valores: baseParameters, widgets y runOutput',
        body: [
          'Cada clave de baseParameters llena el widget del mismo nombre; si el notebook define un widget que no recibes, usa su valor por defecto. Por eso conviene declarar widgets con valores por defecto válidos para probar el notebook a mano. Los parámetros y el valor de retorno son cadenas, así que conviertes tipos dentro del notebook y validas formatos, por ejemplo una fecha, antes de usarlos en SQL.',
          'dbutils.notebook.exit("valor") devuelve el resultado a Data Factory, que lo expone en @activity(\'Nombre\').output.runOutput, con un límite de 2 MB. Si devuelves un JSON con json.dumps, lees cada campo agregando su nombre: @activity(\'Notebook_Ventas\').output.runOutput.filas.',
        ],
        source: adf('Pasar parámetros entre notebooks y pipelines', 'transform-data-databricks-notebook'),
      },
      {
        title: 'Control de flujo: If Condition, ForEach, Until y Execute Pipeline',
        body: [
          'If Condition evalúa una expresión booleana y ejecuta ifTrueActivities o ifFalseActivities, por ejemplo @greater(activity(\'Notebook_Ventas\').output.runOutput.filas, 0). Lookup lee un valor o una tabla para decisiones posteriores, Get Metadata inspecciona archivos, Wait pausa y Until repite actividades hasta que una condición se cumple, con un timeout configurable. Fail termina el pipeline con un mensaje propio.',
          'ForEach recorre un arreglo con @item(): es paralelo por defecto (isSequential = false), con batchCount de 20 y máximo 50, y hasta 100 000 elementos. No admite un ForEach dentro de otro ForEach ni de un Until, y Set Variable no es seguro dentro de un ForEach paralelo porque las variables son globales. La solución es Execute Pipeline: el bucle externo llama a un pipeline hijo que contiene el interno.',
        ],
        source: adf('Actividad ForEach', 'control-flow-for-each-activity'),
      },
      {
        title: 'Condiciones de dependencia y políticas de actividad',
        body: [
          'Las flechas entre actividades llevan una de cuatro condiciones: Succeeded, Failed, Completed (éxito o fallo) y Skipped. Skipped aparece en cadenas: si X falla en X → Y → Z con Succeeded, Y y Z quedan omitidas. Una actividad puede depender de varias anteriores con condiciones distintas, por ejemplo una Web activity de alerta conectada con Failed a la actividad del notebook.',
          'Las actividades de ejecución tienen una policy con timeout (12 horas por defecto), retry (0 por defecto), retryIntervalInSeconds (30 por defecto) y secureOutput, que evita registrar la salida en el monitoreo. Si el job de Databricks ya reintenta por su cuenta, limita también los reintentos en ADF: ambos se multiplican y alargan la recuperación de un error real.',
        ],
        source: adf('Dependencias y política de actividad', 'concepts-pipelines-activities'),
      },
      {
        title: 'Triggers: schedule, tumbling window, storage event y custom event',
        body: [
          'Un schedule trigger dispara en un calendario de reloj, se relaciona de muchos a muchos con pipelines y es "fire and forget": se marca exitoso con solo iniciar el run. Un tumbling window trigger divide el tiempo en ventanas fijas, contiguas y sin solapamiento, permite backfill de ventanas pasadas, reintentos, concurrencia de 1 a 50 y windowStartTime/windowEndTime, pero solo apunta a un pipeline.',
          'Los triggers de eventos son dos: storage event, para la llegada o borrado de archivos en una cuenta de almacenamiento, y custom event, para eventos personalizados de Event Grid. Ningún trigger dispara hasta que publicas los cambios con Publish all. Detener y volver a iniciar un trigger de eventos retoma su patrón anterior; si no quieres ese efecto, elimínalo y créalo de nuevo.',
        ],
        source: adf('Ejecución de pipelines y triggers', 'concepts-pipeline-execution-triggers'),
      },
      {
        title: 'Debug, Publish all y monitoreo con reruns',
        body: [
          'Debug ejecuta el borrador del pipeline sin publicarlo, pero es una ejecución real: un Copy copia datos de verdad, así que usa carpetas de prueba. Con Debug Until pones un punto de parada en una actividad y la prueba se detiene ahí. El historial de debug se conserva 15 días. Publish all envía pipelines, linked services y triggers al servicio; solo lo publicado puede correr con triggers.',
          'El hub Monitor lista pipeline runs con pestañas Triggered y Debug, y no se refresca solo: pulsa Refresh. Puedes elegir Rerun desde el inicio, Rerun from activity o Rerun from failed activity; volver a ejecutar con New parameters cuenta como un run nuevo. Data Factory guarda los datos de runs solo 45 días; para más tiempo configura diagnostic settings hacia Log Analytics.',
        ],
        source: adf('Monitorear visualmente Data Factory', 'monitor-visually'),
      },
      {
        title: 'Copy hacia ADLS Gen2 y hacia tablas Delta',
        body: [
          'Lo más simple es que Copy deje archivos crudos en ADLS Gen2 y que Databricks los ingiera con Auto Loader. El conector Azure Databricks Delta Lake permite además escribir o leer tablas Delta directamente, pero usa tu clúster de Databricks para mover los datos: Copy invoca el clúster, que lee desde la fuente o desde un área de staging en Blob o ADLS Gen2.',
          'La copia directa solo funciona si la fuente es Blob o ADLS Gen2 en Parquet, texto delimitado o Avro, apuntando a una carpeta y sin conversión de tipos; si no, activas staged copy con una cuenta intermedia. Si el clúster está detenido, Copy lo inicia, pero la vista previa de datos al editar necesita un clúster encendido. Con este conector, Lookup devuelve como máximo 1000 filas.',
        ],
        source: adf('Conector Azure Databricks Delta Lake', 'connector-azure-databricks-delta-lake'),
      },
      {
        title: 'Mapping Data Flows y su cómputo Spark',
        body: [
          'Un mapping data flow es una transformación visual sin código que se ejecuta como actividad Data Flow dentro de un pipeline, sobre clústeres Spark administrados por ADF que se crean y se apagan según hace falta. Solo eliges el Azure IR y los parámetros; sus propiedades de data flow definen el cómputo. Las pestañas Optimize, Inspect y Data preview ayudan a ajustar particiones y revisar el esquema.',
          'El modo debug abre una sesión con un clúster Spark vivo para ver datos en cada paso; un TTL en el Azure IR lo mantiene disponible entre ejecuciones. Para pruebas pequeñas reutiliza la sesión de debug; para trabajos grandes o en paralelo elige Use Activity Runtime. Si ya tienes la lógica en notebooks de Databricks, llamarlos desde ADF evita duplicarla en un data flow.',
        ],
        source: adf('Mapping data flows', 'concepts-data-flow-overview'),
      },
      {
        title: 'Data Factory en Microsoft Fabric y la decisión frente a Lakeflow Jobs',
        body: [
          'Microsoft presenta Data Factory en Fabric como la siguiente generación de ADF. Allí los linked services pasan a ser connections y desaparecen los datasets; no hay paso de publicación (Save y Run); no gestionas integration runtimes y el self-hosted IR se sustituye por el on-premises data gateway. Execute Pipeline se llama Invoke pipeline y Databricks se usa con la actividad Azure Databricks.',
          'Databricks recomienda Lakeflow Jobs para orquestar notebooks y documenta ADF como orquestador externo que puede ejecutar un job, notebooks, scripts Python o JAR. Una regla práctica: si todo el proceso vive en Databricks, usa Lakeflow Jobs; si ADF ya coordina copias desde fuentes on-premises, SaaS o SSIS, deja que ADF dispare a Databricks, de preferencia con la actividad Job.',
        ],
        source: { label: 'Diferencias entre Data Factory en Fabric y Azure', url: 'https://learn.microsoft.com/en-us/fabric/data-factory/compare-fabric-data-factory-and-azure-data-factory' },
      },
    ],
    diagram: {
      title: 'Un pipeline de ADF que copia, transforma en Databricks y decide',
      caption: 'Un schedule trigger inicia pl_ventas con el parámetro fecha; Copy lleva el archivo a ADLS Gen2 con el Azure IR; la actividad Notebook usa el linked service de Azure Databricks con managed identity; If Condition lee runOutput.filas y, si no hay datos, una Web activity avisa. Key Vault guarda secretos y Monitor registra cada run.',
      layers: [
        { label: 'Disparo', nodes: ['Schedule trigger diario', 'Parámetro fecha = @trigger().scheduledTime formateado'] },
        { label: 'Movimiento', nodes: ['Copy: Blob → ADLS Gen2 raw/ventas/', 'Azure integration runtime (AutoResolve)'] },
        { label: 'Transformación en Databricks', nodes: ['Notebook_Ventas con baseParameters', 'Linked service Azure Databricks (managed identity)', 'Job cluster ejecuta s08_ventas_dia y llama a dbutils.notebook.exit'] },
        { label: 'Decisión', nodes: ['If Condition: runOutput.filas > 0', 'True: continuar', 'False: Web activity notifica al equipo'] },
        { label: 'Seguridad y observabilidad', nodes: ['Azure Key Vault: secretos de linked services', 'Monitor: pipeline runs y activity runs (45 días)'] },
      ],
    },
    comparison: {
      title: 'Azure Data Factory frente a Lakeflow Jobs',
      headers: ['Aspecto', 'Azure Data Factory', 'Lakeflow Jobs'],
      rows: [
        ['Dónde vive', 'Servicio PaaS de Azure; se edita en ADF Studio', 'Dentro del workspace de Databricks'],
        ['Unidad de trabajo', 'Pipeline con actividades; límite suave de 120', 'Job con tareas en un DAG; hasta 1000 tareas'],
        ['Fuerte en', 'Copy con muchos conectores, self-hosted IR para redes privadas y SSIS', 'Notebooks, pipelines de Lakeflow, SQL y scripts en Databricks'],
        ['Cómo ejecuta Databricks', 'Actividades Notebook, Python, Jar y Job vía linked service', 'De forma nativa, con cómputo serverless o clásico'],
        ['Triggers', 'Schedule, tumbling window, storage event y custom event', 'Programados por tiempo o por eventos, como la llegada de archivos'],
        ['Control de flujo', 'If Condition, Switch, ForEach, Until, Wait, Execute Pipeline', 'Tareas if / else y for each'],
        ['Pasar valores', 'Expresiones como @activity(\'x\').output.runOutput', 'Parámetros de job y valores dinámicos entre tareas'],
        ['Monitoreo', 'Hub Monitor, runs por 45 días, Azure Monitor', 'Runs en Jobs & Pipelines y system tables'],
      ],
      sources: [adf('Pipelines y actividades', 'concepts-pipelines-activities'), source('Lakeflow Jobs', 'jobs/')],
    },
    lab: {
      title: 'Un notebook parametrizado y su orquestación con Data Factory',
      goal: 'Escribir en Free Edition un notebook que recibe una fecha por widget, cuenta las ventas de ese día y devuelve un JSON con dbutils.notebook.exit; probarlo desde otro notebook con dbutils.notebook.run, emular la condición y el camino de fallo; y, con una suscripción de Azure, ejecutarlo desde un pipeline de Data Factory con base parameters, If Condition, Debug, un schedule trigger y el hub Monitor.',
      minutes: 120,
      requirements: [
        'Pasos 1 a 6: Databricks Free Edition con cómputo serverless. Free Edition permite como máximo 5 tareas de job concurrentes por cuenta; cada dbutils.notebook.run inicia un job efímero, así que ejecútalos uno a la vez. Sustituye <tu_catalogo> por el resultado de current_catalog().',
        'Pasos 7 a 13 (opcionales): una suscripción de Azure, por ejemplo una cuenta gratuita o con créditos, con un workspace de Azure Databricks. Data Factory se conecta a workspaces de Azure Databricks, no a Free Edition. Los job clusters y el data factory generan costo: usa una fecha de fin en el trigger y borra el grupo de recursos al terminar.',
        'Para autenticar con managed identity necesitas poder asignar el rol Contributor al data factory en Access control (IAM) del recurso de Azure Databricks; si no puedes, usa Access Token guardado en Azure Key Vault.',
      ],
      steps: [
        {
          title: 'Prepara el esquema y la tabla de ventas (Free Edition)',
          body: 'Abre un notebook nuevo con cómputo serverless y lenguaje SQL. Anota el valor de current_catalog() y úsalo en lugar de <tu_catalogo>. La tabla tiene cuatro ventas en dos fechas; el 7 de enero queda sin ventas a propósito para probar la rama False más adelante.',
          code: { language: 'sql', code: `SELECT current_catalog();
CREATE SCHEMA IF NOT EXISTS <tu_catalogo>.s08_lab;
CREATE OR REPLACE TABLE <tu_catalogo>.s08_lab.ventas (venta_id INT, fecha DATE, monto DOUBLE);
INSERT INTO <tu_catalogo>.s08_lab.ventas VALUES
  (1, DATE'2026-01-05', 10.0),
  (2, DATE'2026-01-05', 20.0),
  (3, DATE'2026-01-05', 5.5),
  (4, DATE'2026-01-06', 40.0);
SELECT fecha, count(*) AS filas, sum(monto) AS total
FROM <tu_catalogo>.s08_lab.ventas GROUP BY fecha ORDER BY fecha;` },
          check: 'La última consulta devuelve 2 filas: 2026-01-05 → 3 ventas y 35.5 (10 + 20 + 5.5); 2026-01-06 → 1 venta y 40.0. No aparece 2026-01-07.',
          screen: { id: 'notebook', highlight: ['computeSelect', 'languageSelect'] },
        },
        {
          title: 'Escribe el notebook parametrizado s08_ventas_dia',
          body: 'En tu carpeta de usuario crea la carpeta s08_lab y dentro un notebook Python llamado s08_ventas_dia. Los widgets fecha y catalogo son los base parameters que enviará Data Factory. La fecha se valida antes de usarla y la consulta usa marcadores de parámetro en vez de concatenar texto. El notebook termina con dbutils.notebook.exit y un JSON.',
          code: { language: 'python', code: `import json
from datetime import date

dbutils.widgets.text("fecha", "2026-01-05", "Fecha (YYYY-MM-DD)")
dbutils.widgets.text("catalogo", "<tu_catalogo>", "Catálogo")
fecha = dbutils.widgets.get("fecha")
catalogo = dbutils.widgets.get("catalogo")

date.fromisoformat(fecha)  # ValueError si la fecha no existe: la actividad falla

fila = spark.sql(
    "SELECT count(*) AS filas, coalesce(sum(monto), 0.0) AS total "
    "FROM IDENTIFIER(:tabla) WHERE fecha = CAST(:fecha AS DATE)",
    args={"tabla": f"{catalogo}.s08_lab.ventas", "fecha": fecha},
).first()

resultado = {
    "fecha": fecha,
    "filas": fila["filas"],
    "total": float(fila["total"]),
    "estado": "OK" if fila["filas"] > 0 else "SIN_DATOS",
}
dbutils.notebook.exit(json.dumps(resultado))` },
          check: 'El notebook muestra arriba los widgets fecha y catalogo; cambia el valor por defecto de catalogo por tu catálogo real.',
        },
        {
          title: 'Simula los parámetros a mano',
          body: 'Pulsa Run all con fecha = 2026-01-05: la celda termina con el valor de salida de dbutils.notebook.exit. Después escribe 2026-01-07 en el widget fecha y vuelve a ejecutar. Así simulas lo que hará Data Factory al llenar los widgets con base parameters, sin necesitar Azure todavía.',
          check: 'Con 2026-01-05 la salida es {"fecha": "2026-01-05", "filas": 3, "total": 35.5, "estado": "OK"}; con 2026-01-07 es {"fecha": "2026-01-07", "filas": 0, "total": 0.0, "estado": "SIN_DATOS"}, porque coalesce convierte la suma nula en 0.0.',
          screen: { id: 'notebook', highlight: ['runAll'] },
        },
        {
          title: 'Llama al notebook desde un orquestador con dbutils.notebook.run',
          body: 'En la misma carpeta crea el notebook Python s08_orquestador. dbutils.notebook.run inicia un job efímero por llamada, llena los widgets con el diccionario de argumentos y devuelve como cadena el valor de exit. Si tu entorno no resuelve la ruta relativa, usa la ruta absoluta del notebook. Si dbutils.notebook.run no estuviera disponible, crea un job con una tarea de notebook y el parámetro fecha (sesión 7).',
          code: { language: 'python', code: `import json

catalogo = "<tu_catalogo>"
resultados = []
for fecha in ["2026-01-05", "2026-01-06", "2026-01-07"]:
    salida = dbutils.notebook.run("./s08_ventas_dia", 600, {"fecha": fecha, "catalogo": catalogo})
    resultados.append(json.loads(salida))

for r in resultados:
    print(r)
print("total:", sum(r["total"] for r in resultados))` },
          check: 'Se imprimen 3 diccionarios: 2026-01-05 → filas 3, total 35.5, OK; 2026-01-06 → filas 1, total 40.0, OK; 2026-01-07 → filas 0, total 0.0, SIN_DATOS. La última línea es total: 75.5 (35.5 + 40.0 + 0.0).',
        },
        {
          title: 'Emula la decisión del If Condition',
          body: 'En ADF, la rama se decidirá con una expresión sobre runOutput. Aquí la reproduces en Python con los mismos resultados, para comprobar la lógica antes de pagar por un job cluster. Si filas es mayor que cero, el pipeline sigue; si no, notifica.',
          code: { language: 'python', code: `# ADF: @greater(activity('Notebook_Ventas').output.runOutput.filas, 0)
for r in resultados:
    hay_ventas = r["filas"] > 0
    print(r["fecha"], "->", "True: continuar" if hay_ventas else "False: notificar")` },
          check: 'Salida: 2026-01-05 -> True: continuar; 2026-01-06 -> True: continuar; 2026-01-07 -> False: notificar. Dos fechas toman la rama True y una la rama False.',
        },
        {
          title: 'Provoca un fallo para entender la condición Failed',
          body: 'Llama al notebook con una fecha que no existe. date.fromisoformat lanza ValueError, el notebook hijo falla y la llamada lanza una excepción en el orquestador. En ADF ese mismo error marcaría la actividad como Failed: la flecha Succeeded hacia el If Condition no se seguiría y una actividad conectada con Failed sí se ejecutaría.',
          code: { language: 'python', code: `try:
    dbutils.notebook.run("./s08_ventas_dia", 600, {"fecha": "2026-02-30", "catalogo": catalogo})
    print("Succeeded")
except Exception as e:
    print("Failed:", str(e)[:120])` },
          check: 'Se imprime una línea que empieza con Failed: y nunca Succeeded, porque febrero de 2026 no tiene día 30.',
        },
        {
          title: 'Crea el data factory (requiere Azure)',
          body: 'Desde aquí necesitas una suscripción de Azure. En el Azure portal elige Create a resource → Analytics → Data Factory. En Basics selecciona Subscription, crea un Resource group nuevo (por ejemplo rg-s08-lab), elige la Region y un Name globalmente único. Pulsa Review + create y luego Create. En Azure Databricks repite los pasos 1 y 2 en tu workspace.',
          check: 'Al terminar, Go to resource abre la página del data factory y Launch Studio abre Azure Data Factory Studio en otra pestaña. El workspace de Azure Databricks contiene /Users/<tu_usuario>/s08_lab/s08_ventas_dia.',
          screen: { id: 's08-portal', highlight: ['dataFactory', 'resourceGroup', 'name', 'reviewCreate', 'launchStudio'] },
        },
        {
          title: 'Crea el linked service de Azure Databricks',
          body: 'En ADF Studio ve a Manage → Linked services → + New → Compute → Azure Databricks → Continue. Nombra el servicio ls_databricks, elige tu Databricks workspace, Select cluster = New job cluster y Authentication type = Managed service identity, con el rol Contributor asignado antes en el recurso de Databricks. Elige versión, tipo de nodo pequeño y 1 worker, y pulsa Create.',
          code: { language: 'json', code: `{
  "name": "ls_databricks",
  "properties": {
    "type": "AzureDatabricks",
    "typeProperties": {
      "domain": "https://adb-<id>.<n>.azuredatabricks.net",
      "authentication": "MSI",
      "workspaceResourceId": "<id del recurso de Azure Databricks>",
      "newClusterVersion": "<versión de Databricks Runtime>",
      "newClusterNodeType": "<tipo de nodo>",
      "newClusterNumOfWorker": "1"
    }
  }
}` },
          check: 'ls_databricks aparece en Manage → Linked services con tipo Azure Databricks. El JSON es una referencia: compáralo con el código que muestra el editor y no copies un token en él.',
          screen: { id: 's08-manage', highlight: ['manage', 'linkedServices', 'newLinked', 'azureDatabricks', 'selectCluster', 'authType'] },
        },
        {
          title: 'Arma el pipeline con la actividad Notebook',
          body: 'Ve a Author, pulsa + → Pipeline → Pipeline y nómbralo pl_ventas. En Parameters crea fecha (String, por defecto 2026-01-05). En Activities expande Databricks y arrastra Notebook al lienzo; llámala Notebook_Ventas. En Azure Databricks elige ls_databricks; en Settings indica Notebook path y dos Base parameters.',
          code: { language: 'json', code: `{
  "name": "Notebook_Ventas",
  "type": "DatabricksNotebook",
  "linkedServiceName": { "referenceName": "ls_databricks", "type": "LinkedServiceReference" },
  "typeProperties": {
    "notebookPath": "/Users/<tu_usuario>/s08_lab/s08_ventas_dia",
    "baseParameters": {
      "fecha": "@pipeline().parameters.fecha",
      "catalogo": "<tu_catalogo>"
    }
  }
}` },
          check: 'Validate no muestra errores. En el código del pipeline, notebookPath empieza con / y baseParameters tiene las claves fecha y catalogo, iguales a los nombres de los widgets.',
          screen: { id: 's08-author', highlight: ['author', 'parametersTab', 'databricks', 'notebook', 'databricksTab', 'settingsTab', 'baseParameters'] },
        },
        {
          title: 'Agrega el If Condition sobre runOutput',
          body: 'Busca If en el panel Activities y arrastra If Condition; llámalo If_HayVentas y conecta la salida Success de Notebook_Ventas. En su pestaña Activities escribe la expresión. En True agrega una actividad Wait de 1 segundo; en False agrega una actividad Fail con un mensaje. En producción, False suele llevar una Web activity hacia el webhook del equipo.',
          code: { language: 'json', code: `{
  "name": "If_HayVentas",
  "type": "IfCondition",
  "dependsOn": [{ "activity": "Notebook_Ventas", "dependencyConditions": ["Succeeded"] }],
  "typeProperties": {
    "expression": {
      "value": "@greater(activity('Notebook_Ventas').output.runOutput.filas, 0)",
      "type": "Expression"
    },
    "ifTrueActivities": [{ "name": "Wait_OK", "type": "Wait", "typeProperties": { "waitTimeInSeconds": 1 } }],
    "ifFalseActivities": [{ "name": "Fail_SinVentas", "type": "Fail",
      "typeProperties": { "message": "Sin ventas para @{pipeline().parameters.fecha}", "errorCode": "SIN_DATOS" } }]
  }
}` },
          check: 'El lienzo muestra Notebook_Ventas → (Success) → If_HayVentas, con Wait_OK en True y Fail_SinVentas en False. Validate termina sin errores.',
          screen: { id: 's08-author', highlight: ['search', 'ifCondition', 'successPath', 'ifActivity'] },
        },
        {
          title: 'Prueba con Debug sin publicar',
          body: 'Pulsa Debug y deja fecha = 2026-01-05. El primer run espera a que se cree el job cluster, de 5 a 8 minutos según el tutorial. En la pestaña Output abre la salida de Notebook_Ventas. Repite Debug con fecha = 2026-01-07. Debug ejecuta de verdad el notebook, aunque nada esté publicado todavía.',
          check: 'Con 2026-01-05: Notebook_Ventas Succeeded, runOutput = {"fecha": "2026-01-05", "filas": 3, "total": 35.5, "estado": "OK"}, If_HayVentas toma True y el run termina Succeeded. Con 2026-01-07: runOutput.filas = 0, se ejecuta Fail_SinVentas y el run termina Failed con el mensaje Sin ventas para 2026-01-07.',
          screen: { id: 's08-author', highlight: ['debug', 'outputTab', 'notebookActivity'] },
        },
        {
          title: 'Agrega un schedule trigger y publica',
          body: 'Pulsa Add trigger → New/Edit → Choose trigger → + New. Deja Type = Schedule y fija Start date unos 15 minutos en el futuro: si la hora de inicio ya pasó, el primer run se calcula para la siguiente recurrencia. Pon Recurrence en 1 día, marca Specify an end date una hora después del inicio y deja Activated en Yes. Pulsa OK, escribe 2026-01-06 como valor de fecha y pulsa Publish all antes de la hora de inicio.',
          check: 'Hasta pulsar Publish all el trigger no dispara nada. Después, Manage → Triggers lo muestra iniciado y, con recurrencia diaria y fin una hora después, dispara exactamente 1 run a la hora de inicio: fecha = 2026-01-06, filas 1, total 40.0, rama True y estado Succeeded.',
          screen: { id: 's08-trigger', highlight: ['newEdit', 'schedule', 'recurrence', 'endDate', 'activated', 'publishAll'] },
        },
        {
          title: 'Monitorea, vuelve a ejecutar y limpia',
          body: 'Abre Monitor → Pipeline runs y pulsa Refresh. En Triggered verás el run del trigger; en Debug, las dos pruebas. Abre un run para ver sus activity runs y el icono Output. Sobre el run del trigger elige Rerun. Al terminar, desactiva el trigger, publica y borra el grupo de recursos.',
          check: 'Triggered: 1 run Succeeded con el nombre del trigger en Triggered By. Debug: 2 runs, 2026-01-05 Succeeded y 2026-01-07 Failed. El rerun queda agrupado con el original: la columna Run muestra Original y Rerun (Latest), y termina Succeeded.',
          screen: { id: 's08-monitor', highlight: ['monitor', 'pipelineRuns', 'triggeredTab', 'debugTab', 'refresh', 'outputIcon'] },
        },
      ],
      wrapUp: 'Escribiste un notebook que recibe parámetros por widgets y devuelve un JSON: tres fechas produjeron 3, 1 y 0 ventas, con 75.5 en total, y una fecha inválida demostró la condición Failed. En Azure, el mismo contrato de widgets y runOutput permitió que Data Factory pase la fecha, decida con If Condition, pruebe con Debug y programe con un schedule trigger. Borra el grupo de recursos para no seguir pagando.',
      sources: [
        { label: 'Límites de Free Edition', url: `${DOCS}/getting-started/free-edition-limitations` },
        source('Orquestar notebooks y dbutils.notebook.run', 'notebooks/notebook-workflows'),
        source('Widgets de Databricks', 'notebooks/widgets'),
        adf('Tutorial: ejecutar un notebook con la actividad Notebook', 'transform-data-using-databricks-notebook'),
        adf('Actividad Databricks Notebook', 'transform-data-databricks-notebook'),
        adf('Linked service de Azure Databricks', 'compute-linked-services'),
        adf('Actividad If Condition', 'control-flow-if-condition-activity'),
        adf('Desarrollo iterativo y debug', 'iterative-development-debugging'),
        adf('Crear schedule triggers', 'how-to-create-schedule-trigger'),
        adf('Monitorear visualmente Data Factory', 'monitor-visually'),
        adf('Guardar credenciales en Azure Key Vault', 'store-credentials-in-key-vault'),
      ],
    },
    certification: {
      intro: 'Preguntas de práctica originales; no son preguntas reales de ningún examen. Data Factory no es un tema del examen de Databricks: las preguntas sobre la integración se alinean con dominios de Databricks Certified Data Engineer Associate y las de orquestación pura con DP-700, cuyo temario cubre pipelines de Data Factory en Microsoft Fabric. DP-203 (Azure Data Engineer Associate) se retiró el 31 de marzo de 2025.',
      exams: [
        { name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Working with Lakeflow Jobs', 'Databricks Intelligence Platform', 'Data Ingestion and Loading'] },
        { name: 'Microsoft DP-700: Implementing Data Engineering Solutions Using Microsoft Fabric', url: DP700, domains: ['Implement and manage an analytics solution', 'Ingest and transform data', 'Monitor and optimize an analytics solution'] },
      ],
      questions: [
        { domain: 'Implement and manage an analytics solution', question: '¿Qué componente de Data Factory guarda la URL del workspace de Azure Databricks y su método de autenticación?', options: ['Un dataset', 'Un integration runtime', 'Un linked service', 'Un trigger'], answer: 2, explanation: 'El linked service define la conexión a un almacén o a un servicio de cómputo; el dataset describe datos y el IR aporta el cómputo de integración.' },
        { domain: 'Ingest and transform data', question: 'Debes copiar tablas desde un SQL Server on-premises detrás de un firewall corporativo. ¿Qué integration runtime usa la actividad Copy?', options: ['El Azure IR con AutoResolve', 'Un self-hosted IR instalado en la red privada', 'Un Azure-SSIS IR', 'El clúster de Databricks del linked service'], answer: 1, explanation: 'El self-hosted IR se instala dentro de la red, solo abre conexiones salientes y mueve datos entre redes privadas y la nube.' },
        { domain: 'Implement and manage an analytics solution', question: 'Un notebook lee dbutils.widgets.get("fecha"). ¿Cómo le envías ese valor desde la actividad Notebook de ADF?', options: ['Con una clave fecha en baseParameters', 'Con una librería pypi en libraries', 'Con newClusterSparkConf en el linked service', 'Con una global temp view creada antes'], answer: 0, explanation: 'Cada clave de baseParameters llena el widget del mismo nombre; si falta, el notebook usa el valor por defecto del widget.' },
        { domain: 'Implement and manage an analytics solution', question: 'El notebook termina con dbutils.notebook.exit(json.dumps({"filas": 0})). ¿Qué expresión usa el If Condition para saber si hubo filas?', options: ['@greater(pipeline().parameters.filas, 0)', '@greater(activity(\'Notebook_Ventas\').output.runOutput.filas, 0)', '@greater(item().filas, 0)', '@greater(trigger().outputs.filas, 0)'], answer: 1, explanation: 'El valor de exit se expone en output.runOutput de la actividad, y en un JSON lees cada campo agregando su nombre.' },
        { domain: 'Monitor and optimize an analytics solution', question: 'Una Web activity de alerta solo debe ejecutarse si falla la actividad del notebook. ¿Qué condición de dependencia usas?', options: ['Succeeded', 'Completed', 'Skipped', 'Failed'], answer: 3, explanation: 'Failed ejecuta la actividad siguiente solo cuando la anterior termina con fallo; Completed la ejecutaría también tras un éxito.' },
        { domain: 'Implement and manage an analytics solution', question: 'Necesitas procesar ventanas horarias desde el 1 de enero, con reintentos y como máximo 4 ventanas a la vez. ¿Qué trigger eliges?', options: ['Schedule trigger', 'Storage event trigger', 'Tumbling window trigger', 'Custom event trigger'], answer: 2, explanation: 'El tumbling window trigger admite backfill de ventanas pasadas, reintentos, concurrencia configurable y las variables de inicio y fin de ventana.' },
        { domain: 'Databricks Intelligence Platform', question: 'Un job de Lakeflow con varias tareas ya existe y debe correr en serverless cuando ADF termine una copia. ¿Qué actividad usas?', options: ['Notebook con un clúster interactivo existente', 'Job de Azure Databricks, con la opción Serverless', 'Python con un instance pool', 'Un mapping data flow'], answer: 1, explanation: 'La actividad Job ejecuta un job existente por jobId y corre automáticamente en serverless, sin definir clúster en el linked service.' },
        { domain: 'Monitor and optimize an analytics solution', question: 'Creaste un schedule trigger, lo guardaste y no aparece ningún run. ¿Cuál es la causa más probable?', options: ['No pulsaste Publish all', 'El pipeline sigue en modo Debug', 'El Azure IR está detenido', 'Los schedule triggers requieren una ventana'], answer: 0, explanation: 'El trigger entra en efecto solo después de publicar la solución, no al guardarlo en la interfaz.' },
        { domain: 'Monitor and optimize an analytics solution', question: 'Un pipeline de cinco actividades falló en la cuarta y las tres primeras son caras. ¿Cómo lo retomas sin repetirlas?', options: ['Rerun desde el inicio', 'Debug con los mismos parámetros', 'Rerun from failed activity', 'Rerun con New parameters'], answer: 2, explanation: 'Rerun from failed activity reinicia desde la actividad que falló, se canceló o agotó el tiempo; New parameters crea un run nuevo.' },
        { domain: 'Ingest and transform data', question: 'Para cada región debes recorrer una lista de tablas. ¿Cómo implementas ese bucle dentro de otro bucle?', options: ['Un ForEach dentro de otro ForEach', 'Subir batchCount a 100', 'Un Until que contenga un ForEach', 'Un ForEach que llama con Execute Pipeline a un pipeline hijo con el bucle interno'], answer: 3, explanation: 'ForEach no admite otro ForEach dentro ni dentro de Until, y batchCount tiene un máximo de 50; el patrón es un pipeline de dos niveles.' },
        { domain: 'Working with Lakeflow Jobs', question: 'Todo el proceso vive en Databricks y no hay copias desde otros sistemas. ¿Qué recomienda Databricks para orquestar los notebooks?', options: ['Lakeflow Jobs', 'Un pipeline de ADF con un job cluster por notebook', 'dbutils.notebook.run en un bucle', 'Encadenar notebooks con %run'], answer: 0, explanation: 'Databricks recomienda Lakeflow Jobs para orquestar notebooks; dbutils.notebook.run queda para casos que Jobs no cubre y ADF suma otra herramienta.' },
        { domain: 'Implement and manage an analytics solution', question: 'Pulsas Debug en un pipeline cuyo Copy apunta a la carpeta de producción. ¿Qué ocurre?', options: ['Solo se valida el JSON', 'El pipeline se ejecuta de verdad sin publicarse, así que copia datos a producción', 'ADF publica primero y luego ejecuta', 'Se simula la copia sin mover datos'], answer: 1, explanation: 'Debug ejecuta el pipeline real con el borrador actual; por eso la documentación recomienda carpetas de prueba durante el debug.' },
        { type: 'hotspot', domain: 'Implement and manage an analytics solution', screen: 's08-manage', answer: 'azureDatabricks', question: 'Abriste New linked service en la pestaña Compute. ¿Dónde haces clic para conectar un workspace de Databricks?', explanation: 'En Manage → Linked services → + New eliges Compute → Azure Databricks y luego Continue para configurar el workspace y el clúster.' },
        { type: 'hotspot', domain: 'Working with Lakeflow Jobs', screen: 's08-author', answer: 'notebook', question: 'Expandiste Databricks en el panel Activities. ¿Qué arrastras al lienzo para ejecutar un notebook con base parameters?', explanation: 'La actividad Notebook del grupo Databricks ejecuta un notebook del workspace y acepta baseParameters en su pestaña Settings.' },
        { type: 'hotspot', domain: 'Implement and manage an analytics solution', screen: 's08-author', answer: 'debug', question: '¿Dónde pruebas el pipeline con tus cambios sin publicarlos todavía?', explanation: 'Debug ejecuta el borrador del pipeline sin publicarlo y muestra el resultado de cada actividad en la pestaña Output.' },
        { type: 'hotspot', domain: 'Implement and manage an analytics solution', screen: 's08-trigger', answer: 'tumbling', question: 'Debes reprocesar ventanas de tiempo pasadas sin huecos. ¿Qué tipo de trigger eliges?', explanation: 'Tumbling window permite backfill de ventanas pasadas, reintentos y concurrencia; Schedule solo ejecuta desde ahora en adelante.' },
        { type: 'hotspot', domain: 'Monitor and optimize an analytics solution', screen: 's08-monitor', answer: 'rerunFailed', question: 'Un run falló en su última actividad. ¿Dónde lo retomas desde ese punto?', explanation: 'Rerun from failed activity vuelve a ejecutar desde la actividad que falló, sin repetir las que terminaron bien.' },
      ],
    },
  };
})(globalThis);
