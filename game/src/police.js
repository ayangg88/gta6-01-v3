import { distance, random } from './random.js';
import { createCar } from './vehicles.js';
import { moveBody, buildings } from './city.js';
export function hasSight(a, b) {
  const steps = Math.ceil(distance(a, b) / 30);
  for (let i = 1; i < steps; i++) {
    const x = a.x + (b.x - a.x) * i / steps;
    const y = a.y + (b.y - a.y) * i / steps;
    if (buildings.some(r => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h)) return false;
  }
  return true;
}
export function updatePolice(g, dt) {
  if (g.wanted <= 0) return;
  g.policeTimer -= dt;
  if (g.policeTimer <= 0 && !g.staged) {
    g.policeTimer = 8;
    const angle = random() * Math.PI * 2;
    const car = createCar(g.player.x + Math.cos(angle) * 490, g.player.y + Math.sin(angle) * 490, g.wanted === 5 ? 'armored' : 'police', angle + Math.PI);
    car.police = true;
    g.cars.push(car);
    g.officers.push({ x: car.x, y: car.y, health: 70, cooldown: 1 });
    if (g.wanted >= 2 && g.cars.filter(c => c.police).length < 8) {
      const block = createCar(Math.round(g.player.x / 300) * 300 + 150, g.player.y + 320, 'police', 0);
      block.roadblock = true;
      g.cars.push(block);
    }
  }
  let visible = false;
  for (const cop of g.officers) {
    if (cop.health <= 0) continue;
    const d = distance(cop, g.player);
    if (d < 420 && hasSight(cop, g.player)) {
      visible = true;
      const a = Math.atan2(g.player.y - cop.y, g.player.x - cop.x);
      if (d > 105) moveBody(cop, Math.cos(a) * dt * 78, Math.sin(a) * dt * 78);
      cop.cooldown -= dt;
      if (cop.cooldown < 0 && d < 310) {
        cop.cooldown = 1.2;
        g.bullets.push({ x: cop.x, y: cop.y, vx: Math.cos(a) * 430, vy: Math.sin(a) * 430, life: 0.8, enemy: true, damage: 6 });
      }
      if (d < 28 && !g.player.car) g.arrest += dt;
    }
  }
  for (const car of g.cars) if (car.police && distance(car, g.player) < 310 && hasSight(car, g.player)) visible = true;
  if (g.wanted >= 3) {
    g.heli.x += (g.player.x + 170 - g.heli.x) * dt * 0.8;
    g.heli.y += (g.player.y - 155 - g.heli.y) * dt * 0.8;
    if (distance(g.heli, g.player) < 170 && hasSight(g.heli, g.player)) visible = true;
  }
  g.seen = visible;
  g.hide = visible ? 0 : g.hide + dt;
  if (g.hide > 10) {
    g.wanted--;
    g.hide = 0;
    if (!g.wanted) g.toast('Heat lost. Keep your head down.');
  }
  if (!visible) g.arrest = Math.max(0, g.arrest - dt);
}
