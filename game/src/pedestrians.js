import { random, choose, distance } from './random.js';
import { roadsX, roadsY, moveBody } from './city.js';
export function populatePedestrians() {
  return Array.from({ length: 190 }, (_, i) => ({
    x: choose(roadsX) + (i % 2 ? 51 : -51),
    y: 100 + random() * 1850,
    angle: i % 2 ? Math.PI / 2 : -Math.PI / 2,
    color: choose(['#eea16e', '#e8d39b', '#407b88', '#b56368', '#f8f0d1', '#60826a']),
    skin: choose(['#ad7754', '#dfaa7a', '#835b46']),
    flee: 0,
    down: 0
  }));
}
export function updatePedestrians(g, dt) {
  for (const ped of g.peds) {
    if (ped.down > 0) {
      ped.down -= dt;
      continue;
    }
    if (ped.flee > 0) {
      ped.flee -= dt;
      ped.angle = Math.atan2(ped.y - g.player.y, ped.x - g.player.x);
    }
    if (g.player.car && Math.abs(g.player.car.speed) > 130 && distance(ped, g.player) < 100) ped.flee = 3;
    const speed = ped.flee > 0 ? 105 : 24;
    const old = { x: ped.x, y: ped.y };
    moveBody(ped, Math.cos(ped.angle) * speed * dt, Math.sin(ped.angle) * speed * dt, 6);
    if (distance(old, ped) < dt || ped.y < 75 || ped.y > 2020) ped.angle += Math.PI;
  }
}
