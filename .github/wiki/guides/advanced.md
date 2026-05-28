# Advanced Usage

## Compass overlay integration

The eight-point compass abbreviation is suited for UI labels. Map the bearing to a rotation for a needle overlay:

```js
import { qiblaAngle } from '@acamarata/qibla';

const bearing = qiblaAngle(lat, lng);

// CSS rotation for a compass needle pointing north by default
const rotation = `rotate(${bearing}deg)`;
needle.style.transform = rotation;
```

The bearing is clockwise from true north, matching CSS `rotate()` semantics directly.

## Dense great-circle paths

Pass a higher step count for smoother polylines on a map:

```js
import { qiblaGreatCircle, KAABA_LAT, KAABA_LNG } from '@acamarata/qibla';

const observer = [40.7128, -74.0060]; // New York
const steps    = 100;

const path = qiblaGreatCircle(observer[0], observer[1], steps);

// Flatten for Leaflet / Google Maps / Mapbox polyline
const latLngs = path.map(([lat, lng]) => ({ lat, lng }));
```

The default step count is 20. Steps above 200 are rarely useful for display.

## Magnetic vs true north

`qiblaAngle` returns bearing relative to **true north**. For a physical compass, apply the local magnetic declination:

```js
import { qiblaAngle } from '@acamarata/qibla';

const trueBearing = qiblaAngle(lat, lng);

// Magnetic declination for New York (west = negative)
const declination = -13.2;

const magneticBearing = (trueBearing - declination + 360) % 360;
console.log(`Magnetic: ${magneticBearing.toFixed(1)}°`);
```

Magnetic declination varies by location and year. Use a current value from NOAA's World Magnetic Model or a service like `@mapbox/geodeticsurvey`.

## Polar and edge cases

Observers at the poles have undefined bearing — the great circle is ambiguous. `qiblaAngle` returns `NaN` for latitudes exactly at ±90. Check before using:

```js
const bearing = qiblaAngle(90, 0); // NaN — north pole
if (!isFinite(bearing)) {
  console.log('Bearing undefined at this location.');
}
```

Observers very close to Mecca (within ~1 km) may get erratic bearings due to floating-point precision near the target. No special handling is needed in practice.

## Batch calculation for multiple cities

```js
import { qiblaAngle, compassDir, distanceKm, KAABA_LAT, KAABA_LNG } from '@acamarata/qibla';

const cities = [
  { name: 'New York',     lat:  40.7128, lng:  -74.0060 },
  { name: 'London',       lat:  51.5074, lng:   -0.1278 },
  { name: 'Istanbul',     lat:  41.0082, lng:   28.9784 },
  { name: 'Kuala Lumpur', lat:   3.1390, lng:  101.6869 },
  { name: 'Sydney',       lat: -33.8688, lng:  151.2093 },
];

console.log('City'.padEnd(16) + 'Bearing  Dir   Distance');
console.log('-'.repeat(46));

for (const c of cities) {
  const b   = qiblaAngle(c.lat, c.lng);
  const dir = compassDir(b);
  const km  = distanceKm(c.lat, c.lng, KAABA_LAT, KAABA_LNG);
  console.log(
    c.name.padEnd(16) +
    `${b.toFixed(1).padStart(6)}°  ${dir.padEnd(4)}  ${Math.round(km).toLocaleString()} km`
  );
}
```

## Related pages

- [API Reference](../API-Reference) — parameter types, return values, thrown errors
- [Architecture](../Architecture) — algorithm details, coordinate system, Ka'bah coordinates
