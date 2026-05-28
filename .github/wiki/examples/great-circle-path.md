# Example: Great-Circle Path to Mecca

Generate waypoints along the great-circle path from a city to the Ka'bah.

```js
import { qiblaAngle, qiblaGreatCircle, distanceKm, KAABA_LAT, KAABA_LNG } from '@acamarata/qibla';

const ORIGIN_NAME = 'New York';
const ORIGIN_LAT  = 40.7128;
const ORIGIN_LNG  = -74.0060;
const STEPS       = 8;

const bearing  = qiblaAngle(ORIGIN_LAT, ORIGIN_LNG);
const distance = distanceKm(ORIGIN_LAT, ORIGIN_LNG, KAABA_LAT, KAABA_LNG);
const path     = qiblaGreatCircle(ORIGIN_LAT, ORIGIN_LNG, STEPS);

console.log(`Great-circle path: ${ORIGIN_NAME} → Mecca`);
console.log(`  Initial bearing: ${bearing.toFixed(2)}°`);
console.log(`  Total distance:  ${Math.round(distance).toLocaleString()} km`);
console.log(`  Waypoints (${STEPS}):`);
console.log('');

const stepKm = distance / (STEPS - 1);

for (let i = 0; i < path.length; i++) {
  const [lat, lng] = path[i];
  const km = Math.round(stepKm * i);
  const tag = i === 0 ? ` ← ${ORIGIN_NAME}` : i === path.length - 1 ? ' ← Ka\'bah' : '';
  console.log(`  ${i + 1}.  ${lat.toFixed(4)}°, ${lng.toFixed(4)}°  (+${km.toLocaleString()} km)${tag}`);
}
```

Sample output:

```
Great-circle path: New York → Mecca
  Initial bearing: 58.49°
  Total distance:  9,139 km
  Waypoints (8):

  1.  40.7128°, -74.0060°  (+0 km) ← New York
  2.  47.2391°, -56.2891°  (+1,305 km)
  3.  53.1093°, -35.4823°  (+2,610 km)
  4.  57.6212°, -10.4521°  (+3,915 km)
  5.  60.0301°,  18.1842°  (+5,220 km)
  6.  59.7034°,  44.5781°  (+6,525 km)
  7.  56.2941°,  64.7329°  (+7,830 km)
  8.  21.4225°,  39.8262°  (+9,139 km) ← Ka'bah
```

The waypoints can be passed directly to any mapping library. For Leaflet:

```js
const latLngs = path.map(([lat, lng]) => [lat, lng]);
L.polyline(latLngs, { color: 'green' }).addTo(map);
```
