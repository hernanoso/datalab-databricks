// Contenido y preguntas originales; fuentes oficiales de la investigación del padre.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${DOCS}/${path}` });
  const kafka = { label: 'Event Hubs para Apache Kafka: capacidades y niveles', url: 'https://learn.microsoft.com/en-us/azure/event-hubs/azure-event-hubs-apache-kafka-overview' };
  const hubs = { label: 'Event Hubs: particiones y consumidores', url: 'https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-features' };
  const streaming = source('Structured Streaming', 'structured-streaming/');
  const checkpoints = source('Checkpoints de Structured Streaming', 'structured-streaming/checkpoints');
  const watermarks = source('Watermarks y procesamiento con estado', 'structured-streaming/watermarks');
  const serverless = source('Límites de streaming en serverless', 'compute/serverless/limitations#streaming-limitations');
  const pipelines = source('Event Hubs como origen Kafka en pipelines', 'ldp/event-hubs');
  const free = source('Límites de Free Edition', 'getting-started/free-edition-limitations');
  const notebooks = source('Ejecutar celdas de un notebook', 'notebooks/run-notebook');
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.es.s12 = {
    deepDive: [
      {
        title: 'Event Hubs es el registro de entrada, no el motor de transformación',
        body: [
          'Un namespace contiene event hubs; cada event hub distribuye eventos entre particiones. Productores publican eventos y consumidores los leen desde posiciones del registro retenido. Esta separación permite desacoplar recepción y procesamiento: que el broker haya recibido un evento no significa que una tabla Delta ya lo contenga.',
          'Las particiones permiten paralelismo y mantienen orden dentro de cada partición, no un orden global entre todas. Una clave de partición ayuda a mantener relacionados los eventos que deben compartir orden. Elige la estrategia según el negocio: repartir carga y preservar orden son objetivos que debes equilibrar.',
        ], source: hubs,
      },
      {
        title: 'Consumidores independientes y offsets por partición',
        body: [
          'Los consumer groups ofrecen vistas independientes del mismo flujo: una aplicación de monitoreo y otra de archivo pueden progresar por separado sin quitarle eventos a la otra. Las posiciones de lectura pertenecen al consumidor y a cada partición; no interpretes un offset como contador global de eventos del namespace.',
          'El laboratorio reduce este modelo a una sola partición, entregas ordenadas y last_offset en memoria. Aceptar solo valores mayores sirve en ese modelo, pero no resuelve llegadas desordenadas, múltiples particiones ni deduplicación por clave de negocio. En producción necesitas posiciones por partición y recuperación persistente compatible con el motor.',
        ], source: hubs,
      },
      {
        title: 'Ruta Kafka documentada, sin JAR EventHubs heredado',
        body: [
          'Event Hubs expone un endpoint compatible con Kafka; un event hub se consume como un topic. Kafka requiere un nivel Standard, Premium o Dedicated, no Basic. La compatibilidad de protocolo no convierte toda función o configuración de un clúster Kafka en una capacidad idéntica de Event Hubs.',
          'La documentación de Lakeflow Spark Declarative Pipelines describe Event Hubs mediante el origen Kafka. No necesitas imponer el antiguo conector EventHubs con JAR personalizado como requisito del aprendizaje serverless. Antes de una conexión real verifica nivel, permisos de lectura, autenticación aprobada y conectividad de salida; el laboratorio no la realiza.',
        ], source: pipelines,
      },
      {
        title: 'Micro-batches, triggers y el límite serverless',
        body: [
          'Structured Streaming expresa transformaciones sobre una tabla de entrada no acotada y normalmente avanza en micro-batches. Cada ejecución procesa un rango de entrada; el trigger determina cuándo se ejecuta trabajo, no la hora de negocio de cada evento. Procesar un lote disponible no equivale a mantener un servicio siempre activo.',
          'En notebooks y jobs serverless se admite AvailableNow; no se admite processingTime ni el trigger predeterminado de ejecución continua de micro-batches. Los pipelines tienen su propio modelo de ejecución documentado: no extrapoles la restricción del notebook a todo producto. Free Edition no promete conectividad ni capacidad para una carga Azure permanente.',
        ], source: serverless,
      },
      {
        title: 'event_time no es el timestamp del broker',
        body: [
          'El tiempo del evento representa cuándo ocurrió el hecho de negocio, según el campo elegido del mensaje. El timestamp del registro Kafka o de recepción del broker describe otra etapa. Si calculas ventas por ventana, parsea explícitamente event_time, define zona horaria y contempla eventos atrasados; no sustituyas silenciosamente ese campo por la hora de llegada.',
          'Una ventana de cinco minutos [10:00, 10:05) incluye 10:01 y 10:03, pero no 10:05. En este ejercicio 10:06 pertenece a [10:05, 10:10). Las ventanas se calculan en UTC y no se cierran por esperar cinco minutos en el reloj: el código es una agrupación didáctica, sin watermark ni estado de Spark.',
        ], source: watermarks,
      },
      {
        title: 'Watermark: progreso observado, no temporizador de espera',
        body: [
          'Un watermark deriva del progreso observado del tiempo de evento y del umbral de retraso configurado. Permite acotar estado y razonar sobre datos atrasados en operaciones compatibles. No es una orden de dormir diez minutos ni avanza necesariamente porque transcurra tiempo de pared cuando no llegan eventos nuevos.',
          'La aceptación de eventos atrasados y la emisión de resultados dependen de la operación y del modo de salida. Append no significa que cualquier agregación pueda emitir inmediatamente un resultado final; una ventana con watermark debe cumplir las condiciones de finalización. La simulación no descarta eventos por retraso ni demuestra estas garantías.',
        ], source: watermarks,
      },
      {
        title: 'Checkpoint y sink determinan la recuperación real',
        body: [
          'Un checkpoint de Structured Streaming conserva progreso y, cuando corresponde, estado para recuperar una consulta. No es solo una variable con el último número: su ubicación debe ser persistente y propia de la consulta. Cambiar origen, estado o configuración al reutilizarlo puede tener restricciones; revisa compatibilidad antes de reiniciar.',
          'Las garantías de extremo a extremo dependen de un origen reproducible y del comportamiento del sink. No prometas exactamente una vez para cualquier destino: por ejemplo, un efecto externo repetido necesita un diseño idempotente adecuado. En el laboratorio last_offset y resultados solo viven en memoria; al perder la sesión no queda un checkpoint durable.',
        ], source: checkpoints,
      },
      {
        title: 'Free Edition: aprendizaje local antes de conectividad externa',
        body: [
          'Free Edition utiliza serverless y tiene cuotas y restricciones de salida. Tener un notebook gratuito no demuestra que puedas alcanzar un namespace Event Hubs concreto. El ejercicio obligatorio usa solo Python estándar y datos sintéticos: no aprovisiona Azure, no solicita credenciales, no instala librerías y no escribe datos persistentes.',
          'La extensión Azure es opcional y solo conceptual: revisa los requisitos ya documentados, sin abrir una ruta de portal no verificada ni ejecutar llamadas externas. Separar este mapa de arquitectura de la simulación permite aprender offsets y ventanas sin presentar una lista de Python como un stream Spark o una integración validada.',
        ], source: free,
      },
    ],
    diagram: {
      title: 'Arquitectura real y frontera de la simulación',
      caption: 'Arquitectura conceptual basada en Event Hubs, Kafka, pipelines y checkpoints citados. El laboratorio solo simula lectura y agregación en memoria; no se conecta a los servicios ni despliega esta arquitectura.',
      layers: [
        { label: 'Productores', nodes: ['Eventos con event_time del negocio', 'Clave de partición y payload'] },
        { label: 'Event Hubs', nodes: ['Namespace → event hub', 'Particiones: orden local, no global', 'Endpoint Kafka en nivel compatible'] },
        { label: 'Lectores independientes', nodes: ['Aplicación de monitoreo', 'Pipeline Kafka → transformaciones', 'Offsets por partición y por lector'] },
        { label: 'Estado y salida reales', nodes: ['Checkpoint persistente de la consulta', 'Ventanas y watermark según operación', 'Sink Delta u otro: garantías por verificar'] },
        { label: 'Solo laboratorio', nodes: ['Listas batch1 y batch2, una partición', 'last_offset y acumulados en memoria', 'Sin stream Spark, Azure ni checkpoint durable'] },
      ],
    },
    comparison: {
      title: 'No confundas estas piezas del flujo',
      headers: ['Pieza', 'Función', 'No garantiza', 'En el laboratorio'],
      rows: [
        ['Partición', 'Orden local y paralelismo de lectura', 'Orden global de todos los eventos', 'Una partición y entregas ordenadas'],
        ['Consumer group / lector', 'Progreso independiente para cada aplicación', 'Una sola posición global para todo el namespace', 'Un único lector simplificado'],
        ['Trigger AvailableNow', 'Procesar la entrada disponible y terminar', 'Un servicio permanente o latencia fija', 'Dos llamadas explícitas a process'],
        ['event_time / ventana', 'Agrupar según la hora del negocio', 'Que hora de llegada y de negocio coincidan', 'Buckets UTC de cinco minutos'],
        ['Watermark', 'Acotar estado según progreso de event_time', 'Esperar exactamente un tiempo de pared', 'Solo concepto; no implementado'],
        ['Checkpoint y sink', 'Recuperación y semántica de escritura compatibles', 'Exactamente una vez para cualquier destino', 'Memoria volátil, sin recuperación durable'],
      ],
      sources: [hubs, kafka, serverless, watermarks, checkpoints],
    },
    lab: {
      title: 'SIMULACIÓN DE PROCESAMIENTO DE FLUJOS en Python: offsets y ventanas',
      goal: 'Resolver en Free Edition una simulación determinista de una partición: aceptar offsets crecientes, evitar recontar un replay y agrupar eventos por ventanas de cinco minutos. No es un stream Spark activo ni una conexión a Event Hubs.',
      minutes: 45,
      requirements: [
        'Un notebook Python con serverless en Databricks Free Edition, sujeto a su cuota. También puedes ejecutar el mismo código con Python 3 estándar fuera de Databricks.',
        'No requiere suscripción Azure, credenciales, librerías externas, red ni tablas. Usa una sesión nueva y ejecuta los bloques Python en el orden indicado.',
        'Modelo simplificado: una sola partición con offsets entregados en orden creciente, salvo replays. No prueba recuperación real, procesamiento distribuido ni watermark.',
      ],
      steps: [
        {
          title: 'Prepara un notebook Python y distingue la maqueta',
          body: 'Abre un notebook con lenguaje Python y cómputo Serverless. La maqueta reutiliza las etiquetas verificadas del notebook; Run all ejecuta todas las celdas en orden cuando hayas copiado los bloques. Las otras ilustraciones de lotes y ventanas son controles educativos, no menús reales de Databricks. No ejecutes el ejemplo Azure del contenido base para este laboratorio.',
          check: 'El notebook está en Python; comprendes que este laboratorio no inicia spark.readStream ni requiere secretos.',
          screen: { id: 's12-notebook', highlight: ['language', 'compute', 'runAll'] },
        },
        {
          title: 'Define dos lotes con un evento repetido',
          body: 'Cada tupla contiene offset, identificador, event_time UTC y monto entero. batch2 repite el offset 1 y agrega el 2. La fecha fija y los enteros evitan depender del reloj o del redondeo monetario. El campo event_time es de negocio, no un timestamp de recepción de Kafka.',
          code: { language: 'python', code: `from datetime import datetime

batch1 = [
    (0, "A", "2026-01-05T10:01:00+00:00", 10),
    (1, "B", "2026-01-05T10:03:00+00:00", 20),
]
batch2 = [batch1[1], (2, "C", "2026-01-05T10:06:00+00:00", 5)]
last_offset = -1
accepted = []
` },
          check: 'batch1 contiene offsets [0, 1] y batch2 contiene [1, 2]; todavía no hay eventos aceptados.',
          screen: { id: 's12-batches', highlight: ['batch1', 'batch2'] },
        },
        {
          title: 'Implementa el lector de una sola partición y las ventanas',
          body: 'Acepta solo offsets mayores que last_offset y calcula el inicio del bucket truncando minutos a múltiplos de cinco. Este filtro presupone entregas ordenadas de una sola partición: si llegara 2 antes que 1, perdería 1. No lo reutilices como deduplicación general ni como checkpoint de producción. Todas las funciones mantienen estado solo en memoria.',
          code: { language: 'python', code: `def process(batch):
    global last_offset
    added = 0
    for offset, event_id, event_time, amount in batch:
        if offset <= last_offset:
            continue
        accepted.append((offset, event_id, event_time, amount))
        last_offset = offset
        added += 1
    return added

def summary():
    return len(accepted), sum(row[3] for row in accepted)

def windows():
    buckets = {}
    for _, _, event_time, amount in accepted:
        t = datetime.fromisoformat(event_time)
        start = t.replace(minute=(t.minute // 5) * 5, second=0, microsecond=0)
        key = start.strftime("%H:%M")
        count, total = buckets.get(key, (0, 0))
        buckets[key] = (count + 1, total + amount)
    return sorted(buckets.items())
` },
          check: 'Las funciones no hacen llamadas externas ni escriben archivos. La clave HH:MM solo sirve para esta fecha fija; en producción conserva fecha y zona horaria completas.',
        },
        {
          title: 'Procesa batch1 y comprueba todos los acumulados',
          body: 'Ejecuta el primer lote. Las aserciones verifican cantidad aceptada, último offset, acumulado y bucket. Si una aserción falla, no avances: vuelve a una sesión limpia y ejecuta los bloques desde el inicio. El resultado es determinista y no depende de esperar tiempo de pared.',
          code: { language: 'python', code: `n1 = process(batch1)
assert (n1, last_offset, summary()) == (2, 1, (2, 30))
assert windows() == [("10:00", (2, 30))]
print(f"batch1 accepted={n1} last_offset={last_offset} count={summary()[0]} total={summary()[1]}")` },
          check: 'Salida exacta: batch1 accepted=2 last_offset=1 count=2 total=30',
        },
        {
          title: 'Procesa batch2 y separa las ventanas de negocio',
          body: 'El replay de B no se vuelve a contar porque su offset 1 ya fue aceptado. C agrega cinco unidades al bucket 10:05. La ilustración representa ventanas semiabiertas: el extremo derecho no pertenece a la ventana. No hay watermark ni política de eventos atrasados en este código.',
          code: { language: 'python', code: `n2 = process(batch2)
assert (n2, last_offset, summary()) == (1, 2, (3, 35))
assert windows() == [("10:00", (2, 30)), ("10:05", (1, 5))]
print(f"batch2 accepted={n2} last_offset={last_offset} count={summary()[0]} total={summary()[1]}")
for start, (count, total) in windows():
    print(f"window={start} count={count} total={total}")` },
          check: 'Tres líneas: batch2 accepted=1 last_offset=2 count=3 total=35; window=10:00 count=2 total=30; window=10:05 count=1 total=5.',
          screen: { id: 's12-windows', highlight: ['first', 'second', 'businessTime'] },
        },
        {
          title: 'Repite batch2 y verifica que nada cambia',
          body: 'Guarda el estado visible antes del replay y comprueba que ni eventos aceptados, ni contador, ni monto, ni offset, ni ventanas cambian. Esto prueba idempotencia de esta función dentro de la misma sesión, no una garantía universal exactamente una vez para un sink externo.',
          code: { language: 'python', code: `before = (list(accepted), last_offset, summary(), windows())
n_replay = process(batch2)
assert n_replay == 0
assert (list(accepted), last_offset, summary(), windows()) == before
print(f"replay accepted={n_replay} last_offset={last_offset} count={summary()[0]} total={summary()[1]}")` },
          check: 'Salida exacta: replay accepted=0 last_offset=2 count=3 total=35. Todo el estado sigue igual.',
          screen: { id: 's12-batches', highlight: ['replay', 'lastOffset'] },
        },
        {
          title: 'Explica la recuperación que NO implementaste',
          body: 'Revisa las aserciones sin reiniciar ni borrar nada. last_offset y accepted desaparecen al perder la sesión: no escribiste un checkpoint durable ni un sink transaccional. Una aplicación real debe recuperar posiciones por partición y estado de manera compatible con el destino. En esta simulación las ventanas se recalculan sobre todos los eventos aceptados.',
          check: 'Puedes explicar por qué un replay es inocuo aquí, pero perder memoria impide continuar desde el progreso previo. No se requiere limpieza: no hay datos persistentes.',
        },
        {
          title: 'Extensión opcional de solo lectura: planifica la ruta Kafka',
          body: 'Sin aprovisionar ni conectar nada, consulta las fuentes Event Hubs para Kafka y Event Hubs en pipelines. Anota los requisitos: namespace y event hub existentes, nivel Standard/Premium/Dedicated (no Basic), identidad con lectura autorizada, autenticación aprobada y red de salida permitida. El diseño usa origen Kafka, no exige un JAR EventHubs heredado. Una suscripción Azure solo sería necesaria para realizar una integración real fuera de este ejercicio.',
          check: 'Tienes un mapa conceptual productor → Event Hubs → lector Kafka → checkpoint/sink. No hay llamadas externas, secretos, recursos Azure nuevos ni rutas de portal inventadas.',
        },
      ],
      wrapUp: 'La simulación produjo 2 eventos y 30 tras batch1, luego 3 y 35 tras batch2. Las ventanas fueron 10:00 → 2/30 y 10:05 → 1/5; repetir batch2 no cambió nada. El estado quedó solo en memoria: no probaste un stream Spark, un watermark ni recuperación durable. No necesitas eliminar datos persistentes porque no los creaste.',
      sources: [free, notebooks, hubs, kafka, pipelines, streaming, serverless, watermarks, checkpoints],
    },
    certification: {
      intro: 'Preguntas originales de práctica, no material oficial ni preguntas reales del examen. Alineadas con Data Ingestion and Loading y Data Transformation and Modeling de la guía de Data Engineer Associate del 4 de mayo de 2026. Los controles educativos no son rutas de producto.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Ingestion and Loading', 'Data Transformation and Modeling'] }],
      questions: [
        { domain: 'Data Ingestion and Loading', question: 'Dos aplicaciones deben leer los mismos eventos sin compartir progreso. ¿Qué concepto permite esa independencia?', options: ['Una única posición global', 'Consumer groups y posiciones independientes', 'Un watermark compartido', 'Ordenar todas las particiones por monto'], answer: 1, explanation: 'Los consumidores independientes mantienen su progreso; leer no elimina eventos para la otra aplicación. Fuente: Event Hubs, particiones y consumidores.' },
        { domain: 'Data Ingestion and Loading', question: '¿Dónde garantiza orden el registro particionado de Event Hubs?', options: ['En todo el namespace', 'Entre todos los event hubs', 'Dentro de cada partición', 'Solo en las tablas agregadas'], answer: 2, explanation: 'El orden es por partición, no global. Fuente: Event Hubs, particiones y consumidores; no confundas paralelismo con secuencia global.' },
        { domain: 'Data Ingestion and Loading', question: 'El plan propone Event Hubs Basic con un lector Kafka. ¿Qué corriges primero?', options: ['Verificar un nivel Standard, Premium o Dedicated', 'Agregar un watermark para habilitar Kafka', 'Cambiar event_time por amount', 'Usar una lista de Python como credencial'], answer: 0, explanation: 'La compatibilidad Kafka requiere Standard, Premium o Dedicated, no Basic. Fuente: Event Hubs para Apache Kafka, capacidades y niveles.' },
        { domain: 'Data Ingestion and Loading', question: '¿Qué trigger eliges para procesar la entrada disponible y terminar en un notebook serverless compatible?', options: ['processingTime de 10 segundos', 'El predeterminado siempre activo', 'Un temporizador Python como stream real', 'AvailableNow'], answer: 3, explanation: 'AvailableNow está admitido; processingTime y el predeterminado no lo están en notebooks/jobs serverless. Fuente: límites de streaming en serverless.' },
        { domain: 'Data Transformation and Modeling', question: 'Un pedido ocurrió a las 10:01 y llegó al broker a las 10:08. ¿Qué campo usas para ventas por hora del negocio?', options: ['La hora de ejecución del notebook', 'El event_time de negocio validado', 'Siempre el timestamp del broker', 'El offset convertido en timestamp'], answer: 1, explanation: 'La agrupación por hora del hecho requiere event_time, no sustituirlo por recepción. Fuente: watermarks y procesamiento con estado.' },
        { domain: 'Data Transformation and Modeling', question: '¿A qué ventana UTC semiabierta de cinco minutos pertenece 10:05 exactamente?', options: ['[10:00, 10:05)', 'A ambas ventanas', '[10:05, 10:10)', 'A ninguna hasta esperar cinco minutos'], answer: 2, explanation: 'El extremo izquierdo está incluido y el derecho excluido. Fuente: modelo de ventanas citado; la simulación trunca minutos a múltiplos de cinco.' },
        { domain: 'Data Transformation and Modeling', question: 'No llegan eventos nuevos durante diez minutos. ¿Qué puedes afirmar de un watermark?', options: ['No necesariamente avanza solo por tiempo de pared', 'Cierra siempre toda ventana en diez minutos', 'Duplica automáticamente el estado', 'Cambia todos los offsets a cero'], answer: 0, explanation: 'El watermark sigue progreso observado del tiempo de evento, no un temporizador de pared. Fuente: watermarks y procesamiento con estado.' },
        { domain: 'Data Ingestion and Loading', question: '¿Qué afirmación prudente describe la recuperación de una consulta real?', options: ['Una variable en memoria basta siempre', 'Todo sink ofrece exactamente una vez', 'El checkpoint guarda credenciales y las publica', 'Origen, checkpoint persistente y sink determinan las garantías'], answer: 3, explanation: 'La garantía depende de capacidades compatibles de origen y destino y de estado recuperable. Fuente: checkpoints de Structured Streaming.' },
        { domain: 'Data Ingestion and Loading', question: 'Tras los dos lotes del laboratorio se repite batch2. ¿Qué ocurre en la misma sesión?', options: ['Se aceptan dos eventos y totaliza 60', 'Se aceptan cero y conserva count=3 total=35', 'Se elimina C y vuelve a 30', 'Se crea un checkpoint durable'], answer: 1, explanation: 'Los offsets 1 y 2 no superan last_offset=2. Las aserciones del laboratorio prueban que todo el estado visible permanece igual.' },
        { domain: 'Data Ingestion and Loading', question: '¿Qué limita la regla offset > last_offset del laboratorio?', options: ['No admite montos enteros', 'Exige un JAR personalizado', 'Solo modela una partición con entregas ordenadas y memoria volátil', 'Impone un watermark de cinco minutos'], answer: 2, explanation: 'Es un modelo simplificado, no una implementación de offsets por partición ni de recuperación durable. Fuentes: Event Hubs y checkpoints.' },
        { domain: 'Data Ingestion and Loading', question: '¿Qué ruta documentada puedes estudiar para leer Event Hubs en Lakeflow pipelines?', options: ['El origen Kafka con requisitos de acceso verificados', 'Un JAR EventHubs obligatorio en Free Edition', 'El navegador sin autenticación', 'Una conexión garantizada desde cualquier cuenta gratuita'], answer: 0, explanation: 'La documentación de Event Hubs en pipelines usa el origen Kafka. Free Edition restringe salida y cuotas; estudiar el diseño no valida una conexión.' },
        { domain: 'Data Transformation and Modeling', question: '¿Qué demuestra ejecutar correctamente este laboratorio?', options: ['Una integración Azure de extremo a extremo', 'Un watermark Spark de producción', 'Recuperación durable después de perder memoria', 'La aritmética de offsets y ventanas de la simulación'], answer: 3, explanation: 'Solo demuestra el modelo local con resultados 30 y 35 y replay sin cambios. No ejecuta Spark Streaming, red ni almacenamiento persistente.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's12-notebook', answer: 'runAll', question: 'Copiaste todos los bloques en orden. ¿Qué etiqueta verificada del notebook ejecuta todas las celdas?', explanation: 'Run all ejecuta el notebook; aquí ejecuta Python estándar, no inicia un stream Spark. Fuente: ejecutar celdas de un notebook.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's12-batches', answer: 'lastOffset', question: 'En la ilustración educativa, ¿dónde inspeccionas el progreso volátil que NO es un checkpoint durable?', explanation: 'last_offset=2 vive solo en memoria. Es un control educativo propio, no una ruta de Databricks. Fuentes: laboratorio y checkpoints.' },
        { type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's12-windows', answer: 'second', question: 'En la ilustración educativa, ¿qué ventana contiene C con event_time 10:06 y amount 5?', explanation: 'C cae en [10:05, 10:10), con count=1 total=5. Es una ilustración del resultado de las aserciones, no una pantalla de Spark.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's12-batches', answer: 'replay', question: '¿Qué control educativo representa la prueba de que repetir batch2 no cambia los acumulados?', explanation: 'Repetir batch2 acepta cero eventos y mantiene count=3 total=35. El control es didáctico; no opera una consulta real ni promete recuperación durable.' },
      ],
    },
  };
})(globalThis);
