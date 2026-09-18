/**
 * Zero-dependency Procedural Web Audio API Synthesizer
 */

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = false;
    this.musicTimer = null;
    this.musicStep = 0;
    this.scale = [220, 261.63, 293.66, 329.63, 392.00, 440, 523.25]; // A minor pentatonic
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMove() {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 20, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  playBump() {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playGem() {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [659.25, 880, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.1, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.2);
      });
    } catch (e) {}
  }

  playKey() {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880, 1174.66];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.26);
      });
    } catch (e) {}
  }

  playClock() {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [800, 1200].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.12, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.22);
      });
    } catch (e) {}
  }

  playHint() {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  playWin() {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const chords = [
        [523.25, 659.25, 783.99],       // C
        [587.33, 739.99, 880.00],       // D
        [659.25, 830.61, 987.77],       // E
        [1046.50, 1318.51, 1567.98]     // High C
      ];
      chords.forEach((chord, step) => {
        const t = now + step * 0.15;
        chord.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + (step === 3 ? 0.6 : 0.22));
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + (step === 3 ? 0.65 : 0.25));
        });
      });
    } catch (e) {}
  }

  playGameOver() {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [400, 350, 300, 220, 150];
      notes.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + i * 0.12);
        gain.gain.setValueAtTime(0.15, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.22);
      });
    } catch (e) {}
  }

  startMusic() {
    this.init();
    if (this.musicTimer) clearInterval(this.musicTimer);
    if (!this.musicEnabled) return;

    this.musicTimer = setInterval(() => {
      if (!this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const noteIdx = (this.musicStep * 2 + (this.musicStep % 3)) % this.scale.length;
        const freq = this.scale[noteIdx];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + Math.sin(this.musicStep * 0.2) * 200, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.5, now);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.38);

        this.musicStep = (this.musicStep + 1) % 16;
      } catch (e) {}
    }, 220);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  setMusic(enabled) {
    this.musicEnabled = enabled;
    if (this.musicEnabled) this.startMusic();
    else this.stopMusic();
  }

  setSfx(enabled) {
    this.sfxEnabled = enabled;
  }
}

export const globalSound = new SoundEngine();

