import { provideRouter } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import type { TNavaside } from './navaside';
import { Navaside } from './navaside';

/**
 * `app-navaside` renderiza un menú lateral a partir de `data.items` (array u
 * objeto, ambos soportados) y `getColor` para pintar cada item. En modo
 * `default` cada item es un link con ícono (o un punto de color si no tiene
 * `icon`) y un contador opcional; en modo `tag` cada item se renderiza como
 * `app-tag`. Usa `routerLink`/`routerLinkActive`, por eso requiere `Router`
 * (se agrega vía `provideRouter([])`). Uso real en `dashboard-layout.html`.
 */
type NavasideArgs = Navaside;

const meta: Meta<NavasideArgs> = {
  title: 'Molecules/Navaside',
  component: Navaside,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideRouter([])] })],
  render: (args) => ({
    props: args,
    template: `<div style="max-width:260px"><app-navaside ${argsToTemplate(args)} /></div>`,
  }),
  args: {
    type: 'default',
    data: {
      title: 'Visita',
      items: [
        {
          id: 1,
          icon: 'calendar-1',
          name: 'Hoy',
          color: 'blue',
          link: { query: { fecha: 'hoy' } },
          count: 3,
        },
        {
          id: 2,
          icon: 'calendar',
          name: 'Próximas',
          color: 'yellow',
          link: { query: { fecha: 'proximas' } },
        },
        {
          id: 3,
          icon: 'calendar-x-2',
          name: 'Vencidas',
          color: 'red',
          link: { query: { fecha: 'vencidas' } },
          count: 1,
        },
      ],
    } satisfies TNavaside,
  },
  argTypes: {
    type: { control: 'select', options: ['default', 'tag'] },
    data: { control: 'object', description: 'Título e items del menú (`TNavaside`).' },
  },
};

export default meta;
type Story = StoryObj<NavasideArgs>;

/** Modo default: ícono + nombre + contador opcional. */
export const Default: Story = {};

/** Items sin `icon`: caen al punto de color. */
export const SinIconos: Story = {
  args: {
    data: {
      title: 'Categorías',
      items: [
        { id: 0, name: 'Todas las categorías', color: 'blue', link: { query: { categoria: 'all' } } },
        { id: 1, name: 'Casa', color: 'emerald', link: { query: { categoria: '1' } } },
        { id: 2, name: 'Trabajo', color: 'orange', link: { query: { categoria: '2' } } },
      ],
    },
  },
};

/** Modo `tag`: cada item se renderiza como `app-tag`. */
export const Tags: Story = {
  args: {
    type: 'tag',
    data: {
      title: 'Tags',
      items: {
        todo: { id: 0, name: 'Todo', color: 'blue', link: { query: { tag: 'all' } } },
        urgente: { id: 1, name: 'Urgente', color: 'red', link: { query: { tag: '1' } } },
        compras: { id: 2, name: 'Compras', color: 'green', link: { query: { tag: '2' } } },
      },
    },
  },
};
