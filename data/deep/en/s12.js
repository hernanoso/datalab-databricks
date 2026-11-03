// Original content and questions; official sources supplied by the parent's research.
(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  DataLab.deep = DataLab.deep || {};
  DataLab.deep.en = DataLab.deep.en || {};
  const DOCS = 'https://docs.databricks.com/aws/en';
  const source = (label, path) => ({ label, url: `${DOCS}/${path}` });
  const kafka = { label: 'Event Hubs for Apache Kafka: capabilities and tiers', url: 'https://learn.microsoft.com/en-us/azure/event-hubs/azure-event-hubs-apache-kafka-overview' };
  const hubs = { label: 'Event Hubs: partitions and consumers', url: 'https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-features' };
  const streaming = source('Structured Streaming', 'structured-streaming/');
  const checkpoints = source('Structured Streaming checkpoints', 'structured-streaming/checkpoints');
  const watermarks = source('Watermarks and stateful processing', 'structured-streaming/watermarks');
  const serverless = source('Serverless streaming limitations', 'compute/serverless/limitations#streaming-limitations');
  const pipelines = source('Event Hubs as a Kafka source in pipelines', 'ldp/event-hubs');
  const free = source('Free Edition limitations', 'getting-started/free-edition-limitations');
  const notebooks = source('Run notebook cells', 'notebooks/run-notebook');
  const GUIDE = 'https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf';

  DataLab.deep.en.s12 = {
    deepDive: [
      {
        title: 'Event Hubs is the input log, not the transformation engine',
        body: [
          'A namespace contains event hubs; each event hub distributes events across partitions. Producers publish events and consumers read them from positions in the retained log. This separates reception from processing: a broker receiving an event does not mean that a Delta table already contains it.',
          'Partitions allow parallelism and preserve order within each partition, not a global order across all partitions. A partition key helps keep related events that need shared ordering together. Choose the strategy around business requirements: spreading load and preserving order are objectives you must balance.',
        ], source: hubs,
      },
      {
        title: 'Independent consumers and per-partition offsets',
        body: [
          'Consumer groups provide independent views of the same stream: a monitoring application and an archival application can advance separately without taking events away from each other. Read positions belong to the consumer and each partition; do not interpret an offset as a global event counter for the namespace.',
          'The lab reduces this model to one partition, ordered delivery and an in-memory last_offset. Accepting only larger values works in that model, but does not handle out-of-order delivery, multiple partitions or business-key deduplication. Production needs per-partition positions and persistent recovery compatible with the processing engine.',
        ], source: hubs,
      },
      {
        title: 'A documented Kafka path without a legacy EventHubs JAR',
        body: [
          'Event Hubs exposes a Kafka-compatible endpoint; an event hub is consumed as a topic. Kafka requires Standard, Premium or Dedicated, not Basic. Protocol compatibility does not turn every feature or configuration of a Kafka cluster into an identical Event Hubs capability.',
          'Lakeflow Spark Declarative Pipelines documentation describes Event Hubs through the Kafka source. You do not need to impose the old EventHubs connector with a custom JAR as a serverless learning prerequisite. Before a real connection, verify the tier, read permissions, approved authentication and outbound connectivity; the lab does not make that connection.',
        ], source: pipelines,
      },
      {
        title: 'Micro-batches, triggers and the serverless boundary',
        body: [
          'Structured Streaming expresses transformations over an unbounded input table and normally advances through micro-batches. Each execution processes an input range; the trigger determines when work runs, not the business time of each event. Processing an available batch is not the same as maintaining an always-on service.',
          'Serverless notebooks and jobs support AvailableNow; processingTime and the default continuously running micro-batch trigger are not supported. Pipelines have their own documented execution model: do not extrapolate the notebook restriction to every product. Free Edition does not promise connectivity or capacity for a permanent Azure workload.',
        ], source: serverless,
      },
      {
        title: 'event_time is not the broker timestamp',
        body: [
          'Event time represents when the business fact happened, according to the selected message field. The Kafka record timestamp or broker reception timestamp describes a different stage. For sales by window, explicitly parse event_time, define the time zone and consider late events; do not silently replace that field with arrival time.',
          'A five-minute window [10:00, 10:05) includes 10:01 and 10:03, but not 10:05. In this exercise 10:06 belongs to [10:05, 10:10). Windows are calculated in UTC and do not close by waiting five minutes on the clock: the code is an educational grouping without a watermark or Spark state.',
        ], source: watermarks,
      },
      {
        title: 'Watermark: observed progress, not a waiting timer',
        body: [
          'A watermark derives from observed event-time progress and the configured lateness threshold. It helps bound state and reason about late data in supported operations. It is not an instruction to sleep for ten minutes and does not necessarily advance just because wall-clock time passes without new events.',
          'Late-event acceptance and result emission depend on the operation and output mode. Append does not mean that every aggregation can immediately emit a final result; a watermarked window must meet finalization conditions. The simulation does not discard late events or demonstrate these guarantees.',
        ], source: watermarks,
      },
      {
        title: 'Checkpoint and sink determine real recovery',
        body: [
          'A Structured Streaming checkpoint preserves progress and, where relevant, state to recover a query. It is not just a variable holding the last number: its location must be persistent and specific to the query. Changing the source, state or configuration while reusing it can have restrictions; check compatibility before restarting.',
          'End-to-end guarantees depend on a replayable source and the behavior of the sink. Do not promise exactly once for every destination: a repeated external side effect, for example, needs an appropriate idempotent design. In the lab last_offset and results live only in memory; losing the session leaves no durable checkpoint.',
        ], source: checkpoints,
      },
      {
        title: 'Free Edition: local learning before external connectivity',
        body: [
          'Free Edition uses serverless and has quotas and outbound restrictions. Having a free notebook does not demonstrate that you can reach a particular Event Hubs namespace. The required exercise uses only standard Python and synthetic data: it does not provision Azure, request credentials, install libraries or write persistent data.',
          'The Azure extension is optional and conceptual only: review documented prerequisites without opening an unverified portal path or making external calls. Separating this architectural map from the simulation lets you learn offsets and windows without presenting a Python list as a Spark stream or a validated integration.',
        ], source: free,
      },
    ],
    diagram: {
      title: 'Real architecture and the simulation boundary',
      caption: 'Conceptual architecture based on the cited Event Hubs, Kafka, pipelines and checkpoint sources. The lab only simulates reading and aggregation in memory; it does not connect to these services or deploy this architecture.',
      layers: [
        { label: 'Producers', nodes: ['Events with business event_time', 'Partition key and payload'] },
        { label: 'Event Hubs', nodes: ['Namespace → event hub', 'Partitions: local order, not global', 'Kafka endpoint on a compatible tier'] },
        { label: 'Independent readers', nodes: ['Monitoring application', 'Kafka pipeline → transformations', 'Offsets per partition and reader'] },
        { label: 'Real state and output', nodes: ['Persistent query checkpoint', 'Windows and watermark depend on operation', 'Delta or other sink: verify guarantees'] },
        { label: 'Lab only', nodes: ['batch1 and batch2 lists, one partition', 'In-memory last_offset and aggregates', 'No Spark stream, Azure or durable checkpoint'] },
      ],
    },
    comparison: {
      title: 'Do not confuse these parts of the flow',
      headers: ['Component', 'Purpose', 'Does not guarantee', 'In the lab'],
      rows: [
        ['Partition', 'Local ordering and read parallelism', 'Global ordering of all events', 'One partition and ordered delivery'],
        ['Consumer group / reader', 'Independent progress for each application', 'A single global position for the namespace', 'One simplified reader'],
        ['AvailableNow trigger', 'Process available input and terminate', 'A permanent service or fixed latency', 'Two explicit calls to process'],
        ['event_time / window', 'Group by business time', 'Identical arrival and business times', 'Five-minute UTC buckets'],
        ['Watermark', 'Bound state using event_time progress', 'An exact wall-clock wait', 'Concept only; not implemented'],
        ['Checkpoint and sink', 'Compatible recovery and write semantics', 'Exactly once for every destination', 'Volatile memory without durable recovery'],
      ],
      sources: [hubs, kafka, serverless, watermarks, checkpoints],
    },
    lab: {
      title: 'Python STREAM-PROCESSING SIMULATION: offsets and windows',
      goal: 'Complete a deterministic single-partition simulation in Free Edition: accept increasing offsets, avoid recounting a replay and group events into five-minute windows. This is not a live Spark stream or an Event Hubs connection.',
      minutes: 45,
      requirements: [
        'A Python notebook with serverless in Databricks Free Edition, subject to its quota. You can also run the same code with standard Python 3 outside Databricks.',
        'No Azure subscription, credentials, external libraries, network or tables required. Use a new session and run the Python blocks in the stated order.',
        'Simplified model: one partition with offsets delivered in increasing order, except replays. This does not test real recovery, distributed processing or watermarks.',
      ],
      steps: [
        {
          title: 'Prepare a Python notebook and distinguish the mock',
          body: 'Open a notebook with Python and Serverless compute. The mock reuses verified notebook labels; Run all executes all cells in order after you have copied the blocks. The other batch and window illustrations are educational controls, not real Databricks menus. Do not run the Azure example in the base content for this lab.',
          check: 'The notebook uses Python; you understand this lab does not start spark.readStream or require secrets.',
          screen: { id: 's12-notebook', highlight: ['language', 'compute', 'runAll'] },
        },
        {
          title: 'Define two batches with one repeated event',
          body: 'Each tuple contains an offset, identifier, UTC event_time and integer amount. batch2 repeats offset 1 and adds 2. The fixed date and integers avoid dependence on the clock or monetary rounding. The event_time field is business time, not a Kafka reception timestamp.',
          code: { language: 'python', code: `from datetime import datetime

batch1 = [
    (0, "A", "2026-01-05T10:01:00+00:00", 10),
    (1, "B", "2026-01-05T10:03:00+00:00", 20),
]
batch2 = [batch1[1], (2, "C", "2026-01-05T10:06:00+00:00", 5)]
last_offset = -1
accepted = []
` },
          check: 'batch1 contains offsets [0, 1] and batch2 contains [1, 2]; no events have been accepted yet.',
          screen: { id: 's12-batches', highlight: ['batch1', 'batch2'] },
        },
        {
          title: 'Implement the single-partition reader and windows',
          body: 'Accept only offsets greater than last_offset and calculate bucket starts by truncating minutes to multiples of five. This filter assumes ordered delivery from one partition: if 2 arrived before 1, it would lose 1. Do not reuse it as general deduplication or a production checkpoint. All functions keep state only in memory.',
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
          check: 'The functions make no external calls and write no files. The HH:MM key only works for this fixed date; production must preserve the full date and time zone.',
        },
        {
          title: 'Process batch1 and check all aggregates',
          body: 'Run the first batch. Assertions verify the accepted count, last offset, aggregate and bucket. If an assertion fails, do not continue: return to a clean session and run the blocks from the beginning. The result is deterministic and does not depend on waiting for wall-clock time.',
          code: { language: 'python', code: `n1 = process(batch1)
assert (n1, last_offset, summary()) == (2, 1, (2, 30))
assert windows() == [("10:00", (2, 30))]
print(f"batch1 accepted={n1} last_offset={last_offset} count={summary()[0]} total={summary()[1]}")` },
          check: 'Exact output: batch1 accepted=2 last_offset=1 count=2 total=30',
        },
        {
          title: 'Process batch2 and separate business-time windows',
          body: 'The replay of B is not counted again because offset 1 has already been accepted. C adds five units to the 10:05 bucket. The illustration represents half-open windows: the right endpoint does not belong to the window. This code has no watermark or late-event policy.',
          code: { language: 'python', code: `n2 = process(batch2)
assert (n2, last_offset, summary()) == (1, 2, (3, 35))
assert windows() == [("10:00", (2, 30)), ("10:05", (1, 5))]
print(f"batch2 accepted={n2} last_offset={last_offset} count={summary()[0]} total={summary()[1]}")
for start, (count, total) in windows():
    print(f"window={start} count={count} total={total}")` },
          check: 'Three lines: batch2 accepted=1 last_offset=2 count=3 total=35; window=10:00 count=2 total=30; window=10:05 count=1 total=5.',
          screen: { id: 's12-windows', highlight: ['first', 'second', 'businessTime'] },
        },
        {
          title: 'Replay batch2 and verify that nothing changes',
          body: 'Save the visible state before replay and check that accepted events, count, amount, offset and windows all remain unchanged. This tests idempotence of this function within the same session, not a universal exactly-once guarantee for an external sink.',
          code: { language: 'python', code: `before = (list(accepted), last_offset, summary(), windows())
n_replay = process(batch2)
assert n_replay == 0
assert (list(accepted), last_offset, summary(), windows()) == before
print(f"replay accepted={n_replay} last_offset={last_offset} count={summary()[0]} total={summary()[1]}")` },
          check: 'Exact output: replay accepted=0 last_offset=2 count=3 total=35. All state is unchanged.',
          screen: { id: 's12-batches', highlight: ['replay', 'lastOffset'] },
        },
        {
          title: 'Explain the recovery you did NOT implement',
          body: 'Review the assertions without restarting or deleting anything. last_offset and accepted disappear when the session is lost: you did not write a durable checkpoint or a transactional sink. A real application must recover per-partition positions and state in a way compatible with the destination. In this simulation, windows are recalculated over all accepted events.',
          check: 'You can explain why replay is harmless here, but losing memory prevents continuing from previous progress. No cleanup is required: there is no persistent data.',
        },
        {
          title: 'Optional read-only extension: plan the Kafka path',
          body: 'Without provisioning or connecting anything, consult the Event Hubs for Kafka and Event Hubs in pipelines sources. Record prerequisites: an existing namespace and event hub, Standard/Premium/Dedicated tier (not Basic), an identity with authorized read access, approved authentication and permitted outbound networking. The design uses the Kafka source and does not require a legacy EventHubs JAR. An Azure subscription would only be needed to perform a real integration outside this exercise.',
          check: 'You have a conceptual producer → Event Hubs → Kafka reader → checkpoint/sink map. There are no external calls, secrets, new Azure resources or invented portal paths.',
        },
      ],
      wrapUp: 'The simulation produced 2 events and 30 after batch1, then 3 and 35 after batch2. Windows were 10:00 → 2/30 and 10:05 → 1/5; replaying batch2 changed nothing. State stayed in memory only: you did not test a Spark stream, a watermark or durable recovery. No persistent data needs deleting because none was created.',
      sources: [free, notebooks, hubs, kafka, pipelines, streaming, serverless, watermarks, checkpoints],
    },
    certification: {
      intro: 'Original practice questions, not official material or real exam questions. Aligned with Data Ingestion and Loading and Data Transformation and Modeling in the May 4, 2026 Data Engineer Associate guide. Educational controls are not product paths.',
      exams: [{ name: 'Databricks Certified Data Engineer Associate', url: GUIDE, domains: ['Data Ingestion and Loading', 'Data Transformation and Modeling'] }],
      questions: [
        { domain: 'Data Ingestion and Loading', question: 'Two applications must read the same events without sharing progress. Which concept enables independence?', options: ['One global position', 'Consumer groups and independent positions', 'A shared watermark', 'Sorting all partitions by amount'], answer: 1, explanation: 'Independent consumers maintain their progress; reading does not remove events for the other application. Source: Event Hubs, partitions and consumers.' },
        { domain: 'Data Ingestion and Loading', question: 'Where does the partitioned Event Hubs log guarantee order?', options: ['Across the entire namespace', 'Across all event hubs', 'Within each partition', 'Only in aggregate tables'], answer: 2, explanation: 'Order is per partition, not global. Source: Event Hubs, partitions and consumers; do not confuse parallelism with a global sequence.' },
        { domain: 'Data Ingestion and Loading', question: 'A plan proposes Event Hubs Basic with a Kafka reader. What do you correct first?', options: ['Verify a Standard, Premium or Dedicated tier', 'Add a watermark to enable Kafka', 'Replace event_time with amount', 'Use a Python list as a credential'], answer: 0, explanation: 'Kafka compatibility requires Standard, Premium or Dedicated, not Basic. Source: Event Hubs for Apache Kafka, capabilities and tiers.' },
        { domain: 'Data Ingestion and Loading', question: 'Which trigger processes available input and terminates in a compatible serverless notebook?', options: ['A ten-second processingTime', 'The always-running default', 'A Python timer as a real stream', 'AvailableNow'], answer: 3, explanation: 'AvailableNow is supported; processingTime and the default are not supported in serverless notebooks/jobs. Source: serverless streaming limitations.' },
        { domain: 'Data Transformation and Modeling', question: 'An order happened at 10:01 and reached the broker at 10:08. Which field supports sales by business time?', options: ['Notebook execution time', 'Validated business event_time', 'Always the broker timestamp', 'The offset converted to a timestamp'], answer: 1, explanation: 'Grouping by the time of the fact requires event_time, not replacing it with reception time. Source: watermarks and stateful processing.' },
        { domain: 'Data Transformation and Modeling', question: 'Which five-minute half-open UTC window contains exactly 10:05?', options: ['[10:00, 10:05)', 'Both windows', '[10:05, 10:10)', 'Neither until five minutes pass'], answer: 2, explanation: 'The left endpoint is included and the right endpoint excluded. Source: the cited window model; the simulation truncates minutes to multiples of five.' },
        { domain: 'Data Transformation and Modeling', question: 'No new events arrive for ten minutes. What can you say about a watermark?', options: ['It does not necessarily advance from wall-clock time alone', 'It always closes every window in ten minutes', 'It automatically duplicates state', 'It resets all offsets to zero'], answer: 0, explanation: 'A watermark follows observed event-time progress, not a wall-clock timer. Source: watermarks and stateful processing.' },
        { domain: 'Data Ingestion and Loading', question: 'Which cautious statement describes recovery of a real query?', options: ['An in-memory variable is always sufficient', 'Every sink provides exactly once', 'A checkpoint stores and publishes credentials', 'Source, persistent checkpoint and sink determine guarantees'], answer: 3, explanation: 'The guarantee depends on compatible source and destination capabilities and recoverable state. Source: Structured Streaming checkpoints.' },
        { domain: 'Data Ingestion and Loading', question: 'After the two lab batches, batch2 is replayed. What happens in the same session?', options: ['Two events are accepted and the total becomes 60', 'Zero are accepted and count=3 total=35 is preserved', 'C is removed and the total returns to 30', 'A durable checkpoint is created'], answer: 1, explanation: 'Offsets 1 and 2 do not exceed last_offset=2. The lab assertions prove that all visible state remains unchanged.' },
        { domain: 'Data Ingestion and Loading', question: 'What limits the lab rule offset > last_offset?', options: ['It cannot handle integer amounts', 'It requires a custom JAR', 'It only models one partition with ordered delivery and volatile memory', 'It imposes a five-minute watermark'], answer: 2, explanation: 'This is a simplified model, not an implementation of per-partition offsets or durable recovery. Sources: Event Hubs and checkpoints.' },
        { domain: 'Data Ingestion and Loading', question: 'Which documented path can you study for reading Event Hubs in Lakeflow pipelines?', options: ['The Kafka source with verified access prerequisites', 'A mandatory EventHubs JAR in Free Edition', 'The browser without authentication', 'Guaranteed connectivity from any free account'], answer: 0, explanation: 'Event Hubs in pipelines documentation uses the Kafka source. Free Edition restricts outbound access and quotas; studying the design does not validate a connection.' },
        { domain: 'Data Transformation and Modeling', question: 'What does successfully running this lab demonstrate?', options: ['An end-to-end Azure integration', 'A production Spark watermark', 'Durable recovery after losing memory', 'The offset and window arithmetic of the simulation'], answer: 3, explanation: 'It only demonstrates the local model with results 30 and 35 and unchanged replay. It runs no Spark Streaming, networking or persistent storage.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's12-notebook', answer: 'runAll', question: 'You copied all blocks in order. Which verified notebook label executes all cells?', explanation: 'Run all executes the notebook; here it runs standard Python and does not start a Spark stream. Source: run notebook cells.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's12-batches', answer: 'lastOffset', question: 'In the educational illustration, where do you inspect volatile progress that is NOT a durable checkpoint?', explanation: 'last_offset=2 lives only in memory. This is an original educational control, not a Databricks path. Sources: lab and checkpoints.' },
        { type: 'hotspot', domain: 'Data Transformation and Modeling', screen: 's12-windows', answer: 'second', question: 'In the educational illustration, which window contains C with event_time 10:06 and amount 5?', explanation: 'C belongs to [10:05, 10:10), with count=1 total=5. This illustrates the assertion result, not a Spark screen.' },
        { type: 'hotspot', domain: 'Data Ingestion and Loading', screen: 's12-batches', answer: 'replay', question: 'Which educational control represents the test that replaying batch2 does not change aggregates?', explanation: 'Replaying batch2 accepts zero events and preserves count=3 total=35. The control is educational; it does not operate a real query or promise durable recovery.' },
      ],
    },
  };
})(globalThis);
