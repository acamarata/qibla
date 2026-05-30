/** Latitude of the Ka'bah center, Masjid al-Haram, Mecca (degrees north). */
export const KAABA_LAT = 21.422511;

/** Longitude of the Ka'bah center, Masjid al-Haram, Mecca (degrees east). */
export const KAABA_LNG = 39.82615;

/** Mean radius of the Earth in kilometers (WGS-84 volumetric mean). */
export const EARTH_RADIUS_KM = 6371;

/** Eight-point compass abbreviations. */
export const COMPASS_ABBR = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

/** Eight-point compass full names. */
export const COMPASS_NAMES = [
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
