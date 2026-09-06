// ==========================================
// DJ BUFALO — Interactive Audio & Bilingual Engine
// Default: Lunfardo Porteño ('es')
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------
  // 1. DOM references
  // Declared before anything calls into them — setLanguage() reads the player
  // nodes, so hoisting these above it keeps them out of the temporal dead zone.
  // ------------------------------------------
  const playerBar = document.getElementById('audio-player-bar');
  const playerDisplay = document.getElementById('player-track-display');
  const playerToggleBtn = document.getElementById('player-toggle-btn');
  const playerCloseBtn = document.getElementById('player-close-btn');
  const heroListenBtn = document.getElementById('hero-listen-btn');
  const setRows = document.querySelectorAll('.set-row');
  const langBtns = document.querySelectorAll('.lang-switch .lang-btn');

  // ------------------------------------------
  // 2. Playback state
  // ------------------------------------------
  let audioCtx = null;
  let isPlaying = false;
  let currentId = null;
  let currentBpm = 126;
  let beatInterval = null;
  let currentLang = getStoredLang();

  // ------------------------------------------
  // 3. Safe storage helpers
  // ------------------------------------------
  function getStoredLang() {
    try {
      return localStorage.getItem('djbufalo_lang') || 'es';
    } catch (e) {
      return 'es';
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem('djbufalo_lang', lang);
    } catch (e) {}
  }

  // ------------------------------------------
  // 4. Player bar & track row UI sync
  // ------------------------------------------
  const PLAY_ICON = '<svg viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>';
  const PAUSE_ICON = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';

  function setHeroLabel(text) {
    if (!heroListenBtn) return;
    const span = heroListenBtn.querySelector('span[data-i18n]');
    if (span) span.textContent = text;
  }

  // The row owns a track's display name in both languages, so the player bar
  // re-reads it per render instead of caching whichever language was current
  // when playback started.
  function trackTitle(id) {
    for (const row of setRows) {
      if (row.getAttribute('data-id') === id) {
        return row.getAttribute(currentLang === 'en' ? 'data-title-en' : 'data-title') || '';
      }
    }
    return '';
  }

  function updatePlayerUI(playing, id = '', bpm = 126) {
    if (!playerBar) return;
    const isEs = currentLang === 'es';
    const title = trackTitle(id);

    if (playing) {
      playerBar.classList.add('is-active');
      playerToggleBtn.textContent = isEs ? 'PAUSAR' : 'PAUSE';
      setHeroLabel(isEs ? 'SONANDO AHORA' : 'NOW PLAYING');
    } else {
      playerToggleBtn.textContent = isEs ? 'REANUDAR' : 'RESUME';
      setHeroLabel(isEs ? 'ESCUCHAR AHORA' : 'LISTEN NOW');
    }

    // Rendered for both states so a paused bar still follows the language toggle.
    if (title) {
      const state = playing
        ? (isEs ? 'TRANSMISIÓN EN VIVO' : 'LIVE FEED')
        : (isEs ? 'EN PAUSA' : 'PAUSED');
      playerDisplay.textContent = `${title.toUpperCase()} — ${bpm} BPM (${state})`;
    }

    setRows.forEach(row => {
      const active = playing && row.getAttribute('data-id') === id;
      row.classList.toggle('is-playing', active);
      const btn = row.querySelector('.play-btn');
      btn.innerHTML = active ? PAUSE_ICON : PLAY_ICON;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  // ------------------------------------------
  // 5. Language toggle (ES Lunfardo / EN)
  // ------------------------------------------
  function setLanguage(lang) {
    currentLang = lang;
    setStoredLang(lang);
    document.documentElement.lang = lang === 'es' ? 'es-AR' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const alt = el.getAttribute(`data-alt-${lang}`);
      if (alt) el.setAttribute('alt', alt);
    });

    langBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Re-assert player labels: the data-i18n pass above just overwrote the hero
    // button with its idle text even when a set is mid-playback.
    updatePlayerUI(isPlaying, currentId || '', currentBpm);
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang && lang !== currentLang) {
        setLanguage(lang);
      }
    });
  });

  // ------------------------------------------
  // 6. Web Audio engine (atmospheric dark house)
  // ------------------------------------------
  function initAudioContext() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Deep kick & bass pulse synthesis
  function triggerPulse(freq = 46) {
    if (!audioCtx || !isPlaying) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.8, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.35);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // Hypnotic dark ambient chord pad
  let padOsc1 = null, padOsc2 = null, padGain = null;

  function startAtmosphere() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    padGain = audioCtx.createGain();
    padGain.gain.setValueAtTime(0.001, now);
    padGain.gain.linearRampToValueAtTime(0.08, now + 1.5);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    padOsc1 = audioCtx.createOscillator();
    padOsc2 = audioCtx.createOscillator();

    padOsc1.type = 'sawtooth';
    padOsc2.type = 'triangle';

    padOsc1.frequency.setValueAtTime(55, now);
    padOsc2.frequency.setValueAtTime(110.5, now);

    padOsc1.connect(filter);
    padOsc2.connect(filter);
    filter.connect(padGain);
    padGain.connect(audioCtx.destination);

    padOsc1.start(now);
    padOsc2.start(now);
  }

  // Capture local references so rapid stop->play cannot kill the newly started pad
  function stopAtmosphere() {
    if (!padGain || !audioCtx) return;

    const now = audioCtx.currentTime;

    // Anchor to the value we are actually at. Without this the fade-out ramp
    // would be measured from the end of the 1.5s fade-in and jump instead of
    // gliding when a set is stopped inside that window.
    padGain.gain.cancelScheduledValues(now);
    padGain.gain.setValueAtTime(padGain.gain.value, now);
    padGain.gain.linearRampToValueAtTime(0.001, now + 0.5);

    const osc1 = padOsc1;
    const osc2 = padOsc2;
    const gainNode = padGain;

    padOsc1 = null;
    padOsc2 = null;
    padGain = null;

    setTimeout(() => {
      try {
        if (osc1) osc1.stop();
        if (osc2) osc2.stop();
        if (gainNode) gainNode.disconnect();
      } catch (e) {}
    }, 550);
  }

  function startPlayback(id, bpm = 126) {
    initAudioContext();
    // Switching sets mid-playback lands here without passing through
    // stopPlayback, so fade the outgoing pad before its refs are overwritten.
    if (isPlaying) stopAtmosphere();
    isPlaying = true;
    currentId = id;
    currentBpm = bpm;

    startAtmosphere();

    // ponytail: setInterval drifts a few ms against the audio clock; swap for
    // lookahead scheduling against audioCtx.currentTime if it ever gets sequenced.
    const beatMs = (60 / bpm) * 1000;
    if (beatInterval) clearInterval(beatInterval);
    triggerPulse();
    beatInterval = setInterval(triggerPulse, beatMs);

    updatePlayerUI(true, id, bpm);
  }

  function stopPlayback() {
    isPlaying = false;
    stopAtmosphere();
    if (beatInterval) clearInterval(beatInterval);
    updatePlayerUI(false, currentId || '', currentBpm);
  }

  function togglePlayback(id, bpm) {
    if (isPlaying && currentId === id) {
      stopPlayback();
    } else {
      startPlayback(id, bpm);
    }
  }

  // ------------------------------------------
  // 7. Playback triggers
  // ------------------------------------------
  if (heroListenBtn) {
    heroListenBtn.addEventListener('click', () => {
      const bpm = parseInt(heroListenBtn.getAttribute('data-bpm') || '126', 10);
      togglePlayback(heroListenBtn.getAttribute('data-id'), bpm);
    });
  }

  // One listener on the row — the play button is inside it, so binding both
  // fired the toggle twice and left the track exactly where it started.
  setRows.forEach(row => {
    row.addEventListener('click', () => {
      togglePlayback(
        row.getAttribute('data-id'),
        parseInt(row.getAttribute('data-bpm') || '126', 10)
      );
    });
  });

  if (playerToggleBtn) {
    playerToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopPlayback();
      } else if (currentId) {
        startPlayback(currentId, currentBpm);
      }
    });
  }

  if (playerCloseBtn) {
    playerCloseBtn.addEventListener('click', () => {
      stopPlayback();
      playerBar.classList.remove('is-active');
    });
  }

  // Apply initial language (ensures default 'es' lunfardo is active)
  setLanguage(currentLang);

  // ------------------------------------------
  // 8. Native IntersectionObserver scrollspy (zero layout thrashing)
  // Targets sections AND footer#contact
  // ------------------------------------------
  const scrollTargets = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  if ('IntersectionObserver' in window && scrollTargets.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === id);
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    scrollTargets.forEach(target => observer.observe(target));
  }
});
