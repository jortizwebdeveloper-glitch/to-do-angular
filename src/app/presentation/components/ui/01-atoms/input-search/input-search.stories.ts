import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from 'storybook/test';

import { InputSearch } from './input-search';

/**
 * `app-input-search` es un input de búsqueda con ícono y botón de limpiar.
 * Muestra internamente `valueLink` (un `linkedSignal` derivado de `value`)
 * para no depender de que el consumidor haga round-trip inmediato del
 * `[value]` tras cada `valueChange`.
 */
type InputSearchArgs = InputSearch;

const meta: Meta<InputSearchArgs> = {
  title: 'Atoms/InputSearch',
  component: InputSearch,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<div style="max-width:320px"><app-input-search ${argsToTemplate(args)} /></div>`,
  }),
  args: {
    value: '',
    valueChange: fn(),
  },
  argTypes: {
    value: { control: 'text', description: 'Valor inicial/controlado por el consumidor.' },
    valueChange: {
      control: false,
      description: 'Se emite en cada tecla y al limpiar (con `""`).',
    },
  },
};

export default meta;
type Story = StoryObj<InputSearchArgs>;

/** Vacío: sin botón de limpiar. */
export const Default: Story = {};

/** Con valor: aparece el botón de limpiar. */
export const WithValue: Story = {
  args: { value: 'tarea urgente' },
};
