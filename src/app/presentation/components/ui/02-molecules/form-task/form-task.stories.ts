import { OptionsService } from '@app/core/shared/service/options.service';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';
import { fn } from 'storybook/test';

import { FormTask } from './form-task';

const fakeOptionsService = {
  categoryOptions: () => [
    { label: 'Casa', value: 1 },
    { label: 'Trabajo', value: 2 },
  ],
  tagOptions: () => [
    { label: 'Urgente', value: 1 },
    { label: 'Compras', value: 2 },
  ],
};

type FormTaskArgs = FormTask;

const meta: Meta<FormTaskArgs> = {
  title: 'Molecules/FormTask',
  component: FormTask,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [{ provide: OptionsService, useValue: fakeOptionsService }],
    }),
  ],
  render: (args) => ({
    props: { ...args, eventClose: fn(), eventSubmit: fn() },
    template: `<div style="max-width:640px"><app-form-task ${argsToTemplate(args)} /></div>`,
  }),
  args: {
    title: 'Nueva tarea',
    next: 'Crear',
    fields: null,
  },
  argTypes: {
    fields: {
      control: 'object',
      description: 'Precarga el formulario para edición (`TaskZod`). `null` para alta.',
    },
  },
};

export default meta;
type Story = StoryObj<FormTaskArgs>;

/** Alta de tarea: formulario vacío. */
export const Default: Story = {};

/** Edición: `fields` precarga los valores de una tarea existente. */
export const Editar: Story = {
  args: {
    title: 'Editar tarea',
    next: 'Guardar',
    fields: {
      title: 'Comprar insumos',
      description: 'Harina, leche y huevos',
      categoria: 1,
      tags: [1],
      priority: 'alta',
      dueDate: '2026/09/20',
    },
  },
};
