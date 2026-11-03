// Original content; official sources and UI paths verified by the parent's research handoff.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const MS = 'https://learn.microsoft.com/en-us/azure/databricks';
  const source = (label, path) => ({ label, url: `${MS}/${path}` });
  const roles = source('Administrative responsibilities', 'admin/admin-concepts');
  const identities = source('Identity administration', 'admin/users-groups/');
  const practices = source('Account groups and service principals', 'admin/users-groups/best-practices');
  const groups = source('Manage groups: UI paths', 'admin/users-groups/manage-groups');
  const policies = source('Compute policies: scope and interface', 'admin/clusters/policies');
  const secrets = source('Secrets and redaction limits', 'security/secrets/');
  const network = source('Network security', 'security/network/');
  const audit = source('Audit reference', 'admin/system-tables/audit-logs');
  const free = { label: 'Free Edition limitations', url: 'https://docs.databricks.com/aws/en/getting-started/free-edition-limitations' };
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.en.s11 = {
    deepDive: [
      {
        title: 'Three administrative scopes, not one master key',
        body: [
          'Account admins manage account resources and identities; workspace admins configure and administer their workspace; metastore admins handle the Unity Catalog scope. These are separate responsibilities: administering an account does not automatically grant access to every workspace or mean being able to read every table.',
          'When diagnosing a denial, first identify the scope: account identity, workspace assignment or access, and data object permissions. A fix in the wrong scope can increase privileges without addressing the cause. Separate administration from everyday execution and assign only the privileges needed.',
        ],
        source: roles,
      },
      {
        title: 'Identity, workspace access and authorization answer different questions',
        body: [
          'An identity represents a person or application. Entitlements enable workspace capabilities; object permissions determine specific operations. Being able to sign in does not prove that a person can modify a table, and a data permission does not replace access to the workspace where a query runs.',
          'Automatic identity management from Microsoft Entra ID is the preferred option for new accounts that support it. SCIM remains an alternative provisioning approach, not a universal requirement. Do not describe synchronization as instantly revoking every session, credential or permission: verify the offboarding lifecycle and its scope.',
        ],
        source: identities,
      },
      {
        title: 'Account groups and a dedicated automation identity',
        body: [
          'For Unity Catalog, use account-level groups rather than relying on workspace-local groups. Centralizing membership supports the same access model across workspaces. Local groups are not an interchangeable substitute for Unity Catalog authorization.',
          'Service principals represent automated workloads. They separate a process identity from the personal account of its creator, but are not administrators by definition. Assign only the permissions the process needs and review its group access too; an identity name does not guarantee least privilege.',
        ],
        source: practices,
      },
      {
        title: 'Compute policies: configuration constraints, not a guaranteed budget',
        body: [
          'Compute policies constrain classic compute configurations, such as size ranges, automatic termination and tags. They require Premium on Azure Databricks. They control allowed configurations and who can use a policy, rather than guaranteeing a maximum spend or configuring serverless worker sizes.',
          'Changing a policy does not retroactively modify existing compute. Review how resources will be updated and who retains the ability to create unrestricted compute. In the lab you only evaluate a Boolean rule over three rows; you do not create policies or demonstrate serverless cost controls.',
        ],
        source: policies,
      },
      {
        title: 'Secret scopes and output redaction are different protections',
        body: [
          'Secrets avoid embedding sensitive values in notebooks. Databricks-backed and Azure Key Vault-backed scopes have different administration: the latter provides read-only access from Databricks to secrets managed in Azure. Key Vault scopes require the Vault access policy model, not Azure RBAC.',
          'Output redaction is best effort and does not prevent an authorized user from extracting or transforming a value. Permissions and careful handling remain essential. Never print a secret to check whether it gets redacted; this lab does not create, read or request real credentials.',
        ],
        source: secrets,
      },
      {
        title: 'Networking has separate ingress and egress boundaries',
        body: [
          'Separate access from users and tools into Databricks, classic compute connectivity, and serverless compute egress to data services. An ingress control for a workspace does not by itself configure serverless egress, and a classic network configuration should not be assumed to apply to every plane.',
          'Before choosing a network feature, identify the source, destination, traffic direction and compute type. Capabilities depend on the product and deployment. Free Edition does not allow custom private networks, so this exercise needs no private endpoints, Azure resources or firewall changes.',
        ],
        source: network,
      },
      {
        title: 'system.access.audit: scope, latency and retention',
        body: [
          'The audit table is documented as Public Preview. event_time, service_name, action_name, user_identity and response help reconstruct activity. Account events use workspace_id = 0; queryable workspace events cover the region. Do not interpret a regional query as a universal view of the whole account.',
          'Delivery is not real time: an immediately missing row does not prove an operation never happened. The documented default retention is 365 days, not a universal constant for every audit source or configuration. Confirm scope, availability, retention and permissions before treating it as operational evidence.',
        ],
        source: audit,
      },
      {
        title: 'Learn administration without administering a real account',
        body: [
          'Free Edition provides restricted serverless compute and does not include the account console, account APIs, SCIM, private networks or custom compute. Real audit access is not guaranteed. This session uses original simplified enterprise illustrations, not screenshots or promises of availability in your free account.',
          'The required lab uses SQL temporary views with synthetic data only. A CASE returning ALLOW does not enforce an ACL, and a size expression does not deploy a compute policy. This separation lets you verify results without touching identities, permissions, secrets or persistent objects.',
        ],
        source: free,
      },
    ],
    diagram: {
      title: 'Identity → scope → control → evidence',
      caption: 'Conceptual map based on the administration, policy, networking and audit sources cited above. The boundaries are not interchangeable and the synthetic lab examples do not implement these controls.',
      layers: [
        { label: 'Account identity', nodes: ['People and account groups', 'Service principals for automation'] },
        { label: 'Administrative scope', nodes: ['Account: resources and identities', 'Workspace: access and configuration', 'Metastore: Unity Catalog'] },
        { label: 'Separate controls', nodes: ['Object authorization', 'Classic compute policies', 'Secrets and networking: distinct boundaries'] },
        { label: 'Evidence', nodes: ['Audit: regional and account events', 'Verify latency and retention', 'Lab: synthetic data only'] },
      ],
    },
    comparison: {
      title: 'What each control addresses and what it does not prove',
      headers: ['Control', 'Question it addresses', 'Not equivalent to', 'Practice in this session'],
      rows: [
        ['Identity and account groups', 'Who is the person or application?', 'Automatic access to every workspace and table', 'Conceptual group inspection'],
        ['Entitlements and permissions', 'Which capabilities and operations are allowed?', 'Sign-in authorizing every write', 'Synthetic CASE; no ACL enforced'],
        ['Classic compute policy', 'Which classic configuration can be chosen?', 'Guaranteed serverless budget or retroactive changes', 'Three simulated configurations'],
        ['Secret scope', 'Who can retrieve the secret?', 'Infallible redaction against an authorized reader', 'Theory; no real secrets'],
        ['Network controls', 'Which source and destination can communicate?', 'One rule for ingress, classic and serverless', 'Conceptual map; no network changes'],
        ['Audit', 'What activity was recorded in this scope?', 'A complete real-time monitor', 'Four synthetic events; optional real read'],
      ],
      sources: [roles, identities, practices, policies, secrets, network, audit, free],
    },
    lab: {
      title: 'Investigate security with temporary views in Free Edition',
      goal: 'Analyze four synthetic events, distinguish simulated decisions from real permissions, and evaluate a compute rule without creating credentials, changing permissions or persisting objects.',
      minutes: 55,
      requirements: [
        'A SQL notebook with serverless compute in Databricks Free Edition; keep the same session for all temporary views.',
        'No Azure subscription, admin privileges, secrets or system.access.audit access required. Do not run GRANT, ALTER, CREATE TABLE or administrative changes.',
        'Reserve s11_* names for this exercise in a fresh session. The four administrative mocks are enterprise-only and are studied here without opening or saving real configurations.',
      ],
      steps: [
        {
          title: 'Recognize the lab boundary and workspace groups',
          body: 'Open a serverless SQL notebook. Study the enterprise mock Settings → Identity and access → Groups → Manage, unavailable in Free Edition. Only identify the path; do not add members or save changes in a real workspace. The mocks provide orientation, not permission grants.',
          check: 'You distinguish the enterprise illustration from the SQL exercise that you can run in Free Edition.',
          screen: { id: 's11-groups', highlight: ['settings', 'identity', 'groups', 'manage'] },
        },
        {
          title: 'Distinguish account groups from local administration',
          body: 'In the mock, the workspace selector leads to Manage account → User management → Groups. This is an enterprise concept: Free Edition has no account console. Compare its scope with the previous screen and remember that account groups are recommended for Unity Catalog. Do not change real identities.',
          check: 'You identify two different scopes and explain why an account admin does not automatically gain access to a workspace.',
          screen: { id: 's11-account', highlight: ['manageAccount', 'userManagement', 'groups'] },
        },
        {
          title: 'Create four entirely synthetic events',
          body: 'Run the SQL in the same session. Email addresses use the reserved .invalid domain and do not represent real people. named_struct reproduces only the fields needed for practice; this is neither a complete copy of the audit schema nor evidence of real activity.',
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
          check: 'events = 4. No table, schema or real audit record was created.',
        },
        {
          title: 'Solve the query for the latest Unity Catalog actions',
          body: 'Replace the real source in the base exercise with the synthetic view. Keep the nested names user_identity.email and response.statusCode. Explicitly order by descending time and use event_id as a tiebreaker so the read is deterministic.',
          code: { language: 'sql', code: `SELECT event_id, event_time, user_identity.email AS actor,
       action_name, response.statusCode AS status_code
FROM s11_audit_demo
WHERE service_name = 'unityCatalog'
ORDER BY event_time DESC, event_id DESC
LIMIT 20;` },
          check: 'Three rows, in order: id 4 / 09:03 / job@example.invalid / getTable / 200; id 2 / 09:01 / job@example.invalid / getTable / 403; id 1 / 09:00 / ana@example.invalid / getTable / 200. All are dated 2026-01-05.',
        },
        {
          title: 'Count outcomes and isolate the denial',
          body: 'Group by service and code, then query only errors in the synthetic set. A 403 is a clue to investigate authorization; these invented rows do not prove the cause of an incident or that getTable is equivalent to reading every row in a table.',
          code: { language: 'sql', code: `SELECT service_name, response.statusCode AS status_code, count(*) AS n
FROM s11_audit_demo
GROUP BY service_name, response.statusCode
ORDER BY service_name, status_code;
SELECT event_id, user_identity.email AS actor, response.statusCode AS status_code
FROM s11_audit_demo
WHERE response.statusCode >= 400
ORDER BY event_id;` },
          check: 'Groups: jobs / 200 / 1; unityCatalog / 200 / 2; unityCatalog / 403 / 1. The filter returns only id 2, job@example.invalid, 403.',
        },
        {
          title: 'Simulate three decisions without enforcing an ACL',
          body: 'The request list has an explicit order. CASE implements a teaching rule for analysts reads and job_writer writes. ALLOW and DENY are computed strings: they do not represent permissions granted or denied by Databricks, nor prove real group membership.',
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
          check: 'id 1 analysts SELECT → ALLOW; id 2 analysts MODIFY → DENY; id 3 job_writer MODIFY → ALLOW. No ACL, identity or membership changed.',
        },
        {
          title: 'Evaluate a compute rule, not a deployed policy',
          body: 'Study the enterprise mock Compute → Policies → Create policy → Definitions → Edit definition as JSON and See all permissions, unavailable in Free Edition. Do not save anything. The SQL below only evaluates workers <= 2 and minutes <= 30 over invented rows; it is not policy JSON and does not constrain serverless.',
          code: { language: 'sql', code: `CREATE OR REPLACE TEMP VIEW s11_compute_demo AS
SELECT * FROM VALUES (1, 2, 15), (2, 8, 15), (3, 2, 120)
AS v(config_id, workers, minutes);
SELECT config_id, workers, minutes,
       (workers <= 2 AND minutes <= 30) AS within_simulated_rule
FROM s11_compute_demo
ORDER BY config_id;` },
          check: 'id 1 (2,15) → true; id 2 (8,15) → false; id 3 (2,120) → false. No compute policy was deployed.',
          screen: { id: 's11-policies', highlight: ['compute', 'policies', 'createPolicy', 'definitions', 'editJson', 'permissions'] },
        },
        {
          title: 'Optional real read: existing authorization only',
          body: 'Skip this step in Free Edition if you lack access; it is not guaranteed. In an already authorized enterprise environment, Catalog → system → access → audit locates the table if enabled. The query is read-only and time-bounded. If permissions or availability cause it to fail, stop: do not issue grants, enable schemas or request secrets to complete it.',
          code: { language: 'sql', code: `-- OPTIONAL: existing authorized access only.
SELECT event_time, workspace_id, user_identity.email AS actor,
       service_name, action_name, response.statusCode AS status_code
FROM system.access.audit
WHERE event_time >= current_timestamp() - INTERVAL 1 DAY
  AND service_name = 'unityCatalog'
ORDER BY event_time DESC
LIMIT 20;` },
          check: 'Variable result: 0 to 20 real rows, or a skipped step/access denial. Do not expect the four fictional events or change permissions. Consider region, latency, Public Preview and applicable retention.',
          screen: { id: 's11-audit', highlight: ['catalog', 'system', 'access', 'audit'] },
        },
        {
          title: 'Clean up only the exercise temporary views',
          body: 'After comparing the results, drop only the three temporary views created in this session. Do not delete objects in the system catalog or administrative resources. If you repeated steps in another session, return to that session to clean up its views; temporary views are not persistent tables.',
          code: { language: 'sql', code: `DROP VIEW IF EXISTS s11_audit_demo;
DROP VIEW IF EXISTS s11_requests_demo;
DROP VIEW IF EXISTS s11_compute_demo;` },
          check: 'The three exercise temporary views no longer exist in this session; no table was deleted and no real controls changed.',
        },
      ],
      wrapUp: 'You obtained four events, three Unity Catalog actions ordered 4, 2, 1 and a single denial: id 2. The ALLOW/DENY/ALLOW and true/false/false outcomes are simulations, not deployed controls. You cleaned up only temporary views and kept the Free Edition exercise separate from enterprise administration.',
      sources: [free, roles, identities, practices, groups, policies, secrets, network, audit],
    },
    certification: {
      intro: 'Original practice, not real exam questions. The Platform Administrator accreditation informs administrative concepts; Data Engineer Associate Governance and Security informs data security concepts. Enterprise administration is studied through mocks without changing a real account.',
      exams: [
        { name: 'Databricks Platform Administrator Accreditation', url: 'https://www.databricks.com/learn/certification/platform-administrator-accreditation', domains: ['Platform administration'] },
        { name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Governance and Security'] },
      ],
      questions: [
        { domain: 'Platform administration', question: 'A person is an account admin. What can you assume about access to a specific workspace?', options: ['They can automatically enter all of them', 'You must verify access; the account role does not automatically grant it', 'They own every table in it', 'They need no user identity'], answer: 1, explanation: 'These are distinct scopes: administering an account does not mean automatic access to each workspace.' },
        { domain: 'Governance and Security', question: 'Which groups do official best practices recommend for authorizing Unity Catalog objects?', options: ['Only local groups in each workspace', 'Any list written in a notebook', 'Account-level groups', 'Groups defined by file names'], answer: 2, explanation: 'Account groups centralize membership and Unity Catalog authorization across workspaces.' },
        { domain: 'Platform administration', question: 'For a supported new account, which identity approach is preferred instead of assuming SCIM is mandatory?', options: ['Automatic identity management from Microsoft Entra ID', 'Manually copying passwords to notebooks', 'Deleting all groups', 'Using an admin personal account for everything'], answer: 0, explanation: 'Automatic identity management is preferred for supported new accounts; SCIM is an alternative.' },
        { domain: 'Governance and Security', question: 'Which identity best fits an automated workload that must not depend on a person?', options: ['A shared team email', 'A permanent personal admin', 'A local group as a password', 'A least-privilege service principal'], answer: 3, explanation: 'A service principal represents an automated workload and should receive only the permissions it requires.' },
        { domain: 'Platform administration', question: 'A classic compute policy sets configuration limits. Which statement is correct?', options: ['It guarantees a maximum serverless spend', 'It constrains classic compute; it is not a serverless budget guarantee', 'It removes the need to review permissions', 'It deploys private networks in Free Edition'], answer: 1, explanation: 'Classic policies constrain configuration and require Premium on Azure; they do not guarantee a serverless budget.' },
        { domain: 'Platform administration', question: 'You edit a compute policy. What happens automatically to all existing compute?', options: ['It restarts immediately', 'It is deleted on save', 'It is not retroactively modified by that change', 'It becomes serverless'], answer: 2, explanation: 'Policy changes do not retroactively update existing resources; their application needs to be reviewed.' },
        { domain: 'Governance and Security', question: 'What does secret output redaction guarantee against a person authorized to read the secret?', options: ['It does not guarantee prevention of extraction or transformations', 'It blocks every transformation', 'It revokes their permissions when a cell runs', 'It makes every secret safely public'], answer: 0, explanation: 'Redaction is best effort: it does not replace permissions or prevent authorized readers from extracting secrets.' },
        { domain: 'Platform administration', question: 'Which model does an Azure Key Vault-backed secret scope require?', options: ['Azure RBAC only', 'No Azure permissions', 'A table tag', 'Vault access policy'], answer: 3, explanation: 'The Key Vault scope integration requires Vault access policy, not the Azure RBAC model.' },
        { domain: 'Platform administration', question: 'You restrict user traffic into a workspace. What must you evaluate separately?', options: ['Only the notebook title', 'Serverless egress and classic connectivity by source and destination', 'Nothing: the whole network is now private', 'The row order in a view'], answer: 1, explanation: 'Workspace ingress, classic connectivity and serverless egress are different boundaries with their own controls.' },
        { domain: 'Governance and Security', question: 'Which is a cautious interpretation of system.access.audit?', options: ['It is always global and instantaneous', 'It keeps every record forever', 'Account events use workspace_id 0; consider region, latency and retention', 'A CASE returning ALLOW inserts a real permission into it'], answer: 2, explanation: 'Public Preview auditing is not real time; distinguish account events, regional events and applicable retention.' },
        { type: 'hotspot', domain: 'Platform administration', screen: 's11-groups', answer: 'manage', question: 'In this enterprise Settings → Identity and access mock, which control opens Groups administration?', explanation: 'Groups → Manage opens the relevant administration. This enterprise path is unavailable in Free Edition; you change nothing here.' },
        { type: 'hotspot', domain: 'Platform administration', screen: 's11-account', answer: 'manageAccount', question: 'In the enterprise workspace selector mock, where do you start to reach account groups?', explanation: 'Manage account leads to the account console, then User management → Groups. Free Edition does not include that console.' },
        { type: 'hotspot', domain: 'Platform administration', screen: 's11-policies', answer: 'editJson', question: 'In the enterprise Definitions mock, which control shows a classic policy JSON definition?', explanation: 'Edit definition as JSON is the documented control. Identifying it does not deploy a policy; do not save real changes.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's11-audit', answer: 'audit', question: 'Only if already enabled and authorized, which object under Catalog → system → access represents auditing?', explanation: 'audit corresponds to system.access.audit. Access is not guaranteed in Free Edition and a denial does not authorize permission changes.' },
      ],
    },
  };
})(globalThis);
