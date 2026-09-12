import { COLORS_THEME } from '@app/core/shared/theme/color.registry';
import { ICON_LIST } from '@components/01-atoms/icon/icon.registry';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { IconText } from './icon-text';

/**
 * `app-icon-text` combina un ícono (o, si no hay `icon`, un punto de color)
 * con texto proyectado (`ng-content`). El color tiñe siempre el ícono/punto;
 * con `textColor` también tiñe el texto.
 */
type IconTextArgs = IconText & { label: string };

const meta: Meta<IconTextArgs> = {
  title: 'Atoms/IconText',
  component: IconText,
  tags: ['autodocs'],
  render: ({ label, ...args }) => ({
    props: args,
    template: `<app-icon-text ${argsToTemplate(args)}>${label}</app-icon-text>`,
  }),
  args: {
    icon: 'folder',
    color: 'blue',
    textColor: false,
    label: 'Categoría',
  },
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: [undefined, ...ICON_LIST],
      description: 'Ícono del registro; sin valor, se muestra un punto de color en su lugar.',
    },
    color: {
      control: { type: 'select' },
      options: Object.keys(COLORS_THEME),
      description: 'Clave del registro de colores del tema.',
      table: { defaultValue: { summary: 'neutral' } },
    },
    textColor: {
      control: 'boolean',
      description: 'Cuando es `true`, el color también se aplica al texto proyectado.',
    },
    label: {
      control: 'text',
      description: 'Contenido proyectado vía `ng-content`.',
    },
  },
};

export default meta;
type Story = StoryObj<IconTextArgs>;

/** Con ícono, color en el ícono, texto sin colorear. */
export const Default: Story = {};

/** Sin `icon`: punto de color en vez del ícono. */
export const WithoutIcon: Story = {
  args: { icon: undefined, label: 'Sin categoría' },
};

/** `textColor=true`: el color también tiñe el texto proyectado. */
export const TextColored: Story = {
  args: { textColor: true, color: 'rose', label: 'Fecha límite' },
};

/** Todos los colores del registro, con y sin ícono. */
export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;max-width:220px">
        ${Object.keys(COLORS_THEME)
          .map(
            (c) => `<app-icon-text color="${c}" icon="folder" [textColor]="true">${c}</app-icon-text>`,
          )
          .join('')}
      </div>
    `,
  }),
};
