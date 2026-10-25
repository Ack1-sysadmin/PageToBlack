import { isDarkColor, parseComputedColor, type Rgba } from './color';

export type PageTheme = 'light' | 'dark';

const OPAQUE = 0.5;
const SKIP_TAGS = new Set(['IMG', 'VIDEO', 'CANVAS', 'IFRAME', 'svg', 'PICTURE']);

function opaqueBackground(el: Element): Rgba | null {
  const color = parseComputedColor(getComputedStyle(el).backgroundColor);
  return color && color.a >= OPAQUE ? color : null;
}

/** Finds the first opaque background in the element stack at a viewport point. */
function backgroundAt(x: number, y: number): Rgba | null {
  for (const el of document.elementsFromPoint(x, y)) {
    if (SKIP_TAGS.has(el.tagName)) continue;
    const color = opaqueBackground(el);
    if (color) return color;
  }
  return null;
}

/**
 * Decides whether the page is already dark. Must be called while PageToBlack's
 * own styles are suspended, otherwise it measures itself.
 */
export function detectTheme(): PageTheme {
  const root = document.documentElement;
  const body = document.body;

  const direct = opaqueBackground(root) ?? (body && opaqueBackground(body));
  if (direct) return isDarkColor(direct) ? 'dark' : 'light';

  // No background on html/body: vote across sample points (wrappers like #app).
  const w = innerWidth;
  const h = innerHeight;
  const points: [number, number][] = [
    [w * 0.5, h * 0.5],
    [w * 0.1, h * 0.5],
    [w * 0.9, h * 0.5],
    [w * 0.5, h * 0.9],
    [w * 0.5, h * 0.1],
  ];
  let dark = 0;
  let light = 0;
  for (const [x, y] of points) {
    const color = backgroundAt(x, y);
    if (!color) continue;
    if (isDarkColor(color)) dark++;
    else light++;
  }
  if (dark + light > 0) return dark > light ? 'dark' : 'light';

  // Nothing painted: the canvas colour depends on the page's colour-scheme.
  return getComputedStyle(root).colorScheme.trim() === 'dark' ? 'dark' : 'light';
}

/** Resolves once the DOM is parsed and the stylesheets in it have loaded. */
export async function whenStylesReady(timeoutMs = 1500): Promise<void> {
  if (document.readyState === 'loading') {
    await new Promise<void>((resolve) =>
      document.addEventListener('DOMContentLoaded', () => resolve(), { once: true }),
    );
  }
  const pending = [...document.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"]')]
    .filter((link) => !link.sheet && !link.disabled)
    .map(
      (link) =>
        new Promise<void>((resolve) => {
          link.addEventListener('load', () => resolve(), { once: true });
          link.addEventListener('error', () => resolve(), { once: true });
        }),
    );
  if (pending.length === 0) return;
  await Promise.race([
    Promise.all(pending),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}
