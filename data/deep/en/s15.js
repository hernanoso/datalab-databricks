// Original practice content; official research and verified UI paths supplied by the parent.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const DOC = 'https://docs.databricks.com/aws/en/';
  const playground = { label: 'Explore models in AI Playground', url: DOC + 'getting-started/gen-ai-llm-agent' };
  const functions = { label: 'AI Functions and ai_query', url: DOC + 'large-language-models/ai-functions' };
  const free = { label: 'Free Edition limitations', url: DOC + 'getting-started/free-edition-limitations' };
  const guide = { label: 'Generative AI Engineer Associate exam guide, March 2026', url: 'https://www.databricks.com/sites/default/files/2026-03/Databricks-Certified-Generative-AI-Engineer-Associate-Exam-Guide-Mar26.pdf' };
  DataLab.deep.en.s15 = {
    deepDive: [
      { title: 'Tokens and context are a finite working budget', body: ['A generative application supplies instructions, user input and sometimes retrieved evidence to a model. Tokens are the units used to represent that text, not a fixed number of characters or words. The context budget must accommodate the prompt and the generated answer; more history or retrieved passages leaves less room elsewhere. Design for relevant evidence rather than assuming that unlimited documents fit in one request.'], source: guide },
      { title: 'A prompt is a contract, not an enforcement engine', body: ['Separate task instructions, input text and the desired output schema. For classification, specify allowed labels and what to do when a field is absent. A request for JSON does not prove valid JSON or correct field values: parse the response, check exact keys and types, and reject invalid output before downstream use. User text is data, not authority to override the application contract.'], source: guide },
      { title: 'Generation settings do not certify truth', body: ['Temperature changes sampling behavior. A low value can reduce variation but does not guarantee deterministic output, factual correctness or safety. Compare candidate prompts and configurations against a defined dataset and acceptance criteria. The deterministic Python fixture in this lab bypasses generation entirely; its repeatability says nothing about a real model at any temperature.'], source: playground },
      { title: 'RAG brings evidence into the request', body: ['Retrieval-augmented generation retrieves relevant material and includes it as context before generation. Retrieval quality, permissions, freshness and context selection all matter. Fine-tuning adapts model behavior through training rather than retrieving evidence at request time. Neither technique eliminates hallucinations; validate groundedness and task quality instead of treating either name as a correctness guarantee.'], source: guide },
      { title: 'Playground is an exploration surface', body: ['The documented path is AI/ML → Playground. The model dropdown selects a model, + adds another comparison panel and Sync synchronizes inputs for comparison. These controls do not validate a business answer. Our original simplified mocks only identify these controls: no real model is selected and no prompt submission is required. Real exploration belongs only in an authorized environment after checking access and cost.'], source: playground },
      { title: 'AI Functions are not the same task as Genie', body: ['AI Functions, including ai_query, can apply model inference to text in data workflows. Genie addresses natural-language questions over structured data through SQL; it is not a substitute name for arbitrary-text classification. A local dictionary lookup is neither workflow: it illustrates a schema contract without invoking an AI Function, Genie or an endpoint.'], source: functions },
      { title: 'Real inference has a separate cost and access boundary', body: ['Before optional real inference, verify the model, region, authentication, permissions and quotas. Model inference charges are independent of compute charges. A LIMIT on returned rows is not a hard cap on model calls or inference cost; query execution may evaluate more work than the final output shows. Materializing a small approved input before inference can define the input boundary, but does not replace checking pricing, retries and execution behavior.'], source: functions },
      { title: 'Evaluation needs representative unseen cases', body: ['Measure format validity separately from task quality, groundedness, latency and cost. The three known fixtures below produce 3/3 fixture agreement by construction; they are not held-out model evaluation and do not demonstrate hallucination resistance. A real evaluation needs representative cases, expected outcomes, a defined scoring method and failure analysis before deployment.'], source: guide },
      { title: 'Availability and credentials must be named precisely', body: ['Free Edition has restrictions and quotas, not a universal ban on all generative AI features or a promise that every model is available. The required lab uses only Python standard-library code, with no account, endpoint or network. Generative AI Fundamentals is an accreditation; Databricks Certified Generative AI Engineer Associate is a separate certification with its own exam guide and preparation requirements.'], source: free },
    ],
    diagram: {
      title: 'Separate the real application from the deterministic teaching mock',
      caption: 'Conceptual design based on the official guide and AI Functions documentation. Only the fixture → validation → agreement route runs in this lab; there is no model invocation.',
      layers: [
        { label: 'Application contract', nodes: ['Task, allowed schema and input boundary', 'Tokens and context budget'] },
        { label: 'Optional real application', nodes: ['Authorized retrieval → prompt → model', 'Model/region/access/quota and inference charges'] },
        { label: 'Required offline mock', nodes: ['Three fixed texts → dictionary → JSON', 'No model, endpoint, credentials or network'] },
        { label: 'Validation and evidence', nodes: ['Parse exact keys, types and urgency enum', 'Fixture agreement ≠ model quality; repeated output ≠ hallucination resistance'] },
      ],
    },
    comparison: {
      title: 'Choose a mechanism without confusing its guarantees',
      headers: ['Mechanism', 'Purpose', 'Evidence to collect', 'What it does not guarantee'],
      rows: [
        ['Prompt design', 'Specify task, input and response contract', 'Schema validity and task results', 'Instructions alone do not enforce JSON or truth'],
        ['RAG', 'Retrieve relevant evidence into context', 'Retrieval relevance, access and groundedness', 'No elimination of hallucinations'],
        ['Fine-tuning', 'Adapt model behavior through training', 'Held-out task quality and regressions', 'No automatic fresh knowledge or correctness'],
        ['AI Functions / ai_query', 'Run inference inside data workflows', 'Model access, quality, latency and inference charges', 'LIMIT is not a hard inference-cost cap'],
        ['Offline fixture mock', 'Rehearse parsing and validation without inference', '3/3 fixture agreement and identical repeat', 'No evidence about model evaluation or hallucination resistance'],
      ],
      sources: [guide, playground, functions, free],
    },
    lab: {
      title: 'Offline mock: classify three fixtures and validate the contract',
      goal: 'Run a deterministic Python standard-library mock, reject invalid schemas, obtain 3/3 fixture agreement and repeat identical output; inspect Playground mocks without submitting a prompt.',
      minutes: 40,
      requirements: [
        'Python 3 with its standard library, locally or in an already available Python notebook. No Free Edition feature or account is required; its quotas can affect optional UI exploration.',
        'No installs, network requests, endpoints, keys, credentials, model inference or paid resource creation. The only data is the three fixed synthetic texts below.',
        'The Spanish fixture texts and JSON field names intentionally remain identical in both language versions for exact sample and stdout parity. They are test inputs, not untranslated instructions.',
      ],
      steps: [
        { title: 'Locate the exploration entry in a mock', body: 'Identify AI/ML → Playground in this original simplified illustration. This is orientation only; do not open a real inference session or submit text. The required exercise is the offline Python mock below.', check: 'You identify Playground without authenticating, provisioning or invoking a model.', screen: { id: 's15-entry', highlight: ['aiml', 'playground'] } },
        { title: 'Read the contract before running code', body: 'Each output must have exactly producto and urgencia. producto is a string or null; urgencia is a string in alta, media, baja. The three fixtures map payments-not-opening to pagos/alta, slow-payments to pagos/media, and a suggestion to null/baja. Unknown input is rejected, not guessed.', check: 'You distinguish JSON null from the string "null" and schema validity from correct classification.' },
        { title: 'Run the complete deterministic mock', body: 'Run the entire block in one fresh Python process or cell. It uses dictionary lookup, JSON serialization, parsing and explicit validation only. The negative checks exercise extra and missing keys, wrong types and an invalid enum. Every printed line is explicitly labeled MOCK; none is a model answer.', code: { language: 'python', code: `import json

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
print("MOCK repeat identical: yes (not hallucination resistance)")` }, check: 'Exit 0 with empty stderr. Exactly six stdout lines: three MOCK fixture lines, MOCK fixture agreement: 3/3 (not model evaluation), MOCK schema rejection checks: 8/8 and MOCK repeat identical: yes (not hallucination resistance).' },
        { title: 'Explain the evidence without overstating it', body: 'Inspect the parsed values and the 3/3 fixture agreement. The expected values also define the dictionary responses, so this is an intentional contract demonstration, not an independent quality benchmark. Running the block again must produce the identical six lines. It has not tested an LLM, RAG, temperature or hallucinations.', check: 'The exact three mappings are pagos/alta, pagos/media and null/baja; all output labels say MOCK. Invalid schemas and unknown fixtures are rejected.' },
        { title: 'Identify a model selector, without selecting a real endpoint', body: 'Use the original mock to locate the model dropdown. In an optional real authorized environment, first review model availability, region, authentication, permissions, quotas and both compute and inference charges. Free Edition restrictions are not a blanket ban or a guarantee of access. Skip real UI exploration if unavailable.', check: 'You identify the model dropdown in the illustration; no endpoint, credentials or billable invocation is needed.', screen: { id: 's15-model', highlight: ['model'] } },
        { title: 'Identify the comparison control without running a comparison', body: 'In the documented Playground workflow, + adds a model comparison panel. Inspect that control in the mock only. For a future real evaluation, define representative unseen inputs and expected outcomes before comparing candidates; a second panel does not make a response correct.', check: 'You identify + and describe a future evaluation plan without claiming to have measured any model.', screen: { id: 's15-model', highlight: ['add'] } },
        { title: 'Identify Sync and keep submission optional', body: 'Sync synchronizes inputs across comparison panels in the documented workflow. Identify it in the mock; no Submit control or inference call is required in this lab. In an authorized future workflow, synchronizing prompts still does not control all model variability, validate truth or enforce an inference-cost ceiling.', check: 'You identify Sync and finish with zero model calls, zero network requests and no keys or endpoints in the code.', screen: { id: 's15-model', highlight: ['sync'] } },
        { title: 'Plan a real workflow on paper only', body: 'Describe approved data minimization, a bounded input materialized before optional inference, a schema validator and held-out scoring. Explain that LIMIT on final rows is not a hard model-call cost cap, and track inference charges separately from compute. Record this as a conceptual design; do not add an ai_query or endpoint call to the required exercise.', check: 'Your plan separates fixture agreement, schema validation and real model evaluation, with access and cost review before any future authorized inference.' },
      ],
      wrapUp: 'The offline mock produces three validated classifications, 3/3 fixture agreement, eight rejected invalid schemas and an identical repeat. All evidence is mock-only. You located Playground, the model dropdown, + and Sync without submitting a prompt, and separated a safe teaching contract from a real model evaluation and its access/cost boundary.',
      sources: [playground, functions, free, guide],
    },
    certification: {
      intro: 'Original practice, not real exam questions. Aligned with Design, Application Development and Evaluation in the March 2026 Generative AI Engineer Associate guide. Generative AI Fundamentals is an accreditation, not this separate certification. Passing this fixture lab does not establish certification readiness.',
      exams: [{ name: 'Databricks Certified Generative AI Engineer Associate', url: guide.url, domains: ['Design', 'Application Development', 'Evaluation'] }],
      questions: [
        { domain: 'Design', question: 'What must a context budget account for?', options: ['Only the user question', 'Instructions, evidence, history and space for the answer', 'Only stored table rows', 'An unlimited number of documents'], answer: 1, explanation: 'Context is finite. Instructions and supplied evidence consume tokens, and the application must budget for its answer.' },
        { domain: 'Application Development', question: 'A prompt requests JSON. What must the application still do?', options: ['Trust any returned string', 'Skip type checks', 'Parse and validate exact keys, types and allowed labels', 'Treat JSON syntax as proof of truth'], answer: 2, explanation: 'A requested format is not enforcement. Validate structure and types separately from the correctness of field values.' },
        { domain: 'Evaluation', question: 'What does 3/3 in the required lab establish?', options: ['Agreement with the three predefined mock fixtures', 'Held-out LLM quality', 'Hallucination resistance', 'A deployed RAG evaluation'], answer: 0, explanation: 'The dictionary contains the expected fixture outputs. Agreement by construction is not an independent evaluation of a model.' },
        { domain: 'Design', question: 'Which statement about low temperature is justified?', options: ['It proves factual correctness', 'It guarantees identical outputs', 'It eliminates hallucinations', 'It may reduce variation, without correctness or determinism guarantees'], answer: 3, explanation: 'Sampling settings affect generation behavior but are not a proof of correctness, safety or deterministic real-model behavior.' },
        { domain: 'Design', question: 'How do RAG and fine-tuning differ?', options: ['Both guarantee truth', 'RAG retrieves evidence at request time; fine-tuning adapts behavior through training', 'RAG only changes chart colors', 'Fine-tuning grants access to every document'], answer: 1, explanation: 'Retrieval supplies context while fine-tuning changes model behavior through training. Neither eliminates hallucinations.' },
        { domain: 'Application Development', question: 'Which task matches arbitrary-text AI Functions rather than Genie NL-to-SQL?', options: ['Changing dashboard colors', 'Granting SELECT to a group', 'Applying a model to classify text rows', 'Creating a SQL warehouse'], answer: 2, explanation: 'AI Functions can apply inference to text. Genie addresses natural-language questions over structured data through SQL.' },
        { domain: 'Design', question: 'Does LIMIT 3 on final output guarantee at most three billable model calls?', options: ['No; bound approved input before inference and still review execution and pricing', 'Yes, in every execution plan', 'Yes, because compute is free', 'Yes, if temperature is zero'], answer: 0, explanation: 'Final output limits do not impose a hard inference-cost cap. Inference charges are independent of compute charges.' },
        { domain: 'Application Development', question: 'Which response violates the mock schema?', options: ['{"producto": null, "urgencia": "baja"}', '{"producto": "pagos", "urgencia": "alta"}', '{"producto": "pagos", "urgencia": "media"}', '{"producto": null, "urgencia": "baja", "extra": 1}'], answer: 3, explanation: 'The contract permits exactly producto and urgencia. An extra key is rejected even if the other fields are valid.' },
        { domain: 'Evaluation', question: 'What is needed beyond fixture agreement for a real model assessment?', options: ['Only the same dictionary again', 'Representative unseen cases, defined metrics and failure analysis', 'A screenshot of the model dropdown', 'A claim that RAG prevents all errors'], answer: 1, explanation: 'A meaningful model evaluation tests task quality on representative data not used to hardcode the responses, with explicit scoring.' },
        { domain: 'Design', question: 'Which credential description is accurate?', options: ['Fundamentals accreditation and Engineer Associate are the same exam', 'The mock awards Engineer Associate', 'Fundamentals is an accreditation; Engineer Associate is a separate certification', 'Free Edition access grants certification'], answer: 2, explanation: 'The Generative AI Fundamentals accreditation is distinct from the Generative AI Engineer Associate certification and exam guide.' },
        { type: 'hotspot', domain: 'Application Development', screen: 's15-entry', answer: 'playground', question: 'After AI/ML, where does the documented exploration path lead?', explanation: 'AI/ML → Playground is the verified path. Selecting this mock target neither opens a service nor submits a prompt.' },
        { type: 'hotspot', domain: 'Application Development', screen: 's15-model', answer: 'model', question: 'Where would you select a model in the documented Playground workflow?', explanation: 'The model dropdown selects the model in the real workflow. This simplified illustration does not connect to an endpoint.' },
        { type: 'hotspot', domain: 'Evaluation', screen: 's15-model', answer: 'add', question: 'Which control adds a comparison panel?', explanation: 'The + control adds another model panel for comparison. A mock click does not run an evaluation or an inference request.' },
        { type: 'hotspot', domain: 'Evaluation', screen: 's15-model', answer: 'sync', question: 'Which control synchronizes inputs between comparison panels?', explanation: 'Sync synchronizes inputs for comparison; it does not validate answers or guarantee deterministic, correct generations.' },
      ],
    },
  };
})(globalThis);
