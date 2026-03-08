const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  qiblaAngle,
  compassDir,
  compassName,
  qiblaGreatCircle,
  distanceKm,
  KAABA_LAT,
  KAABA_LNG,
  EARTH_RADIUS_KM,
} = require("./dist/index.cjs");

describe("CJS: qiblaAngle", () => {
  it("NYC bearing is ~58° NE", () => {
    const angle = qiblaAngle(40.7128, -74.006);
    assert.ok(angle > 50 && angle < 70);
  });
  it("London bearing is ~119° SE", () => {
    const angle = qiblaAngle(51.5074, -0.1278);
    assert.ok(angle > 110 && angle < 130);
  });
  it("throws for invalid latitude", () => {
    assert.throws(() => qiblaAngle(91, 0), RangeError);
  });
});

describe("CJS: compassDir", () => {
  it("N for 0°", () => assert.strictEqual(compassDir(0), "N"));
  it("NE for 45°", () => assert.strictEqual(compassDir(45), "NE"));
  it("S for 180°", () => assert.strictEqual(compassDir(180), "S"));
});

describe("CJS: compassName", () => {
  it("North for 0°", () => assert.strictEqual(compassName(0), "North"));
  it("Southeast for 135°", () =>
    assert.strictEqual(compassName(135), "Southeast"));
});

describe("CJS: qiblaGreatCircle", () => {
  it("returns 121 points by default", () => {
    assert.strictEqual(qiblaGreatCircle(40.7128, -74.006).length, 121);
  });
  it("single point at Ka'bah", () => {
    assert.strictEqual(qiblaGreatCircle(KAABA_LAT, KAABA_LNG).length, 1);
  });
});

describe("CJS: distanceKm", () => {
  it("NYC to Ka'bah ~9600 km", () => {
    const km = distanceKm(40.7128, -74.006, KAABA_LAT, KAABA_LNG);
    assert.ok(km > 9000 && km < 10500);
  });
  it("symmetric", () => {
    const d1 = distanceKm(40, -74, KAABA_LAT, KAABA_LNG);
    const d2 = distanceKm(KAABA_LAT, KAABA_LNG, 40, -74);
    assert.ok(Math.abs(d1 - d2) < 0.001);
  });
});

describe("CJS: constants", () => {
  it("EARTH_RADIUS_KM is 6371", () => {
    assert.strictEqual(EARTH_RADIUS_KM, 6371);
  });
});
