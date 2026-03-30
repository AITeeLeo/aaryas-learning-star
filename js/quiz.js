/* ============================================
   Aarya's Learning Star — Quiz Engine
   Manages quiz state, question flow, scoring,
   streak tracking, and retry-wrong mode
   ============================================ */

const QuizEngine = (() => {
  let currentSubject = null;
  let currentDifficulty = null;
  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let answered = false;
  let correctStreak = 0;
  let bestStreak = 0;
  let isRetryMode = false; // Special mode for practicing wrong answers
  let onQuestionChange = null;
  let onQuizEnd = null;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function loadQuestions(subject, difficulty) {
    let pool;

    if (subject === 'weekly') {
      pool = Storage.getWeeklyQuestions() || [];
      if (difficulty !== 'all') {
        const filtered = pool.filter(q => q.difficulty === difficulty);
        pool = filtered.length >= 5 ? filtered : pool;
      }
    } else {
      pool = QUESTIONS_BANK[subject] || [];
      if (difficulty !== 'all') {
        const filtered = pool.filter(q => q.difficulty === difficulty);
        pool = filtered.length >= 5 ? filtered : pool;
      }
    }

    return shuffle(pool).slice(0, 10);
  }

  // Load questions that Aarya previously got wrong
  function loadRetryQuestions() {
    const wrongIds = Storage.getUnresolvedWrongIds();
    if (wrongIds.length === 0) return [];

    // Gather from all question banks
    const allQuestions = [];
    Object.entries(QUESTIONS_BANK).forEach(([, questions]) => {
      allQuestions.push(...questions);
    });
    // Also check weekly
    const weekly = Storage.getWeeklyQuestions();
    if (weekly) allQuestions.push(...weekly);

    const retryQuestions = allQuestions.filter(q => wrongIds.includes(q.id));
    return shuffle(retryQuestions).slice(0, 10);
  }

  return {
    // Start a normal quiz session
    start(subject, difficulty, callbacks) {
      currentSubject = subject;
      currentDifficulty = difficulty;
      questions = loadQuestions(subject, difficulty);
      currentIndex = 0;
      score = 0;
      correctStreak = 0;
      bestStreak = 0;
      answered = false;
      isRetryMode = false;
      onQuestionChange = callbacks.onQuestionChange;
      onQuizEnd = callbacks.onQuizEnd;

      Storage.updateStreak();

      if (questions.length === 0) {
        if (onQuizEnd) onQuizEnd({ score: 0, total: 0, subject });
        return;
      }

      if (onQuestionChange) onQuestionChange(this.getState());
    },

    // Start retry-wrong mode — practice questions she got wrong
    startRetry(callbacks) {
      currentSubject = 'retry';
      currentDifficulty = 'mixed';
      questions = loadRetryQuestions();
      currentIndex = 0;
      score = 0;
      correctStreak = 0;
      bestStreak = 0;
      answered = false;
      isRetryMode = true;
      onQuestionChange = callbacks.onQuestionChange;
      onQuizEnd = callbacks.onQuizEnd;

      Storage.updateStreak();

      if (questions.length === 0) {
        if (onQuizEnd) onQuizEnd({ score: 0, total: 0, subject: 'retry', noQuestions: true });
        return;
      }

      if (onQuestionChange) onQuestionChange(this.getState());
    },

    getState() {
      return {
        question: questions[currentIndex] || null,
        index: currentIndex,
        total: questions.length,
        score,
        subject: currentSubject,
        difficulty: currentDifficulty,
        answered,
        correctStreak,
        bestStreak,
        isRetryMode
      };
    },

    // Submit answer — now records detailed history
    submitAnswer(userAnswer) {
      if (answered || currentIndex >= questions.length) return null;

      answered = true;
      const q = questions[currentIndex];
      const correct = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();

      if (correct) {
        score++;
        correctStreak++;
        if (correctStreak > bestStreak) bestStreak = correctStreak;
      } else {
        correctStreak = 0;
      }

      // Determine the real subject for retry mode
      const recordSubject = isRetryMode
        ? (q.id?.startsWith('m') ? 'math' :
           q.id?.startsWith('e') ? 'english' :
           q.id?.startsWith('r') ? 'reading' :
           q.id?.startsWith('s') ? 'science' :
           q.id?.startsWith('h') ? 'history' :
           q.id?.startsWith('w') ? 'weekly' : 'math')
        : currentSubject;

      // Record with full detail
      Storage.recordAnswer(
        recordSubject,
        correct,
        q.id,
        userAnswer.trim(),
        q.answer,
        q.difficulty,
        q.type
      );

      return {
        correct,
        correctAnswer: q.answer,
        userAnswer: userAnswer.trim(),
        explanation: q.explanation,
        streak: correctStreak,
        isStreakMilestone: correct && correctStreak >= 3
      };
    },

    next() {
      currentIndex++;
      answered = false;

      if (currentIndex >= questions.length) {
        const pct = score / questions.length;
        const bonusStars = pct === 1 ? 7 :
                           pct >= 0.8 ? 4 :
                           pct >= 0.6 ? 2 :
                           pct >= 0.4 ? 1 : 0;

        if (!isRetryMode) {
          Storage.addBonusStars(currentSubject, bonusStars);
        }

        if (onQuizEnd) {
          onQuizEnd({
            score,
            total: questions.length,
            subject: currentSubject,
            bonusStars: isRetryMode ? 0 : bonusStars,
            bestStreak,
            isRetryMode
          });
        }
        return;
      }

      if (onQuestionChange) onQuestionChange(this.getState());
    },

    getQuestionCount(subject) {
      if (subject === 'weekly') {
        const wq = Storage.getWeeklyQuestions();
        return wq ? wq.length : 0;
      }
      return (QUESTIONS_BANK[subject] || []).length;
    },

    getRetryCount() {
      return Storage.getUnresolvedWrongIds().length;
    }
  };
})();
