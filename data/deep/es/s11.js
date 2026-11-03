// Contenido original; fuentes oficiales y rutas de UI verificadas por la investigación del padre.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.es = DataLab.deep.es || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const roles = source('Responsabilidades administrativas', 'admin/admin-concepts');
  const identities = source('Administración de identidades', 'admin/users-groups/');
  const practices = source('Grupos de cuenta y service principals', 'admin/users-groups/best-practices');
  const groups = source('Administrar grupos: rutas de interfaz', 'admin/users-groups/manage-groups');
  const policies = source('Compute policies: alcance e interfaz', 'admin/clusters/policies');
  const secrets = source('Secretos y límites de ocultación', 'security/secrets/');
  const network = source('Seguridad de red', 'security/network/');
  const audit = source('Referencia de auditoría', 'admin/system-tables/audit-logs');
  const free = { label: 'Límites de Free Edition', url: 'https://docs.databricks.com/aws/en/getting-started/free-edition-limitations' };
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.es.s11 = {
    deepDive: [
      {
        title: 'Tres ámbitos administrativos, no una única llave maestra',
        body: [
          'El administrador de cuenta gestiona recursos e identidades de la cuenta; el administrador de workspace configura y administra su workspace; el administrador de metastore se ocupa del ámbito de Unity Catalog. Son responsabilidades distintas: administrar la cuenta no concede automáticamente acceso a todos los workspaces ni equivale a poder leer cualquier tabla.',
          'Para diagnosticar un rechazo, identifica primero el ámbito: identidad de cuenta, asignación o acceso al workspace y permisos del objeto de datos. Una solución en el ámbito equivocado puede aumentar privilegios sin resolver la causa. Separa la administración de la ejecución cotidiana y asigna solo los privilegios necesarios.',
        ],
        source: roles,
      },
      {
        title: 'Identidad, acceso al workspace y autorización son preguntas diferentes',
        body: [
          'Una identidad representa a una persona o aplicación. Los entitlements habilitan capacidades del workspace; los permisos de objetos deciden operaciones concretas. Que una persona pueda iniciar sesión no demuestra que pueda modificar una tabla, y un permiso de datos no reemplaza el acceso al workspace donde se ejecuta la consulta.',
          'La administración automática de identidades desde Microsoft Entra ID es la opción preferida para cuentas nuevas que la admiten. SCIM sigue siendo una alternativa de aprovisionamiento, no un requisito universal. Evita presentar la sincronización como una revocación instantánea de toda sesión, credencial o permiso: verifica el ciclo de baja y su alcance.',
        ],
        source: identities,
      },
      {
        title: 'Grupos de cuenta y automatización con identidad propia',
        body: [
          'Para Unity Catalog, utiliza grupos a nivel de cuenta en lugar de depender de grupos locales del workspace. Centralizar la membresía permite aplicar el mismo modelo de acceso en varios workspaces. Los grupos locales no son un sustituto intercambiable para la autorización de Unity Catalog.',
          'Los service principals representan cargas de trabajo automatizadas. Separan la identidad de un proceso de la cuenta personal de quien lo creó, pero no son administradores por definición. Asigna al proceso solo los permisos que necesita y revisa también los accesos de sus grupos; el nombre de una identidad no garantiza mínimo privilegio.',
        ],
        source: practices,
      },
      {
        title: 'Compute policies: restricciones de configuración, no presupuesto garantizado',
        body: [
          'Las compute policies restringen configuraciones de cómputo clásico, como rangos de tamaño, apagado automático y tags. En Azure Databricks requieren Premium. Son un control sobre configuraciones permitidas y sobre quién puede usar la política, no una garantía de gasto máximo ni una política de tamaño para serverless.',
          'Cambiar una política no modifica retroactivamente el cómputo existente. Revisa cómo se actualizarán los recursos y quién conserva la capacidad de crear cómputo sin restricciones. En el laboratorio solo evaluarás una regla booleana sobre tres filas; no crearás políticas ni demostrarás controles de costos de serverless.',
        ],
        source: policies,
      },
      {
        title: 'Secret scopes y ocultación de salida no son la misma protección',
        body: [
          'Los secretos evitan incrustar valores sensibles en notebooks. Un scope respaldado por Databricks y uno respaldado por Azure Key Vault tienen distinta administración: el segundo proporciona acceso de solo lectura desde Databricks a secretos administrados en Azure. Los scopes Key Vault requieren el modelo Vault access policy, no Azure RBAC.',
          'La ocultación de secretos en la salida es de mejor esfuerzo y no impide que un usuario autorizado extraiga o transforme un valor. Los permisos y el manejo del secreto siguen siendo esenciales. Nunca imprimas un secreto para comprobar si se oculta; este laboratorio no crea, lee ni solicita credenciales reales.',
        ],
        source: secrets,
      },
      {
        title: 'La red tiene fronteras de entrada y salida distintas',
        body: [
          'Separa el acceso de usuarios y herramientas hacia Databricks, la conectividad del cómputo clásico y la salida del cómputo serverless hacia servicios de datos. Un control de entrada al workspace no configura por sí solo la salida de serverless, ni una configuración de red clásica debe asumirse válida para todos los planos.',
          'Antes de elegir una función de red, identifica origen, destino, dirección del tráfico y tipo de cómputo. Las capacidades dependen del producto y del despliegue. Free Edition no permite redes privadas personalizadas; por eso el ejercicio no requiere endpoints privados, recursos Azure ni cambios de firewall.',
        ],
        source: network,
      },
      {
        title: 'system.access.audit: alcance, latencia y retención',
        body: [
          'La tabla de auditoría está documentada como Public Preview. event_time, service_name, action_name, user_identity y response ayudan a reconstruir actividad. Los eventos de cuenta usan workspace_id = 0; los eventos de workspace consultables corresponden a la región. No interpretes una consulta regional como una vista universal de toda la cuenta.',
          'La entrega no es en tiempo real: la ausencia inmediata de una fila no demuestra que una operación no ocurrió. La retención predeterminada documentada es 365 días, no una constante universal para cualquier origen o configuración de auditoría. Confirma alcance, disponibilidad, retención y permisos antes de usarla como evidencia operativa.',
        ],
        source: audit,
      },
      {
        title: 'Aprender administración sin administrar una cuenta real',
        body: [
          'Free Edition ofrece cómputo serverless con restricciones y no incluye consola de cuenta, APIs de cuenta, SCIM, redes privadas ni cómputo personalizado. No se garantiza acceso a auditoría real. Las pantallas empresariales de esta sesión son ilustraciones originales simplificadas, no capturas ni promesas de disponibilidad en tu cuenta gratuita.',
          'El laboratorio obligatorio usa únicamente vistas temporales SQL con datos sintéticos. Un CASE que devuelve ALLOW no aplica una ACL y una expresión de tamaño no despliega una compute policy. Esta separación permite verificar resultados sin tocar identidades, permisos, secretos ni objetos persistentes.',
        ],
        source: free,
      },
    ],
    diagram: {
      title: 'Identidad → ámbito → control → evidencia',
      caption: 'Mapa conceptual basado en las fuentes de administración, políticas, red y auditoría citadas arriba. Las fronteras no son equivalentes y los ejemplos sintéticos del laboratorio no implementan estos controles.',
      layers: [
        { label: 'Identidad de cuenta', nodes: ['Personas y grupos de cuenta', 'Service principals para automatización'] },
        { label: 'Ámbito de administración', nodes: ['Cuenta: recursos e identidades', 'Workspace: acceso y configuración', 'Metastore: Unity Catalog'] },
        { label: 'Controles separados', nodes: ['Autorización de objetos', 'Políticas de cómputo clásico', 'Secretos y red: fronteras propias'] },
        { label: 'Evidencia', nodes: ['Auditoría: eventos regionales y de cuenta', 'Latencia y retención por verificar', 'Laboratorio: solo datos sintéticos'] },
      ],
    },
    comparison: {
      title: 'Qué resuelve cada control y qué no demuestra',
      headers: ['Control', 'Pregunta que resuelve', 'No equivale a', 'Práctica de esta sesión'],
      rows: [
        ['Identidad y grupos de cuenta', '¿Quién es la persona o aplicación?', 'Acceso automático a todo workspace y tabla', 'Inspección conceptual de grupos'],
        ['Entitlements y permisos', '¿Qué capacidades y operaciones se permiten?', 'Que iniciar sesión autorice cualquier escritura', 'CASE sintético; ninguna ACL aplicada'],
        ['Compute policy clásica', '¿Qué configuración clásica puede elegirse?', 'Garantía de presupuesto serverless o cambio retroactivo', 'Tres configuraciones simuladas'],
        ['Secret scope', '¿Quién puede recuperar el secreto?', 'Ocultación infalible frente a un lector autorizado', 'Teoría; ningún secreto real'],
        ['Controles de red', '¿Qué origen y destino pueden comunicarse?', 'Una sola regla para entrada, clásico y serverless', 'Mapa conceptual; ningún cambio de red'],
        ['Auditoría', '¿Qué actividad se registró en este alcance?', 'Un monitor completo y en tiempo real', 'Cuatro eventos sintéticos; lectura real opcional'],
      ],
      sources: [roles, identities, practices, policies, secrets, network, audit, free],
    },
    lab: {
      title: 'Investigar seguridad con vistas temporales en Free Edition',
      goal: 'Analizar cuatro eventos sintéticos, distinguir decisiones simuladas de permisos reales y evaluar una regla de cómputo sin crear credenciales, cambiar permisos ni persistir objetos.',
      minutes: 55,
      requirements: [
        'Un notebook SQL con cómputo serverless en Databricks Free Edition; usa la misma sesión para todas las vistas temporales.',
        'No requiere suscripción Azure, privilegios administrativos, secretos ni acceso a system.access.audit. No ejecutes GRANT, ALTER, CREATE TABLE ni cambios de administración.',
        'Usa nombres s11_* solo para este ejercicio en una sesión nueva. Las cuatro maquetas administrativas son empresariales y se estudian aquí sin abrir ni guardar configuraciones reales.',
      ],
      steps: [
        {
          title: 'Reconoce el límite del laboratorio y los grupos de workspace',
          body: 'Abre un notebook SQL serverless. Estudia la maqueta empresarial Settings → Identity and access → Groups → Manage, no disponible en Free Edition. Solo identifica la ruta; no agregues miembros ni guardes cambios en un workspace real. Las maquetas sirven para orientación, no para conceder permisos.',
          check: 'Distingues la ilustración empresarial del ejercicio SQL que sí puedes ejecutar en Free Edition.',
          screen: { id: 's11-groups', highlight: ['settings', 'identity', 'groups', 'manage'] },
        },
        {
          title: 'Distingue grupos de cuenta de administración local',
          body: 'En la maqueta, el selector de workspace conduce a Manage account → User management → Groups. Es un concepto empresarial: Free Edition no tiene consola de cuenta. Compara este ámbito con la pantalla anterior y recuerda que para Unity Catalog se recomiendan grupos de cuenta. No cambies identidades reales.',
          check: 'Identificas dos ámbitos diferentes y explicas por qué ser administrador de cuenta no da acceso automático a un workspace.',
          screen: { id: 's11-account', highlight: ['manageAccount', 'userManagement', 'groups'] },
        },
        {
          title: 'Crea cuatro eventos totalmente sintéticos',
          body: 'Ejecuta el SQL en la misma sesión. Los correos usan el dominio reservado .invalid y no representan personas reales. named_struct reproduce solo los campos necesarios para practicar; esto no es una copia completa del esquema de auditoría ni evidencia de actividad real.',
          code: { language: 'sql', code: `CREATE OR REPLACE TEMP VIEW s11_audit_demo AS
SELECT event_id, event_time,
       named_struct('email', actor) AS user_identity,
       service_name, action_name,
       named_struct('statusCode', status_code) AS response
FROM VALUES
  (1, TIMESTAMP'2026-01-05 09:00:00', 'ana@example.invalid', 'unityCatalog', 'getTable', 200),
  (2, TIMESTAMP'2026-01-05 09:01:00', 'job@example.invalid', 'unityCatalog', 'getTable', 403),
  (3, TIMESTAMP'2026-01-05 09:02:00', 'ana@example.invalid', 'jobs', 'runNow', 200),
  (4, TIMESTAMP'2026-01-05 09:03:00', 'job@example.invalid', 'unityCatalog', 'getTable', 200)
AS v(event_id, event_time, actor, service_name, action_name, status_code);
SELECT count(*) AS events FROM s11_audit_demo;` },
          check: 'events = 4. No se creó una tabla, un esquema ni un registro real de auditoría.',
        },
        {
          title: 'Resuelve la consulta de las últimas acciones de Unity Catalog',
          body: 'Sustituye la fuente real del ejercicio base por la vista sintética. Conserva los nombres anidados user_identity.email y response.statusCode. Ordena explícitamente por tiempo descendente y usa event_id como desempate para que la lectura sea determinista.',
          code: { language: 'sql', code: `SELECT event_id, event_time, user_identity.email AS actor,
       action_name, response.statusCode AS status_code
FROM s11_audit_demo
WHERE service_name = 'unityCatalog'
ORDER BY event_time DESC, event_id DESC
LIMIT 20;` },
          check: 'Tres filas, en orden: id 4 / 09:03 / job@example.invalid / getTable / 200; id 2 / 09:01 / job@example.invalid / getTable / 403; id 1 / 09:00 / ana@example.invalid / getTable / 200. Todas son del 2026-01-05.',
        },
        {
          title: 'Cuenta resultados y aísla el rechazo',
          body: 'Agrupa por servicio y código, y luego consulta solo errores del conjunto sintético. Un 403 es una pista para investigar autorización; estas filas inventadas no prueban la causa de un incidente ni que getTable sea equivalente a leer todas las filas de una tabla.',
          code: { language: 'sql', code: `SELECT service_name, response.statusCode AS status_code, count(*) AS n
FROM s11_audit_demo
GROUP BY service_name, response.statusCode
ORDER BY service_name, status_code;
SELECT event_id, user_identity.email AS actor, response.statusCode AS status_code
FROM s11_audit_demo
WHERE response.statusCode >= 400
ORDER BY event_id;` },
          check: 'Grupos: jobs / 200 / 1; unityCatalog / 200 / 2; unityCatalog / 403 / 1. El filtro devuelve solo id 2, job@example.invalid, 403.',
        },
        {
          title: 'Simula tres decisiones sin aplicar una ACL',
          body: 'La lista de solicitudes tiene orden explícito. CASE implementa una regla didáctica de lectura para analysts y escritura para job_writer. ALLOW y DENY son cadenas calculadas: no representan permisos concedidos o rechazados por Databricks, ni prueban membresía real en un grupo.',
          code: { language: 'sql', code: `CREATE OR REPLACE TEMP VIEW s11_requests_demo AS
SELECT * FROM VALUES
  (1, 'analysts', 'SELECT'),
  (2, 'analysts', 'MODIFY'),
  (3, 'job_writer', 'MODIFY')
AS v(request_id, principal, operation);
SELECT request_id, principal, operation,
  CASE WHEN (principal = 'analysts' AND operation = 'SELECT')
         OR (principal = 'job_writer' AND operation = 'MODIFY')
       THEN 'ALLOW' ELSE 'DENY' END AS simulated_decision
FROM s11_requests_demo
ORDER BY request_id;` },
          check: 'id 1 analysts SELECT → ALLOW; id 2 analysts MODIFY → DENY; id 3 job_writer MODIFY → ALLOW. No cambió ninguna ACL, identidad ni membresía.',
        },
        {
          title: 'Evalúa una regla de cómputo, no una política desplegada',
          body: 'Estudia la maqueta empresarial Compute → Policies → Create policy → Definitions → Edit definition as JSON y See all permissions, no disponible en Free Edition. No guardes nada. El SQL siguiente solo evalúa workers <= 2 y minutes <= 30 sobre filas inventadas; no es el JSON de una política ni limita serverless.',
          code: { language: 'sql', code: `CREATE OR REPLACE TEMP VIEW s11_compute_demo AS
SELECT * FROM VALUES (1, 2, 15), (2, 8, 15), (3, 2, 120)
AS v(config_id, workers, minutes);
SELECT config_id, workers, minutes,
       (workers <= 2 AND minutes <= 30) AS within_simulated_rule
FROM s11_compute_demo
ORDER BY config_id;` },
          check: 'id 1 (2,15) → true; id 2 (8,15) → false; id 3 (2,120) → false. No se desplegó ninguna compute policy.',
          screen: { id: 's11-policies', highlight: ['compute', 'policies', 'createPolicy', 'definitions', 'editJson', 'permissions'] },
        },
        {
          title: 'Lectura real opcional: solo si ya tienes autorización',
          body: 'Omite este paso en Free Edition si no tienes acceso; no está garantizado. En un entorno empresarial ya autorizado, Catalog → system → access → audit permite localizar la tabla si está habilitada. La consulta es solo lectura y acota el tiempo. Si falla por permisos o disponibilidad, detente: no ejecutes grants, no habilites esquemas ni solicites secretos para completarla.',
          code: { language: 'sql', code: `-- OPCIONAL: solo con acceso previamente autorizado.
SELECT event_time, workspace_id, user_identity.email AS actor,
       service_name, action_name, response.statusCode AS status_code
FROM system.access.audit
WHERE event_time >= current_timestamp() - INTERVAL 1 DAY
  AND service_name = 'unityCatalog'
ORDER BY event_time DESC
LIMIT 20;` },
          check: 'Resultado variable: entre 0 y 20 filas reales, o paso omitido/rechazo de acceso. No esperes los cuatro eventos ficticios ni cambies permisos. Considera región, latencia, Public Preview y retención aplicable.',
          screen: { id: 's11-audit', highlight: ['catalog', 'system', 'access', 'audit'] },
        },
        {
          title: 'Limpia únicamente las vistas temporales del ejercicio',
          body: 'Después de comparar los resultados, elimina solo las tres vistas temporales creadas en esta sesión. No borres objetos del catálogo system ni recursos administrativos. Si repetiste pasos en otra sesión, vuelve a esa sesión para limpiar sus vistas; las vistas temporales no son tablas persistentes.',
          code: { language: 'sql', code: `DROP VIEW IF EXISTS s11_audit_demo;
DROP VIEW IF EXISTS s11_requests_demo;
DROP VIEW IF EXISTS s11_compute_demo;` },
          check: 'Las tres vistas temporales del ejercicio dejan de existir en esta sesión; no se eliminó ninguna tabla ni se modificaron controles reales.',
        },
      ],
      wrapUp: 'Obtuviste cuatro eventos, tres acciones de Unity Catalog en orden 4, 2, 1 y un único rechazo: id 2. Las decisiones ALLOW/DENY/ALLOW y true/false/false son simulaciones, no controles desplegados. Limpiaste solo vistas temporales y mantuviste separados el ejercicio Free Edition y la administración empresarial.',
      sources: [free, roles, identities, practices, groups, policies, secrets, network, audit],
    },
    certification: {
      intro: 'Práctica original, no preguntas reales del examen. La acreditación Platform Administrator orienta los conceptos administrativos; Governance and Security de Data Engineer Associate orienta los de seguridad de datos. La administración empresarial se estudia mediante maquetas, sin cambiar una cuenta real.',
      exams: [
        { name: 'Databricks Platform Administrator Accreditation', url: 'https://www.databricks.com/learn/certification/platform-administrator-accreditation', domains: ['Platform administration'] },
        { name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Governance and Security'] },
      ],
      questions: [
        { domain: 'Platform administration', question: 'Una persona es administradora de cuenta. ¿Qué puedes asumir sobre el acceso a un workspace concreto?', options: ['Puede entrar automáticamente en todos', 'Debes verificar su acceso; el rol de cuenta no lo concede automáticamente', 'Es propietaria de todas sus tablas', 'No necesita identidad de usuario'], answer: 1, explanation: 'Los ámbitos son distintos: administrar la cuenta no equivale a tener acceso automático a cada workspace.' },
        { domain: 'Governance and Security', question: '¿Qué grupos recomiendan las prácticas oficiales para autorizar objetos de Unity Catalog?', options: ['Solo grupos locales de cada workspace', 'Cualquier lista escrita en un notebook', 'Grupos a nivel de cuenta', 'Grupos definidos por nombres de archivos'], answer: 2, explanation: 'Los grupos de cuenta permiten centralizar membresía y autorización de Unity Catalog entre workspaces.' },
        { domain: 'Platform administration', question: 'Para una cuenta nueva compatible, ¿qué ruta de identidades se prefiere frente a asumir SCIM obligatorio?', options: ['Administración automática desde Microsoft Entra ID', 'Copiar manualmente contraseñas a notebooks', 'Eliminar todos los grupos', 'Usar el usuario personal de un administrador para todo'], answer: 0, explanation: 'La administración automática de identidades es la preferida para nuevas cuentas compatibles; SCIM es una alternativa.' },
        { domain: 'Governance and Security', question: '¿Qué identidad encaja mejor con una carga automatizada que no debe depender de una persona?', options: ['El correo compartido de un equipo', 'Un administrador personal permanente', 'Un grupo local como contraseña', 'Un service principal con privilegios mínimos'], answer: 3, explanation: 'Un service principal representa la carga automatizada y debe recibir únicamente los permisos que requiere.' },
        { domain: 'Platform administration', question: 'Una compute policy clásica establece límites de configuración. ¿Qué afirmación es correcta?', options: ['Garantiza un gasto máximo serverless', 'Restringe cómputo clásico; no es una garantía de presupuesto serverless', 'Elimina la necesidad de revisar permisos', 'Existe para desplegar redes privadas en Free Edition'], answer: 1, explanation: 'Las políticas clásicas restringen configuración y requieren Premium en Azure; no garantizan presupuesto serverless.' },
        { domain: 'Platform administration', question: 'Editas una compute policy. ¿Qué ocurre automáticamente con todo el cómputo existente?', options: ['Se reinicia de inmediato', 'Se elimina al guardar', 'No se modifica retroactivamente por ese cambio', 'Se convierte en serverless'], answer: 2, explanation: 'Los cambios de una política no actualizan retroactivamente recursos existentes; hace falta revisar su aplicación.' },
        { domain: 'Governance and Security', question: '¿Qué garantiza la ocultación de salida de secretos frente a una persona autorizada a leerlos?', options: ['No garantiza impedir extracción o transformaciones', 'Bloquea cualquier transformación', 'Revoca sus permisos al ejecutar una celda', 'Convierte todo secreto en dato público seguro'], answer: 0, explanation: 'La ocultación es de mejor esfuerzo: no reemplaza permisos ni impide que lectores autorizados extraigan secretos.' },
        { domain: 'Platform administration', question: '¿Qué modelo requiere un secret scope respaldado por Azure Key Vault?', options: ['Solo Azure RBAC', 'Ningún permiso en Azure', 'Un tag en una tabla', 'Vault access policy'], answer: 3, explanation: 'La integración de scopes Key Vault requiere Vault access policy, no el modelo Azure RBAC.' },
        { domain: 'Platform administration', question: 'Restringes el tráfico de usuarios hacia el workspace. ¿Qué debes evaluar por separado?', options: ['Solo el título del notebook', 'La salida de serverless y la conectividad clásica según origen y destino', 'Nada: toda la red queda privada', 'El orden de filas en una vista'], answer: 1, explanation: 'Entrada al workspace, conectividad clásica y salida serverless son fronteras distintas con controles propios.' },
        { domain: 'Governance and Security', question: '¿Cuál es una interpretación prudente de system.access.audit?', options: ['Es siempre global e instantánea', 'Retiene todos los datos para siempre', 'Los eventos de cuenta usan workspace_id 0; considera región, latencia y retención', 'Un CASE con ALLOW inserta un permiso real en ella'], answer: 2, explanation: 'La auditoría en Public Preview no es en tiempo real; distingue eventos de cuenta, eventos regionales y retención aplicable.' },
        { type: 'hotspot', domain: 'Platform administration', screen: 's11-groups', answer: 'manage', question: 'En esta maqueta empresarial de Settings → Identity and access, ¿qué control abre la administración de Groups?', explanation: 'Groups → Manage abre la administración correspondiente. Es una ruta empresarial, no disponible en Free Edition; aquí no cambias nada.' },
        { type: 'hotspot', domain: 'Platform administration', screen: 's11-account', answer: 'manageAccount', question: 'En el selector de workspace de la maqueta empresarial, ¿por dónde comienzas para llegar a los grupos de cuenta?', explanation: 'Manage account lleva a la consola de cuenta; después User management → Groups. Free Edition no incluye esa consola.' },
        { type: 'hotspot', domain: 'Platform administration', screen: 's11-policies', answer: 'editJson', question: 'En la maqueta empresarial de Definitions, ¿qué control permite ver la definición JSON de una política clásica?', explanation: 'Edit definition as JSON es el control documentado. Identificarlo no despliega una política; no guardes cambios reales.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's11-audit', answer: 'audit', question: 'Solo si ya está habilitado y autorizado, ¿qué objeto de Catalog → system → access corresponde a la auditoría?', explanation: 'audit corresponde a system.access.audit. Su acceso no está garantizado en Free Edition y un rechazo no autoriza a cambiar permisos.' },
      ],
    },
  };
})(globalThis);
