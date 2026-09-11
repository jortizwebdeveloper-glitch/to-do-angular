import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { Icon } from './icon';
import { ICON_LIST } from './icon.registry';

/**
 * `app-icon` carga bajo demanda (`resource()` + `import()` dinámico) el SVG
 * de `name` desde el registro de `icon.registry.ts` y lo inyecta como HTML
 * confiado (`bypassSecurityTrustHtml`). Si `name` no está en el registro, el
 * `resource` queda en error y no renderiza nada (`hasValue()`).
 */
type IconArgs = Icon;

const meta: Meta<IconArgs> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<app-icon class="size-8 inline-block" ${argsToTemplate(args)} />`,
  }),
  args: {
    name: 'check',
  },
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ICON_LIST,
      description: 'Clave del registro de íconos (carga async, `import()` dinámico por ícono).',
    },
  },
};

export default meta;
type Story = StoryObj<IconArgs>;

/** Un ícono suelto. */
export const Default: Story = {};

/** Todos los íconos disponibles en el registro. */
export const AllIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:32px">
        ${ICON_LIST.map(
          (name) => `
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px">
            <app-icon name="${name}" class="size-6" />
            <span>${name}</span>
          </div>`,
        ).join('')}
      </div>
    `,
  }),
};
