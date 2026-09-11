import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from 'storybook/test';

import { InputTextarea } from './input-textarea';

/**
 * `app-input-textarea` es un campo de texto multilínea. Extiende `InputBase`
 * (contrato `FormValueControl` de `@angular/forms/signals`) y se envuelve en
 * `app-input-label`. En producción se usa vía `[formField]`; acá se controla
 * con args planos para ver sus estados.
 */
type InputTextareaArgs = InputTextarea;

const meta: Meta<InputTextareaArgs> = {
  title: 'Atoms/FormControls/InputTextarea',
  component: InputTextarea,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<app-input-textarea ${argsToTemplate(args)} />`,
  }),
  args: {
    name: 'description',
    label: 'Descripción',
    placeholder: 'Describe la tarea',
    value: '',
    touched: false,
    invalid: false,
    errors: [],
    touch: fn(),
  },
  argTypes: {
    value: { control: 'text', description: 'Valor actual del campo (`model` two-way).' },
    name: { control: 'text', description: 'Nombre del campo (requerido).' },
    label: { control: 'text', description: 'Texto del `<legend>` de `app-input-label`.' },
    placeholder: { control: 'text' },
    touched: { control: 'boolean', description: 'Cuando es `true` y `invalid` es `true`, se pintan los errores.' },
    invalid: { control: 'boolean' },
    errors: {
      control: 'object',
      description: 'Lista `{ kind, message }` que se renderiza cuando `touched && invalid`.',
    },
    touch: { control: false, description: 'Se emite en el `blur` del textarea.' },
  },
};

export default meta;
type Story = StoryObj<InputTextareaArgs>;

/** Estado por defecto, sin errores. */
export const Default: Story = {};

/** Con valor cargado. */
export const WithValue: Story = {
  args: { value: 'Se necesitan 2kg de harina y 1L de leche.' },
};

/** Tocado e inválido: se ve el borde rojo y el mensaje de error. */
export const Invalid: Story = {
  args: {
    touched: true,
    invalid: true,
    errors: [{ kind: 'required', message: 'Descripción obligatoria' }],
  },
};
