[**@acamarata/qibla v1.1.1**](../README.md)

***

[@acamarata/qibla](../README.md) / qiblaAngle

# Function: qiblaAngle()

> **qiblaAngle**(`lat`, `lng`): `number`

Defined in: [index.ts:46](https://github.com/acamarata/qibla/blob/1546cd5c71a68dd73136e918b6f3f7f195fb5cc7/src/index.ts#L46)

Qibla bearing in degrees clockwise from true north.

Uses the forward azimuth formula from spherical trigonometry.
Result range: [0, 360).

## Parameters

### lat

`number`

Observer latitude in decimal degrees (-90 to 90).

### lng

`number`

Observer longitude in decimal degrees (-180 to 180).

## Returns

`number`

Bearing in degrees clockwise from north (0 = N, 90 = E, 180 = S, 270 = W).

## Throws

If latitude is outside [-90, 90] or longitude outside [-180, 180].

## Example

```ts
qiblaAngle(40.7128, -74.006);  // ~58.49 (New York)
qiblaAngle(51.5074, -0.1278);  // ~119.0 (London)
```

## See

[https://github.com/acamarata/qibla/wiki/api/qiblaAngle](https://github.com/acamarata/qibla/wiki/api/qiblaAngle) Wiki API page
