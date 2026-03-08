# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-03-08

### Added

- `qiblaAngle(lat, lng)` computes bearing to Ka'bah in degrees from north
- `compassDir(bearing)` returns 8-point compass abbreviation
- `compassName(bearing)` returns full compass direction name
- `qiblaGreatCircle(lat, lng, steps?)` generates great-circle waypoints to Ka'bah
- `distanceKm(lat1, lng1, lat2, lng2)` computes haversine distance
- `KAABA_LAT`, `KAABA_LNG`, `EARTH_RADIUS_KM` constants
- Input validation with RangeError for out-of-bounds coordinates
- Dual CJS/ESM build with full TypeScript definitions
- Comprehensive test suite (46 ESM + 14 CJS tests)
