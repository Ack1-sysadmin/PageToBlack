export type EngineMode = 'off' | 'antiflash' | 'filter' | 'blackening';

/**
 * OLED tuning. Values are in sRGB-encoded units (0..1).
 * Will become user settings after the calibration tests (see docs/02 Recherche/Testhardware.md).
 */
export const OLED = {
  /** After inversion, every channel below this snaps to pure black (#000). */
  blackThreshold: 0.08,
  /** Brightest output value; dims white text and images (~#e0e0e0). */
  textMax: 0.88,
};

const FILTER_ID = 'ptb-oled-curve';
const INVERT = 'invert(1) hue-rotate(180deg)';

/** Elements that must keep their original colours inside the inverted page. */
const MEDIA = 'img, video, canvas, iframe, embed, object, svg image, [style*="url("]';

const CSS: Record<Exclude<EngineMode, 'off'>, string> = {
  antiflash: `
    :root { color-scheme: dark !important; }
    html, body { background-color: #000 !important; }
  `,
  filter: `
    html {
      filter: ${INVERT} url(#${FILTER_ID}) !important;
      background-color: #fff !important;
    }
    :is(${MEDIA}):not(:is(${MEDIA}) *) {
      filter: ${INVERT} !important;
    }
  `,
  blackening: `
    :root { color-scheme: dark !important; }
    html, body { background-color: #000 !important; }
  `,
};

function curveTable(): string {
  const { blackThreshold, textMax } = OLED;
  const values: string[] = [];
  for (let i = 0; i < 256; i++) {
    const v = i / 255;
    values.push((v < blackThreshold ? 0 : v * textMax).toFixed(4));
  }
  return values.join(' ');
}

function createCurveFilter(): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  const filter = document.createElementNS(ns, 'filter');
  filter.id = FILTER_ID;
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  const transfer = document.createElementNS(ns, 'feComponentTransfer');
  const table = curveTable();
  for (const channel of ['feFuncR', 'feFuncG', 'feFuncB']) {
    const func = document.createElementNS(ns, channel);
    func.setAttribute('type', 'table');
    func.setAttribute('tableValues', table);
    transfer.append(func);
  }
  filter.append(transfer);
  svg.append(filter);
  return svg;
}

export class Engine {
  mode: EngineMode = 'off';
  private style: HTMLStyleElement | null = null;
  private svg: SVGSVGElement | null = null;

  setMode(mode: EngineMode): void {
    this.mode = mode;
    if (mode === 'off') {
      this.style?.remove();
      this.svg?.remove();
      this.style = this.svg = null;
      return;
    }
    if (!this.style) {
      this.style = document.createElement('style');
      this.style.id = 'ptb-style';
    }
    this.style.textContent = `@media screen {${CSS[mode]}}`;
    this.attach(this.style);
    if (mode === 'filter') {
      this.svg ??= createCurveFilter();
      this.attach(this.svg);
    } else {
      this.svg?.remove();
    }
  }

  /** Runs `fn` with PageToBlack's styles disabled (synchronously, so nothing is painted). */
  withoutStyles<T>(fn: () => T): T {
    const sheet = this.style?.sheet;
    if (sheet) sheet.disabled = true;
    try {
      return fn();
    } finally {
      if (sheet) sheet.disabled = false;
    }
  }

  /** Re-attaches our elements if the page replaced them (e.g. SPA re-renders). */
  ensureAttached(): void {
    if (this.style && !this.style.isConnected) this.attach(this.style);
    if (this.mode === 'filter' && this.svg && !this.svg.isConnected) this.attach(this.svg);
  }

  private attach(el: Element): void {
    // Appending to <html> works before <head> exists at document_start.
    if (el.parentNode !== document.documentElement) document.documentElement.append(el);
  }
}
