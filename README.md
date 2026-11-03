# DataLab · Databricks study companion

A shareable website to prepare each of the 16 sessions of the course
"Ingeniería de Datos e IA con Databricks" before the live class. Every session
has concepts explained from scratch, a worked example, an exercise with hint
and solution, a self-assessment quiz, questions to bring to class, a glossary
and links to the official documentation.

Live site: <https://hernanoso.github.io/datalab-databricks/>

The material is independent, original study content based on the brochure
syllabus. It is not official Databricks or Smart Data material.

## Features

- 16 sessions in the brochure order, each with its own track color.
- Deep content, session by session: a sourced deep dive, an architecture
  diagram, a comparison table, a step-by-step guided lab for Databricks Free
  Edition and about ten original certification practice questions with their
  own best score. All 16 sessions now have expanded content in Spanish and English.
  Session 12 uses a synthetic Python stream-processing simulation, not a live
  Event Hubs connection; real Azure streaming is optional and needs compatible
  compute, networking and authentication. Session 13 uses synthetic temporary
  SQL data; Power BI connectivity from Free Edition is unverified, not required.
  DirectQuery freshness still depends on caching, refresh and permissions.
  Sessions 14–16 use offline Python simulations: a CI eligibility gate, fixed
  JSON classifications and a scripted tool loop—not real deployment, inference
  or autonomous reasoning. Their required labs need no secrets, network or paid
  resources. Bundle validation requires CLI/authentication/workspace access;
  deployment workflows and networked AI examples are optional references, not
  Free Edition requirements or production security/CI implementations.
  Low temperature does not guarantee correctness or reproducibility; inference
  has separate charges and availability/region/quota constraints, and final
  SQL LIMIT is not a hard spending guard. Tool schemas grant neither execution
  nor authorization; applications must validate and explicitly dispatch proposals.
  Traces are not universal audit logs. Apps/Lakebase are optional choices and
  deployment routes vary. Fundamentals is an accreditation, distinct from the
  Generative AI Engineer Associate certification.
- Interactive "where do you click?" questions and highlighted lab steps on an
  original, simplified illustration of the Databricks interface
  (`lib/mockui.js`); they are not screenshots and may differ from the real UI.
- Spanish (neutral) and English tabs. The site always opens in Spanish; English
  is remembered once a student chooses it.
- No accounts: progress (sessions marked as studied and best quiz score) is
  saved only in each browser's `localStorage`. It is shared between languages,
  it does not sync across devices, and clearing the browser's site data erases it.
- Plain HTML, CSS and JavaScript with no build step and no dependencies.

## Open it locally

Double-click `index.html`, or serve the folder:

```bash
npm start            # python -m http.server 8080
# then open http://localhost:8080
```

## Share it with the class

Share the live site link above. It is published with GitHub Pages from the
`main` branch root (`.nojekyll` serves the files as they are), so every push
to `main` updates it. Any other static host also works because the site is
only files, for example:

- **Netlify Drop**: drag the project folder onto <https://app.netlify.com/drop>.

Publishing makes the content public to anyone with the link.

## Edit the content

| File | Contains |
| --- | --- |
| `data/sessions.es.js` | Spanish material for the 16 sessions |
| `data/sessions.en.js` | English material, mirroring the Spanish structure |
| `data/deep/<lang>/sNN.js` | Deep content for one session in one language |
| `data/tracks.js` | Thematic tracks, colors and their labels |
| `lib/i18n.js` | Interface copy in both languages |

Both languages must keep the same sessions, quiz answers and reference URLs;
the tests enforce it. A new deep file also needs its `<script>` tag in
`index.html`, after the session data and before `app.js`.

GitHub Pages lets browsers reuse files for 10 minutes, so every script and
stylesheet in `index.html` carries the same `?v=` version. Change that
version in every tag whenever you publish; the tests check that all tags
share one version.

## Tests

```bash
npm test
```

Runs the Node built-in test runner over `tests/`: content completeness,
Spanish/English parity, deep content structure and parity, routing, quiz
grading, local progress and interface translations.
