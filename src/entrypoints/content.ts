import { browser } from 'wxt/browser';
import { defineContentScript } from 'wxt/utils/define-content-script';
import { detectTheme, whenStylesReady, type PageTheme } from '@/utils/detect';
import { Engine } from '@/utils/engine';
import type { PageStatus } from '@/utils/messages';
import { isActiveOn, settingsItem, type Settings } from '@/utils/settings';

/** Pages often switch to their own dark theme via JS after load; re-check a few times. */
const RECHECK_DELAYS_MS = [500, 2000, 5000];

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  // Filter mode inverts the whole top document including its iframes,
  // so frames must not apply a second inversion.
  allFrames: false,

  async main(ctx) {
    if (!(document.documentElement instanceof HTMLHtmlElement)) return;
    if (/^(image|video|audio)\//.test(document.contentType)) return;

    const host = location.hostname;
    const engine = new Engine();
    // Paint black immediately, before settings or page styles are known.
    engine.setMode('antiflash');

    let settings: Settings = await settingsItem.getValue();
    let theme: PageTheme | null = null;

    const measure = () => engine.withoutStyles(detectTheme);

    const render = () => {
      if (!isActiveOn(settings, host)) engine.setMode('off');
      else if (theme) engine.setMode(theme === 'dark' ? 'blackening' : 'filter');
      else engine.setMode('antiflash');
    };

    const recheck = () => {
      if (!isActiveOn(settings, host)) return;
      engine.ensureAttached();
      const next = measure();
      if (next !== theme) {
        theme = next;
        render();
      }
    };

    render();
    await whenStylesReady();
    theme = measure();
    render();

    for (const delay of RECHECK_DELAYS_MS) ctx.setTimeout(recheck, delay);

    // Theme switches usually toggle a class/attribute on <html> or <body>.
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        recheck();
      });
    });
    const observeOpts: MutationObserverInit = {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme', 'data-color-mode', 'dark'],
    };
    observer.observe(document.documentElement, observeOpts);
    if (document.body) observer.observe(document.body, observeOpts);
    ctx.onInvalidated(() => {
      observer.disconnect();
      engine.setMode('off');
    });

    const unwatch = settingsItem.watch((next) => {
      settings = next;
      if (isActiveOn(settings, host)) theme = measure();
      render();
    });
    ctx.onInvalidated(unwatch);

    browser.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
      if ((message as { type?: string })?.type !== 'ptb:getStatus') return;
      const status: PageStatus = { host, theme, mode: engine.mode };
      sendResponse(status);
    });
  },
});
