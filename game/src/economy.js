import { distance } from './random.js';
import { tap } from './input.js';
import { shops } from './city.js';
import { createCar, types } from './vehicles.js';
import { startMission } from './missions.js';
export const ranks = ['Unknown', 'Streetwise', 'Connected', 'Fixer', 'Legend'];
export function rank(g) {
  return ranks[Math.min(4, Math.floor(g.respect / 6))];
}
export function interact(g) {
  if (!tap('KeyE')) return;
  const p = g.player;
  if (g.dialogue) return;
  if (g.shop) {
    g.shop = null;
    return;
  }
  if (p.car) {
    const car = p.car;
    p.car = null;
    p.x += Math.sin(car.angle) * 34;
    p.y -= Math.cos(car.angle) * 34;
    car.traffic = false;
    car.occupied = false;
    g.toast('On foot · mouse to aim · 1 / 2 / 3 to switch weapon');
    return;
  }
  const shop = shops.find(s => distance(p, s) < 105);
  if (shop) {
    if (shop.type === 'arms' || shop.type === 'garage') {
      g.shop = shop.type;
      return;
    }
    if (shop.type === 'store') {
      g.robbery = { x: shop.x, y: shop.y, time: 0 };
      g.crime(2);
      g.toast('Store alarm! Stay close for 8 seconds to empty the till.');
      return;
    }
  }
  if (distance(p, { x: 150, y: 510 }) < 95) {
    startMission(g);
    return;
  }
  const car = g.cars.filter(c => distance(c, p) < (c.type === 'boat' ? 100 : 65)).sort((a, b) => distance(a, p) - distance(b, p))[0];
  if (car) {
    if (car.occupied || car.police) g.crime(1);
    car.traffic = false;
    p.car = car;
    g.toast(types[car.type].name + ' · R radio · Space handbrake · E exit');
    g.audio.effect('engine');
  }
}
export function updateEconomy(g, dt) {
  if (g.shop) {
    if (g.shop === 'arms') {
      if (tap('Digit1') && g.cash >= 600 && g.respect >= 3) {
        g.cash -= 600;
        g.player.owned[1] = true;
        g.player.ammo[1] += 40;
      }
      if (tap('Digit2') && g.cash >= 1200 && g.respect >= 9) {
        g.cash -= 1200;
        g.player.owned[2] = true;
        g.player.ammo[2] += 180;
      }
      if (tap('Digit3') && g.cash >= 250) {
        g.cash -= 250;
        g.player.armor = 100;
      }
      if (tap('Digit4') && g.cash >= 100) {
        g.cash -= 100;
        g.player.ammo[g.player.weapon] += 60;
      }
    } else {
      if (tap('Digit1')) {
        const car = g.cars.find(c => distance(c, g.player) < 150);
        if (car) {
          g.storedCar = car.type;
          car.health = 100;
          g.toast('Stored and repaired: ' + types[car.type].name);
          g.save();
        }
      }
      if (tap('Digit2') && g.storedCar) g.cars.push(createCar(450, 1470, g.storedCar, -Math.PI / 2));
      if (tap('Digit3') && g.cash >= 5000) {
        g.cash -= 5000;
        g.storedCar = 'sports';
        g.cars.push(createCar(450, 1470, 'sports', -Math.PI / 2));
      }
      if (tap('Digit4') && g.cash >= 1900) {
        g.cash -= 1900;
        g.cars.push(createCar(450, 1500, 'motorcycle', -Math.PI / 2));
      }
    }
  }
  if (g.robbery) {
    if (distance(g.player, g.robbery) < 140) g.robbery.time += dt;
    else g.robbery = null;
    if (g.robbery?.time >= 8) {
      g.cash += 450;
      g.respect++;
      g.robbery = null;
      g.toast('Till cleared · +$450 · +1 respect');
    }
  }
  for (const pack of g.packages) {
    if (!pack.taken && distance(pack, g.player) < 27) {
      pack.taken = true;
      g.cash += 150;
      g.respect++;
      g.burst(pack.x, pack.y, '#ffe086', 15);
      g.audio.effect('pickup');
      g.toast('Hidden cache ' + g.packages.filter(p => p.taken).length + '/20 · +$150');
      g.save();
    }
  }
  if (tap('KeyT') && g.player.car?.type === 'taxi' && !g.fare) {
    g.fare = { pickup: true, x: 1950, y: 820 };
    g.toast('Fare waiting at Solana cross. Follow the diamond.');
  }
  if (g.fare && distance(g.player, g.fare) < 55 && Math.abs(g.player.car?.speed || 0) < 80) {
    if (g.fare.pickup) {
      g.fare = { x: 750, y: 490, pickup: false };
      g.toast('Passenger aboard. Crown Station, please.');
    } else {
      g.cash += 320;
      g.respect++;
      g.fare = null;
      g.toast('Fare complete · +$320');
    }
  }
  const points = [{ x: 1650, y: 1050 }, { x: 2250, y: 1050 }, { x: 2250, y: 450 }, { x: 1650, y: 450 }];
  if (tap('KeyG') && g.player.car && !g.race) {
    g.race = { step: 0, left: 65 };
    g.toast('Coast circuit started. Four checkpoints. 65 seconds.');
  }
  if (g.race) {
    g.race.left -= dt;
    if (distance(g.player, points[g.race.step]) < 70) g.race.step++;
    if (g.race.step === 4) {
      g.cash += 900;
      g.respect += 2;
      g.race = null;
      g.toast('Circuit won · +$900');
    } else if (g.race.left <= 0) {
      g.race = null;
      g.toast('Time expired. Press G for another circuit.');
    }
  }
  g.raceTarget = g.race ? points[g.race.step] : null;
  for (const ramp of g.ramps) {
    if (g.player.car && distance(g.player, ramp) < 35 && Math.abs(g.player.car.speed) > 170 && g.jump <= 0) {
      g.jump = 1.3;
      if (!ramp.done) {
        ramp.done = true;
        g.cash += 400;
        g.respect++;
        g.toast('Stunt cleared · +$400');
      }
    }
  }
  g.jump = Math.max(0, g.jump - dt);
}
