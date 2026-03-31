/* ============================================
   Aarya's Learning Star — Cloud Sync
   Syncs progress to Firebase so parents can
   view from any device using a family code.
   Config is built-in — no setup required.
   ============================================ */

const CloudSync = (() => {
  let db = null;
  let initialized = false;
  let syncDebounceTimer = null;

  // Built-in Firebase config (no user setup needed)
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBM0qlb7VccLJHvBeUcTTm1RGiGti_CeYc",
    authDomain: "aarya-s-learning-star.firebaseapp.com",
    databaseURL: "https://aarya-s-learning-star-default-rtdb.firebaseio.com",
    projectId: "aarya-s-learning-star",
    storageBucket: "aarya-s-learning-star.firebasestorage.app",
    messagingSenderId: "674986412234",
    appId: "1:674986412234:web:f57f6a3b1bb69e4c7fcc33"
  };

  // Generate a random 6-character family code
  function generateCode() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // No I/L/O/0/1 to avoid confusion
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  // Initialize Firebase
  function init() {
    if (initialized && db) return true;

    try {
      if (typeof firebase === 'undefined') {
        console.warn('CloudSync: Firebase SDK not loaded');
        return false;
      }
      if (!firebase.apps?.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.database();
      initialized = true;
      console.log('CloudSync: Firebase initialized');
      return true;
    } catch (e) {
      console.error('CloudSync: Firebase init failed', e);
      initialized = false;
      return false;
    }
  }

  // ============================================
  // FAMILY CODE
  // ============================================
  function getFamilyCode() {
    return localStorage.getItem('aarya_family_code') || null;
  }

  function setFamilyCode(code) {
    localStorage.setItem('aarya_family_code', code);
  }

  // ============================================
  // SYNC TO CLOUD (from Aarya's device)
  // ============================================
  function syncNow() {
    if (!initialized || !db) {
      if (!init()) return;
    }

    const code = getFamilyCode();
    if (!code) return;

    const data = {
      progress: Storage.getProgress(),
      history: Storage.getHistory(),
      activityLog: Storage.getActivityLog(),
      readAloud: Storage.getReadAloudHistory(),
      streak: Storage.getStreak(),
      totalStars: Storage.getTotalStars(),
      weeklyQuestions: Storage.hasWeeklyTest() ? 'yes' : 'no',
      weeklyDate: Storage.getWeeklyDate(),
      lastSync: Date.now(),
      lastSyncFormatted: new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      })
    };

    db.ref('families/' + code).set(data)
      .then(() => console.log('CloudSync: Data synced'))
      .catch(err => console.warn('CloudSync: Sync failed', err));
  }

  // Debounced sync — waits 3 seconds after last change before syncing
  function debouncedSync() {
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(() => syncNow(), 3000);
  }

  // ============================================
  // FETCH FROM CLOUD (parent's device)
  // ============================================
  async function fetchByCode(code) {
    if (!initialized || !db) {
      if (!init()) throw new Error('Could not connect to the cloud. Check your internet connection.');
    }

    const snapshot = await db.ref('families/' + code.toUpperCase()).once('value');
    const data = snapshot.val();

    if (!data) {
      throw new Error('No data found for this family code. Make sure sync is enabled on Aarya\'s device.');
    }

    return data;
  }

  // ============================================
  // ENABLE / STATUS
  // ============================================
  function isConfigured() {
    return true; // Config is built-in
  }

  function isSyncEnabled() {
    return !!getFamilyCode();
  }

  // Enable sync — generates a family code and does first sync
  function enableSync() {
    if (!init()) {
      return { success: false, error: 'Could not connect to Firebase. Check your internet connection.' };
    }

    if (!getFamilyCode()) {
      setFamilyCode(generateCode());
    }

    syncNow();
    return { success: true, code: getFamilyCode() };
  }

  return {
    init,
    isConfigured,
    isSyncEnabled,
    getFamilyCode,
    enableSync,
    syncNow,
    debouncedSync,
    fetchByCode
  };
})();
