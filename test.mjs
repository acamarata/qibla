import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  qiblaAngle,
  compassDir,
  compassName,
  qiblaGreatCircle,
  distanceKm,
  KAABA_LAT,
  KAABA_LNG,
  EARTH_RADIUS_KM,
} from "./dist/index.mjs";

describe("KAABA constants", () => {
  it("latitude is approximately 21.42°N", () => {
    assert.ok(Math.abs(KAABA_LAT - 21.42) < 0.1);
  });
  it("longitude is approximately 39.83°E", () => {
    assert.ok(Math.abs(KAABA_LNG - 39.83) < 0.1);
  });
  it("EARTH_RADIUS_KM is 6371", () => {
    assert.strictEqual(EARTH_RADIUS_KM, 6371);
  });
});

describe("qiblaAngle", () => {
  it("returns a number between 0 and 360", () => {
    const angle = qiblaAngle(40.7128, -74.006);
    assert.ok(angle >= 0 && angle < 360);
  });
  it("New York City (~58° NE)", () => {
    const angle = qiblaAngle(40.7128, -74.006);
    assert.ok(angle > 50 && angle < 70, `Expected 50-70, got ${angle}`);
  });
  it("London (~119° SE)", () => {
    const angle = qiblaAngle(51.5074, -0.1278);
    assert.ok(angle > 110 && angle < 130, `Expected 110-130, got ${angle}`);
  });
  it("Tokyo (~293° NW)", () => {
    const angle = qiblaAngle(35.6762, 139.6503);
    assert.ok(angle > 280 && angle < 310, `Expected 280-310, got ${angle}`);
  });
  it("Sydney (~277° W)", () => {
    const angle = qiblaAngle(-33.8688, 151.2093);
    assert.ok(angle > 260 && angle < 300, `Expected 260-300, got ${angle}`);
  });
  it("Islamabad (~268° W)", () => {
    const angle = qiblaAngle(33.6844, 73.0479);
    assert.ok(angle > 250 && angle < 290, `Expected 250-290, got ${angle}`);
  });
  it("returns finite number at Ka'bah (degenerate case)", () => {
    const angle = qiblaAngle(KAABA_LAT, KAABA_LNG);
    assert.ok(Number.isFinite(angle));
  });
  it("equator east of Mecca points NW", () => {
    const angle = qiblaAngle(0, 80);
    assert.ok(angle > 270 && angle < 360, `Expected 270-360, got ${angle}`);
  });
  it("result is stable (same input gives same output)", () => {
    const a = qiblaAngle(40.7128, -74.006);
    const b = qiblaAngle(40.7128, -74.006);
    assert.strictEqual(a, b);
  });
  it("throws RangeError for invalid latitude", () => {
    assert.throws(() => qiblaAngle(91, 0), RangeError);
    assert.throws(() => qiblaAngle(-91, 0), RangeError);
  });
  it("throws RangeError for invalid longitude", () => {
    assert.throws(() => qiblaAngle(0, 181), RangeError);
    assert.throws(() => qiblaAngle(0, -181), RangeError);
  });
});

describe("compassDir", () => {
  it("returns N for 0°", () => assert.strictEqual(compassDir(0), "N"));
  it("returns N for 360°", () => assert.strictEqual(compassDir(360), "N"));
  it("returns NE for 45°", () => assert.strictEqual(compassDir(45), "NE"));
  it("returns E for 90°", () => assert.strictEqual(compassDir(90), "E"));
  it("returns SE for 135°", () => assert.strictEqual(compassDir(135), "SE"));
  it("returns S for 180°", () => assert.strictEqual(compassDir(180), "S"));
  it("returns SW for 225°", () => assert.strictEqual(compassDir(225), "SW"));
  it("returns W for 270°", () => assert.strictEqual(compassDir(270), "W"));
  it("returns NW for 315°", () => assert.strictEqual(compassDir(315), "NW"));
  it("returns NE for NYC Qibla", () => {
    const bearing = qiblaAngle(40.7128, -74.006);
    assert.strictEqual(compassDir(bearing), "NE");
  });
});

