import { provideRouter } from '@angular/router';
import { OptionsService } from '@app/core/shared/service/options.service';
import type { TaskViewModel } from '@app/features/task';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';
import { fn } from 'storybook/test';

import { Card } from './card';

function daysFromNow(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function buildTask(overrides: Partial<TaskViewModel> = {}): TaskViewModel {
  return {
    id: 7,
    title: 'Comprar insumos para la reunión',
    description: 'Harina, leche y huevos',
    categoria: { id: 1, name: 'Casa', color: 'blue' },
    tags: [
      { id: 1, name: 'Urgente', color: 'red' },
      { id: 2, name: 'Compras', color: 'green' },
    ],
    status: 'pendiente',
    dueDate: daysFromNow(0),
    completeDate: '',
    priority: 'alta',
    finished: false,
    ...overrides,
  };
}

const fakeOptionsService = {
  statusOptions: [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_curso', label: 'En curso' },
    { value: 'completada', label: 'Completada' },
  ],
};

/**
 * `app-card` muestra una tarea: estado (dropdown de cambio rápido), título
 * con link a su detalle, prioridad, categoría, etiquetas y fecha límite (con
 * color derivado: vencida en rojo, completada en verde, hoy/ayer/mañana según
 * `DATE_COLOR`). Requiere `Router` (usa `routerLink`/`routerLinkActive`) y
 * `OptionsService` (se reemplaza acá por un stub con solo `statusOptions`,
 * para no depender de los servicios reales respaldados por IndexedDB).
 */
type CardArgs = Card;

const meta: Meta<CardArgs> = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([]), { provide: OptionsService, useValue: fakeOptionsService }],
    }),
  ],
  render: (args) => ({
    props: { ...args, eventStatusChange: fn() },
    template: `<div style="max-width:640px"><app-card ${argsToTemplate(args)} /></div>`,
  }),
  args: {
    data: buildTask(),
  },
  argTypes: {
    data: { control: 'object', description: 'La tarea a mostrar (`TaskViewModel`).' },
  },
};

export default meta;
type Story = StoryObj<CardArgs>;

/** Tarea pendiente, vence hoy. */
export const Default: Story = {};

/** En curso. */
export const EnCurso: Story = {
  args: { data: buildTask({ status: 'en_curso' }) },
};

/** Completada: la fecha toma el color de estado completado. */
export const Completada: Story = {
  args: { data: buildTask({ status: 'completada', dueDate: daysFromNow(-5), completeDate: daysFromNow(-2) }) },
};

/** Vencida (no completada): la fecha se pinta en rojo. */
export const Vencida: Story = {
  args: { data: buildTask({ dueDate: daysFromNow(-3) }) },
};

/** Sin urgencia de fecha (ni vencida ni hoy/ayer/mañana): estilo neutral. */
export const FechaLejana: Story = {
  args: { data: buildTask({ dueDate: daysFromNow(10) }) },
};

/** Sin etiquetas. */
export const SinTags: Story = {
  args: { data: buildTask({ tags: [] }) },
};
