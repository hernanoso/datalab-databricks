// Contenido original; investigación oficial del padre, no verificación de una UI en vivo.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${DOCS}/${path}` });
  const bundles = source('Declarative Automation Bundles', 'dev-tools/bundles/');
  const git = source('Operaciones Git con Git folders', 'repos/git-operations-with-repos');
  const oidc = source('Federación de identidad de cargas con GitHub Actions', 'dev-tools/auth/provider-github');
  const free = source('Limitaciones de Free Edition', 'getting-started/free-edition-limitations');
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';
  DataLab.deep.es.s14 = {
    deepDive: [
      { title: 'CI/CD es una cadena de evidencias, no una copia', body: [
        'Un diseño de entrega útil conecta una rama de trabajo, revisión de pull request, pruebas de transformación, validación de configuración de recursos, aprobación, despliegue y monitoreo. Superar una etapa no demuestra la siguiente: una suma correcta no demuestra permisos del workspace ni una ejecución correcta en producción.',
        'El laboratorio obligatorio solo modela pruebas y una decisión de promoción en memoria Python. No crea ramas, envía commits, configura GitHub Actions ni despliega jobs. La cadena completa es una explicación arquitectónica basada en la documentación de bundles, no infraestructura creada por este ejercicio.',
      ], source: bundles },
      { title: 'Git folders sincroniza código, no recursos desplegados', body: [
        'Git folders conecta archivos de código del workspace con un repositorio Git remoto y permite operaciones Git. Cambiar de rama o descargar cambios actualiza el código; no equivale a crear o actualizar las definiciones de jobs y pipelines de un despliegue.',
        'La ruta documentada de creación es Workspace → Create → Git folder. El formulario incluye Git repository URL, Git provider y Git folder name. Las maquetas originales muestran esas etiquetas documentadas, no una inspección en vivo. Aquí solo identificas controles: no clones, crees carpetas ni hagas commit o push.',
      ], source: git },
      { title: 'Declarative Automation Bundles describe código y recursos', body: [
        'Declarative Automation Bundles es el nombre actual de Databricks Asset Bundles. Un proyecto reúne código y configuración declarativa de recursos, normalmente con databricks.yml como archivo raíz. Los targets permiten expresar ajustes por entorno sin mantener copias manuales e independientes de la transformación.',
        'Sincronizar código y desplegar recursos son operaciones distintas. Que un archivo exista en el workspace no demuestra que hayan cambiado la definición de un job, sus permisos o la configuración de producción. No supongas que toda función de la UI tiene API REST; consulta las herramientas y los recursos documentados para cada operación.',
      ], source: bundles },
      { title: 'Validar no es revisar YAML sin conexión', body: [
        'Una prueba unitaria Python comprueba la transformación; analizar YAML comprueba sintaxis. Ninguna sustituye la validación del bundle contra el target seleccionado. Considera databricks bundle validate una operación de CLI que requiere autenticación configurada y acceso al workspace, no una revisión de YAML completamente offline.',
        'Validar también es distinto de desplegar y ejecutar: aceptar una configuración no demuestra que terminó una carga de datos. El trabajo empresarial opcional necesita CLI compatible, identidad autorizada en el workspace, configuración del target y permisos sobre recursos. Ningún comando de bundles es un paso obligatorio ni ejecutado en este laboratorio.',
      ], source: bundles },
      { title: 'Promueve el mismo código con ajustes explícitos por entorno', body: [
        'Los targets separan configuración por entorno del código de transformación. Revisa workspace, catálogo, permisos y ajustes de recursos antes de promover. Los nombres de catálogo distintos ilustran aislamiento lógico, pero unos diccionarios con esos nombres no crean objetos de Unity Catalog ni establecen límites de seguridad.',
        'El laboratorio usa diccionarios dev y prod con catálogos distintos y el mismo code_version fijo. Solo modelan la promoción de una versión revisada. El aislamiento real sigue dependiendo de workspaces, identidades, permisos y configuración de despliegue; una cadena de versión no comprueba la integridad de un artefacto.',
      ], source: bundles },
      { title: 'La federación evita exigir un client secret', body: [
        'GitHub Actions puede usar federación de identidad de cargas mediante OIDC con un service principal de Databricks. Un administrador debe configurar antes una política de federación que confíe en la identidad del flujo GitHub previsto. Un token de cualquier workflow no recibe autorización automáticamente.',
        'Esta ruta documentada no exige un client secret de larga duración. Delimita permisos y claims del workflow confiable y consigue autorización organizacional antes de habilitar automatización real. El ejercicio no pide tokens, credenciales, cambios de políticas de federación ni llamadas de autenticación.',
      ], source: oidc },
      { title: 'Una compuerta concede elegibilidad; monitorear cierra el ciclo', body: [
        'La compuerta didáctica exige las cuatro reglas aprobadas y una aprobación explícita. Aprobar no repara pruebas fallidas y las pruebas no sustituyen la aprobación. ELIGIBLE significa elegible solo en esta simulación: no es un estado de despliegue, evidencia de validación de recursos ni permiso para publicar de verdad.',
        'En un plan empresarial, después de desplegar comprueba la ejecución y monitorea sus resultados. Si el comportamiento es incorrecto, detén la promoción e investiga con el equipo responsable. La compuerta en memoria no monitorea jobs reales ni implementa rollback, aprobaciones de entornos o protección de ramas en GitHub.',
      ], source: bundles },
      { title: 'Free Edition permite aprender, no garantiza una plataforma CI', body: [
        'Free Edition tiene límites de uso, funciones y cómputo serverless. Que funcione un notebook Python no demuestra que tu cuenta admita runners empresariales, conectividad externa, administración de service principals o una arquitectura de despliegue productivo.',
        'Todo el código obligatorio usa Python estándar, enteros sintéticos y objetos en memoria. Puedes ejecutarlo en un notebook Python de Free Edition dentro de su cuota, o en una sesión local de Python 3. No necesita dependencias, archivos, cambios Git, red, aprovisionamiento de nube ni comandos externos.',
      ], source: free },
    ],
    diagram: {
      title: 'Evidencias de entrega y límite de la simulación',
      caption: 'Flujo conceptual basado en las fuentes de Git folders, bundles y federación. Aquí solo se ejecutan pruebas de transformación y una compuerta local de elegibilidad; no se configura CI ni despliegue.',
      layers: [
        { label: 'Control de versiones', nodes: ['Rama de trabajo → pull request', 'Revisión humana → versión aprobada'] },
        { label: 'Integración continua', nodes: ['Pruebas de transformación', 'Validación de recursos con CLI/autenticación/workspace'] },
        { label: 'Controles de entrega', nodes: ['Ajustes del target + aprobación explícita', 'Identidad autorizada con política de federación'] },
        { label: 'Despliegue real y operación', nodes: ['Desplegar recursos y ejecutar la carga', 'Monitorear resultados e investigar fallos'] },
        { label: 'Solo laboratorio', nodes: ['Suma Python + cuatro reglas', 'Diccionarios dev/prod + ELIGIBLE/BLOCKED', 'Sin deploy ni bundle validate reales'] },
      ],
    },
    comparison: {
      title: 'Cada comprobación responde una pregunta distinta',
      headers: ['Operación', 'Evidencia que aporta', 'No demuestra'],
      rows: [
        ['Sincronizar código en Git folder', 'El código del workspace refleja el contenido Git seleccionado', 'Recursos desplegados o carga probada'],
        ['Pruebas Python de transformación', 'Las cuatro reglas locales cumplen su contrato', 'Configuración del bundle o permisos válidos'],
        ['Revisar sintaxis YAML', 'El documento se puede analizar', 'Validación autenticada del bundle completada'],
        ['Validar bundle', 'Configuración del target comprobada mediante el flujo CLI', 'Una carga desplegada terminó correctamente'],
        ['Aprobar y desplegar', 'Decisión autorizada y actualización de recursos son etapas distintas', 'Datos productivos correctos sin comprobar la ejecución'],
        ['Monitorear', 'Resultados observados de ejecución', 'Que sincronizar código por sí solo fuera desplegar'],
      ],
      sources: [git, bundles, oidc],
    },
    lab: {
      title: 'SIMULACIÓN CI/CD en Python: cuatro pruebas y una compuerta',
      goal: 'Calcula 10 + 20 = 30, rechaza nulos y negativos, demuestra repetibilidad y compara dev/prod con aprobación simulada. No configura CI real ni despliega recursos.',
      minutes: 40,
      requirements: [
        'Una sesión nueva de Python 3, local o en un notebook Python de Free Edition dentro de la cuota. Ejecuta los bloques en orden.',
        'No requiere CLI, repositorio Git, cuenta GitHub, paquetes, secretos, red, archivos ni aprovisionamiento. No ejecutes el workflow de despliegue de la sesión base como parte de este ejercicio.',
        'Las pantallas de Git folder son ilustraciones originales simplificadas verificadas con documentación, no con una UI en vivo. Solo identifica etiquetas; no despliegues ni crees una carpeta Git real.',
      ],
      steps: [
        { title: 'Ubica la entrada documentada de control de versiones', body: 'En la maqueta de lectura, identifica Workspace y la ruta Create → Git folder. Es orientación basada en la documentación citada de operaciones Git, no una instrucción para clonar. Todo el cálculo obligatorio ocurrirá en memoria Python.', check: 'Distingues una carpeta Git del workspace de un recurso job desplegado.', screen: { id: 's14-workspace', highlight: ['workspace', 'create', 'gitFolder'] } },
        { title: 'Identifica campos sin conectar un repositorio', body: 'Observa Git repository URL, Git provider y Git folder name. Clonar de verdad necesitaría un repositorio y acceso Git autorizado. No introduzcas credenciales, envíes formularios ni cambies ramas; solo observas una ilustración simplificada.', check: 'Puedes nombrar los tres campos documentados y explicar por qué descargar código no es desplegar.', screen: { id: 's14-git-form', highlight: ['url', 'provider', 'name'] } },
        { title: 'Define una transformación pura', body: 'Copia esta función en una sesión Python nueva. El contrato acepta una lista de enteros no negativos; rechaza nulos. Devuelve un total sin escrituras ni contadores de procesamiento. Valida antes de sumar y nunca modifica la entrada.', code: { language: 'python', code: `def transform(values):
    if any(value is None for value in values):
        raise ValueError("null rejected")
    if any(type(value) is not int or value < 0 for value in values):
        raise ValueError("non-negative integers required")
    return sum(values)

values = [10, 20]
print(f"total={transform(values)}")` }, check: 'Salida exacta: total=30. No cambió ninguna tabla, archivo ni estado Git.' },
        { title: 'Ejecuta exactamente cuatro reglas de comportamiento', body: 'Comprueba entrada válida, rechazo de nulos, rechazo de negativos y repetición determinista. Los casos rechazados verifican el error exacto y que la entrada no cambie. No hay contador de procesamiento ni datos almacenados que revertir porque transform es pura. El reporte se construye después de que terminan las llamadas.', code: { language: 'python', code: `def rejected_unchanged(candidate, message):
    before = list(candidate)
    try:
        transform(candidate)
    except ValueError as error:
        return str(error) == message and candidate == before
    return False

before = list(values)
tests = {
    "valid": transform(values) == 30 and values == before,
    "null": rejected_unchanged([10, None], "null rejected"),
    "negative": rejected_unchanged([10, -1], "non-negative integers required"),
    "repeat": transform(values) == transform(values) == 30 and values == before,
}
assert len(tests) == 4 and all(tests.values())
print(f"tests={sum(tests.values())}/4")` }, check: 'Salida exacta: tests=4/4. Se rechazaron nulos y negativos sin modificar entradas.', screen: { id: 's14-gate', highlight: ['tests'] } },
        { title: 'Separa configuración de una misma versión de código', body: 'Crea dos diccionarios normales, no targets ni catálogos reales. Los catálogos difieren y code_version coincide. La misma función transform sirve para ambos ajustes; no se copia ni modifica código para producción. Estas aserciones modelan coherencia de configuración, no validación de recursos.', code: { language: 'python', code: `dev = {"catalog": "sales_dev", "code_version": "v1"}
prod = {"catalog": "sales_prod", "code_version": "v1"}
assert dev["catalog"] != prod["catalog"]
assert dev["code_version"] == prod["code_version"]
print(f"dev={dev['catalog']} prod={prod['catalog']} code_version={prod['code_version']}")` }, check: 'Salida exacta: dev=sales_dev prod=sales_prod code_version=v1. No se creó ningún catálogo.' },
        { title: 'Compara aprobación, falta de aprobación y pruebas fallidas', body: 'Simula la compuerta con el mismo reporte de cuatro reglas. Devuelve ELIGIBLE solo con el conjunto exacto de reglas esperadas, todas True y aprobación explícita. Una prueba fallida bloquea aunque exista aprobación. Las instantáneas verifican que evaluar no modifica reporte ni ajustes; no existe función deploy.', code: { language: 'python', code: `def promotion_gate(report, approved):
    expected = {"valid", "null", "negative", "repeat"}
    passed = set(report) == expected and all(value is True for value in report.values())
    return "ELIGIBLE" if passed and approved is True else "BLOCKED"

snapshot = (dict(tests), dict(dev), dict(prod))
assert promotion_gate(tests, True) == "ELIGIBLE"
assert promotion_gate(tests, False) == "BLOCKED"
failed = dict(tests, negative=False)
assert promotion_gate(failed, True) == "BLOCKED"
assert (tests, dev, prod) == snapshot
print(f"approved={promotion_gate(tests, True)}")
print(f"no_approval={promotion_gate(tests, False)}")
print(f"failed_tests={promotion_gate(failed, True)}")` }, check: 'Tres líneas: approved=ELIGIBLE; no_approval=BLOCKED; failed_tests=BLOCKED. Reportes y ajustes no cambiaron.', screen: { id: 's14-gate', highlight: ['approval', 'eligible', 'blocked'] } },
        { title: 'Relaciona las etapas empresariales pendientes sin ejecutarlas', body: 'Lee las fuentes de bundles y federación. Un diseño real agrega revisión de ramas, validación de recursos, aprobación, despliegue y monitoreo con identidad autorizada. Validar bundles necesita CLI, autenticación y workspace; no es validación YAML offline. OIDC de GitHub requiere una política de federación de service principal preconfigurada, no un client secret obligatorio. No ejecutes comandos externos ni aprovisiones estos requisitos aquí.', check: 'Explicas qué etapas simulaste y cuáles requieren configuración empresarial. No hubo autenticación real, bundle validate, deploy ni workflow CI.' },
      ],
      wrapUp: 'Obtuviste total=30 y tests=4/4, con rechazo de nulos/negativos sin modificar entradas. dev y prod tenían catálogos distintos y code_version=v1. La compuerta devolvió ELIGIBLE con aprobación y BLOCKED sin ella o con pruebas fallidas. Todo quedó en memoria: no hay limpieza persistente, configuración CI real, bundle validado ni despliegue.',
      sources: [git, bundles, oidc, free],
    },
    certification: {
      intro: 'Práctica original, no material oficial ni preguntas reales del examen. Alineada con Implementing CI/CD de la guía de Data Engineer Associate del 4 de mayo de 2026. Los controles educativos de compuerta no son rutas de la UI del producto.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Implementing CI/CD'] }],
      questions: [
        { domain: 'Implementing CI/CD', question: 'Un desarrollador descarga la última rama en un Git folder. ¿Qué queda demostrado?', options: ['Se desplegaron todos los jobs', 'Se sincronizó contenido de código', 'Pasaron todas las pruebas', 'Se aprobó producción'], answer: 1, explanation: 'Las operaciones Git sincronizan código; no demuestran despliegue de recursos ni pruebas. Fuente: operaciones Git con Git folders.' },
        { domain: 'Implementing CI/CD', question: '¿Cuál es el nombre actual de Databricks Asset Bundles?', options: ['Unity Catalog', 'Git folders', 'Declarative Automation Bundles', 'Lakeflow Jobs'], answer: 2, explanation: 'Declarative Automation Bundles es el nombre actual de la herramienta de bundles. Fuente: Declarative Automation Bundles.' },
        { domain: 'Implementing CI/CD', question: '¿Qué secuencia separa mejor las responsabilidades de entrega?', options: ['Rama → revisión → pruebas/validación de configuración → aprobación → despliegue → monitoreo', 'Descargar → suponer éxito productivo', 'Desplegar → omitir pruebas → aprobar', 'Analizar YAML → declarar éxito del job'], answer: 0, explanation: 'Revisar código, comprobar, aprobar, desplegar recursos y monitorear aportan evidencias distintas. Fuente: bundles y modelo didáctico de entrega.' },
        { domain: 'Implementing CI/CD', question: '¿Qué necesitas planear antes de validar un bundle de verdad?', options: ['Solo un editor YAML sin acceso al workspace', 'Solo la prueba local de suma', 'Un botón de despliegue productivo', 'CLI, autenticación configurada y acceso al workspace'], answer: 3, explanation: 'Validar bundles es un flujo CLI contra un target, no una revisión de YAML completamente offline. Fuente: Declarative Automation Bundles.' },
        { domain: 'Implementing CI/CD', question: '¿Por qué los diccionarios usan catálogos distintos y el mismo code_version?', options: ['Para crear dos catálogos reales', 'Para modelar ajustes por entorno alrededor de una versión', 'Para evitar permisos de Unity Catalog', 'Para demostrar que se desplegó'], answer: 1, explanation: 'Los targets separan ajustes de código; estos diccionarios solo modelan la distinción y no crean recursos. Fuente: bundles y aserciones del laboratorio.' },
        { domain: 'Implementing CI/CD', question: '¿Qué configuración de identidad de GitHub Actions evita un client secret de larga duración?', options: ['Cualquier workflow público sin política', 'Una contraseña personal compartida', 'Federación OIDC con service principal y política de confianza preconfigurada', 'Un nombre de catálogo como token'], answer: 2, explanation: 'La federación GitHub OIDC exige una política que confíe en la carga y una identidad autorizada; no concede acceso automático. Fuente: federación con GitHub Actions.' },
        { domain: 'Implementing CI/CD', question: 'Pasan las cuatro pruebas pero falta aprobación. ¿Qué devuelve la compuerta?', options: ['BLOCKED', 'DEPLOYED', 'ELIGIBLE', 'Un commit Git nuevo'], answer: 0, explanation: 'La compuerta exige cuatro reglas aprobadas y aprobación explícita; no realiza despliegues. Fuente: laboratorio y modelo de entrega con bundles.' },
        { domain: 'Implementing CI/CD', question: 'Hay aprobación pero falla la regla de rechazo de negativos. ¿Qué ocurre?', options: ['Aprobar cambia el resultado de la prueba', 'La suma se despliega de todos modos', 'Git vuelve a crear el catálogo', 'La compuerta sigue BLOCKED'], answer: 3, explanation: 'La aprobación no sustituye comprobaciones correctas; el laboratorio exige BLOCKED con prueba fallida y aprobación. Fuente: compuerta del laboratorio.' },
        { domain: 'Implementing CI/CD', question: '¿Qué verifica la prueba de entrada nula?', options: ['Que el nulo se convierte silenciosamente en cero', 'Rechazo exacto y entrada sin cambios', 'Que se repara el job productivo', 'Que se renueva una credencial'], answer: 1, explanation: 'La función pura lanza ValueError con null rejected y no modifica la entrada. Fuente: contrato ejecutable del laboratorio.' },
        { domain: 'Implementing CI/CD', question: '¿Qué demuestra completar este laboratorio?', options: ['Que se configuró un workflow GitHub real', 'Que un bundle pasó validación autenticada', 'Las reglas de transformación local y la decisión de elegibilidad simulada', 'Que toda función UI tiene endpoint REST'], answer: 2, explanation: 'Solo se ejecutaron comportamientos Python y aserciones de diccionarios/compuerta; no hubo CLI, red, cambios Git ni despliegue. Fuentes: laboratorio y límites de Free Edition.' },
        { type: 'hotspot', domain: 'Implementing CI/CD', screen: 's14-workspace', answer: 'workspace', question: '¿Qué área documentada inicia la ruta de creación de una carpeta Git?', explanation: 'Workspace precede Create → Git folder en la ruta documentada. La maqueta es original y verificada con documentación, no en vivo. Fuente: operaciones Git.' },
        { type: 'hotspot', domain: 'Implementing CI/CD', screen: 's14-workspace', answer: 'gitFolder', question: 'En el menú Create abierto de la maqueta, ¿qué elemento corresponde a código vinculado a un repositorio?', explanation: 'Git folder es el elemento documentado. Organizar código no despliega recursos; no crees una carpeta real aquí. Fuente: operaciones Git.' },
        { type: 'hotspot', domain: 'Implementing CI/CD', screen: 's14-git-form', answer: 'url', question: '¿Qué campo documentado identifica el repositorio remoto, no un catálogo productivo?', explanation: 'Git repository URL especifica el repositorio remoto. La ilustración de lectura no requiere credenciales ni clonación real. Fuente: operaciones Git.' },
        { type: 'hotspot', domain: 'Implementing CI/CD', screen: 's14-gate', answer: 'blocked', question: 'En la compuerta educativa, ¿dónde está el resultado con tests=4/4 pero sin aprobación?', explanation: 'no_approval=BLOCKED es un resultado didáctico en memoria, no un control de despliegue de Databricks. Fuente: aserciones y modelo de entrega.' },
      ],
    },
  };
})(globalThis);
