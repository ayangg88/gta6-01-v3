export const keys = new Set();
export const pressed = new Set();
export const mouse = { x: 800, y: 360, down: false };
addEventListener('keydown', event => {
  if (!keys.has(event.code)) pressed.add(event.code);
  keys.add(event.code);
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.code)) event.preventDefault();
});
addEventListener('keyup', event => keys.delete(event.code));
addEventListener('blur', () => keys.clear());
addEventListener('mousemove', event => {
  const box = document.querySelector('canvas').getBoundingClientRect();
  mouse.x = (event.clientX - box.left) * 1280 / box.width;
  mouse.y = (event.clientY - box.top) * 720 / box.height;
});
addEventListener('mousedown', () => mouse.down = true);
addEventListener('mouseup', () => mouse.down = false);
export const held = (...codes) => codes.some(code => keys.has(code));
export const tap = code => pressed.has(code);
