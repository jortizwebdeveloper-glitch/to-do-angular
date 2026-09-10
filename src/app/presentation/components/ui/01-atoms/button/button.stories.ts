import { COLORS_THEME } from '@app/core/shared/theme/color.registry';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { AppButton } from './button.directive';

/**
 * `appButton` es una directiva de estilo: se aplica sobre `<button>` o `<a>` y
 * calcula la clase (`btn` / `btn-outline`) a partir de `variant`, `size` y `outline`.
 * No añade comportamiento, sólo presentación.
 */
type ButtonArgs = AppButton & { label: string };

const meta: Meta<ButtonArgs> = {
  title: 'Atoms/Button',
  component: AppButton,
  tags: ['autodocs'],
  render: ({ label, ...args }) => ({
    props: args,
    template: `<button appButton ${argsToTemplate(args)}>${label}</button>`,
  }),
  args: {
    variant: 'blue',
    size: 'md',
    outline: false,
    label: 'Guardar cambios',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.keys(COLORS_THEME),
      description: 'Clave del registro de colores del tema.',
      table: { defaultValue: { summary: 'blue' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: '`lg` no está contemplado en el `switch` y cae al set de `md`.',
      table: { defaultValue: { summary: 'md' } },
    },
    outline: {
      control: 'boolean',
      description: 'Usa el set de clases `btn-outline` en lugar de `btn`.',
    },
    label: {
      control: 'text',
      description: 'Contenido de texto del botón.',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonArgs>;

/** Estado por defecto: `variant` blue, `size` md, sólido. */
export const Default: Story = {};

/** Variante con relleno translúcido y borde. */
export const Outline: Story = {
  args: { outline: true },
};

/** Tamaño compacto (`px-4 py-1 rounded-lg text-sm`). */
export const Small: Story = {
  args: { size: 'sm', label: 'Acción' },
};

/** La misma directiva sobre un `<a>`. */
export const AsLink: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<a appButton href="#" variant="green">Ir al detalle</a>`,
  }),
};

/** Todos los colores del registro del tema, en sólido y outline. */
export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px;max-width:760px">
        ${Object.keys(COLORS_THEME)
          .map((c) => `<button appButton variant="${c}">${c}</button>`)
          .join('')}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;max-width:760px;margin-top:12px">
        ${Object.keys(COLORS_THEME)
          .map((c) => `<button appButton [outline]="true" variant="${c}">${c}</button>`)
          .join('')}
      </div>
    `,
  }),
};
