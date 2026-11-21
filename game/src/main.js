import { random, distance } from './random.js';
import { held, tap, pressed } from './input.js';
import { moveBody } from './city.js';
import { populateVehicles, updateVehicles } from './vehicles.js';
import { populatePedestrians, updatePedestrians } from './pedestrians.js';
import { updatePolice } from './police.js';
import { updateWeapons } from './weapons.js';
import { updateMissions, updateEnemies } from './missions.js';
import { interact, updateEconomy } from './economy.js';
import { updateDialogue } from './dialogue.js';
import { AudioSystem } from './audio.js';
import { saveGame, loadGame } from './save.js';
import { stageShot } from './shots.js';
import { render } from './render.js';

const g = {
  player: { x: 150, y: 430, angle: -Math.PI / 2, car: null, health: 100, armor: 0, ammo: [120, 0, 0], owned: [true, false, false], weapon: 0, cooldown: 0 },
  camera: { x: 150, y: 430 },
  cars: populateVehicles(),
  peds: populatePedestrians(),
  officers: [],
  enemies: [],
  bullets: [],
  particles: [],
  skids: [],
  packages: Array.from({ length: 20 }, (_, i) => ({ x: 205 + i % 7 * 300, y: 280 + Math.floor(i / 7) * 600, taken: false })),
  pickups: [{ x: 150, y: 560, type: 'health' }, { x: 1050, y: 1200, type: 'ammo' }, { x: 1350, y: 1750, type: 'ammo' }, { x: 2250, y: 1450, type: 'health' }],
  ramps: [{ x: 2250, y: 1200 }, { x: 1050, y: 1830 }, { x: 450, y: 900 }],
  heli: { x: 500, y: 300 },
  audio: new AudioSystem(),
  cash: 750,
  respect: 0,
  completed: 0,
  mission: null,
  wanted: 0,
  heat: 0,
  hide: 0,
  arrest: 0,
  seen: false,
  policeTimer: 0,
  time: 0,
  clock: 725,
  rain: false,
  shake: 0,
  jump: 0,
  start: true,
  paused: false,
  slot: 1,
  toastText: '',
  toastTime: 0,
  toast(message) {
    this.toastText = message;
    this.toastTime = 4;
  },
  crime(amount) {
    this.heat += amount;
    this.wanted = Math.min(5, Math.max(this.wanted, Math.ceil(this.heat)));
    this.hide = 0;
  },
  hurt(damage) {
    if (this.player.armor > 0) this.player.armor = Math.max(0, this.player.armor - damage);
    else this.player.health -= damage;
    this.shake = 4;
  },
  burst(x, y, color, count, lifetime = 0.6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({ x, y, vx: (random() - 0.5) * 90, vy: (random() - 0.5) * 90, color, life: lifetime, size: 2 + random() * 3 });
    }
  },
  save() {
    saveGame(this);
  }
};
window.meridian = g;
stageShot(g, new URLSearchParams(location.search).get('shot'));
function respawn() {
  g.player.car = null;
  g.player.x = 150;
  g.player.y = 430;
  g.player.health = 100;
  g.player.armor = 0;
  g.cash = Math.max(0, g.cash - 200);
  g.wanted = 0;
  g.heat = 0;
  g.arrest = 0;
  g.mission = null;
  g.enemies = [];
  g.officers = [];
  g.bullets = [];
  g.cars.forEach(c => c.police = false);
  g.dead = null;
}
function controls() {
  if (tap('KeyM')) g.audio.muted = !g.audio.muted;
  if (tap('KeyR')) g.audio.station = (g.audio.station + 1) % 3;
  if (tap('Escape') && !g.start) {
    g.paused = !g.paused;
    g.shop = null;
  }
  if (g.start) {
    if (tap('Enter')) {
      g.start = false;
      g.audio.start();
      g.toast('Welcome back, Rae. Inez is waiting at the pink phone.');
    }
    for (let i = 1; i <= 3; i++) {
      if (tap('Digit' + i)) {
        if (loadGame(g, i)) {
          g.start = false;
          g.audio.start();
        } else g.toast('Slot ' + i + ' is empty. Enter starts a new story.');
      }
    }
  }
  if (g.paused) {
    for (let i = 1; i <= 3; i++) if (tap('Digit' + i)) g.slot = i;
    if (tap('F5')) saveGame(g);
    if (tap('F9')) {
      if (!loadGame(g, g.slot)) g.toast('Empty save slot');
    }
  }
  if (g.dead && tap('Enter')) respawn();
  if (g.completeScreen && tap('Enter')) g.completeScreen = null;
}
function update(dt) {
  controls();
  if (g.staged || g.start || g.paused || g.dead || g.completeScreen) return;
  g.time += dt;
  g.clock = (g.clock + dt * 1.8) % 1440;
  g.rain = Math.floor(g.time / 90) % 5 === 3;
  g.toastTime -= dt;
  g.shake = Math.max(0, g.shake - dt * 15);
  g.heat = Math.max(g.wanted - 0.9, Math.min(g.heat, g.wanted));
  updateDialogue(g, dt, tap('Enter'));
  if (!g.dialogue && !g.shop) {
    if (!g.player.car) {
      let dx = (held('KeyD', 'ArrowRight') ? 1 : 0) - (held('KeyA', 'ArrowLeft') ? 1 : 0);
      let dy = (held('KeyS', 'ArrowDown') ? 1 : 0) - (held('KeyW', 'ArrowUp') ? 1 : 0);
      const length = Math.hypot(dx, dy) || 1;
      const speed = held('ShiftLeft', 'ShiftRight') ? 175 : 115;
      moveBody(g.player, dx / length * speed * dt, dy / length * speed * dt);
    }
    updateVehicles(g, dt);
    updateWeapons(g, dt);
    updateMissions(g, dt);
    updatePolice(g, dt);
    updateEnemies(g, dt);
  }
  interact(g);
  updateEconomy(g, dt);
  updatePedestrians(g, dt);
  for (const particle of g.particles) {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.size += dt * 2;
  }
  g.particles = g.particles.filter(p => p.life > 0);
  const car = g.player.car;
  const look = car ? car.speed * 0.23 : 0;
  g.camera.x += (g.player.x + Math.cos(g.player.angle) * look - g.camera.x) * Math.min(1, dt * 6);
  g.camera.y += (g.player.y + Math.sin(g.player.angle) * look - g.camera.y) * Math.min(1, dt * 6);
  g.audio.update(g, dt);
  if (g.player.health <= 0 || g.arrest > 3) {
    g.dead = g.arrest > 3 ? 'BUSTED' : 'WASTED';
    g.dialogue = null;
  }
}
let previous = 0;
function frame(now) {
  const dt = Math.min(0.035, (now - previous) / 1000 || 0.016);
  previous = now;
  update(dt);
  render(g);
  pressed.clear();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
