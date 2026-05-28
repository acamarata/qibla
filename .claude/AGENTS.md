# qibla — PRI (Per-Repo Instructions)

**Cascade:** GCI → ASI → PPI (`/Volumes/X9/Sites/acamarata/.claude/CLAUDE.md`) → **PRI (this file)**

## Repo Overview

**Package:** `@acamarata/qibla@1.0.0`
**Registry:** npm (public, `access: public`)
**Scoped name:** `@acamarata/qibla` — note the `@acamarata/` scope prefix in all install/publish commands
**Language:** TypeScript
**Runtime deps:** zero — pure math, no external dependencies
**Build:** tsup, dual CJS (`index.cjs`) + ESM (`index.mjs`) output
**Dart counterpart:** `qibla@1.0.0` on pub.dev (publisher: ariccamarata.com), repo: `qibla-dart`

## What It Does

Qibla direction, great-circle path, and haversine distance toward the Ka'bah (Mecca).

Exported functions:
- `qiblaAngle(lat, lng)` — initial bearing to Ka'bah, clockwise from north (0-360)
- `compassDir(bearing)` — 8-point compass abbreviation (N, NE, E, SE, S, SW, W, NW)
- `compassName(bearing)` — full compass name (North, Northeast, etc.)
- `qiblaGreatCircle(lat, lng, steps?)` — Slerp waypoints along the great-circle path to Ka'bah
- `distanceKm(lat1, lng1, lat2, lng2)` — haversine distance in km

Exported constants:
- `KAABA_LAT = 21.422511`
- `KAABA_LNG = 39.826150`
- `EARTH_RADIUS_KM = 6371`

## Project Rules (inherits from acamarata PPI)

This repo follows the full acamarata npm package standard. Key points:

- pnpm only — `pnpm install`, `pnpm test`, `pnpm run build`
- No AI attribution anywhere in tracked files
- Writing quality: no em dashes as connectors, no AI tells, academic technical tone
- Publishing requires explicit user approval
- Version bumps require CHANGELOG.md update first

## Dart Counterpart Relationship

The JS and Dart packages implement the same algorithm. Keep them in sync on:
- Ka'bah coordinate constants (KAABA_LAT / KAABA_LNG)
- Algorithm correctness (forward azimuth formula, haversine, Slerp)
- API surface parity (functions and constants match across both)

When updating the JS package in a way that affects algorithm or constants, note whether the Dart package (`qibla-dart`) needs the same fix.

## npm Publish Command

```bash
npm publish --access public
```

The `@acamarata/` scope requires `--access public` on first publish. Already set in `publishConfig` but include it explicitly to avoid accidental private publish.

