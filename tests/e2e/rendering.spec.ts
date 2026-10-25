import { ORIGIN, expect, max, pixels, test } from './fixtures';

test('light page: backgrounds become pure black, highlights are dimmed', async ({ context }) => {
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/light.html`);
  await page.waitForTimeout(300);
  const px = await pixels(page, {
    background: [400, 400],
    card: [100, 70],
    border: [265, 70],
    text: [100, 180],
    photo: [550, 70],
  });
  expect(px.background).toEqual([0, 0, 0]);
  // #f5f5f5 is near-white -> near-black after inversion -> snapped to #000.
  expect(px.card).toEqual([0, 0, 0]);
  // #e5e5e5 borders must stay visible.
  expect(max(px.border)).toBeGreaterThan(15);
  // Black text becomes light, but not pure white.
  expect(max(px.text)).toBeGreaterThan(200);
  expect(max(px.text)).toBeLessThan(235);
  // Images keep their colours, dimmed by textMax. The photo is a skin tone (#e0ac69);
  // fully saturated colours lose saturation in filter mode (hue-rotate clamping).
  const dimmed = [0xe0, 0xac, 0x69].map((c) => Math.round(c * 0.88));
  px.photo.forEach((c, i) => expect(Math.abs(c - dimmed[i]!)).toBeLessThan(12));
});

test('light page: fixed elements stay fixed while scrolling', async ({ context }) => {
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/light.html`);
  await page.waitForTimeout(300);
  await page.mouse.move(400, 300);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  const px = await pixels(page, { inside: [700, 45], border: [652, 45] });
  expect(px.inside).toEqual([0, 0, 0]);
  expect(max(px.border)).toBeGreaterThan(200);
});

test('page without background colour becomes black', async ({ context }) => {
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/plain.html`);
  await page.waitForTimeout(300);
  const px = await pixels(page, { background: [400, 100] });
  expect(px.background).toEqual([0, 0, 0]);
});

test('dark page is blackened, not inverted', async ({ context }) => {
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/dark.html`);
  await page.waitForTimeout(300);
  const px = await pixels(page, { background: [400, 400], panel: [100, 70] });
  expect(px.background).toEqual([0, 0, 0]);
  // Not inverted: the light panel stays light.
  expect(max(px.panel)).toBeGreaterThan(200);
});

test('dark wrapper on transparent body is detected as dark', async ({ context }) => {
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/wrapper-dark.html`);
  await page.waitForTimeout(300);
  const px = await pixels(page, { center: [400, 300] });
  // Not inverted to white. (Blackening wrappers is M1 – for now it keeps #1e1e1e.)
  expect(max(px.center)).toBeLessThan(40);
});

test('page that turns dark after load switches from filter to blackening', async ({ context }) => {
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/late-dark.html`);
  await page.waitForTimeout(300);
  expect((await pixels(page, { bg: [400, 300] })).bg).toEqual([0, 0, 0]);
  await page.waitForTimeout(1500);
  expect((await pixels(page, { bg: [400, 300] })).bg).toEqual([0, 0, 0]);
});

test('disabling the site restores the original page', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/light.html`);
  await page.waitForTimeout(300);
  const worker = context.serviceWorkers().find((w) => w.url().includes(extensionId))!;
  // Runs inside the extension's service worker, where `chrome` exists.
  await worker.evaluate(() =>
    (globalThis as any).chrome.storage.local.set({
      settings: { enabled: true, disabledSites: ['ptb.test'] },
    }),
  );
  await page.waitForTimeout(300);
  expect((await pixels(page, { background: [400, 400] })).background).toEqual([255, 255, 255]);
});
