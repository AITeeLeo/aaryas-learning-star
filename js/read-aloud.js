/* ============================================
   Aarya's Learning Star — Read Aloud Engine
   Uses Web Speech API to listen to Aarya read,
   compares word-by-word, tracks fluency
   ============================================ */

const ReadAloud = (() => {
  let recognition = null;
  let currentPassage = null;
  let segments = [];
  let currentSegmentIndex = 0;
  let segmentResults = [];
  let isListening = false;
  let startTime = 0;
  let onStateChange = null;
  let onComplete = null;

  // ============================================
  // FEATURE DETECTION
  // ============================================
  function isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  // ============================================
  // PASSAGE SEGMENTATION
  // Split into kid-friendly chunks (1-2 sentences, ~10-25 words)
  // ============================================
  function segmentPassage(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const result = [];
    let current = '';

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      const combined = current ? current + ' ' + trimmed : trimmed;
      const wordCount = combined.split(/\s+/).length;

      if (wordCount > 25 && current) {
        result.push(current.trim());
        current = trimmed;
      } else {
        current = combined;
      }
    }
    if (current.trim()) result.push(current.trim());
    return result;
  }

  // ============================================
  // WORD COMPARISON
  // ============================================
  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/['']/g, "'")
      .replace(/[""]/g, '"')
      .replace(/[^a-z0-9' ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  // Common homophones and equivalent words for kids
  const EQUIVALENTS = {
    'their': ['there', 'theyre', "they're"],
    'there': ['their', 'theyre', "they're"],
    'its': ["it's", 'its'],
    "it's": ['its'],
    'to': ['too', 'two'],
    'too': ['to', 'two'],
    'two': ['to', 'too'],
    'your': ["you're", 'youre'],
    "you're": ['your', 'youre'],
    'a': ['the', 'an'],
    'the': ['a', 'an'],
    'an': ['a', 'the']
  };

  function wordsMatch(expected, spoken) {
    if (expected === spoken) return true;

    // Check homophones
    const equivs = EQUIVALENTS[expected];
    if (equivs && equivs.includes(spoken)) return true;

    // Fuzzy match: allow Levenshtein distance 1 for words > 4 chars
    if (expected.length > 4 && levenshtein(expected, spoken) <= 1) return true;
    // For shorter words, must be exact
    if (expected.length <= 4 && levenshtein(expected, spoken) === 0) return true;

    return false;
  }

  function compareWords(expectedText, spokenText) {
    const expectedWords = normalize(expectedText).split(' ').filter(w => w);
    const spokenWords = normalize(spokenText).split(' ').filter(w => w);

    const results = [];
    let spokenIdx = 0;

    for (let i = 0; i < expectedWords.length; i++) {
      const expected = expectedWords[i];
      let matched = false;

      // Look ahead up to 3 spoken words for a match
      for (let look = 0; look < 3 && spokenIdx + look < spokenWords.length; look++) {
        if (wordsMatch(expected, spokenWords[spokenIdx + look])) {
          // Skip any extra spoken words before the match
          spokenIdx = spokenIdx + look + 1;
          matched = true;
          break;
        }
      }

      results.push({
        word: expectedText.split(/\s+/)[i] || expected, // Keep original casing/punctuation
        expected: expected,
        correct: matched
      });
    }

    const correct = results.filter(r => r.correct).length;
    return {
      words: results,
      totalWords: results.length,
      correctWords: correct,
      accuracy: results.length > 0 ? correct / results.length : 0,
      missedWords: results.filter(r => !r.correct).map(r => r.expected)
    };
  }

  // ============================================
  // SPEECH RECOGNITION
  // ============================================
  function initRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return null;

    const rec = new SpeechRec();
    rec.continuous = false; // iOS works better with single-shot
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let transcript = '';
      let isFinal = false;
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }

      if (isFinal) {
        finishSegment(transcript);
      } else if (onStateChange) {
        // Show interim text for feedback
        onStateChange(getState({ interimText: transcript }));
      }
    };

    rec.onerror = (event) => {
      isListening = false;
      if (event.error === 'not-allowed') {
        if (onStateChange) {
          onStateChange(getState({ error: 'mic-denied' }));
        }
      } else if (event.error === 'no-speech') {
        if (onStateChange) {
          onStateChange(getState({ error: 'no-speech' }));
        }
      }
    };

    rec.onend = () => {
      // iOS often fires onend without onresult if silence
      if (isListening) {
        isListening = false;
        if (onStateChange) {
          onStateChange(getState({ error: 'no-speech' }));
        }
      }
    };

    return rec;
  }

  function finishSegment(transcript) {
    isListening = false;
    const elapsed = Date.now() - startTime;
    const segment = segments[currentSegmentIndex];
    const comparison = compareWords(segment, transcript);

    segmentResults[currentSegmentIndex] = {
      text: segment,
      spokenText: transcript,
      ...comparison,
      timeMs: elapsed
    };

    if (onStateChange) {
      onStateChange(getState({ justFinished: true }));
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================
  function getState(extra = {}) {
    const segResult = segmentResults[currentSegmentIndex] || null;
    return {
      supported: isSupported(),
      passage: currentPassage,
      segments,
      currentSegmentIndex,
      totalSegments: segments.length,
      currentSegmentText: segments[currentSegmentIndex] || '',
      isListening,
      segmentResult: segResult,
      segmentResults,
      allDone: currentSegmentIndex >= segments.length,
      ...extra
    };
  }

  // Get all unique passages from the reading bank
  function getPassages() {
    const reading = (typeof QUESTIONS_BANK !== 'undefined' && QUESTIONS_BANK.reading) || [];
    const seen = new Set();
    const passages = [];
    reading.forEach(q => {
      if (q.passage && !seen.has(q.passage)) {
        seen.add(q.passage);
        passages.push({ id: q.id, passage: q.passage, question: q.question });
      }
    });
    return passages;
  }

  return {
    isSupported,
    getPassages,

    start(passage, callbacks) {
      currentPassage = passage;
      segments = segmentPassage(passage);
      currentSegmentIndex = 0;
      segmentResults = [];
      isListening = false;
      onStateChange = callbacks.onStateChange;
      onComplete = callbacks.onComplete;

      recognition = initRecognition();

      if (onStateChange) onStateChange(getState());
    },

    tapMic() {
      if (!recognition) return;

      if (isListening) {
        // Stop early
        isListening = false;
        recognition.stop();
        return;
      }

      // Check online (required for speech recognition)
      if (!navigator.onLine) {
        if (onStateChange) {
          onStateChange(getState({ error: 'offline' }));
        }
        return;
      }

      isListening = true;
      startTime = Date.now();
      // Clear previous result for this segment if retrying
      segmentResults[currentSegmentIndex] = null;

      if (onStateChange) onStateChange(getState());

      try {
        recognition.start();
      } catch (e) {
        // Already started — restart
        recognition.stop();
        setTimeout(() => {
          try { recognition.start(); } catch (_) { /* ignore */ }
        }, 200);
      }
    },

    nextSegment() {
      currentSegmentIndex++;
      isListening = false;

      if (currentSegmentIndex >= segments.length) {
        // All done — calculate final results
        const allWords = segmentResults.flatMap(r => r ? r.words : []);
        const totalCorrect = allWords.filter(w => w.correct).length;
        const totalTime = segmentResults.reduce((sum, r) => sum + (r ? r.timeMs : 0), 0);
        const totalWords = allWords.length;
        const wpm = totalTime > 0 ? Math.round((totalWords / totalTime) * 60000) : 0;
        const missedWords = [...new Set(segmentResults.flatMap(r => r ? r.missedWords : []))];

        const results = {
          totalWords,
          totalCorrect,
          accuracy: totalWords > 0 ? totalCorrect / totalWords : 0,
          wordsPerMinute: wpm,
          missedWords,
          segmentResults: segmentResults.filter(Boolean)
        };

        // Save to storage
        Storage.recordReadAloud({
          date: new Date().toISOString().split('T')[0],
          timestamp: Date.now(),
          totalWords,
          totalCorrect,
          overallAccuracy: results.accuracy,
          wordsPerMinute: wpm,
          missedWords,
          segments: segmentResults.filter(Boolean).map(r => ({
            text: r.text,
            wordsTotal: r.totalWords,
            wordsCorrect: r.correctWords,
            missedWords: r.missedWords,
            timeMs: r.timeMs
          }))
        });

        if (onComplete) onComplete(results);
        return;
      }

      // Re-init recognition for next segment (iOS needs fresh instance sometimes)
      recognition = initRecognition();
      if (onStateChange) onStateChange(getState());
    },

    retrySegment() {
      segmentResults[currentSegmentIndex] = null;
      recognition = initRecognition();
      if (onStateChange) onStateChange(getState());
    },

    getState,

    abort() {
      if (recognition) {
        try { recognition.stop(); } catch (_) { /* ignore */ }
      }
      isListening = false;
    }
  };
})();
