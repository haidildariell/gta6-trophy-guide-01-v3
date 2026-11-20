// Leonida Legend v3 — entry point for gta6-trophy-guide-01 (Node 22, standard library only).
// The guide itself is the static app in ./app (open app/index.html in a browser, fully offline).
// This program hands the entry in: it copies app/ and screenshots/ into the output directory
// (MAKEFUN_OUTPUT_DIR, default /output) and writes dossier.json there with the vendored
// make.fun library, using the exact caps the starter prescribes. vendor/makefun-frontend.ts
// is the kit's own copy and stays byte-identical — the scorer compares against it.
// Local check: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
