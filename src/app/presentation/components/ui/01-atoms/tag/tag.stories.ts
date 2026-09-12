import { COLORS_THEME } from '@app/core/shared/theme/color.registry';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { Tag } from './tag';

/**
 * `app-tag` es un átomo de solo presentación: pinta el contenido proyectado
 * (`ng-content`) dentro de un `<span>` redondeado, con un set de clases
 * translúcido (`text` + `bg-current/10`) o sólido (`bg` + `text-white`)
 * según `active`, derivado del `color`.
 */
type TagArgs = Tag & { label: string };

const meta: Meta<TagArgs> = {
  title: 'Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  render: ({ label, ...args }) => ({
    props: args,
    template: `<app-tag ${argsToTemplate(args)}>${label}</app-tag>`,
  }),
  args: {
    color: 'neutral',
    active: false,
    size: 'xs',
    label: 'Urgente',
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      options: Object.keys(COLORS_THEME),
      description: 'Clave del registro de colores del tema.',
      table: { defaultValue: { summary: 'neutral' } },
    },
    active: {
      control: 'boolean',
      description: 'Cuando es `true`, usa el set sólido (`bg` + texto blanco) en vez del translúcido.',
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['xs', 'sm'],
      table: { defaultValue: { summary: 'xs' } },
    },
    label: {
      control: 'text',
      description: 'Contenido proyectado vía `ng-content`.',
    },
  },
};

export default meta;
type Story = StoryObj<TagArgs>;

/** Estado por defecto: translúcido, color neutral, tamaño xs. */
export const Default: Story = {};

/** Set sólido (`active=true`). */
export const Active: Story = {
  args: { active: true, color: 'blue', label: 'En progreso' },
};

/** Tamaño `sm` (`text-sm` en vez de `text-xs`). */
export const Small: Story = {
  args: { size: 'sm' },
};

/** Todos los colores del registro, translúcido y sólido. */
export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;max-width:640px">
        ${Object.keys(COLORS_THEME)
          .map((c) => `<app-tag color="${c}">${c}</app-tag>`)
          .join('')}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;max-width:640px;margin-top:12px">
        ${Object.keys(COLORS_THEME)
          .map((c) => `<app-tag color="${c}" [active]="true">${c}</app-tag>`)
          .join('')}
      </div>
    `,
  }),
};
