// Original teaching content; official research supplied by the parent, not live UI verification.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${DOCS}/${path}` });
  const bundles = source('Declarative Automation Bundles', 'dev-tools/bundles/');
  const git = source('Git operations with Git folders', 'repos/git-operations-with-repos');
  const oidc = source('GitHub Actions workload identity federation', 'dev-tools/auth/provider-github');
  const free = source('Free Edition limitations', 'getting-started/free-edition-limitations');
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';
  DataLab.deep.en.s14 = {
    deepDive: [
      { title: 'CI/CD is a chain of evidence, not a copy operation', body: [
        'A useful delivery design links a feature branch, pull-request review, transformation tests, resource-configuration validation, approval, deployment and monitoring. Passing one stage does not prove the next: a correct sum cannot demonstrate workspace permissions or a successful production run.',
        'The required lab models only tests and a promotion decision in Python memory. It does not create a branch, push a commit, configure GitHub Actions or deploy a job. The wider delivery chain is an architectural explanation based on the bundle documentation, not infrastructure created by this exercise.',
      ], source: bundles },
      { title: 'Git folders synchronize source, not deployed resources', body: [
        'Git folders connect workspace source files with a remote Git repository and support Git operations. Updating a branch or pulling code changes source content; it is not equivalent to creating or updating the job and pipeline resource definitions of a deployment.',
        'The documented creation path is Workspace → Create → Git folder. The form includes Git repository URL, Git provider and Git folder name. The original mocks show these documented labels, not a live workspace inspection. This lab only asks you to identify controls: do not clone, commit, push or create a folder.',
      ], source: git },
      { title: 'Declarative Automation Bundles describe code and resources', body: [
        'Declarative Automation Bundles is the current name for Databricks Asset Bundles. A project groups source and declarative resource configuration, typically rooted in databricks.yml. Targets let one project express environment-specific settings instead of manually maintaining unrelated copies of the transformation.',
        'Source synchronization and resource deployment are different operations. A file being present in a workspace does not establish that a job definition, permissions or production configuration changed. Do not infer universal REST API coverage for every UI feature; use the documented tool and resource support for the operation you need.',
      ], source: bundles },
      { title: 'Validation is not offline YAML linting', body: [
        'A Python unit test checks transformation behavior; parsing YAML checks syntax. Neither substitutes for bundle validation against the selected target. Treat databricks bundle validate as a CLI operation requiring configured authentication and workspace access, not as an offline YAML-only check.',
        'Validation is also distinct from deployment and execution: an accepted configuration is not evidence of a completed data workload. Optional enterprise work needs a supported CLI, an authorized workspace identity, target configuration and resource permissions. No bundle command is a required or executed step in this lab.',
      ], source: bundles },
      { title: 'Promote the same code with explicit environment settings', body: [
        'Targets separate environment-specific configuration from the transformation code. Review the chosen workspace, catalog, permissions and resource settings before promotion. Separate catalog names illustrate logical isolation, but dictionaries with those names do not create Unity Catalog objects or establish security boundaries.',
        'The lab uses dev and prod dictionaries with different catalog strings and the same fixed code_version. This is only a model of promoting one reviewed version. Production isolation still depends on actual workspaces, identities, permissions and deployment configuration; a version string is not an artifact integrity check.',
      ], source: bundles },
      { title: 'Federation avoids making a client secret mandatory', body: [
        'GitHub Actions can use OIDC workload identity federation with a Databricks service principal. An administrator must first configure a federation policy that trusts the intended GitHub workload identity. A token presented by an arbitrary workflow is not automatically authorized.',
        'This documented path does not make a long-lived client secret mandatory. Scope identity permissions and trusted workflow claims deliberately, and obtain organizational approval before enabling real automation. The exercise requests no tokens, credentials, federation policy edits or authentication calls.',
      ], source: oidc },
      { title: 'A gate grants eligibility; monitoring closes the loop', body: [
        'The teaching gate requires all four specified rules to pass and an explicit approval. Approval does not repair failed tests, and tests do not replace approval. ELIGIBLE means eligible in this simulation only: it is not a deployment status, proof of resource validation or permission to perform a real release.',
        'In an enterprise delivery plan, follow deployment with workload execution checks and monitoring of outcomes. If behavior is wrong, stop promotion and investigate with the responsible team. The in-memory gate neither monitors a real job nor implements rollback, environment approvals or protected branches in GitHub.',
      ], source: bundles },
      { title: 'Free Edition is a learning boundary, not a CI guarantee', body: [
        'Free Edition has serverless, usage and feature limitations. A working Python notebook does not establish that enterprise CI runners, external connectivity, service-principal administration or a production deployment architecture are available to your account.',
        'All required code below uses standard Python, synthetic integers and in-memory objects. You may run it in a Free Edition Python notebook within quota, or a local Python 3 session. There are no dependencies, files, Git changes, network calls, cloud provisioning or external commands in the lab code.',
      ], source: free },
    ],
    diagram: {
      title: 'Delivery evidence and the simulation boundary',
      caption: 'Conceptual flow based on Git folders, bundles and federation documentation. Only transformation tests and a local eligibility gate execute in this lab; no CI service or deployment is configured.',
      layers: [
        { label: 'Source control', nodes: ['Feature branch → pull request', 'Human review → approved version'] },
        { label: 'Continuous integration', nodes: ['Transformation tests', 'Resource configuration validation with CLI/auth/workspace'] },
        { label: 'Delivery controls', nodes: ['Target settings + explicit approval', 'Authorized identity with federation policy'] },
        { label: 'Real deployment and operations', nodes: ['Deploy resources, then execute workload', 'Monitor outcomes and investigate failures'] },
        { label: 'Lab only', nodes: ['Python sum + four rules', 'dev/prod dictionaries + ELIGIBLE/BLOCKED', 'No actual deploy or bundle validate'] },
      ],
    },
    comparison: {
      title: 'Different checks answer different questions',
      headers: ['Operation', 'Evidence it provides', 'Does not prove'],
      rows: [
        ['Git folder source sync', 'Workspace source reflects selected Git content', 'Resources deployed or workload tested'],
        ['Python transformation tests', 'The four local rules behave as specified', 'Bundle configuration or permissions valid'],
        ['YAML syntax check', 'A document can be parsed', 'Authenticated bundle validation completed'],
        ['Bundle validation', 'Target configuration checked through the CLI workflow', 'A deployed workload ran successfully'],
        ['Approval and deployment', 'Authorized decision and resource update are separate stages', 'Correct production data without execution checks'],
        ['Monitoring', 'Observed execution outcomes', 'That source sync alone was a deployment'],
      ],
      sources: [git, bundles, oidc],
    },
    lab: {
      title: 'Python CI/CD SIMULATION: four tests and a promotion gate',
      goal: 'Compute 10 + 20 = 30, reject null and negative inputs, prove repeatability, then compare dev/prod settings and simulate approval. This is not a genuine CI setup or resource deployment.',
      minutes: 40,
      requirements: [
        'A fresh Python 3 session, locally or in a Free Edition Python notebook within quota. Run the Python blocks in order.',
        'No CLI, Git repository, GitHub account, packages, secrets, network, file writes or resource provisioning required. Do not execute the base session deployment workflow for this exercise.',
        'The Git folder screens are original simplified, documentation-verified illustrations, not live UI verification. Identify labels only; do not operate a real deployment or create a Git folder.',
      ],
      steps: [
        { title: 'Locate the documented source-control entry', body: 'In the read-only mock, identify Workspace and the Create → Git folder path. This is orientation from the cited Git operations documentation, not an instruction to clone anything. All required computation will happen in Python memory.', check: 'You distinguish a workspace Git folder from a deployed job resource.', screen: { id: 's14-workspace', highlight: ['workspace', 'create', 'gitFolder'] } },
        { title: 'Identify form fields without connecting a repository', body: 'Inspect Git repository URL, Git provider and Git folder name. A real clone would require a repository and authorized Git access. Do not enter credentials, submit a form or change a branch; the form is only a simplified illustration.', check: 'You can name the three documented fields and explain why pulling source is not deployment.', screen: { id: 's14-git-form', highlight: ['url', 'provider', 'name'] } },
        { title: 'Define a pure transformation', body: 'Copy this function into a fresh Python session. Its contract accepts a list of integers that are not negative; null is rejected. It returns a total and has no writes or processing counters. Validation precedes summation, and the input is never mutated.', code: { language: 'python', code: `def transform(values):
    if any(value is None for value in values):
        raise ValueError("null rejected")
    if any(type(value) is not int or value < 0 for value in values):
        raise ValueError("non-negative integers required")
    return sum(values)

values = [10, 20]
print(f"total={transform(values)}")` }, check: 'Exact output: total=30. No table, file or Git state changed.' },
        { title: 'Run exactly four behavior rules', body: 'Check valid input, null rejection, negative rejection and deterministic repeat execution. Rejected cases check the exact error and unchanged input. There is no processing counter or stored dataset to roll back because transform is pure. The test report is built only after the calls return.', code: { language: 'python', code: `def rejected_unchanged(candidate, message):
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
print(f"tests={sum(tests.values())}/4")` }, check: 'Exact output: tests=4/4. Null and negative input were rejected without mutation.', screen: { id: 's14-gate', highlight: ['tests'] } },
        { title: 'Separate configuration from the same code version', body: 'Create two ordinary dictionaries, not real bundle targets or catalogs. Catalog values differ while code_version is identical. The same transform function serves both settings; no code is copied or altered for production. These assertions model configuration consistency, not resource validation.', code: { language: 'python', code: `dev = {"catalog": "sales_dev", "code_version": "v1"}
prod = {"catalog": "sales_prod", "code_version": "v1"}
assert dev["catalog"] != prod["catalog"]
assert dev["code_version"] == prod["code_version"]
print(f"dev={dev['catalog']} prod={prod['catalog']} code_version={prod['code_version']}")` }, check: 'Exact output: dev=sales_dev prod=sales_prod code_version=v1. No catalog was created.' },
        { title: 'Compare approval granted, missing approval and failed tests', body: 'Simulate the gate with the same four-rule report. It returns ELIGIBLE only for the exact expected rule set with every result True and explicit approval. A failed test blocks even with approval. Snapshot checks verify that gate evaluation changes neither the report nor the settings; no deploy function exists.', code: { language: 'python', code: `def promotion_gate(report, approved):
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
print(f"failed_tests={promotion_gate(failed, True)}")` }, check: 'Three lines: approved=ELIGIBLE; no_approval=BLOCKED; failed_tests=BLOCKED. Reports and settings remain unchanged.', screen: { id: 's14-gate', highlight: ['approval', 'eligible', 'blocked'] } },
        { title: 'Map the missing enterprise stages without executing them', body: 'Read the cited bundle and federation documentation. A real design adds branch review, resource configuration validation, approval, deployment and monitoring with an authorized identity. Bundle validation needs the CLI, authentication and workspace access; it is not offline YAML validation. GitHub OIDC needs a preconfigured service-principal federation policy, not a mandatory client secret. Do not run external commands or provision these prerequisites here.', check: 'You can explain which stages were simulated and which require enterprise setup. No real authentication, bundle validate, deploy or CI workflow ran.' },
      ],
      wrapUp: 'You obtained total=30 and tests=4/4, with null/negative rejection and unchanged inputs. dev and prod had different catalog names but code_version=v1. The gate returned ELIGIBLE with approval and BLOCKED without it or with failed tests. All objects stayed in memory; there is no persistent cleanup, real CI setup, validated bundle or deployment.',
      sources: [git, bundles, oidc, free],
    },
    certification: {
      intro: 'Original practice, not official exam material or real exam questions. Aligned with Implementing CI/CD in the May 4, 2026 Data Engineer Associate guide. Educational gate controls are not product UI paths.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Implementing CI/CD'] }],
      questions: [
        { domain: 'Implementing CI/CD', question: 'A developer pulls the latest branch into a Git folder. What is established?', options: ['Every job was deployed', 'Source content was synchronized', 'All tests passed', 'Production approval was granted'], answer: 1, explanation: 'Git operations synchronize source; they do not establish resource deployment or tests. Source: Git operations with Git folders.' },
        { domain: 'Implementing CI/CD', question: 'What is the current name of Databricks Asset Bundles?', options: ['Unity Catalog', 'Git folders', 'Declarative Automation Bundles', 'Lakeflow Jobs'], answer: 2, explanation: 'Declarative Automation Bundles is the current name of the bundle tool. Source: Declarative Automation Bundles.' },
        { domain: 'Implementing CI/CD', question: 'Which sequence best separates delivery responsibilities?', options: ['Branch → review → tests/config validation → approval → deploy → monitor', 'Pull → assume production success', 'Deploy → skip tests → approve', 'Parse YAML → declare the job successful'], answer: 0, explanation: 'Source review, checks, approval, resource deployment and monitoring provide different evidence. Source: bundles and the teaching delivery model.' },
        { domain: 'Implementing CI/CD', question: 'What must you plan before genuine bundle validation?', options: ['Only a YAML editor with no workspace access', 'Only the local sum test', 'A production deployment button', 'CLI, configured authentication and workspace access'], answer: 3, explanation: 'Bundle validation is a CLI workflow against a target, not offline YAML-only linting. Source: Declarative Automation Bundles.' },
        { domain: 'Implementing CI/CD', question: 'Why do the lab dictionaries use different catalogs and the same code_version?', options: ['To create two real catalogs', 'To model environment settings around one code version', 'To bypass Unity Catalog permissions', 'To prove deployment has run'], answer: 1, explanation: 'Targets separate settings from code; these dictionaries only model that distinction and create no resources. Source: bundles and lab assertions.' },
        { domain: 'Implementing CI/CD', question: 'Which GitHub Actions identity setup can avoid a long-lived client secret?', options: ['Any public workflow without a policy', 'A shared personal password', 'OIDC federation with a service principal and preconfigured trust policy', 'A catalog name used as a token'], answer: 2, explanation: 'GitHub OIDC federation requires a trusted workload policy and authorized identity; it is not automatic access. Source: GitHub Actions workload identity federation.' },
        { domain: 'Implementing CI/CD', question: 'All four tests pass but approval is absent. What does the lab gate return?', options: ['BLOCKED', 'DEPLOYED', 'ELIGIBLE', 'A new Git commit'], answer: 0, explanation: 'The gate requires both four passing rules and explicit approval, and makes no deployments. Source: lab and the bundle delivery model.' },
        { domain: 'Implementing CI/CD', question: 'Approval exists but the negative-input rule fails. What happens?', options: ['Approval changes the test result', 'The sum is deployed anyway', 'Git recreates the catalog', 'The gate remains BLOCKED'], answer: 3, explanation: 'Approval cannot substitute for passing checks; the lab asserts BLOCKED for a failed test with approval. Source: lab gate.' },
        { domain: 'Implementing CI/CD', question: 'Which behavior does the null-input test verify?', options: ['Null becomes zero silently', 'Exact rejection and unchanged input', 'The production job is repaired', 'A credential is refreshed'], answer: 1, explanation: 'The pure function raises ValueError with null rejected and leaves the input unchanged. Source: executable lab contract.' },
        { domain: 'Implementing CI/CD', question: 'What does successfully completing this lab prove?', options: ['A real GitHub workflow is configured', 'A bundle passed authenticated validation', 'The local transformation rules and simulated eligibility decision', 'All UI features have a REST endpoint'], answer: 2, explanation: 'Only Python behavior and dictionary/gate assertions ran; no CLI, network, Git changes or deployment occurred. Sources: lab and Free Edition limitations.' },
        { type: 'hotspot', domain: 'Implementing CI/CD', screen: 's14-workspace', answer: 'workspace', question: 'Which documented workspace area starts the Git-folder creation path?', explanation: 'Workspace precedes Create → Git folder in the documented path. This mock is original and documentation-verified, not live UI evidence. Source: Git operations.' },
        { type: 'hotspot', domain: 'Implementing CI/CD', screen: 's14-workspace', answer: 'gitFolder', question: 'In the simplified open Create menu, which item is for repository-backed source?', explanation: 'Git folder is the documented item. Selecting source organization is not deploying a resource; do not create a real folder here. Source: Git operations.' },
        { type: 'hotspot', domain: 'Implementing CI/CD', screen: 's14-git-form', answer: 'url', question: 'Which documented field identifies the remote repository, not a production catalog?', explanation: 'Git repository URL specifies the remote repository. The read-only illustration requires no credentials or actual clone. Source: Git operations.' },
        { type: 'hotspot', domain: 'Implementing CI/CD', screen: 's14-gate', answer: 'blocked', question: 'In the educational gate, where is the result with tests=4/4 but no approval?', explanation: 'no_approval=BLOCKED is an in-memory teaching result, not a Databricks deployment control. Source: lab assertions and delivery model.' },
      ],
    },
  };
})(globalThis);
