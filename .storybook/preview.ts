import { definePreview } from '@storybook/angular';
import addonDocs from '@storybook/addon-docs';
import addonThemes, { withThemeByClassName } from '@storybook/addon-themes';
import type { AngularRenderer } from '@storybook/angular';

const preview = definePreview({
  addons: [addonDocs(), addonThemes()],
  decorators: [
    withThemeByClassName<AngularRenderer>({
      themes: {
        light: 'light',
        dark: 'dark bg-slate-900 text-white',
      },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
    (storyFn, context) => {
      const isDark = context.globals['theme'] === 'dark';
      document.querySelectorAll('.docs-story').forEach((item) => {
        item.classList.toggle('bg-slate-900', isDark);
        item.classList.toggle('text-white', isDark);
      });
      return storyFn();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
});

export default preview;
