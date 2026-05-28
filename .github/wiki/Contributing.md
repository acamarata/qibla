# Contributing

## Prerequisites

- Node.js 20 or later
- pnpm (enabled via corepack: `corepack enable`)

## Setup

```sh
git clone https://github.com/acamarata/qibla.git
cd qibla
pnpm install
```

## Development

```sh
pnpm build          # compile TypeScript
pnpm test           # build + run test suite
pnpm run typecheck  # type-check without emitting
pnpm run lint       # ESLint
pnpm run format     # Prettier format
```

## Project Structure

```
src/
  index.ts      all exports (qiblaAngle, compassDir, compassName, qiblaGreatCircle, distanceKm)
  types.ts      TypeScript types
dist/           tsup build output (gitignored)
test.mjs        ESM test suite
test-cjs.cjs    CJS test subset
```

## Ka'bah Coordinates

The Ka'bah position is defined in `src/index.ts` as constants `KAABA_LAT` and `KAABA_LNG`. These are sourced from high-precision geodetic measurements. Do not change them without a reference.

This package has a Dart counterpart (`qibla` on pub.dev). If you update the Ka'bah coordinates or the algorithm, the Dart package should receive the same update.

## Pull Requests

- One logical change per PR
- Include tests covering the new behavior
- Update `CHANGELOG.md` under `[Unreleased]`
- Do not bump the version number
