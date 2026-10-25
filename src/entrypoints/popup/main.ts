import './style.css';
import { browser } from 'wxt/browser';
import type { PageStatus } from '@/utils/messages';
import { isActiveOn, setGlobalEnabled, setSiteEnabled, settingsItem } from '@/utils/settings';

const t = (key: string, substitutions?: string | string[]) =>
  browser.i18n.getMessage(key as never, substitutions) || key;

const globalToggle = document.querySelector<HTMLInputElement>('#global')!;
const siteRow = document.querySelector<HTMLLabelElement>('#site-row')!;
const siteLabel = document.querySelector<HTMLSpanElement>('#site-label')!;
const siteToggle = document.querySelector<HTMLInputElement>('#site')!;
const statusText = document.querySelector<HTMLParagraphElement>('#status')!;

document.documentElement.lang = browser.i18n.getUILanguage();
for (const el of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
  el.textContent = t(el.dataset.i18n!);
}

async function queryStatus(): Promise<PageStatus | null> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id === undefined) return null;
  try {
    return (await browser.tabs.sendMessage(tab.id, { type: 'ptb:getStatus' })) ?? null;
  } catch {
    // No content script: chrome:// pages, Web Store, or tab opened before install.
    return null;
  }
}

function statusMessage(status: PageStatus | null, active: boolean): string {
  if (!status) return t('statusUnavailable');
  if (!active) return t('statusOff');
  if (status.theme === 'dark') return t('statusBlackening');
  if (status.theme === 'light') return t('statusFilter');
  return t('statusDetecting');
}

async function refresh(): Promise<void> {
  const settings = await settingsItem.getValue();
  const status = await queryStatus();
  globalToggle.checked = settings.enabled;

  siteRow.hidden = !status?.host;
  if (status?.host) {
    siteLabel.textContent = t('popupSite', status.host);
    siteToggle.checked = !settings.disabledSites.includes(status.host);
    siteToggle.disabled = !settings.enabled;
  }
  statusText.textContent = statusMessage(status, !!status && isActiveOn(settings, status.host));
}

globalToggle.addEventListener('change', async () => {
  await setGlobalEnabled(globalToggle.checked);
  await refresh();
});

siteToggle.addEventListener('change', async () => {
  const status = await queryStatus();
  if (!status?.host) return;
  await setSiteEnabled(status.host, siteToggle.checked);
  await refresh();
});

void refresh();
