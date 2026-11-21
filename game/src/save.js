const key = slot => 'meridian-heat-slot-' + slot;
export function saveGame(g, slot = g.slot) {
  try {
    localStorage.setItem(key(slot), JSON.stringify({ cash: g.cash, respect: g.respect, completed: g.completed, owned: g.player.owned, ammo: g.player.ammo, packages: g.packages.map(p => p.taken), storedCar: g.storedCar }));
    g.toast('Saved to slot ' + slot);
  } catch { g.toast('Save unavailable in this browser.'); }
}
export function loadGame(g, slot) {
  try {
    const data = JSON.parse(localStorage.getItem(key(slot)) || 'null');
    if (!data) return false;
    g.cash = data.cash;
    g.respect = data.respect;
    g.completed = data.completed;
    g.player.owned = data.owned;
    g.player.ammo = data.ammo;
    g.storedCar = data.storedCar;
    data.packages.forEach((taken, i) => g.packages[i].taken = taken);
    g.slot = slot;
    return true;
  } catch { return false; }
}
