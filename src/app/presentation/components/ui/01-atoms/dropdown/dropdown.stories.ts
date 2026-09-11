import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from 'storybook/test';

import { Dropdown } from './dropdown';

/**
 * `app-dropdown` es un botón trigger (`ng-content`) que abre un listado
 * flotante (`app-dropdown-list`, posicionado con `@floating-ui/dom`) con las
 * `options` recibidas. Emite `eventChange` con el `value` elegido y se cierra
 * solo, tanto al seleccionar como al perder el foco del contenedor.
 */
type DropdownArgs = Dropdown<string> & { label: string };

const meta: Meta<DropdownArgs> = {
  title: 'Atoms/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  render: ({ label, ...args }) => ({
    props: args,
    template: `<app-dropdown ${argsToTemplate(args)}>${label}</app-dropdown>`,
  }),
  args: {
    options: [
      { label: 'Pendiente', value: 'pending' },
      { label: 'En progreso', value: 'in-progress' },
      { label: 'Completada', value: 'done' },
    ],
    label: 'Elegir estado',
    eventChange: fn(),
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Lista de opciones `{ label, value }` que se renderizan en el listado flotante.',
    },
    eventChange: {
      control: false,
      description:
        'Se emite con el `value` de la opción elegida; también cierra el listado. `argsToTemplate` detecta que es una función y genera el binding `(eventChange)="eventChange($event)"` solo — queda registrado en el panel Actions.',
    },
    label: {
      control: 'text',
      description: 'Contenido proyectado vía `ng-content` dentro del botón trigger.',
    },
  },
};

export default meta;
type Story = StoryObj<DropdownArgs>;

/** Estado por defecto: el listado permanece cerrado hasta hacer click en el trigger. */
export const Default: Story = {};

/** Pocas opciones, para ver el ancho mínimo (`min-w-24`) del listado. */
export const FewOptions: Story = {
  args: {
    options: [
      { label: 'Sí', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    label: 'Confirmar',
  },
};

/** Etiquetas largas, para ver el recorte por `max-w-60` del listado. */
export const LongLabels: Story = {
  args: {
    options: [
      { label: 'Pendiente de revisión del equipo completo', value: 'review' },
      { label: 'Asignada y en espera de recursos disponibles', value: 'waiting' },
    ],
  },
};
