# @acamarata/qibla

Qibla direction, great-circle path, and haversine distance. Pure math, zero dependencies.

## Pages

- [API Reference](API-Reference) — Full function and constant reference
- [Architecture](Architecture) — Algorithm design, spherical trigonometry, implementation decisions

## What It Does

This library computes three things:

1. **Qibla bearing** — the initial compass bearing from any point on Earth to the Ka'bah in Mecca, using the forward azimuth formula from spherical trigonometry
2. **Great-circle path** — a series of waypoints along the geodesic from origin to Ka'bah, suitable for rendering on a map
3. **Haversine distance** — the surface distance between two coordinate pairs using the haversine formula

All calculations use a spherical Earth model (WGS-84 volumetric mean radius, 6,371 km). The Ka'bah coordinates (21.422511°N, 39.82615°E) are sourced from verified GPS data.

## Quick Start

```bash
npm install @acamarata/qibla
```

```typescript
import {
  qiblaAngle,
  compassDir,
  distanceKm,
  KAABA_LAT,
  KAABA_LNG,
} from "@acamarata/qibla";

const bearing = qiblaAngle(40.7128, -74.006); // New York
console.log(bearing); // ~58.48
console.log(compassDir(bearing)); // "NE"

const km = distanceKm(40.7128, -74.006, KAABA_LAT, KAABA_LNG);
console.log(km); // ~9,634
```

## Installation

```bash
npm install @acamarata/qibla
# or
pnpm add @acamarata/qibla
# or
yarn add @acamarata/qibla
```

## Related Packages

- [pray-calc](https://github.com/acamarata/pray-calc) — Islamic prayer times
- [nrel-spa](https://github.com/acamarata/nrel-spa) — NREL Solar Position Algorithm
- [moon-sighting](https://github.com/acamarata/moon-sighting) — Lunar crescent visibility

---

[API Reference](API-Reference) | [Architecture](Architecture)
