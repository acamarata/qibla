# Architecture

## Overview

`@acamarata/qibla` is a pure math library. No external dependencies. No I/O. All functions are synchronous and stateless.

The source is a single TypeScript file (`src/index.ts`) compiled to dual CJS/ESM output via tsup.

---

## Qibla Bearing: Forward Azimuth

`qiblaAngle` uses the forward azimuth formula from spherical trigonometry, also called the "initial bearing" on the great circle.

Given observer (φ₁, λ₁) and Ka'bah (φ₂, λ₂) in radians:

```
y = sin(λ₂ − λ₁) · cos(φ₂)
x = cos(φ₁) · sin(φ₂) − sin(φ₁) · cos(φ₂) · cos(λ₂ − λ₁)
θ = atan2(y, x)
```

`atan2` produces a result in (−π, π]. Adding 360° and taking modulo 360 converts to the [0, 360) convention, where 0° = North, 90° = East.

This gives the bearing at the observer's location, not the arrival bearing at the Ka'bah. For a short trip within a city, the difference is negligible. For a trans-oceanic path, the bearing rotates continuously along the geodesic — `qiblaGreatCircle` shows this progression.

---

## Great-Circle Path: Slerp

`qiblaGreatCircle` uses the Slerp (spherical linear interpolation) formula to generate uniformly spaced waypoints along the geodesic.

**Step 1 — Convert to 3D unit vectors**

Lat/lng are converted to 3D Cartesian unit vectors on the unit sphere:

```
x = cos(φ) · cos(λ)
y = cos(φ) · sin(λ)
z = sin(φ)
```

**Step 2 — Compute the angular distance**

The central angle d between the two points uses the formula:

```
d = 2 · asin( sqrt( sin²((φ₂−φ₁)/2) + cos(φ₁)·cos(φ₂)·sin²((λ₂−λ₁)/2) ) )
```

This is equivalent to the haversine formula. If d = 0, the observer is at the Ka'bah — return immediately.

**Step 3 — Interpolate**

For each interpolation parameter f ∈ [0, 1]:

```
A = sin((1−f)·d) / sin(d)
B = sin(f·d) / sin(d)
P = A·P₁ + B·P₂
```

where P₁ and P₂ are the 3D unit vectors. Convert the result back to lat/lng.

This is numerically stable for all separations except d = 0 (handled separately) and d = π (antipodal points, undefined great circle). For practical use — observer and Ka'bah are never antipodal — this is not a concern.

---

## Haversine Distance

`distanceKm` implements the haversine formula:

```
a = sin²(Δφ/2) + cos(φ₁) · cos(φ₂) · sin²(Δλ/2)
c = 2 · atan2(√a, √(1−a))
d = R · c
```

where R = 6,371 km (WGS-84 volumetric mean radius).

The haversine formula is numerically stable for both small and large distances, unlike the simpler spherical law of cosines which loses precision for short arcs.

---

## Compass Direction

`compassDir` and `compassName` divide the 360° circle into eight 45° sectors. The sector index is:

```
index = round(bearing / 45) mod 8
```

Rounding (not flooring) ensures each sector is centered on its cardinal/intercardinal direction: N covers 337.5–360° and 0–22.5°, NE covers 22.5–67.5°, and so on.

---

## Ka'bah Coordinates

The Ka'bah center is fixed at 21.422511°N, 39.82615°E. These coordinates come from verified GPS data and match the values used by major Islamic authority applications. The value is a constant — no runtime fetching.

---

## Build

```
src/index.ts → tsup → dist/index.cjs (CommonJS)
                     → dist/index.mjs (ESM)
                     → dist/index.d.ts (type definitions, CJS fallback)
                     → dist/index.d.mts (type definitions, ESM)
```

tsup config uses `platform: 'neutral'` — the library has no Node.js-specific API calls and works identically in browsers, Deno, Bun, and all bundlers.

---

[Home](Home) | [API Reference](API-Reference)
