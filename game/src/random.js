export function seeded(seed = 4817) {
  return function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
export const random = seeded();
export const choose = list => list[Math.floor(random() * list.length)];
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
export function angleDifference(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}
