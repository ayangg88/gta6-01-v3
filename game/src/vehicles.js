import { random, choose, clamp, angleDifference, distance } from './random.js';
import { blocked, water, roadsX, roadsY } from './city.js';
import { held } from './input.js';
export const types = {
  sedan: { name: 'Marlin', max: 290, power: 160, color: '#e8e1c9', length: 43, width: 23, price: 1500 },
  taxi: { name: 'Sun Cab', max: 270, power: 150, color: '#f7be3c', length: 45, width: 24, price: 2100 },
  pickup: { name: 'Mesa', max: 260, power: 145, color: '#bd6654', length: 49, width: 25, price: 2500 },
  sports: { name: 'Cometline', max: 440, power: 240, color: '#f76e4c', length: 43, width: 24, price: 5000 },
  van: { name: 'Parcel', max: 225, power: 120, color: '#80a7a1', length: 53, width: 27, price: 3000 },
  police: { name: 'Interceptor', max: 340, power: 190, color: '#e6eee5', length: 47, width: 25, price: 6000 },
  motorcycle: { name: 'Needle', max: 380, power: 230, color: '#f0b34e', length: 30, width: 12, price: 1900 },
  boat: { name: 'Skimmer', max: 350, power: 160, color: '#f3ede0', length: 65, width: 27, price: 3500 },
  armored: { name: 'Bastion', max: 230, power: 160, color: '#374f57', length: 60, width: 30, price: 9000 }
};
export function createCar(x, y, type = 'sedan', angle = 0, traffic = false) {
  return { x, y, type, angle, speed: 0, health: 100, traffic, stop: 0, turn: 0, color: types[type].color, occupied: traffic, smoke: 0 };
}
export function populateVehicles() {
  const cars = [];
  for (let i = 0; i < 95; i++) {
    const horizontal = i % 2 === 0;
    const direction = i % 4 < 2 ? 1 : -1;
    const x = horizontal ? 90 + random() * 2170 : choose(roadsX) + direction * 18;
    const y = horizontal ? choose(roadsY) - direction * 18 : 90 + random() * 1880;
    const car = createCar(x, y, choose(['sedan', 'sedan', 'taxi', 'pickup', 'van', 'sports', 'motorcycle']), horizontal ? direction > 0 ? 0 : Math.PI : direction > 0 ? Math.PI / 2 : -Math.PI / 2, true);
    car.color = car.type === 'taxi' ? '#f7be3c' : choose(['#4d8185', '#d9866b', '#e4d2ac', '#708b9c', '#d5a94c', '#ae685f']);
    car.speed = 65 + random() * 35;
    cars.push(car);
  }
  for (let i = 0; i < 30; i++) cars.push(createCar(roadsX[i % 7] + 35, 240 + Math.floor(i / 7) * 300, choose(['sedan', 'pickup', 'sports']), Math.PI / 2));
  for (let i = 0; i < 6; i++) cars.push(createCar(2460 + i % 2 * 160, 1480 + i * 110, 'boat', -Math.PI / 2));
  cars.push(createCar(155, 350, 'sports', -Math.PI / 2));
  cars.push(createCar(2300, 1730, 'boat', 0));
  return cars;
}
export function updateVehicles(g, dt) {
  for (const car of g.cars) {
    if (car === g.player.car) {
      const spec = types[car.type];
      const throttle = held('KeyW', 'ArrowUp') ? 1 : held('KeyS', 'ArrowDown') ? -1 : 0;
      car.speed += throttle * spec.power * dt;
      car.speed *= Math.pow(held('Space') ? 0.965 : 0.992, dt * 60);
      car.speed = clamp(car.speed, -100, spec.max * (car.health < 25 ? 0.55 : 1));
      const steer = (held('KeyD', 'ArrowRight') ? 1 : 0) - (held('KeyA', 'ArrowLeft') ? 1 : 0);
      car.angle += steer * clamp(car.speed / 100, -1.2, 1.8) * dt * (held('Space') ? 2.3 : 1.35);
      if (held('Space') && Math.abs(car.speed) > 80) {
        g.skids.push({ x: car.x, y: car.y, angle: car.angle, life: 18 });
        if (g.skids.length > 300) g.skids.shift();
      }
    } else if (car.traffic) {
      const across = Math.abs(Math.cos(car.angle)) > 0.7;
      const crossing = across ? roadsX : roadsY;
      const position = across ? car.x : car.y;
      const intersection = crossing.find(v => Math.abs(position - v) < 52);
      const signal = Math.floor(g.time / 7) % 2 === (across ? 0 : 1);
      const ahead = g.cars.some(other => other !== car && distance(car, other) < 60 && (other.x - car.x) * Math.cos(car.angle) + (other.y - car.y) * Math.sin(car.angle) > 0);
      const target = (intersection && !signal || ahead) ? 0 : 95;
      car.speed += (target - car.speed) * dt * 2;
      if (car.x < 70 || car.x > 2310 || car.y < 70 || car.y > 2010) car.angle += Math.PI;
    } else if (car.police && g.wanted > 0) {
      const target = Math.atan2(g.player.y - car.y, g.player.x - car.x);
      car.angle += clamp(angleDifference(target, car.angle), -dt * 1.6, dt * 1.6);
      car.speed += (180 + g.wanted * 17 - car.speed) * dt;
    } else continue;
    const nx = car.x + Math.cos(car.angle) * car.speed * dt;
    const ny = car.y + Math.sin(car.angle) * car.speed * dt;
    const collision = car.type === 'boat' ? !water(nx, ny) && nx < 2280 : blocked(nx, ny, 13);
    if (collision) {
      if (Math.abs(car.speed) > 65) {
        car.health -= Math.abs(car.speed) * 0.065;
        g.burst(car.x, car.y, '#ffe9ab', 10);
        if (car === g.player.car) g.shake = 8;
      }
      car.speed *= -0.3;
      if (car.traffic || car.police) car.angle += Math.PI / 2;
    } else {
      car.x = nx;
      car.y = ny;
    }
    if (car.health < 40 && random() < dt * 9) g.burst(car.x, car.y, '#6c7772', 1, 1.5);
    if (car.health <= 0 && car === g.player.car) g.player.health -= dt * 16;
    if (car === g.player.car && Math.abs(car.speed) > 75) {
      for (const ped of g.peds) {
        if (distance(car, ped) < 21 && !ped.down) {
          ped.down = 8;
          g.crime(1);
          g.burst(ped.x, ped.y, '#e6d8b4', 6);
        }
      }
      for (const other of g.cars) {
        if (other === car || distance(car, other) > 30) continue;
        other.speed = car.speed * 0.4;
        car.speed *= 0.65;
        car.health -= 4;
        g.shake = 5;
        g.burst(car.x, car.y, '#ffe7a0', 6);
      }
    }
  }
  if (g.player.car) {
    g.player.x = g.player.car.x;
    g.player.y = g.player.car.y;
    g.player.angle = g.player.car.angle;
  }
}
