# Quick Start

Five minutes from install to Qibla direction.

## Install

```sh
npm install @acamarata/qibla
```

## Basic usage

```js
import { qiblaAngle, compassDir, compassName } from '@acamarata/qibla';

const LAT = 40.7128;  // New York
const LNG = -74.0060;

const bearing = qiblaAngle(LAT, LNG);
const abbr    = compassDir(bearing);
const name    = compassName(bearing);

console.log(`Qibla: ${bearing.toFixed(2)}° (${name}, ${abbr})`);
// Qibla: 58.49° (Northeast, NE)
```

## Distance to Mecca

```js
import { distanceKm, KAABA_LAT, KAABA_LNG } from '@acamarata/qibla';

const km = distanceKm(40.7128, -74.0060, KAABA_LAT, KAABA_LNG);
console.log(`Distance to Ka'bah: ${Math.round(km).toLocaleString()} km`);
// Distance to Ka'bah: 9,139 km
```

## Great-circle path

```js
import { qiblaGreatCircle } from '@acamarata/qibla';

// 10 waypoints along the path from New York to Mecca
const path = qiblaGreatCircle(40.7128, -74.0060, 10);

for (const [lat, lng] of path) {
  console.log(`  ${lat.toFixed(2)}, ${lng.toFixed(2)}`);
}
```

The returned array always starts at the observer's position and ends at the Ka'bah.

## Input validation

All functions throw `RangeError` on invalid coordinates:

```js
import { qiblaAngle } from '@acamarata/qibla';

try {
  qiblaAngle(200, 0); // lat out of range
} catch (err) {
  console.error(err.message); // "lat must be in range [-90, 90]"
}
```

## Next steps

- [API Reference](../API-Reference) — full function and constant documentation
- [Advanced Guide](advanced) — compass overlay, map integration, path interpolation
