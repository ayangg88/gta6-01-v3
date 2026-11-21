[![make.fun bounty](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![make.fun leaderboard rank](https://make.fun/badge/gta6-01/ayangg88/gta6-01-v3/rank.svg)](https://make.fun/bounty/gta6-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![make.fun reward](https://make.fun/badge/gta6-01/ayangg88/gta6-01-v3/reward.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)

# MERIDIAN HEAT

Port Meridian has another job for Rae Delgado. A former getaway driver pulled back into the Harbor Circle's orbit, Rae takes on eight story contracts across a fictional waterfront city. This browser game presents its open world from a 2D overhead view: walk the streets, take a passing car, or make an escape by motorcycle or boat.

Traffic and pedestrians share the city with you, and trouble draws an escalating response. The wanted meter runs from zero to five stars, bringing officers on foot, pursuing cruisers, roadblocks, a helicopter, and eventually armored vans. Break the police's line of sight and stay hidden to work those stars back down.

NPC conversations introduce jobs ranging from stolen wheels and waterfront deliveries to shootouts and a final vault escape. Fight with a pistol, shotgun, or SMG; Palm Arms sells equipment as your cash and reputation grow. Between contracts, rob stores, carry taxi passengers, repair and store vehicles at the garage, and climb the respect ranks. There are also 20 hidden packages, stunt ramps, and a timed coastal checkpoint race to find time for.

The HUD tracks objectives, health, armor, money, and heat alongside a minimap. Changing daylight and passing rain give the streets a different mood, while WebAudio synthesizes effects and three selectable radio stations: Copper FM, Tidal Soul, and Night Current. Three localStorage save slots keep story progress and selected possessions in the same browser; they are not a complete snapshot of the current chase or location.

## Run-it

Use a recent Node.js release with native TypeScript support. From the repository root, run the command documented in `serve.ts`:

```sh
node serve.ts
```

Open **http://localhost:8080** in your browser. The server serves `game/` directly and binds to `127.0.0.1`; there is no dependency installation or build step.

Press **Enter** to begin, then visit the pink phone marker and press **E** for the first contract.

| Input | Action |
| --- | --- |
| WASD / arrow keys | Move on foot or drive |
| Shift | Sprint on foot |
| Mouse / left click | Aim / fire on foot |
| E | Enter or leave a vehicle, interact, close a shop |
| Space | Handbrake |
| 1 / 2 / 3 | Select an owned weapon during play |
| T | Start a fare while in a taxi |
| G | Start the coastal checkpoint race while in a vehicle |
| R / M | Change radio station / toggle mute |
| Enter | Advance dialogue or dismiss a result screen |
| Esc | Pause or resume |

While paused, use **1 / 2 / 3** to choose a save slot, **F5** to save, and **F9** to load. On the title screen, **1 / 2 / 3** continues an existing slot. Contracts and hidden-package pickups also save automatically. Browser storage must be available for saves to persist.

This entry was entered on [make.fun](https://make.fun/?ref=ye9vf8mj&utm_source=github&utm_medium=readme&utm_campaign=gta6-01).
