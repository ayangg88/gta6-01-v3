import { mouse, tap } from './input.js';
import { blocked } from './city.js';
import { random, distance } from './random.js';
export const weapons = [
  { name: 'Pistol', delay: 0.32, damage: 30, pellets: 1, spread: 0.025, cost: 0 },
  { name: 'Shotgun', delay: 0.85, damage: 20, pellets: 7, spread: 0.28, cost: 600 },
  { name: 'SMG', delay: 0.085, damage: 14, pellets: 1, spread: 0.09, cost: 1200 }
];
export function updateWeapons(g, dt) {
  const p = g.player;
  for (let i = 0; i < 3; i++) if (tap('Digit' + (i + 1)) && p.owned[i]) p.weapon = i;
  p.cooldown -= dt;
  if (!p.car) p.angle = Math.atan2(mouse.y - (p.y - g.camera.y + 360), mouse.x - (p.x - g.camera.x + 640));
  if (mouse.down && !p.car && p.cooldown <= 0 && p.ammo[p.weapon] > 0) {
    const w = weapons[p.weapon];
    p.cooldown = w.delay;
    p.ammo[p.weapon]--;
    g.crime(0.35);
    g.audio.effect('shot');
    for (let i = 0; i < w.pellets; i++) {
      const angle = p.angle + (random() - 0.5) * w.spread;
      g.bullets.push({ x: p.x + Math.cos(angle) * 17, y: p.y + Math.sin(angle) * 17, vx: Math.cos(angle) * 720, vy: Math.sin(angle) * 720, life: 0.7, damage: w.damage });
    }
    g.burst(p.x + Math.cos(p.angle) * 21, p.y + Math.sin(p.angle) * 21, '#ffe19a', 5, 0.15);
    for (const ped of g.peds) if (distance(ped, p) < 300) ped.flee = 6;
  }
  for (const bullet of g.bullets) {
    bullet.life -= dt;
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    if (blocked(bullet.x, bullet.y, 0)) {
      bullet.life = 0;
      g.burst(bullet.x, bullet.y, '#e7cba4', 4, 0.3);
    }
    if (bullet.enemy && distance(bullet, p) < 17) {
      g.hurt(bullet.damage);
      bullet.life = 0;
    }
    if (!bullet.enemy) {
      for (const enemy of [...g.officers, ...g.enemies]) {
        if (enemy.health > 0 && distance(bullet, enemy) < 16) {
          enemy.health -= bullet.damage;
          bullet.life = 0;
          g.burst(enemy.x, enemy.y, '#dfcc9c', 5, 0.3);
        }
      }
      for (const car of g.cars) {
        if (distance(bullet, car) < 22) {
          car.health -= bullet.damage * 0.7;
          bullet.life = 0;
          g.burst(bullet.x, bullet.y, '#ffe5ac', 3);
        }
      }
    }
  }
  g.bullets = g.bullets.filter(b => b.life > 0);
  for (const pickup of g.pickups) {
    if (!pickup.taken && distance(pickup, p) < 24) {
      pickup.taken = true;
      if (pickup.type === 'health') p.health = Math.min(100, p.health + 40);
      else p.ammo[p.weapon] += 36;
      g.audio.effect('pickup');
      g.toast(pickup.type === 'health' ? 'First aid +40' : 'Ammunition +36');
    }
  }
}
