// Self-check for static/js/main.js — `node main.test.js`, no deps.
// Covers the three things that were actually broken: boot order, the
// double-fired row toggle, and player labels surviving a language switch.
const assert = require('assert');
const fs = require('fs');

// ---- minimal DOM ----------------------------------------------------------
class El {
  constructor(tag = 'div', attrs = {}) {
    this.tag = tag;
    this.attrs = attrs;
    this.textContent = '';
    this.innerHTML = '';
    this.children = [];
    this.handlers = {};
    const classes = new Set((attrs.class || '').split(' ').filter(Boolean));
    this.classList = {
      add: c => classes.add(c),
      remove: c => classes.delete(c),
      contains: c => classes.has(c),
      toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)),
    };
  }
  getAttribute(n) { return n in this.attrs ? this.attrs[n] : null; }
  setAttribute(n, v) { this.attrs[n] = v; }
  append(child) { child.parent = this; this.children.push(child); return child; }
  addEventListener(t, fn) { (this.handlers[t] ||= []).push(fn); }
  click(target = this) {
    const ev = { target, preventDefault() {}, stopPropagation() { ev._stop = true; } };
    for (let el = this; el; el = el.parent) {
      (el.handlers.click || []).forEach(fn => fn(ev));
      if (ev._stop) break;
    }
  }
  querySelector(sel) {
    return this.children.find(c => sel.split(/[\s.\[\]]/).filter(Boolean)
      .every(p => c.tag === p || (c.attrs.class || '').includes(p) || p in c.attrs)) || null;
  }
}

const heroSpan = new El('span', { 'data-i18n': '', 'data-es': 'ESCUCHAR AHORA', 'data-en': 'LISTEN NOW' });
const heroBtn = new El('button', { id: 'hero-listen-btn', 'data-track': 'GALPÓN 12 (CIERRE)', 'data-bpm': '126' });
heroBtn.append(heroSpan);

const mkRow = (title, bpm) => {
  const row = new El('div', { class: 'set-row', 'data-title': title, 'data-bpm': String(bpm) });
  row.append(new El('button', { class: 'play-btn' }));
  return row;
};
const rows = [mkRow('GALPÓN 12', 126), mkRow('CIERRE EN LA TERRAZA', 128)];

const byId = {
  'audio-player-bar': new El('div', { id: 'audio-player-bar' }),
  'player-track-display': new El('div', { id: 'player-track-display' }),
  'player-toggle-btn': new El('button', { id: 'player-toggle-btn' }),
  'player-close-btn': new El('button', { id: 'player-close-btn' }),
  'hero-listen-btn': heroBtn,
};
const langBtns = [
  new El('button', { class: 'lang-btn active', 'data-lang': 'es' }),
  new El('button', { class: 'lang-btn', 'data-lang': 'en' }),
];

let domReady;
const document = {
  documentElement: new El('html'),
  addEventListener: (t, fn) => { if (t === 'DOMContentLoaded') domReady = fn; },
  getElementById: id => byId[id] || null,
  querySelectorAll: sel => {
    if (sel === '.set-row') return rows;
    if (sel === '.lang-switch .lang-btn') return langBtns;
    if (sel === '[data-i18n]') return [heroSpan];
    return [];
  },
};

// ---- stub Web Audio -------------------------------------------------------
const param = () => ({
  value: 0, setValueAtTime() {}, linearRampToValueAtTime() {},
  exponentialRampToValueAtTime() {}, cancelScheduledValues() {},
});
const node = () => ({
  frequency: param(), gain: param(), type: '',
  connect() {}, disconnect() {}, start() {}, stop() {},
});
const window = {
  AudioContext: function () {
    this.currentTime = 0; this.state = 'running'; this.destination = {};
    this.resume = () => {};
    this.createOscillator = node; this.createGain = node; this.createBiquadFilter = node;
  },
};

const store = {};
const localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; } };

// ---- boot -----------------------------------------------------------------
const src = fs.readFileSync('static/js/main.js', 'utf8');
new Function('document', 'window', 'localStorage', src)(document, window, localStorage);

// 1. Boot order: setLanguage() reads the player nodes, so declaring them after
//    the initial call threw a TDZ ReferenceError and killed every listener.
assert.doesNotThrow(domReady, 'DOMContentLoaded handler must not throw');
assert.ok(heroBtn.handlers.click, 'listeners must get bound after boot');

// 2. One click = one toggle. Binding both .play-btn and .set-row fired it
//    twice (start then immediately stop), so play did nothing at all.
rows[0].querySelector('.play-btn').click();
assert.ok(rows[0].classList.contains('is-playing'),
  'one click on .play-btn must start playback (it bubbles to .set-row — binding both toggled twice)');
assert.ok(!rows[1].classList.contains('is-playing'), 'only the clicked row plays');
assert.ok(byId['audio-player-bar'].classList.contains('is-active'), 'player bar reveals');
assert.strictEqual(byId['player-toggle-btn'].textContent, 'PAUSAR');
assert.strictEqual(heroSpan.textContent, 'SONANDO AHORA');

// 3. Language switch mid-playback must not revert labels to their idle text.
langBtns[1].click();
assert.ok(rows[0].classList.contains('is-playing'), 'still playing after language switch');
assert.strictEqual(heroSpan.textContent, 'NOW PLAYING', 'hero label follows playback, not data-en');
assert.strictEqual(byId['player-toggle-btn'].textContent, 'PAUSE');
assert.ok(byId['player-track-display'].textContent.includes('LIVE FEED'));

// 4. Clicking the playing row again stops it.
rows[0].querySelector('.play-btn').click();
assert.ok(!rows[0].classList.contains('is-playing'), 'second click stops playback');
assert.strictEqual(heroSpan.textContent, 'LISTEN NOW');
assert.strictEqual(byId['player-toggle-btn'].textContent, 'RESUME');

// 5. A paused bar must still follow the language toggle — it used to keep the
//    language it was paused in ("REANUDAR" sitting next to "(LIVE FEED)").
assert.ok(byId['player-track-display'].textContent.includes('PAUSED'),
  'paused display shows paused state');
langBtns[0].click();
assert.strictEqual(byId['player-toggle-btn'].textContent, 'REANUDAR');
assert.ok(byId['player-track-display'].textContent.includes('EN PAUSA'),
  'paused display re-renders in the newly selected language');
assert.ok(!byId['player-track-display'].textContent.includes('LIVE FEED'));
langBtns[1].click();

// 6. Switching to a different set swaps which row is lit.
rows[0].click();
rows[1].click();
assert.ok(!rows[0].classList.contains('is-playing'));
assert.ok(rows[1].classList.contains('is-playing'));

assert.strictEqual(store.djbufalo_lang, 'en', 'language choice persists');
console.log('main.js self-check: all assertions passed');
process.exit(0);
