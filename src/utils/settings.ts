import { storage } from 'wxt/utils/storage';

export interface Settings {
  /** Global on/off switch. */
  enabled: boolean;
  /** Hostnames on which PageToBlack is switched off. */
  disabledSites: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  disabledSites: [],
};

export const settingsItem = storage.defineItem<Settings>('local:settings', {
  fallback: DEFAULT_SETTINGS,
});

export function isActiveOn(settings: Settings, host: string): boolean {
  return settings.enabled && !settings.disabledSites.includes(host);
}

export async function setSiteEnabled(host: string, enabled: boolean): Promise<void> {
  const settings = await settingsItem.getValue();
  const others = settings.disabledSites.filter((h) => h !== host);
  await settingsItem.setValue({
    ...settings,
    disabledSites: enabled ? others : [...others, host],
  });
}

export async function setGlobalEnabled(enabled: boolean): Promise<void> {
  const settings = await settingsItem.getValue();
  await settingsItem.setValue({ ...settings, enabled });
}
