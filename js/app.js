/* ============================================
   Aarya's Learning Star — Main App Controller
   Manages navigation, screen switching, sounds,
   streak banners, and coordinates all modules
   ============================================ */

const App = (() => {
  const appEl = document.getElementById('app');
  let currentScreen = 'home';
  let settingsAuthenticated = false;

  // Render a screen into the app container
  function show(html) {
    appEl.innerHTML = html;
    window.scrollTo(0, 0);
  }

  // Show a streak banner that auto-dismisses
  function showStreakBanner(streak) {
    const msg = getEncouragement('streak', { n: streak });
    const banner = document.createElement('div');
    banner.className = 'streak-banner';
    banner.textContent = msg;
    document.body.appendChild(banner);

    Sounds.streak();

    setTimeout(() => {
      banner.classList.add('fade-out');
      setTimeout(() => banner.remove(), 400);
    }, 2000);
  }

  // Show points flying up from mascot area
  function showPointsFly(text) {
    const area = document.getElementById('mascot-area');
    if (!area) return;
    const el = document.createElement('div');
    el.className = 'points-fly';
    el.textContent = text;
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    area.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }

  // ============================================
  // NAVIGATION
  // ============================================

  function goHome() {
    currentScreen = 'home';
    TTS.stop();
    show(Screens.renderHome());
  }

  function selectSubject(subject) {
    currentScreen = 'difficulty';
    Sounds.tap();
    show(Screens.renderDifficulty(subject));
  }

  function startQuiz(subject, difficulty) {
    currentScreen = 'quiz';
    Sounds.tap();
    QuizEngine.start(subject, difficulty, {
      onQuestionChange: (state) => {
        show(Screens.renderQuiz(state));
      },
      onQuizEnd: (results) => {
        currentScreen = 'results';
        show(Screens.renderResults(results));

        // Log activity
        const subInfo = SUBJECTS[results.subject];
        Storage.logActivity({
          icon: results.score === results.total ? '🏆' : '📝',
          text: `Completed ${subInfo?.name || results.subject} quiz: ${results.score}/${results.total} correct`
        });

        // Sound + visual celebrations based on score
        const pct = results.score / results.total;
        if (pct === 1) {
          // Perfect score — big fanfare + massive confetti
          setTimeout(() => Sounds.fanfare(), 200);
          Confetti.burst(150);
          setTimeout(() => Confetti.rain(60, 2500), 800);
        } else if (pct >= 0.8) {
          setTimeout(() => Sounds.goodJob(), 200);
          Confetti.burst(100);
        } else if (pct >= 0.5) {
          setTimeout(() => Sounds.goodJob(), 200);
          Confetti.rain(40, 1500);
        } else {
          // Still encouraging — gentle stars
          Confetti.rain(15, 1000);
        }
      }
    });
  }

  // ============================================
  // READ ALOUD
  // ============================================
  function startReadAloud() {
    currentScreen = 'read-aloud';
    Sounds.tap();
    TTS.stop();

    const passages = ReadAloud.getPassages();
    if (passages.length === 0) return;

    // Pick a random passage
    const pick = passages[Math.floor(Math.random() * passages.length)];

    ReadAloud.start(pick.passage, {
      onStateChange: (state) => {
        show(Screens.renderReadAloud(state));
      },
      onComplete: (results) => {
        currentScreen = 'read-aloud-results';
        show(Screens.renderReadAloudResults(results));

        const pct = results.accuracy;
        if (pct >= 0.95) {
          setTimeout(() => Sounds.fanfare(), 200);
          Confetti.burst(120);
        } else if (pct >= 0.8) {
          setTimeout(() => Sounds.goodJob(), 200);
          Confetti.burst(80);
        } else if (pct >= 0.5) {
          Confetti.rain(30, 1200);
        }
      }
    });
  }

  function handleMicTap() {
    Sounds.tap();
    ReadAloud.tapMic();
  }

  function readAloudNext() {
    Sounds.tap();
    ReadAloud.nextSegment();
  }

  function readAloudRetry() {
    Sounds.tap();
    ReadAloud.retrySegment();
    // Re-render
    show(Screens.renderReadAloud(ReadAloud.getState()));
  }

  function readAloudQuit() {
    if (confirm('Are you sure you want to stop reading?')) {
      ReadAloud.abort();
      goHome();
    }
  }

  function startRetry() {
    currentScreen = 'quiz';
    Sounds.tap();
    QuizEngine.startRetry({
      onQuestionChange: (state) => {
        show(Screens.renderQuiz(state));
      },
      onQuizEnd: (results) => {
        currentScreen = 'results';
        if (results.noQuestions) {
          show(`
            <div class="results-screen">
              <div class="mascot mascot-lg mascot-happy star-burst">🌟</div>
              <h2 class="greeting">All Clear!</h2>
              <p class="results-message">You've mastered all your missed questions! Amazing work, Aarya!</p>
              <div class="results-actions">
                <button class="btn btn-primary btn-block" onclick="App.goHome()">🏠 Back Home</button>
              </div>
            </div>
          `);
          Confetti.burst(80);
          return;
        }
        show(Screens.renderResults(results));

        const pct = results.score / results.total;
        if (pct === 1) {
          setTimeout(() => Sounds.fanfare(), 200);
          Confetti.burst(150);
          setTimeout(() => Confetti.rain(60, 2500), 800);
        } else if (pct >= 0.8) {
          setTimeout(() => Sounds.goodJob(), 200);
          Confetti.burst(100);
        } else if (pct >= 0.5) {
          setTimeout(() => Sounds.goodJob(), 200);
          Confetti.rain(40, 1500);
        } else {
          Confetti.rain(15, 1000);
        }
      }
    });
  }

  function showProgress() {
    currentScreen = 'progress';
    TTS.stop();
    Sounds.tap();
    show(Screens.renderProgress());
  }

  function showSettings() {
    currentScreen = 'settings';
    TTS.stop();
    settingsAuthenticated = false;
    show(Screens.renderSettings(false));
    setTimeout(() => {
      const first = document.getElementById('pin-1');
      if (first) first.focus();
    }, 100);
  }

  function showParentDashboard() {
    currentScreen = 'parent-dashboard';
    show(Screens.renderParentDashboard());
  }

  // ============================================
  // CLOUD SYNC
  // ============================================
  let lastRemoteCode = null;

  function showRemoteViewer() {
    currentScreen = 'remote-viewer';
    show(Screens.renderRemoteViewer());
  }

  function copyFamilyCode() {
    const code = CloudSync.getFamilyCode();
    if (code && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.family-code-display .btn');
        if (btn) { btn.textContent = '✅ Copied!'; setTimeout(() => btn.textContent = '📋 Copy Code', 2000); }
      });
    }
  }

  function enableSync() {
    const statusEl = document.getElementById('sync-enable-status');
    if (statusEl) statusEl.innerHTML = '<div class="upload-status processing">Connecting...</div>';

    const result = CloudSync.enableSync();

    if (result.success) {
      // Refresh settings view to show the family code
      settingsAuthenticated = true;
      show(Screens.renderSettings(true));
    } else {
      if (statusEl) statusEl.innerHTML = `<div class="upload-status error">❌ ${result.error}</div>`;
    }
  }

  async function fetchRemoteProgress() {
    const input = document.getElementById('remote-code-input');
    const statusEl = document.getElementById('remote-viewer-status');
    if (!input || !input.value.trim()) {
      if (statusEl) statusEl.innerHTML = '<div class="upload-status error">Please enter a family code.</div>';
      return;
    }

    const code = input.value.trim().toUpperCase();
    lastRemoteCode = code;

    if (statusEl) statusEl.innerHTML = '<div class="upload-status processing">Loading progress...</div>';

    try {
      const data = await CloudSync.fetchByCode(code);
      currentScreen = 'remote-dashboard';
      show(Screens.renderRemoteParentDashboard(data));
    } catch (err) {
      if (statusEl) statusEl.innerHTML = `<div class="upload-status error">❌ ${err.message}</div>`;
    }
  }

  async function refreshRemote() {
    if (!lastRemoteCode) return;
    try {
      const data = await CloudSync.fetchByCode(lastRemoteCode);
      show(Screens.renderRemoteParentDashboard(data));
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  }

  // ============================================
  // PIN HANDLING
  // ============================================

  function handlePinInput(input, pos) {
    input.value = input.value.replace(/\D/g, '');

    if (input.value.length === 1 && pos < 4) {
      const next = document.getElementById(`pin-${pos + 1}`);
      if (next) next.focus();
    }

    if (pos === 4 && input.value.length === 1) {
      const pin = [1, 2, 3, 4].map(i => document.getElementById(`pin-${i}`).value).join('');
      if (pin.length === 4) {
        verifyPin(pin);
      }
    }
  }

  function verifyPin(pin) {
    const storedPin = Storage.getPIN();

    if (storedPin === null) {
      Storage.setPIN(pin);
      settingsAuthenticated = true;
      show(Screens.renderSettings(true));
    } else if (pin === storedPin) {
      settingsAuthenticated = true;
      show(Screens.renderSettings(true));
    } else {
      const errorEl = document.getElementById('pin-error');
      if (errorEl) {
        errorEl.innerHTML = '<p class="pin-error">Wrong PIN. Try again!</p>';
      }
      Sounds.wrong();
      [1, 2, 3, 4].forEach(i => {
        const el = document.getElementById(`pin-${i}`);
        if (el) el.value = '';
      });
      const first = document.getElementById('pin-1');
      if (first) first.focus();
    }
  }

  // ============================================
  // QUIZ ANSWER HANDLING
  // ============================================

  function submitAnswer(answer) {
    const state = QuizEngine.getState();
    if (state.answered) return;

    const result = QuizEngine.submitAnswer(answer);
    if (!result) return;

    // Highlight buttons
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
      btn.disabled = true;
      const btnText = btn.textContent.trim();
      if (btnText === result.correctAnswer) {
        btn.classList.add('correct');
      } else if (btnText === answer && !result.correct) {
        btn.classList.add('incorrect');
      }
    });

    // Show feedback
    const feedbackEl = document.getElementById('feedback-container');
    if (feedbackEl) {
      feedbackEl.innerHTML = Screens.renderFeedback(result);
    }

    // Sound effects
    if (result.correct) {
      Sounds.correct();
      showPointsFly('+1 ⭐');
    } else {
      Sounds.wrong();
    }

    // Animate mascot
    const mascot = document.getElementById('quiz-mascot');
    if (mascot) {
      mascot.className = result.correct
        ? 'mascot mascot-sm mascot-happy'
        : 'mascot mascot-sm mascot-sad';
      mascot.textContent = result.correct ? '🌟' : '💫';
    }

    // Streak banner for 3+ in a row
    if (result.correct && result.streak >= 3) {
      showStreakBanner(result.streak);
    }

    // Confetti for correct
    if (result.correct) {
      Confetti.rain(12, 600);
    }

    // Star collect sound on streak milestones
    if (result.correct && result.streak >= 5 && result.streak % 5 === 0) {
      setTimeout(() => Sounds.levelUp(), 500);
    }

    // Show next button
    const nextEl = document.getElementById('next-btn-container');
    if (nextEl) {
      const isLast = QuizEngine.getState().index + 1 >= QuizEngine.getState().total;
      nextEl.innerHTML = `
        <div class="next-btn-row">
          <button class="btn btn-primary" onclick="App.nextQuestion()">
            ${isLast ? 'See Results ✨' : 'Next Question →'}
          </button>
        </div>
      `;
    }
  }

  function submitFillBlank() {
    const input = document.getElementById('fill-answer');
    if (!input) return;
    const answer = input.value.trim();
    if (!answer) return;

    const state = QuizEngine.getState();
    if (state.answered) return;

    const result = QuizEngine.submitAnswer(answer);
    if (!result) return;

    input.disabled = true;
    input.classList.add(result.correct ? 'correct' : 'incorrect');

    const submitBtn = document.querySelector('.submit-answer-btn');
    if (submitBtn) submitBtn.style.display = 'none';

    const feedbackEl = document.getElementById('feedback-container');
    if (feedbackEl) {
      feedbackEl.innerHTML = Screens.renderFeedback(result);
    }

    // Sound effects
    if (result.correct) {
      Sounds.correct();
      showPointsFly('+1 ⭐');
    } else {
      Sounds.wrong();
    }

    // Mascot reaction
    const mascot = document.getElementById('quiz-mascot');
    if (mascot) {
      mascot.className = result.correct
        ? 'mascot mascot-sm mascot-happy'
        : 'mascot mascot-sm mascot-sad';
      mascot.textContent = result.correct ? '🌟' : '💫';
    }

    // Streak banner
    if (result.correct && result.streak >= 3) {
      showStreakBanner(result.streak);
    }

    if (result.correct) {
      Confetti.rain(12, 600);
    }

    const nextEl = document.getElementById('next-btn-container');
    if (nextEl) {
      const isLast = QuizEngine.getState().index + 1 >= QuizEngine.getState().total;
      nextEl.innerHTML = `
        <div class="next-btn-row">
          <button class="btn btn-primary" onclick="App.nextQuestion()">
            ${isLast ? 'See Results ✨' : 'Next Question →'}
          </button>
        </div>
      `;
    }
  }

  function nextQuestion() {
    TTS.stop();
    Sounds.tap();
    QuizEngine.next();
  }

  function confirmQuit() {
    if (confirm('Are you sure you want to leave the quiz?')) {
      TTS.stop();
      goHome();
    }
  }

  function toggleSound(btn) {
    const enabled = Sounds.toggle();
    if (btn) btn.textContent = enabled ? '🔊' : '🔇';
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('SW registration failed:', err);
      });
    }

    // Unlock audio context on first tap (iOS requirement)
    document.addEventListener('touchstart', () => Sounds.unlock(), { once: true });
    document.addEventListener('click', () => Sounds.unlock(), { once: true });

    // Initialize cloud sync if configured
    if (typeof CloudSync !== 'undefined' && CloudSync.isConfigured()) {
      CloudSync.init();
    }

    // Show home screen
    goHome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    goHome,
    selectSubject,
    startQuiz,
    startRetry,
    startReadAloud,
    handleMicTap,
    readAloudNext,
    readAloudRetry,
    readAloudQuit,
    showProgress,
    showSettings,
    showParentDashboard,
    showRemoteViewer,
    copyFamilyCode,
    enableSync,
    fetchRemoteProgress,
    refreshRemote,
    submitAnswer,
    submitFillBlank,
    nextQuestion,
    confirmQuit,
    handlePinInput,
    toggleSound
  };
})();
