import { BLACKEN, mediaCurve, oledCurve, toTableValues } from './curve';

export type EngineMode = 'off' | 'antiflash' | 'filter' | 'blackening';

const PAGE_FILTER_ID = 'ptb-oled-curve';
const MEDIA_FILTER_ID = 'ptb-media-curve';
const BLACKEN_FILTER_ID = 'ptb-blacken';
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
      filter: ${INVERT} url(#${PAGE_FILTER_ID}) !important;
      background-color: #fff !important;
    }
    :is(${MEDIA}):not(:is(${MEDIA}) *) {
      filter: url(#${MEDIA_FILTER_ID}) ${INVERT} !important;
    }
  `,
  blackening: `
    :root { color-scheme: dark !important; }
    html {
      filter: url(#${BLACKEN_FILTER_ID}) !important;
      background-color: #000 !important;
      /* With a filter, Chrome paints the canvas outside the <html> box in the
         colour-scheme default (#121212), so the box must cover the viewport. */
      min-height: 100% !important;
    }
    body { background-color: #000 !important; }
  `,
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function createTableFilter(id: string, curve: (v: number) => number): SVGFilterElement {
  const filter = document.createElementNS(SVG_NS, 'filter');
  filter.id = id;
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  const transfer = document.createElementNS(SVG_NS, 'feComponentTransfer');
  const table = toTableValues(curve);
  for (const channel of ['feFuncR', 'feFuncG', 'feFuncB']) {
    const func = document.createElementNS(SVG_NS, channel);
    func.setAttribute('type', 'table');
    func.setAttribute('tableValues', table);
    transfer.append(func);
  }
  filter.append(transfer);
  return filter;
}

/** Multiplies each pixel by a luma ramp (0 below BLACKEN.from, 1 above BLACKEN.to), over black. */
function createBlackenFilter(): SVGFilterElement {
  const filter = document.createElementNS(SVG_NS, 'filter');
  filter.id = BLACKEN_FILTER_ID;
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  const { from, to } = BLACKEN;
  const slope = 1 / (to - from);
  filter.innerHTML = `
    <feColorMatrix in="SourceGraphic" type="matrix" result="luma"
      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.2126 0.7152 0.0722 0 0" />
    <feComponentTransfer in="luma" result="mask">
      <feFuncA type="linear" slope="${slope}" intercept="${-from * slope}" />
    </feComponentTransfer>
    <feComposite in="SourceGraphic" in2="mask" operator="in" result="kept" />
    <feFlood flood-color="#000" result="black" />
    <feComposite in="kept" in2="black" operator="over" />
  `;
  return filter;
}

function createCurveFilters(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.append(
    createTableFilter(PAGE_FILTER_ID, oledCurve),
    createTableFilter(MEDIA_FILTER_ID, mediaCurve),
    createBlackenFilter(),
  );
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
    if (mode === 'filter' || mode === 'blackening') {
      this.svg ??= createCurveFilters();
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
    if (this.mode !== 'antiflash' && this.svg && !this.svg.isConnected) this.attach(this.svg);
  }

  private attach(el: Element): void {
    // Appending to <html> works before <head> exists at document_start.
    if (el.parentNode !== document.documentElement) document.documentElement.append(el);
  }
}
