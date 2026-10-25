/**
 * OLED tone curve for filter mode. Values are sRGB-encoded channel values (0..1),
 * measured *after* the page has been inverted (so 0 = originally white).
 * Will become user settings after the calibration tests (see docs/02 Recherche/Testhardware.md).
 */
export const OLED = {
  /** Everything below this snaps to pure black (#000): near-white page surfaces. */
  blackThreshold: 0.08,
  /** Darkest visible output; keeps light-grey borders from turning into near-black. */
  minVisible: 0.08,
  /** Brightest output (~#f7f7f7); black text ends up here instead of pure white. */
  textMax: 0.97,
};

/**
 * Blackening of already dark pages: pixels whose luma (sRGB-encoded) is below `from`
 * become #000, above `to` they stay unchanged, with a soft ramp in between so dark
 * image and video areas do not get hard edges. Covers #121212, #1e1e1e, GitHub #151b23.
 */
export const BLACKEN = { from: 0.12, to: 0.17 };

/**
 * Ease-out between `minVisible` and `textMax`: lifts the dark-grey text colours that
 * light sites use (#333, #666, …) so they read as white-ish text, not grey, after inversion.
 */
export function oledCurve(v: number): number {
  const { blackThreshold: t, minVisible: lo, textMax: hi } = OLED;
  if (v < t) return 0;
  const u = (v - t) / (1 - t);
  return lo + (hi - lo) * (1 - (1 - u) ** 2);
}

/** Inverse of `oledCurve`; inputs below `minVisible` (crushed to black anyway) map below the threshold. */
export function inverseOledCurve(y: number): number {
  const { blackThreshold: t, minVisible: lo, textMax: hi } = OLED;
  if (y < lo) return (y / lo) * t;
  if (y >= hi) return 1;
  const u = 1 - Math.sqrt(1 - (y - lo) / (hi - lo));
  return t + u * (1 - t);
}

/**
 * Pre-compensation for media: page curve ∘ media curve = x · textMax, so images
 * come out as the original, dimmed to text brightness, instead of brightened by the curve.
 */
export function mediaCurve(x: number): number {
  return inverseOledCurve(x * OLED.textMax);
}

/** Samples a curve as an SVG `feFunc` tableValues string. */
export function toTableValues(curve: (v: number) => number, steps = 256): string {
  return Array.from({ length: steps }, (_, i) => curve(i / (steps - 1)).toFixed(4)).join(' ');
}
