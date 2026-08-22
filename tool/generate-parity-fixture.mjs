/**
 * Generates the cross-language parity fixture consumed by the Dart port.
 *
 * `qibla` and `qibla-dart` are transcriptions of the same spherical trigonometry and must
 * agree exactly, not approximately. This script writes the output of THIS package across a
 * spread of locations chosen to exercise the awkward cases; `qibla-dart` asserts every value
 * in `test/parity_test.dart`.
 *
 * Usage, from the repository root:
 *
 *   pnpm build
 *   node tool/generate-parity-fixture.mjs > ../qibla-dart/test/fixtures/cross_language_golden.json
 *
 * Regenerate only when an intentional algorithm change lands in both ports. If the Dart suite
 * fails against an unchanged fixture, that is the divergence it exists to catch — fix the
 * port, do not refresh the fixture.
 */

import { qiblaAngle, compassDir, compassName, distanceKm, qiblaGreatCircle, KAABA_LAT, KAABA_LNG } from "../dist/index.mjs";

const places = [
  ["NYC", 40.7128, -74.006],
  ["London", 51.5074, -0.1278],
  ["Tokyo", 35.6762, 139.6503],
  ["Sydney", -33.8688, 151.2093],
  ["Jakarta", -6.2088, 106.8456],
  ["Cape Town", -33.9249, 18.4241],
  ["Reykjavik", 64.1466, -21.9426],
  ["Anchorage", 61.2181, -149.9003],
  ["Quito", -0.1807, -78.4678],
  ["Longyearbyen", 78.2233, 15.6469],
  ["McMurdo", -77.8419, 166.6863],
  // Antipodal and degenerate cases: the bearing is unstable or undefined near these.
  ["Kaaba itself", KAABA_LAT, KAABA_LNG],
  ["Kaaba antipode", -KAABA_LAT, KAABA_LNG - 180],
  ["North Pole", 90, 0],
  ["South Pole", -90, 0],
  ["Dateline east", 0, 180],
  ["Dateline west", 0, -180],
  ["Prime meridian", 0, 0],
  // Due-north and due-south of the Kaaba: bearing should be exactly 0 or 180.
  ["Due north of Kaaba", 50, KAABA_LNG],
  ["Due south of Kaaba", -10, KAABA_LNG],
];

const out = places.map(([name, lat, lng]) => ({
  name,
  lat,
  lng,
  angle: qiblaAngle(lat, lng),
  dir: compassDir(qiblaAngle(lat, lng)),
  compassName: compassName(qiblaAngle(lat, lng)),
  distance: distanceKm(lat, lng, KAABA_LAT, KAABA_LNG),
  // First, middle and last points of the great-circle path, which pins the interpolation.
  gc: (() => {
    const path = qiblaGreatCircle(lat, lng);
    return [path[0], path[Math.floor(path.length / 2)], path[path.length - 1]];
  })(),
  gcLength: qiblaGreatCircle(lat, lng).length,
}));

console.log(JSON.stringify({ kaabaLat: KAABA_LAT, kaabaLng: KAABA_LNG, places: out }, null, 0));
