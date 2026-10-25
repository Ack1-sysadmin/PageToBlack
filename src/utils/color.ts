export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Parses the `rgb()`/`rgba()` strings returned by `getComputedStyle`. */
export function parseComputedColor(value: string): Rgba | null {
  const args = value.match(/rgba?\(([^)]+)\)/)?.[1];
  if (!args) return null;
  const [r, g, b, a = 1, ...rest] = args.split(/[\s,/]+/).filter(Boolean).map(Number);
  if (r === undefined || g === undefined || b === undefined || rest.length > 0) return null;
  if ([r, g, b, a].some(Number.isNaN)) return null;
  return { r, g, b, a };
}

/** Relative luminance (WCAG) in the range 0..1. */
export function luminance({ r, g, b }: Rgba): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Dark means white text has more contrast on it than black text. */
export function isDarkColor(color: Rgba): boolean {
  return luminance(color) < 0.179;
}
