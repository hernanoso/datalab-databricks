(function (D) {
  'use strict';
  // Storage access itself may throw (private browsing or file:// restrictions).
  let storage;
  try { storage = globalThis.localStorage; } catch { storage = null; }
  let storedLanguage;
  try { storedLanguage = storage && storage.getItem(D.i18n.LANGUAGE_KEY); } catch { /* Fall back to Spanish. */ }
  let lang = D.i18n.resolveLanguage(storedLanguage);
  let progress = D.progress.load(storage);
  let saveFailed = false;
  let languageFailed = false;
  // Preserve in-flight answers and feedback when the language changes.
  const quizStates = new Map();
  const app = document.getElementById('app');
  const t = (key, params) => D.i18n.t(lang, key, params);
  const href = D.router.sessionHref;
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function link(text, destination, className) {
    const node = el('a', text, className);
    node.href = destination;
    return node;
  }
  function button(text, action, className) {
    const node = el('button', text, className);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }
  function sessions() { return D.content[lang] || D.content.es; }
  function contentLanguage() { return D.content[lang] ? lang : 'es'; }
  function trackStyle(node, session) {
    const track = D.tracks[session.track];
    node.style.setProperty('--track', track.color);
    node.style.setProperty('--tint', track.tint);
    return node;
  }
  function trackLabel(session) { return D.tracks[session.track].label[contentLanguage()]; }
  function state(session) { return progress.sessions[session.id] || {}; }
  function save(next) {
    progress = next;
    saveFailed = !D.progress.save(storage, progress);
  }
  function status(session, parent) {
    const record = state(session);
    parent.append(el('span', record.studied ? t('studied') : t('pending'), 'tag'));
    if (record.quiz) parent.append(el('span', t('best', { score: record.quiz.best, total: record.quiz.total }), 'best'));
  }
  function list(items) {
    const ul = el('ul');
    items.forEach((item) => ul.append(el('li', item)));
    return ul;
  }
  function section(parent, key) {
    const node = el('section', null, 'lesson-section');
    node.append(el('h2', t(key)));
    parent.append(node);
    return node;
  }
  function codeBlock(example) {
    const box = el('div', null, 'code-block');
    const notice = el('span', '', 'copy-notice');
    notice.setAttribute('role', 'status');
    const copy = button(t('copy'), async () => {
      try {
        await navigator.clipboard.writeText(example.code);
        notice.textContent = t('copied');
      } catch { notice.textContent = t('copyFailed'); }
    });
    const toolbar = el('div', null, 'code-toolbar');
    toolbar.append(el('span', example.language), copy, notice);
    const pre = el('pre');
    pre.tabIndex = 0;
    pre.append(el('code', example.code));
    box.append(toolbar, pre);
    return box;
  }
  // Program map (artboard 02): the home page is the only overview; there is no sidebar.
  function renderHome(main) {
    document.title = t('homeTitle');
    const all = sessions();
    const stats = D.progress.summary(progress, all.map((session) => session.id));
    const next = all.find((session) => !state(session).studied);
    const hero = el('section', null, 'hero');
    const actions = el('div', null, 'hero-actions');
    // A '#map' link would be read as an unknown route, so the action scrolls instead of navigating.
    const explore = button(t('explore'), () => {
      const heading = document.getElementById('map-heading');
      const smooth = !globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
      heading.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      heading.focus({ preventScroll: true });
    }, 'cta');
    explore.id = 'explore';
    actions.append(explore);
    actions.append(next ? link(t('resume', { number: next.number }), href(next.number), 'resume-link') : el('p', t('allStudied')));
    hero.append(el('p', t('heroPill', { total: all.length }), 'pill'), el('h1', t('hero')), el('p', t('intro'), 'lead'), actions);
    main.append(hero);
    const statRow = el('div', null, 'stats');
    [[String(all.length), t('totalLabel')], [t('pace'), t('paceLabel')], [t('studiedCount', stats), t('completedLabel', stats)]].forEach(([value, label]) => {
      const stat = el('div', null, 'stat');
      stat.append(el('strong', value), el('span', label));
      statRow.append(stat);
    });
    main.append(statRow);
    const map = el('section', null, 'map');
    map.id = 'map';
    map.setAttribute('aria-labelledby', 'map-heading');
    const title = el('h2', t('mapTitle'));
    title.id = 'map-heading';
    title.tabIndex = -1;
    map.append(el('p', t('mapEyebrow'), 'eyebrow'), title, el('p', t('mapIntro'), 'muted'));
    const grid = el('div', null, 'grid');
    all.forEach((session) => {
      const card = trackStyle(el('article', null, 'card'), session);
      card.lang = contentLanguage();
      const meta = el('p', null, 'card-meta');
      meta.append(el('span', t('sessionNumber', { number: String(session.number).padStart(2, '0') }), 'card-number'), el('span', trackLabel(session)));
      const foot = el('div', null, 'card-foot');
      status(session, foot);
      const open = link(t('prep'), href(session.number), 'open-link');
      open.setAttribute('aria-label', `${t('prep')} ${session.title}`);
      foot.append(open);
      card.append(meta, el('h3', session.title), el('p', session.summary), el('p', t('minutes', session), 'muted'), foot);
      grid.append(card);
    });
    map.append(grid);
    main.append(map);
  }
  function renderQuiz(parent, session) {
    const area = section(parent, 'quiz');
    area.append(el('p', t('quizIntro', { percent: Math.round(D.quiz.PASS_RATIO * 100) })));
    if (state(session).quiz) area.append(el('p', t('best', { score: state(session).quiz.best, total: state(session).quiz.total }), 'best'));
    let current = quizStates.get(session.id);
    if (!current) {
      current = { answers: [], submitted: false };
      quizStates.set(session.id, current);
    }
    const result = current.submitted ? D.quiz.grade(session.quiz, current.answers) : null;
    const form = el('form');
    // We provide a localized aggregate message rather than browser validation text.
    form.noValidate = true;
    session.quiz.forEach((question, index) => {
      const field = el('fieldset');
      field.append(el('legend', `${index + 1}. ${question.question}`));
      question.options.forEach((option, optionIndex) => {
        const label = el('label', null, 'option');
        const input = el('input');
        input.type = 'radio';
        input.name = `question-${index}`;
        input.value = String(optionIndex);
        input.checked = current.answers[index] === optionIndex;
        input.disabled = current.submitted;
        input.addEventListener('change', () => { current.answers[index] = optionIndex; });
        label.append(input, el('span', option));
        field.append(label);
      });
      if (result) {
        const correct = result.results[index].correct;
        field.append(el('p', `${correct ? t('correct') : t('incorrect')} ${question.explanation}`, correct ? 'feedback correct' : 'feedback incorrect'));
      }
      form.append(field);
    });
    const error = el('p', '', 'feedback incorrect');
    error.setAttribute('role', 'alert');
    form.append(error);
    if (!result) {
      const submit = el('button', t('submit'), 'primary');
      submit.type = 'submit';
      form.append(submit);
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (current.submitted) return;
      if (session.quiz.some((_, index) => !Number.isInteger(current.answers[index]))) {
        error.textContent = t('answerAll');
        const missing = session.quiz.findIndex((_, index) => !Number.isInteger(current.answers[index]));
        form.querySelector(`input[name="question-${missing}"]`).focus();
        return;
      }
      current.submitted = true;
      const grade = D.quiz.grade(session.quiz, current.answers);
      save(D.progress.recordQuiz(progress, session.id, grade.score, grade.total));
      render(false, 'quiz-result');
    });
    area.append(form);
    if (result) {
      const output = el('div', null, 'quiz-result');
      output.id = 'quiz-result';
      output.tabIndex = -1;
      output.setAttribute('role', 'status');
      output.append(el('h3', t('score', result)), el('p', result.passed ? t('passed') : t('notPassed')));
      output.append(button(t('retry'), () => {
        quizStates.set(session.id, { answers: [], submitted: false });
        render(false, 'quiz-heading');
      }));
      area.append(output);
    }
    area.querySelector('h2').id = 'quiz-heading';
    area.querySelector('h2').tabIndex = -1;
  }
  function renderSession(main, number) {
    const session = sessions().find((item) => item.number === number);
    if (!session) { renderNotFound(main); return; }
    document.title = t('sessionTitle', session);
    const article = el('article', null, 'lesson');
    article.lang = contentLanguage();
    article.append(link(t('backToMap'), '#/', 'back-link'));
    const header = trackStyle(el('div', null, 'lesson-header'), session);
    header.append(el('p', `${t('sessionNumber', session)} · ${trackLabel(session)} · ${t('minutes', session)}`, 'eyebrow'), el('h1', session.title), el('p', session.summary));
    article.append(header);
    if (session.brochureNote) article.append(el('p', session.brochureNote, 'notice'));
    section(article, 'why').append(el('p', session.whyItMatters));
    section(article, 'objectives').append(list(session.objectives));
    section(article, 'review').append(list(session.review));
    const concepts = section(article, 'concepts');
    session.concepts.forEach((concept) => concepts.append(el('h3', concept.title), el('p', concept.body)));
    section(article, 'example').append(el('h3', session.example.title), codeBlock(session.example), el('p', session.example.explanation));
    const exercise = section(article, 'exercise');
    exercise.append(el('p', session.exercise.prompt));
    const hint = el('details');
    hint.append(el('summary', t('hint')), el('p', session.exercise.hint));
    const solution = el('details');
    solution.append(el('summary', t('solution')), codeBlock(session.exercise.solution));
    exercise.append(hint, solution);
    renderQuiz(article, session);
    section(article, 'questions').append(list(session.classQuestions));
    const glossary = el('dl');
    session.glossary.forEach((item) => glossary.append(el('dt', item.term), el('dd', item.definition)));
    section(article, 'glossary').append(glossary);
    const references = el('ul');
    session.references.forEach((item) => {
      const li = el('li');
      const a = link(item.label, item.url);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      li.append(a);
      references.append(li);
    });
    section(article, 'references').append(references);
    const actions = el('div', null, 'study-actions');
    const studied = Boolean(state(session).studied);
    const toggle = button(studied ? t('unmark') : t('mark'), () => {
      save(D.progress.setStudied(progress, session.id, !studied));
      render(false, 'study-toggle');
    }, 'primary');
    toggle.id = 'study-toggle';
    toggle.setAttribute('aria-pressed', String(studied));
    actions.append(toggle);
    const navigation = el('nav', null, 'session-navigation');
    navigation.setAttribute('aria-label', t('sessions'));
    if (number > 1) navigation.append(link(t('previous'), href(number - 1)));
    navigation.append(link(t('home'), '#/'));
    if (number < sessions().length) navigation.append(link(t('next'), href(number + 1)));
    article.append(actions, navigation);
    main.append(article);
  }
  function renderNotFound(main) {
    document.title = t('notFoundTitle');
    main.append(el('h1', t('notFound')), el('p', t('notFoundBody')), link(t('backHome'), '#/', 'cta'));
  }
  function switchLanguage(next) {
    lang = next;
    try { storage.setItem(D.i18n.LANGUAGE_KEY, lang); languageFailed = false; }
    catch { languageFailed = true; }
    render(false, `tab-${lang}`);
  }
  function render(moveFocus = false, focusId) {
    const route = D.router.parse(location.hash);
    document.documentElement.lang = lang;
    app.replaceChildren();
    app.append(link(t('skip'), '#main', 'skip-link'));
    const header = el('header', null, 'site-header');
    const identity = el('div', null, 'identity');
    identity.append(link(t('brand'), '#/', 'brand'), el('span', `/ ${t('tagline')}`, 'tagline'));
    header.append(identity);
    const tabs = el('div', null, 'languages');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', t('language'));
    ['es', 'en'].forEach((value) => {
      const tab = button(value === 'es' ? t('spanish') : t('english'), () => switchLanguage(value));
      tab.id = `tab-${value}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(lang === value));
      tab.setAttribute('aria-controls', 'language-panel');
      tab.tabIndex = lang === value ? 0 : -1;
      tab.addEventListener('keydown', (event) => {
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          switchLanguage(event.key === 'Home' ? 'es' : event.key === 'End' ? 'en' : value === 'es' ? 'en' : 'es');
        }
      });
      tabs.append(tab);
    });
    header.append(tabs);
    app.append(header);
    const panel = el('div');
    panel.id = 'language-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${lang}`);
    const main = el('main');
    main.id = 'main';
    main.tabIndex = -1;
    if (saveFailed) {
      const notice = el('p', t('saveFailed'), 'notice');
      notice.setAttribute('role', 'status');
      main.append(notice);
    }
    if (languageFailed) main.append(el('p', t('languageFailed'), 'notice'));
    if (lang === 'en' && !D.content.en) main.append(el('p', t('englishUnavailable'), 'notice'));
    if (route.view === 'home') renderHome(main);
    else if (route.view === 'session') renderSession(main, route.number);
    else renderNotFound(main);
    const heading = main.querySelector('h1');
    if (heading) heading.tabIndex = -1;
    panel.append(main);
    app.append(panel, el('footer', t('disclaimer')));
    if (focusId) document.getElementById(focusId)?.focus();
    else if (moveFocus && heading) heading.focus();
  }
  // A real skip link must not be interpreted as an unknown hash route.
  app.addEventListener('click', (event) => {
    const skip = event.target.closest('.skip-link');
    if (skip) { event.preventDefault(); document.getElementById('main').focus(); }
  });
  globalThis.addEventListener('hashchange', () => render(true));
  render(true);
})(globalThis.DataLab);
