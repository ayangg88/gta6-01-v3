import { createCar } from './vehicles.js';
import { openDialogue } from './dialogue.js';
export function stageShot(g, shot) {
  if (!['chase', 'street', 'mission', 'drive'].includes(shot)) return;
  g.staged = shot;
  g.start = false;
  g.clock = 725;
  g.cash = 18450;
  g.respect = 15;
  g.player.armor = 78;
  g.player.health = 92;
  g.toastTime = 0;
  const locations = { chase: [750, 670], street: [1935, 610], mission: [1120, 1220], drive: [2245, 1690] };
  const [x, y] = locations[shot];
  g.player.x = x;
  g.player.y = y;
  g.camera.x = x;
  g.camera.y = y;
  g.cars = g.cars.filter(c => Math.hypot(c.x - x, c.y - y) > 450);
  g.peds = g.peds.filter(p => Math.hypot(p.x - x, p.y - y) > 500);
  if (shot !== 'mission' && shot !== 'street') {
    const car = createCar(x, y, 'sports', shot === 'chase' ? -1.35 : -Math.PI / 2);
    car.speed = 330;
    car.color = '#ed7754';
    g.cars.push(car);
    g.player.car = car;
    g.player.angle = car.angle;
    g.wanted = 3;
    g.seen = true;
    for (let i = 0; i < 4; i++) {
      const car = createCar(x + (i % 2 ? 26 : -25), y + 90 + i * 65, 'police', -Math.PI / 2 + (i % 2 ? -0.18 : 0.1));
      car.police = true;
      g.cars.push(car);
    }
    for (let i = 0; i < 12; i++) g.skids.push({ x: x + Math.sin(i / 5) * 17, y: y + 25 + i * 10, angle: -1.35, life: 20 });
    g.heli = { x: x + (shot === 'chase' ? 180 : 145), y: y - 155 };
    g.mission = { index: shot === 'chase' ? 0 : 7, step: shot === 'chase' ? 1 : 2, progress: 0, timer: 0 };
  }
  if (shot === 'street') {
    for (let i = 0; i < 17; i++) {
      const horizontal = i < 10;
      const car = createCar(horizontal ? 1490 + i * 70 : 1932 + i % 2 * 36, horizontal ? 432 + i % 2 * 36 : 300 + (i - 10) * 63, ['sedan', 'taxi', 'pickup', 'sports', 'van', 'motorcycle'][i % 6], horizontal ? i % 2 ? Math.PI : 0 : i % 2 ? Math.PI / 2 : -Math.PI / 2);
      g.cars.push(car);
    }
    for (let i = 0; i < 8; i++) g.cars.push(createCar(2248 + i % 2 * 34, 350 + i * 53, i % 3 ? 'sedan' : 'taxi', -Math.PI / 2));
    for (let i = 0; i < 34; i++) g.peds.push({ x: 1660 + i % 9 * 65, y: 392 + Math.floor(i / 9) * 118 + i % 3 * 10, angle: i, color: ['#e99570', '#f8e8b3', '#43848a', '#9b6475'][i % 4], skin: '#c68f67' });
    g.player.angle = -0.5;
  }
  if (shot === 'mission') {
    g.mission = { index: 1, step: 1, progress: 2, timer: 0 };
    g.wanted = 2;
    g.player.angle = -Math.PI / 2;
    openDialogue(g, 'Milo Quill / radio', 'That envelope belongs to the Harbor Circle. Take it, Rae. I will hold the alley. The second you hear sirens, we move.');
    g.dialogue.shown = 999;
    g.cars.push(createCar(1050, 1230, 'sports', -Math.PI / 2));
    g.cars.push(createCar(1350, 1300, 'police', -Math.PI / 2));
    g.peds.push({ x: 1120, y: 1200, angle: Math.PI / 2, color: '#63a99e' });
    g.officers.push({ x: 1330, y: 1250, health: 70, cooldown: 1 });
  }
  for (let i = 0; i < 11; i++) {
    const cx = shot === 'drive' ? 1950 : x - 300;
    g.cars.push(createCar(cx + i % 2 * 28, y - 260 + i * 61, ['taxi', 'sedan', 'van'][i % 3], Math.PI / 2));
  }
  for (let i = 0; i < 18; i++) g.peds.push({ x: (shot === 'drive' ? 2310 : x - 55) + i % 3 * 23, y: y - 220 + Math.floor(i / 3) * 76, color: ['#4a8992', '#f2c18b', '#bc746b'][i % 3], angle: i });
  if (shot === 'drive') {
    for (let i = 0; i < 6; i++) {
      const boat = createCar(2430 + i % 2 * 170, 1495 + Math.floor(i / 2) * 185, 'boat', i % 2 ? -0.3 : Math.PI / 2);
      g.cars.push(boat);
    }
  }
  g.time = 12;
}
