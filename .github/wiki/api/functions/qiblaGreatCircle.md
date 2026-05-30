[**@acamarata/qibla v1.1.1**](../README.md)

***

[@acamarata/qibla](../README.md) / qiblaGreatCircle

# Function: qiblaGreatCircle()

> **qiblaGreatCircle**(`lat`, `lng`, `steps?`): \[`number`, `number`\][]

Defined in: [index.ts:98](https://github.com/acamarata/qibla/blob/a59756bd074a18a3c9cea4311d135cfb23a5ec7d/src/index.ts#L98)

Great-circle waypoints from [lat, lng] to the Ka'bah.

Uses the Slerp (spherical linear interpolation) formula. Useful for
drawing Qibla direction lines on maps.

## Parameters

### lat

`number`

Origin latitude in decimal degrees.

### lng

`number`

Origin longitude in decimal degrees.

### steps?

`number` = `120`

Number of segments (default: 120, producing 121 points).

## Returns

\[`number`, `number`\][]

Array of [latitude, longitude] pairs in degrees.

## Throws

If latitude is outside [-90, 90] or longitude outside [-180, 180].
