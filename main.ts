// Meridian Heat ships entirely as local static files; copying preserves reproducible bytes.
import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Check the required input files before creating or changing any output.
for (const file of [
  'game/index.html',
  'screenshots/1-cover.png',
  'screenshots/2-street.png',
  'screenshots/3-mission.png',
  'screenshots/4-drive.png',
]) {
  try {
    const info = statSync(join(here, file));
    if (!info.isFile()) throw new Error('missing file check failed: expected a regular file');
    if (file.startsWith('screenshots/')) {
      if (info.size > 256 * 1024) {
        throw new Error(`too large check failed: size ${info.size} bytes exceeds the 256 KiB limit`);
      }
      const png = readFileSync(join(here, file));
      if (png.length < 24 ||
          !png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
          png.readUInt32BE(8) !== 13 || png.toString('ascii', 12, 16) !== 'IHDR') {
        throw new Error('wrong dimensions check failed: invalid PNG header; expected 1280x720');
      }
      const width = png.readUInt32BE(16);
      const height = png.readUInt32BE(20);
      if (width !== 1280 || height !== 720) {
        throw new Error(`wrong dimensions check failed: got ${width}x${height}; expected 1280x720`);
      }
    }
  } catch (error) {
    const reason = error.code === 'ENOENT' ? 'missing file check failed: file does not exist' : error.message;
    console.error(`Input validation failed for ${file}: ${reason}`);
    process.exit(1);
  }
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB of game
// files, in all, or a path under game/ over 1000 bytes: game/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
