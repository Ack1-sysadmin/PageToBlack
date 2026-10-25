import { describe, expect, it } from 'vitest';
import { OLED, inverseOledCurve, mediaCurve, oledCurve } from '../../src/utils/curve';

/** Inverted value of an sRGB hex channel, as the page curve sees it. */
const inverted = (hex: number) => 1 - hex / 255;

describe('oledCurve', () => {
  it('snaps near-white surfaces to pure black', () => {
    expect(oledCurve(inverted(0xff))).toBe(0);
    expect(oledCurve(inverted(0xf6))).toBe(0); // GitHub card background #f6f8fa
  });

  it('keeps light-grey borders visible instead of near-black', () => {
    expect(oledCurve(inverted(0xe5))).toBeGreaterThan(0.1);
  });

  it('turns typical text colours into near-white, not grey', () => {
    expect(oledCurve(inverted(0x00))).toBeCloseTo(OLED.textMax);
    expect(oledCurve(inverted(0x1f))).toBeGreaterThan(0.88); // GitHub text #1f2328
    expect(oledCurve(inverted(0x66))).toBeGreaterThan(0.7); // #666 body text
  });

  it('is monotonic above the black threshold', () => {
    let previous = 0;
    for (let v = OLED.blackThreshold; v <= 1; v += 0.001) {
      const y = oledCurve(v);
      expect(y).toBeGreaterThanOrEqual(previous);
      previous = y;
    }
  });
});

describe('inverseOledCurve', () => {
  it('undoes oledCurve in the visible range', () => {
    for (let v = OLED.blackThreshold; v <= 1; v += 0.01) {
      expect(inverseOledCurve(oledCurve(v))).toBeCloseTo(v, 6);
    }
  });
});

describe('mediaCurve', () => {
  it('makes media come out as the original dimmed by textMax', () => {
    for (let x = 0.1; x <= 1; x += 0.01) {
      expect(oledCurve(mediaCurve(x))).toBeCloseTo(x * OLED.textMax, 6);
    }
  });
});
