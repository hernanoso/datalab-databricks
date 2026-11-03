// Contenido original; investigación oficial y rutas verificadas aportadas por el agente principal.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const DOC = 'https://docs.databricks.com/aws/en/';
  const playground = { label: 'Explorar modelos en AI Playground', url: DOC + 'getting-started/gen-ai-llm-agent' };
  const functions = { label: 'AI Functions y ai_query', url: DOC + 'large-language-models/ai-functions' };
  const free = { label: 'Limitaciones de Free Edition', url: DOC + 'getting-started/free-edition-limitations' };
  const guide = { label: 'Guía de Generative AI Engineer Associate, marzo de 2026', url: 'https://www.databricks.com/sites/default/files/2026-03/Databricks-Certified-Generative-AI-Engineer-Associate-Exam-Guide-Mar26.pdf' };
  DataLab.deep.es.s15 = {
    deepDive: [
      { title: 'Los tokens y el contexto son un presupuesto finito', body: ['Una aplicación generativa entrega instrucciones, la entrada del usuario y, a veces, evidencia recuperada a un modelo. Los tokens son las unidades de representación del texto, no una cantidad fija de caracteres o palabras. El presupuesto de contexto debe contemplar el prompt y la respuesta generada; más historial o fragmentos recuperados dejan menos espacio para lo demás. Diseña con evidencia relevante en lugar de asumir que caben documentos ilimitados en una petición.'], source: guide },
      { title: 'El prompt es un contrato, no un mecanismo de cumplimiento', body: ['Separa las instrucciones de la tarea, el texto de entrada y el esquema de salida deseado. Para clasificar, especifica las etiquetas permitidas y qué hacer cuando falta un campo. Pedir JSON no demuestra que sea válido ni que sus valores sean correctos: analiza la respuesta, comprueba claves y tipos exactos y rechaza salidas inválidas antes de usarlas. El texto del usuario es un dato, no una autoridad que pueda anular el contrato de la aplicación.'], source: guide },
      { title: 'Los parámetros de generación no certifican la verdad', body: ['La temperatura modifica el comportamiento del muestreo. Un valor bajo puede reducir la variación, pero no garantiza determinismo, exactitud factual ni seguridad. Compara prompts y configuraciones con un conjunto de datos y criterios de aceptación definidos. La muestra determinista de Python de este laboratorio omite la generación por completo; su repetibilidad no demuestra nada sobre un modelo real a ninguna temperatura.'], source: playground },
      { title: 'RAG incorpora evidencia a la petición', body: ['La generación aumentada por recuperación busca material relevante y lo incluye como contexto antes de generar. Importan la calidad de recuperación, los permisos, la vigencia y la selección del contexto. El ajuste fino adapta el comportamiento mediante entrenamiento en lugar de recuperar evidencia en cada petición. Ninguna técnica elimina las alucinaciones; valida el respaldo en fuentes y la calidad de la tarea sin tratar sus nombres como garantías de exactitud.'], source: guide },
      { title: 'Playground es una superficie de exploración', body: ['La ruta documentada es AI/ML → Playground. El selector de modelo permite elegir un modelo, + agrega otro panel de comparación y Sync sincroniza las entradas para comparar. Estos controles no validan una respuesta de negocio. Nuestras maquetas originales simplificadas solo identifican controles: no seleccionan un modelo real ni requieren enviar un prompt. La exploración real corresponde únicamente a un entorno autorizado tras revisar acceso y costos.'], source: playground },
      { title: 'AI Functions no resuelve la misma tarea que Genie', body: ['AI Functions, incluido ai_query, puede aplicar inferencia de modelos a texto dentro de flujos de datos. Genie responde preguntas en lenguaje natural sobre datos estructurados mediante SQL; no es otro nombre para clasificar texto arbitrario. Una búsqueda local en un diccionario no es ninguno de esos flujos: ilustra un contrato de esquema sin invocar una AI Function, Genie ni un endpoint.'], source: functions },
      { title: 'La inferencia real tiene su propio límite de acceso y costo', body: ['Antes de una inferencia real opcional, verifica modelo, región, autenticación, permisos y cuotas. Los cargos de inferencia del modelo son independientes de los cargos de cómputo. Un LIMIT sobre las filas devueltas no es un tope estricto de llamadas ni de costo de inferencia; la ejecución puede evaluar más trabajo que el mostrado al final. Materializar una entrada pequeña aprobada antes de inferir ayuda a delimitarla, pero no sustituye revisar precios, reintentos y ejecución.'], source: functions },
      { title: 'Evaluar requiere casos representativos no vistos', body: ['Mide la validez de formato por separado de la calidad de la tarea, el respaldo en fuentes, la latencia y el costo. Las tres muestras conocidas siguientes producen una concordancia de 3/3 por construcción; no son una evaluación de modelo con datos reservados ni demuestran resistencia a las alucinaciones. Una evaluación real necesita casos representativos, resultados esperados, un método de puntuación definido y análisis de fallos antes del despliegue.'], source: guide },
      { title: 'Nombra con precisión la disponibilidad y las credenciales', body: ['Free Edition tiene restricciones y cuotas, no una prohibición universal de todas las funciones generativas ni una promesa de disponibilidad de cada modelo. El laboratorio obligatorio usa solo la biblioteca estándar de Python, sin cuenta, endpoint ni red. Generative AI Fundamentals es una acreditación; Databricks Certified Generative AI Engineer Associate es una certificación distinta con su propia guía de examen y preparación.'], source: free },
    ],
    diagram: {
      title: 'Separa la aplicación real de la simulación didáctica determinista',
      caption: 'Diseño conceptual basado en la guía oficial y la documentación de AI Functions. Solo se ejecuta la ruta muestra → validación → concordancia; no hay invocación de modelos.',
      layers: [
        { label: 'Contrato de aplicación', nodes: ['Tarea, esquema permitido y límite de entrada', 'Presupuesto de tokens y contexto'] },
        { label: 'Aplicación real opcional', nodes: ['Recuperación autorizada → prompt → modelo', 'Modelo/región/acceso/cuota y cargos de inferencia'] },
        { label: 'Simulación local obligatoria', nodes: ['Tres textos fijos → diccionario → JSON', 'Sin modelo, endpoint, credenciales ni red'] },
        { label: 'Validación y evidencia', nodes: ['Analizar claves exactas, tipos y enumeración de urgencia', 'Concordancia de muestras ≠ calidad del modelo; repetición ≠ resistencia a alucinaciones'] },
      ],
    },
    comparison: {
      title: 'Elige un mecanismo sin confundir sus garantías',
      headers: ['Mecanismo', 'Propósito', 'Evidencia que debes obtener', 'Qué no garantiza'],
      rows: [
        ['Diseño del prompt', 'Especificar tarea, entrada y contrato de respuesta', 'Validez del esquema y resultados de la tarea', 'Las instrucciones no imponen JSON ni veracidad'],
        ['RAG', 'Recuperar evidencia relevante para el contexto', 'Relevancia, acceso y respaldo en fuentes', 'No elimina las alucinaciones'],
        ['Ajuste fino', 'Adaptar comportamiento mediante entrenamiento', 'Calidad con datos reservados y regresiones', 'No asegura conocimiento actualizado ni exactitud'],
        ['AI Functions / ai_query', 'Ejecutar inferencia en flujos de datos', 'Acceso al modelo, calidad, latencia y cargos de inferencia', 'LIMIT no es un tope estricto de costo de inferencia'],
        ['Simulación local con muestras', 'Practicar análisis y validación sin inferencia', 'Concordancia 3/3 y repetición idéntica', 'No demuestra evaluación de modelos ni resistencia a alucinaciones'],
      ],
      sources: [guide, playground, functions, free],
    },
    lab: {
      title: 'Simulación local: clasifica tres muestras y valida el contrato',
      goal: 'Ejecutar una simulación determinista con la biblioteca estándar de Python, rechazar esquemas inválidos, obtener concordancia 3/3 y repetir una salida idéntica; inspeccionar maquetas de Playground sin enviar un prompt.',
      minutes: 40,
      requirements: [
        'Python 3 con su biblioteca estándar, localmente o en un notebook Python ya disponible. No se requiere cuenta ni función de Free Edition; sus cuotas pueden afectar la exploración opcional de la interfaz.',
        'Sin instalaciones, peticiones de red, endpoints, claves, credenciales, inferencia ni creación de recursos de pago. Los únicos datos son los tres textos sintéticos fijos siguientes.',
        'Los textos de muestra y las claves JSON permanecen idénticos en español en ambas versiones para conservar la paridad exacta de ejemplos y stdout. Son entradas de prueba, no instrucciones sin traducir.',
      ],
      steps: [
        { title: 'Localiza la entrada de exploración en una maqueta', body: 'Identifica AI/ML → Playground en esta ilustración original simplificada. Es solo orientación; no abras una sesión real de inferencia ni envíes texto. El ejercicio obligatorio es la simulación local de Python que aparece abajo.', check: 'Identificas Playground sin autenticarte, aprovisionar recursos ni invocar un modelo.', screen: { id: 's15-entry', highlight: ['aiml', 'playground'] } },
        { title: 'Lee el contrato antes de ejecutar', body: 'Cada salida debe tener exactamente producto y urgencia. producto es una cadena o null; urgencia es una cadena entre alta, media, baja. Las tres muestras asignan pagos que no abre a pagos/alta, pagos lento a pagos/media y una sugerencia a null/baja. Una entrada desconocida se rechaza, no se adivina.', check: 'Distingues null de JSON de la cadena "null", y validez del esquema de clasificación correcta.' },
        { title: 'Ejecuta la simulación determinista completa', body: 'Ejecuta todo el bloque en un único proceso o celda Python nuevos. Solo usa búsqueda en diccionario, serialización JSON, análisis y validación explícita. Los controles negativos prueban claves adicionales y ausentes, tipos incorrectos y una enumeración inválida. Cada línea impresa lleva la etiqueta MOCK; ninguna es una respuesta de modelo.', code: { language: 'python', code: `import json

FIXTURES = (
    ("La app de pagos no abre", {"producto": "pagos", "urgencia": "alta"}),
    ("La app de pagos funciona lento", {"producto": "pagos", "urgencia": "media"}),
    ("Tengo una sugerencia", {"producto": None, "urgencia": "baja"}),
)

def validate(raw):
    value = json.loads(raw)
    if type(value) is not dict or set(value) != {"producto", "urgencia"}:
        raise ValueError("MOCK: invalid keys")
    if value["producto"] is not None and type(value["producto"]) is not str:
        raise ValueError("MOCK: invalid producto type")
    if type(value["urgencia"]) is not str or value["urgencia"] not in {"alta", "media", "baja"}:
        raise ValueError("MOCK: invalid urgencia")
    return value

def mock_response(text):
    for fixture, expected in FIXTURES:
        if text == fixture:
            return json.dumps(expected, ensure_ascii=False, sort_keys=True)
    raise ValueError("MOCK: unknown fixture")

def run_mock():
    lines = []
    agreement = 0
    for text, expected in FIXTURES:
        raw = mock_response(text)
        parsed = validate(raw)
        agreement += int(parsed == expected)
        lines.append("MOCK fixture: " + text + " => " + raw)
    lines.append("MOCK fixture agreement: " + str(agreement) + "/3 (not model evaluation)")
    return lines

invalid = (
    'not JSON',
    '[]',
    '{"producto": null}',
    '{"producto": null, "urgencia": "baja", "extra": 1}',
    '{"producto": 7, "urgencia": "alta"}',
    '{"producto": true, "urgencia": "alta"}',
    '{"producto": null, "urgencia": 1}',
    '{"producto": null, "urgencia": "critical"}',
)
rejected = 0
for raw in invalid:
    try:
        validate(raw)
    except (ValueError, TypeError):
        rejected += 1
    else:
        raise AssertionError("MOCK: invalid schema accepted")
try:
    mock_response("Unknown input")
except ValueError:
    pass
else:
    raise AssertionError("MOCK: unknown fixture accepted")
first = run_mock()
second = run_mock()
assert first == second, "MOCK: repeat changed"
assert rejected == 8, "MOCK: rejection count changed"
print(*first, sep="\\n")
print("MOCK schema rejection checks: 8/8")
print("MOCK repeat identical: yes (not hallucination resistance)")` }, check: 'Salida 0 y stderr vacío. Exactamente seis líneas en stdout: tres líneas MOCK fixture, MOCK fixture agreement: 3/3 (not model evaluation), MOCK schema rejection checks: 8/8 y MOCK repeat identical: yes (not hallucination resistance).' },
        { title: 'Explica la evidencia sin exagerarla', body: 'Inspecciona los valores analizados y la concordancia de 3/3. Los valores esperados también definen las respuestas del diccionario: es una demostración intencional del contrato, no una medición independiente de calidad. Repetir el bloque debe producir las mismas seis líneas. No ha probado un LLM, RAG, temperatura ni alucinaciones.', check: 'Las tres asignaciones exactas son pagos/alta, pagos/media y null/baja; todas las etiquetas dicen MOCK. Se rechazan esquemas inválidos y muestras desconocidas.' },
        { title: 'Identifica el selector sin elegir un endpoint real', body: 'Localiza el selector de modelo en la maqueta original. En un entorno real opcional autorizado, primero revisa disponibilidad, región, autenticación, permisos, cuotas y cargos de cómputo e inferencia. Las restricciones de Free Edition no son una prohibición universal ni una garantía de acceso. Omite la exploración real si no está disponible.', check: 'Identificas el selector en la ilustración; no necesitas endpoint, credenciales ni invocación facturable.', screen: { id: 's15-model', highlight: ['model'] } },
        { title: 'Identifica el control de comparación sin ejecutarla', body: 'En el flujo documentado de Playground, + agrega un panel de comparación de modelos. Inspecciona ese control solo en la maqueta. Para una evaluación real futura, define entradas representativas no vistas y resultados esperados antes de comparar candidatos; otro panel no convierte una respuesta en correcta.', check: 'Identificas + y describes un plan de evaluación futuro sin afirmar que mediste ningún modelo.', screen: { id: 's15-model', highlight: ['add'] } },
        { title: 'Identifica Sync sin exigir un envío', body: 'Sync sincroniza las entradas de los paneles de comparación en el flujo documentado. Identifícalo en la maqueta; este laboratorio no requiere un control Submit ni una llamada de inferencia. En un flujo futuro autorizado, sincronizar prompts tampoco controla toda la variabilidad, valida la verdad ni impone un techo de costo de inferencia.', check: 'Identificas Sync y terminas con cero llamadas de modelo, cero peticiones de red y sin claves ni endpoints en el código.', screen: { id: 's15-model', highlight: ['sync'] } },
        { title: 'Planea un flujo real solo sobre el papel', body: 'Describe minimización de datos aprobados, una entrada acotada materializada antes de inferencia opcional, un validador de esquema y puntuación con datos reservados. Explica que LIMIT sobre filas finales no limita estrictamente el costo de llamadas, y registra la inferencia por separado del cómputo. Es un diseño conceptual; no agregues ai_query ni llamadas a endpoints al ejercicio obligatorio.', check: 'Tu plan separa concordancia de muestras, validación del esquema y evaluación real de modelos, con revisión de acceso y costo antes de cualquier inferencia futura autorizada.' },
      ],
      wrapUp: 'La simulación local produce tres clasificaciones validadas, concordancia 3/3, ocho esquemas inválidos rechazados y una repetición idéntica. Toda la evidencia es de simulación. Localizaste Playground, el selector de modelo, + y Sync sin enviar un prompt, y separaste un contrato didáctico seguro de una evaluación real y de sus límites de acceso y costo.',
      sources: [playground, functions, free, guide],
    },
    certification: {
      intro: 'Práctica original, no preguntas reales de examen. Alineada con Design, Application Development y Evaluation de la guía de marzo de 2026 de Generative AI Engineer Associate. Generative AI Fundamentals es una acreditación, no esta certificación separada. Completar las muestras no demuestra preparación suficiente para certificarte.',
      exams: [{ name: 'Databricks Certified Generative AI Engineer Associate', url: guide.url, domains: ['Design', 'Application Development', 'Evaluation'] }],
      questions: [
        { domain: 'Design', question: '¿Qué debe contemplar un presupuesto de contexto?', options: ['Solo la pregunta del usuario', 'Instrucciones, evidencia, historial y espacio para la respuesta', 'Solo filas almacenadas', 'Documentos ilimitados'], answer: 1, explanation: 'El contexto es finito. Las instrucciones y la evidencia consumen tokens y la aplicación debe reservar espacio para responder.' },
        { domain: 'Application Development', question: 'El prompt pide JSON. ¿Qué debe hacer todavía la aplicación?', options: ['Confiar en cualquier cadena', 'Omitir controles de tipos', 'Analizar y validar claves exactas, tipos y etiquetas permitidas', 'Tratar la sintaxis JSON como prueba de verdad'], answer: 2, explanation: 'Pedir un formato no obliga a cumplirlo. Valida estructura y tipos por separado de la exactitud de los valores.' },
        { domain: 'Evaluation', question: '¿Qué demuestra el 3/3 del laboratorio obligatorio?', options: ['Concordancia con las tres muestras predefinidas de la simulación', 'Calidad de un LLM con datos reservados', 'Resistencia a las alucinaciones', 'Una evaluación de RAG desplegada'], answer: 0, explanation: 'El diccionario contiene las salidas esperadas. La concordancia por construcción no evalúa un modelo de forma independiente.' },
        { domain: 'Design', question: '¿Qué afirmación sobre temperatura baja está justificada?', options: ['Prueba exactitud factual', 'Garantiza salidas idénticas', 'Elimina las alucinaciones', 'Puede reducir variación sin garantizar exactitud ni determinismo'], answer: 3, explanation: 'Los parámetros de muestreo afectan la generación, pero no prueban exactitud, seguridad ni determinismo de un modelo real.' },
        { domain: 'Design', question: '¿En qué difieren RAG y ajuste fino?', options: ['Ambos garantizan verdad', 'RAG recupera evidencia en la petición; el ajuste fino adapta comportamiento mediante entrenamiento', 'RAG solo cambia colores de gráficos', 'El ajuste fino otorga acceso a todo documento'], answer: 1, explanation: 'La recuperación aporta contexto y el ajuste fino cambia comportamiento mediante entrenamiento. Ninguno elimina las alucinaciones.' },
        { domain: 'Application Development', question: '¿Qué tarea corresponde a AI Functions sobre texto arbitrario en lugar de Genie NL-a-SQL?', options: ['Cambiar colores de un dashboard', 'Otorgar SELECT a un grupo', 'Aplicar un modelo para clasificar filas de texto', 'Crear un SQL warehouse'], answer: 2, explanation: 'AI Functions puede aplicar inferencia a texto. Genie responde preguntas en lenguaje natural sobre datos estructurados mediante SQL.' },
        { domain: 'Design', question: '¿LIMIT 3 en la salida garantiza como máximo tres llamadas facturables al modelo?', options: ['No; delimita la entrada aprobada antes de inferir y revisa ejecución y precios', 'Sí, en todo plan de ejecución', 'Sí, porque el cómputo es gratis', 'Sí, con temperatura cero'], answer: 0, explanation: 'El límite de salida no impone un tope estricto de costo de inferencia. Los cargos de inferencia son independientes del cómputo.' },
        { domain: 'Application Development', question: '¿Qué respuesta incumple el esquema de la simulación?', options: ['{"producto": null, "urgencia": "baja"}', '{"producto": "pagos", "urgencia": "alta"}', '{"producto": "pagos", "urgencia": "media"}', '{"producto": null, "urgencia": "baja", "extra": 1}'], answer: 3, explanation: 'El contrato permite exactamente producto y urgencia. Una clave adicional se rechaza aunque los otros campos sean válidos.' },
        { domain: 'Evaluation', question: '¿Qué necesitas además de concordancia con muestras para evaluar un modelo real?', options: ['Solo el mismo diccionario otra vez', 'Casos representativos no vistos, métricas definidas y análisis de fallos', 'Una imagen del selector de modelo', 'Afirmar que RAG evita todos los errores'], answer: 1, explanation: 'Una evaluación útil mide la tarea con datos representativos no usados para fijar las respuestas y con puntuación explícita.' },
        { domain: 'Design', question: '¿Qué descripción de credenciales es correcta?', options: ['La acreditación Fundamentals y Engineer Associate son el mismo examen', 'La simulación otorga Engineer Associate', 'Fundamentals es una acreditación; Engineer Associate es una certificación distinta', 'El acceso a Free Edition otorga la certificación'], answer: 2, explanation: 'La acreditación Generative AI Fundamentals es distinta de la certificación Generative AI Engineer Associate y su guía de examen.' },
        { type: 'hotspot', domain: 'Application Development', screen: 's15-entry', answer: 'playground', question: 'Después de AI/ML, ¿a dónde lleva la ruta documentada de exploración?', explanation: 'AI/ML → Playground es la ruta verificada. Elegir este objetivo de la maqueta no abre un servicio ni envía un prompt.' },
        { type: 'hotspot', domain: 'Application Development', screen: 's15-model', answer: 'model', question: '¿Dónde seleccionarías un modelo en el flujo documentado de Playground?', explanation: 'El selector permite elegir modelo en el flujo real. Esta ilustración simplificada no conecta con ningún endpoint.' },
        { type: 'hotspot', domain: 'Evaluation', screen: 's15-model', answer: 'add', question: '¿Qué control agrega un panel de comparación?', explanation: 'El control + agrega otro panel para comparar modelos. Un clic en la maqueta no ejecuta evaluación ni inferencia.' },
        { type: 'hotspot', domain: 'Evaluation', screen: 's15-model', answer: 'sync', question: '¿Qué control sincroniza entradas entre paneles de comparación?', explanation: 'Sync sincroniza entradas para comparar; no valida respuestas ni garantiza generaciones deterministas o correctas.' },
      ],
    },
  };
})(globalThis);
