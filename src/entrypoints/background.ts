import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';
import type { PageStatus } from '@/utils/messages';
import { isActiveOn, setSiteEnabled, settingsItem } from '@/utils/settings';

export default defineBackground(() => {
  browser.commands.onCommand.addListener(async (command, tab) => {
    if (command !== 'toggle-site' || tab?.id === undefined) return;
    let status: PageStatus | undefined;
    try {
      status = await browser.tabs.sendMessage(tab.id, { type: 'ptb:getStatus' });
    } catch {
      return; // No content script on this page.
    }
    if (!status?.host) return;
    const settings = await settingsItem.getValue();
    await setSiteEnabled(status.host, !isActiveOn(settings, status.host));
  });
});
