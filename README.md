# @acamarata/qibla

[![npm version](https://img.shields.io/npm/v/%40acamarata%2Fqibla.svg)](https://www.npmjs.com/package/%40acamarata%2Fqibla)
[![CI](https://github.com/acamarata/qibla/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/qibla/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Qibla direction, great-circle path, and haversine distance. Pure math, zero dependencies.

## Installation

```bash
npm install @acamarata/qibla
```

## Quick Start

```typescript
import { qiblaAngle, compassDir, distanceKm, KAABA_LAT, KAABA_LNG } from '@acamarata/qibla';

// Bearing from New York to the Ka'bah
const bearing = qiblaAngle(40.7128, -74.006);
console.log(bearing);          // ~58.48 degrees
console.log(compassDir(bearing)); // "NE"

// Distance in kilometers
const km = distanceKm(40.7128, -74.006, KAABA_LAT, KAABA_LNG);
console.log(km); // ~9,634
```

CommonJS:

```js
const { qiblaAngle } = require('@acamarata/qibla');
```

Use `qiblaGreatCircle(lat, lng, steps?)` to generate waypoints along the great-circle path for map overlays.

## TypeScript

```typescript
import { qiblaAngle, CompassAbbr, CompassName } from '@acamarata/qibla';
```

## Documentation

Full API reference, algorithm design, and spherical trigonometry notes: [GitHub Wiki](https://github.com/acamarata/qibla/wiki)

## Related

- [pray-calc](https://github.com/acamarata/pray-calc): Islamic prayer times calculator
- [nrel-spa](https://github.com/acamarata/nrel-spa): NREL Solar Position Algorithm
- [moon-sighting](https://github.com/acamarata/moon-sighting): Lunar crescent visibility

## Acknowledgments

Ka'bah coordinates verified against published GPS surveys and cross-checked with satellite imagery. Forward azimuth formula follows standard spherical trigonometry as used in aviation and geodesy.

## License

[MIT](LICENSE)
