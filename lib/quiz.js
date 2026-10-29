(function (root) {
  const DataLab = (root.DataLab = root.DataLab || {});
  const PASS_RATIO = 0.7;

  // answers[i] is the chosen option index, or undefined/null when unanswered.
  function grade(questions, answers) {
    const results = questions.map((q, i) => {
      const chosen = Number.isInteger(answers[i]) ? answers[i] : null;
      return { chosen, answer: q.answer, correct: chosen === q.answer };
    });
    const score = results.filter((r) => r.correct).length;
    const total = questions.length;
    return { score, total, passed: total > 0 && score / total >= PASS_RATIO, results };
  }

  DataLab.quiz = { grade, PASS_RATIO };
})(globalThis);