describe("compassName", () => {
  it("returns North for 0°", () => assert.strictEqual(compassName(0), "North"));
  it("returns Northeast for 45°", () =>
    assert.strictEqual(compassName(45), "Northeast"));
  it("returns East for 90°", () => assert.strictEqual(compassName(90), "East"));
  it("returns Southeast for 135°", () =>
    assert.strictEqual(compassName(135), "Southeast"));
  it("returns South for 180°", () =>
    assert.strictEqual(compassName(180), "South"));
  it("returns Southwest for 225°", () =>
    assert.strictEqual(compassName(225), "Southwest"));
  it("returns West for 270°", () =>
    assert.strictEqual(compassName(270), "West"));
  it("returns Northwest for 315°", () =>
    assert.strictEqual(compassName(315), "Northwest"));
  it("returns North for 360°", () =>
    assert.strictEqual(compassName(360), "North"));
});

describe("qiblaGreatCircle", () => {
  it("returns an array of [lat, lng] pairs", () => {
    const points = qiblaGreatCircle(40.7128, -74.006);
    assert.ok(Array.isArray(points));
    assert.ok(points.length > 0);
    assert.strictEqual(points[0].length, 2);
  });
  it("returns 121 points by default", () => {
    const points = qiblaGreatCircle(40.7128, -74.006);
    assert.strictEqual(points.length, 121);
  });
  it("respects custom steps parameter", () => {
    const points = qiblaGreatCircle(40.7128, -74.006, 60);
    assert.strictEqual(points.length, 61);
  });
  it("first point is close to origin", () => {
    const [lat, lng] = qiblaGreatCircle(40.7128, -74.006)[0];
    assert.ok(Math.abs(lat - 40.7128) < 0.01);
    assert.ok(Math.abs(lng - -74.006) < 0.01);
  });
  it("last point is close to Ka'bah", () => {
    const points = qiblaGreatCircle(40.7128, -74.006);
    const [lat, lng] = points[points.length - 1];
    assert.ok(Math.abs(lat - KAABA_LAT) < 0.01);
    assert.ok(Math.abs(lng - KAABA_LNG) < 0.01);
  });
  it("all points have valid coordinates", () => {
    const points = qiblaGreatCircle(51.5074, -0.1278, 10);
    for (const [lat, lng] of points) {
      assert.ok(Number.isFinite(lat));
      assert.ok(Number.isFinite(lng));
      assert.ok(lat >= -90 && lat <= 90);
      assert.ok(lng >= -180 && lng <= 180);
    }
  });
  it("returns single point at Ka'bah", () => {
    const points = qiblaGreatCircle(KAABA_LAT, KAABA_LNG);
    assert.strictEqual(points.length, 1);
    assert.ok(Math.abs(points[0][0] - KAABA_LAT) < 0.0001);
    assert.ok(Math.abs(points[0][1] - KAABA_LNG) < 0.0001);
  });
  it("throws RangeError for invalid coordinates", () => {
    assert.throws(() => qiblaGreatCircle(91, 0), RangeError);
    assert.throws(() => qiblaGreatCircle(0, 181), RangeError);
  });
});

describe("distanceKm", () => {
  it("returns 0 for the same point", () => {
    assert.ok(Math.abs(distanceKm(40.7128, -74.006, 40.7128, -74.006)) < 0.001);
  });
  it("NYC to Ka'bah is approximately 9600 km", () => {
    const km = distanceKm(40.7128, -74.006, KAABA_LAT, KAABA_LNG);
    assert.ok(km > 9000 && km < 10500, `Expected 9000-10500, got ${km}`);
  });
  it("London to Ka'bah is approximately 4950 km", () => {
    const km = distanceKm(51.5074, -0.1278, KAABA_LAT, KAABA_LNG);
    assert.ok(km > 4500 && km < 5500, `Expected 4500-5500, got ${km}`);
  });
  it("distance is symmetric", () => {
    const d1 = distanceKm(40.7128, -74.006, KAABA_LAT, KAABA_LNG);
    const d2 = distanceKm(KAABA_LAT, KAABA_LNG, 40.7128, -74.006);
    assert.ok(Math.abs(d1 - d2) < 0.001);
  });
  it("quarter equator is approximately 10,018 km", () => {
    const d = distanceKm(0, 0, 0, 90);
    assert.ok(d > 9800 && d < 10200, `Expected 9800-10200, got ${d}`);
  });
  it("pole to pole is approximately 20,000 km", () => {
    const d = distanceKm(90, 0, -90, 0);
    assert.ok(d > 19000 && d < 21000, `Expected 19000-21000, got ${d}`);
  });
  it("returns positive for distinct points", () => {
    assert.ok(distanceKm(0, 0, 10, 10) > 0);
  });
});
