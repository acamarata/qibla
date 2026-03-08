# qibla

[![npm version](https://img.shields.io/npm/v/qibla.svg)](https://www.npmjs.com/package/qibla)
[![CI](https://github.com/acamarata/qibla/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/qibla/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Qibla direction, great-circle path, and haversine distance. Pure math, zero dependencies.

## Installation

```bash
npm install qibla
```

## Quick Start

```typescript
import {
  qiblaAngle,
  compassDir,
  distanceKm,
  KAABA_LAT,
  KAABA_LNG,
} from "qibla";

// Bearing from New York to the Ka'bah
const bearing = qiblaAngle(40.7128, -74.006);
console.log(bearing); // ~58.48
console.log(compassDir(bearing)); // "NE"

// Distance in kilometers
const km = distanceKm(40.7128, -74.006, KAABA_LAT, KAABA_LNG);
console.log(km); // ~9,634
```

## API

### `qiblaAngle(lat, lng): number`

Computes the initial bearing (forward azimuth) from the given coordinates to the Ka'bah.

| Parameter   | Type     | Description                                     |
| ----------- | -------- | ----------------------------------------------- |
| `lat`       | `number` | Latitude in decimal degrees (-90 to 90)         |
| `lng`       | `number` | Longitude in decimal degrees (-180 to 180)      |
| **Returns** | `number` | Bearing in degrees clockwise from north (0-360) |

Throws `RangeError` if coordinates are out of bounds.

### `compassDir(bearing): CompassAbbr`

Eight-point compass abbreviation: N, NE, E, SE, S, SW, W, NW.

### `compassName(bearing): CompassName`

Full compass name: North, Northeast, East, Southeast, South, Southwest, West, Northwest.

### `qiblaGreatCircle(lat, lng, steps?): [number, number][]`

Generates waypoints along the great circle from [lat, lng] to the Ka'bah using spherical linear interpolation (Slerp). Returns `steps + 1` points (default: 121).

Useful for drawing Qibla direction lines on maps.

### `distanceKm(lat1, lng1, lat2, lng2): number`

Haversine distance between two points in kilometers (spherical Earth approximation, R = 6,371 km).

### Constants

| Name              | Value     | Description                            |
| ----------------- | --------- | -------------------------------------- |
| `KAABA_LAT`       | 21.422511 | Ka'bah center latitude (degrees north) |
| `KAABA_LNG`       | 39.826150 | Ka'bah center longitude (degrees east) |
| `EARTH_RADIUS_KM` | 6371      | WGS-84 volumetric mean radius          |

## Compatibility

Node.js 20+. Works in browsers and all major bundlers (Webpack, Vite, Rollup, esbuild). Ships as dual CJS/ESM with full TypeScript definitions.

## TypeScript

```typescript
import { qiblaAngle, CompassAbbr, CompassName } from "qibla";

const bearing: number = qiblaAngle(40.7128, -74.006);
```

## Related

- [pray-calc](https://github.com/acamarata/pray-calc) - Islamic prayer times calculator
- [nrel-spa](https://github.com/acamarata/nrel-spa) - NREL Solar Position Algorithm

## License

[MIT](LICENSE)
