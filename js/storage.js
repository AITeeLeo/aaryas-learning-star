/* ============================================
   Aarya's Learning Star — LocalStorage Manager
   Handles all persistent data: stars, progress,
   detailed answer history, and settings
   ============================================ */

const Storage = (() => {
  const KEYS = {
    STARS: 'aarya_stars',
    PROGRESS: 'aarya_progress',
    STREAK: 'aarya_streak',
    HISTORY: 'aarya_history',      // Detailed per-question answer log
    PIN: 'aarya_pin',
    API_KEY: 'aarya_api_key',
    WEEKLY_QUESTIONS: 'aarya_weekly_questions',
    WEEKLY_DATE: 'aarya_weekly_date',
    READ_ALOUD: 'aarya_read_aloud'
  };

  function defaultProgress() {
    return {
      math: { stars: 0, questionsAnswered: 0, correctAnswers: 0 },
      english: { stars: 0, questionsAnswered: 0, correctAnswers: 0 },
      reading: { stars: 0, questionsAnswered: 0, correctAnswers: 0 },
      science: { stars: 0, questionsAnswered: 0, correctAnswers: 0 },
      history: { stars: 0, questionsAnswered: 0, correctAnswers: 0 },
      weekly: { stars: 0, questionsAnswered: 0, correctAnswers: 0 }
    };
  }

  function get(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  }

  return {
    getTotalStars() {
      const progress = this.getProgress();
      return Object.values(progress).reduce((sum, s) => sum + s.stars, 0);
    },

    getProgress() {
      return get(KEYS.PROGRESS, defaultProgress());
    },

    // Record an answer — updates both summary progress AND detailed history
    recordAnswer(subject, isCorrect, questionId, userAnswer, correctAnswer, difficulty, questionType) {
      // Update summary progress
      const progress = this.getProgress();
      if (!progress[subject]) {
        progress[subject] = { stars: 0, questionsAnswered: 0, correctAnswers: 0 };
      }
      progress[subject].questionsAnswered++;
      if (isCorrect) {
        progress[subject].correctAnswers++;
        progress[subject].stars++;
      }
      set(KEYS.PROGRESS, progress);

      // Update detailed history
      if (questionId) {
        const history = this.getHistory();
        history.push({
          id: questionId,
          subject,
          difficulty: difficulty || 'unknown',
          type: questionType || 'unknown',
          correct: isCorrect,
          userAnswer: userAnswer || '',
          correctAnswer: correctAnswer || '',
          date: new Date().toISOString().split('T')[0],
          timestamp: Date.now()
        });
        // Keep last 500 entries to avoid localStorage bloat
        if (history.length > 500) history.splice(0, history.length - 500);
        set(KEYS.HISTORY, history);
      }
    },

    addBonusStars(subject, count) {
      const progress = this.getProgress();
      if (progress[subject]) {
        progress[subject].stars += count;
        set(KEYS.PROGRESS, progress);
      }
    },

    // ============================================
    // DETAILED HISTORY & ANALYTICS
    // ============================================

    getHistory() {
      return get(KEYS.HISTORY, []);
    },

    // Get questions Aarya has gotten wrong (for re-practice)
    getWrongAnswers(subject) {
      const history = this.getHistory();
      const wrong = {};
      // Track per question: if she got it right later, remove from wrong list
      history.forEach(h => {
        if (subject && h.subject !== subject) return;
        if (h.correct) {
          delete wrong[h.id];
        } else {
          wrong[h.id] = h;
        }
      });
      return Object.values(wrong);
    },

    // Get all wrong answer IDs that haven't been corrected yet
    getUnresolvedWrongIds() {
      const history = this.getHistory();
      const status = {};
      history.forEach(h => {
        if (h.correct) {
          status[h.id] = 'correct';
        } else {
          // Only mark wrong if not already corrected
          if (status[h.id] !== 'correct') {
            status[h.id] = 'wrong';
          }
        }
      });
      return Object.entries(status)
        .filter(([, s]) => s === 'wrong')
        .map(([id]) => id);
    },

    // Analyze weaknesses — returns sorted list of weak areas
    getWeaknesses() {
      const history = this.getHistory();
      if (history.length < 3) return []; // Need some data first

      // Group by subject
      const bySubject = {};
      history.forEach(h => {
        if (!bySubject[h.subject]) {
          bySubject[h.subject] = { total: 0, wrong: 0, wrongQuestions: [] };
        }
        bySubject[h.subject].total++;
        if (!h.correct) {
          bySubject[h.subject].wrong++;
          bySubject[h.subject].wrongQuestions.push(h);
        }
      });

      // Group by difficulty within each subject
      const byDifficulty = {};
      history.forEach(h => {
        const key = `${h.subject}:${h.difficulty}`;
        if (!byDifficulty[key]) {
          byDifficulty[key] = { subject: h.subject, difficulty: h.difficulty, total: 0, wrong: 0 };
        }
        byDifficulty[key].total++;
        if (!h.correct) byDifficulty[key].wrong++;
      });

      // Group by question type within each subject
      const byType = {};
      history.forEach(h => {
        const key = `${h.subject}:${h.type}`;
        if (!byType[key]) {
          byType[key] = { subject: h.subject, type: h.type, total: 0, wrong: 0 };
        }
        byType[key].total++;
        if (!h.correct) byType[key].wrong++;
      });

      // Calculate weakness scores (higher = more struggle)
      const weaknesses = [];

      Object.entries(bySubject).forEach(([subject, data]) => {
        if (data.total >= 3) {
          const errorRate = data.wrong / data.total;
          if (errorRate > 0.3) {
            weaknesses.push({
              type: 'subject',
              subject,
              label: SUBJECTS[subject]?.name || subject,
              emoji: SUBJECTS[subject]?.emoji || '📝',
              errorRate: Math.round(errorRate * 100),
              total: data.total,
              wrong: data.wrong
            });
          }
        }
      });

      Object.entries(byDifficulty).forEach(([, data]) => {
        if (data.total >= 3) {
          const errorRate = data.wrong / data.total;
          if (errorRate > 0.4) {
            weaknesses.push({
              type: 'difficulty',
              subject: data.subject,
              difficulty: data.difficulty,
              label: `${SUBJECTS[data.subject]?.name || data.subject} (${data.difficulty})`,
              emoji: SUBJECTS[data.subject]?.emoji || '📝',
              errorRate: Math.round(errorRate * 100),
              total: data.total,
              wrong: data.wrong
            });
          }
        }
      });

      Object.entries(byType).forEach(([, data]) => {
        if (data.total >= 3) {
          const errorRate = data.wrong / data.total;
          if (errorRate > 0.4) {
            const typeLabel = data.type === 'fill-blank' ? 'Fill-in-the-blank' :
                              data.type === 'true-false' ? 'True/False' : 'Multiple choice';
            weaknesses.push({
              type: 'question-type',
              subject: data.subject,
              questionType: data.type,
              label: `${typeLabel} in ${SUBJECTS[data.subject]?.name || data.subject}`,
              emoji: '✏️',
              errorRate: Math.round(errorRate * 100),
              total: data.total,
              wrong: data.wrong
            });
          }
        }
      });

      // Sort by error rate (worst first)
      weaknesses.sort((a, b) => b.errorRate - a.errorRate);
      return weaknesses;
    },

    // Get a learning path recommendation
    getLearningPath() {
      const weaknesses = this.getWeaknesses();
      const wrongIds = this.getUnresolvedWrongIds();
      const progress = this.getProgress();

      const path = [];

      // Priority 1: Practice questions she got wrong
      if (wrongIds.length > 0) {
        path.push({
          priority: 1,
          type: 'retry-wrong',
          title: '🔄 Practice What You Missed',
          description: `You have ${wrongIds.length} question${wrongIds.length !== 1 ? 's' : ''} to master! Let's try them again.`,
          count: wrongIds.length
        });
      }

      // Priority 2: Weak subjects
      weaknesses.filter(w => w.type === 'subject').forEach(w => {
        path.push({
          priority: 2,
          type: 'weak-subject',
          subject: w.subject,
          title: `${w.emoji} Work on ${w.label}`,
          description: `You're getting ${w.errorRate}% wrong here. More practice will help!`,
          errorRate: w.errorRate
        });
      });

      // Priority 3: Subjects she hasn't tried yet
      const allSubjects = ['math', 'english', 'reading', 'science', 'history'];
      allSubjects.forEach(s => {
        const data = progress[s];
        if (!data || data.questionsAnswered === 0) {
          path.push({
            priority: 3,
            type: 'new-subject',
            subject: s,
            title: `${SUBJECTS[s]?.emoji} Try ${SUBJECTS[s]?.name}!`,
            description: "You haven't explored this one yet. Give it a go!"
          });
        }
      });

      // Priority 4: Level up — subjects she's good at, suggest harder difficulty
      allSubjects.forEach(s => {
        const data = progress[s];
        if (data && data.questionsAnswered >= 10) {
          const accuracy = data.correctAnswers / data.questionsAnswered;
          if (accuracy >= 0.8) {
            path.push({
              priority: 4,
              type: 'level-up',
              subject: s,
              title: `🌟 Level up in ${SUBJECTS[s]?.name}!`,
              description: `You're getting ${Math.round(accuracy * 100)}% right! Try a harder difficulty.`
            });
          }
        }
      });

      return path;
    },

    // ============================================
    // READ ALOUD TRACKING
    // ============================================
    recordReadAloud(attempt) {
      const history = get(KEYS.READ_ALOUD, []);
      history.push(attempt);
      if (history.length > 100) history.splice(0, history.length - 100);
      set(KEYS.READ_ALOUD, history);
    },

    getReadAloudHistory() {
      return get(KEYS.READ_ALOUD, []);
    },

    // Words missed 3+ times across all sessions
    getStruggledWords(minCount = 3) {
      const history = this.getReadAloudHistory();
      const counts = {};
      history.forEach(attempt => {
        (attempt.missedWords || []).forEach(word => {
          counts[word] = (counts[word] || 0) + 1;
        });
      });
      return Object.entries(counts)
        .filter(([, count]) => count >= minCount)
        .sort((a, b) => b[1] - a[1])
        .map(([word, count]) => ({ word, count }));
    },

    getReadAloudStats() {
      const history = this.getReadAloudHistory();
      if (history.length === 0) return null;
      const totalAttempts = history.length;
      const avgAccuracy = history.reduce((s, h) => s + h.overallAccuracy, 0) / totalAttempts;
      const avgWPM = history.reduce((s, h) => s + h.wordsPerMinute, 0) / totalAttempts;
      // Recent trend (last 5 vs previous 5)
      let trend = 'steady';
      if (history.length >= 6) {
        const recent = history.slice(-3);
        const older = history.slice(-6, -3);
        const recentAvg = recent.reduce((s, h) => s + h.overallAccuracy, 0) / recent.length;
        const olderAvg = older.reduce((s, h) => s + h.overallAccuracy, 0) / older.length;
        if (recentAvg > olderAvg + 0.05) trend = 'improving';
        else if (recentAvg < olderAvg - 0.05) trend = 'declining';
      }
      return { totalAttempts, avgAccuracy, avgWPM, trend };
    },

    // ============================================
    // STREAK
    // ============================================
    getStreak() {
      return get(KEYS.STREAK, { count: 0, lastDate: null });
    },

    updateStreak() {
      const streak = this.getStreak();
      const today = new Date().toISOString().split('T')[0];
      if (streak.lastDate === today) return streak;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (streak.lastDate === yesterday) {
        streak.count++;
      } else {
        streak.count = 1;
      }
      streak.lastDate = today;
      set(KEYS.STREAK, streak);
      return streak;
    },

    // ============================================
    // SETTINGS
    // ============================================
    getPIN() { return get(KEYS.PIN, null); },
    setPIN(pin) { set(KEYS.PIN, pin); },
    getAPIKey() { return get(KEYS.API_KEY, ''); },
    setAPIKey(key) { set(KEYS.API_KEY, key); },

    getWeeklyQuestions() { return get(KEYS.WEEKLY_QUESTIONS, null); },
    setWeeklyQuestions(questions) {
      set(KEYS.WEEKLY_QUESTIONS, questions);
      set(KEYS.WEEKLY_DATE, new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      }));
    },
    getWeeklyDate() { return get(KEYS.WEEKLY_DATE, null); },
    hasWeeklyTest() {
      const q = this.getWeeklyQuestions();
      return q && q.length > 0;
    }
  };
})();
