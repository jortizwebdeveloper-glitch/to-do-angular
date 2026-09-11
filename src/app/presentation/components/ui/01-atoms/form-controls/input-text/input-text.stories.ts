import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from 'storybook/test';

import { InputText } from './input-text';

/**
 * `app-input-text` es un campo de texto simple. Extiende `InputBase`
 * (contrato `FormValueControl` de `@angular/forms/signals`) y se envuelve en
 * `app-input-label` (fieldset + legend + lista de errores). En producción se
 * usa vía `[formField]`; acá se controla con args planos para ver sus estados.
 */
type InputTextArgs = InputText;

const meta: Meta<InputTextArgs> = {
  title: 'Atoms/FormControls/InputText',
  component: InputText,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<app-input-text ${argsToTemplate(args)} />`,
  }),
  args: {
    name: 'title',
    label: 'Título',
    placeholder: 'Título de la tarea',
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
    touch: { control: false, description: 'Se emite en el `blur` del input.' },
  },
};

export default meta;
type Story = StoryObj<InputTextArgs>;

/** Estado por defecto, sin errores. */
export const Default: Story = {};

/** Con valor cargado. */
export const WithValue: Story = {
  args: { value: 'Comprar los insumos' },
};

/** Tocado e inválido: se ve el borde rojo y el mensaje de error. */
export const Invalid: Story = {
  args: {
    touched: true,
    invalid: true,
    errors: [{ kind: 'minLength', message: 'Mínimo 5 caracteres' }],
  },
};
