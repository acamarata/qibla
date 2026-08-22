/**
 * Qibla direction utilities. Pure math, zero external dependencies.
 *
 * Computes the initial bearing (forward azimuth) from any point on Earth to
 * the Ka'bah using the spherical law of cosines. Includes compass direction
 * lookup, great-circle interpolation, and haversine distance.
 *
 * Ka'bah coordinates sourced from verified GPS data.
 *
 * SPORT: packages.md — @acamarata/qibla row
 *
 * @module
 */

export * from "./types.js";

import {
  KAABA_LAT,
  KAABA_LNG,
  EARTH_RADIUS_KM,
  COMPASS_ABBR,
  COMPASS_NAMES,
  type CompassAbbr,
  type CompassName,
} from "./types.js";

const DEG = Math.PI / 180;

/**
 * Qibla bearing in degrees clockwise from true north.
 *
 * Uses the forward azimuth formula from spherical trigonometry.
 * Result range: [0, 360).
 *
 * @param lat - Observer latitude in decimal degrees (-90 to 90).
 * @param lng - Observer longitude in decimal degrees (-180 to 180).
 * @returns Bearing in degrees clockwise from north (0 = N, 90 = E, 180 = S, 270 = W).
 * @throws {RangeError} If latitude is outside [-90, 90] or longitude outside [-180, 180].
 *
 * @example
 * qiblaAngle(40.7128, -74.006);  // ~58.49 (New York)
 * qiblaAngle(51.5074, -0.1278);  // ~119.0 (London)
 *
 * @see {@link https://github.com/acamarata/qibla/wiki/api/qiblaAngle} Wiki API page
 */
export function qiblaAngle(lat: number, lng: number): number {
  if (lat < -90 || lat > 90) {
    throw new RangeError(`Latitude must be between -90 and 90, got ${lat}`);
  }
  if (lng < -180 || lng > 180) {
    throw new RangeError(`Longitude must be between -180 and 180, got ${lng}`);
  }
  const φ1 = lat * DEG,
    λ1 = lng * DEG;
  const φ2 = KAABA_LAT * DEG,
    λ2 = KAABA_LNG * DEG;
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  return (Math.atan2(y, x) / DEG + 360) % 360;
}

/**
 * Eight-point compass abbreviation for a bearing.
 *
 * @param bearing - Bearing in degrees (0-360).
 * @returns Two-letter compass abbreviation (N, NE, E, SE, S, SW, W, NW).
 */
export function compassDir(bearing: number): CompassAbbr {
  // Non-null assertion: index is always 0-7 (Math.round(bearing/45) % 8), which is within COMPASS_ABBR bounds.

  return COMPASS_ABBR[Math.round(bearing / 45) % 8]!;
}

/**
 * Full compass direction name for a bearing.
 *
 * @param bearing - Bearing in degrees (0-360).
 * @returns Full direction name (North, Northeast, etc.).
 */
export function compassName(bearing: number): CompassName {
  // Non-null assertion: index is always 0-7 (Math.round(bearing/45) % 8), which is within COMPASS_NAMES bounds.

  return COMPASS_NAMES[Math.round(bearing / 45) % 8]!;
}

/**
 * Great-circle waypoints from [lat, lng] to the Ka'bah.
 *
 * Uses the Slerp (spherical linear interpolation) formula. Useful for
 * drawing Qibla direction lines on maps.
 *
 * @param lat - Origin latitude in decimal degrees.
 * @param lng - Origin longitude in decimal degrees.
 * @param steps - Number of segments (default: 120, producing 121 points).
 * @returns Array of [latitude, longitude] pairs in degrees.
 * @throws {RangeError} If latitude is outside [-90, 90] or longitude outside [-180, 180].
 */
export function qiblaGreatCircle(lat: number, lng: number, steps = 120): [number, number][] {
  if (lat < -90 || lat > 90) {
    throw new RangeError(`Latitude must be between -90 and 90, got ${lat}`);
  }
  if (lng < -180 || lng > 180) {
    throw new RangeError(`Longitude must be between -180 and 180, got ${lng}`);
  }
  const φ1 = lat * DEG,
    λ1 = lng * DEG;
  const φ2 = KAABA_LAT * DEG,
    λ2 = KAABA_LNG * DEG;

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
      ),
    );

  if (d === 0) return [[lat, lng]];

  // Antipodal degeneracy. The interpolation below divides by sin(d), and for a point
  // diametrically opposite the Kaaba d is pi, where sin(d) is about 1.2e-16 rather than an
  // exact zero. The weights explode, x/y/z cancel to roughly zero, and atan2(0, 0) returns 0
  // — so seven of the 121 points came back as exactly [0, 0], the Gulf of Guinea, nowhere
  // near the route. A silent plausible coordinate is worse than a loud failure, because
  // nothing downstream can tell it apart from a real one.
  //
  // Through two antipodal points there are infinitely many great circles, so no answer is
  // uniquely correct and none is continuous from every direction: approach from the north and
  // the limiting path runs over the north pole, from the south over the south. The
  // singularity is real and cannot be defined away.
  //
  // Every such circle is a meridian pair, so the path is walked along one directly rather
  // than interpolated. Nudging the endpoint and reusing the formula below was tried and
  // rejected: it drives the weights to about 1e9, and the resulting cancellation left the
  // JavaScript and Dart ports 9 cm apart. Walking the meridian is exact, needs no epsilon,
  // and is identical in both.
  if (Math.abs(Math.sin(d)) < 1e-9) {
    const antipodal: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      // Travel f * pi radians south along this meridian, crossing the pole to come up the
      // far side. At f = 1 this lands exactly on the Kaaba, by construction.
      let φ = φ1 - (i / steps) * Math.PI;
      let λ = λ1;
      if (φ < -Math.PI / 2) {
        φ = -Math.PI - φ;
        λ = λ1 + Math.PI;
      }
      // Wrap longitude back into [-180, 180].
      const lngDeg = ((λ / DEG + 540) % 360) - 180;
      antipodal.push([φ / DEG, lngDeg]);
    }
    return antipodal;
  }

  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    points.push([Math.atan2(z, Math.sqrt(x * x + y * y)) / DEG, Math.atan2(y, x) / DEG]);
  }
  return points;
}

/**
 * Haversine distance between two coordinate pairs.
 *
 * @param lat1 - First point latitude in decimal degrees.
 * @param lng1 - First point longitude in decimal degrees.
 * @param lat2 - Second point latitude in decimal degrees.
 * @param lng2 - Second point longitude in decimal degrees.
 * @returns Distance in kilometers (spherical Earth approximation).
 */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = (lat2 - lat1) * DEG;
  const dLng = (lng2 - lng1) * DEG;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * DEG) * Math.cos(lat2 * DEG) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Opt-in anonymous telemetry ────────────────────────────────────────────────
// Off by default. Enable: ACAMARATA_TELEMETRY=1
// What is sent + how to disable: https://github.com/acamarata/telemetry/blob/main/TELEMETRY.md
import("@acamarata/telemetry")
  .then(({ track }) => track("load", { package: "@acamarata/qibla", version: "1.1.2" }))
  .catch(() => {
    // telemetry not installed or disabled — that is fine
  });
