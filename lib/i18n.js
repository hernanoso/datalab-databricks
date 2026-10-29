(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  const strings = {
    es: {
      brand: 'DataLab', spanish: 'Español', english: 'English', language: 'Idioma de estudio',
      skip: 'Saltar al contenido', menu: 'Sesiones', route: 'Mi ruta · 16 sesiones', home: 'Inicio',
      course: 'Ingeniería de Datos e IA con Databricks', hero: 'Entiende hoy. Llega preparado a clase.',
      intro: 'Conceptos desde cero, ejemplos y autoevaluación para preparar cada una de las 16 sesiones.',
      nextStudy: 'Estudiar la sesión {number} →', allStudied: '¡Has estudiado toda la ruta! Sigue repasando.',
      studiedCount: '{studied} / {total}', studiedLabel: 'sesiones estudiadas', percent: '{percent}%',
      completeLabel: 'de la ruta completa', noAccounts: 'Sin cuentas', localOnly: 'Tu progreso queda en este navegador.',
      sessions: 'Tu ruta de aprendizaje', sessionsIntro: 'Cada bloque temático tiene su color. Avanza a tu ritmo.',
      sessionNumber: 'Sesión {number}', minutes: '{minutes} min', studied: '✓ Estudiada', pending: 'Pendiente',
      best: 'Mejor autoevaluación: {score}/{total}', open: 'Estudiar →',
      why: 'Por qué importa', objectives: 'Objetivos', review: 'Antes de clase', concepts: 'Conceptos clave',
      example: 'Ejemplo', copy: 'Copiar código', copied: 'Código copiado.', copyFailed: 'No se pudo copiar. Selecciona el código y cópialo manualmente.',
      exercise: 'Practica', hint: 'Ver pista', solution: 'Ver solución', quiz: 'Comprueba lo que aprendiste',
      quizIntro: 'Responde todas las preguntas. El objetivo es acertar al menos el {percent}%.',
      submit: 'Comprobar respuestas', retry: 'Volver a intentar', correct: 'Correcto.', incorrect: 'Incorrecto.',
      score: 'Resultado: {score}/{total}', passed: '¡Objetivo alcanzado! Ya tienes una buena base para la clase.',
      notPassed: 'Repasa las explicaciones y vuelve a intentarlo.', answerAll: 'Responde todas las preguntas antes de comprobar.',
      questions: 'Preguntas para llevar a clase', glossary: 'Glosario', references: 'Referencias oficiales',
      mark: 'Marcar como estudiada', unmark: 'Quitar marca de estudiada', previous: '← Sesión anterior', next: 'Sesión siguiente →',
      notFound: 'No encontramos esta página', notFoundBody: 'El enlace no corresponde a una sesión de esta ruta.',
      backHome: 'Volver al inicio', saveFailed: 'No se pudo guardar el progreso en este navegador. Puedes seguir estudiando, pero los cambios podrían perderse al cerrar.',
      languageFailed: 'No se pudo guardar tu preferencia de idioma en este navegador.',
      englishUnavailable: 'El contenido en inglés aún no está disponible. Se muestra la sesión en español.',
      disclaimer: 'Material de preparación independiente basado en el temario del brochure. No es contenido oficial de Databricks ni de Smart Data.',
      homeTitle: 'Espacio de estudio — DataLab', sessionTitle: '{title} — DataLab', notFoundTitle: 'Página no encontrada — DataLab',
    },
    en: {
      brand: 'DataLab', spanish: 'Español', english: 'English', language: 'Study language',
      skip: 'Skip to content', menu: 'Sessions', route: 'My path · 16 sessions', home: 'Home',
      course: 'Data Engineering and AI with Databricks', hero: 'Understand today. Arrive ready for class.',
      intro: 'Concepts from scratch, examples and self-assessment to prepare for each of the 16 sessions.',
      nextStudy: 'Study session {number} →', allStudied: 'You have studied the whole path! Keep reviewing.',
      studiedCount: '{studied} / {total}', studiedLabel: 'sessions studied', percent: '{percent}%',
      completeLabel: 'of the path completed', noAccounts: 'No accounts', localOnly: 'Your progress stays in this browser.',
      sessions: 'Your learning path', sessionsIntro: 'Each topic has its own color. Learn at your own pace.',
      sessionNumber: 'Session {number}', minutes: '{minutes} min', studied: '✓ Studied', pending: 'Pending',
      best: 'Best quiz: {score}/{total}', open: 'Study →',
      why: 'Why it matters', objectives: 'Objectives', review: 'Before class', concepts: 'Key concepts',
      example: 'Example', copy: 'Copy code', copied: 'Code copied.', copyFailed: 'Could not copy. Select the code and copy it manually.',
      exercise: 'Practice', hint: 'Show hint', solution: 'Show solution', quiz: 'Check your understanding',
      quizIntro: 'Answer every question. Aim for at least {percent}% correct.',
      submit: 'Check answers', retry: 'Try again', correct: 'Correct.', incorrect: 'Incorrect.',
      score: 'Score: {score}/{total}', passed: 'Goal reached! You have a good foundation for class.',
      notPassed: 'Review the explanations and try again.', answerAll: 'Answer every question before checking.',
      questions: 'Questions to bring to class', glossary: 'Glossary', references: 'Official references',
      mark: 'Mark as studied', unmark: 'Unmark as studied', previous: '← Previous session', next: 'Next session →',
      notFound: 'Page not found', notFoundBody: 'This link does not match a session on this path.',
      backHome: 'Back to home', saveFailed: 'Progress could not be saved in this browser. You can keep studying, but changes may be lost when you close it.',
      languageFailed: 'Your language preference could not be saved in this browser.',
      englishUnavailable: 'English content is not available yet. The session is shown in Spanish.',
      disclaimer: 'Independent preparation material based on the brochure syllabus. Not official Databricks or Smart Data content.',
      homeTitle: 'Study workspace — DataLab', sessionTitle: '{title} — DataLab', notFoundTitle: 'Page not found — DataLab',
    },
  };
  // The course is taught in Spanish: English is an explicit choice, never inferred from the browser.
  function resolveLanguage(stored) {
    return stored === 'en' ? 'en' : 'es';
  }
  function t(lang, key, params = {}) {
    const value = strings[lang] && strings[lang][key];
    return typeof value === 'string' ? value.replace(/\{(\w+)\}/g, (match, name) =>
      Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match) : key;
  }
  DataLab.i18n = { strings, t, resolveLanguage, LANGUAGE_KEY: 'datalab.language' };
})(globalThis);
