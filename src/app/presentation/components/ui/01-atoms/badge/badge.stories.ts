import { COLORS_THEME } from '@app/core/shared/theme/color.registry';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { Badge } from './badge';

/**
 * `app-badge` es un átomo de solo presentación: pinta el contenido proyectado
 * (`ng-content`) dentro de un `<span>` con la clase de texto derivada del `color`.
 */
type BadgeArgs = Badge & { label: string };

const meta: Meta<BadgeArgs> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  render: ({ label, ...args }) => ({
    props: args,
    template: `<app-badge ${argsToTemplate(args)}>${label}</app-badge>`,
  }),
  args: {
    color: 'neutral',
    label: 'Pendiente',
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      options: Object.keys(COLORS_THEME),
      description: 'Clave del registro de colores del tema.',
      table: { defaultValue: { summary: 'neutral' } },
    },
    label: {
      control: 'text',
      description: 'Contenido proyectado vía `ng-content`.',
    },
  },
};

export default meta;
type Story = StoryObj<BadgeArgs>;

/** Estado por defecto: color `neutral`. */
export const Default: Story = {};

/** Un color explícito del registro del tema. */
export const Color: Story = {
  args: { color: 'blue', label: 'En progreso' },
};

/** Todos los colores disponibles en `COLORS_THEME`. */
export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;max-width:640px">
        ${Object.keys(COLORS_THEME)
          .map((c) => `<app-badge color="${c}">${c}</app-badge>`)
          .join('')}
      </div>
    `,
  }),
};

/** El texto se muestra en mayúsculas (CSS `uppercase`) sin alterar el contenido real. */
export const LongText: Story = {
  args: { color: 'amber', label: 'Pendiente de revisión del equipo' },
};
