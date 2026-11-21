import { roadsX, roadsY, buildings, shops } from './city.js';
import { missionTarget } from './missions.js';
export function drawMinimap(c, g) {
  const x = 30;
  const y = 472;
  const w = 216;
  const h = 174;
  c.fillStyle = '#112c37';
  c.fillRect(x - 9, y - 26, w + 18, h + 37);
  c.font = 'bold 10px sans-serif';
  c.fillStyle = '#b6d1ce';
  c.textAlign = 'left';
  c.fillText('PORT MERIDIAN', x + 2, y - 9);
  c.fillStyle = '#f3d6a0';
  c.fillText('N ↑', x + 185, y - 9);
  c.save();
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();
  const scale = 0.095;
  const mx = n => x + w / 2 + (n - g.player.x) * scale;
  const my = n => y + h / 2 + (n - g.player.y) * scale;
  c.fillStyle = '#354b4b';
  c.fillRect(x, y, w, h);
  c.fillStyle = '#397b91';
  c.fillRect(mx(2360), my(0), 200, 500);
  c.fillRect(mx(0), my(2080), 500, 200);
  c.fillStyle = '#66746c';
  for (const b of buildings) c.fillRect(mx(b.x), my(b.y), b.w * scale, b.h * scale);
  c.strokeStyle = '#b7bbae';
  c.lineWidth = 4;
  for (const road of roadsX) {
    c.beginPath();
    c.moveTo(mx(road), my(55));
    c.lineTo(mx(road), my(2070));
    c.stroke();
  }
  for (const road of roadsY) {
    c.beginPath();
    c.moveTo(mx(55), my(road));
    c.lineTo(mx(2340), my(road));
    c.stroke();
  }
  function dot(px, py, color, size = 3) {
    c.fillStyle = color;
    c.fillRect(mx(px) - size / 2, my(py) - size / 2, size, size);
  }
  for (const s of shops) dot(s.x, s.y, '#94e0b4', 5);
  for (const p of g.packages) if (!p.taken) dot(p.x, p.y, '#c4a8db', 3);
  for (const car of g.cars) if (car.police || car.type === 'police') dot(car.x, car.y, '#f08d7e', 5);
  const target = g.raceTarget || g.fare || missionTarget(g);
  if (target?.x !== undefined) dot(target.x, target.y, '#ffd57e', 7);
  c.save();
  c.translate(x + w / 2, y + h / 2);
  c.rotate(g.player.angle);
  c.fillStyle = '#fff0bf';
  c.beginPath();
  c.moveTo(7, 0);
  c.lineTo(-5, -4);
  c.lineTo(-3, 0);
  c.lineTo(-5, 4);
  c.fill();
  c.restore();
  c.restore();
}
