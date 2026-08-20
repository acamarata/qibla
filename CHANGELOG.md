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
