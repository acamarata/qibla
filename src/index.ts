/**
 * Qibla direction utilities. Pure math, zero external dependencies.
 *
 * Computes the initial bearing (forward azimuth) from any point on Earth to
 * the Ka'bah using the spherical law of cosines. Includes compass direction
 * lookup, great-circle interpolation, and haversine distance.
 *
 * Ka'bah coordinates sourced from verified GPS data.
 *
 * @module
 */

/** Latitude of the Ka'bah center, Masjid al-Haram, Mecca (degrees north). */
export const KAABA_LAT = 21.422511;

/** Longitude of the Ka'bah center, Masjid al-Haram, Mecca (degrees east). */
export const KAABA_LNG = 39.82615;

/** Mean radius of the Earth in kilometers (WGS-84 volumetric mean). */
export const EARTH_RADIUS_KM = 6371;

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
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  return (Math.atan2(y, x) / DEG + 360) % 360;
}

/** Eight-point compass abbreviations. */
const COMPASS_ABBR = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

/** Eight-point compass full names. */
const COMPASS_NAMES = [
  "North",
  "Northeast",
  "East",
  "Southeast",
  "South",
  "Southwest",
  "West",
  "Northwest",
] as const;

/** Compass abbreviation type. */
export type CompassAbbr = (typeof COMPASS_ABBR)[number];

/** Compass full name type. */
export type CompassName = (typeof COMPASS_NAMES)[number];

/**
 * Eight-point compass abbreviation for a bearing.
 *
 * @param bearing - Bearing in degrees (0-360).
 * @returns Two-letter compass abbreviation (N, NE, E, SE, S, SW, W, NW).
 */
export function compassDir(bearing: number): CompassAbbr {
  return COMPASS_ABBR[Math.round(bearing / 45) % 8];
}

/**
 * Full compass direction name for a bearing.
 *
 * @param bearing - Bearing in degrees (0-360).
 * @returns Full direction name (North, Northeast, etc.).
 */
export function compassName(bearing: number): CompassName {
  return COMPASS_NAMES[Math.round(bearing / 45) % 8];
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
export function qiblaGreatCircle(
  lat: number,
  lng: number,
  steps = 120,
): [number, number][] {
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
        Math.sin((φ2 - φ1) / 2) ** 2 +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
      ),
    );

  if (d === 0) return [[lat, lng]];

  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    points.push([
      Math.atan2(z, Math.sqrt(x * x + y * y)) / DEG,
      Math.atan2(y, x) / DEG,
    ]);
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
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = (lat2 - lat1) * DEG;
  const dLng = (lng2 - lng1) * DEG;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG) * Math.cos(lat2 * DEG) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
