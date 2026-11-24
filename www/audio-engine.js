/**
 * Festive Audio, Music Box Synthesizer & iOS Haptics Engine
 * 100% Offline Pure Web Audio API — Zero external MP3 dependencies, zero copyright issues.
 * Designed for Apple App Store Kids & Family experience.
 */

window.FestiveAudio = (function () {
  let ctx = null;
  let musicEnabled = true;
  let sfxEnabled = true;
  let hapticsEnabled = true;
  let musicPlaying = false;
  let musicTimer = null;
  let noteIndex = 0;

  // Classic Public-Domain Christmas Music Box Medley (Jingle Bells + We Wish You a Merry Christmas)
  // Frequencies in Hz and durations in beats
  const MELODY_NOTES = [
    // Jingle Bells: E E E - E E E - E G C D E
    { f: 659.25, d: 1 }, { f: 659.25, d: 1 }, { f: 659.25, d: 2 },
    { f: 659.25, d: 1 }, { f: 659.25, d: 1 }, { f: 659.25, d: 2 },
    { f: 659.25, d: 1 }, { f: 783.99, d: 1 }, { f: 523.25, d: 1.5 }, { f: 587.33, d: 0.5 }, { f: 659.25, d: 3 },
    { f: 0, d: 1 },
    // F F F F - F E E E E - E D D E D - G
    { f: 698.46, d: 1 }, { f: 698.46, d: 1 }, { f: 698.46, d: 1.5 }, { f: 698.46, d: 0.5 },
    { f: 698.46, d: 1 }, { f: 659.25, d: 1 }, { f: 659.25, d: 1 }, { f: 659.25, d: 0.5 }, { f: 659.25, d: 0.5 },
    { f: 659.25, d: 1 }, { f: 587.33, d: 1 }, { f: 587.33, d: 1 }, { f: 659.25, d: 1 }, { f: 587.33, d: 2 }, { f: 783.99, d: 2 },
    // Repeat Jingle Bells Resolve
    { f: 659.25, d: 1 }, { f: 659.25, d: 1 }, { f: 659.25, d: 2 },
    { f: 659.25, d: 1 }, { f: 659.25, d: 1 }, { f: 659.25, d: 2 },
    { f: 659.25, d: 1 }, { f: 783.99, d: 1 }, { f: 523.25, d: 1.5 }, { f: 587.33, d: 0.5 }, { f: 659.25, d: 3 },
    { f: 0, d: 1 },
    { f: 698.46, d: 1 }, { f: 698.46, d: 1 }, { f: 698.46, d: 1.5 }, { f: 698.46, d: 0.5 },
    { f: 698.46, d: 1 }, { f: 659.25, d: 1 }, { f: 659.25, d: 1 }, { f: 659.25, d: 1 },
    { f: 783.99, d: 1 }, { f: 783.99, d: 1 }, { f: 698.46, d: 1 }, { f: 587.33, d: 1 }, { f: 523.25, d: 3 },
    { f: 0, d: 2 }
  ];

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function configure(opts = {}) {
    if (typeof opts.music === "boolean") {
      musicEnabled = opts.music;
      if (!musicEnabled) stopMusic();
      else startMusic();
    }
    if (typeof opts.sfx === "boolean") sfxEnabled = opts.sfx;
    if (typeof opts.haptics === "boolean") hapticsEnabled = opts.haptics;
  }

  function triggerHaptic(style = "light") {
    if (!hapticsEnabled) return;
    try {
      if (window.Capacitor?.Plugins?.Haptics) {
        if (style === "success") {
          window.Capacitor.Plugins.Haptics.notification({ type: "SUCCESS" });
        } else {
          window.Capacitor.Plugins.Haptics.impact({ style: style === "heavy" ? "HEAVY" : "LIGHT" });
        }
        return;
      }
      if (navigator.vibrate) {
        navigator.vibrate(style === "heavy" ? 25 : 10);
      }
    } catch (_) {}
  }

  // Gentle celesta / music-box note synthesizer
  function playMusicBoxNote(freq, durationSec, volume = 0.045) {
    const ac = ensureCtx();
    if (!ac || freq <= 0) return;
    try {
      const now = ac.currentTime;
      // Primary bell tone
      const osc1 = ac.createOscillator();
      // Overtone chime (2x octave)
      const osc2 = ac.createOscillator();
      const gain = ac.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, now);

      const overtoneGain = ac.createGain();
      overtoneGain.gain.setValueAtTime(0.18, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 0.6);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec * 1.35);

      osc1.connect(gain);
      osc2.connect(overtoneGain);
      overtoneGain.connect(gain);
      gain.connect(ac.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec * 1.4);
      osc2.stop(now + durationSec * 1.4);
    } catch (_) {}
  }

  function scheduleNextMusicNote() {
    if (!musicEnabled || !musicPlaying) return;
    const item = MELODY_NOTES[noteIndex % MELODY_NOTES.length];
    noteIndex = (noteIndex + 1) % MELODY_NOTES.length;
    const beatMs = 290;
    const durSec = (item.d * beatMs) / 1000;
    if (item.f > 0 && ctx && ctx.state === "running") {
      playMusicBoxNote(item.f, durSec, 0.032);
    }
    musicTimer = setTimeout(scheduleNextMusicNote, item.d * beatMs);
  }

  function startMusic() {
    if (!musicEnabled || musicPlaying) return;
    ensureCtx();
    musicPlaying = true;
    clearTimeout(musicTimer);
    scheduleNextMusicNote();
  }

  function stopMusic() {
    musicPlaying = false;
    clearTimeout(musicTimer);
  }

  function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (musicEnabled) startMusic();
    else stopMusic();
    return musicEnabled;
  }

  // --- Interactive Studio Sound Effects ---
  function playPop(freq = 560, duration = 0.07) {
    triggerHaptic("light");
    if (!sfxEnabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    try {
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.38, now + duration);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (_) {}
  }

  function playFillChime() {
    triggerHaptic("light");
    if (!sfxEnabled) return;
    const chords = [523.25, 659.25, 783.99, 1046.5];
    const base = chords[Math.floor(Math.random() * chords.length)];
    playMusicBoxNote(base, 0.22, 0.09);
    setTimeout(() => playMusicBoxNote(base * 1.25, 0.25, 0.06), 45);
  }

  function playGlitterSparkle() {
    if (!sfxEnabled) return;
    const notes = [1046.5, 1318.5, 1567.98, 2093.0];
    const pick = notes[Math.floor(Math.random() * notes.length)];
    playMusicBoxNote(pick, 0.14, 0.045);
  }

  function playStickerStamp() {
    triggerHaptic("heavy");
    if (!sfxEnabled) return;
    playPop(440, 0.06);
    setTimeout(() => playMusicBoxNote(880, 0.25, 0.09), 50);
  }

  function playFanfare() {
    triggerHaptic("success");
    if (!sfxEnabled) return;
    const seq = [
      { f: 523.25, t: 0, d: 0.16 },
      { f: 659.25, t: 110, d: 0.16 },
      { f: 783.99, t: 220, d: 0.16 },
      { f: 1046.5, t: 340, d: 0.45 }
    ];
    seq.forEach((n) => {
      setTimeout(() => playMusicBoxNote(n.f, n.d, 0.11), n.t);
    });
  }

  // Unlock WebAudio on first user gesture on iOS Safari / WKWebView
  window.addEventListener(
    "pointerdown",
    function unlockOnce() {
      ensureCtx();
      if (musicEnabled && !musicPlaying) {
        startMusic();
      }
    },
    { once: false, passive: true }
  );

  return {
    configure,
    startMusic,
    stopMusic,
    toggleMusic,
    isMusicEnabled: () => musicEnabled,
    playPop,
    playFillChime,
    playGlitterSparkle,
    playStickerStamp,
    playFanfare,
    triggerHaptic
  };
})();
