# API Reference

## Functions

### `qiblaAngle(lat, lng)`

Computes the initial bearing from the given coordinates to the Ka'bah.

Uses the forward azimuth formula from spherical trigonometry:

```
θ = atan2(sin(Δλ)·cos(φ₂), cos(φ₁)·sin(φ₂) − sin(φ₁)·cos(φ₂)·cos(Δλ))
```

where φ₁, λ₁ is the observer and φ₂, λ₂ is the Ka'bah.

**Parameters:**

| Name  | Type     | Description                                                      |
| ----- | -------- | ---------------------------------------------------------------- |
| `lat` | `number` | Observer latitude in decimal degrees. Valid range: −90 to 90.    |
| `lng` | `number` | Observer longitude in decimal degrees. Valid range: −180 to 180. |

**Returns:** `number` — Bearing in degrees clockwise from true north. Range: [0, 360).

**Throws:** `RangeError` if either coordinate is out of bounds.

```typescript
import { qiblaAngle } from "@acamarata/qibla";

qiblaAngle(40.7128, -74.006); // ~58.48  (New York → Mecca)
qiblaAngle(51.5074, -0.1278); // ~119.0  (London → Mecca)
qiblaAngle(35.6762, 139.6503); // ~293.3  (Tokyo → Mecca)
```

---

### `compassDir(bearing)`

Returns the eight-point compass abbreviation for a bearing.

Maps the bearing to one of eight 45° sectors, selecting the nearest cardinal or intercardinal direction.

**Parameters:**

| Name      | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `bearing` | `number` | Bearing in degrees (0–360). |

**Returns:** `CompassAbbr` — One of: `N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`.

```typescript
import { compassDir } from "@acamarata/qibla";

compassDir(0); // "N"
compassDir(45); // "NE"
compassDir(58.5); // "NE"
compassDir(270); // "W"
```

---

### `compassName(bearing)`

Returns the full compass direction name for a bearing.

**Parameters:**

| Name      | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `bearing` | `number` | Bearing in degrees (0–360). |

**Returns:** `CompassName` — One of: `North`, `Northeast`, `East`, `Southeast`, `South`, `Southwest`, `West`, `Northwest`.

```typescript
import { compassName } from "@acamarata/qibla";

compassName(58.5); // "Northeast"
```

---

### `qiblaGreatCircle(lat, lng, steps?)`

Generates waypoints along the great-circle geodesic from the observer to the Ka'bah, using the Slerp (spherical linear interpolation) formula.

Useful for drawing the Qibla direction line on a map. Returns `steps + 1` points uniformly spaced along the geodesic.

**Parameters:**

| Name    | Type     | Default | Description                                          |
| ------- | -------- | ------- | ---------------------------------------------------- |
| `lat`   | `number` | —       | Observer latitude in decimal degrees (−90 to 90).    |
| `lng`   | `number` | —       | Observer longitude in decimal degrees (−180 to 180). |
| `steps` | `number` | `120`   | Number of segments. Result has `steps + 1` points.   |

**Returns:** `[number, number][]` — Array of `[latitude, longitude]` pairs in degrees.

**Throws:** `RangeError` if coordinates are out of bounds.

Special case: if the observer is at the Ka'bah (distance = 0), returns `[[lat, lng]]`.

```typescript
import { qiblaGreatCircle } from "@acamarata/qibla";

const path = qiblaGreatCircle(40.7128, -74.006); // 121 points
// path[0]  ≈ [40.7128, -74.006]   (New York)
// path[120] ≈ [21.42, 39.83]      (Ka'bah)
```

---

### `distanceKm(lat1, lng1, lat2, lng2)`

Haversine distance between two points in kilometers.

Uses the haversine formula with a spherical Earth (R = 6,371 km, WGS-84 volumetric mean). Accurate to within 0.5% globally.

**Parameters:**

| Name   | Type     | Description                                |
| ------ | -------- | ------------------------------------------ |
| `lat1` | `number` | First point latitude in decimal degrees.   |
| `lng1` | `number` | First point longitude in decimal degrees.  |
| `lat2` | `number` | Second point latitude in decimal degrees.  |
| `lng2` | `number` | Second point longitude in decimal degrees. |

**Returns:** `number` — Distance in kilometers.

```typescript
import { distanceKm, KAABA_LAT, KAABA_LNG } from "@acamarata/qibla";

distanceKm(40.7128, -74.006, KAABA_LAT, KAABA_LNG); // ~9,634 km
```

---

## Constants

| Constant          | Value       | Description                                      |
| ----------------- | ----------- | ------------------------------------------------ |
| `KAABA_LAT`       | `21.422511` | Ka'bah center latitude in decimal degrees north. |
| `KAABA_LNG`       | `39.82615`  | Ka'bah center longitude in decimal degrees east. |
| `EARTH_RADIUS_KM` | `6371`      | WGS-84 volumetric mean radius in kilometers.     |

```typescript
import { KAABA_LAT, KAABA_LNG, EARTH_RADIUS_KM } from "@acamarata/qibla";
```

---

## Types

### `CompassAbbr`

```typescript
type CompassAbbr = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
```

### `CompassName`

```typescript
type CompassName =
  | "North"
  | "Northeast"
  | "East"
  | "Southeast"
  | "South"
  | "Southwest"
  | "West"
  | "Northwest";
```

---

[Home](Home) | [Architecture](Architecture)
