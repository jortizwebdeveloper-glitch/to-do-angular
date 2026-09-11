import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { fn } from 'storybook/test';

import { CheckboxList } from './checkbox-list';

/**
 * `app-checkbox-list` es una lista de checkboxes de selección múltiple.
 * Extiende `InputBase<unknown[]>`: cada `input` marcado/desmarcado agrega o
 * quita su `option.value` de un `Set`. Se envuelve en `app-input-label`. En
 * producción se usa vía `[formField]`; acá se controla con args planos.
 */
type CheckboxListArgs = CheckboxList;

const meta: Meta<CheckboxListArgs> = {
  title: 'Atoms/FormControls/CheckboxList',
  component: CheckboxList,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<app-checkbox-list ${argsToTemplate(args)} />`,
  }),
  args: {
    name: 'tags',
    label: 'Etiquetas',
    options: [
      { label: 'Urgente', value: 1 },
      { label: 'Casa', value: 2 },
      { label: 'Trabajo', value: 3 },
    ],
    value: [],
    touched: false,
    invalid: false,
    errors: [],
    touch: fn(),
  },
  argTypes: {
    options: { control: 'object', description: 'Lista `{ label, value }` renderizada como checkboxes.' },
    value: { control: 'object', description: 'Valores marcados actualmente (`model` two-way, array).' },
    name: { control: 'text', description: 'Nombre del campo (requerido).' },
    label: { control: 'text', description: 'Texto del `<legend>` de `app-input-label`.' },
    touched: { control: 'boolean', description: 'Cuando es `true` y `invalid` es `true`, se pintan los errores.' },
    invalid: { control: 'boolean' },
    errors: {
      control: 'object',
      description: 'Lista `{ kind, message }` que se renderiza cuando `touched && invalid`.',
    },
    touch: { control: false, description: 'Se emite en el `change` de cada checkbox.' },
  },
};

export default meta;
type Story = StoryObj<CheckboxListArgs>;

/** Estado por defecto, sin nada marcado. */
export const Default: Story = {};

/** Con opciones ya marcadas. */
export const WithValue: Story = {
  args: { value: [1, 3] },
};

/** Tocado e inválido: se ve el borde rojo y el mensaje de error. */
export const Invalid: Story = {
  args: {
    touched: true,
    invalid: true,
    errors: [{ kind: 'minLength', message: 'Debes elegir como mínimo 1 etiqueta' }],
  },
};
