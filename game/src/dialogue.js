export function openDialogue(g, speaker, text) {
  g.dialogue = { speaker, text, shown: 0 };
}
export function updateDialogue(g, dt, advance) {
  if (!g.dialogue) return;
  g.dialogue.shown += dt * 48;
  if (advance) {
    if (g.dialogue.shown < g.dialogue.text.length) g.dialogue.shown = g.dialogue.text.length;
    else g.dialogue = null;
  }
}
