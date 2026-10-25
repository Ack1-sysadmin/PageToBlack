import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    permissions: ['storage'],
    action: {
      default_title: '__MSG_extName__',
    },
    commands: {
      'toggle-site': {
        suggested_key: { default: 'Alt+Shift+B' },
        description: '__MSG_commandToggleSite__',
      },
    },
  },
});
