// Original bilingual-course content; official research supplied by the parent.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const agent = { label: 'Build a generative AI agent: tools and Playground workflow', url: 'https://docs.databricks.com/aws/en/getting-started/gen-ai-llm-agent' };
  const free = { label: 'Free Edition limitations and quotas', url: 'https://docs.databricks.com/aws/en/getting-started/free-edition-limitations' };
  const guide = { label: 'Generative AI Engineer Associate exam guide (March 2026)', url: 'https://www.databricks.com/sites/default/files/2026-03/Databricks-Certified-Generative-AI-Engineer-Associate-Exam-Guide-Mar26.pdf' };
  DataLab.deep.en.s16 = {
    deepDive: [
      { title: 'Agent loop: proposal is not execution', body: ['The agent tutorial connects a model with tools. A model can propose a tool call, but application code must validate the requested tool name, arguments and authorization before dispatching it. A tool schema declares an interface; it neither executes the function nor grants permission. Our local teaching simulation makes these boundaries explicit, without claiming genuine autonomous reasoning.'], source: agent },
      { title: 'Make the boundary inspectable', body: ['Separate request, proposed tool call, tool result and final response. The application supplies tool results back to the model in a real loop; the model may then respond or request another tool. A bounded loop needs a stop policy. Here a fixed stub replaces inference, only one fixture tool is allowed, and the step budget is checked before another stub call. These are educational design choices, not a production security implementation.'], source: agent },
      { title: 'Data access is a separate decision', body: ['The tutorial illustrates tools for agent applications. In a real application, validate identity and effective permissions for each requested operation and customer scope before dispatch. Our allowlist only selects a known read-only function; it is not a full authorization system. C-42 is an invented fixture identifier, not a private customer record, and no real database, credentials or network are used.'], source: agent },
      { title: 'Memory, retrieval and authoritative state are different', body: ['As an application-design distinction, conversational memory supplies prior turns, retrieval supplies selected external context, and authoritative state records business facts. None is interchangeable with the others: a previous assistant message is not proof that a purchase occurred. In this exercise the immutable purchase fixture is the source of totals; there is no persistent conversational memory or retrieval service. Apps or Lakebase are not mandatory components of every agent.'], source: agent },
      { title: 'Current UI route, not a deployment requirement', body: ['The researched tutorial path is Playground → Tools → + Add tool, with Tools enabled. The current recommended export route is Get code → Export to Databricks Apps; notebook export is a legacy route, not the default recommendation taught here. These original simplified mocks identify controls only: do not add a real tool, export an application, deploy anything or run arbitrary Python from a tool definition.'], source: agent },
      { title: 'Free Edition availability is not unlimited capacity', body: ['Free Edition includes Apps and Lakebase subject to documented quotas and limitations; do not describe them as categorically unavailable. Their availability does not mean every agent requires them. The required lab is Python standard library only and can run locally without Databricks resources. The optional Free Edition UI orientation requires an available workspace, but no resource creation or paid subscription.'], source: free },
      { title: 'Trace evidence is not a universal audit guarantee', body: ['The exam guide includes Evaluation and Monitoring and Governance. Our in-memory trace records request, tool_call, tool_result and final for a scripted happy path. It is not a platform audit log, is not durable, and does not guarantee that every platform or application action is audited. A production design must separately determine trace coverage, platform audit coverage, access, retention and redaction requirements.'], source: guide },
      { title: 'Evaluate behavior, not persuasive wording', body: ['The published guide separates Application Development, Assembling and Deploying, Governance, and Evaluation and Monitoring. This original exercise practices those themes through interface design, deployment-path recognition and explicit rejection checks. Correct totals alone are insufficient: unknown tools, malformed JSON, invalid arguments and exhausted budgets must also behave predictably without executing an unauthorized tool.'], source: guide },
    ],
    diagram: {
      title: 'A scripted tool loop with an application-owned boundary',
      caption: 'Conceptual diagram based on the agent tutorial; validation, fixture and trace below are original teaching choices. No real inference, deployment or production authorization is demonstrated.',
      layers: [
        { label: 'Input and model stub', nodes: ['Synthetic request for C-42', 'Fixed tool request, then fixed final response'] },
        { label: 'Application boundary', nodes: ['Step budget → parse JSON → name and arguments', 'Real authorization belongs here conceptually; not implemented'] },
        { label: 'Read-only tool', nodes: ['Allowlisted sales_total only', 'Fixture purchases 10 + 25 → orders 2, total 35.0'] },
        { label: 'Observation and response', nodes: ['Tool result returns to the loop', 'In-memory trace; not a platform audit log'] },
      ],
    },
    comparison: {
      title: 'Separate responsibilities before choosing infrastructure',
      headers: ['Element', 'Purpose', 'What it does not prove'],
      rows: [
        ['Tool schema', 'Declare name and argument shape', 'No execution or authorization grant'],
        ['Conversational memory', 'Carry prior interaction context', 'Not authoritative purchase state'],
        ['Retrieval', 'Supply selected external context', 'Not automatically current or authoritative'],
        ['Authoritative state', 'Record business facts in a designed system', 'Not supplied by a model claim alone'],
        ['Application trace', 'Inspect selected loop events', 'Not universal platform audit coverage'],
        ['Apps / Lakebase', 'Optional application / state infrastructure choices', 'Not required for every agent; Free Edition quotas apply'],
      ],
      sources: [agent, free, guide],
    },
    lab: {
      title: 'SCRIPTED AGENT LOOP SIMULATION — no real inference',
      goal: 'Validate one allowlisted read-only fixture tool, inspect four trace events, and test rejection and step-limit behavior using Python standard library only. This is scripted orchestration, not genuine autonomous reasoning.',
      minutes: 45,
      requirements: [
        'Python 3 with the standard library, locally or in an existing Python notebook. No packages, network, database, credentials, private data, production security or persistent writes.',
        'Use only the invented C-42 fixture. The allowlist is not a full authorization system; real identity and customer authorization are conceptual only.',
        'Optional Free Edition UI orientation uses the illustrations or an available workspace without submitting anything. Never execute arbitrary Python tools, create tools, export, deploy or change permissions.',
      ],
      steps: [
        { title: 'Locate Playground without sending a request', body: 'Use the simplified mock to identify Playground. If you inspect a real Free Edition workspace, navigation is optional and subject to availability. Do not submit a prompt: the required experiment runs the scripted local code only.', check: 'You distinguish a model-backed Playground from the local stub; no inference request was sent.', screen: { id: 's16-playground', highlight: ['playground'] } },
        { title: 'Read the tool interface, not arbitrary code', body: 'In the original mock follow Tools → + Add tool. Our declared contract is sales_total(customer_id: string), limited to C-42. A declaration alone does not invoke it. Do not create a real tool or paste arbitrary Python into a Databricks tool.', check: 'You can identify the add-tool control and explain that validation and dispatch remain application responsibilities.', screen: { id: 's16-tools', highlight: ['tools', 'addTool'] } },
        { title: 'Distinguish enabled tools from permission', body: 'Identify Tools enabled in the illustration only. Enabling a tool for a model does not replace authorization for a customer or operation. This lab rejects all customers except the invented fixture as an input restriction, not as proof of authenticated access.', check: 'No real toggle changed. You explain why an allowlist and argument validation are not a complete security system.', screen: { id: 's16-enabled', highlight: ['enabled'] } },
        { title: 'Run the complete deterministic simulation', body: 'Run this complete Python block once in an existing Python session. It uses a fixed model stub and an immutable tuple fixture. Embedded assertions cover the exact success transcript and every named rejection; rejected requests leave both fixture and tool execution counter unchanged. No eval, exec, external calls or persistent writes are used.', code: { language: 'python', code: `import json

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
print(output)` }, check: 'Exit 0, empty stderr, and exactly six stdout lines: SCRIPTED AGENT LOOP SIMULATION; request: Sales total for fixture C-42; tool_call: {"name":"sales_total","arguments":{"customer_id":"C-42"}}; tool_result: {"orders": 2, "total": 35.0}; final: C-42: orders=2 total=35.0; checks: TOOL_NOT_ALLOWED MALFORMED_JSON INVALID_ARGUMENTS STEP_LIMIT; fixture unchanged. Each semicolon separates a line, not printed punctuation.' },
        { title: 'Interpret the failure checks', body: 'Read the assertions rather than weakening them: delete_all is rejected without dispatch; broken JSON and wrong, extra or non-fixture arguments never execute the tool. At budget one, the first tool runs but the next stub call is blocked; at zero, no stub or tool call occurs. Counter means actual tool executions, not trace length.', check: 'Rejected requests: tool counter 0, fixture unchanged, request-only trace. STEP_LIMIT at one: tool counter 1, model calls 1, no final event; at zero: both counters 0.' },
        { title: 'Recognize the current code route; do not export', body: 'Study Get code → Export to Databricks Apps in the original mock. The researched tutorial recommends Apps rather than the legacy notebook-export route. Stop at identification: do not click an actual export action, create an App or deploy. Lakebase is not needed for this fixture exercise.', check: 'No export, deployment, persistent state or resource creation occurred; Apps and Lakebase remain optional and quota-limited.', screen: { id: 's16-code', highlight: ['getCode', 'exportApps'] } },
        { title: 'Separate trace, audit and real authorization', body: 'Review what the four happy-path trace events establish: scripted request, dispatched fixture tool, computed result and fixed response. They do not establish production authorization, private-data safety, universal audit coverage or genuine autonomous reasoning. Real deployment would need separately designed identity, access, monitoring and evaluation.', check: 'You can name the missing production controls without claiming the simulation supplies them. End the session without cleanup writes or destructive operations.' },
      ],
      wrapUp: 'C-42 has two fixture purchases totaling 35.0. You observed a scripted loop, rejected unsafe or malformed requests without tool execution, enforced the budget before an extra model call, and kept navigation separate from export and deployment. No real inference, network, database or persistent state was involved.',
      sources: [agent, free, guide],
    },
    certification: {
      intro: 'Original practice aligned with the March 2026 Generative AI Engineer Associate guide, not real exam items. The simulation illustrates application boundaries, not a production agent or security certification.',
      exams: [{ name: 'Databricks Certified Generative AI Engineer Associate', url: guide.url, domains: ['Application Development', 'Assembling and Deploying', 'Governance', 'Evaluation and Monitoring'] }],
      questions: [
        { domain: 'Application Development', question: 'A model proposes sales_total. Who must validate and dispatch it?', options: ['The tool description automatically', 'The application after name, argument and authorization checks', 'The final answer text', 'The trace viewer'], answer: 1, explanation: 'A proposal is not execution. The application owns validation, real authorization and dispatch; the schema alone grants nothing.' },
        { domain: 'Application Development', question: 'What does a tool schema establish?', options: ['A completed purchase', 'Universal authorization', 'A declared interface for a possible call', 'Automatic Python execution'], answer: 2, explanation: 'The schema declares the interface. It neither executes code nor proves that a caller can access a customer.' },
        { domain: 'Application Development', question: 'What is the fixture result for C-42?', options: ['orders=2, total=35.0', 'orders=1, total=25.0', 'orders=2, total=10.0', 'orders=35, total=2.0'], answer: 0, explanation: 'The two synthetic purchases are 10.0 and 25.0, yielding two orders and a total of 35.0.' },
        { domain: 'Governance', question: 'An unknown delete_all tool is requested. What does the lab do?', options: ['Execute it in a sandbox', 'Ask the model to authorize it', 'Increment the tool counter first', 'Return TOOL_NOT_ALLOWED without executing a tool'], answer: 3, explanation: 'Only sales_total is allowlisted; an unknown request leaves the fixture and execution counter unchanged.' },
        { domain: 'Governance', question: 'Does the lab allowlist provide full customer authorization?', options: ['Yes, for all real customers', 'No; it restricts a fixture interface, not authenticated access', 'Yes, because JSON is valid', 'Only if the model says so'], answer: 1, explanation: 'An allowlist is not a full identity and authorization system. The only customer here is an invented fixture.' },
        { domain: 'Evaluation and Monitoring', question: 'With max_steps=1, what happens after the tool result?', options: ['The final stub call always runs', 'A second tool executes', 'STEP_LIMIT occurs before another stub call', 'The fixture is deleted'], answer: 2, explanation: 'The budget is checked at the loop boundary. Exactly one stub call and one tool execution have occurred; no final event is produced.' },
        { domain: 'Application Development', question: 'Which statement distinguishes memory from authoritative state?', options: ['Prior conversation is context, not proof of a purchase', 'An assistant claim is always the transaction record', 'Retrieval replaces every business system', 'Memory always requires Lakebase'], answer: 0, explanation: 'Conversation and retrieval can supply context; authoritative purchase facts require a designated source of truth.' },
        { domain: 'Evaluation and Monitoring', question: 'What does the in-memory trace guarantee?', options: ['Every platform action is audited', 'Durable compliance evidence', 'Production authorization', 'Only the explicitly recorded simulation events'], answer: 3, explanation: 'The local trace is not a platform audit log and has neither durable storage nor a universal coverage guarantee.' },
        { domain: 'Assembling and Deploying', question: 'Which current tutorial route is recognized but not executed?', options: ['Mandatory legacy notebook export', 'Get code → Export to Databricks Apps', 'Deploy arbitrary Python from a prompt', 'Provision Lakebase for every agent'], answer: 1, explanation: 'The researched current route recommends Apps. This lab only recognizes the controls; it does not export or deploy.' },
        { domain: 'Assembling and Deploying', question: 'Which Free Edition claim is accurate for this lab?', options: ['Apps and Lakebase are categorically absent', 'Every agent must use both', 'They are available with quotas, but neither is needed here', 'They have unlimited capacity'], answer: 2, explanation: 'Availability is subject to documented limits. A local standard-library fixture simulation requires neither service.' },
        { type: 'hotspot', domain: 'Application Development', screen: 's16-playground', answer: 'playground', question: 'Where would you orient yourself to the model-testing UI without submitting a prompt?', explanation: 'Playground is the tutorial context. This simplified mock sends no prompt and performs no inference.' },
        { type: 'hotspot', domain: 'Application Development', screen: 's16-tools', answer: 'addTool', question: 'Under Tools, identify the documented add-tool control without creating a tool.', explanation: 'The documented control is + Add tool. The lab identifies it only; a schema does not execute a function.' },
        { type: 'hotspot', domain: 'Governance', screen: 's16-enabled', answer: 'enabled', question: 'Which control indicates tool availability to the model, not customer authorization?', explanation: 'Tools enabled is a UI availability control. It does not replace per-operation authorization by the application.' },
        { type: 'hotspot', domain: 'Assembling and Deploying', screen: 's16-code', answer: 'exportApps', question: 'After Get code, identify the current recommended export destination; do not export.', explanation: 'Export to Databricks Apps is the researched current route, distinct from legacy notebook export. No action is performed.' },
      ],
    },
  };
})(globalThis);
