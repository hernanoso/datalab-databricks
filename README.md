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
  own best score. Session 1 is available; the rest arrive in blocks.
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

## Tests

```bash
npm test
```

Runs the Node built-in test runner over `tests/`: content completeness,
Spanish/English parity, deep content structure and parity, routing, quiz
grading, local progress and interface translations.
