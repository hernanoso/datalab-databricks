// Original content based on official sources supplied by the parent researcher.
(function (root) {
  const D = root.DataLab = root.DataLab || {};
  D.deep = D.deep || {};
  D.deep.en = D.deep.en || {};
  const BASE = 'https://docs.databricks.com/aws/en/';
  const source = (label, path) => ({ label, url: BASE + path });
  const uc = 'data-governance/unity-catalog/';
  const sources = [
    source('Unity Catalog object model', uc),
    source('Managed versus external', uc + 'managed-versus-external'),
    source('Storage credentials and external locations', 'connect/unity-catalog/cloud-storage/'),
    source('Volumes', 'volumes/'),
    source('Volume privileges', 'volumes/privileges'),
    source('Permission inheritance', uc + 'access-control/permissions-concepts'),
    source('Privilege reference', uc + 'access-control/privileges-reference'),
    source('Manage privileges in Catalog', uc + 'manage-privileges/'),
    source('Data lineage', uc + 'data-lineage/'),
    source('Free Edition limitations', 'getting-started/free-edition-limitations'),
  ];
  D.deep.en.s10 = {
    deepDive: [
      { title: 'Names locate objects; the metastore contains catalogs', body: [
        'Unity Catalog organizes tables, views, volumes and other schema objects under catalog.schema.object. The metastore contains catalogs; it is not a fourth component of a table name. Fully qualified names make the intended destination explicit instead of depending on the current notebook namespace.',
        'Storage credentials and external locations are registered directly under the metastore, not inside a schema. Keep the logical namespace separate from the storage-access model: a catalog contains schemas, while a storage credential describes authentication rather than a business dataset.',
      ], source: sources[0] },
      { title: 'Managed and external both remain governed', body: [
        'For managed tables, Unity Catalog manages storage and the data lifecycle. For external tables, Unity Catalog governs registered access and metadata, while the user controls the underlying files and their lifecycle. External does not mean ungoverned, and managed does not mean data lives inside notebook memory.',
        'Dropping an external table does not delete its underlying files. Managed deletion follows the documented recovery and deletion lifecycle rather than guaranteeing immediate physical erasure. Do not use DROP as a secure-erasure procedure or assume that every dropped managed table is instantly unrecoverable.',
      ], source: sources[1] },
      { title: 'Authentication and an authorized path are separate objects', body: [
        'A storage credential represents authentication to cloud storage. An external location associates a cloud path with that credential and defines a governed storage boundary. Merely knowing an abfss or cloud URI does not supply either cloud authorization or Unity Catalog privileges.',
        'External locations can also support managed storage; their name does not restrict them to external tables. Keep cloud identities out of learning notebooks. The core lab uses managed tables and a managed volume, so it does not need a credential, a personal storage account or a custom workspace storage configuration.',
      ], source: sources[2] },
      { title: 'Tables expose rows; volumes expose files', body: [
        'Use SELECT for relational table reads and READ VOLUME for file reads through a volume. WRITE VOLUME authorizes writing files; SELECT on a table does not authorize writing a neighboring text file. Both routes also require the relevant USE CATALOG and USE SCHEMA privileges.',
        'The path /Volumes/catalog/schema/volume identifies governed files rather than a SQL table. A managed volume is suitable for this tiny text-file exercise. Creating it requires CREATE VOLUME on the schema as well as access to the parent containers; existing ownership or inherited privileges can supply access.',
      ], source: sources[4] },
      { title: 'Inheritance is not inherited ownership', body: [
        'Eligible privileges granted on catalogs and schemas inherit to their child objects, including future children. This makes broad parent grants powerful: granting SELECT at a schema can expose more than one table. Ownership itself is not inherited, so owning a catalog does not make the principal the owner of every child table.',
        'Effective access can come from direct grants, parent inheritance, group membership or ownership capabilities. Revoking one direct SELECT grant does not prove that access has disappeared. A self-revoke by the object creator is therefore not a valid negative-access test, and this lab does not attempt it.',
      ], source: sources[5] },
      { title: 'Build the minimum reader privilege chain', body: [
        'An ordinary non-owner table reader needs USE CATALOG on the catalog, USE SCHEMA on the schema and SELECT on the table. USE privileges allow the container path to be used; they do not themselves grant table data access. MODIFY concerns data modification rather than read-only reporting.',
        'Prefer an authorized account group over ad hoc individual grants. Design the three-part reader chain before any change, check existing inherited access, and have an authorized administrator apply it when needed. The lab inspects permissions only: it does not invent a group, grant to all users or transfer ownership.',
      ], source: sources[6] },
      { title: 'The Permissions UI represents real security changes', body: [
        'The documented route is Catalog, select an object, Permissions, Grant, choose the principal and privileges, then OK. The last action applies a change; it is not a harmless preview. Our original simplified illustrations separate locating the control from actually granting access.',
        'Inspect the dedicated lab objects without altering real grants. If your role cannot inspect every entry, record that visibility boundary rather than escalating privileges. A missing permission is an authorization outcome to discuss with the owner, not a reason to use a cloud key or broaden the catalog permissions.',
      ], source: sources[7] },
      { title: 'Lineage supports impact analysis, not complete proof of absence', body: [
        'Unity Catalog captures lineage for supported SQL and DataFrame operations. The lab CTAS expresses an explicit dependency from orders to region_totals, so a downstream change can be traced back to its source. Lineage describes dependencies, whereas an aggregate query checks the actual values produced.',
        'Open the output object, select Lineage and See Lineage Graph. Capture can take time and the graph is filtered by permissions; an absent node does not prove that no dependency exists. Keep the CTAS text and exact totals as deterministic evidence even if the graph is not yet visible in your workspace.',
      ], source: sources[8] },
      { title: 'Free Edition is a scoped learning environment', body: [
        'Free Edition uses serverless compute and does not provide the account console or custom workspace storage configuration. Practice the available Unity Catalog objects inside your writable catalog instead of making account-administration or cloud-provisioning access a prerequisite for this session.',
        'These limits do not justify claiming that all external locations are universally forbidden. The optional Azure design requires a subscription, an Access Connector, suitable storage roles and Unity Catalog privileges in an appropriate workspace. It is separate from the executable Free Edition lab and requires no real provisioning here.',
      ], source: sources[9] },
    ],
    diagram: {
      title: 'Logical objects and storage access are distinct branches',
      caption: 'Conceptual model, not a mandatory physical layout. Schema objects use three-part names. Credentials and external locations attach directly to the metastore; an external location can also support managed storage.',
      layers: [
        { label: 'Metastore', nodes: ['Catalogs', 'Storage credentials', 'External locations'] },
        { label: 'Logical namespace', nodes: ['Catalog → schema → orders', 'Catalog → schema → region_totals', 'Catalog → schema → lab_files volume'] },
        { label: 'Access decisions', nodes: ['USE CATALOG + USE SCHEMA + SELECT', 'USE CATALOG + USE SCHEMA + READ/WRITE VOLUME'] },
        { label: 'Storage and evidence', nodes: ['Managed lifecycle or user-controlled external files', 'orders → CTAS → region_totals lineage', 'Credential + path → external location'] },
      ],
    },
    comparison: {
      title: 'Choose the object by responsibility',
      headers: ['Object', 'Responsibility', 'Access distinction', 'Lifecycle / scope'],
      rows: [
        ['Managed table', 'Typed relational rows', 'SELECT / MODIFY plus parent USE', 'Unity Catalog manages storage lifecycle'],
        ['External table', 'Governed metadata over external files', 'SELECT / MODIFY plus parent USE', 'User controls files; DROP preserves them'],
        ['Managed volume', 'Direct governed file access', 'READ VOLUME / WRITE VOLUME plus parent USE', 'Schema object; managed file lifecycle'],
        ['Storage credential', 'Cloud authentication', 'Not a table SELECT grant', 'Metastore-level object'],
        ['External location', 'Cloud path linked to a credential', 'Storage-path privileges, not a substitute for table SELECT', 'Metastore-level; can support managed storage'],
      ],
      sources: sources.slice(0, 7),
    },
    lab: {
      title: 'A tiny governed dataset in Free Edition',
      goal: 'Create isolated managed tables and a volume, verify exact aggregates, inspect privileges and locate lineage without credentials, real grant changes or destructive cleanup.',
      minutes: 65,
      requirements: [
        'Free Edition with serverless notebook access and a writable catalog. Required creation privileges: USE CATALOG, USE SCHEMA and CREATE TABLE / CREATE VOLUME in the lab schema; CREATE SCHEMA on the catalog to create that schema.',
        'Use only the synthetic values below. Replace <catalog> with your writable current_catalog() result and SUFFIX with a new alphanumeric suffix, for example a timestamp. Keep the same suffix throughout.',
        'Run creation cells once in order. CREATE statements intentionally omit IF NOT EXISTS and OR REPLACE: any collision stops the exercise. Never continue using an existing schema; choose a fresh suffix and restart.',
      ],
      steps: [
        { title: 'Discover context without changing it', body: 'In a serverless notebook run the read-only query. Record the catalog for substitution and inspect your identity privately; do not publish identity output. If the current catalog is not writable, ask for an authorized learning catalog rather than modifying shared permissions.', code: { language: 'sql', code: 'SELECT current_catalog() AS catalog, current_user() AS principal;' }, check: 'You know the authorized catalog and understand that the current identity will create and own the new objects.' },
        { title: 'Reserve a new schema', body: 'Substitute the catalog and a fresh SUFFIX before execution. Do not reuse a schema from another run. If CREATE fails, stop before any later write; a permission error needs an authorized owner, while a name collision needs a new suffix.', code: { language: 'sql', code: 'CREATE SCHEMA <catalog>.s10_lab_SUFFIX;\nUSE CATALOG <catalog>;\nUSE SCHEMA s10_lab_SUFFIX;' }, check: 'A newly created dedicated schema is selected; no existing schema or table was replaced.' },
        { title: 'Create three synthetic managed rows', body: 'Create a managed Delta table without LOCATION and insert the three known rows once. Decimal arithmetic avoids floating-point ambiguity. If the creation fails, do not run the INSERT against any pre-existing object.', code: { language: 'sql', code: "CREATE TABLE orders (order_id INT, region STRING, amount DECIMAL(12,2)) USING DELTA;\nINSERT INTO orders VALUES (1, 'north', 10.00), (2, 'south', 20.00), (3, 'north', 5.50);\nSELECT count(*) AS orders, sum(amount) AS total FROM orders;" }, check: 'Exactly 3 orders and total 35.50. Do not rerun INSERT; a rerun would add duplicates.' },
        { title: 'Materialize a traceable aggregate', body: 'CTAS reads the three source rows and creates a second managed table. Use the explicit fully qualified names so the dependency is unambiguous. Do not replace a previous aggregate; stop on a collision.', code: { language: 'sql', code: 'CREATE TABLE <catalog>.s10_lab_SUFFIX.region_totals USING DELTA AS\nSELECT region, count(*) AS orders, sum(amount) AS total\nFROM <catalog>.s10_lab_SUFFIX.orders GROUP BY region;\nSELECT * FROM <catalog>.s10_lab_SUFFIX.region_totals ORDER BY region;' }, check: 'north has 2 orders and 15.50; south has 1 order and 20.00. Two output rows sum to 35.50.' },
        { title: 'Inspect metadata in SQL and Catalog', body: 'Inspect only your newly created tables. Open Catalog and find your catalog, new schema and orders object. DESCRIBE provides metadata, not a reason to manipulate its physical files directly.', code: { language: 'sql', code: 'DESCRIBE TABLE EXTENDED <catalog>.s10_lab_SUFFIX.orders;\nSHOW TABLES IN <catalog>.s10_lab_SUFFIX;' }, check: 'orders is managed and region_totals exists in the dedicated schema.', screen: { id: 's10-object', highlight: ['s10-catalog', 's10-orders', 's10-overview'] } },
        { title: 'Inspect effective-access inputs', body: 'On orders open Permissions. Read the owner and available grants; distinguish direct privileges from inherited access. These read-only statements inspect the parent containers too. Do not revoke your own rights to simulate a reader: ownership and group inheritance can retain access.', code: { language: 'sql', code: 'SHOW GRANTS ON CATALOG <catalog>;\nSHOW GRANTS ON SCHEMA <catalog>.s10_lab_SUFFIX;\nSHOW GRANTS ON TABLE <catalog>.s10_lab_SUFFIX.orders;' }, check: 'You can explain why SELECT alone is insufficient for an ordinary reader and why a direct revoke is not proof of denial.', screen: { id: 's10-permissions', highlight: ['s10-permissions', 's10-owner', 's10-privileges'] } },
        { title: 'Rehearse a reader grant without applying it', body: 'Use only this simplified illustration to locate Grant, SELECT and OK. In a real authorized workflow the group would need USE CATALOG, USE SCHEMA and SELECT on orders; file reading instead needs READ VOLUME. Do not select a real principal, submit OK, transfer ownership or execute GRANT in this exercise.', check: 'You can describe Catalog → object → Permissions → Grant → OK, while all real grants remain unchanged.', screen: { id: 's10-grant', highlight: ['s10-principals', 's10-select', 's10-ok'] } },
        { title: 'Inspect the CTAS lineage', body: 'Select region_totals in Catalog, open Lineage and click See Lineage Graph. Look for orders upstream of region_totals. If capture is delayed, revisit later; if permissions hide details, record that limitation rather than broadening access. The SQL totals remain independently checkable.', check: 'The expected edge is orders → region_totals; a delayed or permission-filtered graph is documented rather than treated as missing data.', screen: { id: 's10-lineage', highlight: ['s10-lineage', 's10-graph', 's10-source', 's10-output'] } },
        { title: 'Create the managed file container', body: 'Return to the same notebook and create one managed volume without an external path. Creating a volume requires CREATE VOLUME on the schema; writing its contents uses WRITE VOLUME with parent USE privileges. Stop on any error instead of borrowing a shared volume.', code: { language: 'sql', code: 'CREATE VOLUME <catalog>.s10_lab_SUFFIX.lab_files;' }, check: 'lab_files is new and managed; its governed path is /Volumes/<catalog>/s10_lab_SUFFIX/lab_files.' },
        { title: 'Write and read one harmless file', body: 'Switch this cell to Python and substitute the same catalog and suffix. overwrite=False refuses to replace an existing file. The fixed UTF-8 text is synthetic, contains no identity or credential, and is read back exactly. Do not retry with overwrite enabled if a collision occurs.', code: { language: 'python', code: 'path = "/Volumes/<catalog>/s10_lab_SUFFIX/lab_files/hello.txt"\ntext = "s10 synthetic governance lab"\ndbutils.fs.put(path, text, overwrite=False)\nassert dbutils.fs.head(path, 1024) == text\nprint("s10 file verified")' }, check: 'The cell prints s10 file verified after exact comparison. READ VOLUME and WRITE VOLUME are distinct from table SELECT.' },
        { title: 'Reconcile outputs and leave the namespace intact', body: 'Run only read-only verification now. Keeping these tiny dedicated objects avoids unsafe cleanup instructions. Do not drop a shared catalog, change retention, transfer ownership or use CASCADE. No Azure provisioning is required; optionally sketch credential + path → external location on paper with subscription, Access Connector and privileges as prerequisites.', code: { language: 'sql', code: 'SELECT count(*) AS regions, sum(orders) AS orders, sum(total) AS total\nFROM <catalog>.s10_lab_SUFFIX.region_totals;\nSELECT count(*) AS orders, sum(amount) AS total\nFROM <catalog>.s10_lab_SUFFIX.orders;' }, check: 'Aggregate: 2 regions, 3 orders, 35.50. Source: 3 orders, 35.50. Only a fresh schema, two tables, one volume and one harmless text file were created.' },
      ],
      wrapUp: 'You separated namespace, storage authentication, relational access and file access. The lab preserves 3 orders totaling 35.50 and a two-row aggregate with north 15.50 and south 20.00. Permissions were inspected, not changed; lineage visibility is not used as the arithmetic oracle. Retain the exact dedicated schema name for any later owner-authorized cleanup.',
      sources,
    },
    certification: {
      intro: 'Original practice aligned with the current May 4, 2026 Data Engineer Associate outline, specifically Governance and Security. These are not real exam questions. The mock interfaces are simplified original illustrations, not screenshots.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf', domains: ['Governance and Security'] }],
      questions: [
        { domain: 'Governance and Security', question: 'Which is a fully qualified table name?', options: ['metastore.catalog.schema.table', 'catalog.schema.table', '/Volumes/catalog/schema', 'workspace.notebook'], answer: 1, explanation: 'The table namespace has three components; the metastore contains catalogs but is not part of that name.' },
        { domain: 'Governance and Security', question: 'Where are storage credentials and external locations registered?', options: ['Inside every table', 'Inside a notebook', 'Directly under the metastore', 'Only inside a volume'], answer: 2, explanation: 'These metastore-level objects form a separate storage-access branch rather than schema children.' },
        { domain: 'Governance and Security', question: 'An ordinary non-owner reader has SELECT but cannot use the parent containers. What is missing?', options: ['USE CATALOG and USE SCHEMA', 'MODIFY on every table', 'Ownership of the metastore', 'WRITE VOLUME'], answer: 0, explanation: 'The ordinary reader needs the parent USE privileges in addition to the table data privilege.' },
        { domain: 'Governance and Security', question: 'An external table is dropped. What happens to its files?', options: ['They are immediately erased', 'They move into a notebook', 'They become managed automatically', 'They remain user-controlled in storage'], answer: 3, explanation: 'Dropping external metadata does not delete underlying external files; the user controls that lifecycle.' },
        { domain: 'Governance and Security', question: 'Which statement about managed table deletion is accurate?', options: ['It guarantees immediate secure erasure', 'Recovery and deletion follow the documented lifecycle', 'It never affects data lifecycle', 'It transfers ownership to all readers'], answer: 1, explanation: 'Managed storage lifecycle includes recovery/deletion behavior; DROP is not an immediate secure-erasure guarantee.' },
        { domain: 'Governance and Security', question: 'A reader must open hello.txt in a volume. Which data privilege applies?', options: ['SELECT on an unrelated table', 'MODIFY on orders', 'READ VOLUME with parent USE privileges', 'CREATE SCHEMA only'], answer: 2, explanation: 'File access uses volume privileges; table SELECT does not authorize reading a separate volume file.' },
        { domain: 'Governance and Security', question: 'A group receives eligible SELECT at a schema. What should you consider?', options: ['Current and future child tables can inherit it', 'Only the schema owner can read', 'Every table changes ownership', 'Only one existing table can receive it'], answer: 0, explanation: 'Eligible catalog/schema privileges inherit downward; ownership itself is not inherited.' },
        { domain: 'Governance and Security', question: 'The creator revokes a direct SELECT grant from themselves and still reads the table. Why?', options: ['REVOKE always fails silently', 'SELECT is unrelated to access', 'The files are public by default', 'Ownership or other inherited/group access can remain'], answer: 3, explanation: 'A direct grant is only one input to effective access, so self-revoke is not a reliable negative-access test.' },
        { domain: 'Governance and Security', question: 'A lineage node is absent immediately after CTAS. What is the appropriate conclusion?', options: ['The CTAS produced no rows', 'Capture timing or permission filtering may explain it', 'All privileges should be granted broadly', 'The source table was deleted'], answer: 1, explanation: 'Lineage capture and visibility have boundaries; inspect query results separately and revisit the graph.' },
        { domain: 'Governance and Security', question: 'Can an external location support managed storage?', options: ['No, its name forbids that', 'Only if SELECT is granted to everyone', 'Yes; it links a governed path and credential', 'No, it is a SQL table'], answer: 2, explanation: 'An external location can support managed storage as well as external data; it is a storage-path object.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's10-object', answer: 's10-permissions', question: 'On the selected orders object, where do you inspect grants?', explanation: 'Permissions is the documented object tab for inspecting and managing privileges; opening it alone changes no grant.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's10-permissions', answer: 's10-grant', question: 'In an authorized workflow, which control starts adding privileges?', explanation: 'Grant opens the privilege assignment workflow; the lab only identifies this control and does not apply changes.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's10-grant', answer: 's10-select', question: 'In this conceptual grant illustration, which privilege enables table reads?', explanation: 'SELECT enables table data reads, with USE CATALOG and USE SCHEMA also required for the ordinary reader.' },
        { type: 'hotspot', domain: 'Governance and Security', screen: 's10-lineage', answer: 's10-graph', question: 'The Lineage tab is open. Where do you expand the dependency graph?', explanation: 'See Lineage Graph opens the lineage graph, whose visible details depend on permissions and captured operations.' },
      ],
    },
  };
})(globalThis);
