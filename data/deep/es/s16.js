// Contenido original; investigación oficial proporcionada por el coordinador.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const agent = { label: 'Crear un agente de IA generativa: herramientas y Playground', url: 'https://docs.databricks.com/aws/en/getting-started/gen-ai-llm-agent' };
  const free = { label: 'Limitaciones y cuotas de Free Edition', url: 'https://docs.databricks.com/aws/en/getting-started/free-edition-limitations' };
  const guide = { label: 'Guía de Generative AI Engineer Associate (marzo de 2026)', url: 'https://www.databricks.com/sites/default/files/2026-03/Databricks-Certified-Generative-AI-Engineer-Associate-Exam-Guide-Mar26.pdf' };
  DataLab.deep.es.s16 = {
    deepDive: [
      { title: 'Ciclo del agente: proponer no es ejecutar', body: ['El tutorial de agentes conecta un modelo con herramientas. El modelo puede proponer una llamada, pero la aplicación debe validar el nombre, los argumentos y la autorización antes de despacharla. El esquema de una herramienta declara una interfaz; no ejecuta la función ni otorga permisos. Nuestra simulación didáctica local hace explícitas estas fronteras sin afirmar que exista razonamiento autónomo genuino.'], source: agent },
      { title: 'Haz visible la frontera de ejecución', body: ['Separa solicitud, propuesta de llamada, resultado de herramienta y respuesta final. En un ciclo real, la aplicación devuelve el resultado al modelo, que puede responder o pedir otra herramienta. El ciclo necesita una política de parada. Aquí un stub fijo sustituye la inferencia, solo se permite una herramienta de datos ficticios y se comprueba el presupuesto antes de otra llamada al stub. Son decisiones educativas, no seguridad de producción.'], source: agent },
      { title: 'El acceso a datos es una decisión independiente', body: ['El tutorial ilustra herramientas para aplicaciones de agentes. En una aplicación real, valida identidad y permisos efectivos de cada operación y cliente antes de ejecutar. Nuestra lista permitida solo selecciona una función conocida de lectura; no es un sistema completo de autorización. C-42 es un identificador ficticio, no un registro privado, y no se utilizan bases de datos reales, credenciales ni red.'], source: agent },
      { title: 'Memoria, recuperación y estado autoritativo son distintos', body: ['Como distinción de diseño, la memoria conversacional aporta turnos anteriores, la recuperación aporta contexto externo seleccionado y el estado autoritativo registra hechos del negocio. No son intercambiables: un mensaje anterior del asistente no demuestra que ocurrió una compra. En este ejercicio, los datos ficticios inmutables son la fuente de los totales; no hay memoria persistente ni servicio de recuperación. No todos los agentes necesitan Apps o Lakebase.'], source: agent },
      { title: 'Ruta actual de interfaz, no requisito de despliegue', body: ['La ruta investigada del tutorial es Playground → Tools → + Add tool, con Tools enabled. La recomendación actual de exportación es Get code → Export to Databricks Apps; exportar a notebook es una ruta heredada, no la recomendación predeterminada que enseñamos. Las maquetas originales simplificadas solo identifican controles: no agregues herramientas reales, exportes aplicaciones, despliegues ni ejecutes Python arbitrario desde una definición de herramienta.'], source: agent },
      { title: 'Disponibilidad en Free Edition no significa capacidad ilimitada', body: ['Free Edition incluye Apps y Lakebase con cuotas y limitaciones documentadas; no los describas como categóricamente ausentes. Su disponibilidad tampoco significa que todo agente los necesite. El laboratorio obligatorio usa solo la biblioteca estándar de Python y puede ejecutarse localmente sin recursos de Databricks. La orientación opcional de interfaz necesita un workspace disponible, pero no crea recursos ni requiere suscripción de pago.'], source: free },
      { title: 'Una traza no garantiza auditoría universal', body: ['La guía de examen incluye Evaluation and Monitoring y Governance. Nuestra traza en memoria registra request, tool_call, tool_result y final en el caso exitoso programado. No es un registro de auditoría de plataforma, no es duradera y no garantiza auditar cada acción de la plataforma o aplicación. Un diseño de producción debe determinar por separado cobertura de trazas, cobertura de auditoría, acceso, retención y supresión de datos sensibles.'], source: guide },
      { title: 'Evalúa comportamiento, no redacción convincente', body: ['La guía publicada separa Application Development, Assembling and Deploying, Governance y Evaluation and Monitoring. Este ejercicio original practica esos temas mediante diseño de interfaces, reconocimiento de rutas de despliegue y comprobaciones explícitas de rechazo. No basta con obtener un total correcto: herramientas desconocidas, JSON malformado, argumentos inválidos y presupuestos agotados deben resolverse de forma predecible sin ejecutar herramientas no permitidas.'], source: guide },
    ],
    diagram: {
      title: 'Ciclo programado con una frontera controlada por la aplicación',
      caption: 'Diagrama conceptual basado en el tutorial de agentes; validación, datos ficticios y traza son decisiones didácticas originales. No demuestra inferencia real, despliegue ni autorización de producción.',
      layers: [
        { label: 'Entrada y stub del modelo', nodes: ['Solicitud sintética sobre C-42', 'Petición fija de herramienta y respuesta final fija'] },
        { label: 'Frontera de aplicación', nodes: ['Presupuesto → analizar JSON → nombre y argumentos', 'La autorización real corresponde aquí conceptualmente; no se implementa'] },
        { label: 'Herramienta de solo lectura', nodes: ['Solo sales_total en la lista permitida', 'Compras ficticias 10 + 25 → pedidos 2, total 35.0'] },
        { label: 'Observación y respuesta', nodes: ['El resultado vuelve al ciclo', 'Traza en memoria; no es auditoría de plataforma'] },
      ],
    },
    comparison: {
      title: 'Separa responsabilidades antes de elegir infraestructura',
      headers: ['Elemento', 'Propósito', 'Qué no demuestra'],
      rows: [
        ['Esquema de herramienta', 'Declarar nombre y forma de los argumentos', 'No ejecuta ni concede autorización'],
        ['Memoria conversacional', 'Conservar contexto de interacciones anteriores', 'No es el estado autoritativo de compras'],
        ['Recuperación', 'Aportar contexto externo seleccionado', 'No es automáticamente actual ni autoritativo'],
        ['Estado autoritativo', 'Registrar hechos del negocio en un sistema diseñado', 'No nace de una afirmación del modelo'],
        ['Traza de aplicación', 'Inspeccionar eventos seleccionados del ciclo', 'No cubre universalmente la auditoría de plataforma'],
        ['Apps / Lakebase', 'Opciones de infraestructura de aplicación / estado', 'No son obligatorios para todo agente; aplican cuotas en Free Edition'],
      ],
      sources: [agent, free, guide],
    },
    lab: {
      title: 'SCRIPTED AGENT LOOP SIMULATION — sin inferencia real',
      goal: 'Valida una herramienta ficticia de solo lectura permitida, inspecciona cuatro eventos de traza y prueba rechazos y límites usando solo la biblioteca estándar de Python. Es orquestación programada, no razonamiento autónomo genuino.',
      minutes: 45,
      requirements: [
        'Python 3 con biblioteca estándar, localmente o en un notebook Python existente. Sin paquetes, red, bases de datos, credenciales, datos privados, seguridad de producción ni escrituras persistentes.',
        'Usa solo los datos inventados de C-42. La lista permitida no es un sistema completo de autorización; la identidad y autorización real del cliente son solo conceptuales.',
        'La orientación opcional en Free Edition usa ilustraciones o un workspace disponible sin enviar nada. Nunca ejecutes herramientas Python arbitrarias, crees herramientas, exportes, despliegues ni cambies permisos.',
      ],
      steps: [
        { title: 'Ubica Playground sin enviar solicitudes', body: 'Usa la maqueta simplificada para identificar Playground. Si inspeccionas un workspace real de Free Edition, la navegación es opcional y depende de disponibilidad. No envíes un prompt: el experimento obligatorio ejecuta solo el código local programado.', check: 'Distingues Playground con modelo del stub local; no se envió ninguna solicitud de inferencia.', screen: { id: 's16-playground', highlight: ['playground'] } },
        { title: 'Lee la interfaz de herramienta, no código arbitrario', body: 'En la maqueta original sigue Tools → + Add tool. Nuestro contrato declarado es sales_total(customer_id: string), limitado a C-42. Declararlo no lo invoca. No crees una herramienta real ni pegues Python arbitrario en una herramienta de Databricks.', check: 'Identificas el control para agregar herramientas y explicas que validar y despachar sigue siendo responsabilidad de la aplicación.', screen: { id: 's16-tools', highlight: ['tools', 'addTool'] } },
        { title: 'Distingue herramientas habilitadas de permisos', body: 'Identifica Tools enabled solo en la ilustración. Habilitar una herramienta para un modelo no reemplaza la autorización para un cliente u operación. El laboratorio rechaza todos los clientes excepto el ficticio como restricción de entrada, no como prueba de acceso autenticado.', check: 'No cambió ningún interruptor real. Explicas por qué la lista permitida y la validación de argumentos no constituyen seguridad completa.', screen: { id: 's16-enabled', highlight: ['enabled'] } },
        { title: 'Ejecuta la simulación determinista completa', body: 'Ejecuta este bloque Python completo una vez en una sesión existente. Usa un stub fijo del modelo y una tupla inmutable de datos ficticios. Las aserciones incluidas cubren la transcripción exacta y cada rechazo indicado; los rechazos no cambian los datos ni el contador de ejecuciones. No utiliza eval, exec, llamadas externas ni escrituras persistentes.', code: { language: 'python', code: `import json

FIXTURE = (("C-42", 10.0), ("C-42", 25.0))
CALL = '{"name":"sales_total","arguments":{"customer_id":"C-42"}}'
FINAL = {"final": "C-42: orders=2 total=35.0"}

def sales_total(customer_id):
    amounts = [amount for customer, amount in FIXTURE if customer == customer_id]
    return {"orders": len(amounts), "total": sum(amounts)}

TOOLS = {"sales_total": sales_total}

def simulate(script, max_steps=3):
    trace = [("request", "Sales total for fixture C-42")]
    calls = model_calls = 0
    for _ in range(max_steps):
        # Scripted model stub: never inference, network or arbitrary code.
        response = script[model_calls] if model_calls < len(script) else None
        model_calls += 1
        if isinstance(response, dict) and response == FINAL:
            if calls != 1:
                return "INVALID_ARGUMENTS", trace, calls, model_calls
            trace.append(("final", response["final"]))
            return "OK", trace, calls, model_calls
        if not isinstance(response, str):
            return "INVALID_ARGUMENTS", trace, calls, model_calls
        try:
            request = json.loads(response)
        except json.JSONDecodeError:
            return "MALFORMED_JSON", trace, calls, model_calls
        if not isinstance(request, dict) or set(request) != {"name", "arguments"}:
            return "INVALID_ARGUMENTS", trace, calls, model_calls
        name, args = request["name"], request["arguments"]
        if not isinstance(name, str) or name not in TOOLS:
            return "TOOL_NOT_ALLOWED", trace, calls, model_calls
        if (not isinstance(args, dict) or set(args) != {"customer_id"}
                or not isinstance(args["customer_id"], str)
                or args["customer_id"] != "C-42"):
            return "INVALID_ARGUMENTS", trace, calls, model_calls
        # Fixture-only restriction, NOT real identity/authorization.
        trace.append(("tool_call", response))
        calls += 1
        result = TOOLS[name](**args)
        trace.append(("tool_result", result))
    return "STEP_LIMIT", trace, calls, model_calls

def verify():
    before = tuple(FIXTURE)
    expected_trace = [
        ("request", "Sales total for fixture C-42"),
        ("tool_call", CALL),
        ("tool_result", {"orders": 2, "total": 35.0}),
        ("final", "C-42: orders=2 total=35.0"),
    ]
    status, trace, calls, model_calls = simulate([CALL, FINAL])
    assert (status, trace, calls, model_calls) == ("OK", expected_trace, 1, 2)
    assert FIXTURE == before
    lines = ["SCRIPTED AGENT LOOP SIMULATION"]
    for event, value in trace:
        text = json.dumps(value, sort_keys=True) if isinstance(value, dict) else value
        lines.append(event + ": " + text)
    cases = [
        ("TOOL_NOT_ALLOWED", '{"name":"delete_all","arguments":{}}'),
        ("MALFORMED_JSON", '{broken'),
        ("INVALID_ARGUMENTS", '{"name":"sales_total","arguments":{"customer_id":42}}'),
        ("INVALID_ARGUMENTS", '{"name":"sales_total","arguments":{"customer_id":"C-99"}}'),
        ("INVALID_ARGUMENTS", '{"name":"sales_total","arguments":{"customer_id":"C-42","extra":1}}'),
        ("INVALID_ARGUMENTS", '[]'),
    ]
    for expected, request in cases:
        status, trace, calls, model_calls = simulate([request, FINAL])
        assert (status, calls, model_calls) == (expected, 0, 1)
        assert trace == [("request", "Sales total for fixture C-42")]
        assert FIXTURE == before
    status, trace, calls, model_calls = simulate([CALL, FINAL], max_steps=1)
    assert (status, calls, model_calls) == ("STEP_LIMIT", 1, 1)
    assert trace == expected_trace[:3]
    assert FIXTURE == before
    status, trace, calls, model_calls = simulate([CALL], max_steps=0)
    assert (status, calls, model_calls) == ("STEP_LIMIT", 0, 0)
    assert trace == expected_trace[:1] and FIXTURE == before
    lines.append("checks: TOOL_NOT_ALLOWED MALFORMED_JSON INVALID_ARGUMENTS STEP_LIMIT; fixture unchanged")
    return "\\n".join(lines)

EXPECTED = '\\n'.join([
    'SCRIPTED AGENT LOOP SIMULATION',
    'request: Sales total for fixture C-42',
    'tool_call: ' + CALL,
    'tool_result: {"orders": 2, "total": 35.0}',
    'final: C-42: orders=2 total=35.0',
    'checks: TOOL_NOT_ALLOWED MALFORMED_JSON INVALID_ARGUMENTS STEP_LIMIT; fixture unchanged',
])
output = verify()
assert output == EXPECTED
print(output)` }, check: 'Salida 0, stderr vacío y exactamente seis líneas de stdout: SCRIPTED AGENT LOOP SIMULATION; request: Sales total for fixture C-42; tool_call: {"name":"sales_total","arguments":{"customer_id":"C-42"}}; tool_result: {"orders": 2, "total": 35.0}; final: C-42: orders=2 total=35.0; checks: TOOL_NOT_ALLOWED MALFORMED_JSON INVALID_ARGUMENTS STEP_LIMIT; fixture unchanged. Cada punto y coma separa una línea, no es puntuación impresa.' },
        { title: 'Interpreta las comprobaciones de rechazo', body: 'Lee las aserciones sin debilitarlas: delete_all se rechaza sin despacho; JSON roto y argumentos incorrectos, adicionales o ajenos al cliente ficticio nunca ejecutan la herramienta. Con presupuesto uno se ejecuta la primera herramienta, pero se bloquea la siguiente llamada al stub; con cero no se llama al stub ni a la herramienta. El contador mide ejecuciones reales, no longitud de traza.', check: 'Solicitudes rechazadas: contador de herramienta 0, datos intactos, traza solo request. STEP_LIMIT con uno: herramienta 1, llamadas al modelo 1, sin final; con cero: ambos contadores 0.' },
        { title: 'Reconoce la ruta actual de código; no exportes', body: 'Estudia Get code → Export to Databricks Apps en la maqueta original. El tutorial investigado recomienda Apps en lugar de la ruta heredada de exportar a notebook. Detente en la identificación: no pulses una exportación real, crees una App ni despliegues. Lakebase no es necesario para este ejercicio ficticio.', check: 'No hubo exportación, despliegue, estado persistente ni creación de recursos; Apps y Lakebase siguen siendo opcionales y sujetos a cuotas.', screen: { id: 's16-code', highlight: ['getCode', 'exportApps'] } },
        { title: 'Separa traza, auditoría y autorización real', body: 'Revisa qué demuestran los cuatro eventos exitosos: solicitud programada, herramienta ficticia despachada, resultado calculado y respuesta fija. No demuestran autorización de producción, protección de datos privados, auditoría universal ni razonamiento autónomo genuino. Un despliegue real requiere diseñar por separado identidad, acceso, monitoreo y evaluación.', check: 'Puedes nombrar los controles de producción ausentes sin afirmar que la simulación los proporciona. Termina sin escrituras de limpieza ni operaciones destructivas.' },
      ],
      wrapUp: 'C-42 tiene dos compras ficticias por 35.0. Observaste un ciclo programado, rechazaste solicitudes inseguras o malformadas sin ejecutar herramientas, aplicaste el presupuesto antes de otra llamada al modelo y separaste navegación de exportación y despliegue. No hubo inferencia real, red, bases de datos ni estado persistente.',
      sources: [agent, free, guide],
    },
    certification: {
      intro: 'Práctica original alineada con la guía de Generative AI Engineer Associate de marzo de 2026, no preguntas reales del examen. La simulación ilustra fronteras de aplicación, no un agente de producción ni una certificación de seguridad.',
      exams: [{ name: 'Databricks Certified Generative AI Engineer Associate', url: guide.url, domains: ['Application Development', 'Assembling and Deploying', 'Governance', 'Evaluation and Monitoring'] }],
      questions: [
        { domain: 'Application Development', question: 'El modelo propone sales_total. ¿Quién debe validar y despachar?', options: ['La descripción de herramienta automáticamente', 'La aplicación tras comprobar nombre, argumentos y autorización', 'El texto de respuesta final', 'El visor de trazas'], answer: 1, explanation: 'Proponer no es ejecutar. La aplicación controla validación, autorización real y despacho; el esquema no concede permisos.' },
        { domain: 'Application Development', question: '¿Qué establece el esquema de herramienta?', options: ['Una compra completada', 'Autorización universal', 'Una interfaz declarada para una posible llamada', 'Ejecución automática de Python'], answer: 2, explanation: 'El esquema declara la interfaz. No ejecuta código ni demuestra que quien llama tenga acceso a un cliente.' },
        { domain: 'Application Development', question: '¿Cuál es el resultado ficticio de C-42?', options: ['orders=2, total=35.0', 'orders=1, total=25.0', 'orders=2, total=10.0', 'orders=35, total=2.0'], answer: 0, explanation: 'Las dos compras sintéticas son 10.0 y 25.0: dos pedidos y un total de 35.0.' },
        { domain: 'Governance', question: 'Se solicita la herramienta desconocida delete_all. ¿Qué hace el laboratorio?', options: ['La ejecuta en un sandbox', 'Pide al modelo que la autorice', 'Incrementa primero el contador de herramientas', 'Devuelve TOOL_NOT_ALLOWED sin ejecutar herramientas'], answer: 3, explanation: 'Solo sales_total está permitida; una solicitud desconocida no cambia los datos ni el contador de ejecuciones.' },
        { domain: 'Governance', question: '¿La lista permitida del laboratorio proporciona autorización completa del cliente?', options: ['Sí, para todos los clientes reales', 'No; restringe una interfaz ficticia, no acceso autenticado', 'Sí, porque el JSON es válido', 'Solo si lo afirma el modelo'], answer: 1, explanation: 'Una lista permitida no es un sistema completo de identidad y autorización. El único cliente aquí es ficticio.' },
        { domain: 'Evaluation and Monitoring', question: 'Con max_steps=1, ¿qué sucede después del resultado de herramienta?', options: ['Siempre ocurre la llamada final al stub', 'Se ejecuta una segunda herramienta', 'Ocurre STEP_LIMIT antes de otra llamada al stub', 'Se eliminan los datos ficticios'], answer: 2, explanation: 'El presupuesto se comprueba en la frontera del ciclo. Hay exactamente una llamada al stub y una ejecución de herramienta, sin evento final.' },
        { domain: 'Application Development', question: '¿Qué afirmación distingue memoria de estado autoritativo?', options: ['La conversación anterior es contexto, no prueba de una compra', 'Lo que afirma el asistente siempre es el registro transaccional', 'La recuperación reemplaza todo sistema de negocio', 'La memoria siempre requiere Lakebase'], answer: 0, explanation: 'Conversación y recuperación aportan contexto; los hechos autoritativos de compras necesitan una fuente de verdad designada.' },
        { domain: 'Evaluation and Monitoring', question: '¿Qué garantiza la traza en memoria?', options: ['Auditar toda acción de plataforma', 'Evidencia duradera de cumplimiento', 'Autorización de producción', 'Solo los eventos de simulación registrados explícitamente'], answer: 3, explanation: 'La traza local no es auditoría de plataforma, no tiene almacenamiento duradero ni garantiza cobertura universal.' },
        { domain: 'Assembling and Deploying', question: '¿Qué ruta actual del tutorial se reconoce sin ejecutarla?', options: ['Exportación heredada obligatoria a notebook', 'Get code → Export to Databricks Apps', 'Desplegar Python arbitrario desde un prompt', 'Crear Lakebase para cada agente'], answer: 1, explanation: 'La ruta actual investigada recomienda Apps. Este laboratorio solo reconoce los controles: no exporta ni despliega.' },
        { domain: 'Assembling and Deploying', question: '¿Qué afirmación de Free Edition es correcta para este laboratorio?', options: ['Apps y Lakebase están categóricamente ausentes', 'Todo agente debe usar ambos', 'Están disponibles con cuotas, pero aquí no se necesita ninguno', 'Tienen capacidad ilimitada'], answer: 2, explanation: 'La disponibilidad depende de límites documentados. Una simulación local con biblioteca estándar no requiere esos servicios.' },
        { type: 'hotspot', domain: 'Application Development', screen: 's16-playground', answer: 'playground', question: '¿Dónde te orientarías hacia la interfaz de pruebas de modelos sin enviar un prompt?', explanation: 'Playground es el contexto del tutorial. Esta maqueta simplificada no envía prompts ni realiza inferencia.' },
        { type: 'hotspot', domain: 'Application Development', screen: 's16-tools', answer: 'addTool', question: 'Dentro de Tools, identifica el control documentado para agregar herramientas sin crear ninguna.', explanation: 'El control documentado es + Add tool. Solo se identifica; un esquema no ejecuta una función.' },
        { type: 'hotspot', domain: 'Governance', screen: 's16-enabled', answer: 'enabled', question: '¿Qué control indica disponibilidad de herramientas para el modelo, no autorización del cliente?', explanation: 'Tools enabled controla disponibilidad en la interfaz. No reemplaza la autorización de cada operación por la aplicación.' },
        { type: 'hotspot', domain: 'Assembling and Deploying', screen: 's16-code', answer: 'exportApps', question: 'Después de Get code, identifica el destino de exportación recomendado actual; no exportes.', explanation: 'Export to Databricks Apps es la ruta actual investigada, distinta de exportar a notebook de forma heredada. No se realiza ninguna acción.' },
      ],
    },
  };
})(globalThis);
