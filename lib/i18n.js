(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  const strings = {
    es: {
      brand: 'DataLab', spanish: 'Español', english: 'English', language: 'Idioma de estudio',
      skip: 'Saltar al contenido', tagline: 'guía de estudio', home: 'Mapa del programa', backToMap: '← Mapa del programa',
      heroPill: 'Tu ruta de aprendizaje · {total} sesiones', hero: 'Entiende hoy. Llega preparado a clase.',
      intro: 'Ingeniería de Datos e IA con Databricks, paso a paso. Conceptos claros, ejemplos y práctica antes de cada encuentro.',
      explore: 'Explorar las sesiones →', resume: 'Continuar con la sesión {number}', allStudied: '¡Has estudiado toda la ruta! Sigue repasando.',
      totalLabel: 'sesiones para explorar', pace: 'A tu ritmo', paceLabel: 'sin cuentas ni horarios: tu progreso queda en este navegador',
      studiedCount: '{studied} / {total}', completedLabel: 'sesiones completadas · {percent}%',
      mapEyebrow: 'Tu próximo paso', mapTitle: 'Construye una base sólida', mapIntro: 'Cada bloque temático tiene su color. Entra a cada sesión para estudiarla.',
      sessions: 'Navegación entre sesiones', sessionNumber: 'Sesión {number}', minutes: '{minutes} min', studied: '✓ Estudiada', pending: 'Pendiente',
      best: 'Mejor autoevaluación: {score}/{total}', prep: 'Ver preparación →',
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
      homeTitle: 'Mapa del programa — DataLab', sessionTitle: '{title} — DataLab', notFoundTitle: 'Página no encontrada — DataLab',
    },
    en: {
      brand: 'DataLab', spanish: 'Español', english: 'English', language: 'Study language',
      skip: 'Skip to content', tagline: 'study guide', home: 'Program map', backToMap: '← Program map',
      heroPill: 'Your learning path · {total} sessions', hero: 'Understand today. Arrive ready for class.',
      intro: 'Data Engineering and AI with Databricks, step by step. Clear concepts, examples and practice before every class.',
      explore: 'Explore the sessions →', resume: 'Continue with session {number}', allStudied: 'You have studied the whole path! Keep reviewing.',
      totalLabel: 'sessions to explore', pace: 'At your own pace', paceLabel: 'no accounts or schedules: your progress stays in this browser',
      studiedCount: '{studied} / {total}', completedLabel: 'sessions completed · {percent}%',
      mapEyebrow: 'Your next step', mapTitle: 'Build a solid foundation', mapIntro: 'Each topic has its own color. Open a session to study it.',
      sessions: 'Session navigation', sessionNumber: 'Session {number}', minutes: '{minutes} min', studied: '✓ Studied', pending: 'Pending',
      best: 'Best quiz: {score}/{total}', prep: 'View preparation →',
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
      homeTitle: 'Program map — DataLab', sessionTitle: '{title} — DataLab', notFoundTitle: 'Page not found — DataLab',
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
