import { distance } from './random.js';
import { openDialogue } from './dialogue.js';
import { createCar } from './vehicles.js';
export const stories = [
  { name: 'ONE MORE TURN', npc: 'Inez Vela', briefing: 'Rae. Your old seat is waiting. Take the orange Cometline, shake the patrol and bring it to my lockup. No speeches. Just drive.', payout: 850, steps: [{ type: 'car', text: 'Borrow a set of wheels. Press E beside a vehicle.' }, { x: 520, y: 1430, text: 'Drive to Inez’s lockup in Iron Quay.' }, { type: 'hide', text: 'Lose your wanted level. Break sight and hide.' }] },
  { name: 'SMALL CHANGE', npc: 'Milo Quill', briefing: 'Sunstop launders money for the Harbor Circle. Walk in, make yourself understood, and take back what they owe us.', payout: 1200, steps: [{ x: 1120, y: 1215, text: 'Reach Sunstop. Press E at the yellow storefront.' }, { type: 'rob', text: 'Hold the store: stay near the counter for 8 seconds.' }, { x: 1050, y: 1510, text: 'Deliver the till money to Milo.' }] },
  { name: 'SALT RUN', npc: 'Suri Nadir', briefing: 'A courier is skipping town by sea. There is a Skimmer at the south slip. Catch the marked launch and collect our ledger.', payout: 1700, steps: [{ x: 2300, y: 1730, text: 'Reach the marina and board a Skimmer with E.' }, { type: 'boat', text: 'Take a boat beyond the breakwater.' }, { x: 2700, y: 1950, text: 'Intercept the courier at the offshore buoy.' }, { x: 2460, y: 1490, text: 'Return the ledger to the north slip.' }] },
  { name: 'NIGHT METER', npc: 'Oren Bell', briefing: 'Honest work, for a change. A taxi, two fares, no holes in the upholstery. Pick up the passengers marked on your map.', payout: 1400, steps: [{ type: 'taxi', text: 'Find and enter a yellow taxi.' }, { x: 1900, y: 800, text: 'Collect your first passenger on Solana.' }, { x: 750, y: 490, text: 'Drop the passenger at Crown Station.' }, { x: 1350, y: 1690, text: 'Collect the dockworker.' }, { x: 1650, y: 490, text: 'Drop the dockworker at Citrus Hills.' }] },
  { name: 'BAD INVENTORY', npc: 'Tamsin Rook', briefing: 'The Circle sold us an ambush disguised as an arms shipment. Meet me at the yard. Bring something louder than a promise.', payout: 2400, steps: [{ x: 1350, y: 1780, text: 'Meet Tamsin at the container yard.' }, { type: 'fight', text: 'Clear the ambush. Aim with mouse; fire with left click.' }, { x: 1730, y: 620, text: 'Bring the shipment back to Palm Arms.' }] },
  { name: 'GOLDEN CIRCUIT', npc: 'Nico Serrat', briefing: 'The whole coast thinks you have gone soft. Four corners. One minute. Prove that your name still belongs on the asphalt.', payout: 2800, steps: [{ type: 'car', text: 'Bring a fast car to the starting line.' }, { x: 1650, y: 1050, text: 'Checkpoint 1: Solana cross.' }, { x: 2250, y: 1050, text: 'Checkpoint 2: ocean boulevard.' }, { x: 2250, y: 450, text: 'Checkpoint 3: north coast.' }, { x: 1650, y: 450, text: 'Finish at the palms.' }] },
  { name: 'FAMILY BUSINESS', npc: 'Inez Vela', briefing: 'They have Milo at the old freight depot. You get him out, I get you a way into their vault. We bring everyone home.', payout: 3500, steps: [{ x: 750, y: 1780, text: 'Find Milo at the freight depot.' }, { type: 'fight', text: 'Stop the guards and free Milo.' }, { type: 'car', text: 'Get a getaway car for Milo.' }, { x: 450, y: 490, text: 'Deliver Milo to the safe apartment.' }] },
  { name: 'THE MERIDIAN JOB', npc: 'Rae Delgado', briefing: 'One last run. The Circle’s vault is under Crown Exchange. Take the bonds, outrun the city, and meet Inez at the water. Then we disappear.', payout: 12000, steps: [{ x: 750, y: 570, text: 'Reach Crown Exchange and breach the vault.' }, { type: 'rob', text: 'Hold the vault entrance while Inez cracks the safe.' }, { x: 2250, y: 1760, text: 'Escape to the marina with the bonds.' }, { type: 'boat', text: 'Board a boat and leave the city behind.' }, { x: 2800, y: 2180, text: 'Cross the bay. Make your own ending.' }] }
];
export function startMission(g) {
  if (g.mission || g.completed >= stories.length) return;
  if (g.respect < g.completed * 2) {
    g.toast('Earn respect: find packages, win races, or work a fare.');
    return;
  }
  g.mission = { index: g.completed, step: 0, progress: 0, spawned: false, timer: 0 };
  const story = stories[g.completed];
  openDialogue(g, story.npc, story.briefing);
  g.toast('Contract accepted: ' + story.name);
}
export function missionTarget(g) {
  if (!g.mission) return { x: 150, y: 510 };
  return stories[g.mission.index].steps[g.mission.step];
}
export function objective(g) {
  if (g.robbery) return 'STORE ALARM · Emptying till ' + Math.min(100, Math.floor(g.robbery.time / 8 * 100)) + '% · Stay close';
  if (g.race) return 'STREET CIRCUIT · checkpoint ' + (g.race.step + 1) + '/4 · ' + Math.ceil(g.race.left) + 's';
  if (g.fare) return 'TAXI FARE · Drive your passenger to the diamond marker';
  if (!g.mission) return g.completed === 8 ? 'Port Meridian is yours. Explore, race, or work the streets.' : 'Meet Inez at the pink phone marker · E to take a contract';
  return stories[g.mission.index].steps[g.mission.step].text;
}
export function updateMissions(g, dt) {
  if (!g.mission) return;
  const m = g.mission;
  const story = stories[m.index];
  const step = story.steps[m.step];
  m.timer += dt;
  let done = false;
  if (step.x !== undefined) done = distance(g.player, step) < 75;
  if (m.index === 5 && m.timer > 90) {
    g.mission = null;
    g.toast('Circuit timed out. Return to Inez to retry the contract.');
    return;
  }
  if (m.index === 2 && m.step === 2) {
    if (!m.courier) {
      m.courier = createCar(2650, 1780, 'boat', 0);
      m.courier.color = '#e6b270';
      g.cars.push(m.courier);
    }
    m.courier.x = 2640 + Math.cos(m.timer * 0.28) * 145;
    m.courier.y = 1870 + Math.sin(m.timer * 0.28) * 165;
    step.x = m.courier.x;
    step.y = m.courier.y;
    done = g.player.car?.type === 'boat' && distance(g.player, m.courier) < 90;
  }
  if (step.type === 'car') done = !!g.player.car;
  if (step.type === 'boat') done = g.player.car?.type === 'boat';
  if (step.type === 'taxi') done = g.player.car?.type === 'taxi';
  if (step.type === 'hide') done = g.wanted === 0;
  if (step.type === 'rob') {
    if (m.progress === 0) {
      g.crime(m.index === 7 ? 5 : 2);
      openDialogue(g, m.index === 7 ? 'Inez Vela' : 'Sunstop cashier', m.index === 7 ? 'Keep them outside, Rae. The lock is almost open. This city owes us a sunrise.' : 'All right! The till is open. Take the envelope. The Circle will hear about this.');
    }
    const entrance = story.steps[Math.max(0, m.step - 1)];
    if (!g.dialogue && distance(g.player, entrance) < 150) m.progress += dt;
    done = m.progress > 8;
  }
  if (step.type === 'fight') {
    if (!m.spawned) {
      m.spawned = true;
      for (let i = 0; i < 4; i++) g.enemies.push({ x: g.player.x + 90 + i * 26, y: g.player.y + (i % 2 ? 65 : -65), health: 65, cooldown: i });
      g.player.ammo[0] += 60;
      g.crime(2);
    }
    done = g.enemies.every(e => e.health <= 0);
  }
  if (done) {
    if (m.index === 0 && m.step === 0) g.crime(2);
    m.step++;
    m.progress = 0;
    m.spawned = false;
    g.audio.effect('pickup');
    if (m.step >= story.steps.length) {
      g.cash += story.payout;
      g.respect += 3;
      g.completed++;
      g.mission = null;
      g.completeScreen = { name: story.name, payout: story.payout };
      g.save();
    } else g.toast('Objective complete');
  }
}
export function updateEnemies(g, dt) {
  for (const enemy of g.enemies) {
    if (enemy.health <= 0) continue;
    enemy.cooldown -= dt;
    if (enemy.cooldown <= 0 && distance(enemy, g.player) < 450) {
      const angle = Math.atan2(g.player.y - enemy.y, g.player.x - enemy.x);
      g.bullets.push({ x: enemy.x, y: enemy.y, vx: Math.cos(angle) * 360, vy: Math.sin(angle) * 360, enemy: true, life: 1.3, damage: 9 });
      enemy.cooldown = 1.5;
    }
  }
}
