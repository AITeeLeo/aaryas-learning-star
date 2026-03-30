/* ============================================
   Aarya's Learning Star — Sound Effects
   Web Audio API synthesized sounds — no files needed
   ============================================ */

const Sounds = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (iOS requires user gesture)
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Play a tone at given frequency for duration
  function tone(freq, duration, type = 'sine', volume = 0.3, startTime = 0) {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, c.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + startTime);
    osc.stop(c.currentTime + startTime + duration);
  }

  return {
    // Enable/disable sounds
    toggle() { enabled = !enabled; return enabled; },
    isEnabled() { return enabled; },

    // Must call on first user interaction (iOS requirement)
    unlock() {
      try { getCtx(); } catch(e) {}
    },

    // --- Correct answer: cheerful rising ding ---
    correct() {
      if (!enabled) return;
      tone(523, 0.12, 'sine', 0.3, 0);      // C5
      tone(659, 0.12, 'sine', 0.3, 0.08);    // E5
      tone(784, 0.2, 'sine', 0.35, 0.16);    // G5
    },

    // --- Wrong answer: gentle low boop (not harsh) ---
    wrong() {
      if (!enabled) return;
      tone(330, 0.15, 'sine', 0.15, 0);      // E4
      tone(262, 0.25, 'sine', 0.12, 0.12);   // C4
    },

    // --- Star collected: sparkly ping ---
    star() {
      if (!enabled) return;
      tone(1047, 0.08, 'sine', 0.2, 0);      // C6
      tone(1319, 0.08, 'sine', 0.2, 0.06);   // E6
      tone(1568, 0.12, 'sine', 0.25, 0.12);  // G6
      tone(2093, 0.15, 'sine', 0.2, 0.18);   // C7
    },

    // --- Streak fire: ascending power-up ---
    streak() {
      if (!enabled) return;
      tone(440, 0.08, 'square', 0.12, 0);     // A4
      tone(554, 0.08, 'square', 0.12, 0.06);  // C#5
      tone(659, 0.08, 'square', 0.12, 0.12);  // E5
      tone(880, 0.15, 'square', 0.15, 0.18);  // A5
    },

    // --- Fanfare: triumphant full melody for perfect/great scores ---
    fanfare() {
      if (!enabled) return;
      // Trumpet-like fanfare: Ta-da-da DAAAA!
      const t = 'square';
      const v = 0.18;
      // First phrase
      tone(523, 0.12, t, v, 0);       // C5
      tone(523, 0.12, t, v, 0.15);    // C5
      tone(523, 0.12, t, v, 0.30);    // C5
      tone(659, 0.25, t, v+0.05, 0.45);  // E5
      // Pause
      tone(587, 0.12, t, v, 0.80);    // D5
      tone(659, 0.12, t, v, 0.95);    // E5
      tone(784, 0.35, t, v+0.05, 1.10); // G5
      // Finale
      tone(784, 0.12, t, v, 1.55);    // G5
      tone(880, 0.12, t, v, 1.70);    // A5
      tone(1047, 0.5, 'sine', v+0.1, 1.85); // C6 (long, warm)

      // Harmony underneath
      tone(262, 0.4, 'sine', 0.08, 0.45);   // C4
      tone(330, 0.4, 'sine', 0.08, 1.10);   // E4
      tone(523, 0.6, 'sine', 0.1, 1.85);    // C5
    },

    // --- Good job jingle: for decent scores ---
    goodJob() {
      if (!enabled) return;
      tone(523, 0.15, 'sine', 0.25, 0);     // C5
      tone(659, 0.15, 'sine', 0.25, 0.12);  // E5
      tone(784, 0.15, 'sine', 0.25, 0.24);  // G5
      tone(1047, 0.3, 'sine', 0.3, 0.36);   // C6
    },

    // --- Button tap: subtle click ---
    tap() {
      if (!enabled) return;
      tone(800, 0.04, 'sine', 0.1, 0);
    },

    // --- Countdown tick ---
    tick() {
      if (!enabled) return;
      tone(600, 0.05, 'sine', 0.08, 0);
    },

    // --- Level up / milestone ---
    levelUp() {
      if (!enabled) return;
      tone(523, 0.1, 'sine', 0.2, 0);
      tone(659, 0.1, 'sine', 0.2, 0.1);
      tone(784, 0.1, 'sine', 0.2, 0.2);
      tone(1047, 0.1, 'sine', 0.25, 0.3);
      tone(1319, 0.1, 'sine', 0.25, 0.4);
      tone(1568, 0.3, 'sine', 0.3, 0.5);
    }
  };
})();
