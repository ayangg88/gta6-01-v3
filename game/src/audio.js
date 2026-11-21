export class AudioSystem {
  constructor() {
    this.context = null;
    this.muted = false;
    this.station = 0;
    this.beat = 0;
    this.next = 0;
  }
  start() {
    if (!this.context) this.context = new AudioContext();
    this.context.resume();
  }
  tone(frequency, duration, type = 'sine', volume = 0.06, end = frequency) {
    if (!this.context || this.muted) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(10, end), now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain).connect(this.context.destination);
    osc.start(now);
    osc.stop(now + duration);
  }
  effect(name) {
    if (name === 'shot') this.tone(160, 0.12, 'sawtooth', 0.1, 30);
    if (name === 'pickup') {
      this.tone(660, 0.18, 'sine', 0.08, 990);
    }
    if (name === 'engine') this.tone(70, 0.5, 'sawtooth', 0.05, 120);
  }
  update(g, dt) {
    this.next -= dt;
    if (this.next > 0 || !this.context) return;
    this.next = 0.21;
    if (g.player.car) this.tone(35 + Math.abs(g.player.car.speed) / 5, 0.24, 'sawtooth', 0.018);
    if (g.wanted > 0) this.tone(this.beat % 4 < 2 ? 600 : 830, 0.22, 'sine', 0.025);
    const patterns = [[0, 7, 10, 7, 3, 7, 12, 10], [0, 3, 7, 12, 10, 7, 3, 5], [0, 5, 7, 9, 7, 5, 2, 7]];
    const note = patterns[this.station][this.beat % 8];
    this.tone(110 * 2 ** (note / 12), 0.18, this.station === 1 ? 'triangle' : 'sine', 0.025);
    if (this.beat % 4 === 0) this.tone(90, 0.12, 'sine', 0.07, 35);
    if (this.beat % 2) this.tone(2600, 0.025, 'square', 0.008, 800);
    this.beat++;
  }
}
export const stations = ['96.4 / COPPER FM', '104.8 / TIDAL SOUL', '88.2 / NIGHT CURRENT'];
