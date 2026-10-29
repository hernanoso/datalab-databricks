# DataLab · Databricks study companion

A shareable website to prepare each of the 16 sessions of the course
"Ingeniería de Datos e IA con Databricks" before the live class. Every session
has concepts explained from scratch, a worked example, an exercise with hint
and solution, a self-assessment quiz, questions to bring to class, a glossary
and links to the official documentation.

The material is independent, original study content based on the brochure
syllabus. It is not official Databricks or Smart Data material.

## Features

- 16 sessions in the brochure order, each with its own track color.
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

Any static host works because the site is only files. Two simple options:

- **GitHub Pages**: push this repository to GitHub, then in
  *Settings → Pages* publish from the branch root. Share the resulting URL.
- **Netlify Drop**: drag the project folder onto <https://app.netlify.com/drop>.

Publishing makes the content public to anyone with the link.

## Edit the content

| File | Contains |
| --- | --- |
| `data/sessions.es.js` | Spanish material for the 16 sessions |
| `data/sessions.en.js` | English material, mirroring the Spanish structure |
| `data/tracks.js` | Thematic tracks, colors and their labels |
| `lib/i18n.js` | Interface copy in both languages |

Both languages must keep the same sessions, quiz answers and reference URLs;
the tests enforce it.

## Tests

```bash
npm test
```

Runs the Node built-in test runner over `tests/`: content completeness,
Spanish/English parity, routing, quiz grading, local progress and interface
translations.
