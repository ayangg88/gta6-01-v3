import { random, choose } from './random.js';
export const WORLD = { width: 3000, height: 2400 };
export const roadsX = [150, 450, 750, 1050, 1350, 1650, 1950, 2250];
export const roadsY = [150, 450, 750, 1050, 1350, 1650, 1950];
export const buildings = [];
export const props = [];
export const shops = [
  { x: 1120, y: 1160, name: 'SUNSTOP', type: 'store', color: '#f4c65b' },
  { x: 1730, y: 560, name: 'PALM ARMS', type: 'arms', color: '#eb896c' },
  { x: 520, y: 1470, name: 'DELGADO GARAGE', type: 'garage', color: '#80bdbb' },
  { x: 1840, y: 820, name: 'METER / TAXI', type: 'taxi', color: '#f4d16a' }
];
const palettes = ['#d7ad87', '#eac993', '#e4a58b', '#8eb9bf', '#91a8ab', '#e5d4b1', '#b2b9a1', '#c98f83'];
for (let col = 0; col < 8; col++) {
  for (let row = 0; row < 7; row++) {
    const x = roadsX[col] + 61;
    const y = roadsY[row] + 61;
    if (col === 7 || row === 6) continue;
    const park = (col === 2 && row === 2) || (col === 4 && row === 4);
    if (park) {
      props.push({ x: x + 87, y: y + 87, type: 'park' });
      continue;
    }
    for (let n = 0; n < 4; n++) {
      buildings.push({ x: x + n % 2 * 90, y: y + Math.floor(n / 2) * 91, w: 73 + random() * 9, h: 65 + random() * 16, color: choose(palettes), roof: choose(['#4d717c', '#b57461', '#b5a077', '#65918e', '#747e89']), high: col < 3 && row < 3 });
    }
  }
}
for (const x of roadsX) {
  for (let y = 80; y < 2040; y += 94) {
    if (roadsY.some(road => Math.abs(y - road) < 58)) continue;
    props.push({ x: x + 57, y, type: 'palm' });
    props.push({ x: x - 55, y: y + 22, type: 'lamp' });
    props.push({ x: x - 58, y: y + 48, type: 'bench' });
  }
}
for (const shop of shops) {
  for (let i = buildings.length - 1; i >= 0; i--) {
    const b = buildings[i];
    if (Math.abs(b.x - shop.x) < 110 && Math.abs(b.y - shop.y) < 100) buildings.splice(i, 1);
  }
}
export function water(x, y) {
  return x > 2380 || y > 2080;
}
export function blocked(x, y, radius = 10) {
  if (x < 45 || y < 45 || x > 2920 || y > 2320 || water(x, y)) return true;
  return buildings.some(b => x > b.x - radius && x < b.x + b.w + radius && y > b.y - radius && y < b.y + b.h + radius) || shops.some(b => x > b.x - 48 - radius && x < b.x + 48 + radius && y > b.y - 37 - radius && y < b.y + 37 + radius);
}
export function moveBody(body, dx, dy, radius = 10) {
  if (!blocked(body.x + dx, body.y, radius)) body.x += dx;
  if (!blocked(body.x, body.y + dy, radius)) body.y += dy;
}
export function district(x, y) {
  if (x > 2070 && y > 1300) return 'THE TIDELINE / MARINA';
  if (x > 1650) return 'SOLANA / BEACHFRONT';
  if (y > 1450) return 'IRON QUAY / INDUSTRIAL';
  if (y < 450 && x > 1050) return 'CITRUS HILLS';
  return 'CROWN / DOWNTOWN';
}
