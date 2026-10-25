import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import { PNG } from 'pngjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const extensionPath = path.join(root, '.output/chrome-mv3');
const pagesDir = path.join(root, 'tests/pages');

/** Test pages are served from this fake origin via request routing. */
export const ORIGIN = 'http://ptb.test';

export const test = base.extend<{ context: BrowserContext; extensionId: string }>({
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      viewport: { width: 800, height: 600 },
      deviceScaleFactor: 1,
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });
    await context.route(`${ORIGIN}/**`, (route) => {
      const name = new URL(route.request().url()).pathname.slice(1) || 'index.html';
      void route.fulfill({ path: path.join(pagesDir, name) });
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    await use(new URL(worker.url()).host);
  },
});

export const expect = test.expect;

export type Rgb = [number, number, number];

/** Reads pixel colours from a screenshot of the composited page (filters included). */
export async function pixels<K extends string>(page: Page, points: Record<K, [number, number]>) {
  const png = PNG.sync.read(await page.screenshot());
  const result = {} as Record<K, Rgb>;
  for (const [name, [x, y]] of Object.entries(points) as [K, [number, number]][]) {
    const i = (y * png.width + x) * 4;
    result[name] = [png.data[i]!, png.data[i + 1]!, png.data[i + 2]!];
  }
  return result;
}

export const max = (c: Rgb) => Math.max(...c);
