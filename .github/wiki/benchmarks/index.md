# Benchmarks

Measured on Apple M-series hardware, Node.js v25, using 1,000,000 iterations with a 1,000-call warm-up.

## Bundle size

| Format | Minified | Gzipped |
| ------ | -------- | ------- |
| ESM (`index.mjs`) | 2.7 KB | 949 B |
| CJS (`index.cjs`) | 3.8 KB | 1.3 KB |

The library has zero external dependencies. Both formats are shipped in the npm package.

## Throughput

| Operation | Ops / sec |
| --------- | --------- |
| `qiblaAngle` (forward azimuth) | ~180,000,000 |
| `distanceKm` (haversine) | ~407,000,000 |

These numbers reflect the V8 JIT at peak — real applications with diverse inputs and cold starts will see lower throughput. The point is that neither function is a bottleneck: both run in nanoseconds per call.

## Reproducing the benchmark

```js
import { qiblaAngle, distanceKm, KAABA_LAT, KAABA_LNG } from '@acamarata/qibla';

const N = 1_000_000;
const LATS = Array.from({ length: 100 }, (_, i) => (i - 50) * 1.8);
const LNGS = Array.from({ length: 100 }, (_, i) => (i - 50) * 3.6);

// Warm up
for (let i = 0; i < 1000; i++) qiblaAngle(LATS[i % 100], LNGS[i % 100]);

// qiblaAngle
const t0 = performance.now();
for (let i = 0; i < N; i++) qiblaAngle(LATS[i % 100], LNGS[i % 100]);
const t1 = performance.now();

// distanceKm
const t2 = performance.now();
for (let i = 0; i < N; i++) distanceKm(LATS[i % 100], LNGS[i % 100], KAABA_LAT, KAABA_LNG);
const t3 = performance.now();

console.log(`qiblaAngle: ${Math.round(N / ((t1 - t0) / 1000)).toLocaleString()} ops/s`);
console.log(`distanceKm: ${Math.round(N / ((t3 - t2) / 1000)).toLocaleString()} ops/s`);
```

## Notes

- V8's JIT optimizer eliminates much of the trig overhead at peak throughput. Expect 40-60% of these values in production with cold module loads.
- The library works identically in browsers (V8/SpiderMonkey/WebKit), Deno, and Bun. Performance will vary by runtime and optimization tier.
- `qiblaGreatCircle` is not benchmarked here because throughput depends on the step count. At the default of 120 steps, it runs in roughly 2-5 microseconds per call.

---

[Home](../Home) | [API Reference](../API-Reference)
