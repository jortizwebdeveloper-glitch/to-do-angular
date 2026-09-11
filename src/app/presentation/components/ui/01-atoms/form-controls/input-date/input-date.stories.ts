import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from 'storybook/test';

import { InputDate } from './input-date';

/**
 * `app-input-date` es un `<input type="date">`. Extiende `InputBase` y
 * guarda internamente el `value` con `/` (p. ej. `2026/09/11`), mostrando en
 * el control nativo el formato con `-` que exige `<input type="date">` (vía
 * `visibleValue`). Se envuelve en `app-input-label`. En producción se usa vía
 * `[formField]`; acá se controla con args planos.
 */
type InputDateArgs = InputDate;

const meta: Meta<InputDateArgs> = {
  title: 'Atoms/FormControls/InputDate',
  component: InputDate,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<app-input-date ${argsToTemplate(args)} />`,
  }),
  args: {
    name: 'dueDate',
    label: 'Fecha límite',
    placeholder: 'Fecha',
    value: '',
    touched: false,
    invalid: false,
    errors: [],
    touch: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Valor actual del campo, con `/` como separador (`model` two-way).',
    },
    name: { control: 'text', description: 'Nombre del campo (requerido).' },
    label: { control: 'text', description: 'Texto del `<legend>` de `app-input-label`.' },
    placeholder: { control: 'text' },
    touched: { control: 'boolean', description: 'Cuando es `true` y `invalid` es `true`, se pintan los errores.' },
    invalid: { control: 'boolean' },
    errors: {
      control: 'object',
      description: 'Lista `{ kind, message }` que se renderiza cuando `touched && invalid`.',
    },
    touch: { control: false, description: 'Se emite en el `blur` del input.' },
  },
};

export default meta;
type Story = StoryObj<InputDateArgs>;

/** Estado por defecto, sin errores. */
export const Default: Story = {};

/** Con valor cargado (`/` en el value, se ve `-` en el control nativo). */
export const WithValue: Story = {
  args: { value: '2026/09/11' },
};

/** Tocado e inválido: se ve el borde rojo y el mensaje de error. */
export const Invalid: Story = {
  args: {
    touched: true,
    invalid: true,
    errors: [{ kind: 'required', message: 'Debe asignar una fecha' }],
  },
};
