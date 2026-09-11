import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from 'storybook/test';

import { InputSelect } from './input-select';

/**
 * `app-input-select` es un `<select>` de opción única. Extiende `InputBase`;
 * si el `value` no matchea ninguna `options`, cae al `value` de la primera
 * opción. Se envuelve en `app-input-label`. En producción se usa vía
 * `[formField]`; acá se controla con args planos.
 */
type InputSelectArgs = InputSelect;

const meta: Meta<InputSelectArgs> = {
  title: 'Atoms/FormControls/InputSelect',
  component: InputSelect,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<app-input-select ${argsToTemplate(args)} />`,
  }),
  args: {
    name: 'categoria',
    label: 'Categoría',
    options: [
      { label: 'Elige una categoría', value: 0 },
      { label: 'Casa', value: 1 },
      { label: 'Trabajo', value: 2 },
    ],
    value: 0,
    touched: false,
    invalid: false,
    errors: [],
    touch: fn(),
  },
  argTypes: {
    options: { control: 'object', description: 'Lista `{ label, value }` renderizada como `<option>`.' },
    value: { control: 'object', description: 'Valor actual del campo (`model` two-way).' },
    name: { control: 'text', description: 'Nombre del campo (requerido).' },
    label: { control: 'text', description: 'Texto del `<legend>` de `app-input-label`.' },
    touched: { control: 'boolean', description: 'Cuando es `true` y `invalid` es `true`, se pintan los errores.' },
    invalid: { control: 'boolean' },
    errors: {
      control: 'object',
      description: 'Lista `{ kind, message }` que se renderiza cuando `touched && invalid`.',
    },
    touch: { control: false, description: 'Se emite en el `blur` del select.' },
  },
};

export default meta;
type Story = StoryObj<InputSelectArgs>;

/** Estado por defecto, sin errores. */
export const Default: Story = {};

/** Con una opción elegida. */
export const WithValue: Story = {
  args: { value: 2 },
};

/** Tocado e inválido: se ve el borde rojo y el mensaje de error. */
export const Invalid: Story = {
  args: {
    touched: true,
    invalid: true,
    errors: [{ kind: 'min', message: 'Debes seleccionar una categoría' }],
  },
};
