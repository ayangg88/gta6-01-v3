import { drawMinimap } from './minimap.js';
import { objective, stories } from './missions.js';
import { district } from './city.js';
import { weapons } from './weapons.js';
import { types } from './vehicles.js';
import { stations } from './audio.js';
import { rank } from './economy.js';
function panel(c, x, y, w, h, color = '#102d37ed') {
  c.fillStyle = color;
  c.fillRect(x, y, w, h);
}
function text(c, value, x, y, size = 14, color = '#fff0cc', weight = '600') {
  c.font = `${weight} ${size}px sans-serif`;
  c.textAlign = 'left';
  c.fillStyle = color;
  c.fillText(value, x, y);
}
function wrap(c, value, x, y, width, size = 17, color = '#e4e5d4') {
  c.font = `500 ${size}px sans-serif`;
  let line = '';
  for (const word of value.split(' ')) {
    if (c.measureText(line + word).width > width) {
      text(c, line, x, y, size, color, '500');
      y += size * 1.5;
      line = '';
    }
    line += word + ' ';
  }
  text(c, line, x, y, size, color, '500');
}
export function drawHUD(c, g) {
  panel(c, 0, 0, 1280, 78);
  panel(c, 0, 76, 1280, 3, '#e5b66d');
  text(c, 'MERIDIAN', 27, 34, 27, '#f1d8a2', '900');
  text(c, 'H E A T', 28, 59, 17, '#ed947b', '800');
  text(c, 'RAE DELGADO', 242, 25, 11, '#a9c4c0');
  panel(c, 242, 37, 140, 9, '#42585a');
  panel(c, 242, 37, g.player.health * 1.4, 9, '#e79275');
  panel(c, 242, 52, 140, 5, '#42585a');
  panel(c, 242, 52, g.player.armor * 1.4, 5, '#84c5d3');
  text(c, '$' + Math.floor(g.cash).toLocaleString('en-US'), 418, 37, 25, '#e9d7a2', '800');
  text(c, rank(g).toUpperCase() + ' / R ' + g.respect, 420, 58, 10, '#98bfba');
  const hour = Math.floor(g.clock / 60) % 24;
  const minute = Math.floor(g.clock % 60);
  text(c, String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0'), 674, 34, 22);
  text(c, g.rain && !g.staged ? 'PASSING RAIN' : 'PORT MERIDIAN / 29°', 674, 55, 10, '#a9c4c0');
  text(c, '★ ★ ★ ★ ★', 1020, 38, 28, '#486166');
  text(c, Array(g.wanted).fill('★').join(' '), 1020, 38, 28, '#f6cb7c');
  text(c, g.wanted ? (g.seen ? 'IN PURSUIT' : 'SEARCHING / HIDE TO LOSE HEAT') : 'OFF THE RADAR', 1022, 59, 10, g.wanted ? '#f1ac89' : '#a9c4c0');
  panel(c, 29, 98, 331, 37, '#163d42e6');
  text(c, district(g.player.x, g.player.y), 44, 122, 13, '#e7d8b3', '800');
  panel(c, 992, 98, 258, 70);
  if (g.player.car) {
    text(c, String(Math.round(Math.abs(g.player.car.speed) * 0.25)).padStart(3, '0'), 1010, 138, 35, '#f3d9a0', '800');
    text(c, 'KM/H', 1095, 135, 12, '#a6c1be');
    text(c, types[g.player.car.type].name.toUpperCase() + ' / ' + Math.ceil(g.player.car.health) + '%', 1012, 155, 10, '#a6c1be');
  } else {
    text(c, weapons[g.player.weapon].name.toUpperCase(), 1010, 125, 18);
    text(c, g.player.ammo[g.player.weapon] + ' ROUNDS / 1·2·3 SWITCH', 1010, 151, 11, '#a6c1be');
  }
  drawMinimap(c, g);
  panel(c, 0, 667, 1280, 53);
  panel(c, 0, 667, 7, 53, '#e8ba71');
  text(c, g.mission ? stories[g.mission.index].name : 'THE CITY IS OPEN', 28, 686, 10, '#e8ba71', '800');
  text(c, objective(g), 28, 708, 16, '#f7e8c5');
  if (g.player.car) text(c, stations[g.audio.station] + (g.audio.muted ? ' / MUTED' : ' ♫'), 785, 642, 11, '#153e46', '800');
  if (g.toastTime > 0) {
    c.font = '600 14px sans-serif';
    const width = Math.min(770, c.measureText(g.toastText).width + 40);
    panel(c, 640 - width / 2, 190, width, 38);
    text(c, g.toastText, 660 - width / 2, 214, 14);
  }
  if (g.dialogue) {
    const d = g.dialogue;
    panel(c, 290, 464, 845, 175, '#102d37f5');
    panel(c, 290, 464, 5, 175, '#ed947b');
    text(c, 'STORY / ' + (g.mission ? stories[g.mission.index].name : 'PORT MERIDIAN'), 315, 491, 11, '#e6b975');
    text(c, d.speaker.toUpperCase(), 315, 518, 18, '#f2d69d', '800');
    wrap(c, d.text.slice(0, Math.floor(d.shown)), 315, 547, 785, 17);
    text(c, 'ENTER / CONTINUE', 960, 624, 10, '#a9c4bf');
  }
  if (g.shop) {
    panel(c, 325, 216, 630, 335);
    text(c, g.shop === 'arms' ? 'PALM ARMS / TRADE COUNTER' : 'DELGADO / MOTOR WORKS', 356, 260, 24);
    const lines = g.shop === 'arms' ? ['1  Shotgun + shells / $600 / respect 3', '2  SMG + ammo / $1,200 / respect 9', '3  Body armor / $250', '4  Ammunition +60 / $100'] : ['1  Store & repair nearest car / free', '2  Retrieve stored vehicle / free', '3  Buy Cometline sports car / $5,000', '4  Buy Needle motorcycle / $1,900'];
    lines.forEach((line, i) => text(c, line, 356, 308 + i * 44, 17, '#bfd1c5'));
    text(c, 'E / CLOSE', 356, 528, 12);
  }
  if (g.start) {
    panel(c, 0, 0, 1280, 720, '#0a2535ba');
    panel(c, 98, 87, 1084, 554, '#102f3af5');
    panel(c, 98, 87, 7, 554, '#ed9a7e');
    text(c, 'A PORT MERIDIAN STORY', 145, 137, 13, '#9ec8c4');
    text(c, 'MERIDIAN', 140, 224, 78, '#f2d9a5', '900');
    text(c, 'H E A T', 145, 286, 48, '#e99478', '900');
    wrap(c, 'Rae Delgado left the wheel behind. Then Inez called. Eight jobs. One city. A final chance to leave the Harbor Circle in the rearview.', 147, 334, 565, 19);
    text(c, 'ENTER  /  NEW STORY', 147, 468, 22);
    text(c, '1 · 2 · 3  /  CONTINUE SAVE SLOT', 147, 504, 16, '#9dc6c0');
    text(c, 'SELECT A SLOT IN PAUSE TO KEEP YOUR STORY.', 147, 544, 11, '#9dc6c0');
    const controls = ['WASD / arrows   Move & drive', 'MOUSE / CLICK   Aim & shoot', 'E   Enter / exit / interact', 'SPACE   Handbrake', '1 / 2 / 3   Weapons', 'T   Taxi fare     G   Street race', 'R   Radio     M   Mute', 'ESC   Pause / save slots'];
    controls.forEach((v, i) => text(c, v, 805, 227 + i * 35, 15, '#d1d8c3'));
    text(c, 'ORIGINAL CITY · ORIGINAL TROUBLE', 147, 607, 12, '#e69d80');
  }
  if (g.paused) {
    panel(c, 0, 79, 1280, 588, '#102b3bbf');
    panel(c, 340, 155, 600, 440);
    text(c, 'TAKE A BREATHER', 382, 209, 30);
    text(c, 'ESC  Resume', 382, 262, 19);
    text(c, 'F5  Save slot ' + g.slot + '     F9  Load selected slot', 382, 307, 17);
    text(c, '1 / 2 / 3  Select save slot', 382, 350, 17);
    text(c, 'M  Mute audio     R  Switch station', 382, 393, 17);
    text(c, 'Caches ' + g.packages.filter(p => p.taken).length + '/20   ·   Contracts ' + g.completed + '/8', 382, 448, 19, '#e8b77a');
    text(c, 'Side work: taxi fares [T], coast circuit [G], gold stunt ramps.', 382, 493, 14, '#9ac6c1');
    text(c, 'Stay out of police sight for 10s to shed each wanted star.', 382, 530, 14, '#9ac6c1');
  }
  if (g.completeScreen || g.dead) {
    panel(c, 0, 79, 1280, 588, '#0c2b3bcc');
    panel(c, 330, 230, 620, 250);
    text(c, g.dead || 'CONTRACT COMPLETE', 370, 287, 31, '#e9bd7e', '900');
    text(c, g.dead ? 'A bad turn. A new morning.' : g.completeScreen.name, 370, 334, 23);
    text(c, g.dead ? 'Hospital fees / $200' : '+$' + g.completeScreen.payout + '   /   +3 RESPECT', 370, 377, 19, '#9bc8be');
    text(c, 'ENTER / BACK TO THE CITY', 370, 441, 15);
  }
}
