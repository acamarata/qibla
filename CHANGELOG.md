## 1.3.0 — 2026-08-22

### Fixed
- **`qiblaGreatCircle` no longer emits collapsed `[0, 0]` points for a location diametrically opposite the Kaaba.** The interpolation divides by `sin(d)`, and at the antipode `d` is pi, where `sin(d)` is about 1.2e-16 rather than an exact zero. The weights exploded, the Cartesian components cancelled, and `atan2(0, 0)` returned 0 — so **seven of the 121 points came back as exactly `[0, 0]`**, the Gulf of Guinea, nowhere near the route. A silent, plausible-looking coordinate that nothing downstream could distinguish from a real one.

  Antipodal points are joined by meridians, so the path is now walked along one directly instead of interpolated. It is exact at both endpoints, evenly spaced, and needs no epsilon.

  Found by the new cross-language parity fixture, which is exactly the class of defect it exists to catch.

### Added
- `tool/generate-parity-fixture.mjs`, which writes the fixture asserted by `qibla_dart`'s `test/parity_test.dart`. Twenty locations including both poles, both sides of the dateline, the Kaaba, its antipode, and points due north and due south of it. The two ports are now bit-identical on all of them.
- Regression tests for the antipodal path: no collapsed points, every point finite and in range, exact endpoints, and no jump between consecutive points.

### Notes
Minor rather than patch: this changes the output of `qiblaGreatCircle` for antipodal input. Nothing sane can depend on the previous `[0, 0]` values, but a version number that says "behaviour moved" is worth more than one that says "nothing to see".

An earlier attempt nudged the endpoint by an epsilon and reused the interpolation. It was rejected: that drives the weights to about 1e9, and the resulting cancellation left the JavaScript and Dart ports 9 cm apart. The meridian walk has no such sensitivity.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-08-20

### Added
- Opt-in anonymous telemetry via `@acamarata/telemetry`, off by default (see TELEMETRY.md)
- Polar-circle, geographic-pole and global-sweep test coverage (37x25 grid asserting a finite in-range bearing everywhere)

### Note
- This package publishes as `@acamarata/qibla`. The unscoped `qibla` on npm is an unrelated package by a different author; do not compare versions against it.


## [1.1.2] - 2026-05-30

### Changed
- Add TSDoc comments with examples and wiki links to all exported functions
- Add non-null assertions with explanatory comments for array index access
- Formatting cleanup (inline multi-line function signatures)

## [1.1.1] - 2026-05-28

### Changed
- Flatten exports map to ADR-015 standard (import/require/types at top level)
- Add "./package.json" export condition
- Add coverage script (c8 --reporter=lcov)
- Migrate CI from pnpm/action-setup to corepack enable

## [1.0.0] - 2026-05-28

### Added
- Initial release
