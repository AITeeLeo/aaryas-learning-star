/* ============================================
   Aarya's Learning Star — Text-to-Speech
   Uses Web Speech API
   ============================================ */

const TTS = (() => {
  let synth = window.speechSynthesis;
  let speaking = false;

  // Cancel any ongoing speech
  function stop() {
    if (synth) {
      synth.cancel();
      speaking = false;
    }
  }

  // Speak text aloud
  function speak(text) {
    if (!synth) return;

    stop(); // Cancel any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;   // Slightly slower for a child
    utterance.pitch = 1.1;  // Slightly higher pitch — friendly
    utterance.volume = 1;

    // Try to find a good English voice
    const voices = synth.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && v.name.includes('Samantha')
    ) || voices.find(v =>
      v.lang.startsWith('en') && !v.name.includes('Google')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => { speaking = true; };
    utterance.onend = () => { speaking = false; };
    utterance.onerror = () => { speaking = false; };

    synth.speak(utterance);
  }

  // Ensure voices are loaded (they load async on some browsers)
  if (synth) {
    synth.getVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => synth.getVoices();
    }
  }

  return { speak, stop, isSpeaking: () => speaking };
})();
