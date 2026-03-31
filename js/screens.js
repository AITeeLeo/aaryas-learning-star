/* ============================================
   Aarya's Learning Star — Screen Renderers
   Each function returns HTML for a screen
   ============================================ */

const Screens = (() => {

  // ============================================
  // HOME SCREEN
  // ============================================
  function renderHome() {
    const totalStars = Storage.getTotalStars();
    const progress = Storage.getProgress();
    const hasWeekly = Storage.hasWeeklyTest();
    const weeklyDate = Storage.getWeeklyDate();
    const soundIcon = Sounds.isEnabled() ? '🔊' : '🔇';

    let weeklyCard = '';
    if (hasWeekly) {
      weeklyCard = `
        <div class="subject-card weekly-highlight slide-up slide-up-delay-1"
             data-subject="weekly" onclick="App.selectSubject('weekly')">
          <span class="emoji">📄</span>
          <span class="label">This Week's Test</span>
          <span class="star-count">Week of ${weeklyDate || 'Unknown'}</span>
        </div>
      `;
    }

    // Learning path section
    const learningPath = Storage.getLearningPath();
    let learningHTML = '';
    if (learningPath.length > 0) {
      const topItems = learningPath.slice(0, 3);
      learningHTML = `
        <p class="section-title">Your Learning Path</p>
        <div class="learning-path-cards">
          ${topItems.map((item, i) => renderLearningCard(item, i)).join('')}
        </div>
      `;
    }

    // Retry wrong answers card
    const retryCount = QuizEngine.getRetryCount();
    let retryCard = '';
    if (retryCount > 0) {
      retryCard = `
        <div class="retry-card slide-up" onclick="App.startRetry()">
          <span class="retry-icon">🔄</span>
          <div class="retry-info">
            <div class="retry-title">Practice What You Missed</div>
            <div class="retry-count">${retryCount} question${retryCount !== 1 ? 's' : ''} to master</div>
          </div>
          <span class="retry-arrow">→</span>
        </div>
      `;
    }

    // Milestone check
    const milestoneMsg = checkMilestone(totalStars);

    return `
      <div class="home-nav">
        <button class="nav-icon-btn" onclick="App.showProgress()" title="My Progress">📊</button>
        <div class="mascot mascot-bounce mascot-lg">⭐</div>
        <div style="display:flex;gap:8px">
          <button class="sound-toggle" onclick="App.toggleSound(this)" title="Toggle Sound">${soundIcon}</button>
          <button class="nav-icon-btn" onclick="App.showSettings()" title="Settings">⚙️</button>
        </div>
      </div>

      <h1 class="greeting">Hi Aarya! ⭐<br>Ready to learn?</h1>
      <p class="subtitle">You have <strong>${totalStars} stars</strong> — keep shining!</p>
      ${milestoneMsg ? `<div style="text-align:center;margin-bottom:12px;font-size:0.95rem;font-weight:700;color:#F97316">${milestoneMsg}</div>` : ''}

      ${retryCard}
      ${weeklyCard}

      <p class="section-title">Pick a Subject</p>
      <div class="subject-grid-5">
        ${renderSubjectCard('math', progress.math, 1)}
        ${renderSubjectCard('english', progress.english, 2)}
        ${renderSubjectCard('reading', progress.reading, 3)}
        ${renderSubjectCard('science', progress.science, 4)}
        ${renderSubjectCard('history', progress.history, 5)}
      </div>

      ${learningHTML}
    `;
  }

  function renderSubjectCard(subject, data, idx) {
    const info = SUBJECTS[subject];
    return `
      <div class="subject-card slide-up slide-up-delay-${idx}"
           data-subject="${subject}" onclick="App.selectSubject('${subject}')">
        <span class="emoji">${info.emoji}</span>
        <span class="label">${info.name}</span>
        <span class="star-count">⭐ ${data ? data.stars : 0} stars</span>
      </div>
    `;
  }

  function renderLearningCard(item, idx) {
    let onclick = '';
    if (item.type === 'retry-wrong') {
      onclick = `onclick="App.startRetry()"`;
    } else if (item.type === 'weak-subject' || item.type === 'new-subject' || item.type === 'level-up') {
      onclick = `onclick="App.selectSubject('${item.subject}')"`;
    }

    return `
      <div class="learning-card slide-up slide-up-delay-${idx + 1}" ${onclick}>
        <div class="learning-card-title">${item.title}</div>
        <div class="learning-card-desc">${item.description}</div>
      </div>
    `;
  }

  function checkMilestone(stars) {
    const milestones = [10, 25, 50, 100, 150, 200, 300, 500];
    for (const m of milestones) {
      if (stars >= m && stars < m + 3) {
        return getEncouragement('milestone', { n: m });
      }
    }
    return '';
  }

  // ============================================
  // DIFFICULTY SCREEN
  // ============================================
  function renderDifficulty(subject) {
    const info = SUBJECTS[subject];

    // Show "Read Aloud" option for reading subject
    const readAloudBtn = subject === 'reading' && ReadAloud.isSupported() ? `
      <div style="margin-top:16px;padding-top:16px;border-top:2px dashed var(--purple-light)">
        <button class="difficulty-btn read-aloud-option slide-up slide-up-delay-4"
                onclick="App.startReadAloud()">
          <div class="diff-label">🎤 Read Aloud</div>
          <div class="diff-desc">Read a passage out loud and check your accuracy!</div>
        </button>
      </div>
    ` : '';

    return `
      <div class="difficulty-screen">
        <button class="nav-icon-btn" onclick="App.goHome()" style="position:absolute;top:16px;left:16px">←</button>
        <div class="mascot mascot-lg float">${info.emoji}</div>
        <h2 class="greeting">${info.name}</h2>
        <p class="subtitle">How tricky do you want it?</p>

        <div class="difficulty-options">
          <button class="difficulty-btn slide-up slide-up-delay-1" data-diff="easy"
                  onclick="App.startQuiz('${subject}', 'easy')">
            <div class="diff-label">🌟 Easy</div>
            <div class="diff-desc">Great for warming up!</div>
          </button>
          <button class="difficulty-btn slide-up slide-up-delay-2" data-diff="medium"
                  onclick="App.startQuiz('${subject}', 'medium')">
            <div class="diff-label">⭐ Medium</div>
            <div class="diff-desc">A good challenge!</div>
          </button>
          <button class="difficulty-btn slide-up slide-up-delay-3" data-diff="hard"
                  onclick="App.startQuiz('${subject}', 'hard')">
            <div class="diff-label">🌠 Hard</div>
            <div class="diff-desc">For super stars!</div>
          </button>
        </div>
        ${readAloudBtn}
      </div>
    `;
  }

  // ============================================
  // QUIZ SCREEN
  // ============================================
  function renderQuiz(state) {
    if (!state.question) return '<p>No questions available!</p>';

    const q = state.question;
    const progressPct = ((state.index) / state.total * 100).toFixed(0);
    const subjectInfo = state.isRetryMode
      ? { emoji: '🔄', name: 'Practice Mode', color: '#FB923C' }
      : (SUBJECTS[state.subject] || SUBJECTS.math);

    // Reading passage (if present)
    let passageHTML = '';
    if (q.passage) {
      passageHTML = `
        <div class="passage-box">
          <div class="passage-label">Read this passage:</div>
          ${q.passage}
        </div>
      `;
    }

    // Streak indicator
    let streakHTML = '';
    if (state.correctStreak >= 2) {
      streakHTML = `
        <div class="quiz-streak-inline glow-streak">
          🔥 ${state.correctStreak} in a row!
        </div>
      `;
    }

    let answersHTML = '';
    if (q.type === 'fill-blank') {
      answersHTML = `
        <div class="fill-blank-area">
          <input type="text" class="fill-blank-input" id="fill-answer"
                 placeholder="Type your answer here..."
                 autocomplete="off" autocapitalize="off"
                 onkeydown="if(event.key==='Enter')App.submitFillBlank()">
          <button class="btn btn-primary btn-block submit-answer-btn"
                  onclick="App.submitFillBlank()">Check Answer</button>
        </div>
      `;
    } else {
      answersHTML = `<div class="options-list">` +
        q.options.map((opt, i) => `
          <button class="option-btn" data-index="${i}"
                  onclick="App.submitAnswer('${opt.replace(/'/g, "\\'")}')">
            ${opt}
          </button>
        `).join('') +
        `</div>`;
    }

    // Text for TTS — include passage if present
    const ttsText = q.passage
      ? q.passage + '. Question: ' + q.question
      : q.question;

    return `
      <div class="quiz-header">
        <button class="back-btn" onclick="App.confirmQuit()">✕</button>
        <span style="font-weight:700;color:var(--text-light)">${subjectInfo.emoji} ${subjectInfo.name}</span>
        <span class="score-display">⭐ ${state.score}</span>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${progressPct}%"></div>
      </div>

      ${streakHTML}

      <div class="question-card bounce-in" id="question-card">
        <div class="question-number">Question ${state.index + 1} of ${state.total}</div>
        ${passageHTML}
        <div class="question-text" id="question-text">${q.question}</div>
        <div class="tts-row">
          <button class="btn btn-tts btn-small" onclick="TTS.speak(\`${ttsText.replace(/`/g, "'").replace(/\\/g, '\\\\')}\`)">
            🔊 Read to me
          </button>
        </div>
        ${answersHTML}
        <div id="feedback-container"></div>
        <div id="next-btn-container"></div>
      </div>

      <div style="text-align:center;margin-top:8px;position:relative" id="mascot-area">
        <span class="mascot mascot-sm" id="quiz-mascot">⭐</span>
      </div>
    `;
  }

  // Render feedback after answering (with varied encouragement + explanation)
  function renderFeedback(result) {
    const cls = result.correct ? 'correct' : 'incorrect';

    let message;
    if (result.correct) {
      message = getEncouragement('correct');
    } else {
      // Show what Aarya chose, why it's wrong, and explain the correct answer
      const youChose = result.userAnswer
        ? `<div class="feedback-you-chose">You picked: <strong>${result.userAnswer}</strong></div>`
        : '';
      const correctLine = `<div class="feedback-correct-answer">The right answer is: <strong>${result.correctAnswer}</strong></div>`;
      const explanation = result.explanation
        ? `<div class="feedback-explanation">💡 <strong>Why?</strong> ${result.explanation}</div>`
        : '';
      message = `${getEncouragement('wrong')}${youChose}${correctLine}${explanation}`;
    }

    return `
      <div class="feedback-area ${cls}">
        ${message}
      </div>
    `;
  }

  // ============================================
  // RESULTS SCREEN
  // ============================================
  function renderResults(results) {
    const pct = Math.round((results.score / results.total) * 100);
    const subjectInfo = SUBJECTS[results.subject] || SUBJECTS.math;
    const isPerfect = pct === 100;

    let message, mascotClass, titleClass;
    if (isPerfect) {
      message = getEncouragement('perfect');
      mascotClass = 'mega-bounce';
      titleClass = 'rainbow-text';
    } else if (pct >= 80) {
      message = "Fantastic work, Aarya! You're doing great! 🌟";
      mascotClass = 'mascot-happy';
      titleClass = '';
    } else if (pct >= 50) {
      message = "Good try, Aarya! Keep practising and you'll be a star! 💪";
      mascotClass = 'mascot-bounce';
      titleClass = '';
    } else {
      message = "Nice effort, Aarya! Every try makes you smarter! 🧠";
      mascotClass = 'mascot-bounce';
      titleClass = '';
    }

    const starsDisplay = '⭐'.repeat(Math.min(results.score, 10));
    const bonusText = results.bonusStars > 0
      ? `<div style="margin-top:8px;font-size:1rem;color:var(--purple)">🎁 +${results.bonusStars} bonus stars!</div>`
      : '';

    const streakText = results.bestStreak >= 3
      ? `<div style="margin-top:6px;font-size:0.95rem;color:#F97316;font-weight:700">🔥 Best streak: ${results.bestStreak} in a row!</div>`
      : '';

    return `
      <div class="results-screen">
        <div class="mascot mascot-lg ${mascotClass} star-burst">${isPerfect ? '🏆' : subjectInfo.emoji}</div>
        <h2 class="greeting celebrate-text ${titleClass}">${isPerfect ? 'PERFECT SCORE!' : 'Quiz Complete!'}</h2>
        <div class="results-score ${isPerfect ? 'trophy-spin' : ''}">${results.score}/${results.total}</div>
        <div class="results-stars">${starsDisplay || '🌟'}</div>
        ${bonusText}
        ${streakText}
        <p class="results-message">${message}</p>

        <div class="results-actions">
          <button class="btn btn-primary btn-block"
                  onclick="App.startQuiz('${results.subject}', '${QuizEngine.getState().difficulty}')">
            🔄 Try Again
          </button>
          <button class="btn btn-secondary btn-block" onclick="App.goHome()">
            🏠 Pick Another Subject
          </button>
          <button class="btn btn-secondary btn-block" onclick="App.showProgress()">
            📊 My Progress
          </button>
        </div>
      </div>
    `;
  }

  // ============================================
  // PROGRESS DASHBOARD
  // ============================================
  function renderProgress() {
    const progress = Storage.getProgress();
    const totalStars = Storage.getTotalStars();
    const streak = Storage.getStreak();

    const subjects = ['math', 'english', 'reading', 'science', 'history'];
    if (Storage.hasWeeklyTest()) subjects.push('weekly');

    const subjectCards = subjects.map(s => {
      const info = SUBJECTS[s];
      const data = progress[s] || { stars: 0, questionsAnswered: 0, correctAnswers: 0 };
      const accuracy = data.questionsAnswered > 0
        ? Math.round((data.correctAnswers / data.questionsAnswered) * 100)
        : 0;

      return `
        <div class="subject-progress-card">
          <span class="sp-emoji">${info.emoji}</span>
          <div class="sp-info">
            <div class="sp-name">${info.name}</div>
            <div class="sp-detail">${data.questionsAnswered} questions · ${accuracy}% correct</div>
          </div>
          <span class="sp-stars">⭐ ${data.stars}</span>
        </div>
      `;
    }).join('');

    // Weakness insights
    const weaknesses = Storage.getWeaknesses();
    let weaknessHTML = '';
    if (weaknesses.length > 0) {
      weaknessHTML = `
        <p class="section-title">Areas to Improve</p>
        <div class="weakness-list">
          ${weaknesses.slice(0, 5).map(w => `
            <div class="weakness-card">
              <span class="weakness-emoji">${w.emoji}</span>
              <div class="weakness-info">
                <div class="weakness-label">${w.label}</div>
                <div class="weakness-bar-bg">
                  <div class="weakness-bar-fill" style="width:${w.errorRate}%"></div>
                </div>
                <div class="weakness-detail">${w.wrong} wrong out of ${w.total} (${w.errorRate}% errors)</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Learning path recommendations
    const learningPath = Storage.getLearningPath();
    let pathHTML = '';
    if (learningPath.length > 0) {
      pathHTML = `
        <p class="section-title">What to Do Next</p>
        <div class="learning-path-cards">
          ${learningPath.slice(0, 4).map((item, i) => renderLearningCard(item, i)).join('')}
        </div>
      `;
    }

    // Wrong answer count
    const wrongCount = Storage.getUnresolvedWrongIds().length;
    let retryHTML = '';
    if (wrongCount > 0) {
      retryHTML = `
        <div class="retry-card slide-up" onclick="App.startRetry()" style="margin-top:16px">
          <span class="retry-icon">🔄</span>
          <div class="retry-info">
            <div class="retry-title">Practice What You Missed</div>
            <div class="retry-count">${wrongCount} question${wrongCount !== 1 ? 's' : ''} to retry</div>
          </div>
          <span class="retry-arrow">→</span>
        </div>
      `;
    }

    return `
      <div class="progress-dashboard">
        <div class="dash-header">
          <button class="back-btn" onclick="App.goHome()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-light)">←</button>
          <h2 style="font-size:1.3rem;font-weight:700;color:var(--purple-dark)">My Progress</h2>
          <div style="width:32px"></div>
        </div>

        <div class="total-stars-card slide-up">
          <div class="star-number">⭐ ${totalStars}</div>
          <div class="star-label">Total Stars Earned</div>
        </div>

        <div class="streak-card slide-up slide-up-delay-1">
          <span class="streak-emoji">🔥</span>
          <div class="streak-info">
            <div class="streak-num">${streak.count} Day${streak.count !== 1 ? 's' : ''}</div>
            <div class="streak-label">Learning Streak</div>
          </div>
        </div>

        ${retryHTML}

        <p class="section-title">By Subject</p>
        ${subjectCards}

        ${weaknessHTML}
        ${pathHTML}
      </div>
    `;
  }

  // ============================================
  // READ ALOUD SCREEN
  // ============================================
  function renderReadAloud(state) {
    if (!state.supported) {
      return `
        <div class="results-screen">
          <div class="mascot mascot-lg">🎤</div>
          <h2 class="greeting">Oops!</h2>
          <p class="results-message">Read Aloud needs a newer browser. Try updating your phone or using Chrome!</p>
          <button class="btn btn-primary btn-block" onclick="App.goHome()">🏠 Back Home</button>
        </div>
      `;
    }

    if (state.error === 'mic-denied') {
      return `
        <div class="results-screen">
          <div class="mascot mascot-lg">🎤</div>
          <h2 class="greeting">We Need Your Microphone!</h2>
          <p class="results-message">Ask a grown-up to turn on the microphone so we can hear you read. Check your browser settings!</p>
          <button class="btn btn-primary btn-block" onclick="App.goHome()">🏠 Back Home</button>
        </div>
      `;
    }

    if (state.error === 'offline') {
      return `
        <div class="results-screen">
          <div class="mascot mascot-lg">📡</div>
          <h2 class="greeting">No Internet!</h2>
          <p class="results-message">Read Aloud needs the internet to listen. Connect to Wi-Fi and try again!</p>
          <button class="btn btn-primary btn-block" onclick="App.goHome()">🏠 Back Home</button>
        </div>
      `;
    }

    const segResult = state.segmentResult;
    const progressPct = ((state.currentSegmentIndex) / state.totalSegments * 100).toFixed(0);

    // Render words with color highlighting if we have results
    let wordsHTML;
    if (segResult) {
      wordsHTML = segResult.words.map(w =>
        `<span class="${w.correct ? 'word-correct' : 'word-wrong'}">${w.word}</span>`
      ).join(' ');
    } else {
      wordsHTML = `<span class="word-pending">${state.currentSegmentText}</span>`;
    }

    // Mic button state
    let micClass = 'mic-button';
    let micIcon = '🎤';
    let micLabel = 'Tap to read!';
    if (state.isListening) {
      micClass += ' listening';
      micIcon = '🔴';
      micLabel = 'Listening...';
    } else if (segResult) {
      micIcon = '🎤';
      micLabel = 'Tap to try again';
    }

    // Interim text display
    let interimHTML = '';
    if (state.interimText && state.isListening) {
      interimHTML = `<div class="interim-text">"${state.interimText}"</div>`;
    }

    // Feedback after segment
    let feedbackHTML = '';
    let actionsHTML = '';
    if (segResult) {
      const pct = Math.round(segResult.accuracy * 100);
      let emoji, msg;
      if (pct === 100) {
        emoji = '🌟';
        msg = 'Perfect reading!';
      } else if (pct >= 80) {
        emoji = '⭐';
        msg = 'Great job!';
      } else if (pct >= 50) {
        emoji = '💪';
        msg = 'Good try! Some tricky words there.';
      } else {
        emoji = '🤗';
        msg = "Let's practice this part again!";
      }

      feedbackHTML = `
        <div class="read-aloud-feedback bounce-in">
          <span style="font-size:1.5rem">${emoji}</span>
          <span>${msg} ${pct}% correct</span>
        </div>
      `;

      // Missed words helper
      if (segResult.missedWords.length > 0) {
        feedbackHTML += `
          <div class="missed-words-help">
            <div class="missed-label">Tricky words:</div>
            <div class="missed-words-list">
              ${segResult.missedWords.map(w =>
                `<button class="missed-word-chip" onclick="TTS.speak('${w.replace(/'/g, "\\'")}')">${w} 🔊</button>`
              ).join('')}
            </div>
            <div class="missed-hint">Tap a word to hear how it sounds!</div>
          </div>
        `;
      }

      const isLast = state.currentSegmentIndex + 1 >= state.totalSegments;
      actionsHTML = `
        <div class="read-aloud-actions">
          <button class="btn btn-secondary" onclick="App.readAloudRetry()">🔄 Try Again</button>
          <button class="btn btn-primary" onclick="App.readAloudNext()">
            ${isLast ? 'See Results ✨' : 'Next Part →'}
          </button>
        </div>
      `;
    }

    return `
      <div class="quiz-header">
        <button class="back-btn" onclick="App.readAloudQuit()">✕</button>
        <span style="font-weight:700;color:var(--text-light)">🎤 Read Aloud</span>
        <span class="score-display">Part ${state.currentSegmentIndex + 1}/${state.totalSegments}</span>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${progressPct}%"></div>
      </div>

      <div class="read-aloud-card bounce-in">
        <div class="read-aloud-instruction">Read this out loud:</div>
        <div class="segment-text">${wordsHTML}</div>
        ${interimHTML}
        ${feedbackHTML}

        <div class="mic-area">
          <button class="${micClass}" onclick="App.handleMicTap()">
            <span class="mic-icon">${micIcon}</span>
          </button>
          <div class="mic-label">${micLabel}</div>
        </div>

        ${actionsHTML}
      </div>
    `;
  }

  function renderReadAloudResults(results) {
    const pct = Math.round(results.accuracy * 100);
    let emoji, msg, mascotClass;
    if (pct >= 95) {
      emoji = '🏆';
      msg = 'Amazing reading, Aarya! You read almost every word perfectly!';
      mascotClass = 'mega-bounce';
    } else if (pct >= 80) {
      emoji = '🌟';
      msg = 'Great reading! You got most of the words right!';
      mascotClass = 'mascot-happy';
    } else if (pct >= 60) {
      emoji = '⭐';
      msg = "Good effort! Keep practising and you'll get even better!";
      mascotClass = 'mascot-bounce';
    } else {
      emoji = '💪';
      msg = "Nice try! Reading takes practice — you're getting stronger every time!";
      mascotClass = 'mascot-bounce';
    }

    let missedHTML = '';
    if (results.missedWords.length > 0) {
      missedHTML = `
        <div class="results-missed-section">
          <p class="section-title" style="text-align:center">Words to Practice</p>
          <div class="missed-words-grid">
            ${results.missedWords.map(w =>
              `<button class="missed-word-chip" onclick="TTS.speak('${w.replace(/'/g, "\\'")}')">${w} 🔊</button>`
            ).join('')}
          </div>
          <p style="text-align:center;font-size:0.85rem;color:var(--text-light);margin-top:8px">Tap a word to hear it!</p>
        </div>
      `;
    }

    return `
      <div class="results-screen">
        <div class="mascot mascot-lg ${mascotClass} star-burst">${emoji}</div>
        <h2 class="greeting celebrate-text">${pct >= 95 ? 'SUPER READER!' : 'Reading Done!'}</h2>

        <div class="read-aloud-stats">
          <div class="ra-stat">
            <div class="ra-stat-num">${pct}%</div>
            <div class="ra-stat-label">Accuracy</div>
          </div>
          <div class="ra-stat">
            <div class="ra-stat-num">${results.wordsPerMinute}</div>
            <div class="ra-stat-label">Words/Min</div>
          </div>
          <div class="ra-stat">
            <div class="ra-stat-num">${results.totalCorrect}/${results.totalWords}</div>
            <div class="ra-stat-label">Words Right</div>
          </div>
        </div>

        <p class="results-message">${msg}</p>

        ${missedHTML}

        <div class="results-actions">
          <button class="btn btn-primary btn-block" onclick="App.startReadAloud()">
            🎤 Read Another Passage
          </button>
          <button class="btn btn-secondary btn-block" onclick="App.goHome()">
            🏠 Back Home
          </button>
        </div>
      </div>
    `;
  }

  // ============================================
  // SETTINGS SCREEN (Parent area)
  // ============================================
  function renderSettings(authenticated) {
    if (!authenticated) {
      return renderPinScreen();
    }
    return renderSettingsContent();
  }

  function renderPinScreen() {
    const hasPin = Storage.getPIN() !== null;

    return `
      <div class="settings-screen">
        <div class="dash-header">
          <button class="back-btn" onclick="App.goHome()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-light)">←</button>
          <h2 style="font-size:1.3rem;font-weight:700;color:var(--purple-dark)">Parent Settings</h2>
          <div style="width:32px"></div>
        </div>

        <div class="pin-overlay">
          <div class="mascot mascot-sm">🔒</div>
          <h3 class="pin-title">${hasPin ? 'Enter Your PIN' : 'Create a 4-Digit PIN'}</h3>
          <p class="pin-subtitle">${hasPin ? 'This area is for parents only' : 'This keeps the settings safe from little fingers!'}</p>

          <div class="pin-input-row">
            <input type="tel" class="pin-digit" maxlength="1" id="pin-1"
                   oninput="App.handlePinInput(this, 1)" autofocus>
            <input type="tel" class="pin-digit" maxlength="1" id="pin-2"
                   oninput="App.handlePinInput(this, 2)">
            <input type="tel" class="pin-digit" maxlength="1" id="pin-3"
                   oninput="App.handlePinInput(this, 3)">
            <input type="tel" class="pin-digit" maxlength="1" id="pin-4"
                   oninput="App.handlePinInput(this, 4)">
          </div>
          <div id="pin-error"></div>
        </div>
      </div>
    `;
  }

  function renderSettingsContent() {
    const hasWeekly = Storage.hasWeeklyTest();
    const weeklyDate = Storage.getWeeklyDate();
    const savedPdfText = Storage.getUploadedPdfText();

    return `
      <div class="settings-screen">
        <div class="dash-header">
          <button class="back-btn" onclick="App.goHome()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-light)">←</button>
          <h2 style="font-size:1.3rem;font-weight:700;color:var(--purple-dark)">Parent Settings</h2>
          <div style="width:32px"></div>
        </div>

        <div class="settings-content">
          <!-- PDF Upload -->
          <div class="settings-group slide-up">
            <label>📄 Upload Study Material PDF</label>
            ${hasWeekly ? `<div class="upload-status success" style="margin-bottom:12px">
              ✅ Current test: Week of ${weeklyDate}
            </div>` : ''}
            <div class="upload-area" id="upload-area">
              <span class="upload-icon">📤</span>
              <span class="upload-text">Tap to upload PDF</span>
              <span class="upload-hint">Upload Abeka test/study PDF to view topics</span>
              <input type="file" accept=".pdf" id="pdf-input"
                     onchange="PdfUpload.handleFile(this.files[0])">
            </div>
            <div id="upload-status-area"></div>
            <div id="pdf-content-area">${savedPdfText ? '<div class="upload-status success" style="margin-top:12px">Previously uploaded PDF content is saved. Upload a new PDF to update.</div>' : ''}</div>
          </div>

          <!-- Parent Dashboard Link -->
          <div class="settings-group slide-up slide-up-delay-1">
            <label>📊 Parent Dashboard</label>
            <button class="btn btn-primary btn-block"
                    onclick="App.showParentDashboard()">
              View Learning Report
            </button>
            <div class="help-text">See Aarya's progress, strengths, and areas to improve.</div>
          </div>

          <!-- Cloud Sync -->
          <div class="settings-group slide-up slide-up-delay-2">
            <label>📱 View Progress From Your Phone</label>
            ${renderSyncSettings()}
          </div>

          <!-- Change PIN -->
          <div class="settings-group slide-up slide-up-delay-3">
            <label>Change PIN</label>
            <button class="btn btn-secondary btn-small"
                    onclick="Storage.setPIN(null); App.showSettings();">
              Reset PIN
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // PARENT DASHBOARD
  // ============================================
  function renderParentDashboard() {
    const progress = Storage.getProgress();
    const totalStars = Storage.getTotalStars();
    const history = Storage.getHistory();
    const streak = Storage.getStreak();
    const weaknesses = Storage.getWeaknesses();
    const learningPath = Storage.getLearningPath();
    const activityLog = Storage.getActivityLog();
    const readAloudStats = Storage.getReadAloudStats();

    const subjects = ['math', 'english', 'reading', 'science', 'history'];

    // Excelling subjects (>= 75% accuracy with at least 5 questions)
    const excelling = [];
    const struggling = [];
    subjects.forEach(s => {
      const data = progress[s];
      if (!data || data.questionsAnswered < 3) return;
      const accuracy = data.correctAnswers / data.questionsAnswered;
      if (accuracy >= 0.75) {
        excelling.push({ subject: s, accuracy: Math.round(accuracy * 100), stars: data.stars, answered: data.questionsAnswered });
      } else {
        struggling.push({ subject: s, accuracy: Math.round(accuracy * 100), stars: data.stars, answered: data.questionsAnswered });
      }
    });

    // Subjects not yet attempted
    const notStarted = subjects.filter(s => !progress[s] || progress[s].questionsAnswered === 0);

    // Recent activity (last 20 from history)
    const recentHistory = history.slice(-20).reverse();

    // Build excelling section
    let excellingHTML = '';
    if (excelling.length > 0) {
      excellingHTML = `
        <div class="parent-section">
          <div class="parent-section-title">🌟 Excelling In</div>
          ${excelling.map(e => `
            <div class="parent-stat-row good">
              <span class="parent-stat-emoji">${SUBJECTS[e.subject]?.emoji}</span>
              <div class="parent-stat-info">
                <div class="parent-stat-name">${SUBJECTS[e.subject]?.name}</div>
                <div class="parent-stat-detail">${e.accuracy}% accuracy · ${e.answered} questions · ${e.stars} stars</div>
              </div>
              <span class="parent-stat-badge good">${e.accuracy}%</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Build struggling section
    let strugglingHTML = '';
    if (struggling.length > 0) {
      strugglingHTML = `
        <div class="parent-section">
          <div class="parent-section-title">📌 Needs More Practice</div>
          ${struggling.map(s => `
            <div class="parent-stat-row warn">
              <span class="parent-stat-emoji">${SUBJECTS[s.subject]?.emoji}</span>
              <div class="parent-stat-info">
                <div class="parent-stat-name">${SUBJECTS[s.subject]?.name}</div>
                <div class="parent-stat-detail">${s.accuracy}% accuracy · ${s.answered} questions · ${s.stars} stars</div>
              </div>
              <span class="parent-stat-badge warn">${s.accuracy}%</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Not started section
    let notStartedHTML = '';
    if (notStarted.length > 0) {
      notStartedHTML = `
        <div class="parent-section">
          <div class="parent-section-title">🆕 Not Yet Explored</div>
          <div class="parent-not-started">
            ${notStarted.map(s => `<span class="parent-chip">${SUBJECTS[s]?.emoji} ${SUBJECTS[s]?.name}</span>`).join('')}
          </div>
        </div>
      `;
    }

    // Activity log
    let activityHTML = '';
    const combinedActivity = recentHistory.map(h => ({
      icon: h.correct ? '✅' : '❌',
      text: `${SUBJECTS[h.subject]?.name || h.subject} — ${h.correct ? 'Correct' : 'Missed'}: "${h.correctAnswer}"`,
      date: h.date,
      type: 'quiz'
    }));

    // Add activity log entries
    activityLog.slice(-10).reverse().forEach(entry => {
      combinedActivity.push({
        icon: entry.icon || '📝',
        text: entry.text,
        date: `${entry.date} ${entry.time}`,
        type: 'log'
      });
    });

    // Sort by most recent
    const displayActivity = combinedActivity.slice(0, 15);

    if (displayActivity.length > 0) {
      activityHTML = `
        <div class="parent-section">
          <div class="parent-section-title">📝 Recent Activity</div>
          <div class="parent-activity-log">
            ${displayActivity.map(a => `
              <div class="parent-activity-row">
                <span class="parent-activity-icon">${a.icon}</span>
                <div class="parent-activity-text">${a.text}</div>
                <div class="parent-activity-date">${a.date}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Recommendations
    let recsHTML = '';
    const recs = [];

    if (struggling.length > 0) {
      struggling.forEach(s => {
        recs.push(`Practice more <strong>${SUBJECTS[s.subject]?.name}</strong> — currently at ${s.accuracy}% accuracy. Try the easy difficulty first to build confidence.`);
      });
    }
    if (notStarted.length > 0) {
      recs.push(`Encourage Aarya to try <strong>${notStarted.map(s => SUBJECTS[s]?.name).join(', ')}</strong> — she hasn't started ${notStarted.length === 1 ? 'this subject' : 'these subjects'} yet.`);
    }
    const wrongCount = Storage.getUnresolvedWrongIds().length;
    if (wrongCount > 0) {
      recs.push(`There are <strong>${wrongCount} missed questions</strong> to review. Use the "Practice What You Missed" feature on the home screen.`);
    }
    if (excelling.length > 0) {
      excelling.forEach(e => {
        if (e.accuracy >= 90) {
          recs.push(`Aarya is doing great in <strong>${SUBJECTS[e.subject]?.name}</strong>! Consider trying the <strong>Hard</strong> difficulty to challenge her further.`);
        }
      });
    }
    if (readAloudStats) {
      const raAccPct = Math.round(readAloudStats.avgAccuracy * 100);
      if (raAccPct < 70) {
        recs.push(`Read Aloud accuracy is at <strong>${raAccPct}%</strong>. Regular reading practice (even 5 minutes/day) will help improve fluency.`);
      } else if (readAloudStats.trend === 'improving') {
        recs.push(`Read Aloud is <strong>improving</strong> — great progress! Keep the daily reading habit going.`);
      }
    }
    if (streak.count >= 3) {
      recs.push(`Amazing! Aarya has a <strong>${streak.count}-day learning streak</strong>. Keep it going!`);
    } else if (streak.count === 0) {
      recs.push(`Try to build a <strong>daily learning streak</strong> — even one quiz per day makes a big difference.`);
    }

    if (recs.length > 0) {
      recsHTML = `
        <div class="parent-section">
          <div class="parent-section-title">💡 Recommendations</div>
          <div class="parent-recs-list">
            ${recs.map(r => `<div class="parent-rec-item">${r}</div>`).join('')}
          </div>
        </div>
      `;
    }

    // Read aloud stats
    let readAloudHTML = '';
    if (readAloudStats) {
      readAloudHTML = `
        <div class="parent-section">
          <div class="parent-section-title">🎤 Read Aloud Summary</div>
          <div class="parent-ra-stats">
            <div class="parent-ra-stat">
              <div class="parent-ra-num">${readAloudStats.totalAttempts}</div>
              <div class="parent-ra-label">Sessions</div>
            </div>
            <div class="parent-ra-stat">
              <div class="parent-ra-num">${Math.round(readAloudStats.avgAccuracy * 100)}%</div>
              <div class="parent-ra-label">Avg Accuracy</div>
            </div>
            <div class="parent-ra-stat">
              <div class="parent-ra-num">${Math.round(readAloudStats.avgWPM)}</div>
              <div class="parent-ra-label">Avg WPM</div>
            </div>
            <div class="parent-ra-stat">
              <div class="parent-ra-num">${readAloudStats.trend === 'improving' ? '📈' : readAloudStats.trend === 'declining' ? '📉' : '➡️'}</div>
              <div class="parent-ra-label">Trend</div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="parent-dashboard">
        <div class="dash-header">
          <button class="back-btn" onclick="App.showSettings()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-light)">←</button>
          <h2 style="font-size:1.3rem;font-weight:700;color:var(--purple-dark)">Parent Dashboard</h2>
          <div style="width:32px"></div>
        </div>

        <div class="parent-hero slide-up">
          <div class="parent-hero-star">⭐ ${totalStars}</div>
          <div class="parent-hero-label">Total Stars Earned</div>
          <div class="parent-hero-sub">${history.length} questions answered · ${streak.count}-day streak</div>
        </div>

        ${excellingHTML}
        ${strugglingHTML}
        ${notStartedHTML}
        ${readAloudHTML}
        ${recsHTML}
        ${activityHTML}
      </div>
    `;
  }

  // ============================================
  // CLOUD SYNC SETTINGS
  // ============================================
  function renderSyncSettings() {
    if (CloudSync.isSyncEnabled()) {
      const code = CloudSync.getFamilyCode();
      return `
        <div class="sync-active">
          <div class="sync-status-ok">✅ Cloud sync is active</div>
          <div class="family-code-display">
            <div class="family-code-label">Your Family Code:</div>
            <div class="family-code-value" id="family-code">${code}</div>
            <button class="btn btn-secondary btn-small" onclick="App.copyFamilyCode()">📋 Copy Code</button>
          </div>
          <div class="help-text" style="margin-top:12px">
            <strong>To view from your phone:</strong><br>
            1. Open the app on your phone<br>
            2. Tap ⚙️ Settings → enter your PIN<br>
            3. Tap "View From Another Device"<br>
            4. Enter the family code above
          </div>
          <button class="btn btn-secondary btn-small" style="margin-top:12px"
                  onclick="CloudSync.syncNow(); this.textContent='✅ Synced!';">
            🔄 Sync Now
          </button>
        </div>
      `;
    }

    // Not enabled yet — one tap to enable
    return `
      <div class="sync-setup" style="text-align:center">
        <p style="font-size:0.9rem;color:var(--text-light);margin-bottom:12px">
          Sync Aarya's progress to the cloud so you can check it from your phone.
        </p>
        <button class="btn btn-primary btn-block" onclick="App.enableSync()">
          Enable Cloud Sync
        </button>
        <div id="sync-enable-status" style="margin-top:12px"></div>
        <div style="margin-top:16px;border-top:1px solid #E5E7EB;padding-top:12px">
          <p style="font-size:0.85rem;color:var(--text-light);margin-bottom:8px">Already enabled on Aarya's device?</p>
          <button class="btn btn-secondary btn-block btn-small" onclick="App.showRemoteViewer()">
            View From Another Device
          </button>
        </div>
      </div>
    `;
  }

  // ============================================
  // REMOTE VIEWER (parent's phone)
  // ============================================
  function renderRemoteViewer() {
    return `
      <div class="settings-screen">
        <div class="dash-header">
          <button class="back-btn" onclick="App.showSettings()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-light)">←</button>
          <h2 style="font-size:1.3rem;font-weight:700;color:var(--purple-dark)">View Progress</h2>
          <div style="width:32px"></div>
        </div>

        <div class="settings-content">
          <div class="settings-group" style="text-align:center">
            <div class="mascot mascot-sm" style="margin-bottom:12px">📱</div>
            <h3 style="font-size:1.1rem;margin-bottom:8px">Enter Family Code</h3>
            <p style="font-size:0.9rem;color:var(--text-light);margin-bottom:16px">
              Enter the 6-character code shown on Aarya's device
            </p>

            <input type="text" id="remote-code-input" class="family-code-input"
                   placeholder="ABC123" maxlength="6"
                   style="text-transform:uppercase;text-align:center;font-size:1.5rem;font-weight:800;letter-spacing:6px"
                   oninput="this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '')">

            <div id="remote-viewer-status" style="margin:12px 0"></div>

            <button class="btn btn-primary btn-block" onclick="App.fetchRemoteProgress()">
              View Dashboard
            </button>

          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // REMOTE PARENT DASHBOARD (read-only, from cloud data)
  // ============================================
  function renderRemoteParentDashboard(data) {
    const progress = data.progress || {};
    const totalStars = data.totalStars || 0;
    const history = data.history || [];
    const streak = data.streak || { count: 0 };
    const activityLog = data.activityLog || [];
    const lastSync = data.lastSyncFormatted || 'Unknown';

    const subjects = ['math', 'english', 'reading', 'science', 'history'];

    const excelling = [];
    const struggling = [];
    subjects.forEach(s => {
      const d = progress[s];
      if (!d || d.questionsAnswered < 3) return;
      const accuracy = d.correctAnswers / d.questionsAnswered;
      if (accuracy >= 0.75) {
        excelling.push({ subject: s, accuracy: Math.round(accuracy * 100), stars: d.stars, answered: d.questionsAnswered });
      } else {
        struggling.push({ subject: s, accuracy: Math.round(accuracy * 100), stars: d.stars, answered: d.questionsAnswered });
      }
    });

    const notStarted = subjects.filter(s => !progress[s] || progress[s].questionsAnswered === 0);

    // Build excelling section
    let excellingHTML = '';
    if (excelling.length > 0) {
      excellingHTML = `
        <div class="parent-section">
          <div class="parent-section-title">🌟 Excelling In</div>
          ${excelling.map(e => `
            <div class="parent-stat-row good">
              <span class="parent-stat-emoji">${SUBJECTS[e.subject]?.emoji}</span>
              <div class="parent-stat-info">
                <div class="parent-stat-name">${SUBJECTS[e.subject]?.name}</div>
                <div class="parent-stat-detail">${e.accuracy}% accuracy · ${e.answered} questions · ${e.stars} stars</div>
              </div>
              <span class="parent-stat-badge good">${e.accuracy}%</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    let strugglingHTML = '';
    if (struggling.length > 0) {
      strugglingHTML = `
        <div class="parent-section">
          <div class="parent-section-title">📌 Needs More Practice</div>
          ${struggling.map(s => `
            <div class="parent-stat-row warn">
              <span class="parent-stat-emoji">${SUBJECTS[s.subject]?.emoji}</span>
              <div class="parent-stat-info">
                <div class="parent-stat-name">${SUBJECTS[s.subject]?.name}</div>
                <div class="parent-stat-detail">${s.accuracy}% accuracy · ${s.answered} questions · ${s.stars} stars</div>
              </div>
              <span class="parent-stat-badge warn">${s.accuracy}%</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    let notStartedHTML = '';
    if (notStarted.length > 0) {
      notStartedHTML = `
        <div class="parent-section">
          <div class="parent-section-title">🆕 Not Yet Explored</div>
          <div class="parent-not-started">
            ${notStarted.map(s => `<span class="parent-chip">${SUBJECTS[s]?.emoji} ${SUBJECTS[s]?.name}</span>`).join('')}
          </div>
        </div>
      `;
    }

    // Recent activity
    const recentHistory = (Array.isArray(history) ? history : []).slice(-15).reverse();
    let activityHTML = '';
    const combinedActivity = recentHistory.map(h => ({
      icon: h.correct ? '✅' : '❌',
      text: `${SUBJECTS[h.subject]?.name || h.subject} — ${h.correct ? 'Correct' : 'Missed'}: "${h.correctAnswer}"`,
      date: h.date
    }));

    (Array.isArray(activityLog) ? activityLog : []).slice(-10).reverse().forEach(entry => {
      combinedActivity.push({
        icon: entry.icon || '📝',
        text: entry.text,
        date: `${entry.date} ${entry.time}`
      });
    });

    if (combinedActivity.length > 0) {
      activityHTML = `
        <div class="parent-section">
          <div class="parent-section-title">📝 Recent Activity</div>
          <div class="parent-activity-log">
            ${combinedActivity.slice(0, 15).map(a => `
              <div class="parent-activity-row">
                <span class="parent-activity-icon">${a.icon}</span>
                <div class="parent-activity-text">${a.text}</div>
                <div class="parent-activity-date">${a.date}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Read aloud stats from cloud data
    let readAloudHTML = '';
    const raHistory = data.readAloud || [];
    if (Array.isArray(raHistory) && raHistory.length > 0) {
      const totalAttempts = raHistory.length;
      const avgAccuracy = Math.round((raHistory.reduce((s, h) => s + h.overallAccuracy, 0) / totalAttempts) * 100);
      const avgWPM = Math.round(raHistory.reduce((s, h) => s + h.wordsPerMinute, 0) / totalAttempts);
      readAloudHTML = `
        <div class="parent-section">
          <div class="parent-section-title">🎤 Read Aloud Summary</div>
          <div class="parent-ra-stats">
            <div class="parent-ra-stat">
              <div class="parent-ra-num">${totalAttempts}</div>
              <div class="parent-ra-label">Sessions</div>
            </div>
            <div class="parent-ra-stat">
              <div class="parent-ra-num">${avgAccuracy}%</div>
              <div class="parent-ra-label">Avg Accuracy</div>
            </div>
            <div class="parent-ra-stat">
              <div class="parent-ra-num">${avgWPM}</div>
              <div class="parent-ra-label">Avg WPM</div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="parent-dashboard">
        <div class="dash-header">
          <button class="back-btn" onclick="App.showRemoteViewer()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-light)">←</button>
          <h2 style="font-size:1.3rem;font-weight:700;color:var(--purple-dark)">Aarya's Progress</h2>
          <div style="width:32px"></div>
        </div>

        <div class="remote-badge">
          📱 Viewing from cloud · Last synced: ${lastSync}
          <button class="btn btn-secondary btn-small" style="margin-top:8px" onclick="App.refreshRemote()">🔄 Refresh</button>
        </div>

        <div class="parent-hero slide-up">
          <div class="parent-hero-star">⭐ ${totalStars}</div>
          <div class="parent-hero-label">Total Stars Earned</div>
          <div class="parent-hero-sub">${history.length} questions answered · ${streak.count}-day streak</div>
        </div>

        ${excellingHTML}
        ${strugglingHTML}
        ${notStartedHTML}
        ${readAloudHTML}
        ${activityHTML}
      </div>
    `;
  }

  return {
    renderHome,
    renderDifficulty,
    renderQuiz,
    renderFeedback,
    renderResults,
    renderProgress,
    renderReadAloud,
    renderReadAloudResults,
    renderSettings,
    renderParentDashboard,
    renderRemoteViewer,
    renderRemoteParentDashboard
  };
})();
