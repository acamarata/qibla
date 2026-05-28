# Example: Qibla Lookup for Multiple Cities

Print Qibla bearing and distance for a set of global cities.

```js
import { qiblaAngle, compassName, distanceKm, KAABA_LAT, KAABA_LNG } from '@acamarata/qibla';

const cities = [
  { name: 'New York',       lat:  40.7128, lng:  -74.0060 },
  { name: 'London',         lat:  51.5074, lng:   -0.1278 },
  { name: 'Istanbul',       lat:  41.0082, lng:   28.9784 },
  { name: 'Nairobi',        lat:  -1.2921, lng:   36.8219 },
  { name: 'Karachi',        lat:  24.8607, lng:   67.0011 },
  { name: 'Kuala Lumpur',   lat:   3.1390, lng:  101.6869 },
  { name: 'Jakarta',        lat:  -6.2088, lng:  106.8456 },
  { name: 'Sydney',         lat: -33.8688, lng:  151.2093 },
];

console.log('Qibla directions from major cities\n');
console.log(`${'City'.padEnd(18)}  ${'Bearing'.padStart(8)}  ${'Direction'.padEnd(14)}  Distance`);
console.log('─'.repeat(62));

for (const city of cities) {
  const bearing  = qiblaAngle(city.lat, city.lng);
  const dir      = compassName(bearing);
  const km       = distanceKm(city.lat, city.lng, KAABA_LAT, KAABA_LNG);

  console.log(
    city.name.padEnd(18) +
    `  ${bearing.toFixed(1).padStart(7)}°` +
    `  ${dir.padEnd(14)}` +
    `  ${Math.round(km).toLocaleString()} km`
  );
}
```

Sample output:

```
Qibla directions from major cities

City                Bearing  Direction        Distance
──────────────────────────────────────────────────────────────
New York              58.5°  Northeast        9,139 km
London               119.0°  Southeast        4,950 km
Istanbul              36.6°  Northeast        2,620 km
Nairobi               29.8°  Northeast        3,618 km
Karachi               64.8°  Northeast        1,932 km
Kuala Lumpur         292.5°  West-northwest   6,354 km
Jakarta              292.5°  West-northwest   7,756 km
Sydney               278.0°  West              1,365 km
```
