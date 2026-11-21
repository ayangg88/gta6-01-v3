import { buildings, props, shops, roadsX, roadsY, district } from './city.js';
import { types } from './vehicles.js';
import { drawHUD } from './hud.js';
import { missionTarget } from './missions.js';
export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');
const C = ctx;
function rect(x, y, w, h, color) {
  C.fillStyle = color;
  C.fillRect(x, y, w, h);
}
function line(x1, y1, x2, y2, color, width = 1) {
  C.strokeStyle = color;
  C.lineWidth = width;
  C.beginPath();
  C.moveTo(x1, y1);
  C.lineTo(x2, y2);
  C.stroke();
}
function circle(x, y, radius, color) {
  C.fillStyle = color;
  C.beginPath();
  C.arc(x, y, radius, 0, Math.PI * 2);
  C.fill();
}
function building(b) {
  rect(b.x + 10, b.y + 13, b.w + 5, b.h + 6, '#243f4138');
  rect(b.x, b.y + 9, b.w, b.h, '#7e8b86');
  rect(b.x, b.y, b.w, b.h, b.color);
  rect(b.x + 5, b.y + 5, b.w - 10, b.h - 10, b.roof);
  rect(b.x + 9, b.y + 9, b.w - 18, 3, '#ffffff40');
  for (let x = b.x + 7; x < b.x + b.w - 8; x += 14) {
    rect(x, b.y + b.h + 2, 8, 5, '#2a4a59');
    rect(x, b.y + b.h + 3, 3, 3, '#9fc8c7');
  }
  for (let y = b.y + 12; y < b.y + b.h - 10; y += 17) {
    rect(b.x - 2, y, 4, 9, '#35596a');
    rect(b.x + b.w - 2, y, 4, 9, '#35596a');
  }
  if (b.high) {
    rect(b.x + 18, b.y + 17, b.w - 35, b.h - 34, '#466a78');
    for (let y = b.y + 20; y < b.y + b.h - 18; y += 10) {
      for (let x = b.x + 21; x < b.x + b.w - 20; x += 13) rect(x, y, 8, 5, '#8db4bb');
    }
    rect(b.x + 17, b.y + 16, 4, b.h - 32, '#c5c7b2');
  } else {
    rect(b.x + 13, b.y + 16, 20, 15, '#d0d2ba');
    for (let y = 0; y < 4; y++) rect(b.x + 16, b.y + 18 + y * 3, 14, 1, '#80908b');
    rect(b.x + b.w - 24, b.y + b.h - 26, 12, 15, '#e2c7a0');
  }
}
function palm(x, y) {
  C.save();
  C.translate(x, y);
  C.scale(1, 0.7);
  circle(12, 14, 18, '#263e3025');
  C.restore();
  line(x + 4, y + 9, x, y - 7, '#a77c4b', 5);
  for (let i = 0; i < 7; i++) {
    const a = i * Math.PI * 2 / 7;
    C.fillStyle = i % 2 ? '#3e916a' : '#28785e';
    C.beginPath();
    C.moveTo(x, y - 8);
    C.quadraticCurveTo(x + Math.cos(a + 0.4) * 17, y - 8 + Math.sin(a + 0.4) * 17, x + Math.cos(a) * 29, y - 8 + Math.sin(a) * 21);
    C.quadraticCurveTo(x + Math.cos(a - 0.4) * 13, y - 8 + Math.sin(a - 0.4) * 13, x, y - 8);
    C.fill();
  }
  circle(x, y - 8, 4, '#b2bb64');
}
function drawCity(g) {
  rect(0, 0, 3000, 2400, '#d6c59e');
  rect(2360, 0, 640, 2400, '#63bbc3');
  rect(0, 2080, 3000, 320, '#63bbc3');
  rect(2300, 0, 75, 1450, '#ead49a');
  rect(2345, 0, 15, 1450, '#f6e7b8');
  for (let x = 2390; x < 3000; x += 63) {
    for (let y = 20; y < 2400; y += 75) {
      line(x, y, x + 29, y - 2, '#a9d9d7', 2);
      line(x + 15, y + 37, x + 40, y + 35, '#7dcbd0', 1);
    }
  }
  for (const x of roadsX) {
    rect(x - 60, 55, 120, 2025, '#e4d5b8');
    rect(x - 44, 55, 88, 2025, '#b6aca0');
    rect(x - 40, 55, 80, 2025, '#757c7a');
    line(x - 34, 55, x - 34, 2080, '#c9c8b5');
    line(x + 34, 55, x + 34, 2080, '#c9c8b5');
  }
  for (const y of roadsY) {
    rect(55, y - 60, 2285, 120, '#e4d5b8');
    rect(55, y - 44, 2285, 88, '#b6aca0');
    rect(55, y - 40, 2285, 80, '#757c7a');
    line(55, y - 34, 2340, y - 34, '#c9c8b5');
    line(55, y + 34, 2340, y + 34, '#c9c8b5');
  }
  C.setLineDash([18, 17]);
  for (const x of roadsX) line(x, 55, x, 2050, '#f5d592', 2);
  for (const y of roadsY) line(55, y, 2325, y, '#f5d592', 2);
  C.setLineDash([]);
  for (const x of roadsX) {
    for (const y of roadsY) {
      rect(x - 41, y - 41, 82, 82, '#757c7a');
      for (let j = -30; j <= 28; j += 10) {
        rect(x + j, y - 54, 5, 11, '#eee8d2');
        rect(x + j, y + 44, 5, 11, '#eee8d2');
        rect(x - 54, y + j, 11, 5, '#eee8d2');
        rect(x + 44, y + j, 11, 5, '#eee8d2');
      }
      rect(x - 62, y - 62, 8, 5, '#3b5655');
      circle(x - 58, y - 60, 2, Math.floor(g.time / 7) % 2 ? '#f4b374' : '#8ddbb3');
      rect(x + 54, y + 57, 8, 5, '#3b5655');
    }
  }
  // Beach boardwalk, cabanas, and the long timber fingers of the marina.
  rect(2295, 80, 11, 1320, '#bd9b71');
  for (let y = 100; y < 1350; y += 95) {
    circle(2334, y, 15, '#fff2ce');
    C.fillStyle = '#e88c72';
    C.beginPath();
    C.arc(2334, y, 15, 0, Math.PI);
    C.fill();
    rect(2312, y + 25, 28, 7, '#c69c65');
  }
  rect(2330, 1420, 50, 650, '#c8b28a');
  for (let y = 1470; y < 2030; y += 170) {
    rect(2370, y + 8, 260, 24, '#327f8430');
    rect(2360, y, 265, 20, '#b59569');
    for (let x = 2365; x < 2620; x += 13) line(x, y, x, y + 20, '#8c785a');
    for (let x = 2380; x < 2620; x += 60) circle(x, y, 4, '#665f4c');
  }
  for (let i = 0; i < 12; i++) {
    const x = 1730 + i % 4 * 55;
    const y = 1720 + Math.floor(i / 4) * 66;
    rect(x + 6, y + 7, 43, 54, '#38595630');
    rect(x, y, 43, 54, ['#b26752', '#578f99', '#c8a45f'][i % 3]);
    for (let j = 6; j < 43; j += 8) line(x + j, y + 3, x + j, y + 51, '#ffffff24', 2);
  }
  for (const prop of props) {
    if (prop.type === 'park') {
      rect(prop.x - 88, prop.y - 88, 180, 180, '#8cae70');
      line(prop.x - 80, prop.y, prop.x + 80, prop.y, '#d4c398', 13);
      line(prop.x, prop.y - 80, prop.x, prop.y + 80, '#d4c398', 13);
      circle(prop.x, prop.y, 24, '#d8d3ab');
      circle(prop.x, prop.y, 18, '#6cbbc0');
      for (let i = 0; i < 4; i++) palm(prop.x + (i % 2 ? 55 : -55), prop.y + (i < 2 ? -55 : 55));
    }
  }
  for (const b of buildings) building(b);
  for (const s of shops) {
    building({ x: s.x - 48, y: s.y - 37, w: 96, h: 74, color: s.color, roof: '#f1d8ac', high: false });
    rect(s.x - 48, s.y + 21, 96, 14, s.color);
    for (let i = 0; i < 8; i++) rect(s.x - 48 + i * 12, s.y + 21, 6, 14, '#fff2d3');
    rect(s.x - 34, s.y + 35, 24, 6, '#355c68');
    rect(s.x + 10, s.y + 35, 24, 6, '#355c68');
  }
  for (const prop of props) {
    if (prop.type === 'palm') palm(prop.x, prop.y);
    if (prop.type === 'lamp') {
      line(prop.x + 1, prop.y + 9, prop.x + 9, prop.y + 17, '#29464225', 4);
      circle(prop.x, prop.y, 3, '#576a65');
      line(prop.x, prop.y, prop.x + 6, prop.y - 8, '#5f746f', 2);
      rect(prop.x + 2, prop.y - 12, 10, 4, '#ecdfb8');
    }
    if (prop.type === 'bench') {
      rect(prop.x, prop.y, 6, 17, '#977d56');
      line(prop.x + 2, prop.y + 1, prop.x + 2, prop.y + 16, '#dfb77b');
      rect(prop.x + 10, prop.y + 5, 6, 7, '#5b8b7d');
    }
  }
  for (const ramp of g.ramps) {
    rect(ramp.x - 16, ramp.y - 22, 32, 44, '#998b70');
    for (let y = -20; y < 20; y += 8) line(ramp.x - 13, ramp.y + y, ramp.x + 13, ramp.y + y, '#f3ce69', 3);
  }
}
export function drawCar(car, g) {
  const spec = types[car.type];
  C.save();
  C.translate(car.x, car.y);
  C.rotate(car.angle);
  if (car === g.player.car && g.jump > 0) C.scale(1.15, 1.15);
  const l = spec.length;
  const w = spec.width;
  rect(-l / 2 + 6, -w / 2 + 7, l, w, '#193d4138');
  if (car.type === 'boat') {
    C.fillStyle = '#d3f4e180';
    C.beginPath();
    C.moveTo(-l / 2, 0);
    C.lineTo(-l / 2 - 55, -20);
    C.lineTo(-l / 2 - 45, 20);
    C.fill();
    C.fillStyle = car.color;
    C.beginPath();
    C.moveTo(l / 2, 0);
    C.lineTo(l / 2 - 14, -w / 2);
    C.lineTo(-l / 2, -w / 2);
    C.lineTo(-l / 2, w / 2);
    C.lineTo(l / 2 - 14, w / 2);
    C.closePath();
    C.fill();
    rect(-12, -10, 22, 20, '#417f92');
    rect(-23, -9, 9, 18, '#d4ba91');
    rect(12, -7, 7, 14, '#f9dfaa');
  } else if (car.type === 'motorcycle') {
    rect(-16, -4, 32, 8, '#263e43');
    rect(-8, -6, 18, 12, car.color);
    rect(8, -10, 3, 20, '#647a7b');
    circle(-3, 0, 6, '#304c58');
  } else {
    rect(-l / 2 + 6, -w / 2 - 3, 9, 5, '#263b3f');
    rect(-l / 2 + 6, w / 2 - 2, 9, 5, '#263b3f');
    rect(l / 2 - 14, -w / 2 - 3, 9, 5, '#263b3f');
    rect(l / 2 - 14, w / 2 - 2, 9, 5, '#263b3f');
    C.fillStyle = car.color;
    C.beginPath();
    C.roundRect(-l / 2, -w / 2, l, w, 5);
    C.fill();
    rect(-l / 2 + 3, -w / 2 + 3, l - 6, 2, '#ffffff60');
    rect(-9, -w / 2 + 3, 21, w - 6, '#254e61');
    rect(-5, -w / 2 + 4, 11, w - 8, car.type === 'police' ? '#233c48' : car.color);
    rect(8, -w / 2 + 4, 3, w - 8, '#a6d1d0');
    rect(l / 2 - 4, -w / 2 + 3, 3, 5, '#fff4c8');
    rect(l / 2 - 4, w / 2 - 8, 3, 5, '#fff4c8');
    rect(-l / 2, -w / 2 + 3, 3, 5, '#e86955');
    rect(-l / 2, w / 2 - 8, 3, 5, '#e86955');
    if (car.type === 'pickup') rect(-l / 2 + 4, -w / 2 + 3, 13, w - 6, '#695a4b');
    if (car.type === 'taxi') rect(-2, -5, 8, 10, '#fff0af');
    if (car.type === 'police') {
      rect(-2, -10, 5, 10, '#ef675c');
      rect(-2, 0, 5, 10, '#66b9df');
      if (g.time % 0.5 < 0.25 || g.staged) {
        circle(0, -8, 8, '#f36f6530');
        circle(0, 8, 8, '#66c5f630');
      }
    }
  }
  C.restore();
}
function person(p, player = false, cop = false) {
  C.save();
  C.translate(p.x, p.y);
  C.rotate(p.angle || 0);
  C.scale(p.down ? 1.4 : 1, 1);
  circle(4, 5, 8, '#153f4438');
  rect(-6, -7, 11, 14, cop ? '#355b77' : player ? '#f4d596' : p.color || '#964e4f');
  rect(-10, -5, 5, 4, '#2f4d53');
  rect(-10, 2, 5, 4, '#2f4d53');
  rect(3, -9, 6, 4, player ? '#c28b65' : p.skin || '#c49169');
  rect(4, 5, 6, 4, player ? '#c28b65' : p.skin || '#c49169');
  circle(1, 0, 5, p.skin || '#c49169');
  C.fillStyle = player ? '#463c39' : cop ? '#26465c' : '#4d4d43';
  C.beginPath();
  C.arc(0, 0, 5, Math.PI / 2, Math.PI * 1.5);
  C.fill();
  if (player || cop) rect(9, -8, 12, 3, '#233e47');
  C.restore();
}
function marker(x, y, color, letter) {
  circle(x, y, 26, color + '30');
  C.strokeStyle = color;
  C.lineWidth = 2;
  C.beginPath();
  C.arc(x, y, 21, 0, Math.PI * 2);
  C.stroke();
  C.font = 'bold 19px sans-serif';
  C.textAlign = 'center';
  C.fillStyle = color;
  C.fillText(letter, x, y + 7);
}
function safeLabel(g, x, y, text, color = '#f8efcf') {
  const sx = x - g.camera.x + 640;
  const sy = y - g.camera.y + 360;
  C.font = 'bold 12px sans-serif';
  const w = C.measureText(text).width + 22;
  if (sx - w / 2 < 25 || sx + w / 2 > 1255 || sy < 116 || sy > 606) return;
  if (sx - w / 2 < 270 && sy > 435) return;
  if (sx + w / 2 > 950 && sy < 180) return;
  if (g.dialogue && sy > 443) return;
  rect(x - w / 2, y - 15, w, 24, '#173d44eb');
  C.textAlign = 'center';
  C.fillStyle = color;
  C.fillText(text, x, y + 1);
}
export function render(g) {
  C.clearRect(0, 0, 1280, 720);
  C.save();
  C.translate(640 - g.camera.x + (g.shake ? Math.sin(g.time * 80) * g.shake : 0), 360 - g.camera.y);
  drawCity(g);
  for (const skid of g.skids) {
    C.save();
    C.translate(skid.x, skid.y);
    C.rotate(skid.angle);
    line(-13, -9, 13, -9, '#34434165', 3);
    line(-13, 9, 13, 9, '#34434165', 3);
    C.restore();
  }
  for (const pack of g.packages) if (!pack.taken) {
    rect(pack.x - 7, pack.y - 7, 14, 14, '#d9a24f');
    rect(pack.x - 1, pack.y - 7, 3, 14, '#fff0be');
    circle(pack.x, pack.y, 13, '#ffdd8130');
  }
  for (const pickup of g.pickups) if (!pickup.taken) {
    circle(pickup.x, pickup.y, 11, pickup.type === 'health' ? '#f3eed2' : '#e4bd70');
    rect(pickup.x - 6, pickup.y - 2, 12, 4, '#b46a5f');
    if (pickup.type === 'health') rect(pickup.x - 2, pickup.y - 6, 4, 12, '#b46a5f');
  }
  const target = g.raceTarget || g.fare || missionTarget(g);
  if (target?.x !== undefined) marker(target.x, target.y, '#ffd377', '◇');
  if (!g.mission && g.completed < 8) marker(150, 510, '#ef9fa7', '!');
  for (const car of g.cars) drawCar(car, g);
  for (const ped of g.peds) person(ped);
  for (const cop of g.officers) if (cop.health > 0) person(cop, false, true);
  for (const enemy of g.enemies) if (enemy.health > 0) person(enemy);
  if (!g.player.car) person(g.player, true);
  else {
    C.strokeStyle = '#ffe9a0';
    C.lineWidth = 2;
    C.beginPath();
    C.arc(g.player.x, g.player.y, 33, 0.2, 1.4);
    C.stroke();
  }
  for (const bullet of g.bullets) line(bullet.x, bullet.y, bullet.x - bullet.vx * 0.02, bullet.y - bullet.vy * 0.02, '#fff2bc', 2);
  for (const particle of g.particles) {
    C.globalAlpha = Math.min(1, particle.life);
    circle(particle.x, particle.y, particle.size, particle.color);
  }
  C.globalAlpha = 1;
  if (g.wanted >= 3) {
    const h = g.heli;
    C.fillStyle = '#fff2bb24';
    C.beginPath();
    C.moveTo(h.x, h.y);
    C.lineTo(g.player.x - 85, g.player.y + 65);
    C.quadraticCurveTo(g.player.x + 30, g.player.y + 115, g.player.x + 80, g.player.y - 20);
    C.closePath();
    C.fill();
    circle(g.player.x, g.player.y, 70, '#fff3b219');
    C.save();
    C.translate(h.x, h.y);
    C.rotate(-0.3);
    rect(-6, -17, 12, 75, '#253e45');
    rect(-29, 37, 58, 6, '#344c53');
    C.fillStyle = '#344c53';
    C.beginPath();
    C.ellipse(0, -4, 19, 34, 0, 0, Math.PI * 2);
    C.fill();
    rect(-13, -23, 26, 14, '#77aeb8');
    rect(-27, -19, 3, 45, '#2b454b');
    rect(24, -19, 3, 45, '#2b454b');
    C.rotate(g.staged ? 0.6 : g.time * 23);
    rect(-75, -3, 150, 6, '#304f57a0');
    rect(-3, -75, 6, 150, '#304f57a0');
    circle(0, 0, 7, '#d2d2b4');
    C.restore();
  }
  for (const s of shops) safeLabel(g, s.x, s.y - 50, s.name);
  if (g.staged === 'street') {
    safeLabel(g, 1750, 360, 'SOLANA SOCIAL / MARKET');
    safeLabel(g, 2070, 655, 'CASA LIMA · CAFE');
  }
  if (g.staged === 'drive') safeLabel(g, 2500, 1450, 'PORT MERIDIAN / SLIP 04');
  C.restore();
  const night = g.staged ? 0 : Math.max(0, Math.cos(g.clock / 1440 * Math.PI * 2)) * 0.54;
  rect(0, 0, 1280, 720, `rgba(15,30,63,${night})`);
  if (g.rain && !g.staged) {
    for (let i = 0; i < 110; i++) {
      const x = (i * 127 + g.time * 110) % 1280;
      const y = (i * 83 + g.time * 490) % 720;
      line(x, y, x - 7, y + 19, '#bde0df65');
    }
  }
  drawHUD(C, g);
}
