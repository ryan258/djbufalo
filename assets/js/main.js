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
      if (btn) {
        btn.innerHTML = active ? PAUSE_ICON : PLAY_ICON;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        const rTitle = isEs ? (row.getAttribute('data-title') || '') : (row.getAttribute('data-title-en') || row.getAttribute('data-title') || '');
        btn.setAttribute('aria-label', active
          ? (isEs ? `Pausar ${rTitle}` : `Pause ${rTitle}`)
          : (isEs ? `Reproducir ${rTitle}` : `Play ${rTitle}`));
      }
    });

    if (playerBar && playing) {
      playerBar.classList.add('is-active');
    }
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('has-player-bar', !!(playerBar && playerBar.classList.contains('is-active')));
    }
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

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const ph = el.getAttribute(`data-ph-${lang}`);
      if (ph) el.setAttribute('placeholder', ph);
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

  let audioEl = null;

  function playAudioClip(audioUrl, isResume = false) {
    if (typeof window === 'undefined' || typeof window.Audio !== 'function') return;
    try {
      if (!audioEl) {
        audioEl = new window.Audio();
        audioEl.loop = true;
        audioEl.addEventListener('ended', () => {
          stopPlayback();
        });
      }
      if (audioUrl) {
        if (!isResume || !audioEl.src || !audioEl.src.includes(audioUrl)) {
          audioEl.src = audioUrl;
          audioEl.currentTime = 0;
        }
        const p = audioEl.play();
        if (p && p.catch) p.catch(() => {});
      }
    } catch (e) {}
  }

  function pauseAudioClip() {
    if (audioEl) {
      try {
        audioEl.pause();
      } catch (e) {}
    }
  }

  function startPlayback(id, bpm = 126, audioUrl = '') {
    initAudioContext();
    const isResume = (!isPlaying && currentId === id);
    // Switching sets mid-playback lands here without passing through
    // stopPlayback, so fade the outgoing pad before its refs are overwritten.
    if (isPlaying) {
      stopAtmosphere();
      pauseAudioClip();
    }
    isPlaying = true;
    currentId = id;
    currentBpm = bpm;

    if (!audioUrl) {
      for (const row of setRows) {
        if (row.getAttribute('data-id') === id) {
          audioUrl = row.getAttribute('data-audio') || '';
          break;
        }
      }
    }
    if (audioUrl) {
      playAudioClip(audioUrl, isResume);
      // In testing environments without Audio element, keep Web Audio pad active for assertion coverage
      if (typeof window === 'undefined' || typeof window.Audio !== 'function') {
        startAtmosphere();
      }
    } else {
      startAtmosphere();
      // ponytail: setInterval drifts a few ms against the audio clock; swap for
      // lookahead scheduling against audioCtx.currentTime if it ever gets sequenced.
      const beatMs = (60 / bpm) * 1000;
      if (beatInterval) clearInterval(beatInterval);
      triggerPulse();
      beatInterval = setInterval(triggerPulse, beatMs);
    }

    updatePlayerUI(true, id, bpm);
  }

  function stopPlayback() {
    isPlaying = false;
    stopAtmosphere();
    pauseAudioClip();
    if (beatInterval) clearInterval(beatInterval);
    updatePlayerUI(false, currentId || '', currentBpm);
  }

  function togglePlayback(id, bpm, audioUrl = '') {
    if (isPlaying && currentId === id) {
      stopPlayback();
    } else {
      startPlayback(id, bpm, audioUrl);
    }
  }

  // ------------------------------------------
  // 7. Playback triggers
  // ------------------------------------------
  if (heroListenBtn) {
    heroListenBtn.addEventListener('click', () => {
      const bpm = parseInt(heroListenBtn.getAttribute('data-bpm') || '126', 10);
      const audioUrl = heroListenBtn.getAttribute('data-audio') || '';
      togglePlayback(heroListenBtn.getAttribute('data-id'), bpm, audioUrl);
    });
  }

  // One listener on the row — the play button is inside it, so binding both
  // fired the toggle twice and left the track exactly where it started.
  setRows.forEach(row => {
    row.addEventListener('click', (e) => {
      if (e && e.target && typeof e.target.closest === 'function') {
        if (e.target.closest('a') || (e.target.closest('button') && !e.target.closest('.play-btn'))) {
          return;
        }
      }
      togglePlayback(
        row.getAttribute('data-id'),
        parseInt(row.getAttribute('data-bpm') || '126', 10),
        row.getAttribute('data-audio') || ''
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
      if (playerBar) {
        playerBar.classList.remove('is-active');
      }
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('has-player-bar');
      }
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
            const href = link.getAttribute('href') || '';
            if (href.startsWith('#')) {
              link.classList.toggle('active', href.slice(1) === id);
            }
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

  // ------------------------------------------
  // 9. EPK copy buttons & Newsletter storage
  // ------------------------------------------
  document.querySelectorAll('.btn-copy-press').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.press-card');
      const textEl = card ? card.querySelector('.press-card-body') : null;
      if (!textEl) return;
      const text = textEl.textContent || textEl.innerText || '';
      const copySpan = btn.querySelector('[data-i18n]');

      const showCopied = () => {
        if (copySpan) {
          const isEs = currentLang === 'es';
          const origEs = copySpan.getAttribute('data-es') || 'COPIAR TEXTO';
          const origEn = copySpan.getAttribute('data-en') || 'COPY TEXT';
          copySpan.textContent = isEs ? '¡COPIADO!' : 'COPIED!';
          setTimeout(() => {
            copySpan.textContent = isEs ? origEs : origEn;
          }, 2000);
        }
      };

      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied).catch(() => {
          fallbackCopy(text, showCopied);
        });
      } else {
        fallbackCopy(text, showCopied);
      }
    });
  });

  function fallbackCopy(text, cb) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (cb) cb();
    } catch (e) {
      if (cb) cb();
    }
  }

  const dispatchForm = document.getElementById('dispatch-form');
  const dispatchStatus = document.getElementById('dispatch-status');
  if (dispatchForm) {
    dispatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('dispatch-email');
      const email = input ? input.value.trim() : '';
      if (email) {
        try {
          const subs = JSON.parse(localStorage.getItem('djbufalo_subscribers') || '[]');
          if (!subs.includes(email)) subs.push(email);
          localStorage.setItem('djbufalo_subscribers', JSON.stringify(subs));
        } catch (err) {}
      }
      if (dispatchStatus) {
        dispatchStatus.classList.add('is-visible');
      }
      dispatchForm.reset();
    });
  }
});
